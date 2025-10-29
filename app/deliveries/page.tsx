"use client";

import { useState, useEffect } from "react";
import { Truck, RefreshCw, Package, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Delivery {
  id: string;
  delivery_number: string;
  carrier: string | null;
  tracking_number: string | null;
  status: string;
  recipient_name: string;
  delivery_address: string;
  scheduled_date: string | null;
  created_at: string;
  order_id: string | null;
  orders?: {
    order_number: string;
  };
}

interface Order {
  id: string;
  order_number: string;
  retailers?: {
    name: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
  };
}

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);

  // Create Delivery Form
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().split('T')[0]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [creating, setCreating] = useState(false);

  // Update Status Form
  const [newStatus, setNewStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const { toast } = useToast();
  const supabase = createClient();

  const fetchDeliveries = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from("deliveries")
        .select("*, orders (*)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setDeliveries((data as Delivery[]) || []);
    } catch (error: any) {
      console.error("Error fetching deliveries:", error);
      toast({
        title: "Error",
        description: "Failed to fetch deliveries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchOrders = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, retailers(*)")
      .in("status", ["confirmed", "processing", "shipped"])
      .order("created_at", { ascending: false });
    if (data) setOrders(data as Order[]);
  };

  const loadOrderData = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, retailers(*)")
      .eq("id", selectedOrder)
      .single();
    if (data && data.retailers) {
      setRecipientName(data.retailers.name);
      setRecipientPhone(data.retailers.phone || "");
      setDeliveryAddress(
        `${data.retailers.address || ""}, ${data.retailers.city || ""}, ${data.retailers.state || ""} ${data.retailers.postal_code || ""}`
      );
    }
  };

  const handleCreateDelivery = async () => {
    if (!selectedOrder || !recipientName) {
      toast({
        title: "Error",
        description: "Order and recipient name are required",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const deliveryNumber = `DEL-${Date.now()}`;
      const { error } = await supabase.from("deliveries").insert({
        order_id: selectedOrder,
        delivery_number: deliveryNumber,
        status: "pending",
        carrier: carrier || null,
        tracking_number: trackingNumber || null,
        scheduled_date: scheduledDate,
        delivery_address: deliveryAddress || null,
        recipient_name: recipientName,
        recipient_phone: recipientPhone || null,
        notes: notes || null,
      });

      if (error) throw error;

      // Update order status to shipped
      await supabase.from("orders").update({ status: "shipped" }).eq("id", selectedOrder);

      toast({
        title: "Success",
        description: "Delivery created successfully",
      });
      
      setCreateDialogOpen(false);
      resetCreateForm();
      fetchDeliveries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create delivery",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedDelivery) return;

    setUpdating(true);
    try {
      const updates: any = { status: newStatus };

      if (newStatus === "delivered") {
        updates.delivered_date = new Date().toISOString();
        // Update order status to delivered
        if (selectedDelivery.order_id) {
          await supabase
            .from("orders")
            .update({ status: "delivered" })
            .eq("id", selectedDelivery.order_id);
        }
      }

      const { error } = await supabase
        .from("deliveries")
        .update(updates)
        .eq("id", selectedDelivery.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Delivery status updated successfully",
      });
      
      setUpdateDialogOpen(false);
      fetchDeliveries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const resetCreateForm = () => {
    setSelectedOrder("");
    setCarrier("");
    setTrackingNumber("");
    setScheduledDate(new Date().toISOString().split('T')[0]);
    setDeliveryAddress("");
    setRecipientName("");
    setRecipientPhone("");
    setNotes("");
  };

  const openUpdateDialog = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setNewStatus(delivery.status);
    setUpdateDialogOpen(true);
  };

  useEffect(() => {
    fetchDeliveries();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrder) loadOrderData();
  }, [selectedOrder]);

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    if (status === "delivered") return "default";
    if (status === "failed") return "destructive";
    return "secondary";
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
                  <div>
                    <div className="flex items-center gap-3">
                      <Truck className="h-6 w-6" />
                      <CardTitle className="text-2xl">Deliveries</CardTitle>
                    </div>
                    <CardDescription>
                      Manage and track all your deliveries
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="default" size="sm">
                          + Create Delivery
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Create Delivery</DialogTitle>
                          <DialogDescription>
                            Create a new delivery for an order
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="order">Order *</Label>
                            <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select order" />
                              </SelectTrigger>
                              <SelectContent>
                                {orders.map((order) => (
                                  <SelectItem key={order.id} value={order.id}>
                                    {order.order_number} - {order.retailers?.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="carrier">Carrier</Label>
                            <Input
                              id="carrier"
                              placeholder="e.g., FedEx, UPS, DHL"
                              value={carrier}
                              onChange={(e) => setCarrier(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="tracking">Tracking Number</Label>
                            <Input
                              id="tracking"
                              placeholder="Tracking number"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="date">Scheduled Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={scheduledDate}
                              onChange={(e) => setScheduledDate(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="recipient">Recipient Name *</Label>
                            <Input
                              id="recipient"
                              placeholder="Recipient name"
                              value={recipientName}
                              onChange={(e) => setRecipientName(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="phone">Recipient Phone</Label>
                            <Input
                              id="phone"
                              placeholder="Phone number"
                              value={recipientPhone}
                              onChange={(e) => setRecipientPhone(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="address">Delivery Address</Label>
                            <Textarea
                              id="address"
                              placeholder="Full delivery address"
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                              id="notes"
                              placeholder="Delivery instructions..."
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                            />
                          </div>

                          <Button
                            className="w-full"
                            onClick={handleCreateDelivery}
                            disabled={creating}
                          >
                            {creating ? "Creating..." : "Create Delivery"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchDeliveries}
                      disabled={refreshing}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Deliveries List */}
            <Card>
              <CardHeader>
                <CardTitle>All Deliveries ({deliveries.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
                    <p className="text-sm text-muted-foreground mt-2">Loading deliveries...</p>
                  </div>
                ) : deliveries.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-muted-foreground">No deliveries found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveries.map((delivery) => (
                      <Card 
                        key={delivery.id} 
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openUpdateDialog(delivery)}
                      >
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg">{delivery.delivery_number}</h3>
                                {delivery.carrier && (
                                  <p className="text-sm text-muted-foreground">
                                    Carrier: {delivery.carrier}
                                  </p>
                                )}
                                {delivery.tracking_number && (
                                  <p className="text-sm text-muted-foreground">
                                    Tracking: {delivery.tracking_number}
                                  </p>
                                )}
                              </div>
                              <Badge variant={getStatusVariant(delivery.status)}>
                                {delivery.status}
                              </Badge>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <p className="text-sm font-medium">{delivery.recipient_name}</p>
                                </div>
                                <p className="text-xs text-muted-foreground ml-6">
                                  {delivery.delivery_address}
                                </p>
                              </div>
                              {delivery.scheduled_date && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {new Date(delivery.scheduled_date).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Update Status Dialog */}
            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Delivery Status</DialogTitle>
                  <DialogDescription>
                    {selectedDelivery?.delivery_number}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Current Status</Label>
                    <p className="text-sm text-muted-foreground">
                      {selectedDelivery?.status}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Update Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_transit">In Transit</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleUpdateStatus}
                    disabled={updating || newStatus === selectedDelivery?.status}
                  >
                    {updating ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}