"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { 
  Search, 
  Plus,
  Download,
  CreditCard,
  Trash2,
  Loader2
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getPayments, createPayment, deletePayment, generatePaymentNumber } from "@/src/services/paymentService";
import { getRetailers } from "@/src/services/retailerService";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import type { Payment, Retailer, PaymentStatus } from "@/types/database.types";

type PaymentWithRelations = Payment & {
  retailer?: Retailer | null;
};

type Invoice = {
  id: string;
  invoice_number: string;
  total_amount: number;
  retailer_id: string;
  status: string;
  retailer?: Retailer;
};

export default function PaymentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [payments, setPayments] = useState<PaymentWithRelations[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all-statuses");
  const [methodFilter, setMethodFilter] = useState<string>("all-methods");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    invoice_id: "",
    retailer_id: "",
    amount: "",
    payment_method: "",
    reference_number: "",
    notes: "",
    payment_date: new Date().toISOString().split('T')[0],
    is_same_day: false,
    status: "completed" as PaymentStatus,
  });

  useEffect(() => {
    loadPayments();
    loadRetailers();
    loadInvoices();
  }, []);

  useEffect(() => {
    if (formData.invoice_id) {
      loadInvoiceData(formData.invoice_id);
    }
  }, [formData.invoice_id]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await getPayments({}, { orderBy: { column: 'payment_date', ascending: false } });
      
      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error("Error loading payments:", error);
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRetailers = async () => {
    try {
      const { data, error } = await getRetailers({ is_active: true });
      if (error) throw error;
      setRetailers(data || []);
    } catch (error) {
      console.error("Error loading retailers:", error);
    }
  };

  const loadInvoices = async () => {
    try {
      const supabase = (await import('@/lib/supabase/client')).createClient();
      const { data, error } = await supabase
        .from('invoices')
        .select('*, retailer:retailers(*)')
        .in('status', ['draft', 'sent', 'overdue'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error("Error loading invoices:", error);
    }
  };

  const loadInvoiceData = async (invoiceId: string) => {
    try {
      const supabase = (await import('@/lib/supabase/client')).createClient();
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('id', invoiceId)
        .single();
      
      if (error) throw error;
      if (data) {
        setFormData(prev => ({
          ...prev,
          retailer_id: data.retailer_id || '',
          amount: data.total_amount.toString(),
        }));
      }
    } catch (error) {
      console.error("Error loading invoice data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const paymentNumber = await generatePaymentNumber();
      
      const { data, error } = await createPayment({
        payment_number: paymentNumber,
        invoice_id: formData.invoice_id || null,
        retailer_id: formData.retailer_id,
        amount: parseFloat(formData.amount),
        payment_method: formData.payment_method || null,
        payment_date: formData.payment_date,
        reference_number: formData.reference_number || null,
        notes: formData.notes || null,
        is_same_day: formData.is_same_day,
        status: formData.status,
        created_by: user.id,
      });

      // Update invoice status to paid if invoice is selected
      if (formData.invoice_id && formData.status === 'completed') {
        const supabase = (await import('@/lib/supabase/client')).createClient();
        await supabase
          .from('invoices')
          .update({ status: 'paid' })
          .eq('id', formData.invoice_id);
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      });

      setIsSheetOpen(false);
      resetForm();
      loadPayments();
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description: "Failed to record payment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;

    try {
      const { error } = await deletePayment(id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Payment deleted successfully",
      });

      loadPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast({
        title: "Error",
        description: "Failed to delete payment",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      invoice_id: "",
      retailer_id: "",
      amount: "",
      payment_method: "",
      reference_number: "",
      notes: "",
      payment_date: new Date().toISOString().split('T')[0],
      is_same_day: false,
      status: "completed",
    });
  };

  const handleExport = () => {
    if (filteredPayments.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no payments to export",
        variant: "destructive",
      });
      return;
    }

    // Create text content
    let txtContent = "PAYMENTS REPORT\n";
    txtContent += "=".repeat(80) + "\n\n";
    txtContent += `Generated: ${new Date().toLocaleString()}\n`;
    txtContent += `Total Payments: ${filteredPayments.length}\n\n`;
    txtContent += "=".repeat(80) + "\n\n";

    filteredPayments.forEach((payment, index) => {
      txtContent += `Payment #${index + 1}\n`;
      txtContent += "-".repeat(80) + "\n";
      txtContent += `Payment Number: ${payment.payment_number}\n`;
      txtContent += `Retailer: ${payment.retailer?.name || "N/A"}\n`;
      txtContent += `Amount: ₹${payment.amount.toLocaleString()}\n`;
      txtContent += `Payment Method: ${payment.payment_method || "N/A"}\n`;
      txtContent += `Status: ${(payment.status || 'pending').toUpperCase()}\n`;
      txtContent += `Payment Date: ${payment.payment_date ? new Date(payment.payment_date).toLocaleString() : 'N/A'}\n`;
      txtContent += `Reference Number: ${payment.reference_number || "N/A"}\n`;
      if (payment.notes) {
        txtContent += `Notes: ${payment.notes}\n`;
      }
      txtContent += `Same Day Payment: ${payment.is_same_day ? "Yes" : "No"}\n`;
      txtContent += "\n";
    });

    // Calculate totals
    const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const completedAmount = filteredPayments
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = filteredPayments
      .filter(p => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0);

    txtContent += "=".repeat(80) + "\n";
    txtContent += "SUMMARY\n";
    txtContent += "=".repeat(80) + "\n";
    txtContent += `Total Amount: ₹${totalAmount.toLocaleString()}\n`;
    txtContent += `Completed: ₹${completedAmount.toLocaleString()}\n`;
    txtContent += `Pending: ₹${pendingAmount.toLocaleString()}\n`;
    txtContent += `Total Payments: ${filteredPayments.length}\n`;

    // Create and download file
    const blob = new Blob([txtContent], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments_export_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${filteredPayments.length} payments to TXT file`,
    });
  };

  const getStatusBadge = (status: PaymentStatus | null) => {
    const variants: Record<PaymentStatus, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      completed: { variant: "default", label: "Completed" },
      pending: { variant: "secondary", label: "Pending" },
      failed: { variant: "destructive", label: "Failed" },
      refunded: { variant: "outline", label: "Refunded" },
    };
    
    const config = variants[status || 'pending'] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = 
      payment.payment_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.retailer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference_number?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all-statuses" || payment.status === statusFilter;
    const matchesMethod = methodFilter === "all-methods" || payment.payment_method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Payments</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your payments and track financial transactions
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleExport}
                  disabled={filteredPayments.length === 0}
                  title={filteredPayments.length === 0 ? "No payments to export" : "Export payments to TXT file"}
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </Button>
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => setIsSheetOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  <span>Record Payment</span>
                </Button>
              </div>
            </div>

            {/* Filters Section */}
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search..." 
                  className="pl-10 bg-white/50 border-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white/50 border-muted">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all-statuses">All Statuses</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[180px] bg-white/50 border-muted">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all-methods">All Methods</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Payments Table */}
            <Card className="transition-all hover:shadow-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
                <p className="text-sm text-gray-500">
                  {filteredPayments.length} of {payments.length} payments
                </p>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredPayments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <CreditCard className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
                  <p className="text-sm text-gray-500 mb-6">
                    {payments.length === 0 ? "Record your first payment to get started." : "Try adjusting your filters."}
                  </p>
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => setIsSheetOpen(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Record Payment</span>
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Retailer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.payment_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.retailer?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
                            {payment.payment_method || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(payment.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {payment.is_same_day ? (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Same Day
                              </Badge>
                            ) : (
                              <span className="text-sm text-gray-500">Regular</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(payment.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Form Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Record Payment</SheetTitle>
            <SheetDescription>
              Add a new payment transaction to the system
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="invoice">Invoice (Optional)</Label>
              <Select
                value={formData.invoice_id || undefined}
                onValueChange={(value) => setFormData({ ...formData, invoice_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select invoice (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {invoices.map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.invoice_number} - ₹{invoice.total_amount.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {formData.invoice_id && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormData({ ...formData, invoice_id: "", retailer_id: "", amount: "" })}
                  className="mt-1 h-8 px-2 text-xs"
                >
                  Clear Invoice
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="retailer">Retailer *</Label>
              <Select
                value={formData.retailer_id}
                onValueChange={(value) => setFormData({ ...formData, retailer_id: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select retailer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {retailers.map((retailer) => (
                      <SelectItem key={retailer.id} value={retailer.id}>
                        {retailer.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_method">Payment Method</Label>
              <Select
                value={formData.payment_method}
                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as PaymentStatus })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference_number">Reference Number</Label>
              <Input
                id="reference_number"
                placeholder="Transaction reference"
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_date">Payment Date *</Label>
              <Input
                id="payment_date"
                type="date"
                value={formData.payment_date}
                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_same_day" className="text-base">Same Day Payment</Label>
                <p className="text-sm text-muted-foreground">Mark this as a same-day payment</p>
              </div>
              <input
                type="checkbox"
                id="is_same_day"
                checked={formData.is_same_day}
                onChange={(e) => setFormData({ ...formData, is_same_day: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300"
              />
            </div>

            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsSheetOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Recording...
                  </>
                ) : (
                  "Record Payment"
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </ProtectedRoute>
  );
}
