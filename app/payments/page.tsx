"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Plus,
  Download,
  CreditCard
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Main Content */}
        <div className="p-8 space-y-6">
          {/* Page Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Payments</h1>
              <p className="text-muted-foreground mt-1">
                Manage your payments and track financial transactions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Record Payment</span>
              </Button>
            </div>
          </div>

          {/* Filters Section */}
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Search..." 
                className="pl-10 bg-white/50 border-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select defaultValue="all-statuses">
              <SelectTrigger className="w-[180px] bg-white/50 border-muted">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-statuses">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select defaultValue="all-methods">
              <SelectTrigger className="w-[180px] bg-white/50 border-muted">
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-methods">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select defaultValue="all-time">
              <SelectTrigger className="w-[180px] bg-white/50 border-muted">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all-time">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Recent Payments Section */}
          <Card className="transition-all hover:shadow-md">
            {/* Section Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>
              <p className="text-sm text-gray-500">0 of 0 payments</p>
            </div>

            {/* Table Header */}
            <div className="border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 px-6 py-3">
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
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
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
              <p className="text-sm text-gray-500 mb-6">
                Record your first payment to get started.
              </p>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Record Payment</span>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
