"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Loader2, Plus, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import type { Database } from "@/types/database.types";

type Retailer = Database['public']['Tables']['retailers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export default function CreateOrderPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [buyerMode, setBuyerMode] = useState<'select' | 'create'>('select');
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState('');

  // New retailer fields
  const [newRetailerName, setNewRetailerName] = useState('');
  const [newRetailerEmail, setNewRetailerEmail] = useState('');
  const [newRetailerPhone, setNewRetailerPhone] = useState('');
  const [newRetailerAddress, setNewRetailerAddress] = useState('');
  const [newRetailerCity, setNewRetailerCity] = useState('');
  const [newRetailerState, setNewRetailerState] = useState('');

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const [discountPercent, setDiscountPercent] = useState('0');

  useEffect(() => {
    fetchRetailers();
    fetchProducts();
  }, []);

  const fetchRetailers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('retailers')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (data) setRetailers(data);
  };

  const fetchProducts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (data) setProducts(data);
  };

  const addItem = () => {
    if (!selectedProduct || !quantity) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const qty = parseInt(quantity);
    const lineTotal = qty * Number(product.unit_price);

    const newItem: OrderItem = {
      product_id: product.id,
      product_name: product.name,
      quantity: qty,
      unit_price: Number(product.unit_price),
      line_total: lineTotal,
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct('');
    setQuantity('1');
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const discountAmount = subtotal * (parseFloat(discountPercent) / 100);
    const totalAmount = subtotal + taxAmount - discountAmount;

    return { subtotal, taxAmount, discountAmount, totalAmount };
  };

  const createNewRetailer = async () => {
    if (!newRetailerName) {
      throw new Error('Name is required');
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from('retailers')
      .insert({
        name: newRetailerName,
        email: newRetailerEmail || null,
        phone: newRetailerPhone || null,
        address: newRetailerAddress || null,
        city: newRetailerCity || null,
        state: newRetailerState || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data.id;
  };

  const handleCreateOrder = async () => {
    let retailerId: string | null = null;

    // Validate based on mode
    if (buyerMode === 'select') {
      retailerId = selectedRetailer;
      if (!retailerId) {
        setErrorMessage('Please select a retailer');
        return;
      }
    } else {
      if (!newRetailerName) {
        setErrorMessage('Please enter a name for the new retailer');
        return;
      }
    }

    if (orderItems.length === 0) {
      setErrorMessage('Please add at least one item');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Create new retailer if in create mode
      if (buyerMode === 'create') {
        retailerId = await createNewRetailer();
      }

      const { subtotal, taxAmount, discountAmount, totalAmount } = calculateTotals();
      const orderNumber = `ORD-${Date.now()}`;

      const supabase = createClient();

      // Create order
      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          retailer_id: retailerId,
          status,
          subtotal,
          tax_amount: taxAmount,
          discount_amount: discountAmount,
          total_amount: totalAmount,
          notes,
          created_by: user?.id,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const itemsToInsert = orderItems.map(item => ({
        order_id: createdOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: 0.1,
        discount_amount: 0,
        line_total: item.line_total,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      setSuccessMessage('Order created successfully');
      setTimeout(() => router.push('/orders'), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/orders')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Orders
              </Button>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Create Order</h1>
              <p className="text-muted-foreground mt-1">
                Create a new order for your customer
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {successMessage && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Buyer Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Details</CardTitle>
                <CardDescription>Select an existing retailer or create a new one</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mode Toggle Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant={buyerMode === 'select' ? 'default' : 'outline'}
                    onClick={() => setBuyerMode('select')}
                    className="flex-1"
                  >
                    Select Existing
                  </Button>
                  <Button
                    variant={buyerMode === 'create' ? 'default' : 'outline'}
                    onClick={() => setBuyerMode('create')}
                    className="flex-1"
                  >
                    Create New
                  </Button>
                </div>

                {/* Conditional Buyer Selection or Creation */}
                {buyerMode === 'select' ? (
                  <div className="space-y-2">
                    <Label htmlFor="retailer">Select Retailer *</Label>
                    <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
                      <SelectTrigger id="retailer">
                        <SelectValue placeholder="Choose a retailer" />
                      </SelectTrigger>
                      <SelectContent>
                        {retailers.map(retailer => (
                          <SelectItem key={retailer.id} value={retailer.id}>
                            {retailer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter retailer name"
                        value={newRetailerName}
                        onChange={(e) => setNewRetailerName(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={newRetailerEmail}
                          onChange={(e) => setNewRetailerEmail(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="Phone number"
                          value={newRetailerPhone}
                          onChange={(e) => setNewRetailerPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Street address"
                        value={newRetailerAddress}
                        onChange={(e) => setNewRetailerAddress(e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="City"
                          value={newRetailerCity}
                          onChange={(e) => setNewRetailerCity(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="State"
                          value={newRetailerState}
                          onChange={(e) => setNewRetailerState(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Order status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount %</Label>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="0"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add Items */}
            <Card>
              <CardHeader>
                <CardTitle>Add Items</CardTitle>
                <CardDescription>Select products and quantities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                    <SelectTrigger id="product">
                      <SelectValue placeholder="Choose a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - ₹{Number(product.unit_price).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  <Button onClick={addItem} disabled={!selectedProduct || !quantity}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Order Items List */}
            {orderItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-semibold">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.quantity} × ₹{item.unit_price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-bold">₹{item.line_total.toFixed(2)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      {index < orderItems.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Order Summary */}
            {orderItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span>₹{totals.taxAmount.toFixed(2)}</span>
                  </div>
                  {parseFloat(discountPercent) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount ({discountPercent}%)</span>
                      <span className="text-red-600">-₹{totals.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-600">₹{totals.totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any notes about this order..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>

            {/* Create Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleCreateOrder}
                disabled={
                  loading ||
                  orderItems.length === 0 ||
                  (buyerMode === 'select' ? !selectedRetailer : !newRetailerName)
                }
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Order'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
