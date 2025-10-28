"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/hooks/useAuth";
import type { Database } from "@/types/database.types";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Order = Database['public']['Tables']['orders']['Row'];
type Retailer = Database['public']['Tables']['retailers']['Row'];

export default function CreateInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const routeOrderId = searchParams.get('orderId');

  const [orders, setOrders] = useState<Order[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(routeOrderId || 'none');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchRetailers();
    // Set due date to 30 days from now
    const due = new Date();
    due.setDate(due.getDate() + 30);
    setDueDate(due.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (selectedOrder && selectedOrder !== 'none') {
      loadOrderData();
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*, retailers(*)')
      .in('status', ['confirmed', 'processing', 'shipped', 'delivered'])
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const fetchRetailers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('retailers')
      .select('*')
      .order('name');
    if (data) setRetailers(data);
  };

  const loadOrderData = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', selectedOrder)
      .single();

    if (data) {
      setSelectedRetailer(data.retailer_id || '');
      setSubtotal(data.subtotal.toString());
      setTaxAmount(data.tax_amount.toString());
      setDiscountAmount(data.discount_amount.toString());
      setNotes(data.notes || '');
    }
  };

  const calculateTotal = () => {
    const sub = parseFloat(subtotal) || 0;
    const tax = parseFloat(taxAmount) || 0;
    const discount = parseFloat(discountAmount) || 0;
    return sub + tax - discount;
  };

  const handleCreateInvoice = async () => {
    if (!selectedRetailer || !issueDate || !dueDate || !subtotal) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const invoiceNumber = `INV-${Date.now()}`;
      const totalAmount = calculateTotal();

      const { error } = await supabase.from('invoices').insert({
        invoice_number: invoiceNumber,
        order_id: selectedOrder && selectedOrder !== 'none' ? selectedOrder : null,
        retailer_id: selectedRetailer,
        status: 'draft',
        issue_date: issueDate,
        due_date: dueDate,
        subtotal: parseFloat(subtotal),
        tax_amount: parseFloat(taxAmount) || 0,
        discount_amount: parseFloat(discountAmount) || 0,
        total_amount: totalAmount,
        notes,
        created_by: user?.id,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      
      setTimeout(() => router.push('/invoices'), 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to create invoice',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-full mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/invoices')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Invoices
              </Button>
            </div>

            {/* Title Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Create Invoice</CardTitle>
                <CardDescription>
                  Generate a new invoice for your customer
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Order Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Link to Order (Optional)</CardTitle>
                <CardDescription>Select an existing order to auto-fill details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="order">From Order</Label>
                  <Select value={selectedOrder} onValueChange={setSelectedOrder}>
                    <SelectTrigger id="order">
                      <SelectValue placeholder="Select an order (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {orders.map((order) => (
                        <SelectItem key={order.id} value={order.id}>
                          {order.order_number} - ₹{Number(order.total_amount).toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>Select the customer for this invoice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="retailer">Retailer *</Label>
                  <Select value={selectedRetailer} onValueChange={setSelectedRetailer}>
                    <SelectTrigger id="retailer">
                      <SelectValue placeholder="Select retailer" />
                    </SelectTrigger>
                    <SelectContent>
                      {retailers.map((retailer) => (
                        <SelectItem key={retailer.id} value={retailer.id}>
                          {retailer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Invoice Dates */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Dates</CardTitle>
                <CardDescription>Set issue and due dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Issue Date *</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date *</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amounts */}
            <Card>
              <CardHeader>
                <CardTitle>Amounts</CardTitle>
                <CardDescription>Enter invoice amounts and calculations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subtotal">Subtotal *</Label>
                  <Input
                    id="subtotal"
                    placeholder="0.00"
                    value={subtotal}
                    onChange={(e) => setSubtotal(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxAmount">Tax Amount</Label>
                  <Input
                    id="taxAmount"
                    placeholder="0.00"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountAmount">Discount Amount</Label>
                  <Input
                    id="discountAmount"
                    placeholder="0.00"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                </div>

                <Separator />

                <div className="flex justify-between items-center pt-2">
                  <span className="text-xl font-bold">Total Amount</span>
                  <span className="text-xl font-bold text-green-600">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
                <CardDescription>Add any additional information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <div className="flex gap-4 pb-8">
              <Button 
                className="flex-1" 
                onClick={handleCreateInvoice} 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Invoice
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
