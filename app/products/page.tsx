"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import {
  Search,
  Package,
  Plus,
  Import,
  Download,
  Grid2X2,
  List,
  Filter,
} from "lucide-react";

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-semibold text-gray-900">Product Catalog</h1>
                <p className="text-muted-foreground">
                  Manage your product inventory and pricing
                </p>
              </div>
              <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Import className="h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export All
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, or description..."
                className="pl-10 w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-1 rounded-md border bg-white p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid2X2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Total Products", value: "0" },
              { label: "Filtered Results", value: "0" },
              { label: "In Stock", value: "0", color: "text-green-600" },
              { label: "Out of Stock", value: "0", color: "text-red-600" },
            ].map((stat) => (
              <Card key={stat.label} className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color || ""}`}>
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Package className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="font-semibold mb-1">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Start building your catalog by adding your first product
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </Card>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  );
}