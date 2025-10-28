"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Search,
  Palette,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Award,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import supabase from "@/utils/supabase/client";

type InteriorDesigner = {
  id: string;
  user_id: string | null;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
  specialization: string | null;
  years_of_experience: number;
  portfolio_url: string | null;
  commission_percentage: number;
  credit_limit: number;
  outstanding_balance: number;
  total_projects: number;
  total_revenue: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export default function InteriorDesignersPage() {
  const [designers, setDesigners] = useState<InteriorDesigner[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [gstin, setGstin] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("0");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [commissionPercentage, setCommissionPercentage] = useState("0");
  const [creditLimit, setCreditLimit] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const fetchDesigners = async () => {
    try {
      const { data, error } = await supabase
        .from("interior_designers")
        .select("*")
        .order("name");

      if (error) throw error;
      setDesigners(data || []);
      setErrorMessage("");
    } catch (error: any) {
      console.error("Error fetching interior designers:", error);
      setErrorMessage(error.message || "Failed to fetch interior designers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigners();
  }, []);

  const handleCreateDesigner = async () => {
    if (!name) {
      setErrorMessage("Designer name is required");
      return;
    }

    setCreateLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.from("interior_designers").insert({
        name,
        business_name: businessName || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        postal_code: postalCode || null,
        country: country || "India",
        gstin: gstin || null,
        specialization: specialization || null,
        years_of_experience: parseInt(yearsOfExperience) || 0,
        portfolio_url: portfolioUrl || null,
        commission_percentage: parseFloat(commissionPercentage) || 0,
        credit_limit: parseFloat(creditLimit) || 0,
        outstanding_balance: 0,
        total_projects: 0,
        total_revenue: 0,
        is_active: isActive,
      });

      if (error) throw error;

      setSuccessMessage("Interior designer created successfully");
      setTimeout(() => {
        setIsCreateDialogOpen(false);
        fetchDesigners();
        // Reset form
        setName("");
        setBusinessName("");
        setEmail("");
        setPhone("");
        setAddress("");
        setCity("");
        setState("");
        setPostalCode("");
        setCountry("India");
        setGstin("");
        setSpecialization("");
        setYearsOfExperience("0");
        setPortfolioUrl("");
        setCommissionPercentage("0");
        setCreditLimit("0");
        setIsActive(true);
        setSuccessMessage("");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create interior designer");
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredDesigners = designers.filter(
    (designer) =>
      designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
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
                Interior Designers
              </h1>
              <p className="text-muted-foreground mt-1">
                Build partnerships with interior designers and architects
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Designer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Interior Designer</DialogTitle>
                  <DialogDescription>
                    Add a new interior designer to your network
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
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder="Designer name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="business-name">Business Name</Label>
                    <Input
                      id="business-name"
                      placeholder="Design studio or firm name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                    <Label htmlFor="address">Address</Label>
                    <Textarea
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
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        placeholder="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gstin">GSTIN</Label>
                      <Input
                        id="gstin"
                        placeholder="GST Identification Number"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="e.g. Residential, Commercial"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="years">Years of Experience</Label>
                      <Input
                        id="years"
                        type="number"
                        placeholder="0"
                        value={yearsOfExperience}
                        onChange={(e) => setYearsOfExperience(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      placeholder="https://portfolio.example.com"
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="commission">Commission %</Label>
                      <Input
                        id="commission"
                        type="number"
                        placeholder="0.0"
                        value={commissionPercentage}
                        onChange={(e) => setCommissionPercentage(e.target.value)}
                      />
                    </div>
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
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="active">Active</Label>
                    <Switch
                      id="active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreateDesigner}
                    disabled={createLoading}
                  >
                    {createLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Designer"
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
                <Palette className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Designers
                </span>
              </div>
              <div className="text-2xl font-bold">{designers.length}</div>
            </Card>

            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Badge className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Active
                </span>
              </div>
              <div className="text-2xl font-bold">
                {designers.filter((d) => d.is_active).length}
              </div>
            </Card>

            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Projects
                </span>
              </div>
              <div className="text-2xl font-bold">
                {designers.reduce((sum, d) => sum + d.total_projects, 0)}
              </div>
            </Card>

            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Revenue
                </span>
              </div>
              <div className="text-2xl font-bold">
                ${designers.reduce((sum, d) => sum + Number(d.total_revenue), 0).toFixed(0)}
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search designers..."
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Designers Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredDesigners.length === 0 ? (
              <Card className="col-span-full p-12 text-center">
                <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl font-medium text-muted-foreground">
                  No interior designers found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {searchQuery ? "Try adjusting your search" : "Add your first designer to get started"}
                </p>
              </Card>
            ) : (
              filteredDesigners.map((designer) => (
                <Card
                  key={designer.id}
                  className="group relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                >
                  {/* Header Section */}
                  <div className="p-5 pb-4 bg-gradient-to-br from-pink-50 to-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                          {designer.name}
                        </h3>
                        {designer.business_name && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {designer.business_name}
                          </p>
                        )}
                        {designer.specialization && (
                          <div className="flex items-center gap-1.5 mt-2">
                            <Palette className="h-3.5 w-3.5 text-indigo-600" />
                            <span className="text-xs text-muted-foreground">
                              {designer.specialization}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={designer.is_active ? "default" : "secondary"}
                        className="shrink-0"
                      >
                        {designer.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="px-5 py-4 space-y-2 border-t bg-white">
                    {designer.email && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 shrink-0" />
                        <span className="truncate">{designer.email}</span>
                      </div>
                    )}
                    {designer.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{designer.phone}</span>
                      </div>
                    )}
                    {designer.portfolio_url && (
                      <a
                        href={designer.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 shrink-0" />
                        <span className="truncate">View Portfolio</span>
                      </a>
                    )}
                  </div>

                  {/* Stats Section */}
                  <div className="px-5 py-4 border-t bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-indigo-600" />
                        <div>
                          <p className="text-xs text-muted-foreground">Projects</p>
                          <p className="text-sm font-semibold">{designer.total_projects}</p>
                        </div>
                      </div>
                      {designer.years_of_experience > 0 && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-xs text-muted-foreground">Experience</p>
                            <p className="text-sm font-semibold">{designer.years_of_experience} yrs</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Commission
                        </p>
                        <p className="text-base font-bold text-green-600">
                          {Number(designer.commission_percentage).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                          Revenue
                        </p>
                        <p className="text-base font-bold text-gray-900">
                          ${Number(designer.total_revenue).toFixed(0)}
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
