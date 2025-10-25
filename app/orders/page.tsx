"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
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
  Search, 
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Receipt
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export default function OrdersPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 space-y-6 p-8 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Orders</h1>
            <p className="text-muted-foreground mt-1">
              Manage your B2B orders and track deliveries
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="p-4 space-y-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Orders</span>
          </div>
          <div className="text-2xl font-bold">0</div>
        </Card>

        <Card className="p-4 space-y-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Pending</span>
          </div>
          <div className="text-2xl font-bold">0</div>
        </Card>

        <Card className="p-4 space-y-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Completed</span>
          </div>
          <div className="text-2xl font-bold">0</div>
        </Card>

        <Card className="p-4 space-y-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Cancelled</span>
          </div>
          <div className="text-2xl font-bold">0</div>
        </Card>

        <Card className="p-4 space-y-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold">₹0.00</div>
        </Card>

        <Card className="p-4 space-y-2 transition-all hover:shadow-md">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Avg Order Value</span>
          </div>
          <div className="text-2xl font-bold">₹0.00</div>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search orders..." className="pl-10 bg-white/50 border-muted" />
        </div>
        <Select>
          <SelectTrigger className="w-[180px] bg-white/50 border-muted">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <Card className="transition-all hover:shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Retailer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Terms</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Add order rows here when you have data */}
          </TableBody>
        </Table>
      </Card>
      </div>
    </div>
  );
}