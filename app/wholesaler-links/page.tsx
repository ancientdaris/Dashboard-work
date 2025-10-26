"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase";
import { Link2, Plus, Search, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WholesalerRetailerLink {
  id: string;
  wholesaler_id: string | null;
  retailer_id: string | null;
  region: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
  wholesaler?: {
    full_name: string;
    email: string;
  };
  retailer?: {
    full_name: string;
    email: string;
  };
}

export default function WholesalerLinksPage() {
  const supabase = createClient();
  const [links, setLinks] = useState<WholesalerRetailerLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wholesaler_retailer_links")
        .select(`
          *,
          wholesaler:profiles!wholesaler_retailer_links_wholesaler_id_fkey (
            full_name,
            email
          ),
          retailer:profiles!wholesaler_retailer_links_retailer_id_fkey (
            full_name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLinks = links.filter((link) => {
    const query = searchQuery.toLowerCase();
    return (
      link.wholesaler?.full_name?.toLowerCase().includes(query) ||
      link.retailer?.full_name?.toLowerCase().includes(query) ||
      link.region?.toLowerCase().includes(query) ||
      link.wholesaler?.email?.toLowerCase().includes(query) ||
      link.retailer?.email?.toLowerCase().includes(query)
    );
  });

  const totalLinks = links.length;
  const activeLinks = links.filter((l) => l.is_active).length;
  const uniqueRegions = new Set(links.filter((l) => l.region).map((l) => l.region)).size;

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container p-4 md:p-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                  Wholesaler-Retailer Links
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage relationships between wholesalers and retailers
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Link
              </Button>
            </div>

            {/* Stats */}
            {!loading && links.length > 0 && (
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Links
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {totalLinks}
                        </p>
                      </div>
                      <div className="rounded-lg bg-blue-100 p-3">
                        <Link2 className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Active Links
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {activeLinks}
                        </p>
                      </div>
                      <div className="rounded-lg bg-green-100 p-3">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Regions
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {uniqueRegions}
                        </p>
                      </div>
                      <div className="rounded-lg bg-purple-100 p-3">
                        <MapPin className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by wholesaler, retailer, or region..."
                  className="pl-10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Links Table */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading links...</div>
              </div>
            ) : filteredLinks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <Link2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No links found</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : "Get started by creating wholesaler-retailer connections"}
                  </p>
                  {!searchQuery && (
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Link
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Wholesaler
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Retailer
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Region
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredLinks.map((link) => (
                          <tr key={link.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {link.wholesaler?.full_name || "Unknown"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {link.wholesaler?.email || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {link.retailer?.full_name || "Unknown"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {link.retailer?.email || "N/A"}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {link.region ? (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-sm text-gray-900">{link.region}</span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <Badge variant={link.is_active ? "default" : "secondary"}>
                                {link.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-gray-900">
                                {link.created_at
                                  ? new Date(link.created_at).toLocaleDateString()
                                  : "N/A"}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
