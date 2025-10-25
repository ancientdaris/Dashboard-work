"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 p-4 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium text-purple-600">404 error</p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          We can&apos;t find that page
        </h1>
        <p className="text-muted-foreground">
          Sorry, the page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button 
            variant="outline" 
            asChild
          >
            <Link href="#" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">Take me home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}