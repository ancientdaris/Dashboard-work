"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Loader2,
  Save,
  Trash2,
  AlertCircle
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import type { Retailer } from "@/types/database.types";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

type BusinessType = 'proprietorship' | 'private_limited' | 'llp' | 'other';

export default function EditRetailerPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const retailerId = params.id as string;
  
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('proprietorship');
  const [creditLimit, setCreditLimit] = useState('0');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchRetailer();
  }, [retailerId]);

  const fetchRetailer = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('id', retailerId)
        .single();

      if (error || !data) {
        toast({
          title: "Error",
          description: "Failed to load retailer data",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const retailerData = data as Retailer;
      setRetailer(retailerData);
      setName(retailerData.name || '');
      setOwnerName(retailerData.owner_name || '');
      setEmail(retailerData.email || '');
      setMobileNumber(retailerData.mobile_number || '');
      setAddress(retailerData.address || '');
      setCity(retailerData.city || '');
      setState(retailerData.state || '');
      setPostalCode(retailerData.postal_code || '');
      setGstNumber(retailerData.gst_number || '');
      setBusinessType(retailerData.business_type || 'proprietorship');
      setCreditLimit(retailerData.credit_limit?.toString() || '0');
      setIsActive(retailerData.is_active ?? true);
    } catch (error) {
      console.error('Error fetching retailer:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRetailer = async () => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Retailer name is required",
        variant: "destructive",
      });
      return;
    }
    if (!ownerName.trim()) {
      toast({
        title: "Validation Error",
        description: "Owner name is required",
        variant: "destructive",
      });
      return;
    }
    if (!mobileNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Mobile number is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('retailers')
        .update({
          name: name.trim(),
          owner_name: ownerName.trim(),
          email: email.trim() || null,
          mobile_number: mobileNumber.trim(),
          address: address.trim() || null,
          city: city.trim() || null,
          state: state.trim() || null,
          postal_code: postalCode.trim() || null,
          gst_number: gstNumber.trim() || null,
          business_type: businessType,
          credit_limit: parseFloat(creditLimit) || 0,
          is_active: isActive,
        })
        .eq('id', retailerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Retailer updated successfully",
      });
      
      setTimeout(() => router.push(`/retailers/${retailerId}`), 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to update retailer',
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRetailer = async () => {
    if (!confirm("Are you sure you want to delete this retailer? This action cannot be undone.")) {
      return;
    }

    setDeleting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from('retailers').delete().eq('id', retailerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Retailer deleted successfully",
      });
      
      setTimeout(() => router.push('/retailers'), 1500);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || 'Failed to delete retailer',
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const getKYCBadgeVariant = (status: string | null) => {
    switch (status) {
      case 'verified': return 'default';
      case 'submitted': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

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

  if (!retailer) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Retailer not found</h2>
              <Button onClick={() => router.push('/retailers')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Retailers
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
                onClick={() => router.push(`/retailers/${retailerId}`)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Details
              </Button>
              <Badge 
                variant={getKYCBadgeVariant(retailer.kyc_status)}
                className="text-sm px-3 py-1"
              >
                KYC: {retailer.kyc_status || 'pending'}
              </Badge>
            </div>

            {/* Title Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-3xl">Edit Retailer</CardTitle>
                <CardDescription>
                  Update retailer information and settings
                </CardDescription>
              </CardHeader>
            </Card>

            {/* KYC Notice */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Note: KYC documents cannot be edited after creation. Contact support to update documents.
              </AlertDescription>
            </Alert>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Core retailer details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Retailer Name *</Label>
                    <Input
                      id="name"
                      placeholder="Retailer name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      placeholder="Owner name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      placeholder="Mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      type="tel"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select value={businessType} onValueChange={(value) => setBusinessType(value as BusinessType)}>
                      <SelectTrigger id="businessType">
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="proprietorship">Proprietorship</SelectItem>
                        <SelectItem value="private_limited">Private Limited</SelectItem>
                        <SelectItem value="llp">LLP</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      placeholder="GST Number"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address */}
            <Card>
              <CardHeader>
                <CardTitle>Address</CardTitle>
                <CardDescription>Business location details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Street address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      placeholder="Postal code"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Settings</CardTitle>
                <CardDescription>Credit and payment configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit (₹)</Label>
                  <Input
                    id="creditLimit"
                    placeholder="0.00"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    type="number"
                    step="0.01"
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active Status</Label>
                    <p className="text-sm text-gray-500">
                      Enable or disable this retailer account
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pb-8">
              <Button 
                className="flex-1" 
                onClick={handleUpdateRetailer} 
                disabled={saving || deleting}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Retailer
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                className="flex-1 text-white "
                onClick={handleDeleteRetailer}
                disabled={saving || deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin " />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2 text-white" />
                    Delete Retailer
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
