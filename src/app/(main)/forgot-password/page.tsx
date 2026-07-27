"use client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-10 bg-surface-muted border-r border-border">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="font-semibold tracking-tight">Pomegrid Console</span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight leading-tight max-w-md">
            Reset your password.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">
            Enter your email address and we will send you a link to reset your password.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Pomegrid
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <LogoMark />
            <span className="font-semibold tracking-tight">
              Pomegrid Console
            </span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {submitted ? "Check your email for a reset link." : "Enter your email to receive a reset link."}
          </p>

          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-4"
            >
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-medium text-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@pomegrid.com"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-md bg-foreground text-background text-sm font-medium hover:bg-foreground/90 transition disabled:opacity-50 mt-4"
              >
                {isLoading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          ) : (
            <div className="mt-8 space-y-4">
              <button
                onClick={() => setSubmitted(false)}
                className="w-full h-10 rounded-md border border-input bg-background text-foreground text-sm font-medium hover:bg-surface-muted transition"
              >
                Try another email
              </button>
            </div>
          )}

          <p className="mt-8 text-sm text-muted-foreground text-center">
            Remember your password?{" "}
            <Link href="/" className="text-info hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="h-7 w-7 rounded-md bg-linear-to-br from-brand to-info flex items-center justify-center text-white text-sm font-bold">
      P
    </div>
  );
}
