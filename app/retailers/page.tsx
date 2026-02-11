"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Trash2,
  Upload,
  FileCheck,
  X
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getRetailers, createRetailer, updateRetailer, deleteRetailer } from "@/src/services/retailerService";
import { useToast } from "@/components/ui/use-toast";
import type { Retailer } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";

type BusinessType = 'proprietorship' | 'private_limited' | 'llp' | 'other';

interface DocumentUpload {
  file: File;
  name: string;
  preview?: string;
}

const DocumentUploadField = ({
  label,
  document,
  onSelect,
  onRemove,
  required = false
}: {
  label: string;
  document: DocumentUpload | null;
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  required?: boolean;
}) => (
  <div className="space-y-2">
    <Label>
      {label} {required && <span className="text-red-600">*</span>}
    </Label>
    {document ? (
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-300">
        <div className="flex items-center gap-2 flex-1">
          <FileCheck className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-900 truncate">{document.name}</span>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onRemove}
        >
          <X className="h-4 w-4 text-red-600" />
        </Button>
      </div>
    ) : (
      <div>
        <Input
          type="file"
          accept="image/*,application/pdf"
          onChange={onSelect}
          className="hidden"
          id={`file-${label.replace(/\s+/g, '-').toLowerCase()}`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const fileInput = window.document.getElementById(`file-${label.replace(/\s+/g, '-').toLowerCase()}`);
            if (fileInput) {
              (fileInput as HTMLInputElement).click();
            }
          }}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload {label}
        </Button>
      </div>
    )}
  </div>
);

export default function RetailersPage() {
  const { toast } = useToast();
  const router = useRouter();
  
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
    owner_name: "",
    email: "",
    password: "",
    mobile_number: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    gst_number: "",
    business_type: "proprietorship" as BusinessType,
    cin_number: "",
    tax_id: "",
    gstin: "",
    credit_limit: "0",
    outstanding_balance: "0",
    is_active: true,
  });

  // Document uploads
  const [companyPanCard, setCompanyPanCard] = useState<DocumentUpload | null>(null);
  const [gstCertificate, setGstCertificate] = useState<DocumentUpload | null>(null);
  const [udhyamAadhar, setUdhyamAadhar] = useState<DocumentUpload | null>(null);
  const [gumastaCertificate, setGumastaCertificate] = useState<DocumentUpload | null>(null);
  const [aoaDocument, setAoaDocument] = useState<DocumentUpload | null>(null);
  const [moaDocument, setMoaDocument] = useState<DocumentUpload | null>(null);
  const [certificateOfIncorporation, setCertificateOfIncorporation] = useState<DocumentUpload | null>(null);
  const [ownerPanCard, setOwnerPanCard] = useState<DocumentUpload | null>(null);
  const [ownerAadharCardFront, setOwnerAadharCardFront] = useState<DocumentUpload | null>(null);
  const [ownerAadharCardBack, setOwnerAadharCardBack] = useState<DocumentUpload | null>(null);

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

  const uploadDocument = async (doc: DocumentUpload, path: string): Promise<string | null> => {
    try {
      const supabase = createClient();
      const fileExt = doc.file.name.split('.').pop();
      const fileName = `${path}_${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, doc.file, {
          contentType: doc.file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;
      return filePath;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Retailer name is required",
        variant: "destructive",
      });
      return;
    }

    if (!editingRetailer) {
      if (!formData.owner_name.trim()) {
        toast({
          title: "Validation Error",
          description: "Owner name is required",
          variant: "destructive",
        });
        return;
      }
      if (!formData.mobile_number.trim()) {
        toast({
          title: "Validation Error",
          description: "Mobile number is required",
          variant: "destructive",
        });
        return;
      }
      if (!formData.email || !formData.password) {
        toast({
          title: "Validation Error",
          description: "Email and password are required for retailer login",
          variant: "destructive",
        });
        return;
      }
      if (!companyPanCard) {
        toast({
          title: "Validation Error",
          description: "Company PAN card is required",
          variant: "destructive",
        });
        return;
      }
      if (!ownerPanCard) {
        toast({
          title: "Validation Error",
          description: "Owner PAN card is required",
          variant: "destructive",
        });
        return;
      }
      if (!ownerAadharCardFront || !ownerAadharCardBack) {
        toast({
          title: "Validation Error",
          description: "Owner Aadhar card (both sides) is required",
          variant: "destructive",
        });
        return;
      }

      // Business type specific validation
      if (formData.business_type === 'proprietorship') {
        if (!gstCertificate && !udhyamAadhar && !gumastaCertificate) {
          toast({
            title: "Validation Error",
            description: "For Proprietorship: Provide at least one document (GST Certificate, Udhyam Aadhar, or Gumasta Certificate)",
            variant: "destructive",
          });
          return;
        }
      } else if (formData.business_type === 'private_limited' || formData.business_type === 'llp') {
        if (!aoaDocument && !moaDocument && !certificateOfIncorporation) {
          toast({
            title: "Validation Error",
            description: "For Private Limited/LLP: Provide at least one document (AOA, MOA, or Certificate of Incorporation)",
            variant: "destructive",
          });
          return;
        }
      }
    }
    
    try {
      setIsSubmitting(true);
      const supabase = createClient();
      
      if (editingRetailer) {
        // Update existing retailer
        const retailerData = {
          name: formData.name,
          email: formData.email || null,
          mobile_number: formData.phone || null,
          address: formData.address || null,
          city: formData.city || null,
          state: formData.state || null,
          postal_code: formData.postal_code || null,
          gst_number: formData.gstin || null,
          credit_limit: parseFloat(formData.credit_limit) || 0,
          outstanding_balance: parseFloat(formData.outstanding_balance) || 0,
          is_active: formData.is_active,
        };

        const { error } = await updateRetailer(editingRetailer.id, retailerData);
        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Retailer updated successfully",
        });
      } else {
        // Create new retailer with auth and documents
        const { data: { session: adminSession } } = await supabase.auth.getSession();
        let userId = null;

        // Create auth user for retailer
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.owner_name,
              user_type: 'retailer',
            },
          },
        });

        if (authError) throw authError;
        userId = authData.user?.id || null;

        // Upload documents
        const companyPanPath = companyPanCard ? await uploadDocument(companyPanCard, `retailers/${userId}/company_pan`) : null;
        const ownerPanPath = ownerPanCard ? await uploadDocument(ownerPanCard, `retailers/${userId}/owner_pan`) : null;
        const ownerAadharFrontPath = ownerAadharCardFront ? await uploadDocument(ownerAadharCardFront, `retailers/${userId}/owner_aadhar_front`) : null;
        const ownerAadharBackPath = ownerAadharCardBack ? await uploadDocument(ownerAadharCardBack, `retailers/${userId}/owner_aadhar_back`) : null;
        const gstCertPath = gstCertificate ? await uploadDocument(gstCertificate, `retailers/${userId}/gst_cert`) : null;
        const udhyamPath = udhyamAadhar ? await uploadDocument(udhyamAadhar, `retailers/${userId}/udhyam`) : null;
        const gumastaPath = gumastaCertificate ? await uploadDocument(gumastaCertificate, `retailers/${userId}/gumasta`) : null;
        const aoaPath = aoaDocument ? await uploadDocument(aoaDocument, `retailers/${userId}/aoa`) : null;
        const moaPath = moaDocument ? await uploadDocument(moaDocument, `retailers/${userId}/moa`) : null;
        const coiPath = certificateOfIncorporation ? await uploadDocument(certificateOfIncorporation, `retailers/${userId}/coi`) : null;

        // Create retailer record
        const { error } = await supabase.from('retailers').insert([{
          user_id: userId,
          name: formData.name.trim(),
          owner_name: formData.owner_name.trim(),
          email: formData.email || null,
          mobile_number: formData.mobile_number.trim() || formData.phone || null,
          address: formData.address.trim() || null,
          city: formData.city.trim() || null,
          state: formData.state.trim() || null,
          postal_code: formData.postal_code.trim() || null,
          gst_number: formData.gst_number.trim() || null,
          business_type: formData.business_type,
          credit_limit: parseFloat(formData.credit_limit) || 0,
          outstanding_balance: parseFloat(formData.outstanding_balance) || 0,
          is_active: formData.is_active,
          company_pan_card: companyPanPath,
          gst_certificate: gstCertPath,
          udhyam_aadhar: udhyamPath,
          gumasta_certificate: gumastaPath,
          aoa_document: aoaPath,
          moa_document: moaPath,
          certificate_of_incorporation: coiPath,
          cin_number: formData.cin_number.trim() || null,
          owner_pan_card: ownerPanPath,
          owner_aadhar_card_front: ownerAadharFrontPath,
          owner_aadhar_card_back: ownerAadharBackPath,
          kyc_status: 'submitted',
          kyc_submitted_at: new Date().toISOString(),
        }]);

        if (error) throw error;

        // Restore admin session
        if (adminSession) {
          await supabase.auth.setSession({
            access_token: adminSession.access_token,
            refresh_token: adminSession.refresh_token,
          });
        }
        
        toast({
          title: "Success",
          description: "Retailer created successfully with KYC documents",
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
      owner_name: "",
      email: retailer.email || "",
      password: "",
      mobile_number: "",
      phone: retailer.mobile_number || "",
      address: retailer.address || "",
      city: retailer.city || "",
      state: retailer.state || "",
      postal_code: retailer.postal_code || "",
      country: "India",
      gst_number: "",
      business_type: "proprietorship",
      cin_number: "",
      tax_id: "",
      gstin: retailer.gst_number || "",
      credit_limit: (retailer.credit_limit ?? 0).toString(),
      outstanding_balance: (retailer.outstanding_balance ?? 0).toString(),
      is_active: retailer.is_active ?? true,
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

  const handleFileSelect = (setter: (doc: DocumentUpload | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setter({
        file,
        name: file.name,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const resetForm = () => {
    setEditingRetailer(null);
    setFormData({
      name: "",
      owner_name: "",
      email: "",
      password: "",
      mobile_number: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "India",
      gst_number: "",
      business_type: "proprietorship",
      cin_number: "",
      tax_id: "",
      gstin: "",
      credit_limit: "0",
      outstanding_balance: "0",
      is_active: true,
    });
    setCompanyPanCard(null);
    setGstCertificate(null);
    setUdhyamAadhar(null);
    setGumastaCertificate(null);
    setAoaDocument(null);
    setMoaDocument(null);
    setCertificateOfIncorporation(null);
    setOwnerPanCard(null);
    setOwnerAadharCardFront(null);
    setOwnerAadharCardBack(null);
  };

  const filteredRetailers = retailers.filter((retailer) => {
    const matchesSearch = 
      retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.mobile_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.city?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && retailer.is_active) ||
      (statusFilter === "inactive" && !retailer.is_active);
    
    const matchesState = stateFilter === "all-states" || retailer.state === stateFilter;
    
    return matchesSearch && matchesStatus && matchesState;
  });

  const activeRetailers = retailers.filter(r => r.is_active).length;
  const totalOutstanding = retailers.reduce((sum, r) => sum + (r.outstanding_balance ?? 0), 0);
  const totalCreditLimit = retailers.reduce((sum, r) => sum + (r.credit_limit ?? 0), 0);

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
                    const creditUsagePercent = (retailer.credit_limit ?? 0) > 0
                      ? ((retailer.outstanding_balance ?? 0) / (retailer.credit_limit ?? 1)) * 100
                      : 0;
                    
                    return (
                      <tr 
                        key={retailer.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => router.push(`/retailers/${retailer.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{retailer.name}</p>
                            {retailer.gst_number && (
                              <p className="text-xs text-gray-500">GSTIN: {retailer.gst_number}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {retailer.mobile_number && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{retailer.mobile_number}</span>
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
                              ₹{(retailer.outstanding_balance ?? 0).toLocaleString()} / ₹{(retailer.credit_limit ?? 0).toLocaleString()}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(retailer);
                              }}
                            >
                              <Edit className="h-4 w-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(retailer.id);
                              }}
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
        <SheetContent className="sm:max-w-[600px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingRetailer ? "Edit Retailer" : "Add Retailer"}</SheetTitle>
            <SheetDescription>
              {editingRetailer ? "Update retailer information" : "Add a new retailer to your network"}
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Business/Shop Name *</Label>
                <Input
                  id="name"
                  placeholder="Retailer business name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {!editingRetailer && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="owner_name">Owner Name *</Label>
                    <Input
                      id="owner_name"
                      placeholder="Owner full name"
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobile_number">Mobile Number *</Label>
                    <Input
                      id="mobile_number"
                      placeholder="+91 98765 43210"
                      value={formData.mobile_number}
                      onChange={(e) => setFormData({ ...formData, mobile_number: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Retailer account will be created. You will remain logged in as admin.</p>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="business_type">Business Type</Label>
                <Select
                  value={formData.business_type}
                  onValueChange={(value) => setFormData({ ...formData, business_type: value as BusinessType })}
                  disabled={!!editingRetailer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="proprietorship">Proprietorship</SelectItem>
                      <SelectItem value="private_limited">Private Limited</SelectItem>
                      <SelectItem value="llp">LLP</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gst_number">GST Number</Label>
                <Input
                  id="gst_number"
                  placeholder="24AABCU9741H1ZS"
                  value={formData.gst_number}
                  onChange={(e) => setFormData({ ...formData, gst_number: e.target.value.toUpperCase() })}
                />
              </div>
            </div>

            {/* Address Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address</h3>

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

              {(formData.business_type === 'private_limited' || formData.business_type === 'llp') && !editingRetailer && (
                <div className="space-y-2">
                  <Label htmlFor="cin_number">CIN Number</Label>
                  <Input
                    id="cin_number"
                    placeholder="Corporate Identity Number"
                    value={formData.cin_number}
                    onChange={(e) => setFormData({ ...formData, cin_number: e.target.value.toUpperCase() })}
                  />
                </div>
              )}
            </div>

            {/* Document Uploads - Only for new retailers */}
            {!editingRetailer && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Company Documents</h3>
                  <p className="text-sm text-gray-500">Company PAN card is mandatory</p>
                  
                  <DocumentUploadField
                    label="Company PAN Card"
                    document={companyPanCard}
                    onSelect={handleFileSelect(setCompanyPanCard)}
                    onRemove={() => setCompanyPanCard(null)}
                    required
                  />
                </div>

                {formData.business_type === 'proprietorship' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Proprietorship KYC Documents</h3>
                    <p className="text-sm text-gray-500">Provide at least ONE of the following</p>
                    
                    <DocumentUploadField
                      label="GST Certificate"
                      document={gstCertificate}
                      onSelect={handleFileSelect(setGstCertificate)}
                      onRemove={() => setGstCertificate(null)}
                    />
                    
                    <DocumentUploadField
                      label="Udhyam Aadhar"
                      document={udhyamAadhar}
                      onSelect={handleFileSelect(setUdhyamAadhar)}
                      onRemove={() => setUdhyamAadhar(null)}
                    />
                    
                    <DocumentUploadField
                      label="Gumasta Certificate"
                      document={gumastaCertificate}
                      onSelect={handleFileSelect(setGumastaCertificate)}
                      onRemove={() => setGumastaCertificate(null)}
                    />
                  </div>
                )}

                {(formData.business_type === 'private_limited' || formData.business_type === 'llp') && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Company Registration Documents</h3>
                    <p className="text-sm text-gray-500">Provide at least ONE of the following</p>
                    
                    <DocumentUploadField
                      label="AOA (Articles of Association)"
                      document={aoaDocument}
                      onSelect={handleFileSelect(setAoaDocument)}
                      onRemove={() => setAoaDocument(null)}
                    />
                    
                    <DocumentUploadField
                      label="MOA (Memorandum of Association)"
                      document={moaDocument}
                      onSelect={handleFileSelect(setMoaDocument)}
                      onRemove={() => setMoaDocument(null)}
                    />
                    
                    <DocumentUploadField
                      label="Certificate of Incorporation"
                      document={certificateOfIncorporation}
                      onSelect={handleFileSelect(setCertificateOfIncorporation)}
                      onRemove={() => setCertificateOfIncorporation(null)}
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Owner Documents</h3>
                  <p className="text-sm text-gray-500">All documents are mandatory</p>
                  
                  <DocumentUploadField
                    label="Owner PAN Card"
                    document={ownerPanCard}
                    onSelect={handleFileSelect(setOwnerPanCard)}
                    onRemove={() => setOwnerPanCard(null)}
                    required
                  />
                  
                  <DocumentUploadField
                    label="Owner Aadhar Card (Front)"
                    document={ownerAadharCardFront}
                    onSelect={handleFileSelect(setOwnerAadharCardFront)}
                    onRemove={() => setOwnerAadharCardFront(null)}
                    required
                  />
                  
                  <DocumentUploadField
                    label="Owner Aadhar Card (Back)"
                    document={ownerAadharCardBack}
                    onSelect={handleFileSelect(setOwnerAadharCardBack)}
                    onRemove={() => setOwnerAadharCardBack(null)}
                    required
                  />
                </div>
              </>
            )}

            {/* Financial Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Financial Settings</h3>

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
