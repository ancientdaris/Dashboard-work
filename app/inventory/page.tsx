"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileDown, 
  Plus, 
  Search, 
  Package, 
  BadgeDollarSign, 
  AlertTriangle,
  Building2 
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function InventoryPage() {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 space-y-6 p-8 overflow-auto bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Inventory Management</h1>
              <p className="text-muted-foreground mt-1">
                Track and manage your stock levels across all warehouses
              </p>
            </div>
            <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              Export Report
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adjust Stock
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4 space-y-2 transition-all hover:shadow-md">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Products</span>
            </div>
            <div className="text-2xl font-bold">1,247</div>
          </Card>

          <Card className="p-4 space-y-2 transition-all hover:shadow-md">
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Inventory Value</span>
            </div>
            <div className="text-2xl font-bold">₹28,47,500</div>
          </Card>

          <Card className="p-4 space-y-2 transition-all hover:shadow-md">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Low Stock Items</span>
            </div>
            <div className="text-2xl font-bold">23</div>
          </Card>

          <Card className="p-4 space-y-2 transition-all hover:shadow-md">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Warehouses</span>
            </div>
            <div className="text-2xl font-bold">3</div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products, SKU, or warehouse..."
              className="pl-10 bg-white/50 border-muted"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px] bg-white/50 border-muted">
              <SelectValue placeholder="All Warehouses" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Warehouses</SelectItem>
                <SelectItem value="delhi">Delhi Warehouse</SelectItem>
                <SelectItem value="mumbai">Mumbai Warehouse</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px] bg-white/50 border-muted">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline">Bulk Actions</Button>
        </div>

        {/* Inventory Table */}
        <Card className="transition-all hover:shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </TableHead>
                <TableHead>Product Details</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Reorder Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>Assam Premium Tea</span>
                    <span className="text-sm text-muted-foreground">Uncategorized</span>
                  </div>
                </TableCell>
                <TableCell>TEA-ASM-001</TableCell>
                <TableCell>Main Warehouse - Delhi</TableCell>
                <TableCell>150 kg</TableCell>
                <TableCell className="text-green-600">120</TableCell>
                <TableCell className="text-orange-600">30</TableCell>
                <TableCell>50</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                    Normal
                  </span>
                </TableCell>
                <TableCell>₹42,000</TableCell>
                <TableCell>20 Jan 2024, 04:00 pm</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    Adjust
                  </Button>
                </TableCell>
              </TableRow>
              {/* Add more rows as needed */}
            </TableBody>
          </Table>
        </Card>

        {/* Recent Stock Movements */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Stock Movements</h2>
            <p className="text-sm text-muted-foreground">
              Track all inventory movements and adjustments
            </p>
          </div>
          <Card className="transition-all hover:shadow-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Cost Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>Assam Premium Tea</span>
                      <span className="text-sm text-muted-foreground">TEA-ASM-001</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      STOCK IN
                    </span>
                  </TableCell>
                  <TableCell className="text-green-600">+100</TableCell>
                  <TableCell>PO-2024-001</TableCell>
                  <TableCell>Main Warehouse - Delhi</TableCell>
                  <TableCell>20 Jan 2024, 04:00 pm</TableCell>
                  <TableCell>₹28,000</TableCell>
                </TableRow>
                {/* Add more rows as needed */}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  </ProtectedRoute>
  );
}