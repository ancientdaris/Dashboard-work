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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus,
  Users,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Filter,
  Loader2,
  Edit,
  Trash2
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getRetailers, createRetailer, updateRetailer, deleteRetailer } from "@/src/services/retailerService";
import { useToast } from "@/components/ui/use-toast";
import type { Retailer } from "@/types/database.types";

export default function RetailersPage() {
  const { toast } = useToast();
  
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all-states");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingRetailer, setEditingRetailer] = useState<Retailer | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    tax_id: "",
    gstin: "",
    credit_limit: "0",
    outstanding_balance: "0",
    is_active: true,
  });

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      setLoading(true);
      const { data, error } = await getRetailers({}, { orderBy: { column: 'created_at', ascending: false } });
      
      if (error) throw error;
      setRetailers(data || []);
    } catch (error) {
      console.error("Error loading retailers:", error);
      toast({
        title: "Error",
        description: "Failed to load retailers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const retailerData = {
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        postal_code: formData.postal_code || null,
        country: formData.country || null,
        tax_id: formData.tax_id || null,
        gstin: formData.gstin || null,
        credit_limit: parseFloat(formData.credit_limit) || 0,
        outstanding_balance: parseFloat(formData.outstanding_balance) || 0,
        is_active: formData.is_active,
      };

      if (editingRetailer) {
        const { error } = await updateRetailer(editingRetailer.id, retailerData);
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Retailer updated successfully",
        });
      } else {
        const { error } = await createRetailer(retailerData);
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Retailer created successfully",
        });
      }

      setIsSheetOpen(false);
      resetForm();
      loadRetailers();
    } catch (error) {
      console.error("Error saving retailer:", error);
      toast({
        title: "Error",
        description: editingRetailer ? "Failed to update retailer" : "Failed to create retailer",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (retailer: Retailer) => {
    setEditingRetailer(retailer);
    setFormData({
      name: retailer.name,
      email: retailer.email || "",
      phone: retailer.phone || "",
      address: retailer.address || "",
      city: retailer.city || "",
      state: retailer.state || "",
      postal_code: retailer.postal_code || "",
      country: retailer.country || "India",
      tax_id: retailer.tax_id || "",
      gstin: retailer.gstin || "",
      credit_limit: retailer.credit_limit.toString(),
      outstanding_balance: retailer.outstanding_balance.toString(),
      is_active: retailer.is_active,
    });
    setIsSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this retailer?")) return;

    try {
      const { error } = await deleteRetailer(id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Retailer deleted successfully",
      });

      loadRetailers();
    } catch (error) {
      console.error("Error deleting retailer:", error);
      toast({
        title: "Error",
        description: "Failed to delete retailer",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingRetailer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      tax_id: "",
      gstin: "",
      credit_limit: "0",
      outstanding_balance: "0",
      is_active: true,
    });
  };

  const filteredRetailers = retailers.filter((retailer) => {
    const matchesSearch = 
      retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && retailer.is_active) ||
      (statusFilter === "inactive" && !retailer.is_active);
    
    const matchesState = stateFilter === "all-states" || retailer.state === stateFilter;
    
    return matchesSearch && matchesStatus && matchesState;
  });

  const activeRetailers = retailers.filter(r => r.is_active).length;
  const totalOutstanding = retailers.reduce((sum, r) => sum + r.outstanding_balance, 0);
  const totalCreditLimit = retailers.reduce((sum, r) => sum + r.credit_limit, 0);

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 space-y-6 p-8 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
          
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Retailers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your retailer network and relationships
            </p>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              resetForm();
              setIsSheetOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            <span>Add Retailer</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="transition-all p-4 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Retailers</p>
                <p className="text-2xl font-bold text-gray-900">{retailers.length}</p>
                <p className="text-xs text-gray-500 font-medium">{activeRetailers} active</p>
              </div>
              <div className="rounded-lg bg-gray-100/80 p-2.5">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="transition-all p-4 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Retailers</p>
                <p className="text-2xl font-bold text-gray-900">{activeRetailers}</p>
                <p className="text-xs text-gray-500 font-medium">{retailers.length - activeRetailers} inactive</p>
              </div>
              <div className="rounded-lg bg-gray-100/80 p-2.5">
                <TrendingUp className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="transition-all p-4 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Credit Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalOutstanding.toLocaleString()}</p>
                <p className="text-xs text-gray-500 font-medium">Total balance</p>
              </div>
              <div className="rounded-lg bg-gray-100/80 p-2.5">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="transition-all p-4 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Credit Limit</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalCreditLimit.toLocaleString()}</p>
                <p className="text-xs text-gray-500 font-medium">Available credit</p>
              </div>
              <div className="rounded-lg bg-gray-100/80 p-2.5">
                <ShoppingBag className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search retailers by name, phone, email, or location..." 
              className="pl-10 bg-white/50 border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-white/50 border-muted">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select value={stateFilter} onValueChange={setStateFilter}>
            <SelectTrigger className="w-[150px] bg-white/50 border-muted">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-states">All States</SelectItem>
                {Array.from(new Set(retailers.map(r => r.state).filter(Boolean))).map(state => (
                  <SelectItem key={state} value={state!}>{state}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Retailers Table */}
        <Card className="transition-all hover:shadow-md">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredRetailers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No retailers found</h3>
              <p className="text-sm text-gray-500 mb-6">
                {retailers.length === 0 ? "Add your first retailer to get started." : "Try adjusting your filters."}
              </p>
              {retailers.length === 0 && (
                <Button 
                  className="flex items-center gap-2"
                  onClick={() => {
                    resetForm();
                    setIsSheetOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Retailer</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Retailer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Status
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
                  {filteredRetailers.map((retailer) => {
                    const creditUsagePercent = retailer.credit_limit > 0 
                      ? (retailer.outstanding_balance / retailer.credit_limit) * 100 
                      : 0;
                    
                    return (
                      <tr key={retailer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{retailer.name}</p>
                            {retailer.gstin && (
                              <p className="text-xs text-gray-500">GSTIN: {retailer.gstin}</p>
                            )}
                            {retailer.tax_id && (
                              <p className="text-xs text-gray-500">Tax ID: {retailer.tax_id}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {retailer.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{retailer.phone}</span>
                              </div>
                            )}
                            {retailer.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">{retailer.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              {retailer.city && <p className="text-sm text-gray-900">{retailer.city}</p>}
                              {retailer.state && <p className="text-xs text-gray-500">{retailer.state}</p>}
                              {!retailer.city && !retailer.state && <p className="text-sm text-gray-400">N/A</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              ₹{retailer.outstanding_balance.toLocaleString()} / ₹{retailer.credit_limit.toLocaleString()}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  creditUsagePercent > 80 ? 'bg-red-500' : 
                                  creditUsagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(creditUsagePercent, 100)}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500">{creditUsagePercent.toFixed(0)}% utilized</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={retailer.is_active 
                              ? "bg-green-50 text-green-700 border-green-200" 
                              : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {retailer.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(retailer)}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(retailer.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>

    {/* Retailer Form Sheet */}
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingRetailer ? "Edit Retailer" : "Add Retailer"}</SheetTitle>
            <SheetDescription>
              {editingRetailer ? "Update retailer information" : "Add a new retailer to your network"}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Retailer name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Street address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  placeholder="400001"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="India"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gstin">GSTIN</Label>
                <Input
                  id="gstin"
                  placeholder="24AABCU9741H1ZS"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax ID</Label>
                <Input
                  id="tax_id"
                  placeholder="Tax identification number"
                  value={formData.tax_id}
                  onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="credit_limit">Credit Limit</Label>
                <Input
                  id="credit_limit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.credit_limit}
                  onChange={(e) => setFormData({ ...formData, credit_limit: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="outstanding_balance">Outstanding Balance</Label>
                <Input
                  id="outstanding_balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.outstanding_balance}
                  onChange={(e) => setFormData({ ...formData, outstanding_balance: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="is_active">Status</Label>
              <Select
                value={formData.is_active ? "active" : "inactive"}
                onValueChange={(value) => setFormData({ ...formData, is_active: value === "active" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
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
                    {editingRetailer ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  editingRetailer ? "Update Retailer" : "Add Retailer"
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </ProtectedRoute>
  );
}
