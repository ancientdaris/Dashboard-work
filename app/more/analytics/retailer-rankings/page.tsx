'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Activity,
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  ArrowLeft,
  Trophy,
  Star,
  Award
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface RetailerRanking {
  id: string;
  name: string;
  businessName: string;
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  growth: number;
  rank: number;
  tier: 'platinum' | 'gold' | 'silver' | 'bronze';
}

interface RankingsAnalytics {
  topRetailers: RetailerRanking[];
  byRevenue: RetailerRanking[];
  byOrders: RetailerRanking[];
  byGrowth: RetailerRanking[];
  totalRetailers: number;
  avgRevenue: number;
  avgOrders: number;
}

export default function RetailerRankingsPage() {
  const [analytics, setAnalytics] = useState<RankingsAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'revenue' | 'orders' | 'growth'>('revenue');
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchRetailerRankings();
  }, []);

  const getTier = (rank: number): 'platinum' | 'gold' | 'silver' | 'bronze' => {
    if (rank === 1) return 'platinum';
    if (rank <= 3) return 'gold';
    if (rank <= 10) return 'silver';
    return 'bronze';
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'gold':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'silver':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'bronze':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const fetchRetailerRankings = async () => {
    try {
      setRefreshing(true);
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      // Fetch all retailers
      const { data: retailers, error: retailersError } = await supabase
        .from('retailers')
        .select('id, name, business_name');

      if (retailersError) {
        console.error('Error fetching retailers:', retailersError);
        toast({
          title: 'Error',
          description: 'Failed to load retailers data',
          variant: 'destructive',
        });
        return;
      }

      if (!retailers || retailers.length === 0) {
        // No retailers found, set empty analytics
        setAnalytics({
          topRetailers: [],
          byRevenue: [],
          byOrders: [],
          byGrowth: [],
          totalRetailers: 0,
          avgRevenue: 0,
          avgOrders: 0
        });
        return;
      }

      // Fetch orders for current period (last 30 days)
      const { data: currentOrders } = await supabase
        .from('orders')
        .select('retailer_id, total_amount')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Fetch orders for previous period (30-60 days ago)
      const { data: previousOrders } = await supabase
        .from('orders')
        .select('retailer_id, total_amount')
        .gte('created_at', sixtyDaysAgo.toISOString())
        .lt('created_at', thirtyDaysAgo.toISOString());

      // Calculate stats for each retailer
      const retailerStats = retailers.map((retailer) => {
        const currentRetailerOrders = currentOrders?.filter(o => o.retailer_id === retailer.id) || [];
        const previousRetailerOrders = previousOrders?.filter(o => o.retailer_id === retailer.id) || [];

        const totalRevenue = currentRetailerOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
        const previousRevenue = previousRetailerOrders.reduce((sum, order) => sum + Number(order.total_amount), 0);
        const totalOrders = currentRetailerOrders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const growth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        return {
          id: retailer.id,
          name: retailer.name,
          businessName: retailer.business_name || retailer.name,
          totalRevenue,
          totalOrders,
          avgOrderValue,
          growth,
          rank: 0,
          tier: 'bronze' as const
        };
      });

      // Sort by revenue and assign ranks
      const byRevenue = [...retailerStats]
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .map((retailer, index) => ({
          ...retailer,
          rank: index + 1,
          tier: getTier(index + 1)
        }))
        .slice(0, 20);

      // Sort by orders
      const byOrders = [...retailerStats]
        .sort((a, b) => b.totalOrders - a.totalOrders)
        .map((retailer, index) => ({
          ...retailer,
          rank: index + 1,
          tier: getTier(index + 1)
        }))
        .slice(0, 20);

      // Sort by growth
      const byGrowth = [...retailerStats]
        .filter(r => r.totalRevenue > 0) // Only include retailers with revenue
        .sort((a, b) => b.growth - a.growth)
        .map((retailer, index) => ({
          ...retailer,
          rank: index + 1,
          tier: getTier(index + 1)
        }))
        .slice(0, 20);

      // Calculate averages
      const totalRetailers = retailerStats.length;
      const avgRevenue = retailerStats.reduce((sum, r) => sum + r.totalRevenue, 0) / totalRetailers;
      const avgOrders = retailerStats.reduce((sum, r) => sum + r.totalOrders, 0) / totalRetailers;

      setAnalytics({
        topRetailers: byRevenue.slice(0, 10),
        byRevenue,
        byOrders,
        byGrowth,
        totalRetailers,
        avgRevenue,
        avgOrders
      });
    } catch (error) {
      console.error('Error fetching retailer rankings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load retailer rankings',
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
      case 'revenue':
        return analytics.byRevenue;
      case 'orders':
        return analytics.byOrders;
      case 'growth':
        return analytics.byGrowth;
      default:
        return analytics.byRevenue;
    }
  };

  const currentData = getCurrentData();

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
                    Retailer Rankings
                  </h1>
                  <p className="text-muted-foreground">
                    Top performing retailers and performance metrics
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toast({
                        title: 'Export Started',
                        description: 'Your rankings report is being prepared...',
                      });
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchRetailerRankings}
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
            ) : analytics && analytics.totalRetailers > 0 ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Retailers
                      </CardTitle>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.totalRetailers}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Active retailers
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg Revenue per Retailer
                      </CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{analytics.avgRevenue.toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last 30 days
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Avg Orders per Retailer
                      </CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.avgOrders.toFixed(0)}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Last 30 days
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Top 3 Retailers Podium */}
                {analytics.topRetailers.length >= 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performers</CardTitle>
                      <CardDescription>Leading retailers by revenue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        {/* 2nd Place */}
                        <div className="flex flex-col items-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 border-4 border-gray-300 mb-2">
                            <Award className="h-8 w-8 text-gray-600" />
                          </div>
                          <Badge variant="outline" className="mb-2 bg-gray-100 text-gray-700 border-gray-300">
                            #2
                          </Badge>
                          <p className="font-semibold text-sm text-center">{analytics.topRetailers[1].businessName}</p>
                          <p className="text-xs text-muted-foreground">₹{analytics.topRetailers[1].totalRevenue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{analytics.topRetailers[1].totalOrders} orders</p>
                        </div>

                        {/* 1st Place */}
                        <div className="flex flex-col items-center -mt-4">
                          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 border-4 border-yellow-400 mb-2">
                            <Trophy className="h-10 w-10 text-yellow-600" />
                          </div>
                          <Badge variant="outline" className="mb-2 bg-yellow-100 text-yellow-700 border-yellow-400">
                            #1
                          </Badge>
                          <p className="font-semibold text-base text-center">{analytics.topRetailers[0].businessName}</p>
                          <p className="text-sm font-bold text-yellow-700">₹{analytics.topRetailers[0].totalRevenue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{analytics.topRetailers[0].totalOrders} orders</p>
                        </div>

                        {/* 3rd Place */}
                        <div className="flex flex-col items-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 border-4 border-orange-300 mb-2">
                            <Star className="h-8 w-8 text-orange-600" />
                          </div>
                          <Badge variant="outline" className="mb-2 bg-orange-100 text-orange-700 border-orange-300">
                            #3
                          </Badge>
                          <p className="font-semibold text-sm text-center">{analytics.topRetailers[2].businessName}</p>
                          <p className="text-xs text-muted-foreground">₹{analytics.topRetailers[2].totalRevenue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{analytics.topRetailers[2].totalOrders} orders</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Rankings Table */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Rankings</CardTitle>
                    <CardDescription>View rankings by different metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                      <TabsList className="mb-4">
                        <TabsTrigger value="revenue">By Revenue</TabsTrigger>
                        <TabsTrigger value="orders">By Orders</TabsTrigger>
                        <TabsTrigger value="growth">By Growth</TabsTrigger>
                      </TabsList>

                      <TabsContent value={activeTab} className="space-y-3">
                        {currentData.map((retailer, index) => (
                          <Card key={retailer.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 flex-1">
                                  {/* Rank Badge */}
                                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold text-lg ${
                                    retailer.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                                    retailer.rank === 2 ? 'bg-gray-100 text-gray-700' :
                                    retailer.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                    'bg-blue-100 text-blue-700'
                                  }`}>
                                    {retailer.rank}
                                  </div>

                                  {/* Retailer Info */}
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold text-base">{retailer.businessName}</p>
                                      <Badge variant="outline" className={getTierColor(retailer.tier)}>
                                        {retailer.tier}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{retailer.name}</p>
                                  </div>

                                  {/* Stats */}
                                  <div className="grid grid-cols-3 gap-6 text-right">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Revenue</p>
                                      <p className="font-semibold">₹{retailer.totalRevenue.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Orders</p>
                                      <p className="font-semibold">{retailer.totalOrders}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Growth</p>
                                      <div className="flex items-center justify-end gap-1">
                                        {retailer.growth >= 0 ? (
                                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                                        ) : (
                                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                                        )}
                                        <p className={`font-semibold text-sm ${retailer.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {Math.abs(retailer.growth).toFixed(1)}%
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Retailers Found</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    There are no retailers in the system yet. Add retailers to see their rankings and performance metrics.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
