"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  User, FileText, CreditCard, Truck, Store, ChevronRight,
  Wallet, Warehouse, Users, ClipboardCheck, BarChart3,
  FileCheck, Bell, Settings, Package, EyeOff,
  Upload, Maximize2, Camera, MapPin, TrendingDown,
  DollarSign, Gift, AlertCircle, UserPlus, Building2, Palette
} from "lucide-react";

interface MenuItem {
  title: string;
  icon: any;
  href: string;
  description: string;
  category: string;
  color: string;
}

export default function MorePage() {
  const router = useRouter();
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    // Account
    { title: 'Profile', icon: User, href: '/settings?tab=profile', description: 'Manage your profile', category: 'account', color: '#6366f1' },

    // Financial Modules
    { title: 'Invoices', icon: FileText, href: '/invoices', description: 'Manage invoices', category: 'finance', color: '#10b981' },
    { title: 'Payments', icon: CreditCard, href: '/payments', description: 'Track payments', category: 'finance', color: '#10b981' },
    { title: 'Credit Management', icon: Wallet, href: '/more/credit-management', description: 'Loans & EMI tracking', category: 'finance', color: '#10b981' },
    { title: 'Payment Recovery', icon: AlertCircle, href: '/more/payment-recovery', description: 'Smart recovery system', category: 'finance', color: '#10b981' },
    { title: 'Incognito Mode', icon: EyeOff, href: '/more/incognito-mode', description: 'Anonymous cash sales', category: 'finance', color: '#10b981' },

    // Operations Modules
    { title: 'Retailers', icon: Store, href: '/retailers', description: 'Retailer management', category: 'operations', color: '#f59e0b' },
    { title: 'Customers', icon: UserPlus, href: '/more/customers', description: 'Customer management', category: 'operations', color: '#f59e0b' },
    { title: 'Wholesalers', icon: Building2, href: '/wholesalers', description: 'Wholesaler management', category: 'operations', color: '#f59e0b' },
    { title: 'Interior Designers', icon: Palette, href: '/more/interior-designers', description: 'Designer partnerships', category: 'operations', color: '#f59e0b' },
    { title: 'Retailer Discovery', icon: MapPin, href: '/more/retailer-discovery', description: 'Find new retailers', category: 'operations', color: '#f59e0b' },
    { title: 'Deliveries', icon: Truck, href: '/deliveries', description: 'Delivery tracking', category: 'operations', color: '#f59e0b' },
    { title: 'Warehouses', icon: Warehouse, href: '/warehouses', description: 'Multi-warehouse management', category: 'operations', color: '#f59e0b' },
    { title: 'Bulk Upload', icon: Upload, href: '/more/bulk-upload', description: 'Upload CSV/Excel', category: 'operations', color: '#f59e0b' },

    // Inventory & Products
    { title: 'Barcode Generator', icon: Maximize2, href: '/more/barcode-generator', description: 'Generate barcodes', category: 'inventory', color: '#ec4899' },
    { title: 'Photo Search', icon: Camera, href: '/more/photo-search', description: 'Search by image', category: 'inventory', color: '#ec4899' },
    { title: 'Dead Stock Sale', icon: TrendingDown, href: '/more/dead-stock-sale', description: 'Clearance sales', category: 'inventory', color: '#ec4899' },
    { title: 'Price Comparison', icon: DollarSign, href: '/more/price-comparison', description: 'Compare prices', category: 'inventory', color: '#ec4899' },

    // Staff Management
    { title: 'Staff', icon: Users, href: '/staff', description: 'Employee management', category: 'hr', color: '#8b5cf6' },
    { title: 'Attendance', icon: ClipboardCheck, href: '/more/attendance', description: 'Attendance & leaves', category: 'hr', color: '#8b5cf6' },
    { title: 'Salary Management', icon: DollarSign, href: '/more/salary-management', description: 'Payroll & incentives', category: 'hr', color: '#8b5cf6' },

    // Marketing
    { title: 'Referral Program', icon: Gift, href: '/more/referral-program', description: 'Refer & earn rewards', category: 'marketing', color: '#ec4899' },

    // Analytics & Insights
    { title: 'Analytics', icon: BarChart3, href: '/more/analytics', description: 'Business insights', category: 'analytics', color: '#3b82f6' },

    // Compliance
    { title: 'Compliance', icon: FileCheck, href: '/more/compliance', description: 'GST & tax management', category: 'compliance', color: '#ef4444' },

    // System
    { title: 'Notifications', icon: Bell, href: '/more/notifications', description: 'Alerts & reminders', category: 'system', color: '#64748b' },
    { title: 'Admin Panel', icon: Settings, href: '/more/admin-panel', description: 'System settings', category: 'system', color: '#64748b' },
  ];

  const categories = [
    { key: 'account', title: 'Account', color: '#6366f1' },
    { key: 'finance', title: 'Finance', color: '#10b981' },
    { key: 'operations', title: 'Operations', color: '#f59e0b' },
    { key: 'inventory', title: 'Inventory & Products', color: '#ec4899' },
    { key: 'hr', title: 'Human Resources', color: '#8b5cf6' },
    { key: 'marketing', title: 'Marketing', color: '#ec4899' },
    { key: 'analytics', title: 'Analytics & Insights', color: '#3b82f6' },
    { key: 'compliance', title: 'Compliance', color: '#ef4444' },
    { key: 'system', title: 'System', color: '#64748b' },
  ];

  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">More</h1>
              <p className="text-muted-foreground mt-1">
                Access additional features and modules
              </p>
            </div>


            {/* Menu Items - Grouped by Category */}
            <div className="space-y-8">
              {categories.map((category) => {
                const items = getItemsByCategory(category.key);
                if (items.length === 0) return null;

                return (
                  <div key={category.key} className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">{category.title}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <Card
                            key={item.href}
                            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-none bg-white group"
                            onClick={() => router.push(item.href)}
                          >
                            <CardContent className="p-5">
                              <div className="flex items-start gap-4">
                                <div 
                                  className="p-3 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform"
                                  style={{ backgroundColor: `${item.color}15` }}
                                >
                                  <IconComponent 
                                    className="h-6 w-6" 
                                    style={{ color: item.color }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-base text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                    {item.title}
                                  </h3>
                                  <p className="text-sm text-gray-500 line-clamp-2">
                                    {item.description}
                                  </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
