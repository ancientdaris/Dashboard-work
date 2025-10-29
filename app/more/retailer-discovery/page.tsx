"use client";

import { useState, useEffect } from "react";
import { MapPin, Search, UserPlus, CheckCircle2, Clock, TrendingUp, Phone, Mail, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface RetailerProfile {
  id: string;
  retailer_id: string;
  business_name: string;
  business_category: string[];
  annual_turnover_range: string;
  employee_count: number;
  latitude: number;
  longitude: number;
  distance: number;
  is_verified: boolean;
  credit_score: number;
  phone: string;
  email: string;
  accepts_credit: boolean;
}

interface ConnectionRequest {
  id: string;
  status: string;
  created_at: string;
  retailer_id: string;
}

export default function RetailerDiscoveryPage() {
  const [searchRadius, setSearchRadius] = useState("50");
  const [searchCategory, setSearchCategory] = useState("");
  const [retailers, setRetailers] = useState<RetailerProfile[]>([]);
  const [myRequests, setMyRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    nearby: 0
  });
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchRetailers();
    fetchMyRequests();
  }, []);

  const fetchRetailers = async () => {
    try {
      setRefreshing(true);

      // Fetch retailer business profiles
      const { data, error } = await supabase
        .from("retailer_business_profiles")
        .select(`
          *,
          retailers (
            id,
            business_name,
            phone,
            email
          )
        `)
        .eq("visibility_status", "public")
        .limit(50);

      if (error) throw error;

      // Mock distance calculation (in production, use actual geolocation)
      const retailersWithDistance = (data || []).map((profile: any) => ({
        id: profile.id,
        retailer_id: profile.retailers.id,
        business_name: profile.retailers.business_name,
        business_category: profile.business_category || [],
        annual_turnover_range: profile.annual_turnover_range || "Not specified",
        employee_count: profile.employee_count || 0,
        latitude: profile.latitude || 0,
        longitude: profile.longitude || 0,
        distance: Math.random() * 100, // Mock distance in km
        is_verified: profile.is_verified,
        credit_score: Math.random() * 100, // Mock credit score
        phone: profile.retailers.phone,
        email: profile.retailers.email,
        accepts_credit: profile.accepts_credit
      }));

      setRetailers(retailersWithDistance.sort((a, b) => a.distance - b.distance));

      // Calculate stats
      setStats({
        total: retailersWithDistance.length,
        verified: retailersWithDistance.filter((r: RetailerProfile) => r.is_verified).length,
        nearby: retailersWithDistance.filter((r: RetailerProfile) => r.distance < 25).length
      });
    } catch (error: any) {
      console.error("Error fetching retailers:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("discovery_connection_requests")
        .select("id, status, created_at, retailer_id")
        .eq("wholesaler_id", user?.id);

      if (error) throw error;

      setMyRequests(data || []);
    } catch (error: any) {
      console.error("Error fetching requests:", error);
    }
  };

  const sendConnectionRequest = async (retailer: RetailerProfile) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Check if already connected
      const existingRequest = myRequests.find(
        req => req.retailer_id === retailer.retailer_id
      );

      if (existingRequest) {
        toast({
          title: "Already Sent",
          description: "You have already sent a connection request to this retailer.",
        });
        return;
      }

      const { error } = await supabase
        .from("discovery_connection_requests")
        .insert({
          wholesaler_id: user?.id,
          retailer_id: retailer.retailer_id,
          status: "pending",
          message: `Hello ${retailer.business_name}, I would like to connect with you for business partnership.`,
          proposed_credit_limit: 50000,
          proposed_payment_terms: "Net 30"
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Connection request sent successfully!",
      });
      fetchMyRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRetailers = retailers.filter(r => {
    const withinRadius = r.distance <= parseFloat(searchRadius || "999");
    const matchesCategory = !searchCategory ||
      r.business_category.some(cat =>
        cat.toLowerCase().includes(searchCategory.toLowerCase())
      );
    return withinRadius && matchesCategory;
  });

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Card with Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-6 w-6" />
                      <CardTitle className="text-2xl">Retailer Discovery</CardTitle>
                    </div>
                    <CardDescription>
                      Find and connect with verified retailers in your region
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchRetailers}
                    disabled={refreshing}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.verified}</div>
                    <div className="text-xs text-muted-foreground">Verified</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">{stats.nearby}</div>
                    <div className="text-xs text-muted-foreground">Nearby</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Search Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="radius">Search Radius (km)</Label>
                  <Input
                    id="radius"
                    type="number"
                    placeholder="Enter radius"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    placeholder="Search by category..."
                    value={searchCategory}
                    onChange={(e) => setSearchCategory(e.target.value)}
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={fetchRetailers}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Found Retailers ({filteredRetailers.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredRetailers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No retailers found. Try adjusting your search filters.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredRetailers.map((retailer) => {
                      const hasRequest = myRequests.some(
                        req => req.retailer_id === retailer.retailer_id
                      );
                      const requestStatus = myRequests.find(
                        req => req.retailer_id === retailer.retailer_id
                      )?.status;

                      return (
                        <Card key={retailer.id}>
                          <CardContent className="pt-6">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold">
                                    {retailer.business_name}
                                  </h3>
                                  {retailer.is_verified && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                                      <span className="text-xs text-green-700">Verified Business</span>
                                    </div>
                                  )}
                                </div>
                                <Badge variant={retailer.distance < 25 ? "default" : "outline"}>
                                  {retailer.distance.toFixed(1)} km
                                </Badge>
                              </div>

                              <Separator />

                              <div className="space-y-2 text-sm text-muted-foreground">
                                {retailer.business_category.length > 0 && (
                                  <p>
                                    Categories: {retailer.business_category.join(", ")}
                                  </p>
                                )}
                                <p>Turnover: {retailer.annual_turnover_range}</p>
                                <p>Employees: {retailer.employee_count}</p>
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4" />
                                  <span>
                                    Credit Score: {retailer.credit_score.toFixed(0)}/100
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {retailer.phone && (
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Phone className="mr-2 h-3 w-3" />
                                    Call
                                  </Button>
                                )}
                                {retailer.email && (
                                  <Button variant="outline" size="sm" className="flex-1">
                                    <Mail className="mr-2 h-3 w-3" />
                                    Email
                                  </Button>
                                )}
                              </div>

                              {!hasRequest ? (
                                <Button
                                  className="w-full"
                                  onClick={() => sendConnectionRequest(retailer)}
                                  disabled={loading}
                                >
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Send Connection Request
                                </Button>
                              ) : (
                                <Card className="bg-muted">
                                  <CardContent className="py-2">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4" />
                                      <span className="text-sm capitalize">
                                        Request {requestStatus}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-sm font-semibold mb-3">How Discovery Works</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Search for retailers based on location and business type</li>
                  <li>• View verified business profiles and credit scores</li>
                  <li>• Send connection requests with proposed terms</li>
                  <li>• Start trading once the retailer accepts your request</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
