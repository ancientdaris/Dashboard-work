"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="max-w-full mx-auto px-10 h-14 flex items-center justify-between">
          <Link href="/" className="font-bold text-base tracking-tight">
            OSAS
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="text-slate-600 hover:text-slate-900">
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button size="sm" asChild className="bg-slate-900 hover:bg-slate-800 text-white">
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-14 pb-16 bg-slate-50">
        <div className="w-full h-[calc(100vh-7.5rem)] mx-auto relative z-10 overflow-hidden">
          <div className="h-full grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Content */}
            <div className="space-y-3 animate-fade-in-up px-6 md:pl-10 flex flex-col justify-center">
              {/* Badge */}
              <Badge variant="secondary" className=" inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-100 border-slate-200 text-slate-700"style={{ width: "218px" }} >
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900 " ></div>
                Trusted by 10,000+ businesses
              </Badge>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium  tracking-tight leading-[1.1] text-slate-900" style={{ fontFamily: 'var(--font-dm-sans), var(--font-geist-sans), sans-serif' }}>
                India&apos;s leading B2B marketplace
              </h1>

              {/* Description */}
              <p className="text-base md:text-md text-slate-600 font-normal leading-relaxed max-w-xl">
                Connect wholesalers and retailers across India. Streamline your supply chain with GST-compliant invoicing, real-time inventory, and seamless payments.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 h-10 text-sm">
                  <Link href="/signup" className="flex items-center gap-2">
                    Start your business
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border border-slate-300 text-slate-900 hover:bg-slate-100 font-semibold px-6 h-10 text-sm">
                  <Link href="/signin">Sign in</Link>
                </Button>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 pt-4">
                <Card className="inline-flex items-center gap-1.5 px-3 py-1.5 border-slate-200">
                  <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-slate-700 font-semibold">Real-time Inventory</span>
                </Card>
                <Card className="inline-flex items-center gap-1.5 px-3 py-1.5 border-slate-200">
                  <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-slate-700 font-semibold">GST Compliant</span>
                </Card>
                <Card className="inline-flex items-center gap-1.5 px-3 py-1.5 border-slate-200">
                  <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs text-slate-700 font-semibold">Seamless Payments</span>
                </Card>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 w-full h-full">
                <img
                  src="/images/image1.png"
                  alt="Dashboard preview"
                  className="w-full h-full object-cover object-left"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="space-y-1 text-center">
            <p className="text-sm font-semibold tracking-tight">OSAS - Online Sales and Supply System</p>
            <p className="text-xs text-slate-600 font-normal">
              Connecting wholesalers and retailers across India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
