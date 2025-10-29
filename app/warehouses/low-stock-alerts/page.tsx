"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle, Package, TrendingDown, Warehouse, ShoppingCart, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function LowStockAlertsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    totalValue: 0,
    warehousesAffected: 0,
  });

  const fetchData = async () => {
    try {
      setRefreshing(true);

      // Fetch low stock items (quantity below reorder level)
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .select(`
          *,
          product:products(name, sku, selling_price),
          warehouse:warehouses(name, location)
        `)
        .order("quantity_in_stock", { ascending: true });

      if (inventoryError) throw inventoryError;

      // Filter items where quantity is below reorder level
      const lowStock = inventoryData?.filter((item: any) =>
        item.quantity_in_stock < item.reorder_level
      ) || [];

      setLowStockItems(lowStock);

      // Calculate stats
      const critical = lowStock.filter((item: any) =>
        item.quantity_in_stock <= item.reorder_level * 0.3 // 30% or less of reorder level
      ).length;

      const totalValue = lowStock.reduce((sum: number, item: any) => {
        const price = parseFloat(item.product?.selling_price || 0);
        return sum + (price * item.quantity_in_stock);
      }, 0);

      const uniqueWarehouses = new Set(lowStock.map((item: any) => item.warehouse_id)).size;

      setStats({
        totalAlerts: lowStock.length,
        criticalAlerts: critical,
        totalValue,
        warehousesAffected: uniqueWarehouses,
      });
    } catch (error: any) {
      console.error("Error fetching low stock items:", error);
      toast({
        title: "Error",
        description: "Failed to fetch low stock alerts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getAlertSeverity = (currentQty: number, reorderLevel: number) => {
    const percentage = (currentQty / reorderLevel) * 100;

    if (percentage <= 30) {
      return {
        label: "CRITICAL",
        variant: "destructive" as const,
        barColor: "bg-red-600",
      };
    } else if (percentage <= 60) {
      return {
        label: "HIGH",
        variant: "outline" as const,
        barColor: "bg-yellow-600",
      };
    } else {
      return {
        label: "MODERATE",
        variant: "secondary" as const,
        barColor: "bg-gray-600",
      };
    }
  };

  const calculateReorderQty = (item: any) => {
    const needed = item.reorder_level - item.quantity_in_stock;
    const reorderQty = item.reorder_quantity || 50;
    return Math.max(needed, reorderQty);
  };

  const handleCreatePO = (item: any) => {
    toast({
      title: "Info",
      description: "Purchase Order creation feature coming soon",
    });
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <CardTitle className="text-2xl">Low Stock Alerts</CardTitle>
                      <CardDescription>Items below reorder level</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchData}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700">Total Alerts</p>
                      <p className="text-2xl font-bold text-red-900">{stats.totalAlerts}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700">Critical</p>
                      <p className="text-2xl font-bold text-red-900">{stats.criticalAlerts}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-700" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Stock Value</p>
                      <p className="text-xl font-bold">₹{(stats.totalValue / 1000).toFixed(1)}K</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Warehouses</p>
                      <p className="text-xl font-bold">{stats.warehousesAffected}</p>
                    </div>
                    <Warehouse className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Low Stock Items */}
            <Card>
              <CardHeader>
                <CardTitle>Items Needing Restock</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    <p className="text-sm text-muted-foreground mt-2">Loading alerts...</p>
                  </div>
                ) : lowStockItems.length === 0 ? (
                  <div className="text-center py-12 bg-green-50 rounded-lg border border-green-200">
                    <Package className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <p className="font-semibold text-green-900 mb-2">All Good!</p>
                    <p className="text-sm text-green-700">No low stock alerts at this time</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lowStockItems.map((item) => {
                      const severity = getAlertSeverity(item.quantity_in_stock, item.reorder_level);
                      const reorderQty = calculateReorderQty(item);
                      const stockPercentage = (item.quantity_in_stock / item.reorder_level) * 100;

                      return (
                        <Card key={item.id} className={
                          severity.label === "CRITICAL" ? "border-red-300" :
                          severity.label === "HIGH" ? "border-yellow-300" :
                          ""
                        }>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold text-base">
                                    {item.product?.name || "Unknown Product"}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    SKU: {item.product?.sku || "N/A"}
                                  </p>
                                  {item.warehouse && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Warehouse className="h-3 w-3 text-muted-foreground" />
                                      <p className="text-xs text-muted-foreground">
                                        {item.warehouse.name}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <Badge variant={severity.variant}>
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {severity.label}
                                </Badge>
                              </div>

                              {/* Stock Level Bar */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">Stock Level</span>
                                  <span className="font-bold">
                                    {item.quantity_in_stock} / {item.reorder_level}
                                  </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${severity.barColor}`}
                                    style={{ width: `${Math.min(stockPercentage, 100)}%` }}
                                  />
                                </div>
                              </div>

                              <Separator />

                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs text-muted-foreground">Current Stock</p>
                                  <p className={`text-lg font-bold ${
                                    severity.label === "CRITICAL" ? "text-red-600" :
                                    severity.label === "HIGH" ? "text-yellow-600" :
                                    ""
                                  }`}>
                                    {item.quantity_in_stock}
                                  </p>
                                </div>

                                <div className="text-center">
                                  <p className="text-xs text-muted-foreground">Reorder Level</p>
                                  <p className="text-lg font-bold">{item.reorder_level}</p>
                                </div>

                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">Shortage</p>
                                  <p className="text-lg font-bold text-red-600">
                                    {item.reorder_level - item.quantity_in_stock}
                                  </p>
                                </div>
                              </div>

                              <div className={`p-2 rounded ${
                                severity.label === "CRITICAL" ? "bg-red-50" :
                                severity.label === "HIGH" ? "bg-yellow-50" :
                                "bg-gray-50"
                              }`}>
                                <div className="flex items-center gap-2">
                                  <ShoppingCart className={`h-4 w-4 ${
                                    severity.label === "CRITICAL" ? "text-red-600" :
                                    severity.label === "HIGH" ? "text-yellow-600" :
                                    "text-gray-600"
                                  }`} />
                                  <p className={`text-xs font-semibold ${
                                    severity.label === "CRITICAL" ? "text-red-600" :
                                    severity.label === "HIGH" ? "text-yellow-600" :
                                    "text-gray-600"
                                  }`}>
                                    Suggested Reorder: {reorderQty} units
                                  </p>
                                </div>
                              </div>

                              {item.warehouse_location && (
                                <p className="text-xs text-muted-foreground">
                                  Location: {item.warehouse_location}
                                </p>
                              )}

                              {item.last_restocked_at && (
                                <p className="text-xs text-muted-foreground">
                                  Last restocked: {new Date(item.last_restocked_at).toLocaleDateString()}
                                </p>
                              )}

                              <Button
                                size="sm"
                                onClick={() => handleCreatePO(item)}
                                className="w-full"
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Create Purchase Order
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alert Severity Guide */}
            <Card className="bg-gray-50">
              <CardContent className="pt-6">
                <p className="text-xs font-semibold mb-2">Alert Severity Levels:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <AlertTriangle className="h-3 w-3 text-red-600" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold">Critical:</span> ≤30% of reorder level
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold">High:</span> 31-60% of reorder level
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <TrendingDown className="h-3 w-3 text-gray-600" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold">Moderate:</span> 61-99% of reorder level
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
