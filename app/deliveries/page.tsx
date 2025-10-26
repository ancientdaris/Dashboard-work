"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  RefreshCw, 
  Bell,
  Edit,
  Printer,
  FileDown,
  RotateCw,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  Calendar,
  TrendingUp,
  AlertCircle,
  BarChart3
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
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Deliveries', value: '248', change: '↑ 12%', icon: Package, bg: 'bg-blue-100', text: 'text-blue-600', desc: 'This month' },
                { label: 'In Transit', value: '42', change: 'Active', icon: Truck, bg: 'bg-orange-100', text: 'text-orange-600', desc: 'Currently shipping' },
                { label: 'Delivered', value: '198', change: '↑ 8%', icon: CheckCircle2, bg: 'bg-green-100', text: 'text-green-600', desc: 'Successfully completed' },
                { label: 'Pending', value: '8', change: 'Awaiting', icon: Clock, bg: 'bg-yellow-100', text: 'text-yellow-600', desc: 'Ready to ship' },
              ].map((stat) => (
                <Card key={stat.label} className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardContent className="p-0">
                      <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        <span className="text-sm font-medium text-green-600">{stat.change}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.desc}</p>
                    </CardContent>
                    <div className={`rounded-lg ${stat.bg} p-2.5`}>
                      <stat.icon className={`h-5 w-5 ${stat.text}`} />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Recent Deliveries */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Recent Deliveries</h2>
                    <p className="text-sm text-muted-foreground">Latest shipment updates</p>
                  </div>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { id: 'DEL-001', customer: 'Raj Traders', status: 'Delivered', date: '2 hours ago' },
                    { id: 'DEL-002', customer: 'Mumbai Retail Store', status: 'In Transit', date: '5 hours ago' },
                    { id: 'DEL-003', customer: 'Delhi Wholesale', status: 'Out for Delivery', date: '1 day ago' },
                    { id: 'DEL-004', customer: 'Pune Distributors', status: 'Pending', date: '2 days ago' },
                  ].map((delivery) => (
                    <div key={delivery.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-gray-100 p-2">
                          <Package className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{delivery.id}</p>
                          <p className="text-sm text-muted-foreground">{delivery.customer}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{delivery.status}</Badge>
                        <span className="text-sm text-muted-foreground">{delivery.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
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

          <TabsContent value="all-deliveries" className="mt-6 space-y-4">
            {/* Search and Filters */}
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search by delivery ID, customer name..." className="pl-10" />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Filter by Date
                  </Button>
                  <Button variant="outline">All Status</Button>
                </div>
              </CardContent>
            </Card>

            {/* Deliveries List */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">All Deliveries</h2>
                    <p className="text-sm text-muted-foreground">Manage all your shipments</p>
                  </div>
                  <Button className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Create Delivery
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 'DEL-2024-001', customer: 'Raj Traders', address: 'Mumbai, Maharashtra', carrier: 'Blue Dart', tracking: 'BD123456789', status: 'Delivered', date: 'Jan 24, 2024' },
                    { id: 'DEL-2024-002', customer: 'Mumbai Retail Store', address: 'Pune, Maharashtra', carrier: 'DTDC', tracking: 'DT987654321', status: 'In Transit', date: 'Jan 25, 2024' },
                    { id: 'DEL-2024-003', customer: 'Delhi Wholesale', address: 'Delhi, NCR', carrier: 'Delhivery', tracking: 'DV456789123', status: 'Out for Delivery', date: 'Jan 25, 2024' },
                    { id: 'DEL-2024-004', customer: 'Pune Distributors', address: 'Pune, Maharashtra', carrier: 'FedEx', tracking: 'FX789123456', status: 'Pending', date: 'Jan 26, 2024' },
                  ].map((delivery) => (
                    <div key={delivery.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <p className="font-semibold text-sm">{delivery.id}</p>
                            <Badge variant="outline">{delivery.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Customer</p>
                              <p className="font-medium">{delivery.customer}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Delivery Address</p>
                              <p className="font-medium flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {delivery.address}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Carrier</p>
                              <p className="font-medium">{delivery.carrier}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Tracking Number</p>
                              <p className="font-medium text-blue-600">{delivery.tracking}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-sm text-muted-foreground">{delivery.date}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Track</Button>
                            <Button variant="outline" size="sm"><Edit className="h-3 w-3" /></Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="track-delivery" className="mt-6 space-y-4">
            {/* Tracking Search */}
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Track Your Delivery</h2>
                    <p className="text-sm text-muted-foreground">Enter tracking number or delivery ID</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Enter tracking number (e.g., BD123456789)" className="pl-10" />
                    </div>
                    <Button className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Track
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Timeline */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Delivery Timeline</h2>
                    <p className="text-sm text-muted-foreground">Tracking ID: BD123456789</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Out for Delivery</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { status: 'Out for Delivery', location: 'Mumbai Local Hub', time: 'Today, 10:30 AM', active: true, completed: false },
                    { status: 'In Transit', location: 'Mumbai Sorting Center', time: 'Today, 8:00 AM', active: false, completed: true },
                    { status: 'Dispatched', location: 'Pune Distribution Center', time: 'Yesterday, 6:45 PM', active: false, completed: true },
                    { status: 'Picked Up', location: 'Warehouse - Pune', time: 'Yesterday, 2:30 PM', active: false, completed: true },
                    { status: 'Order Placed', location: 'Online', time: 'Jan 24, 11:00 AM', active: false, completed: true },
                  ].map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`rounded-full p-2 ${step.active ? 'bg-blue-100' : step.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {step.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : step.active ? (
                            <Truck className="h-5 w-5 text-blue-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        {index < 4 && (
                          <div className={`w-0.5 h-12 ${step.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <p className={`font-semibold text-sm ${step.active ? 'text-blue-600' : step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {step.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{step.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Delivery Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <h3 className="font-semibold text-sm">Delivery Information</h3>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Estimated Delivery</p>
                    <p className="font-semibold">Today, 6:00 PM</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Carrier</p>
                    <p className="font-semibold">Blue Dart Express</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Delivery Address</p>
                    <p className="font-semibold">Raj Traders, Shop 45, Mumbai - 400001</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact</p>
                    <p className="font-semibold">+91 98765 43210</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="transition-all hover:shadow-md">
                <CardHeader>
                  <h3 className="font-semibold text-sm">Package Details</h3>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-semibold">5.2 kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dimensions</p>
                    <p className="font-semibold">40 × 30 × 20 cm</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Items</p>
                    <p className="font-semibold">12 Products</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6 space-y-4">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'On-Time Delivery Rate', value: '94.5%', change: '↑ 2.3%', icon: TrendingUp, bg: 'bg-green-100', text: 'text-green-600', desc: 'Last 30 days' },
                { label: 'Average Delivery Time', value: '2.4 days', change: 'Improved by 0.3 days', icon: Clock, bg: 'bg-blue-100', text: 'text-blue-600', desc: 'Average time' },
                { label: 'Failed Deliveries', value: '3', change: '1.2%', icon: AlertCircle, bg: 'bg-red-100', text: 'text-red-600', desc: 'Requires attention' },
              ].map((metric) => (
                <Card key={metric.label} className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardContent className="p-0">
                      <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold mt-1">{metric.value}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{metric.desc}</p>
                    </CardContent>
                    <div className={`rounded-lg ${metric.bg} p-2.5`}>
                      <metric.icon className={`h-5 w-5 ${metric.text}`} />
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Delivery Status Distribution */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Delivery Status Distribution</h2>
                  <p className="text-sm text-muted-foreground">Current month breakdown</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { status: 'Delivered', count: 198, percentage: 79.8, color: 'bg-green-500' },
                    { status: 'In Transit', count: 42, percentage: 16.9, color: 'bg-blue-500' },
                    { status: 'Pending', count: 8, percentage: 3.2, color: 'bg-yellow-500' },
                  ].map((item) => (
                    <div key={item.status} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.status}</span>
                        <span className="text-muted-foreground">{item.count} ({item.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full transition-all`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Carriers */}
            <Card className="transition-all hover:shadow-md">
              <CardHeader>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Top Carriers Performance</h2>
                  <p className="text-sm text-muted-foreground">Based on delivery success rate</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Blue Dart', deliveries: 98, onTime: 96, rate: 97.9 },
                    { name: 'DTDC', deliveries: 72, onTime: 68, rate: 94.4 },
                    { name: 'Delhivery', deliveries: 54, onTime: 50, rate: 92.6 },
                    { name: 'FedEx', deliveries: 24, onTime: 22, rate: 91.7 },
                  ].map((carrier) => (
                    <div key={carrier.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-blue-100 p-2">
                          <Truck className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{carrier.name}</p>
                          <p className="text-xs text-muted-foreground">{carrier.deliveries} deliveries</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-green-600">{carrier.rate}%</p>
                        <p className="text-xs text-muted-foreground">{carrier.onTime}/{carrier.deliveries} on-time</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
}
