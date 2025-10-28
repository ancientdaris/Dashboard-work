"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileCheck, 
  X, 
  Clock, 
  ArrowLeft, 
  Edit, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  Calendar,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import type { Retailer } from "@/types/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DocumentStatus = ({ 
  label, 
  uploaded, 
  verified 
}: { 
  label: string; 
  uploaded: boolean; 
  verified: boolean 
}) => (
  <div className="flex items-center justify-between py-3 px-4 bg-white border rounded-lg hover:shadow-sm transition-shadow">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    {uploaded ? (
      verified ? (
        <Badge variant="default" className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    ) : (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
        <X className="h-3 w-3 mr-1" />
        Not Uploaded
      </Badge>
    )}
  </div>
);

export default function RetailerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const retailerId = params.id as string;
  
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRetailerDetails();
  }, [retailerId]);

  const fetchRetailerDetails = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('id', retailerId)
        .single();

      if (error) throw error;
      setRetailer(data);
    } catch (error) {
      console.error('Error fetching retailer details:', error);
    } finally {
      setLoading(false);
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

  const businessTypeName = {
    proprietorship: 'Proprietorship',
    private_limited: 'Private Limited',
    llp: 'LLP',
    other: 'Other'
  }[retailer.business_type || 'other'] || 'N/A';

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/retailers')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Retailers
              </Button>
              <Button onClick={() => router.push(`/retailers/${retailerId}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>

            {/* Hero Card */}
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-3xl">{retailer.name}</CardTitle>
                        <CardDescription className="text-base mt-1 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {retailer.owner_name}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge 
                      variant={retailer.is_active ? 'default' : 'secondary'}
                      className="text-sm px-3 py-1"
                    >
                      {retailer.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge 
                      variant={getKYCBadgeVariant(retailer.kyc_status)}
                      className="text-sm px-3 py-1"
                    >
                      KYC: {retailer.kyc_status || 'pending'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {retailer.mobile_number && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Mobile</p>
                        <p className="font-medium">{retailer.mobile_number}</p>
                      </div>
                    </div>
                  )}
                  {retailer.email && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium truncate">{retailer.email}</p>
                      </div>
                    </div>
                  )}
                  {(retailer.city || retailer.state) && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-medium">{[retailer.city, retailer.state].filter(Boolean).join(', ')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardDescription>Credit Limit</CardDescription>
                  <CardTitle className="text-3xl text-blue-600">
                    ₹{Number(retailer.credit_limit).toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardDescription>Outstanding Balance</CardDescription>
                  <CardTitle className="text-3xl text-red-600">
                    ₹{Number(retailer.outstanding_balance).toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardDescription>Available Credit</CardDescription>
                  <CardTitle className="text-3xl text-green-600">
                    ₹{(Number(retailer.credit_limit) - Number(retailer.outstanding_balance)).toLocaleString()}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="business" className="w-full">
              <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
                <TabsTrigger value="business">
                  <Building2 className="h-4 w-4 mr-2" />
                  Business Info
                </TabsTrigger>
                <TabsTrigger value="kyc">
                  <FileText className="h-4 w-4 mr-2" />
                  KYC Documents
                </TabsTrigger>
                <TabsTrigger value="details">
                  <User className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Business Info Tab */}
              <TabsContent value="business" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Company details and registration information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Business Type</p>
                        <p className="font-semibold">{businessTypeName}</p>
                      </div>
                      {retailer.gst_number && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">GST Number</p>
                          <p className="font-semibold">{retailer.gst_number}</p>
                        </div>
                      )}
                      {retailer.cin_number && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">CIN Number</p>
                          <p className="font-semibold">{retailer.cin_number}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {(retailer.address || retailer.city || retailer.state) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Address</CardTitle>
                      <CardDescription>Business location details</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {retailer.address && (
                          <p className="text-gray-700">{retailer.address}</p>
                        )}
                        {(retailer.city || retailer.state || retailer.postal_code) && (
                          <p className="text-gray-700">
                            {[retailer.city, retailer.state, retailer.postal_code]
                              .filter(Boolean)
                              .join(', ')}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* KYC Documents Tab */}
              <TabsContent value="kyc" className="space-y-6 mt-6">
                {retailer.kyc_rejection_reason && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-900 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        KYC Rejected
                      </CardTitle>
                      <CardDescription className="text-red-700">
                        {retailer.kyc_rejection_reason}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Company Documents</CardTitle>
                    <CardDescription>Required company verification documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <DocumentStatus
                      label="Company PAN Card"
                      uploaded={!!retailer.company_pan_card}
                      verified={retailer.company_pan_card_verified}
                    />
                  </CardContent>
                </Card>

                {retailer.business_type === 'proprietorship' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Proprietorship KYC Documents</CardTitle>
                      <CardDescription>Business registration documents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <DocumentStatus
                        label="GST Certificate"
                        uploaded={!!retailer.gst_certificate}
                        verified={retailer.gst_certificate_verified}
                      />
                      <DocumentStatus
                        label="Udhyam Aadhar"
                        uploaded={!!retailer.udhyam_aadhar}
                        verified={retailer.udhyam_aadhar_verified}
                      />
                      <DocumentStatus
                        label="Gumasta Certificate"
                        uploaded={!!retailer.gumasta_certificate}
                        verified={retailer.gumasta_certificate_verified}
                      />
                    </CardContent>
                  </Card>
                )}

                {(retailer.business_type === 'private_limited' || retailer.business_type === 'llp') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Registration Documents</CardTitle>
                      <CardDescription>Corporate registration and incorporation documents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <DocumentStatus
                        label="AOA (Articles of Association)"
                        uploaded={!!retailer.aoa_document}
                        verified={retailer.aoa_document_verified}
                      />
                      <DocumentStatus
                        label="MOA (Memorandum of Association)"
                        uploaded={!!retailer.moa_document}
                        verified={retailer.moa_document_verified}
                      />
                      <DocumentStatus
                        label="Certificate of Incorporation"
                        uploaded={!!retailer.certificate_of_incorporation}
                        verified={retailer.certificate_of_incorporation_verified}
                      />
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Owner Documents</CardTitle>
                    <CardDescription>Owner identity verification documents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <DocumentStatus
                      label="Owner PAN Card"
                      uploaded={!!retailer.owner_pan_card}
                      verified={retailer.owner_pan_card_verified}
                    />
                    <DocumentStatus
                      label="Owner Aadhar Card (Front)"
                      uploaded={!!retailer.owner_aadhar_card_front}
                      verified={retailer.owner_aadhar_card_front_verified}
                    />
                    <DocumentStatus
                      label="Owner Aadhar Card (Back)"
                      uploaded={!!retailer.owner_aadhar_card_back}
                      verified={retailer.owner_aadhar_card_back_verified}
                    />
                  </CardContent>
                </Card>

                {(retailer.kyc_submitted_at || retailer.kyc_verified_at) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>KYC Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {retailer.kyc_submitted_at && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Submitted:</span>
                          <span className="font-medium">{new Date(retailer.kyc_submitted_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      {retailer.kyc_verified_at && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span className="text-gray-600">Verified:</span>
                          <span className="font-medium text-green-600">{new Date(retailer.kyc_verified_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>Retailer account details and timestamps</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Account Created</p>
                        <p className="font-medium">{new Date(retailer.created_at).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-400">{new Date(retailer.created_at).toLocaleTimeString()}</p>
                      </div>
                      {retailer.updated_at && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">{new Date(retailer.updated_at).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">{new Date(retailer.updated_at).toLocaleTimeString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
