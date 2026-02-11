"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/hooks/useAuth";
import { validateSignInForm } from "@/lib/validation";
import { Package, BarChart3, Users, Shield } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { signIn, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setFieldErrors({});

    const validation = validateSignInForm({ email, password });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setError("Please fix the errors below");
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await signIn({
      email: validation.sanitizedData.email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-t from-slate-700/30 to-transparent rounded-full blur-3xl" />

        <div className="relative flex flex-col justify-between w-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-slate-900 font-bold text-base">O</span>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              OSAS
            </span>
          </div>

          {/* Center content */}
          <div className="flex flex-col items-center text-center">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/10">
              <span className="text-white font-bold text-5xl tracking-tighter">
                O
              </span>
            </div>
            <h2 className="text-3xl font-semibold text-white mb-3 tracking-tight">
              Admin Panel
            </h2>
            <p className="text-slate-400 text-base max-w-sm">
              Manage inventory, orders, retailers, and business operations from one place.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {[
                { icon: Package, label: "Inventory" },
                { icon: BarChart3, label: "Analytics" },
                { icon: Users, label: "Retailers" },
                { icon: Shield, label: "Admin Only" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                  <item.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-300 font-medium">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-500 text-center">
            Online Sales & Supply System — Admin Access Only
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="font-bold text-base tracking-tight">OSAS Admin</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm space-y-8">
            {/* Header */}
            <div className="space-y-2">
              <h1
                className="text-2xl md:text-3xl font-semibold tracking-tight"
                style={{
                  fontFamily:
                    "var(--font-dm-sans), var(--font-geist-sans), sans-serif",
                }}
              >
                Admin Sign In
              </h1>
              <p className="text-slate-500 text-sm">
                Enter your admin credentials to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSignIn} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-sm text-emerald-600">
                    Sign in successful! Redirecting...
                  </p>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.email;
                        return next;
                      });
                    }
                  }}
                  required
                  className={`h-11 rounded-xl border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
                    fieldErrors.email ? "border-red-400" : ""
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-500">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-slate-400 hover:text-slate-900 transition"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => {
                        const next = { ...prev };
                        delete next.password;
                        return next;
                      });
                    }
                  }}
                  required
                  className={`h-11 rounded-xl border-slate-200 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 ${
                    fieldErrors.password ? "border-red-400" : ""
                  }`}
                />
                {fieldErrors.password && (
                  <p className="text-xs text-red-500">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                  className="border-slate-300 rounded"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-slate-500 cursor-pointer"
                >
                  Remember me for 30 days
                </Label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            {/* Footer note */}
            <p className="text-xs text-slate-400 text-center">
              This portal is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
