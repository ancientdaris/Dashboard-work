"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Construction } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/more')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to More
              </Button>
            </div>

            {/* Coming Soon Card */}
            <Card className="border-none shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  {icon || <Construction className="h-16 w-16 text-blue-500" />}
                </div>
                <CardTitle className="text-3xl">{title}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <Construction className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-gray-600">
                    This feature is currently under development. We're working hard to bring it to you soon!
                  </p>
                </div>
                <div className="pt-4">
                  <Button onClick={() => router.push('/more')} className="w-full sm:w-auto">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to More Menu
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
