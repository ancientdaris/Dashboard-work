"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
  FileText,
  User,
  Package,
  Users,
  Loader2,
  CheckCircle2,
  Clock,
  X,
  Calendar,
  AlertCircle,
  Star
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Wholesaler = Database['public']['Tables']['wholesalers']['Row'];
type WholesalerProductFeed = Database['public']['Tables']['wholesaler_product_feed']['Row'];

interface LinkedRetailer {
  id: string;
  region: string | null;
  is_active: boolean | null;
  created_at: string | null;
  retailer?: {
    full_name: string | null;
    email: string;
  } | null;
}

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

export default function WholesalerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const wholesalerId = params.id as string;

  const [wholesaler, setWholesaler] = useState<Wholesaler | null>(null);
  const [products, setProducts] = useState<WholesalerProductFeed[]>([]);
  const [linkedRetailers, setLinkedRetailers] = useState<LinkedRetailer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wholesalerId) {
      fetchWholesaler();
    }
  }, [wholesalerId]);

  const fetchWholesaler = async () => {
    try {
      const supabase = createClient();

      // Fetch wholesaler details
      const { data, error } = await supabase
        .from('wholesalers')
        .select('*')
        .eq('id', wholesalerId)
        .single();

      if (error) throw error;
      setWholesaler(data);

      // Fetch product feed
      const { data: feedData } = await supabase
        .from('wholesaler_product_feed')
        .select('*')
        .eq('wholesaler_id', wholesalerId)
        .order('product_name');

      setProducts(feedData || []);

      // Fetch linked retailers (via profiles FK using user_id)
      if (data?.user_id) {
        const { data: linksData } = await supabase
          .from('wholesaler_retailer_links')
          .select(`
            id, region, is_active, created_at,
            retailer:profiles!wholesaler_retailer_links_retailer_id_fkey (
              full_name, email
            )
          `)
          .eq('wholesaler_id', data.user_id)
          .order('created_at', { ascending: false });

        setLinkedRetailers(
          (linksData || []).map((link: any) => ({
            ...link,
            retailer: Array.isArray(link.retailer) ? link.retailer[0] || null : link.retailer,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching wholesaler:', error);
    } finally {
      setLoading(false);
    }
  };

  const getKycBadge = (status: string | null) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><CheckCircle2 className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100"><Clock className="h-3 w-3 mr-1" />Submitted</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100"><AlertCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
    }
  };

  const getBusinessTypeLabel = (type: string | null) => {
    switch (type) {
      case 'proprietorship': return 'Proprietorship';
      case 'private_limited': return 'Private Limited';
      case 'llp': return 'LLP';
      default: return type || 'Not Specified';
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

  if (!wholesaler) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-lg text-muted-foreground">Wholesaler not found</p>
                <Button variant="outline" onClick={() => router.push('/wholesalers')} className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Wholesalers
                </Button>
              </CardContent>
            </Card>
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
          <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => router.push('/wholesalers')} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Wholesalers
              </Button>
            </div>

            {/* Hero Card */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{wholesaler.business_name}</h1>
                      <Badge variant={wholesaler.is_active ? "default" : "secondary"}>
                        {wholesaler.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {getKycBadge(wholesaler.kyc_status)}
                    </div>
                    {wholesaler.contact_person && (
                      <p className="text-lg text-gray-600 mb-4">{wholesaler.contact_person}</p>
                    )}
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{wholesaler.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{wholesaler.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{[wholesaler.city, wholesaler.state].filter(Boolean).join(', ') || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-red-50">
                    <IndianRupee className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                    <p className="text-2xl font-bold text-red-600">₹{(wholesaler.outstanding_balance ?? 0).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Products in Feed</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-50">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Linked Retailers</p>
                    <p className="text-2xl font-bold">{linkedRetailers.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="products" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
                <TabsTrigger value="products">
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="business">
                  <Building2 className="h-4 w-4 mr-2" />
                  Business Info
                </TabsTrigger>
                <TabsTrigger value="retailers">
                  <Users className="h-4 w-4 mr-2" />
                  Linked Retailers
                </TabsTrigger>
                <TabsTrigger value="kyc">
                  <FileText className="h-4 w-4 mr-2" />
                  KYC Documents
                </TabsTrigger>
              </TabsList>

              {/* Products Tab */}
              <TabsContent value="products" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Feed</CardTitle>
                    <CardDescription>Products offered by this wholesaler</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {products.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Package className="h-12 w-12 mb-4" />
                        <p className="font-medium">No products in feed</p>
                        <p className="text-sm">This wholesaler hasn't added any products yet</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Wholesale Price</TableHead>
                            <TableHead>MRP</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Available Qty</TableHead>
                            <TableHead>Min Order</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{product.product_name}</span>
                                  {product.is_featured && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">{product.sku || 'N/A'}</TableCell>
                              <TableCell>{product.brand || '-'}</TableCell>
                              <TableCell>{product.category || '-'}</TableCell>
                              <TableCell className="font-medium">₹{product.wholesale_price.toLocaleString()}</TableCell>
                              <TableCell>{product.mrp ? `₹${product.mrp.toLocaleString()}` : '-'}</TableCell>
                              <TableCell>{product.discount_percentage ? `${product.discount_percentage}%` : '-'}</TableCell>
                              <TableCell>{product.available_quantity ?? '-'}</TableCell>
                              <TableCell>{product.min_order_quantity ?? '-'}</TableCell>
                              <TableCell>
                                <Badge variant={product.is_active ? "default" : "secondary"}>
                                  {product.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Business Info Tab */}
              <TabsContent value="business" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Company details and registration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Business Type</p>
                        <p className="font-medium">{getBusinessTypeLabel(wholesaler.business_type)}</p>
                      </div>
                      {wholesaler.gst_number && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">GST Number</p>
                          <p className="font-medium font-mono">{wholesaler.gst_number}</p>
                        </div>
                      )}
                      {wholesaler.cin_number && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">CIN Number</p>
                          <p className="font-medium font-mono">{wholesaler.cin_number}</p>
                        </div>
                      )}
                      {wholesaler.owner_name && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Owner Name</p>
                          <p className="font-medium">{wholesaler.owner_name}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {wholesaler.address && <p>{wholesaler.address}</p>}
                      <p>
                        {[wholesaler.city, wholesaler.state, wholesaler.postal_code].filter(Boolean).join(', ')}
                      </p>
                      {wholesaler.country && <p>{wholesaler.country}</p>}
                      {!wholesaler.address && !wholesaler.city && (
                        <p className="text-muted-foreground">No address provided</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Account Created</p>
                        <p className="font-medium">{wholesaler.created_at ? new Date(wholesaler.created_at).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      {wholesaler.updated_at && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">{new Date(wholesaler.updated_at).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Linked Retailers Tab */}
              <TabsContent value="retailers" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Linked Retailers</CardTitle>
                    <CardDescription>Retailers connected to this wholesaler</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {linkedRetailers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mb-4" />
                        <p className="font-medium">No linked retailers</p>
                        <p className="text-sm">No retailers are linked to this wholesaler yet</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Retailer</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Region</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Since</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {linkedRetailers.map((link) => (
                            <TableRow key={link.id}>
                              <TableCell className="font-medium">
                                {link.retailer?.full_name || 'Unknown'}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {link.retailer?.email || 'N/A'}
                              </TableCell>
                              <TableCell>{link.region || '-'}</TableCell>
                              <TableCell>
                                <Badge variant={link.is_active ? "default" : "secondary"}>
                                  {link.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {link.created_at ? new Date(link.created_at).toLocaleDateString() : 'N/A'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* KYC Documents Tab */}
              <TabsContent value="kyc" className="space-y-6 mt-6">
                {wholesaler.kyc_status === 'rejected' && wholesaler.kyc_rejection_reason && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader>
                      <CardTitle className="text-red-700 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        KYC Rejected
                      </CardTitle>
                      <CardDescription className="text-red-700">
                        {wholesaler.kyc_rejection_reason}
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
                      uploaded={!!wholesaler.company_pan_card}
                      verified={wholesaler.company_pan_card_verified ?? false}
                    />
                    <DocumentStatus
                      label="GST Certificate"
                      uploaded={!!wholesaler.gst_certificate}
                      verified={wholesaler.gst_certificate_verified ?? false}
                    />
                    <DocumentStatus
                      label="Udhyam Aadhar"
                      uploaded={!!wholesaler.udhyam_aadhar}
                      verified={wholesaler.udhyam_aadhar_verified ?? false}
                    />
                    <DocumentStatus
                      label="Gumasta Certificate"
                      uploaded={!!wholesaler.gumasta_certificate}
                      verified={wholesaler.gumasta_certificate_verified ?? false}
                    />
                  </CardContent>
                </Card>

                {(wholesaler.business_type === 'private_limited' || wholesaler.business_type === 'llp') && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Registration Documents</CardTitle>
                      <CardDescription>Corporate registration and incorporation documents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <DocumentStatus
                        label="AOA (Articles of Association)"
                        uploaded={!!wholesaler.aoa_document}
                        verified={wholesaler.aoa_document_verified ?? false}
                      />
                      <DocumentStatus
                        label="MOA (Memorandum of Association)"
                        uploaded={!!wholesaler.moa_document}
                        verified={wholesaler.moa_document_verified ?? false}
                      />
                      <DocumentStatus
                        label="Certificate of Incorporation"
                        uploaded={!!wholesaler.certificate_of_incorporation}
                        verified={wholesaler.certificate_of_incorporation_verified ?? false}
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
                      uploaded={!!wholesaler.owner_pan_card}
                      verified={wholesaler.owner_pan_card_verified ?? false}
                    />
                    <DocumentStatus
                      label="Owner Aadhar Card (Front)"
                      uploaded={!!wholesaler.owner_aadhar_card_front}
                      verified={wholesaler.owner_aadhar_card_front_verified ?? false}
                    />
                    <DocumentStatus
                      label="Owner Aadhar Card (Back)"
                      uploaded={!!wholesaler.owner_aadhar_card_back}
                      verified={wholesaler.owner_aadhar_card_back_verified ?? false}
                    />
                  </CardContent>
                </Card>

                {(wholesaler.kyc_submitted_at || wholesaler.kyc_verified_at) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>KYC Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {wholesaler.kyc_submitted_at && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Submitted:</span>
                          <span className="font-medium">{new Date(wholesaler.kyc_submitted_at).toLocaleDateString()}</span>
                        </div>
                      )}
                      {wholesaler.kyc_verified_at && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-gray-600">Verified:</span>
                          <span className="font-medium">{new Date(wholesaler.kyc_verified_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
