"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Capture category from form
    const formData = new FormData(e.target as HTMLFormElement);
    const category = formData.get("category");
    if (category) {
      localStorage.setItem("portal_category", category as string);
    }

    // Simulate login
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="flex min-h-screen relative bg-background text-foreground font-sans overflow-hidden">
      {/* Mobile Background Image (Visible only on small screens) */}
      <div
        className="absolute inset-0 z-0 md:hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-image.jpg')" }}
      >
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      </div>

      {/* Left Side: Login Form */}
      <div className="flex w-full flex-col justify-between p-8 md:w-1/2 lg:w-[40%] xl:w-[35%] relative z-10 md:bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
          </div>
          <ThemeToggle />
        </div>

        <div className="mx-auto w-full max-w-sm space-y-8 py-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Client Login</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your portal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:underline underline-offset-4 transition-all"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-10 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="text-sm font-medium leading-none"
              >
                Client Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 appearance-none"
                >
                  <option value="" disabled selected>Select category</option>
                  <option value="law-firm">Law Firm</option>
                  <option value="accounting-firm">Accounting Firm</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-70 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in to Dashboard"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              href="#"
              className="font-semibold text-primary hover:underline underline-offset-4"
            >
              Contact support
            </Link>{" "}
            for access.
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground/60 w-full mt-auto">
          &copy; {new Date().getFullYear()} Lovissa Consulting Ltd. All rights reserved.
        </div>
      </div>

      {/* Right Side: Abstract Hero */}
      <div className="hidden md:flex flex-1 relative bg-muted overflow-hidden">
        {/* Modern CSS Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1)_0%,transparent_50%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(0,0,0,0.02)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.02)_50%,rgba(0,0,0,0.02)_75%,transparent_75%,transparent)] bg-[length:20px_20px]" />
          {/* Using a nice abstract image from Unsplash as specified */}
          <img
            src="/bg-image.jpg"
            alt="Abstract Business Background"
            className="absolute inset-0 object-cover w-full h-full brightness-[0.8] saturate-[0.8] dark:brightness-[0.4]"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/20 via-transparent to-background/40 backdrop-blur-[2px]" />

        <div className="relative z-20 flex flex-col justify-center items-center h-full w-full p-12 text-center text-white dark:text-gray-100">
          <div className="max-w-md space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight drop-shadow-lg">Elevate Your Performance</h2>
            <p className="text-lg font-medium opacity-90 drop-shadow-md">
              Access real-time analytics, professional reports, and seamless event management in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
