"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Package, AlertTriangle, Edit, Trash2, Archive, TrendingDown, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Warehouse {
  id: string;
  name: string;
  location: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

interface InventoryItem {
  id: string;
  quantity_in_stock: number;
  reorder_level: number;
  warehouse_location: string | null;
  last_restocked_at: string | null;
  product: {
    name: string;
    sku: string;
    selling_price: number;
  };
}

export default function WarehouseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const warehouseId = params.id as string;
  const supabase = createClient();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    totalValue: 0,
    pendingTransfers: 0,
  });
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const fetchData = async () => {
    try {
      setRefreshing(true);

      // Fetch warehouse details
      const { data: warehouseData, error: warehouseError } = await supabase
        .from("warehouses")
        .select("*")
        .eq("id", warehouseId)
        .single();

      if (warehouseError) throw warehouseError;
      setWarehouse(warehouseData);

      // Fetch inventory for this warehouse
      const { data: inventoryData, error: inventoryError } = await supabase
        .from("inventory")
        .select(`
          *,
          product:products(name, sku, selling_price)
        `)
        .eq("warehouse_id", warehouseId)
        .order("quantity_in_stock", { ascending: true })
        .limit(10);

      if (inventoryError) throw inventoryError;
      setInventory(inventoryData || []);

      // Calculate stats
      const { data: allInventory } = await supabase
        .from("inventory")
        .select("quantity_in_stock, reorder_level, product:products(selling_price)")
        .eq("warehouse_id", warehouseId);

      const totalItems = allInventory?.length || 0;
      const lowStockItems = allInventory?.filter((item: any) =>
        item.quantity_in_stock < item.reorder_level
      ).length || 0;

      const totalValue = allInventory?.reduce((sum: number, item: any) => {
        const price = parseFloat(item.product?.selling_price || 0);
        return sum + (price * item.quantity_in_stock);
      }, 0) || 0;

      // Fetch pending transfers
      const { data: transfersData } = await supabase
        .from("stock_transfers")
        .select("id")
        .or(`from_warehouse_id.eq.${warehouseId},to_warehouse_id.eq.${warehouseId}`)
        .in("status", ["pending", "approved"]);

      setStats({
        totalItems,
        lowStockItems,
        totalValue,
        pendingTransfers: transfersData?.length || 0,
      });
    } catch (error: any) {
      console.error("Error fetching warehouse data:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load warehouse details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (warehouseId) {
      fetchData();
    }
  }, [warehouseId]);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("warehouses")
        .delete()
        .eq("id", warehouseId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Warehouse deleted successfully",
      });
      
      router.push("/warehouses");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete warehouse",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!warehouse) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-red-600 mb-4" />
              <p className="text-muted-foreground mb-4">Warehouse not found</p>
              <Button onClick={() => router.push("/warehouses")}>
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                  <div className="flex items-center gap-4 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.back()}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-2xl">{warehouse.name}</CardTitle>
                        <Badge variant={warehouse.is_active ? "default" : "destructive"}>
                          {warehouse.is_active ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                      </div>
                      <CardDescription>Warehouse Details</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchData}
                      disabled={refreshing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/warehouses/add?id=${warehouseId}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Location Details */}
            <Card>
              <CardHeader>
                <CardTitle>Location Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {warehouse.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Area</p>
                      <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                    </div>
                  </div>
                )}

                {warehouse.address && (
                  <div>
                    <p className="text-sm font-semibold mb-1">Full Address</p>
                    <p className="text-sm text-muted-foreground">{warehouse.address}</p>
                  </div>
                )}

                <div className="flex gap-6">
                  {warehouse.city && (
                    <div>
                      <p className="text-xs text-muted-foreground">City</p>
                      <p className="text-sm font-semibold">{warehouse.city}</p>
                    </div>
                  )}
                  {warehouse.state && (
                    <div>
                      <p className="text-xs text-muted-foreground">State</p>
                      <p className="text-sm font-semibold">{warehouse.state}</p>
                    </div>
                  )}
                  {warehouse.postal_code && (
                    <div>
                      <p className="text-xs text-muted-foreground">PIN Code</p>
                      <p className="text-sm font-semibold">{warehouse.postal_code}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Inventory Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Items</p>
                        <p className="text-2xl font-bold">{stats.totalItems}</p>
                      </div>
                      <Package className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Low Stock</p>
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
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-bold">₹{(stats.totalValue / 1000).toFixed(1)}K</p>
                      </div>
                      <TrendingDown className="h-8 w-8 text-green-600" />
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
                      <Archive className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Inventory Items */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Items (Low Stock First)</CardTitle>
              </CardHeader>
              <CardContent>
                {inventory.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No inventory items in this warehouse
                  </p>
                ) : (
                  <div className="space-y-4">
                    {inventory.map((item) => {
                      const isLowStock = item.quantity_in_stock < item.reorder_level;

                      return (
                        <Card key={item.id}>
                          <CardContent className="pt-6">
                            <div className="space-y-3">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold">{item.product?.name || "Unknown Product"}</p>
                                  <p className="text-xs text-muted-foreground">SKU: {item.product?.sku || "N/A"}</p>
                                </div>
                                {isLowStock && (
                                  <Badge variant="destructive">LOW STOCK</Badge>
                                )}
                              </div>

                              <Separator />

                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs text-muted-foreground">In Stock</p>
                                  <p className="text-lg font-bold">{item.quantity_in_stock}</p>
                                </div>

                                <div>
                                  <p className="text-xs text-muted-foreground">Reorder Level</p>
                                  <p className="text-sm font-semibold">{item.reorder_level}</p>
                                </div>

                                {item.warehouse_location && (
                                  <div>
                                    <p className="text-xs text-muted-foreground">Location</p>
                                    <p className="text-sm font-semibold">{item.warehouse_location}</p>
                                  </div>
                                )}
                              </div>

                              {item.last_restocked_at && (
                                <p className="text-xs text-muted-foreground">
                                  Last restocked: {new Date(item.last_restocked_at).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delete Button */}
            <Card>
              <CardContent className="pt-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Warehouse
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Warehouse</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this warehouse? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Created: {new Date(warehouse.created_at).toLocaleString()}</p>
                  {warehouse.updated_at && warehouse.updated_at !== warehouse.created_at && (
                    <p>Last updated: {new Date(warehouse.updated_at).toLocaleString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
