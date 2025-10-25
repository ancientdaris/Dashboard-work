"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Plus,
  Filter,
  Download,
  FileText
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* Main Content */}
          <div className="p-8 space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Invoices</h1>
                <p className="text-muted-foreground mt-1">
                  Manage invoices, payments, and GST compliance
                </p>
              </div>
              <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Invoice</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search invoices..." 
                className="pl-10 bg-white/50 border-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <p className="text-sm text-gray-500">0 invoices</p>
          </div>

          {/* Invoices Table */}
          <Card className="transition-all hover:shadow-md">
            {/* Table Header */}
            <div className="border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 px-6 py-4">
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </p>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No invoices found</h3>
              <p className="text-sm text-gray-500 mb-6">
                Get started by creating your first invoice.
              </p>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Invoice</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
