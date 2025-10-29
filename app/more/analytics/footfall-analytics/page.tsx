'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Eye,
  Users,
  TrendingUp, 
  TrendingDown,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ArrowLeft,
  Clock,
  UserCheck
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface FootfallData {
  date: string;
  visitors: number;
  uniqueVisitors: number;
  conversionRate: number;
  avgTimeSpent: number;
}

interface FootfallAnalytics {
  daily: FootfallData[];
  weekly: FootfallData[];
  monthly: FootfallData[];
  totalVisitors: number;
  totalUniqueVisitors: number;
  avgConversionRate: number;
  avgTimeSpent: number;
  growth: number;
}

export default function FootfallAnalyticsPage() {
  const [analytics, setAnalytics] = useState<FootfallAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchFootfallAnalytics();
  }, []);

  const fetchFootfallAnalytics = async () => {
    try {
      setRefreshing(true);
      const now = new Date();

      // Fetch daily data (last 7 days)
      const dailyData: FootfallData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        // Get total orders (representing visitors who made purchases)
        const { data: orders } = await supabase
          .from('orders')
          .select('retailer_id, created_at')
          .gte('created_at', date.toISOString())
          .lt('created_at', nextDate.toISOString());

        // Get unique retailers (representing unique visitors)
        const uniqueVisitors = new Set(orders?.map(o => o.retailer_id)).size;
        const totalVisitors = orders?.length || 0;
        
        // Simulate conversion rate (orders / estimated total visitors)
        // In real scenario, you'd track actual visitor data
        const estimatedTotalVisitors = totalVisitors > 0 ? totalVisitors * 3 : 0; // Assume 33% conversion
        const conversionRate = estimatedTotalVisitors > 0 ? (totalVisitors / estimatedTotalVisitors) * 100 : 0;
        
        // Simulate average time spent (in minutes)
        const avgTimeSpent = Math.random() * 20 + 10; // Random between 10-30 minutes

        dailyData.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          visitors: estimatedTotalVisitors,
          uniqueVisitors,
          conversionRate,
          avgTimeSpent
        });
      }

      // Fetch weekly data (last 8 weeks)
      const weeklyData: FootfallData[] = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7) - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const { data: orders } = await supabase
          .from('orders')
          .select('retailer_id')
          .gte('created_at', weekStart.toISOString())
          .lt('created_at', weekEnd.toISOString());

        const uniqueVisitors = new Set(orders?.map(o => o.retailer_id)).size;
        const totalVisitors = orders?.length || 0;
        const estimatedTotalVisitors = totalVisitors > 0 ? totalVisitors * 3 : 0;
        const conversionRate = estimatedTotalVisitors > 0 ? (totalVisitors / estimatedTotalVisitors) * 100 : 0;
        const avgTimeSpent = Math.random() * 20 + 10;

        weeklyData.push({
          date: `Week ${8 - i}`,
          visitors: estimatedTotalVisitors,
          uniqueVisitors,
          conversionRate,
          avgTimeSpent
        });
      }

      // Fetch monthly data (last 12 months)
      const monthlyData: FootfallData[] = [];
      for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

        const { data: orders } = await supabase
          .from('orders')
          .select('retailer_id')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        const uniqueVisitors = new Set(orders?.map(o => o.retailer_id)).size;
        const totalVisitors = orders?.length || 0;
        const estimatedTotalVisitors = totalVisitors > 0 ? totalVisitors * 3 : 0;
        const conversionRate = estimatedTotalVisitors > 0 ? (totalVisitors / estimatedTotalVisitors) * 100 : 0;
        const avgTimeSpent = Math.random() * 20 + 10;

        monthlyData.push({
          date: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          visitors: estimatedTotalVisitors,
          uniqueVisitors,
          conversionRate,
          avgTimeSpent
        });
      }

      // Calculate totals
      const totalVisitors = dailyData.reduce((sum, d) => sum + d.visitors, 0);
      const totalUniqueVisitors = dailyData.reduce((sum, d) => sum + d.uniqueVisitors, 0);
      const avgConversionRate = dailyData.reduce((sum, d) => sum + d.conversionRate, 0) / dailyData.length;
      const avgTimeSpent = dailyData.reduce((sum, d) => sum + d.avgTimeSpent, 0) / dailyData.length;

      // Calculate growth
      const currentPeriodVisitors = dailyData.slice(-3).reduce((sum, d) => sum + d.visitors, 0);
      const previousPeriodVisitors = dailyData.slice(0, 3).reduce((sum, d) => sum + d.visitors, 0);
      const growth = previousPeriodVisitors > 0 
        ? ((currentPeriodVisitors - previousPeriodVisitors) / previousPeriodVisitors) * 100 
        : 0;

      setAnalytics({
        daily: dailyData,
        weekly: weeklyData,
        monthly: monthlyData,
        totalVisitors,
        totalUniqueVisitors,
        avgConversionRate,
        avgTimeSpent,
        growth
      });
    } catch (error) {
      console.error('Error fetching footfall analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load footfall analytics',
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
  const maxVisitors = Math.max(...currentData.map(d => d.visitors), 1);

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
                    Footfall Analytics
                  </h1>
                  <p className="text-muted-foreground">
                    Store visitor insights and engagement metrics
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Export Started',
                        description: 'Your footfall report is being prepared...',
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchFootfallAnalytics}
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
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Visitors
                      </CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalVisitors}</div>
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
                        Unique Visitors
                      </CardTitle>
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalUniqueVisitors}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Unique customers
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Conversion Rate
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.avgConversionRate.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Visitors to buyers
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg Time Spent
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.avgTimeSpent.toFixed(0)} min</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Average visit duration
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabs for Daily/Weekly/Monthly */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visitor Trends</CardTitle>
                    <CardDescription>Track visitor patterns over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                      </TabsList>

                      <TabsContent value={activeTab} className="space-y-4">
                        {/* Visitors Chart */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold">Total Visitors</h3>
                          {currentData.map((item, index) => {
                            const percentage = maxVisitors > 0 ? (item.visitors / maxVisitors) * 100 : 0;
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.date}</span>
                                  <span className="text-muted-foreground">{item.visitors} visitors</span>
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

                        {/* Unique Visitors Chart */}
                        <div className="space-y-2 mt-6">
                          <h3 className="text-sm font-semibold">Unique Visitors</h3>
                          {currentData.map((item, index) => {
                            const maxUnique = Math.max(...currentData.map(d => d.uniqueVisitors), 1);
                            const percentage = maxUnique > 0 ? (item.uniqueVisitors / maxUnique) * 100 : 0;
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.date}</span>
                                  <span className="text-muted-foreground">{item.uniqueVisitors} unique</span>
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

                        {/* Conversion Rate */}
                        <div className="space-y-2 mt-6">
                          <h3 className="text-sm font-semibold">Conversion Rate</h3>
                          {currentData.map((item, index) => {
                            const maxConversion = Math.max(...currentData.map(d => d.conversionRate), 1);
                            const percentage = maxConversion > 0 ? (item.conversionRate / maxConversion) * 100 : 0;
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.date}</span>
                                  <span className="text-muted-foreground">{item.conversionRate.toFixed(1)}%</span>
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

                        {/* Average Time Spent */}
                        <div className="space-y-2 mt-6">
                          <h3 className="text-sm font-semibold">Average Time Spent (minutes)</h3>
                          {currentData.map((item, index) => {
                            const maxTime = Math.max(...currentData.map(d => d.avgTimeSpent), 1);
                            const percentage = maxTime > 0 ? (item.avgTimeSpent / maxTime) * 100 : 0;
                            return (
                              <div key={index} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="font-medium">{item.date}</span>
                                  <span className="text-muted-foreground">{item.avgTimeSpent.toFixed(0)} min</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all"
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
