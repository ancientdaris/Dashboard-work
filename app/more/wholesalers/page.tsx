"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import supabase from "@/utils/supabase/client";

type Wholesaler = {
  id: string;
  user_id: string | null;
  business_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
  tax_id: string | null;
  credit_limit: number;
  outstanding_balance: number;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function WholesalersPage() {
  const [wholesalers, setWholesalers] = useState<Wholesaler[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [gstin, setGstin] = useState("");
  const [taxId, setTaxId] = useState("");
  const [creditLimit, setCreditLimit] = useState("0");
  const [discountPercentage, setDiscountPercentage] = useState("0");

  const fetchWholesalers = async () => {
    try {
      const { data, error } = await supabase
        .from("wholesalers")
        .select("*")
        .order("business_name");

      if (error) throw error;
      setWholesalers(data || []);
      setErrorMessage("");
    } catch (error: any) {
      console.error("Error fetching wholesalers:", error);
      setErrorMessage(error.message || "Failed to fetch wholesalers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWholesalers();
  }, []);

  const handleCreateWholesaler = async () => {
    if (!businessName) {
      setErrorMessage("Business name is required");
      return;
    }

    setCreateLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.from("wholesalers").insert({
        business_name: businessName,
        contact_person: contactPerson || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        postal_code: postalCode || null,
        country: country || "India",
        gstin: gstin || null,
        tax_id: taxId || null,
        credit_limit: parseFloat(creditLimit) || 0,
        outstanding_balance: 0,
        discount_percentage: parseFloat(discountPercentage) || 0,
        is_active: true,
      });

      if (error) throw error;

      setSuccessMessage("Wholesaler created successfully");
      setTimeout(() => {
        setIsCreateDialogOpen(false);
        fetchWholesalers();
        // Reset form
        setBusinessName("");
        setContactPerson("");
        setEmail("");
        setPhone("");
        setAddress("");
        setCity("");
        setState("");
        setPostalCode("");
        setCountry("India");
        setGstin("");
        setTaxId("");
        setCreditLimit("0");
        setDiscountPercentage("0");
        setSuccessMessage("");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create wholesaler");
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredWholesalers = wholesalers.filter(
    (wholesaler) =>
      wholesaler.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wholesaler.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wholesaler.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wholesaler.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          {/* Error Message */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Wholesalers
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your wholesaler network and supplier relationships
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Wholesaler
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Wholesaler</DialogTitle>
                  <DialogDescription>
                    Add a new wholesaler to your network
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert>
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name *</Label>
                    <Input
                      id="business-name"
                      placeholder="Enter business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contact-person">Contact Person</Label>
                      <Input
                        id="contact-person"
                        placeholder="Contact name"
                        value={contactPerson}
                        onChange={(e) => setContactPerson(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        placeholder="Phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input
                        id="postal-code"
                        placeholder="Postal code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="gstin">GSTIN</Label>
                      <Input
                        id="gstin"
                        placeholder="GST Identification Number"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tax-id">Tax ID</Label>
                      <Input
                        id="tax-id"
                        placeholder="Tax Identification Number"
                        value={taxId}
                        onChange={(e) => setTaxId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="credit-limit">Credit Limit</Label>
                      <Input
                        id="credit-limit"
                        type="number"
                        placeholder="0.00"
                        value={creditLimit}
                        onChange={(e) => setCreditLimit(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount %</Label>
                      <Input
                        id="discount"
                        type="number"
                        placeholder="0.0"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreateWholesaler}
                    disabled={createLoading}
                  >
                    {createLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Wholesaler"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Wholesalers
                </span>
              </div>
              <div className="text-2xl font-bold">{wholesalers.length}</div>
            </Card>

            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Badge className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Active
                </span>
              </div>
              <div className="text-2xl font-bold">
                {wholesalers.filter((w) => w.is_active).length}
              </div>
            </Card>

            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Credit Limit
                </span>
              </div>
              <div className="text-2xl font-bold">
                ${wholesalers.reduce((sum, w) => sum + Number(w.credit_limit), 0).toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Outstanding Balance
                </span>
              </div>
              <div className="text-2xl font-bold text-red-600">
                ${wholesalers.reduce((sum, w) => sum + Number(w.outstanding_balance), 0).toFixed(2)}
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search wholesalers..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Wholesalers Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredWholesalers.length === 0 ? (
              <Card className="col-span-full p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl font-medium text-muted-foreground">
                  No wholesalers found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery ? "Try adjusting your search" : "Add your first wholesaler to get started"}
                </p>
              </Card>
            ) : (
              filteredWholesalers.map((wholesaler) => (
                <Card
                  key={wholesaler.id}
                  className="group relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                >
                  {/* Header Section */}
                  <div className="p-5 pb-4 bg-gradient-to-br from-orange-50 to-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                          {wholesaler.business_name}
                        </h3>
                        {wholesaler.contact_person && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {wholesaler.contact_person}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={wholesaler.is_active ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {wholesaler.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="px-5 py-4 space-y-2 border-t bg-white">
                    {wholesaler.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="truncate">{wholesaler.email}</span>
                      </div>
                    )}
                    {wholesaler.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{wholesaler.phone}</span>
                      </div>
                    )}
                    {wholesaler.address && (
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {wholesaler.address}
                          {wholesaler.city && `, ${wholesaler.city}`}
                          {wholesaler.state && `, ${wholesaler.state}`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Financial Info */}
                  <div className="px-5 py-4 border-t bg-gray-50">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Credit Limit
                        </p>
                        <p className="text-base font-bold text-gray-900">
                          ${Number(wholesaler.credit_limit).toFixed(2)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Discount
                        </p>
                        <p className="text-base font-bold text-green-600">
                          {Number(wholesaler.discount_percentage).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Outstanding
                        </p>
                        <p className="text-base font-bold text-red-600">
                          ${Number(wholesaler.outstanding_balance).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
