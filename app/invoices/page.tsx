"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus,
  Filter,
  Download,
  FileText,
  Eye,
  Loader2,
  Calendar,
  DollarSign
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Invoice = Database['public']['Tables']['invoices']['Row'] & {
  retailers?: Database['public']['Tables']['retailers']['Row'];
  orders?: Database['public']['Tables']['orders']['Row'];
};

export default function InvoicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('invoices')
        .select('*, retailers(*), orders(*)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'paid': return 'default';
      case 'sent': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'overdue': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.retailers?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + Number(inv.total_amount), 0);
  const pendingAmount = totalAmount - paidAmount;

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Main Content */}
          <div className="p-8 max-w-full mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Invoices</h1>
                <p className="text-muted-foreground mt-1">
                  Manage invoices, payments, and GST compliance
                </p>
              </div>
              <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button 
                className="flex items-center gap-2"
                onClick={() => router.push('/invoices/create')}
              >
                <Plus className="h-4 w-4" />
                <span>Create Invoice</span>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="transition-all p-4 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredInvoices.length}</p>
                  <p className="text-xs text-gray-500 font-medium">₹{totalAmount.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-gray-100/80 p-2.5">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
              </div>
            </Card>

            <Card className="transition-all p-4 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Paid Amount</p>
                  <p className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 font-medium">{filteredInvoices.filter(i => i.status === 'paid').length} invoices</p>
                </div>
                <div className="rounded-lg bg-green-100/80 p-2.5">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="transition-all p-4 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
                  <p className="text-2xl font-bold text-orange-600">₹{pendingAmount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 font-medium">{filteredInvoices.filter(i => i.status !== 'paid').length} invoices</p>
                </div>
                <div className="rounded-lg bg-orange-100/80 p-2.5">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search by invoice number or customer..." 
                className="pl-10 bg-white/50 border-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("draft")}
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === "sent" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("sent")}
              >
                Sent
              </Button>
              <Button
                variant={statusFilter === "paid" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("paid")}
              >
                Paid
              </Button>
              <Button
                variant={statusFilter === "overdue" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("overdue")}
              >
                Overdue
              </Button>
            </div>
          </div>

          {/* Invoices Table */}
          <Card className="transition-all hover:shadow-md">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : filteredInvoices.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
                <p className="text-sm text-gray-500 mb-6">
                  {invoices.length === 0 ? "Get started by creating your first invoice." : "Try adjusting your filters."}
                </p>
                {invoices.length === 0 && (
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => router.push('/invoices/create')}
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Invoice</span>
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Issue Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr 
                        key={invoice.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/invoices/${invoice.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{invoice.invoice_number}</p>
                            {invoice.orders && (
                              <p className="text-xs text-gray-500">Order: {invoice.orders.order_number}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-900">{invoice.retailers?.name || 'N/A'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {new Date(invoice.issue_date).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600">
                            {new Date(invoice.due_date).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{Number(invoice.total_amount).toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={getStatusColor(invoice.status)}
                          >
                            {invoice.status || 'draft'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/invoices/${invoice.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
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
    </ProtectedRoute>
  );
}
