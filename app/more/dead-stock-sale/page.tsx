"use client";

import { useState, useEffect } from "react";
import { TrendingDown, AlertTriangle, DollarSign, Package, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface DeadStockProduct {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  original_price: number;
  discount_percentage: number;
  sale_price: number;
  is_dead_stock: boolean;
  reason: string;
}

export default function DeadStockSalePage() {
  const [deadStock, setDeadStock] = useState<DeadStockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalValue: 0,
    itemCount: 0,
    potentialSavings: 0
  });
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchDeadStock();
  }, []);

  const fetchDeadStock = async () => {
    try {
      setRefreshing(true);

      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          sku,
          name,
          unit_price,
          is_dead_stock,
          dead_stock_discount,
          inventory (quantity_in_stock)
        `)
        .eq("is_dead_stock", true)
        .eq("is_active", true);

      if (error) throw error;

      const products = (data || []).map((p: any) => {
        const discount = p.dead_stock_discount || 20;
        const salePrice = p.unit_price * (1 - discount / 100);
        const quantity = p.inventory?.[0]?.quantity_in_stock || 0;

        return {
          id: p.id,
          sku: p.sku,
          name: p.name,
          quantity,
          original_price: p.unit_price,
          discount_percentage: discount,
          sale_price: salePrice,
          is_dead_stock: p.is_dead_stock,
          reason: "Low demand"
        };
      });

      setDeadStock(products);

      // Calculate stats
      const totalValue = products.reduce((sum: number, p: DeadStockProduct) =>
        sum + (p.sale_price * p.quantity), 0
      );
      const potentialSavings = products.reduce((sum: number, p: DeadStockProduct) =>
        sum + ((p.original_price - p.sale_price) * p.quantity), 0
      );

      setStats({
        totalValue,
        itemCount: products.length,
        potentialSavings
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const removeFromDeadStock = async (productId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from("products")
        .update({
          is_dead_stock: false,
          dead_stock_discount: 0,
          dead_stock_listed_at: null
        })
        .eq("id", productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product removed from dead stock",
      });
      fetchDeadStock();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card with Stats */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <TrendingDown className="h-6 w-6" />
                  <CardTitle className="text-2xl">Dead Stock Clearance</CardTitle>
                </div>
                <CardDescription>
                  Clear slow-moving inventory at discounted prices
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchDeadStock}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Package className="h-5 w-5 mx-auto mb-2" />
                <div className="text-3xl font-bold">{stats.itemCount}</div>
                <div className="text-xs text-muted-foreground">Items</div>
              </div>
              <div className="text-center">
                <DollarSign className="h-5 w-5 mx-auto mb-2" />
                <div className="text-3xl font-bold">₹{(stats.totalValue / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground">Value</div>
              </div>
              <div className="text-center">
                <TrendingDown className="h-5 w-5 mx-auto mb-2" />
                <div className="text-3xl font-bold">₹{(stats.potentialSavings / 1000).toFixed(0)}K</div>
                <div className="text-xs text-muted-foreground">Discount</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        {deadStock.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No dead stock items found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {deadStock.map((product) => (
              <Card key={product.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold">{product.name}</h3>
                        <p className="text-sm text-gray-600">SKU: {product.sku}</p>
                      </div>
                      <Badge variant="destructive" className="text-lg px-3 py-1">
                        {product.discount_percentage}% OFF
                      </Badge>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500 line-through">
                          ₹{product.original_price.toFixed(2)}
                        </p>
                        <p className="text-2xl font-bold">
                          ₹{product.sale_price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Stock: {product.quantity} units</p>
                        <p className="text-xs text-muted-foreground">{product.reason}</p>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => removeFromDeadStock(product.id)}
                      disabled={loading}
                    >
                      Remove from Sale
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <h3 className="text-sm font-semibold">About Dead Stock Sales</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Clear slow-moving inventory quickly</li>
              <li>• Recover capital tied up in stock</li>
              <li>• Attract price-sensitive customers</li>
              <li>• Make room for new inventory</li>
            </ul>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
