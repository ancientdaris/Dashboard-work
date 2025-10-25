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
} from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  type: 'product' | 'order';
  subtitle?: string;
  price?: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container p-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8 space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Welcome back to Phatkure Wholesale Distributors
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

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Revenue",
                value: "₹0.00",
                change: "0%",
                icon: CreditCard,
                changeType: "down",
                description: "All-time revenue",
              },
              {
                label: "Total Orders",
                value: "0",
                change: "0%",
                icon: ShoppingCart,
                changeType: "up",
                description: "Lifetime orders",
              },
              {
                label: "Active Retailers",
                value: "0",
                change: "0",
                icon: Users,
                changeType: "up",
                description: "Connected retailers",
              },
              {
                label: "Low Stock Items",
                value: "0",
                change: "0",
                icon: AlertCircle,
                changeType: "down",
                description: "Items below threshold",
              },
            ].map((stat) => (
              <Card 
                key={stat.label} 
                className="transition-all hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between ">
                  <CardContent className="p-0">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      <span className={`text-sm font-medium ${
                        stat.changeType === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {stat.changeType === "up" ? "↑" : "↓"} {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </CardContent>
                  <div className="rounded-lg bg-gray-100/80 p-2.5">
                    <stat.icon className="h-5 w-5 text-gray-600" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

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
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
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
    </div>
    </ProtectedRoute>
  );
}