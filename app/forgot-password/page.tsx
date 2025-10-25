"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setIsLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
      setEmail("");
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Back to Sign In Link */}
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">
              Forgot your password?
            </h1>
            <p className="text-slate-600">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">
                  Password reset link sent! Please check your email inbox.
                </p>
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
                className="h-11 border-2 border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
            >
              {isLoading ? "Sending..." : "Send reset link"}
            </Button>
          </form>

          {/* Additional Help */}
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">
              Remember your password?{" "}
              <Link
                href="/signin"
                className="text-slate-900 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="space-y-2 text-center">
            <p className="text-sm text-slate-600">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@osas.com"
                className="text-slate-900 font-semibold hover:underline"
              >
                support@osas.com
              </a>
            </p>
            <p className="text-xs text-slate-500">
              © 2024 OSAS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
