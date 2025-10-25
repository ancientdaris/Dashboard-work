"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ProductsTable } from "@/components/products/products-table";
import { Plus, Import, Download, Search, X } from "lucide-react";
import Link from "next/link";

export default function ProductsPage() {
  // Sample stats - replace with real data from your API
  const stats = [
    { label: 'Total Products', value: '0', color: 'text-blue-600' },
    { label: 'Out of Stock', value: '0', color: 'text-red-600' },
    { label: 'Low Stock', value: '0', color: 'text-yellow-600' },
  ];

  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                <p className="text-muted-foreground">
                  Manage your product catalog and inventory
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    className="pl-9 pr-8 w-[200px] sm:w-[250px] md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Clear search</span>
                    </Button>
                  )}
                </div>
                
                <Button variant="outline" size="sm" className="h-9">
                  <Import className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Import</span>
                </Button>
                
                <Button variant="outline" size="sm" className="h-9">
                  <Download className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
                
                <Button asChild size="sm" className="h-9">
                  <Link href="/products/add">
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Add Product</span>
                  </Link>
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 mb-6 md:grid-cols-3">
              {stats.map((stat) => (
                <Card key={stat.label} className="p-4">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>
                    {stat.value}
                  </p>
                </Card>
              ))}
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg border shadow-sm">
              <ProductsTable searchTerm={searchQuery} />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}