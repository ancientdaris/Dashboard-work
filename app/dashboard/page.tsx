"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import Link from "next/link";
import {
  CreditCard,
  Search,
  ShoppingCart,
  Users,
  AlertCircle,
  Plus,
  FileBarChart,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="container mx-auto p-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Welcome back to Phatkure Wholesale Distributors
            </h1>
            <p className="text-muted-foreground">
              Here&apos;s what&apos;s happening with your wholesale business today
            </p>
          </div>

          {/* Search and Date Filter */}
          <div className="mb-8 flex items-center gap-4">
            <div className="relative flex-1  min-w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search orders, products..."
                className="pl-10 bg-white/50 border-muted"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Revenue",
                value: "₹0.00",
                change: "0%",
                icon: CreditCard,
                changeType: "down",
                description: "All-time revenue",
              },
              {
                label: "Total Orders",
                value: "0",
                change: "0%",
                icon: ShoppingCart,
                changeType: "up",
                description: "Lifetime orders",
              },
              {
                label: "Active Retailers",
                value: "0",
                change: "0",
                icon: Users,
                changeType: "up",
                description: "Connected retailers",
              },
              {
                label: "Low Stock Items",
                value: "0",
                change: "0",
                icon: AlertCircle,
                changeType: "down",
                description: "Items below threshold",
              },
            ].map((stat) => (
              <Card 
                key={stat.label} 
                className="transition-all hover:shadow-md"
              >
                <CardHeader className="flex flex-row items-center justify-between ">
                  <CardContent className="p-0">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <div className="flex items-baseline gap-2">
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                      <span className={`text-sm font-medium ${
                        stat.changeType === "up" ? "text-green-600" : "text-red-600"
                      }`}>
                        {stat.changeType === "up" ? "↑" : "↓"} {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  </CardContent>
                  <div className="rounded-lg bg-gray-100/80 p-2.5">
                    <stat.icon className="h-5 w-5 text-gray-600" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Recent Orders & Low Stock */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                  <p className="text-sm text-muted-foreground">Latest transactions from retailers</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/orders">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="rounded-full bg-gray-100/80 p-3 mb-4">
                    <ShoppingCart className="h-6 w-6" />
                  </div>
                  <p className="font-medium mb-1">No orders yet</p>
                  <p className="text-sm">Orders from retailers will appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold">Low Stock Alert</h2>
                  <p className="text-sm text-muted-foreground">Items requiring attention</p>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/inventory">View inventory</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <div className="rounded-full bg-gray-100/80 p-3 mb-4">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <p className="font-medium mb-1">No inventory alerts</p>
                  <p className="text-sm">Low stock items will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold">Quick Actions</h2>
              <p className="text-sm text-muted-foreground">Common tasks and operations</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {[
                  { icon: Plus, label: "Add Product", href: "/products/add", description: "List new items" },
                  { icon: ShoppingCart, label: "View Orders", href: "/orders", description: "Manage transactions" },
                  { icon: Users, label: "Manage Retailers", href: "/retailers", description: "View partnerships" },
                  { icon: FileBarChart, label: "View Reports", href: "/reports", description: "Analytics & insights" },
                ].map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="flex h-auto flex-col items-center gap-3 p-6 hover:border-blue-600/50 hover:bg-blue-50/50 transition-all group"
                    asChild
                  >
                    <Link href={action.href}>
                      <div className="rounded-lg bg-gray-100/80 p-3 group-hover:bg-blue-100/80 transition-colors">
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1 text-center">
                        <h3 className="font-medium">{action.label}</h3>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}