"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
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
      <section className="relative min-h-[80vh] flex items-center px-4 py-12 overflow-hidden bg-slate-50">

        <div className="max-w-7xl w-full mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6 animate-fade-in-up">
              {/* Badge */}
              <Badge variant="secondary" className="inline-flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-100 border-slate-200 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                Trusted by 10,000+ businesses
              </Badge>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900">
                India&apos;s leading B2B marketplace
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-xl">
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
            <div className="relative">
              <Card className="overflow-hidden border-slate-200">
                <CardContent className="p-0">
                  {/* Placeholder for dashboard/product image */}
                  <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center p-4">
                    <Card className="w-full h-full">
                      <CardContent className="p-4 flex flex-col gap-3">
                        {/* Mock Dashboard UI */}
                        <div className="flex items-center justify-between">
                          <div className="h-6 w-24 bg-slate-300 rounded"></div>
                          <div className="h-6 w-6 bg-slate-300 rounded"></div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <Card className="bg-slate-200 border-0 h-16"></Card>
                          <Card className="bg-slate-200 border-0 h-16"></Card>
                          <Card className="bg-slate-200 border-0 h-16"></Card>
                        </div>
                        <div className="space-y-2 pt-2">
                          <div className="h-3 bg-slate-200 rounded w-full"></div>
                          <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                          <div className="h-3 bg-slate-200 rounded w-4/6"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Card className="bg-slate-200 border-0 h-20"></Card>
                          <Card className="bg-slate-200 border-0 h-20"></Card>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
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
