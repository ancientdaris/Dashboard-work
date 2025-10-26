"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase";
import { Warehouse, Plus, Search, MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface WarehouseData {
  id: string;
  name: string;
  location: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  owner_id: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export default function WarehousesPage() {
  const supabase = createClient();
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("warehouses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setWarehouses(data || []);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const query = searchQuery.toLowerCase();
    return (
      warehouse.name.toLowerCase().includes(query) ||
      warehouse.location?.toLowerCase().includes(query) ||
      warehouse.city?.toLowerCase().includes(query) ||
      warehouse.state?.toLowerCase().includes(query)
    );
  });

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
                  Warehouses
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your warehouse locations and inventory centers
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Warehouse
              </Button>
            </div>

            {/* Stats */}
            {!loading && warehouses.length > 0 && (
              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Warehouses
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {warehouses.length}
                        </p>
                      </div>
                      <div className="rounded-lg bg-blue-100 p-3">
                        <Warehouse className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Active Warehouses
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {warehouses.filter((w) => w.is_active).length}
                        </p>
                      </div>
                      <div className="rounded-lg bg-green-100 p-3">
                        <Building2 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Inactive Warehouses
                        </p>
                        <p className="text-2xl font-bold mt-1">
                          {warehouses.filter((w) => !w.is_active).length}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-100 p-3">
                        <Building2 className="h-6 w-6 text-gray-600" />
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
                  placeholder="Search warehouses..."
                  className="pl-10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Warehouses Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading warehouses...</div>
              </div>
            ) : filteredWarehouses.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <Warehouse className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No warehouses found</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {searchQuery
                      ? "Try adjusting your search criteria"
                      : "Get started by adding your first warehouse"}
                  </p>
                  {!searchQuery && (
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Warehouse
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredWarehouses.map((warehouse) => (
                  <Card
                    key={warehouse.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-blue-100 p-2">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {warehouse.name}
                            </h3>
                            {warehouse.location && (
                              <p className="text-sm text-muted-foreground">
                                {warehouse.location}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={warehouse.is_active ? "default" : "secondary"}
                        >
                          {warehouse.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {warehouse.address && (
                          <div className="flex items-start gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="text-muted-foreground">
                              <p>{warehouse.address}</p>
                              {(warehouse.city || warehouse.state || warehouse.postal_code) && (
                                <p>
                                  {[warehouse.city, warehouse.state, warehouse.postal_code]
                                    .filter(Boolean)
                                    .join(", ")}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                        {!warehouse.address && (
                          <p className="text-sm text-muted-foreground italic">
                            No address specified
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
