"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download,
  Filter,
  Printer,
  Share2,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  BarChart3,
  DollarSign,
  Package,
  AlertTriangle,
  XCircle,
  FileText,
  Smile,
  RotateCcw
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export default function ReportsPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
       

        {/* Main Content */}
        <div className="p-8 space-y-6">
          {/* Business Analytics Section */}
          <Card className="transition-all hover:shadow-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Reports & Analytics</h2>
                <p className="text-muted-foreground mt-1">
              Business insights and analytics for your b2b2c platform operations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="text-xs">Select dates</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-xs">Filters</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="text-xs">Export</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Printer className="h-4 w-4" />
                  <span className="text-xs">Print</span>
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="bg-transparent border-b border-gray-200 w-full justify-start rounded-none h-auto p-0 mb-6">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-sm"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="sales-reports"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-sm"
                >
                  Sales Reports
                </TabsTrigger>
                <TabsTrigger 
                  value="inventory"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-sm"
                >
                  Inventory
                </TabsTrigger>
                <TabsTrigger 
                  value="financial"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-sm"
                >
                  Financial
                </TabsTrigger>
                <TabsTrigger 
                  value="gst-reports"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-sm"
                >
                  GST Reports
                </TabsTrigger>
                <TabsTrigger 
                  value="performance"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none px-4 py-2 text-sm"
                >
                  Performance
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹1,25,00,000.00</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +24% vs last period
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900">1,245</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% vs last period
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Active Customers</p>
                    <p className="text-2xl font-bold text-gray-900">856</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +8% vs last period
                    </p>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Profit Margin</p>
                    <p className="text-2xl font-bold text-gray-900">16.8%</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +3% vs last period
                    </p>
                  </Card>
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Revenue Trend */}
                  <Card className="p-6 bg-white border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Revenue Trend</h3>
                      <p className="text-xs text-gray-600">Last 30 days revenue performance</p>
                    </div>
                    <div className="h-48 flex items-end gap-2">
                      {/* Simple bar chart visualization */}
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '30%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '45%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '60%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '40%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '75%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '55%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '85%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '70%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '50%' }}></div>
                      <div className="flex-1 bg-blue-500 rounded-t" style={{ height: '65%' }}></div>
                    </div>
                  </Card>

                  {/* Top States by Revenue */}
                  <Card className="p-6 bg-white border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Top States by Revenue</h3>
                      <p className="text-xs text-gray-600">Revenue breakdown by state</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Maharashtra</span>
                          <span className="font-medium text-gray-900">₹45,00,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Gujarat</span>
                          <span className="font-medium text-gray-900">₹32,00,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '53%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Karnataka</span>
                          <span className="font-medium text-gray-900">₹28,00,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '47%' }}></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Top Products */}
                  <Card className="p-6 bg-white border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Top Products</h3>
                      <p className="text-xs text-gray-600">Best performing products by revenue</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Rice (Premium Basmati)</p>
                          <p className="text-xs text-gray-500">Qty: 5,000</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹25,00,000.00</p>
                          <p className="text-xs text-green-600">+8.5%</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Wheat Flour (Ashirvad)</p>
                          <p className="text-xs text-gray-500">Qty: 3,800</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹18,00,000.00</p>
                          <p className="text-xs text-red-600">-2.1%</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Sugar (Refined)</p>
                          <p className="text-xs text-gray-500">Qty: 4,200</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹12,00,000.00</p>
                          <p className="text-xs text-green-600">+5.7%</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Financial Summary */}
                  <Card className="p-6 bg-white border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Financial Summary</h3>
                      <p className="text-xs text-gray-600">Profit & Loss overview</p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Revenue (Sales)</span>
                          <span className="font-medium text-gray-900">1,25,00,000 / 2,00,00,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '62.5%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Gross Profit Margin</span>
                          <span className="font-medium text-gray-900">32,00,000 / 1,32,00,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '24.2%' }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">Net Profit Margin</span>
                          <span className="font-medium text-gray-900">21,00,000 / 1,32,00,000</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15.9%' }}></div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="sales-reports" className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹1,25,00,000.00</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          15.5% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Total Orders</p>
                        <p className="text-2xl font-bold text-gray-900">1,245</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          8.2% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Average Order Value</p>
                        <p className="text-2xl font-bold text-gray-900">₹10,040.16</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          3.1% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Growth Rate</p>
                        <p className="text-2xl font-bold text-gray-900">15.5%</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          2.3% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sales by State and Product Performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Sales by State */}
                  <Card className="p-6 bg-white border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Sales by State</h3>
                      <p className="text-xs text-gray-600">Geographic distribution of sales</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Maharashtra</p>
                          <p className="text-xs text-gray-500">350 orders • 125 customers</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹35,00,000.00</p>
                          <p className="text-xs text-green-600">GST: ₹6,30,000.00</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Gujarat</p>
                          <p className="text-xs text-gray-500">280 orders • 98 customers</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹28,00,000.00</p>
                          <p className="text-xs text-green-600">GST: ₹5,04,000.00</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Karnataka</p>
                          <p className="text-xs text-gray-500">215 orders • 87 customers</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">₹22,00,000.00</p>
                          <p className="text-xs text-green-600">GST: ₹3,96,000.00</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Product Performance */}
                  <Card className="p-6 bg-white border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Product Performance</h3>
                      <p className="text-xs text-gray-600">Top selling products analysis</p>
                    </div>
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-2">₹25,00,000.00</p>
                        <p className="text-sm font-medium text-gray-900">Rice (Premium B...</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-2">₹18,00,000.00</p>
                        <p className="text-sm font-medium text-gray-900">Wheat Flour (As...</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-2">₹12,00,000.00</p>
                        <p className="text-sm font-medium text-gray-900">Sugar (Refined)...</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Total Products</p>
                        <p className="text-2xl font-bold text-gray-900">2,456</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Low Stock Items</p>
                        <p className="text-2xl font-bold text-gray-900">45</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Out of Stock</p>
                        <p className="text-2xl font-bold text-gray-900">12</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <XCircle className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Inventory Value</p>
                        <p className="text-2xl font-bold text-gray-900">₹4,50,00,000.00</p>
                        
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Inventory Status */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">Inventory Status</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Healthy Stock</span>
                        <span className="text-gray-600">2,399 / 2,456</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '97.7%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Low Stock Alert</span>
                        <span className="text-gray-600">45 / 2,456</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '1.8%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Out of Stock</span>
                        <span className="text-gray-600">12 / 2,456</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '0.5%' }}></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹1,25,00,000.00</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          15.5% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Gross Profit</p>
                        <p className="text-2xl font-bold text-gray-900">₹33,00,000.00</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          12.3% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Net Profit</p>
                        <p className="text-2xl font-bold text-gray-900">₹21,00,000.00</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          8.7% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Profit Margin</p>
                        <p className="text-2xl font-bold text-gray-900">16.8%</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          2.1% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Cash Flow and Financial Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cash Flow Analysis */}
                  <Card className="p-6 bg-white border-gray-200">
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-900">Cash Flow Analysis</h3>
                      <p className="text-xs text-gray-600">Cash inflow vs outflow trends</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        {/* Donut Chart representation */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="20"
                            strokeDasharray="125.6 251.2"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="20"
                            strokeDasharray="125.6 251.2"
                            strokeDashoffset="-125.6"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-xl font-bold text-gray-900">₹21,00,000.00</p>
                          <p className="text-xs text-gray-600">Net Profit</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Financial Metrics */}
                  <Card className="p-6 bg-white border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-sm font-semibold text-gray-900">Financial Metrics</h3>
                      <p className="text-xs text-gray-600">Key financial performance indicators</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Accounts Receivable</span>
                        <span className="text-sm font-semibold text-gray-900">₹35,00,000.00</span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Accounts Payable</span>
                        <span className="text-sm font-semibold text-gray-900">₹18,00,000.00</span>
                      </div>
                      <div className="flex items-center justify-between py-3 bg-green-50 px-3 rounded">
                        <span className="text-sm text-gray-600">GST Collected</span>
                        <span className="text-sm font-semibold text-gray-900">₹22,50,000.00</span>
                      </div>
                      <div className="flex items-center justify-between py-3 bg-blue-50 px-3 rounded">
                        <span className="text-sm text-gray-600">GST Paid</span>
                        <span className="text-sm font-semibold text-gray-900">₹16,56,000.00</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="gst-reports" className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">GST Collected</p>
                        <p className="text-2xl font-bold text-gray-900">₹22,50,000.00</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">GST Paid</p>
                        <p className="text-2xl font-bold text-gray-900">₹16,56,000.00</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Net GST Liability</p>
                        <p className="text-2xl font-bold text-gray-900">₹5,94,000.00</p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* GST Compliance Summary */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900">GST Compliance Summary</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* GSTR-1 Summary */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">GSTR-1 Summary</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Total Taxable Value</span>
                          <span className="text-sm font-semibold text-gray-900">₹1,04,16,667.00</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Total Tax Amount</span>
                          <span className="text-sm font-semibold text-gray-900">₹22,50,000.00</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">Number of Invoices</span>
                          <span className="text-sm font-semibold text-gray-900">1,245</span>
                        </div>
                      </div>
                    </div>

                    {/* State-wise GST Breakdown */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-4">State-wise GST Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Maharashtra</span>
                          <span className="text-sm font-semibold text-gray-900">₹6,30,000.00</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                          <span className="text-sm text-gray-600">Gujarat</span>
                          <span className="text-sm font-semibold text-gray-900">₹5,04,000.00</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-600">Karnataka</span>
                          <span className="text-sm font-semibold text-gray-900">₹3,96,000.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Order Fulfillment Rate</p>
                        <p className="text-2xl font-bold text-gray-900">94.5%</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          2.1% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Avg Delivery Time</p>
                        <p className="text-2xl font-bold text-gray-900">2.3 days</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Customer Satisfaction</p>
                        <p className="text-2xl font-bold text-gray-900">4.6</p>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          0.2% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Smile className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 bg-white border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600">Return Rate</p>
                        <p className="text-2xl font-bold text-gray-900">2.1%</p>
                        <p className="text-xs text-red-600 flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          0.5% vs last period
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <RotateCcw className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Key Performance Indicators */}
                <Card className="p-6 bg-white border-gray-200">
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900">Key Performance Indicators</h3>
                    <p className="text-xs text-gray-600">Business performance metrics overview</p>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Order Fulfillment Rate (Target: 95%)</span>
                        <span className="text-gray-600">94.5 / 100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.5%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">On-time Delivery Rate (Target: 90%)</span>
                        <span className="text-gray-600">89.2 / 100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89.2%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Customer Satisfaction Score (Target: 4.5/5)</span>
                        <span className="text-gray-600">4.6 / 5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">Order Accuracy Rate (Target: 98%)</span>
                        <span className="text-gray-600">97.9 / 100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '97.9%' }}></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
