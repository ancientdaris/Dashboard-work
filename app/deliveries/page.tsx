"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  RefreshCw, 
  Bell,
  Edit,
  Printer,
  FileDown,
  RotateCw
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DeliveriesPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
      <div className="flex-1 space-y-6 p-8 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Deliveries & Shipment Tracking</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all your deliveries in real-time
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-2 px-3 py-1.5 bg-white border-gray-200">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium text-gray-700">Live Updates</span>
            </Badge>
            <Button variant="outline" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white border-b border-gray-200 w-full justify-start rounded-none h-auto p-0">
            <TabsTrigger 
              value="overview" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-3"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="all-deliveries"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-3"
            >
              All Deliveries
            </TabsTrigger>
            <TabsTrigger 
              value="track-delivery"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-3"
            >
              Track Delivery
            </TabsTrigger>
            <TabsTrigger 
              value="analytics"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-6 py-3"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            {/* Failed to load delivery data message */}
            <Card className="p-12 flex flex-col items-center justify-center transition-all hover:shadow-md">
              <p className="text-gray-500 mb-4">Failed to load delivery data</p>
              <Button 
                onClick={handleRefresh}
              >
                Retry
              </Button>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start gap-3 h-auto py-4 px-4 bg-white hover:bg-gray-50 border-gray-200"
                >
                  <Edit className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Bulk Update Status</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start gap-3 h-auto py-4 px-4 bg-white hover:bg-gray-50 border-gray-200"
                >
                  <Printer className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Print Shipping Labels</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start gap-3 h-auto py-4 px-4 bg-white hover:bg-gray-50 border-gray-200"
                >
                  <FileDown className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Export Delivery Report</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-start gap-3 h-auto py-4 px-4 bg-white hover:bg-gray-50 border-gray-200"
                >
                  <RotateCw className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Sync Tracking Status</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="all-deliveries" className="mt-6">
            <Card className="p-8 transition-all hover:shadow-md">
              <p className="text-center text-gray-500">All deliveries will be displayed here</p>
            </Card>
          </TabsContent>

          <TabsContent value="track-delivery" className="mt-6">
            <Card className="p-8 transition-all hover:shadow-md">
              <p className="text-center text-gray-500">Track delivery functionality will be available here</p>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card className="p-8 transition-all hover:shadow-md">
              <p className="text-center text-gray-500">Analytics and reports will be displayed here</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
}
