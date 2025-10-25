"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type BusinessType = "retailer" | "wholesaler" | null;

export default function SignUpPage() {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState<BusinessType>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (step === 1) {
        setStep(2);
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle final submission
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Create your OSAS account
            </h1>
            <p className="text-slate-600 font-normal">
              Join thousands of businesses on India&apos;s leading B2B platform
            </p>
          </div>

          {/* Step Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-900">Step {step} of 2</span>
              <div className="flex gap-2">
                <div className={`h-1 w-12 rounded-full transition-colors ${step >= 1 ? "bg-slate-900" : "bg-slate-200"}`}></div>
                <div className={`h-1 w-12 rounded-full transition-colors ${step >= 2 ? "bg-slate-900" : "bg-slate-200"}`}></div>
              </div>
            </div>
            <p className="text-sm text-slate-600 font-normal">
              {step === 1 ? "Personal Details" : "Business Information"}
            </p>
          </div>

          {/* Form */}
          {step === 1 ? (
            <form onSubmit={handleContinue} className="space-y-5">
              {/* Business Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">I am a<span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setBusinessType("retailer")}
                    className={`flex-1 px-3 py-2 rounded-md border-2 transition-all text-center text-sm font-semibold ${
                      businessType === "retailer"
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    Retailer
                  </button>
                  <button
                    type="button"
                    onClick={() => setBusinessType("wholesaler")}
                    className={`flex-1 px-3 py-2 rounded-md border-2 transition-all text-center text-sm font-semibold ${
                      businessType === "wholesaler"
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    Wholesaler
                  </button>
                </div>
              </div>

              {/* Full Name Field */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold">
                  Full Name<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">
                  Email Address<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Mobile Number Field */}
              <div className="space-y-2">
                <Label htmlFor="mobileNumber" className="text-sm font-semibold">
                  Mobile Number<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.mobileNumber}
                  onChange={handleChange}
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
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-semibold">
                  Confirm Password<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                />
              </div>

              {/* Continue Button */}
              <Button
                type="submit"
                disabled={isLoading || !businessType}
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold disabled:opacity-50"
              >
                {isLoading ? "Processing..." : "Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Step 2 Content - Business Information */}
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm font-semibold text-slate-900">Account Type</p>
                  <p className="text-sm text-slate-600 font-normal capitalize mt-1">
                    {businessType === "retailer" ? "Retailer" : "Wholesaler"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName" className="text-sm font-semibold">
                    Business Name<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your Business Name"
                    required
                    className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber" className="text-sm font-semibold">
                    GST Number<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="gstNumber"
                    type="text"
                    placeholder="27AABCT1234H1Z0"
                    required
                    className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold">
                    City<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Mumbai"
                    required
                    className="h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900"
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1 h-11 border-slate-300 text-slate-900 hover:bg-slate-50 font-semibold"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold disabled:opacity-50"
                >
                  {isLoading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-slate-600 font-normal">
              Already have an account?{" "}
              <Link href="/signin" className="text-slate-900 hover:underline font-semibold">
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
