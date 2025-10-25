"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ProductsTable } from "@/components/products/products-table";
import { Plus, Import, Download, Search, X } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

interface ProductStats {
  total: number;
  outOfStock: number;
  lowStock: number;
}

export default function ProductsPage() {
  const [stats, setStats] = useState<ProductStats>({
    total: 0,
    outOfStock: 0,
    lowStock: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const supabase = createClient();

  const fetchProductStats = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch total products count
      const { count: totalCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      // Fetch out of stock products count (assuming we have a stock_quantity column)
      const { count: outOfStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .lte('stock_quantity', 0);
      
      // Fetch low stock products count (assuming low stock is when quantity is less than or equal to 10)
      const { count: lowStockCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .gt('stock_quantity', 0)
        .lte('stock_quantity', 10);
      
      setStats({
        total: totalCount || 0,
        outOfStock: outOfStockCount || 0,
        lowStock: lowStockCount || 0
      });
    } catch (error) {
      console.error('Error fetching product stats:', error);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProductStats();
  }, [fetchProductStats]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                  Manage your product catalog and inventory
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-9 pr-8 w-[200px] sm:w-[250px] md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="h-9">
                  <Import className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Import</span>
                </Button>
                
                <Button variant="outline" size="sm" className="h-9">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                
                <Button asChild size="sm" className="h-9">
                  <Link href="/products/add">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Add Product</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 mb-6 md:grid-cols-3">
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold mt-1 text-blue-600">
                  {loading ? '...' : stats.total.toLocaleString()}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Out of Stock</p>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  {loading ? '...' : stats.outOfStock.toLocaleString()}
                </p>
              </Card>
              <Card className="p-4">
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold mt-1 text-yellow-600">
                  {loading ? '...' : stats.lowStock.toLocaleString()}
                </p>
              </Card>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border shadow-sm">
              <ProductsTable searchTerm={searchQuery} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}