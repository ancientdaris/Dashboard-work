"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase";
import { DollarSign, Plus, Search, Package, TrendingDown, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ProductPricing {
  id: string;
  wholesaler_id: string;
  product_id: string;
  price: number;
  discount_percentage: number | null;
  min_order_quantity: number | null;
  max_order_quantity: number | null;
  stock_available: number | null;
  is_available: boolean | null;
  delivery_time_days: number | null;
  last_updated: string | null;
  created_at: string | null;
  updated_at: string | null;
  products?: {
    name: string;
    sku: string;
  };
}

export default function PricingPage() {
  const supabase = createClient();
  const [pricingData, setPricingData] = useState<ProductPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wholesaler_product_pricing")
        .select(`
          *,
          products (
            name,
            sku
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPricingData(data || []);
    } catch (error) {
      console.error("Error fetching pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPricing = pricingData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.products?.name.toLowerCase().includes(query) ||
      item.products?.sku.toLowerCase().includes(query) ||
      item.price.toString().includes(query)
    );
  });

  const totalProducts = pricingData.length;
  const availableProducts = pricingData.filter((p) => p.is_available).length;
  const avgDiscount = pricingData.length > 0
    ? pricingData.reduce((sum, p) => sum + (p.discount_percentage || 0), 0) / pricingData.length
    : 0;

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container p-4 md:p-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Product Pricing
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage wholesaler product pricing and availability
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Pricing
              </Button>
            </div>

            {/* Stats */}
            {!loading && pricingData.length > 0 && (
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Products
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {totalProducts}
                        </p>
                      </div>
                      <div className="rounded-lg bg-blue-100 p-3">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Available Products
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {availableProducts}
                        </p>
                      </div>
                      <div className="rounded-lg bg-green-100 p-3">
                        <DollarSign className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Avg. Discount
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {avgDiscount.toFixed(1)}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-orange-100 p-3">
                        <TrendingDown className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by product name, SKU, or price..."
                  className="pl-10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Pricing Table */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading pricing data...</div>
              </div>
            ) : filteredPricing.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <DollarSign className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No pricing data found</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : "Get started by adding product pricing"}
                  </p>
                  {!searchQuery && (
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Pricing
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Discount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Min/Max Qty
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Delivery
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPricing.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.products?.name || "Unknown Product"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  SKU: {item.products?.sku || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900">
                                ₹{item.price.toFixed(2)}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              {item.discount_percentage ? (
                                <Badge variant="secondary" className="gap-1">
                                  <TrendingDown className="h-3 w-3" />
                                  {item.discount_percentage}%
                                </Badge>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">
                                {item.min_order_quantity || 1} - {item.max_order_quantity || "∞"}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">
                                {item.stock_available !== null ? item.stock_available : "N/A"}
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              {item.delivery_time_days ? (
                                <div className="flex items-center gap-1 text-sm text-gray-900">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  {item.delivery_time_days} days
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={item.is_available ? "default" : "secondary"}>
                                {item.is_available ? "Available" : "Unavailable"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
