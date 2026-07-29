"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useCurrentUser, useCurrentUserRole } from "@/query/auth";
import { useUserStore } from "@/store/store";
import { useRouter, usePathname } from "next/navigation";
import { hasSession } from "@/lib/useClient";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setAuth = useUserStore((state) => state.setAuth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Exclude login from auth checks
  const isPublicPage =
    pathname === "/" ||
    pathname === "/not-found" ||
    pathname.startsWith("/forgot-password");
  const isSessionActive = mounted ? hasSession() : false;

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUser(isSessionActive);
  
  // Only fetch role if user fetch succeeds
  const { data: role, isLoading: isRoleLoading, isError: isRoleError } = useCurrentUserRole(!!user);

  const shouldRedirect = !isPublicPage && mounted && !isUserLoading && !isRoleLoading && (isUserError || isRoleError || !user);

  useEffect(() => {
    if (user && role) {
      setAuth(user, role);
    }
  }, [user, role, setAuth]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push("/");
    }
  }, [shouldRedirect, router]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (!mounted) {
    return null;
  }

  if (isUserLoading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Initializing session...
      </div>
    );
  }

  if (shouldRedirect) {
    return null; 
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthLoader>{children}</AuthLoader>
    </QueryClientProvider>
  );
}
