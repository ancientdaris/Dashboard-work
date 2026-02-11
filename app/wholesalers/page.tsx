"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
  Building2,
  Phone,
  Mail,
  MapPin,
  Loader2,
  IndianRupee,
  Users,
  FileCheck,
  Eye
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import { useToast } from "@/components/ui/use-toast";

type Wholesaler = Database['public']['Tables']['wholesalers']['Row'];

export default function WholesalersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [wholesalers, setWholesalers] = useState<Wholesaler[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all-states");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    contact_person: "",
    owner_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    gst_number: "",
    cin_number: "",
  });

  useEffect(() => {
    fetchWholesalers();
  }, []);

  const fetchWholesalers = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from('wholesalers')
        .select('*')
        .order('business_name');

      if (error) throw error;
      setWholesalers(data || []);
    } catch (error) {
      console.error("Error fetching wholesalers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.business_name) {
      toast({ title: "Error", description: "Business name is required", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      const supabase = createClient();
      const { error } = await supabase.from('wholesalers').insert({
        business_name: formData.business_name,
        contact_person: formData.contact_person || null,
        owner_name: formData.owner_name || null,
        email: formData.email || null,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        state: formData.state || null,
        postal_code: formData.postal_code || null,
        country: formData.country || null,
        gst_number: formData.gst_number || null,
        cin_number: formData.cin_number || null,
      });

      if (error) throw error;

      toast({ title: "Success", description: "Wholesaler added successfully" });
      setIsSheetOpen(false);
      resetForm();
      fetchWholesalers();
    } catch (error: any) {
      console.error("Error creating wholesaler:", error);
      toast({ title: "Error", description: error.message || "Failed to add wholesaler", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      business_name: "",
      contact_person: "",
      owner_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      gst_number: "",
      cin_number: "",
    });
  };

  const uniqueStates = [...new Set(wholesalers.map(w => w.state).filter(Boolean))].sort();

  const filteredWholesalers = wholesalers.filter((w) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      w.business_name.toLowerCase().includes(query) ||
      (w.contact_person || "").toLowerCase().includes(query) ||
      (w.email || "").toLowerCase().includes(query) ||
      (w.phone || "").toLowerCase().includes(query) ||
      (w.city || "").toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && w.is_active) ||
      (statusFilter === "inactive" && !w.is_active);

    const matchesState = stateFilter === "all-states" || w.state === stateFilter;

    return matchesSearch && matchesStatus && matchesState;
  });

  const activeCount = wholesalers.filter(w => w.is_active).length;
  const totalOutstanding = wholesalers.reduce((sum, w) => sum + (w.outstanding_balance ?? 0), 0);
  const verifiedCount = wholesalers.filter(w => w.kyc_status === 'verified').length;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 space-y-6 p-8 overflow-auto bg-gray-50">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Wholesalers</h1>
              <p className="text-muted-foreground mt-1">
                Manage your wholesale suppliers and partners
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() => setIsSheetOpen(true)}
            >
              <Plus className="h-4 w-4" />
              Add Wholesaler
            </Button>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Total Wholesalers</span>
              </div>
              <div className="text-2xl font-bold">{wholesalers.length}</div>
            </Card>
            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
              <div className="text-2xl font-bold">{activeCount}</div>
            </Card>
            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Outstanding Balance</span>
              </div>
              <div className="text-2xl font-bold">₹{totalOutstanding.toLocaleString()}</div>
            </Card>
            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">KYC Verified</span>
              </div>
              <div className="text-2xl font-bold">{verifiedCount}</div>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search wholesalers..."
                className="pl-10 bg-white/50 border-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] bg-white/50 border-muted">
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
              <SelectTrigger className="w-[160px] bg-white/50 border-muted">
                <SelectValue placeholder="All States" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-states">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state!}>{state}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Card className="transition-all hover:shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outstanding</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredWholesalers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground">
                        No wholesalers found
                      </td>
                    </tr>
                  ) : (
                    filteredWholesalers.map((wholesaler) => (
                      <tr
                        key={wholesaler.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/wholesalers/${wholesaler.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{wholesaler.business_name}</p>
                            {wholesaler.contact_person && (
                              <p className="text-xs text-gray-500">{wholesaler.contact_person}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {wholesaler.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{wholesaler.phone}</span>
                              </div>
                            )}
                            {wholesaler.email && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span className="truncate max-w-[200px]">{wholesaler.email}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                            <div>
                              {wholesaler.city && <p className="text-sm text-gray-900">{wholesaler.city}</p>}
                              {wholesaler.state && <p className="text-xs text-gray-500">{wholesaler.state}</p>}
                              {!wholesaler.city && !wholesaler.state && <p className="text-sm text-gray-400">N/A</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            ₹{(wholesaler.outstanding_balance ?? 0).toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={wholesaler.kyc_status === 'verified' ? 'default' : 'secondary'}
                            className={
                              wholesaler.kyc_status === 'verified'
                                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                : wholesaler.kyc_status === 'submitted'
                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                            }
                          >
                            {wholesaler.kyc_status || 'pending'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={wholesaler.is_active ? "default" : "secondary"}>
                            {wholesaler.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/wholesalers/${wholesaler.id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Add Wholesaler Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="sm:max-w-[540px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add Wholesaler</SheetTitle>
            <SheetDescription>Add a new wholesale supplier to the system</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Business Name *</Label>
              <Input
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                placeholder="Business name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Contact person name"
              />
            </div>
            <div className="space-y-2">
              <Label>Owner Name</Label>
              <Input
                value={formData.owner_name}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                placeholder="Owner name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <Label>Postal Code</Label>
                <Input
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  placeholder="Postal code"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>GSTIN</Label>
                <Input
                  value={formData.gst_number}
                  onChange={(e) => setFormData({ ...formData, gst_number: e.target.value })}
                  placeholder="GST Number"
                />
              </div>
              <div className="space-y-2">
                <Label>CIN Number</Label>
                <Input
                  value={formData.cin_number}
                  onChange={(e) => setFormData({ ...formData, cin_number: e.target.value })}
                  placeholder="CIN Number"
                />
              </div>
            </div>
            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setIsSheetOpen(false); resetForm(); }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Adding...</>
                ) : (
                  "Add Wholesaler"
                )}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </ProtectedRoute>
  );
}
