"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/hooks/useAuth";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const { error: signInError } = await signIn({ email, password });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      // Show success message before redirect
      setSuccess(true);
      // Keep loading state while redirecting
      // Navigation is handled in the useAuth hook
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Sign in to OSAS
            </h1>
            <p className="text-slate-600 font-normal">
              Welcome back! Please sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">Sign in successful! Redirecting to dashboard...</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email address<span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Password<span className="text-red-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-slate-300"
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-sm text-slate-600 hover:text-slate-900 font-normal transition"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center space-y-2">
            <p className="text-slate-600 font-normal">
              Don&apos;t have an account?
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full h-11 border-slate-300 text-slate-900 hover:bg-slate-50 font-semibold"
            >
              <Link href="/signup">Create new account</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-2 text-center">
            <p className="font-semibold tracking-tight">OSAS - Online Sales and Supply System</p>
            <p className="text-sm text-slate-600 font-normal">
              Connecting wholesalers and retailers across India
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
