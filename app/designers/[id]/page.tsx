"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Phone,
  Mail,
  MapPin,
  Palette,
  Briefcase,
  Award,
  ExternalLink,
  IndianRupee,
  Loader2,
  FolderKanban,
  Users,
  Banknote,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import type { Database } from "@/types/database.types";

type Designer = Database["public"]["Tables"]["interior_designers"]["Row"];

interface DesignerProject {
  id: string;
  project_name: string | null;
  client_name: string | null;
  project_type: string | null;
  project_value: number | null;
  commission_amount: number | null;
  status: string | null;
  start_date: string | null;
  completion_date: string | null;
  location: string | null;
  overall_progress_percent: number | null;
  estimated_budget: number | null;
}

interface DesignerCommission {
  id: string;
  order_amount: number | null;
  commission_percent: number | null;
  commission_amount: number | null;
  total_amount: number | null;
  status: string | null;
  order_date: string | null;
  paid_at: string | null;
}

interface LinkedRetailer {
  id: string;
  is_active: boolean | null;
  commission_percentage: number | null;
  created_at: string | null;
  retailer?: {
    name: string | null;
    email: string | null;
    mobile_number: string | null;
    city: string | null;
  } | null;
}

export default function DesignerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const designerId = params.id as string;

  const [designer, setDesigner] = useState<Designer | null>(null);
  const [projects, setProjects] = useState<DesignerProject[]>([]);
  const [commissions, setCommissions] = useState<DesignerCommission[]>([]);
  const [linkedRetailers, setLinkedRetailers] = useState<LinkedRetailer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (designerId) {
      fetchDesigner();
    }
  }, [designerId]);

  const fetchDesigner = async () => {
    try {
      const supabase = createClient();

      // Fetch designer details
      const { data, error } = await supabase
        .from("interior_designers")
        .select("*")
        .eq("id", designerId)
        .single();

      if (error) throw error;
      setDesigner(data);

      // Fetch projects
      const { data: projectsData } = await supabase
        .from("designer_projects")
        .select("id, project_name, client_name, project_type, project_value, commission_amount, status, start_date, completion_date, location, overall_progress_percent, estimated_budget")
        .eq("designer_id", designerId)
        .order("created_at", { ascending: false });

      setProjects(projectsData || []);

      // Fetch commissions
      const { data: commissionsData } = await supabase
        .from("designer_commissions")
        .select("id, order_amount, commission_percent, commission_amount, total_amount, status, order_date, paid_at")
        .eq("designer_id", designerId)
        .order("created_at", { ascending: false });

      setCommissions(commissionsData || []);

      // Fetch linked retailers
      const { data: retailerLinksData } = await supabase
        .from("designer_retailer_links")
        .select(`
          id, is_active, commission_percentage, created_at,
          retailer:retailers!designer_retailer_links_retailer_id_fkey (
            name, email, mobile_number, city
          )
        `)
        .eq("designer_id", designerId)
        .order("created_at", { ascending: false });

      setLinkedRetailers(
        (retailerLinksData || []).map((link: any) => ({
          ...link,
          retailer: Array.isArray(link.retailer) ? link.retailer[0] || null : link.retailer,
        }))
      );
    } catch (error) {
      console.error("Error fetching designer:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case "in_progress":
      case "active":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">In Progress</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Cancelled</Badge>;
      case "paid":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
      case "approved":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Approved</Badge>;
      default:
        return <Badge variant="secondary">{status || "Unknown"}</Badge>;
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

  if (!designer) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-lg text-muted-foreground">Designer not found</p>
                <Button variant="outline" onClick={() => router.push("/designers")} className="mt-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Designers
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const availableCredit = Number(designer.credit_limit ?? 0) - Number(designer.outstanding_balance ?? 0);

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => router.push("/designers")} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Designers
              </Button>
            </div>

            {/* Hero Card */}
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                    <Palette className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">{designer.name}</h1>
                      <Badge variant={designer.is_active ? "default" : "secondary"}>
                        {designer.is_active ? "Active" : "Inactive"}
                      </Badge>
                      {designer.is_osas_verified && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          OSAS Verified
                        </Badge>
                      )}
                      {designer.is_premium_designer && (
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                          <Star className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    {designer.business_name && (
                      <p className="text-lg text-gray-600 mb-1">{designer.business_name}</p>
                    )}
                    {designer.specialization && (
                      <div className="flex items-center gap-1.5 mb-4">
                        <Palette className="h-4 w-4 text-indigo-600" />
                        <span className="text-sm text-muted-foreground">{designer.specialization}</span>
                        {designer.years_of_experience && designer.years_of_experience > 0 && (
                          <span className="text-sm text-muted-foreground ml-2">
                            &middot; {designer.years_of_experience} years experience
                          </span>
                        )}
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-6 mt-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{designer.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span>{designer.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{[designer.city, designer.state].filter(Boolean).join(", ") || "N/A"}</span>
                      </div>
                    </div>
                    {designer.portfolio_url && (
                      <a
                        href={designer.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 transition-colors mt-3"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Portfolio
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <IndianRupee className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credit Limit</p>
                    <p className="text-2xl font-bold text-blue-600">₹{Number(designer.credit_limit ?? 0).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-red-50">
                    <IndianRupee className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Outstanding</p>
                    <p className="text-2xl font-bold text-red-600">₹{Number(designer.outstanding_balance ?? 0).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-50">
                    <Banknote className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-600">₹{Number(designer.total_revenue ?? 0).toLocaleString()}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 transition-all hover:shadow-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <FolderKanban className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Projects</p>
                    <p className="text-2xl font-bold">{designer.total_projects ?? 0}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabbed Content */}
            <Tabs defaultValue="projects" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-[800px]">
                <TabsTrigger value="projects">
                  <FolderKanban className="h-4 w-4 mr-2" />
                  Projects
                </TabsTrigger>
                <TabsTrigger value="commissions">
                  <Banknote className="h-4 w-4 mr-2" />
                  Commissions
                </TabsTrigger>
                <TabsTrigger value="retailers">
                  <Users className="h-4 w-4 mr-2" />
                  Linked Retailers
                </TabsTrigger>
                <TabsTrigger value="details">
                  <User className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>

              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Interior design projects managed by this designer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {projects.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <FolderKanban className="h-12 w-12 mb-4" />
                        <p className="font-medium">No projects yet</p>
                        <p className="text-sm">Projects will appear here once created</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Project</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projects.map((project) => (
                            <TableRow key={project.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{project.project_name || "Untitled"}</p>
                                  {project.location && (
                                    <p className="text-xs text-muted-foreground">{project.location}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{project.client_name || "-"}</TableCell>
                              <TableCell>{project.project_type || "-"}</TableCell>
                              <TableCell className="font-medium">
                                ₹{Number(project.project_value ?? project.estimated_budget ?? 0).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-green-600 font-medium">
                                ₹{Number(project.commission_amount ?? 0).toLocaleString()}
                              </TableCell>
                              <TableCell>
                                {project.overall_progress_percent != null ? (
                                  <div className="flex items-center gap-2">
                                    <Progress value={project.overall_progress_percent} className="w-16 h-2" />
                                    <span className="text-xs">{project.overall_progress_percent}%</span>
                                  </div>
                                ) : (
                                  "-"
                                )}
                              </TableCell>
                              <TableCell>{getStatusBadge(project.status)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Commissions Tab */}
              <TabsContent value="commissions" className="space-y-6 mt-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="p-5">
                    <p className="text-sm text-muted-foreground">Commission Rate</p>
                    <p className="text-2xl font-bold text-indigo-600">{Number(designer.commission_percentage ?? 0).toFixed(1)}%</p>
                  </Card>
                  <Card className="p-5">
                    <p className="text-sm text-muted-foreground">Total Earned</p>
                    <p className="text-2xl font-bold text-green-600">₹{Number(designer.total_commission_earned ?? 0).toLocaleString()}</p>
                  </Card>
                  <Card className="p-5">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-amber-600">₹{Number(designer.pending_commission ?? 0).toLocaleString()}</p>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Commission History</CardTitle>
                    <CardDescription>Commissions earned from orders and projects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {commissions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Banknote className="h-12 w-12 mb-4" />
                        <p className="font-medium">No commissions yet</p>
                        <p className="text-sm">Commission records will appear here</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Order Amount</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Total (incl. GST)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Paid At</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {commissions.map((c) => (
                            <TableRow key={c.id}>
                              <TableCell className="text-muted-foreground">
                                {c.order_date ? new Date(c.order_date).toLocaleDateString() : "-"}
                              </TableCell>
                              <TableCell>₹{Number(c.order_amount ?? 0).toLocaleString()}</TableCell>
                              <TableCell>{Number(c.commission_percent ?? 0).toFixed(1)}%</TableCell>
                              <TableCell className="font-medium text-green-600">
                                ₹{Number(c.commission_amount ?? 0).toLocaleString()}
                              </TableCell>
                              <TableCell>₹{Number(c.total_amount ?? 0).toLocaleString()}</TableCell>
                              <TableCell>{getStatusBadge(c.status)}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {c.paid_at ? new Date(c.paid_at).toLocaleDateString() : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Linked Retailers Tab */}
              <TabsContent value="retailers" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Linked Retailers</CardTitle>
                    <CardDescription>Retailers connected to this designer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {linkedRetailers.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Users className="h-12 w-12 mb-4" />
                        <p className="font-medium">No linked retailers</p>
                        <p className="text-sm">Retailer links will appear here</p>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Retailer</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>City</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Since</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {linkedRetailers.map((link) => (
                            <TableRow key={link.id}>
                              <TableCell className="font-medium">
                                {link.retailer?.name || "Unknown"}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {link.retailer?.email || "N/A"}
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {link.retailer?.mobile_number || "N/A"}
                              </TableCell>
                              <TableCell>{link.retailer?.city || "-"}</TableCell>
                              <TableCell>{Number(link.commission_percentage ?? 0).toFixed(1)}%</TableCell>
                              <TableCell>
                                <Badge variant={link.is_active ? "default" : "secondary"}>
                                  {link.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {link.created_at ? new Date(link.created_at).toLocaleDateString() : "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>Company details and registration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {designer.business_name && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Business Name</p>
                          <p className="font-medium">{designer.business_name}</p>
                        </div>
                      )}
                      {designer.designer_type && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Designer Type</p>
                          <p className="font-medium capitalize">{designer.designer_type}</p>
                        </div>
                      )}
                      {designer.gstin && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">GSTIN</p>
                          <p className="font-medium font-mono">{designer.gstin}</p>
                        </div>
                      )}
                      {designer.gst_number && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">GST Number</p>
                          <p className="font-medium font-mono">{designer.gst_number}</p>
                        </div>
                      )}
                      {designer.pan_number && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">PAN Number</p>
                          <p className="font-medium font-mono">{designer.pan_number}</p>
                        </div>
                      )}
                      {designer.specialization && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Specialization</p>
                          <p className="font-medium">{designer.specialization}</p>
                        </div>
                      )}
                      {designer.years_of_experience != null && designer.years_of_experience > 0 && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Experience</p>
                          <p className="font-medium">{designer.years_of_experience} years</p>
                        </div>
                      )}
                      {designer.services_offered && (designer.services_offered as string[]).length > 0 && (
                        <div className="space-y-1 col-span-2">
                          <p className="text-sm text-gray-500">Services Offered</p>
                          <div className="flex flex-wrap gap-2">
                            {(designer.services_offered as string[]).map((service, i) => (
                              <Badge key={i} variant="outline">{service}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {designer.min_budget || designer.max_budget ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Budget Range</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Minimum Budget</p>
                          <p className="font-medium">₹{Number(designer.min_budget ?? 0).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Maximum Budget</p>
                          <p className="font-medium">₹{Number(designer.max_budget ?? 0).toLocaleString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                <Card>
                  <CardHeader>
                    <CardTitle>Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {designer.address && <p>{designer.address}</p>}
                      <p>
                        {[designer.city, designer.state, designer.postal_code].filter(Boolean).join(", ")}
                      </p>
                      {designer.country && <p>{designer.country}</p>}
                      {!designer.address && !designer.city && (
                        <p className="text-muted-foreground">No address provided</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {(designer.average_rating != null && Number(designer.average_rating) > 0) || designer.trust_score != null ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Ratings & Scores</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {designer.average_rating != null && Number(designer.average_rating) > 0 && (
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Avg Rating</p>
                            <p className="text-xl font-bold">{Number(designer.average_rating).toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">{designer.review_count ?? 0} reviews</p>
                          </div>
                        )}
                        {designer.trust_score != null && Number(designer.trust_score) > 0 && (
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Trust Score</p>
                            <p className="text-xl font-bold">{Number(designer.trust_score).toFixed(1)}</p>
                          </div>
                        )}
                        {designer.client_rating != null && Number(designer.client_rating) > 0 && (
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Client Rating</p>
                            <p className="text-xl font-bold">{Number(designer.client_rating).toFixed(1)}</p>
                          </div>
                        )}
                        {designer.payment_discipline_score != null && Number(designer.payment_discipline_score) > 0 && (
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <p className="text-xs text-muted-foreground">Payment Score</p>
                            <p className="text-xl font-bold">{Number(designer.payment_discipline_score).toFixed(1)}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : null}

                {(designer.bank_name || designer.upi_id) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {designer.bank_name && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Bank</p>
                            <p className="font-medium">{designer.bank_name}</p>
                          </div>
                        )}
                        {designer.bank_account_name && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Account Name</p>
                            <p className="font-medium">{designer.bank_account_name}</p>
                          </div>
                        )}
                        {designer.bank_account_number && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">Account Number</p>
                            <p className="font-medium font-mono">{designer.bank_account_number}</p>
                          </div>
                        )}
                        {designer.bank_ifsc && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">IFSC Code</p>
                            <p className="font-medium font-mono">{designer.bank_ifsc}</p>
                          </div>
                        )}
                        {designer.upi_id && (
                          <div className="space-y-1">
                            <p className="text-sm text-gray-500">UPI ID</p>
                            <p className="font-medium">{designer.upi_id}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Account Created</p>
                        <p className="font-medium">{designer.created_at ? new Date(designer.created_at).toLocaleDateString() : "N/A"}</p>
                      </div>
                      {designer.updated_at && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium">{new Date(designer.updated_at).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Accepting Projects</p>
                        <Badge variant={designer.is_accepting_projects ? "default" : "secondary"}>
                          {designer.is_accepting_projects ? "Yes" : "No"}
                        </Badge>
                      </div>
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
