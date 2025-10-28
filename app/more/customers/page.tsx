"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard } from "lucide-react";
import { Search, Plus, Mail, Phone, MapPin, Edit2, Eye, Trash2, Loader2, UserPlus, LayoutGrid, List, RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

type Customer = {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
  credit_limit: number;
  outstanding_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function CustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    gstin: "",
    credit_limit: "0",
    is_active: true,
  });

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      console.log('Loading customers...');
      const supabase = createClient();
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name', { ascending: true });
      
      console.log('Customers query result:', { data, error });
      console.log('Number of customers:', data?.length || 0);
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      setCustomers(data || []);
      
      if (data && data.length > 0) {
        console.log('First customer:', data[0]);
      }
    } catch (error: any) {
      console.error("Error loading customers:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load customers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Name, email, and password are required",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const supabase = createClient();
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
            user_type: 'customer',
          },
        },
      });

      if (authError) throw authError;
      const userId = authData.user?.id || null;

      const { error } = await supabase.from('customers').insert([{
        user_id: userId,
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        postal_code: formData.postal_code || null,
        country: formData.country || 'India',
        gstin: formData.gstin || null,
        credit_limit: parseFloat(formData.credit_limit) || 0,
        outstanding_balance: 0,
        is_active: formData.is_active,
      }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer created successfully",
      });

      setIsCreateSheetOpen(false);
      resetForm();
      loadCustomers();
    } catch (error: any) {
      console.error("Error creating customer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create customer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !formData.name) {
      toast({ title: "Error", description: "Customer name is required", variant: "destructive" });
      return;
    }
    try {
      setIsSubmitting(true);
      const supabase = createClient();
      const { error } = await supabase.from('customers').update({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        postal_code: formData.postal_code || null,
        country: formData.country || null,
        gstin: formData.gstin || null,
        credit_limit: parseFloat(formData.credit_limit) || 0,
        is_active: formData.is_active,
      }).eq('id', selectedCustomer.id);
      if (error) throw error;
      toast({ title: "Success", description: "Customer updated successfully" });
      setIsEditSheetOpen(false);
      resetForm();
      loadCustomers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update customer", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from('customers').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Customer deleted successfully" });
      loadCustomers();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete customer", variant: "destructive" });
    }
  };

  const openEditSheet = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || "",
      password: "",
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      postal_code: customer.postal_code || "",
      country: customer.country || "India",
      gstin: customer.gstin || "",
      credit_limit: customer.credit_limit.toString(),
      is_active: customer.is_active,
    });
    setIsEditSheetOpen(true);
  };

  const openDetailDialog = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      gstin: "",
      credit_limit: "0",
      is_active: true,
    });
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Customers</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your customer database and relationships
                </p>
              </div>
              <Button className="flex items-center gap-2" onClick={() => setIsCreateSheetOpen(true)}>
                <Plus className="h-4 w-4" />
                <span>Add Customer</span>
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search customers..." 
                  className="pl-10 bg-white/50 border-muted"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadCustomers(true)}
                  disabled={isRefreshing}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="rounded-r-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="rounded-l-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Card className="transition-all hover:shadow-md">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">All Customers</h2>
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-500">
                    {filteredCustomers.length} of {customers.length} customers
                  </p>
                  {customers.length === 0 && !loading && (
                    <Badge variant="outline" className="text-xs">
                      No data in database
                    </Badge>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                    <UserPlus className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No customers found</h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {customers.length === 0 ? "Add your first customer to get started." : "Try adjusting your search."}
                  </p>
                  {customers.length === 0 && (
                    <div className="text-xs text-gray-400 mb-6">
                      <p>Check browser console for debug info</p>
                      <p>Ensure customers table exists in Supabase</p>
                    </div>
                  )}
                </div>
              ) : viewMode === 'table' ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                              {customer.gstin && (
                                <div className="text-xs text-gray-500">GSTIN: {customer.gstin}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {customer.email && (
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {customer.email}
                                </div>
                              )}
                              {customer.phone && (
                                <div className="flex items-center gap-1 mt-1">
                                  <Phone className="h-3 w-3" />
                                  {customer.phone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {customer.city || customer.state ? (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {customer.city}{customer.city && customer.state && ', '}{customer.state}
                              </div>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">
                                ₹{customer.credit_limit.toLocaleString()}
                              </div>
                              <div className="text-xs text-red-600">
                                Bal: ₹{customer.outstanding_balance.toLocaleString()}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={customer.is_active ? "default" : "secondary"}>
                              {customer.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => openDetailDialog(customer)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openEditSheet(customer)}>
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(customer.id)}>
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                  {filteredCustomers.map((customer) => (
                    <Card key={customer.id} className="p-4 hover:shadow-lg transition-all cursor-pointer" onClick={() => openDetailDialog(customer)}>
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base text-gray-900">{customer.name}</h3>
                            {customer.email && <p className="text-xs text-gray-500 mt-0.5">{customer.email}</p>}
                            {customer.phone && <p className="text-xs text-gray-600 mt-0.5">{customer.phone}</p>}
                          </div>
                          <Badge variant={customer.is_active ? "default" : "secondary"}>
                            {customer.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        {customer.address && (
                          <p className="text-xs text-gray-600">
                            {customer.address}
                            {customer.city && `, ${customer.city}`}
                            {customer.state && `, ${customer.state}`}
                          </p>
                        )}
                        <div className="flex items-end justify-between pt-2 border-t">
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Credit Limit</p>
                            <p className="text-lg font-bold text-gray-900 mt-0.5">₹{customer.credit_limit.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Outstanding</p>
                            <p className="text-lg font-bold text-red-600 mt-0.5">₹{customer.outstanding_balance.toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); openEditSheet(customer); }}>
                            <Edit2 className="h-3 w-3 mr-1" /> Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}>
                            <Trash2 className="h-3 w-3 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Create New Customer</SheetTitle>
            <SheetDescription>Add a new customer to your database</SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleCreateCustomer} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" placeholder="Customer name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" placeholder="Password (min 6 characters)" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
              <p className="text-xs text-muted-foreground">Auth account will be created automatically for customer login</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input id="gstin" placeholder="GST Number" value={formData.gstin} onChange={(e) => setFormData({ ...formData, gstin: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Street address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input id="postal_code" placeholder="Postal code" value={formData.postal_code} onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" placeholder="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credit_limit">Credit Limit</Label>
              <Input id="credit_limit" type="number" step="0.01" placeholder="0.00" value={formData.credit_limit} onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })} />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-base">Active Status</Label>
                <p className="text-sm text-muted-foreground">Customer can place orders</p>
              </div>
              <input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="h-5 w-5 rounded border-gray-300" />
            </div>

            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => { setIsCreateSheetOpen(false); resetForm(); }} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</> : "Create Customer"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Customer</SheetTitle>
            <SheetDescription>Update customer information</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleUpdateCustomer} className="space-y-4 mt-6">
            <div className="space-y-2"><Label>Name *</Label><Input placeholder="Customer name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Phone</Label><Input placeholder="Phone number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>GSTIN</Label><Input placeholder="GST Number" value={formData.gstin} onChange={(e) => setFormData({ ...formData, gstin: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Address</Label><Textarea placeholder="Street address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows={2} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>City</Label><Input placeholder="City" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} /></div>
              <div className="space-y-2"><Label>State</Label><Input placeholder="State" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Postal Code</Label><Input placeholder="Postal code" value={formData.postal_code} onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })} /></div>
              <div className="space-y-2"><Label>Country</Label><Input placeholder="Country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Credit Limit</Label><Input type="number" step="0.01" placeholder="0.00" value={formData.credit_limit} onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })} /></div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5"><Label className="text-base">Active Status</Label><p className="text-sm text-muted-foreground">Customer can place orders</p></div>
              <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="h-5 w-5 rounded border-gray-300" />
            </div>
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => { setIsEditSheetOpen(false); resetForm(); }} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating...</> : "Update Customer"}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>View complete customer information</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{selectedCustomer.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {selectedCustomer.id.slice(0, 8)}</p>
                    </div>
                    <Badge variant={selectedCustomer.is_active ? "default" : "secondary"}>{selectedCustomer.is_active ? "Active" : "Inactive"}</Badge>
                  </div>
                  <div className="space-y-3">
                    {selectedCustomer.email && <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /><span>{selectedCustomer.email}</span></div>}
                    {selectedCustomer.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /><span>{selectedCustomer.phone}</span></div>}
                    {(selectedCustomer.address || selectedCustomer.city) && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-1" />
                        <div>
                          {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                          {(selectedCustomer.city || selectedCustomer.state) && (
                            <p className="text-muted-foreground">{selectedCustomer.city}{selectedCustomer.city && selectedCustomer.state && ', '}{selectedCustomer.state} {selectedCustomer.postal_code}</p>
                          )}
                          {selectedCustomer.country && <p className="text-muted-foreground">{selectedCustomer.country}</p>}
                        </div>
                      </div>
                    )}
                    {selectedCustomer.gstin && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-primary" />
                        <div><p className="text-xs text-muted-foreground">GSTIN</p><p>{selectedCustomer.gstin}</p></div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <h4 className="text-lg font-semibold mb-4">Financial Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Limit</p>
                    <p className="text-xl font-bold mt-1">₹{selectedCustomer.credit_limit.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                    <p className="text-xl font-bold text-red-600 mt-1">₹{selectedCustomer.outstanding_balance.toLocaleString()}</p>
                  </div>
                  <div className="col-span-2 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">Available Credit</p>
                    <p className="text-lg font-bold text-green-600 mt-1">₹{(selectedCustomer.credit_limit - selectedCustomer.outstanding_balance).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="space-y-2">
                  <div><p className="text-xs text-muted-foreground">Created At</p><p>{new Date(selectedCustomer.created_at).toLocaleString()}</p></div>
                  <div><p className="text-xs text-muted-foreground">Last Updated</p><p>{new Date(selectedCustomer.updated_at).toLocaleString()}</p></div>
                </div>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ProtectedRoute>
  );
}
