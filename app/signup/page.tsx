"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { validateSignUpForm, sanitizeInput } from "@/lib/validation";

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
    businessName: "",
    gstNumber: "",
    city: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    // Validate step 1 fields
    const step1Errors: Record<string, string> = {};

    if (!businessType) {
      step1Errors.businessType = 'Please select a business type';
    }

    if (!formData.fullName.trim()) {
      step1Errors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      step1Errors.fullName = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      step1Errors.email = 'Email is required';
    } else {
      const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
      if (!emailRegex.test(formData.email.trim())) {
        step1Errors.email = 'Invalid email format';
      }
    }

    if (!formData.mobileNumber.trim()) {
      step1Errors.mobileNumber = 'Mobile number is required';
    } else {
      const digitsOnly = formData.mobileNumber.replace(/\D/g, '');
      if (digitsOnly.length !== 10 && !(digitsOnly.length === 12 && digitsOnly.startsWith('91'))) {
        step1Errors.mobileNumber = 'Invalid mobile number (must be 10 digits)';
      }
    }

    if (!formData.password) {
      step1Errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      step1Errors.password = 'Password must be at least 8 characters';
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        step1Errors.password = 'Password must contain uppercase, lowercase, and number';
      }
    }

    if (!formData.confirmPassword) {
      step1Errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      step1Errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(step1Errors).length > 0) {
      setFieldErrors(step1Errors);
      setIsLoading(false);
      return;
    }

    // Proceed to step 2
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    // Comprehensive validation with sanitization
    const validation = validateSignUpForm({
      fullName: formData.fullName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      businessType: businessType,
      businessName: formData.businessName,
      gstNumber: formData.gstNumber,
      city: formData.city,
    });

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      setError('Please fix the errors below');
      setIsLoading(false);
      return;
    }

    // Use sanitized data for signup
    const { error: signUpError } = await signUp({
      email: validation.sanitizedData.email,
      password: formData.password, // Password is not sanitized as it's hashed
      fullName: validation.sanitizedData.fullName,
      mobileNumber: validation.sanitizedData.mobileNumber,
      businessType: businessType as 'retailer' | 'wholesaler',
      businessName: validation.sanitizedData.businessName,
      gstNumber: validation.sanitizedData.gstNumber,
      city: validation.sanitizedData.city,
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
    } else {
      setSuccess(true);
      setIsLoading(false);
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-6">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-3 text-center">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Create your account
            </h1>
            <p className="text-slate-600 text-lg font-normal">
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
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Business Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">I am a<span className="text-red-500">*</span></Label>
                {fieldErrors.businessType && (
                  <p className="text-xs text-red-600">{fieldErrors.businessType}</p>
                )}
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
                  className={`h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${
                    fieldErrors.fullName ? 'border-red-500' : ''
                  }`}
                />
                {fieldErrors.fullName && (
                  <p className="text-xs text-red-600">{fieldErrors.fullName}</p>
                )}
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
                  className={`h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${
                    fieldErrors.email ? 'border-red-500' : ''
                  }`}
                />
                {fieldErrors.email && (
                  <p className="text-xs text-red-600">{fieldErrors.email}</p>
                )}
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
                  className={`h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${
                    fieldErrors.mobileNumber ? 'border-red-500' : ''
                  }`}
                />
                {fieldErrors.mobileNumber && (
                  <p className="text-xs text-red-600">{fieldErrors.mobileNumber}</p>
                )}
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
                  className={`h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${
                    fieldErrors.password ? 'border-red-500' : ''
                  }`}
                />
                {fieldErrors.password && (
                  <p className="text-xs text-red-600">{fieldErrors.password}</p>
                )}
                <p className="text-xs text-slate-500">Must be 8+ characters with uppercase, lowercase, and number</p>
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
                  className={`h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${
                    fieldErrors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-600">{fieldErrors.confirmPassword}</p>
                )}
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
              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600">Account created successfully! Redirecting to sign in...</p>
                </div>
              )}

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
                    name="businessName"
                    type="text"
                    placeholder="Your Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    className={`h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${
                      fieldErrors.businessName ? 'border-red-500' : ''
                    }`}
                  />
                  {fieldErrors.businessName && (
                    <p className="text-xs text-red-600">{fieldErrors.businessName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber" className="text-sm font-semibold">
                    GST Number<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="gstNumber"
                    name="gstNumber"
                    type="text"
                    placeholder="27AABCT1234H1Z0"
                    value={formData.gstNumber}
                    onChange={handleChange}
                    required
                    maxLength={15}
                    className={`h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${
                      fieldErrors.gstNumber ? 'border-red-500' : ''
                    }`}
                  />
                  {fieldErrors.gstNumber && (
                    <p className="text-xs text-red-600">{fieldErrors.gstNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-semibold">
                    City<span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={`h-11 border-slate-300 focus:border-slate-900 focus:ring-slate-900 ${
                      fieldErrors.city ? 'border-red-500' : ''
                    }`}
                  />
                  {fieldErrors.city && (
                    <p className="text-xs text-red-600">{fieldErrors.city}</p>
                  )}
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
