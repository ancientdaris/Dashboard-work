"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Warehouse, Package, AlertTriangle, TrendingUp, Plus, ChevronRight, MapPin, Archive, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface WarehouseData {
  id: string;
  name: string;
  location: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  is_active: boolean;
  created_at: string;
}

export default function WarehousesPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalWarehouses: 0,
    activeWarehouses: 0,
    lowStockItems: 0,
    pendingTransfers: 0,
  });

  const fetchData = async () => {
    try {
      setRefreshing(true);
      
      // Fetch warehouses
      const { data: warehousesData, error: warehousesError } = await supabase
        .from("warehouses")
        .select("*")
        .order("created_at", { ascending: false });

      if (warehousesError) throw warehousesError;
      setWarehouses(warehousesData || []);

      // Calculate stats
      const total = warehousesData?.length || 0;
      const active = warehousesData?.filter((w: any) => w.is_active).length || 0;

      // Fetch low stock items
      const { data: inventoryData } = await supabase
        .from("inventory")
        .select("id, quantity_in_stock, reorder_level");

      const lowStock = inventoryData?.filter(
        (item: any) => item.quantity_in_stock < item.reorder_level
      ).length || 0;

      // Fetch pending stock transfers
      const { data: transfersData } = await supabase
        .from("stock_transfers")
        .select("id")
        .in("status", ["pending", "approved"]);

      setStats({
        totalWarehouses: total,
        activeWarehouses: active,
        lowStockItems: lowStock,
        pendingTransfers: transfersData?.length || 0,
      });
    } catch (error: any) {
      console.error("Error fetching warehouses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch warehouses",
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
                  <div>
                    <div className="flex items-center gap-3">
                      <Warehouse className="h-6 w-6" />
                      <CardTitle className="text-2xl">Warehouses</CardTitle>
                    </div>
                    <CardDescription>
                      Manage your warehouse locations and inventory
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => router.push("/warehouses/add")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Warehouse
                    </Button>
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
                </div>
              </CardHeader>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Warehouses</p>
                      <p className="text-2xl font-bold">{stats.totalWarehouses}</p>
                    </div>
                    <Warehouse className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="text-2xl font-bold">{stats.activeWarehouses}</p>
                    </div>
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Low Stock Items</p>
                      <p className="text-2xl font-bold">{stats.lowStockItems}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Transfers</p>
                      <p className="text-2xl font-bold">{stats.pendingTransfers}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Warehouses List */}
            <Card>
              <CardHeader>
                <CardTitle>All Warehouses</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    <p className="text-sm text-muted-foreground mt-2">Loading warehouses...</p>
                  </div>
                ) : warehouses.length === 0 ? (
                  <div className="text-center py-12">
                    <Warehouse className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground mb-4">No warehouses found. Add your first warehouse to get started.</p>
                    <Button onClick={() => router.push("/warehouses/add")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Warehouse
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {warehouses.map((warehouse) => (
                      <Card
                        key={warehouse.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => router.push(`/warehouses/${warehouse.id}`)}
                      >
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-bold text-lg">{warehouse.name}</h3>
                                <Badge variant={warehouse.is_active ? "default" : "destructive"}>
                                  {warehouse.is_active ? "ACTIVE" : "INACTIVE"}
                                </Badge>
                              </div>

                              {warehouse.location && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{warehouse.location}</span>
                                </div>
                              )}

                              {warehouse.address && (
                                <p className="text-xs text-muted-foreground">
                                  {warehouse.address}
                                  {warehouse.city && `, ${warehouse.city}`}
                                  {warehouse.state && `, ${warehouse.state}`}
                                </p>
                              )}
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Card 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push("/warehouses/stock-transfers")}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Archive className="h-6 w-6 text-blue-600" />
                        <div>
                          <p className="font-semibold">Stock Transfers</p>
                          <p className="text-xs text-muted-foreground">Manage inter-warehouse transfers</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push("/warehouses/batch-tracking")}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-6 w-6 text-green-600" />
                        <div>
                          <p className="font-semibold">Batch Tracking</p>
                          <p className="text-xs text-muted-foreground">View batches and expiry dates</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push("/warehouses/low-stock-alerts")}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                        <div>
                          <p className="font-semibold">Low Stock Alerts</p>
                          <p className="text-xs text-muted-foreground">Items below reorder level</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
