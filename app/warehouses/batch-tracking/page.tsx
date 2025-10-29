"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, AlertTriangle, Calendar, Warehouse, TrendingUp, XCircle, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export default function BatchTrackingPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [batches, setBatches] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalBatches: 0,
    expiringBatches: 0,
    expiredBatches: 0,
    totalQuantity: 0,
  });

  const fetchData = async () => {
    try {
      setRefreshing(true);

      // Fetch all inventory batches with product and warehouse details
      const { data: batchesData, error: batchesError } = await supabase
        .from("inventory_batches")
        .select(`
          *,
          product:products(name, sku),
          warehouse:warehouses(name, location)
        `)
        .order("expiry_date", { ascending: true });

      if (batchesError) throw batchesError;
      setBatches(batchesData || []);

      // Calculate stats
      const today = new Date().toISOString().split("T")[0];
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      const thirtyDaysDate = thirtyDaysLater.toISOString().split("T")[0];

      const total = batchesData?.length || 0;
      const totalQty = batchesData?.reduce((sum: number, b: any) => sum + b.quantity, 0) || 0;

      const expired = batchesData?.filter((b: any) =>
        b.expiry_date && b.expiry_date < today
      ).length || 0;

      const expiring = batchesData?.filter((b: any) =>
        b.expiry_date && b.expiry_date >= today && b.expiry_date <= thirtyDaysDate
      ).length || 0;

      setStats({
        totalBatches: total,
        expiringBatches: expiring,
        expiredBatches: expired,
        totalQuantity: totalQty,
      });
    } catch (error: any) {
      console.error("Error fetching batches:", error);
      toast({
        title: "Error",
        description: "Failed to fetch batch data",
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

  const getBatchStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: "No Expiry", variant: "secondary" as const, icon: Package };

    const today = new Date().toISOString().split("T")[0];
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
    const thirtyDaysDate = thirtyDaysLater.toISOString().split("T")[0];

    if (expiryDate < today) {
      return { status: "EXPIRED", variant: "destructive" as const, icon: XCircle };
    } else if (expiryDate <= thirtyDaysDate) {
      return { status: "EXPIRING SOON", variant: "outline" as const, icon: AlertTriangle };
    } else {
      return { status: "ACTIVE", variant: "default" as const, icon: Package };
    }
  };

  const getDaysUntilExpiry = (expiryDate: string | null) => {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
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
                      <CardTitle className="text-2xl">Batch Tracking</CardTitle>
                      <CardDescription>Monitor inventory batches and expiry dates</CardDescription>
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
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Batches</p>
                      <p className="text-2xl font-bold">{stats.totalBatches}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Units</p>
                      <p className="text-2xl font-bold">{stats.totalQuantity}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-yellow-700">Expiring Soon</p>
                      <p className="text-2xl font-bold text-yellow-900">{stats.expiringBatches}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700">Expired</p>
                      <p className="text-2xl font-bold text-red-900">{stats.expiredBatches}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Batches List */}
            <Card>
              <CardHeader>
                <CardTitle>All Batches</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    <p className="text-sm text-muted-foreground mt-2">Loading batches...</p>
                  </div>
                ) : batches.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">No inventory batches found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batches.map((batch) => {
                      const statusInfo = getBatchStatus(batch.expiry_date);
                      const daysUntilExpiry = getDaysUntilExpiry(batch.expiry_date);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <Card key={batch.id} className={
                          statusInfo.status === "EXPIRED" ? "border-red-300" :
                          statusInfo.status === "EXPIRING SOON" ? "border-yellow-300" :
                          ""
                        }>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold text-base">
                                    {batch.product?.name || "Unknown Product"}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Batch: {batch.batch_number}
                                  </p>
                                  {batch.product?.sku && (
                                    <p className="text-xs text-muted-foreground">
                                      SKU: {batch.product.sku}
                                    </p>
                                  )}
                                </div>
                                <Badge variant={statusInfo.variant}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo.status}
                                </Badge>
                              </div>

                              <Separator />

                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-xs text-muted-foreground">Quantity</p>
                                  <p className="text-lg font-bold">{batch.quantity}</p>
                                </div>

                                {batch.warehouse && (
                                  <div className="flex items-center gap-2">
                                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-xs text-muted-foreground">Warehouse</p>
                                      <p className="text-sm font-semibold">{batch.warehouse.name}</p>
                                    </div>
                                  </div>
                                )}

                                {batch.cost_price && (
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Cost/Unit</p>
                                    <p className="text-sm font-semibold">
                                      ₹{parseFloat(batch.cost_price).toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2 pt-2 border-t">
                                {batch.manufactured_date && (
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Manufactured</span>
                                    <span className="font-semibold">
                                      {new Date(batch.manufactured_date).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}

                                {batch.expiry_date && (
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Expiry Date</span>
                                    <span className={`font-semibold ${
                                      statusInfo.status === "EXPIRED" ? "text-red-600" :
                                      statusInfo.status === "EXPIRING SOON" ? "text-yellow-600" :
                                      ""
                                    }`}>
                                      {new Date(batch.expiry_date).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}

                                {daysUntilExpiry !== null && (
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Days Until Expiry</span>
                                    <span className={`font-bold ${
                                      daysUntilExpiry < 0 ? "text-red-600" :
                                      daysUntilExpiry <= 30 ? "text-yellow-600" :
                                      "text-green-600"
                                    }`}>
                                      {daysUntilExpiry < 0 
                                        ? `Expired ${Math.abs(daysUntilExpiry)} days ago` 
                                        : `${daysUntilExpiry} days`}
                                    </span>
                                  </div>
                                )}

                                {batch.received_date && (
                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Received</span>
                                    <span className="font-semibold">
                                      {new Date(batch.received_date).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {batch.notes && (
                                <div className="p-2 bg-gray-50 rounded">
                                  <p className="text-xs text-muted-foreground">
                                    Note: {batch.notes}
                                  </p>
                                </div>
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

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-xs font-semibold text-blue-900 mb-2">Batch Status Guide:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold">Expired:</span> Past expiry date
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <AlertTriangle className="h-3 w-3 text-yellow-600" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold">Expiring Soon:</span> Within 30 days
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Package className="h-3 w-3 text-green-600" />
                    <span className="text-muted-foreground">
                      <span className="font-semibold">Active:</span> More than 30 days
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
