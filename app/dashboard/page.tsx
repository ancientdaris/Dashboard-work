"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  CreditCard,
  Search,
  ShoppingCart,
  Users,
  AlertCircle,
  Plus,
  FileBarChart,
  Package,
  X,
  TrendingUp,
  Truck,
  FileText,
  Tag,
  DollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface SearchResult {
  id: string;
  name: string;
  type: 'product' | 'order';
  subtitle?: string;
  price?: number;
}

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  activeProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalRetailers: number;
  overdueInvoices: number;
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  completedPayments: number;
  todaysOrders: number;
  todaysRevenue: number;
  pendingDeliveries: number;
  totalInvoices: number;
}

interface TodaysOrder {
  id: string;
  order_number: string;
  total_amount: number;
  status: string;
  created_at: string;
  retailers: {
    name: string;
    business_name: string | null;
  } | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userFullName, setUserFullName] = useState<string>('');
  const searchRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTodaysOrdersModal, setShowTodaysOrdersModal] = useState(false);
  const [todaysOrders, setTodaysOrders] = useState<TodaysOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Fetch orders stats
      const { count: totalOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      const { count: pendingOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: confirmedOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .in('status', ['processing', 'confirmed']);

      const { count: shippedOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'shipped');

      const { count: deliveredOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'delivered');

      const { count: todaysOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Fetch products stats
      const { count: totalProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { count: activeProducts } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch inventory stats
      const { data: inventoryData } = await supabase
        .from('inventory')
        .select('quantity_in_stock, reorder_level');

      const lowStockItems = inventoryData?.filter(
        (item: { quantity_in_stock: number; reorder_level: number }) => 
          item.quantity_in_stock <= item.reorder_level && item.quantity_in_stock > 0
      ).length || 0;

      const outOfStockItems = inventoryData?.filter(
        (item: { quantity_in_stock: number }) => item.quantity_in_stock === 0
      ).length || 0;

      // Fetch retailers count
      const { count: totalRetailers } = await supabase
        .from('retailers')
        .select('*', { count: 'exact', head: true });

      // Fetch invoices stats
      const { count: totalInvoices } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true });

      const { count: overdueInvoices } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'overdue');

      // Fetch payments stats
      const { count: pendingPayments } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: completedPayments } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Calculate revenue
      const { data: allPayments } = await supabase
        .from('payments')
        .select('amount, created_at')
        .eq('status', 'completed');

      const totalRevenue = (allPayments as { amount: number; created_at: string }[])?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      const monthlyRevenue = (allPayments as { amount: number; created_at: string }[])?.filter(p =>
        new Date(p.created_at) >= startOfMonth
      ).reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      const todaysRevenue = (allPayments as { amount: number; created_at: string }[])?.filter(p =>
        new Date(p.created_at) >= today
      ).reduce((sum, p) => sum + Number(p.amount), 0) || 0;

      // Fetch deliveries stats
      const { count: pendingDeliveries } = await supabase
        .from('deliveries')
        .select('*', { count: 'exact', head: true })
        .in('status', ['pending', 'in_transit']);

      setStats({
        totalOrders: totalOrders || 0,
        pendingOrders: pendingOrders || 0,
        confirmedOrders: confirmedOrders || 0,
        shippedOrders: shippedOrders || 0,
        deliveredOrders: deliveredOrders || 0,
        totalProducts: totalProducts || 0,
        activeProducts: activeProducts || 0,
        lowStockItems,
        outOfStockItems,
        totalRetailers: totalRetailers || 0,
        overdueInvoices: overdueInvoices || 0,
        totalRevenue,
        monthlyRevenue,
        pendingPayments: pendingPayments || 0,
        completedPayments: completedPayments || 0,
        todaysOrders: todaysOrders || 0,
        todaysRevenue,
        pendingDeliveries: pendingDeliveries || 0,
        totalInvoices: totalInvoices || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single<{ full_name: string | null }>();
        
        if (profile?.full_name) {
          setUserFullName(profile.full_name);
        }
      }
    };
    
    fetchUserProfile();
    fetchDashboardStats();
  }, [supabase]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search products and orders
  useEffect(() => {
    const searchData = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setLoading(true);
      try {
        // Search products
        const productsQuery = await supabase
          .from('products')
          .select('id, name, sku, unit_price, category')
          .or(`name.ilike.%${searchQuery}%,sku.ilike.%${searchQuery}%`)
          .limit(5);
        const products = productsQuery.data;

        // Search orders
        const ordersQuery = await supabase
          .from('orders')
          .select('id, order_number, total_amount, status')
          .ilike('order_number', `%${searchQuery}%`)
          .limit(3);
        const orders = ordersQuery.data;

        const results: SearchResult[] = [];

        // Add products to results
        if (products) {
          products.forEach((product: { id: string; name: string; sku: string; unit_price: number; category: string }) => {
            results.push({
              id: product.id,
              name: product.name,
              type: 'product',
              subtitle: `SKU: ${product.sku} • ${product.category || 'Uncategorized'}`,
              price: product.unit_price,
            });
          });
        }

        // Add orders to results
        if (orders) {
          orders.forEach((order: { id: string; order_number: string; total_amount: number; status: string }) => {
            results.push({
              id: order.id,
              name: order.order_number,
              type: 'order',
              subtitle: `Status: ${order.status}`,
              price: order.total_amount,
            });
          });
        }

        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, supabase]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'product') {
      router.push(`/products`);
    } else if (result.type === 'order') {
      router.push(`/orders`);
    }
    setShowDropdown(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setShowDropdown(false);
  };

  const fetchTodaysOrders = async () => {
    setLoadingOrders(true);
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          total_amount,
          status,
          created_at,
          retailers (
            name,
            business_name
          )
        `)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodaysOrders(data || []);
    } catch (error) {
      console.error('Error fetching today\'s orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleTodaysOrdersClick = () => {
    setShowTodaysOrdersModal(true);
    fetchTodaysOrders();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardStats();
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container p-4 md:p-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8 space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Welcome back{userFullName && `, ${userFullName}`}
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s what&apos;s happening with your wholesale business today
              </p>
           
          </div>

          {/* Search and Date Filter */}
          <div className="mb-8 flex items-center gap-4">
            <div ref={searchRef} className="relative flex-1 min-w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
              <Input
                placeholder="Search orders, products..."
                className="pl-10 pr-10 bg-white/50 border-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700 z-10"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* Dropdown Results */}
              {showDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                  {loading ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result)}
                          className="w-full px-4 py-3 hover:bg-gray-50 flex items-start gap-3 text-left transition-colors"
                        >
                          <div className={`mt-1 rounded-lg p-2 ${
                            result.type === 'product' 
                              ? 'bg-blue-100 text-blue-600' 
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {result.type === 'product' ? (
                              <Package className="h-4 w-4" />
                            ) : (
                              <ShoppingCart className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-sm truncate">{result.name}</p>
                              {result.price !== undefined && (
                                <span className="text-sm font-semibold text-gray-900 shrink-0">
                                  ₹{result.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {result.subtitle && (
                              <p className="text-xs text-muted-foreground mt-1">{result.subtitle}</p>
                            )}
                            <p className="text-xs text-blue-600 mt-1 capitalize">
                              {result.type}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {statsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <>
              {/* Overview Stats */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Overview
                  </h2>
                  <Button variant="outline" size="sm" onClick={onRefresh} disabled={refreshing}>
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Link href="/orders">
                    <Card className="transition-all hover:shadow-md cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Orders</p>
                          <h3 className="text-2xl font-bold mt-1">{stats?.totalOrders || 0}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{stats?.pendingOrders || 0} pending</p>
                        </div>
                        <div className="rounded-lg bg-blue-100/80 p-2.5">
                          <Package className="h-5 w-5 text-blue-600" />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                  
                  <Link href="/products">
                    <Card className="transition-all hover:shadow-md cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Products</p>
                          <h3 className="text-2xl font-bold mt-1">{stats?.totalProducts || 0}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{stats?.lowStockItems || 0} low stock</p>
                        </div>
                        <div className="rounded-lg bg-purple-100/80 p-2.5">
                          <Tag className="h-5 w-5 text-purple-600" />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                  
                  <Link href="/retailers">
                    <Card className="transition-all hover:shadow-md cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Retailers</p>
                          <h3 className="text-2xl font-bold mt-1">{stats?.totalRetailers || 0}</h3>
                          <p className="text-xs text-muted-foreground mt-1">Active customers</p>
                        </div>
                        <div className="rounded-lg bg-green-100/80 p-2.5">
                          <Users className="h-5 w-5 text-green-600" />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                  
                  <Link href="/payments">
                    <Card className="transition-all hover:shadow-md cursor-pointer">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                          <h3 className="text-2xl font-bold mt-1">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
                          <p className="text-xs text-muted-foreground mt-1">Total collected</p>
                        </div>
                        <div className="rounded-lg bg-yellow-100/80 p-2.5">
                          <DollarSign className="h-5 w-5 text-yellow-600" />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                </div>
              </div>

              {/* Today's Performance */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-green-600" />
                    Today&apos;s Performance
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Card 
                    className="transition-all hover:shadow-md cursor-pointer"
                    onClick={handleTodaysOrdersClick}
                  >
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Today&apos;s Orders</p>
                      <h3 className="text-3xl font-bold mt-2">{stats?.todaysOrders || 0}</h3>
                      <p className="text-xs text-blue-600 mt-2 font-medium">Tap to view details</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Today&apos;s Revenue</p>
                      <h3 className="text-3xl font-bold text-green-600 mt-2">₹{stats?.todaysRevenue?.toFixed(2) || '0.00'}</h3>
                    </CardContent>
                  </Card>
                  
                  <Card className="transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Monthly Revenue</p>
                      <h3 className="text-3xl font-bold text-green-600 mt-2">₹{stats?.monthlyRevenue?.toFixed(2) || '0.00'}</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Order Pipeline */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5 text-indigo-600" />
                    Order Pipeline
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-yellow-700">Pending</p>
                      <h3 className="text-2xl font-bold text-yellow-900 mt-1">{stats?.pendingOrders || 0}</h3>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-blue-700">Confirmed</p>
                      <h3 className="text-2xl font-bold text-blue-900 mt-1">{stats?.confirmedOrders || 0}</h3>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-purple-700">Shipped</p>
                      <h3 className="text-2xl font-bold text-purple-900 mt-1">{stats?.shippedOrders || 0}</h3>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-green-700">Delivered</p>
                      <h3 className="text-2xl font-bold text-green-900 mt-1">{stats?.deliveredOrders || 0}</h3>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-gray-200">
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-gray-700">In Transit</p>
                      <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats?.pendingDeliveries || 0}</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Financial Overview */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Financial Overview
                  </h2>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Invoices</p>
                      <h3 className="text-3xl font-bold mt-2">{stats?.totalInvoices || 0}</h3>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Completed Payments</p>
                      <h3 className="text-3xl font-bold text-green-600 mt-2">{stats?.completedPayments || 0}</h3>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Active Products</p>
                      <h3 className="text-3xl font-bold mt-2">{stats?.activeProducts || 0}</h3>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Out of Stock</p>
                      <h3 className="text-3xl font-bold text-red-600 mt-2">{stats?.outOfStockItems || 0}</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Alerts */}
              {((stats?.overdueInvoices || 0) > 0 || (stats?.lowStockItems || 0) > 0 || (stats?.outOfStockItems || 0) > 0 || (stats?.pendingPayments || 0) > 0) && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Attention Needed</h2>
                  <div className="space-y-3">
                    {(stats?.overdueInvoices || 0) > 0 && (
                      <Link href="/invoices">
                        <Card className="bg-red-50 border-l-4 border-l-red-500 border-y border-r border-red-200 cursor-pointer hover:shadow-md transition-all">
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-red-100 rounded-lg p-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-red-900">{stats?.overdueInvoices} Overdue Invoice{stats?.overdueInvoices !== 1 ? 's' : ''}</p>
                                <p className="text-sm text-red-700">Payment collection needed</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )}
                    
                    {(stats?.lowStockItems || 0) > 0 && (
                      <Link href="/inventory">
                        <Card className="bg-yellow-50 border-l-4 border-l-yellow-500 border-y border-r border-yellow-200 cursor-pointer hover:shadow-md transition-all">
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-yellow-100 rounded-lg p-2">
                                <Package className="h-5 w-5 text-yellow-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-yellow-900">{stats?.lowStockItems} Low Stock Item{stats?.lowStockItems !== 1 ? 's' : ''}</p>
                                <p className="text-sm text-yellow-700">Reorder inventory soon</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )}
                    
                    {(stats?.outOfStockItems || 0) > 0 && (
                      <Link href="/inventory">
                        <Card className="bg-red-50 border-l-4 border-l-red-500 border-y border-r border-red-200 cursor-pointer hover:shadow-md transition-all">
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-red-100 rounded-lg p-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-red-900">{stats?.outOfStockItems} Out of Stock Item{stats?.outOfStockItems !== 1 ? 's' : ''}</p>
                                <p className="text-sm text-red-700">Immediate restocking required</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )}
                    
                    {(stats?.pendingPayments || 0) > 0 && (
                      <Link href="/payments">
                        <Card className="bg-blue-50 border-l-4 border-l-blue-500 border-y border-r border-blue-200 cursor-pointer hover:shadow-md transition-all">
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-100 rounded-lg p-2">
                                <CreditCard className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-semibold text-blue-900">{stats?.pendingPayments} Pending Payment{stats?.pendingPayments !== 1 ? 's' : ''}</p>
                                <p className="text-sm text-blue-700">Awaiting processing</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Recent Orders & Low Stock */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                  <p className="text-sm text-muted-foreground">Latest transactions from retailers</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/orders">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="rounded-full bg-gray-100/80 p-3 mb-4">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <p className="font-medium mb-1">No orders yet</p>
                  <p className="text-sm">Orders from retailers will appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Low Stock Alert</h2>
                  <p className="text-sm text-muted-foreground">Items requiring attention</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/inventory">View inventory</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="rounded-full bg-gray-100/80 p-3 mb-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <p className="font-medium mb-1">No inventory alerts</p>
                  <p className="text-sm">Low stock items will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <p className="text-sm text-muted-foreground">Common tasks and operations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                  { icon: Plus, label: "Add Product", href: "/products/add", description: "List new items" },
                  { icon: ShoppingCart, label: "View Orders", href: "/orders", description: "Manage transactions" },
                  { icon: Users, label: "Manage Retailers", href: "/retailers", description: "View partnerships" },
                  { icon: FileBarChart, label: "View Reports", href: "/reports", description: "Analytics & insights" },
                ].map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="flex h-auto flex-col items-center gap-3 p-6 hover:border-blue-600/50 hover:bg-blue-50/50 transition-all group"
                    asChild
                  >
                    <Link href={action.href}>
                      <div className="rounded-lg bg-gray-100/80 p-3 group-hover:bg-blue-100/80 transition-colors">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 text-center">
                        <h3 className="font-medium">{action.label}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Today's Orders Modal */}
      <Dialog open={showTodaysOrdersModal} onOpenChange={setShowTodaysOrdersModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Today&apos;s Orders</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {loadingOrders ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : todaysOrders.length > 0 ? (
              <div className="space-y-3">
                {todaysOrders.map((order) => (
                  <Card key={order.id} className="hover:shadow-md transition-all">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-lg">{order.order_number}</p>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {order.retailers?.business_name || order.retailers?.name || 'Unknown Retailer'}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            ₹{order.total_amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-4" />
                <p className="font-medium">No orders today</p>
                <p className="text-sm">Orders placed today will appear here</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </ProtectedRoute>
  );
}