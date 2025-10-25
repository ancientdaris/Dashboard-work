"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus,
  Users,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  MoreVertical,
  Filter
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

// Sample retailer data
const retailers = [
  {
    id: 1,
    name: "Sharma General Store",
    contact: "Rajiv Sharma",
    gst: "GST-24AABCU9741H1ZS",
    phone: "+91 98765 43210",
    email: "rajesh@sharmastore.com",
    location: "Mumbai",
    state: "Maharashtra",
    creditUsed: "₹2,45,000.00",
    creditLimit: "₹5,00,000.00",
    terms: "30 days",
    orders: 127,
    totalValue: "₹24,50,000.00",
    performance: "excellent",
    status: "active"
  },
  {
    id: 2,
    name: "Patel Electronics",
    contact: "Amit Patel",
    gst: "GST-24AABCP9741H1Z2",
    phone: "+91 98123 45678",
    email: "amit@patelelectronics.com",
    location: "Ahmedabad",
    state: "Gujarat",
    creditUsed: "₹1,25,000.00",
    creditLimit: "₹7,50,000.00",
    terms: "45 days",
    orders: 89,
    totalValue: "₹18,80,000.00",
    performance: "good",
    status: "active"
  }
];

export default function RetailersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 space-y-6 p-8 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
          
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Retailers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your retailer network and relationships
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Retailer</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="transition-all p-4 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Retailers</p>
                <p className="text-2xl font-bold text-gray-900">247</p>
                <p className="text-xs text-green-600 font-medium">+12% from last month</p>
              </div>
              <div className="rounded-lg bg-gray-100/80 p-2.5">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="transition-all p-4 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active This Month</p>
                <p className="text-2xl font-bold text-gray-900">189</p>
                <p className="text-xs text-green-600 font-medium">+8% from last month</p>
              </div>
              <div className="rounded-lg bg-gray-100/80 p-2.5">
                <TrendingUp className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="transition-all p-4 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Credit Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">₹42,50,000.00</p>
                <p className="text-xs text-red-600 font-medium">-5% from last month</p>
              </div>
              <div className="rounded-lg bg-gray-100/80 p-2.5">
                <CreditCard className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>

          <Card className="transition-all p-4 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">₹19,500.00</p>
                <p className="text-xs text-green-600 font-medium">+15% from last month</p>
              </div>
              <div className="rounded-lg bg-gray-100/80 p-2.5">
                <ShoppingBag className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search retailers by name, phone, email, or location..." 
              className="pl-10 bg-white/50 border-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px] bg-white/50 border-muted">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select defaultValue="all-states">
            <SelectTrigger className="w-[150px] bg-white/50 border-muted">
              <SelectValue placeholder="All States" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all-states">All States</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="gujarat">Gujarat</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>

        {/* Retailers Table */}
        <Card className="transition-all hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retailer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Credit Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {retailers.map((retailer) => (
                  <tr key={retailer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{retailer.name}</p>
                        <p className="text-sm text-gray-600">{retailer.contact}</p>
                        <p className="text-xs text-gray-500">{retailer.gst}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{retailer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[200px]">{retailer.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-900">{retailer.location}</p>
                          <p className="text-xs text-gray-500">{retailer.state}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {retailer.creditUsed} / {retailer.creditLimit}
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ width: '49%' }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">Terms: {retailer.terms}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">{retailer.orders} orders</p>
                        <p className="text-xs text-gray-600">{retailer.totalValue} total</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            retailer.performance === 'excellent' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}
                        >
                          {retailer.performance}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="outline" 
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        {retailer.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Retailer</DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem>Adjust Credit</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing 1 to 2 of 2 results
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled className="bg-white">
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled className="bg-white">
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}
