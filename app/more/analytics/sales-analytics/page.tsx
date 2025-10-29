'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ArrowLeft
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

interface SalesAnalytics {
  daily: SalesData[];
  weekly: SalesData[];
  monthly: SalesData[];
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  growth: number;
}

export default function SalesAnalyticsPage() {
  const [analytics, setAnalytics] = useState<SalesAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchSalesAnalytics();
  }, []);

  const fetchSalesAnalytics = async () => {
    try {
      setRefreshing(true);
      const now = new Date();

      // Fetch daily data (last 7 days)
      const dailyData: SalesData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        const revenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const orderCount = orders?.length || 0;
        const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

        dailyData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue,
          orders: orderCount,
          avgOrderValue
        });
      }

      // Fetch weekly data (last 8 weeks)
      const weeklyData: SalesData[] = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7) - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', weekStart.toISOString())
          .lt('created_at', weekEnd.toISOString());

        const revenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const orderCount = orders?.length || 0;
        const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

        weeklyData.push({
          date: `Week ${8 - i}`,
          revenue,
          orders: orderCount,
          avgOrderValue
        });
      }

      // Fetch monthly data (last 12 months)
      const monthlyData: SalesData[] = [];
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const { data: orders } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        const revenue = orders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        const orderCount = orders?.length || 0;
        const avgOrderValue = orderCount > 0 ? revenue / orderCount : 0;

        monthlyData.push({
          date: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          revenue,
          orders: orderCount,
          avgOrderValue
        });
      }

      // Calculate totals and growth
      const totalRevenue = dailyData.reduce((sum, d) => sum + d.revenue, 0);
      const totalOrders = dailyData.reduce((sum, d) => sum + d.orders, 0);
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate growth (compare last period vs previous period)
      const currentPeriodRevenue = dailyData.slice(-3).reduce((sum, d) => sum + d.revenue, 0);
      const previousPeriodRevenue = dailyData.slice(0, 3).reduce((sum, d) => sum + d.revenue, 0);
      const growth = previousPeriodRevenue > 0 
        ? ((currentPeriodRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
        : 0;

      setAnalytics({
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData,
        totalRevenue,
        totalOrders,
        avgOrderValue,
        growth
      });
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sales analytics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getCurrentData = () => {
    if (!analytics) return [];
    switch (activeTab) {
      case 'daily':
        return analytics.daily;
      case 'weekly':
        return analytics.weekly;
      case 'monthly':
        return analytics.monthly;
      default:
        return analytics.daily;
    }
  };

  const currentData = getCurrentData();
  const maxRevenue = Math.max(...currentData.map(d => d.revenue), 1);

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container p-4 md:p-8 max-w-7xl">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/more/analytics">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Sales Analytics
                  </h1>
                  <p className="text-muted-foreground">
                    Daily, weekly, and monthly sales trends
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Export Started',
                        description: 'Your sales report is being prepared...',
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchSalesAnalytics}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : analytics ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Revenue (7 Days)
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{analytics.totalRevenue.toFixed(2)}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {analytics.growth >= 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span className={`text-xs font-medium ${analytics.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(analytics.growth).toFixed(1)}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">vs previous period</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Orders (7 Days)
                      </CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalOrders}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Orders placed in last 7 days
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg Order Value
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{analytics.avgOrderValue.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average per order
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabs for Daily/Weekly/Monthly */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Trends</CardTitle>
                    <CardDescription>View sales performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      </TabsList>

                      <TabsContent value={activeTab} className="space-y-4">
                        {/* Revenue Chart */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold">Revenue Trend</h3>
                          {currentData.map((item, index) => {
                            const percentage = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.date}</span>
                                  <span className="text-muted-foreground">₹{item.revenue.toFixed(2)}</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Orders Chart */}
                        <div className="space-y-2 mt-6">
                          <h3 className="text-sm font-semibold">Orders Trend</h3>
                          {currentData.map((item, index) => {
                            const maxOrders = Math.max(...currentData.map(d => d.orders), 1);
                            const percentage = maxOrders > 0 ? (item.orders / maxOrders) * 100 : 0;
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.date}</span>
                                  <span className="text-muted-foreground">{item.orders} orders</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Average Order Value */}
                        <div className="space-y-2 mt-6">
                          <h3 className="text-sm font-semibold">Average Order Value</h3>
                          {currentData.map((item, index) => {
                            const maxAOV = Math.max(...currentData.map(d => d.avgOrderValue), 1);
                            const percentage = maxAOV > 0 ? (item.avgOrderValue / maxAOV) * 100 : 0;
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.date}</span>
                                  <span className="text-muted-foreground">₹{item.avgOrderValue.toFixed(2)}</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
