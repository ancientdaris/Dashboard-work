"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  name: string;
  location: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  is_active: boolean;
}

interface FormErrors {
  name?: string;
  city?: string;
  postal_code?: string;
}

export default function AddWarehousePage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    location: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    is_active: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Warehouse name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name must not exceed 100 characters";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (formData.postal_code && !/^\d{6}$/.test(formData.postal_code)) {
      newErrors.postal_code = "Enter valid 6-digit postal code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const warehouseData = {
        name: formData.name.trim(),
        location: formData.location.trim() || null,
        address: formData.address.trim() || null,
        city: formData.city.trim(),
        state: formData.state.trim() || null,
        postal_code: formData.postal_code || null,
        owner_id: user?.id,
        is_active: formData.is_active,
      };

      const { error } = await supabase
        .from("warehouses")
        .insert([warehouseData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Warehouse created successfully",
      });
      
      router.push("/warehouses");
    } catch (error: any) {
      console.error("Error saving warehouse:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save warehouse",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-2xl">Add New Warehouse</CardTitle>
                    <CardDescription>
                      Create a new warehouse location
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Form */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Warehouse Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Warehouse Name <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter warehouse name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setErrors({ ...errors, name: undefined });
                    }}
                    className={errors.name ? "border-red-500" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location/Area</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Industrial Area, Sector 5"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address</Label>
                  <Input
                    id="address"
                    placeholder="Enter complete address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={(e) => {
                        setFormData({ ...formData, city: e.target.value });
                        setErrors({ ...errors, city: undefined });
                      }}
                      className={errors.city ? "border-red-500" : ""}
                    />
                    {errors.city && (
                      <p className="text-xs text-red-600">{errors.city}</p>
                    )}
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

                {/* Postal Code */}
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    value={formData.postal_code}
                    onChange={(e) => {
                      setFormData({ ...formData, postal_code: e.target.value });
                      setErrors({ ...errors, postal_code: undefined });
                    }}
                    className={errors.postal_code ? "border-red-500" : ""}
                  />
                  {errors.postal_code && (
                    <p className="text-xs text-red-600">{errors.postal_code}</p>
                  )}
                </div>

                {/* Active Status */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked as boolean })
                    }
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    Warehouse is active
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Create Warehouse"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
