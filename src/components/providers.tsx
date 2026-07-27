"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useCurrentUser, useCurrentUserRole } from "@/query/auth";
import { useUserStore } from "@/store/store";
import { useRouter, usePathname } from "next/navigation";

function AuthLoader({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const setAuth = useUserStore((state) => state.setAuth);
  
  // Exclude login from auth checks
  const isPublicPage = pathname === "/";

  const { data: user, isLoading: isUserLoading, isError: isUserError } = useCurrentUser();
  
  // Only fetch role if user fetch succeeds
  const { data: role, isLoading: isRoleLoading, isError: isRoleError } = useCurrentUserRole(!!user);

  useEffect(() => {
    if (user && role) {
      setAuth(user, role);
    }
  }, [user, role, setAuth]);

  if (isPublicPage) {
    return <>{children}</>;
  }

  if (isUserLoading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
        Initializing session...
      </div>
    );
  }

  if (isUserError || isRoleError || (!user && !isPublicPage)) {
    // If getting user fails, or role fails, push to login
    // Our middleware handles initial protection, this handles runtime expiry
    if (typeof window !== 'undefined') {
      router.push("/login");
    }
    return null; // Return null to prevent rendering protected content while redirecting
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
