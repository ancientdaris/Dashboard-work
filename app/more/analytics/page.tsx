'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Printer,
  Share2,
  Filter,
  ChevronRight,
  Eye,
  Activity
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AnalyticsData {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  ordersGrowth: number;
  totalCustomers: number;
  customersGrowth: number;
  averageOrderValue: number;
  aovGrowth: number;
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    orders: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    sales: number;
    percentage: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const now = new Date();
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      const previousStartDate = new Date(startDate.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Fetch orders and payments for current period
      const { data: currentOrders } = await supabase
        .from('orders')
        .select('id, total_amount, created_at, retailer_id')
        .gte('created_at', startDate.toISOString());

      const { data: previousOrders } = await supabase
        .from('orders')
        .select('id, total_amount')
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString());

      // Calculate metrics
      const totalRevenue = currentOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const previousRevenue = previousOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
      const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      const totalOrders = currentOrders?.length || 0;
      const previousOrdersCount = previousOrders?.length || 0;
      const ordersGrowth = previousOrdersCount > 0 ? ((totalOrders - previousOrdersCount) / previousOrdersCount) * 100 : 0;

      // Get unique customers
      const uniqueCustomers = new Set(currentOrders?.map(o => o.retailer_id)).size;
      const previousUniqueCustomers = new Set(previousOrders?.map((o: any) => o.retailer_id)).size;
      const customersGrowth = previousUniqueCustomers > 0 ? ((uniqueCustomers - previousUniqueCustomers) / previousUniqueCustomers) * 100 : 0;

      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
      const previousAOV = previousOrdersCount > 0 ? previousRevenue / previousOrdersCount : 0;
      const aovGrowth = previousAOV > 0 ? ((averageOrderValue - previousAOV) / previousAOV) * 100 : 0;

      // Fetch top products
      const { data: orderItems } = await supabase
        .from('order_items')
        .select(`
          quantity,
          unit_price,
          product_id,
          products (name)
        `)
        .gte('created_at', startDate.toISOString());

      const productStats = new Map<string, { name: string; sales: number; revenue: number }>();
      orderItems?.forEach((item: any) => {
        const productId = item.product_id;
        const productName = item.products?.name || 'Unknown';
        const existing = productStats.get(productId) || { name: productName, sales: 0, revenue: 0 };
        existing.sales += item.quantity;
        existing.revenue += item.quantity * Number(item.unit_price);
        productStats.set(productId, existing);
      });

      const topProducts = Array.from(productStats.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Fetch top customers
      const customerStats = new Map<string, { name: string; orders: number; revenue: number }>();
      for (const order of currentOrders || []) {
        const customerId = order.retailer_id;
        if (!customerId) continue;
        
        const existing = customerStats.get(customerId) || { name: '', orders: 0, revenue: 0 };
        existing.orders += 1;
        existing.revenue += Number(order.total_amount);
        customerStats.set(customerId, existing);
      }

      // Fetch customer names
      const customerIds = Array.from(customerStats.keys());
      if (customerIds.length > 0) {
        const { data: retailers } = await supabase
          .from('retailers')
          .select('id, name, business_name')
          .in('id', customerIds);

        retailers?.forEach((retailer: any) => {
          const stats = customerStats.get(retailer.id);
          if (stats) {
            stats.name = retailer.business_name || retailer.name;
          }
        });
      }

      const topCustomers = Array.from(customerStats.entries())
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Monthly revenue (last 6 months)
      const monthlyRevenue = [];
      for (let i = 5; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        
        const { data: monthOrders } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        const revenue = monthOrders?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
        monthlyRevenue.push({
          month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
          revenue
        });
      }

      // Category breakdown
      const { data: products } = await supabase
        .from('products')
        .select('id, category');

      const categoryMap = new Map<string, string>();
      products?.forEach((p: any) => categoryMap.set(p.id, p.category || 'Uncategorized'));

      const categorySales = new Map<string, number>();
      orderItems?.forEach((item: any) => {
        const category = categoryMap.get(item.product_id) || 'Uncategorized';
        categorySales.set(category, (categorySales.get(category) || 0) + item.quantity);
      });

      const totalSales = Array.from(categorySales.values()).reduce((sum, val) => sum + val, 0);
      const categoryBreakdown = Array.from(categorySales.entries())
        .map(([category, sales]) => ({
          category,
          sales,
          percentage: totalSales > 0 ? (sales / totalSales) * 100 : 0
        }))
        .sort((a, b) => b.sales - a.sales);

      setAnalytics({
        totalRevenue,
        revenueGrowth,
        totalOrders,
        ordersGrowth,
        totalCustomers: uniqueCustomers,
        customersGrowth,
        averageOrderValue,
        aovGrowth,
        topProducts,
        topCustomers,
        monthlyRevenue,
        categoryBreakdown
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    prefix = '' 
  }: { 
    title: string; 
    value: number | string; 
    growth: number; 
    icon: any; 
    prefix?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{prefix}{typeof value === 'number' ? value.toFixed(2) : value}</div>
        <div className="flex items-center gap-1 mt-1">
          {growth >= 0 ? (
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          )}
          <span className={`text-xs font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {Math.abs(growth).toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground ml-1">vs previous period</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container p-4 md:p-8 max-w-7xl">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Analytics
                  </h1>
                  <p className="text-muted-foreground">
                    Comprehensive business insights and performance analytics
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Export Started',
                        description: 'Your analytics report is being prepared...',
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Analytics Report',
                          text: 'Check out our business analytics',
                        });
                      } else {
                        toast({
                          title: 'Share',
                          description: 'Share functionality not supported on this browser',
                        });
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAnalytics}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="mb-6">
              <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
                <TabsList>
                  <TabsTrigger value="7d">Last 7 Days</TabsTrigger>
                  <TabsTrigger value="30d">Last 30 Days</TabsTrigger>
                  <TabsTrigger value="90d">Last 90 Days</TabsTrigger>
                  <TabsTrigger value="1y">Last Year</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : analytics ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <MetricCard
                    title="Total Revenue"
                    value={analytics.totalRevenue}
                    growth={analytics.revenueGrowth}
                    icon={DollarSign}
                    prefix="₹"
                  />
                  <MetricCard
                    title="Total Orders"
                    value={analytics.totalOrders}
                    growth={analytics.ordersGrowth}
                    icon={ShoppingCart}
                  />
                  <MetricCard
                    title="Total Customers"
                    value={analytics.totalCustomers}
                    growth={analytics.customersGrowth}
                    icon={Users}
                  />
                  <MetricCard
                    title="Avg Order Value"
                    value={analytics.averageOrderValue}
                    growth={analytics.aovGrowth}
                    icon={TrendingUp}
                    prefix="₹"
                  />
                </div>

                {/* Charts Section */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Monthly Revenue Trend */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analytics.monthlyRevenue.map((month, index) => {
                          const maxRevenue = Math.max(...analytics.monthlyRevenue.map(m => m.revenue));
                          const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
                          return (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium">{month.month}</span>
                                <span className="text-muted-foreground">₹{month.revenue.toFixed(2)}</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-600 rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Category Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales by Category</CardTitle>
                      <CardDescription>Product category distribution</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.categoryBreakdown.slice(0, 5).map((cat, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">{cat.category}</span>
                              <span className="text-muted-foreground">{cat.percentage.toFixed(1)}%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-600 rounded-full transition-all"
                                style={{ width: `${cat.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Products and Customers */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Top Products */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Products</CardTitle>
                      <CardDescription>Best performing products by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.topProducts.map((product, index) => (
                          <div key={product.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">₹{product.revenue.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Customers */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Customers</CardTitle>
                      <CardDescription>Highest revenue generating customers</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.topCustomers.map((customer, index) => (
                          <div key={customer.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 text-green-600 font-semibold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-sm">{customer.name || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground">{customer.orders} orders</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sm">₹{customer.revenue.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Reports Section */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Detailed Reports</h2>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    {/* Sales Analytics */}
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <TrendingUp className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-base text-gray-900">
                                Sales Analytics
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Daily, weekly, and monthly trends
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Footfall Analytics */}
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <Eye className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-base text-gray-900">
                                Footfall Analytics
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Store visitor insights
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Retailer Rankings */}
                    <Card className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Activity className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-base text-gray-900">
                                Retailer Rankings
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                Top performing retailers
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
  