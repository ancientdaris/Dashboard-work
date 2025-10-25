"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ChevronLeft,
  Box,
  Truck,
  Store,
  FileText,
  CreditCard,
  BarChart2,
  User,
  LogOut
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/products",
    icon: Box,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    title: "Deliveries",
    href: "/deliveries",
    icon: Truck,
  },
  {
    title: "Retailers",
    href: "/retailers",
    icon: Store,
  },
  {
    title: "Invoices",
    href: "/invoices",
    icon: FileText,
  },
  {
    title: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart2,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex h-screen flex-col border-r bg-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-55"
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4 justify-between overflow-hidden">
        <Link href="/" className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-900 flex-shrink-0">
            <Package className="h-4 w-4 text-white" />
          </div>
          <span className={cn(
            "text-base font-bold whitespace-nowrap transition-all duration-300 ease-in-out",
            isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          )}>
            OSAS
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2 overflow-hidden">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-0 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all duration-200 ease-in-out",
                isActive
                  ? "bg-slate-900 text-white gap-3"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 gap-3 ",
                isCollapsed && "justify-center gap-0"
              )}
              title={isCollapsed ? item.title : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0 "  />
              <span className={cn(
                "whitespace-nowrap transition-all duration-300 ease-in-out gap-0 ",
                isCollapsed ? "opacity-0 w-0 overflow-hidden  " : "opacity-100 w-auto"
              )}>
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className={cn(
        "border-t transition-all duration-300 ease-in-out",
        isCollapsed ? "p-2" : "p-4 space-y-4"
      )}>
        {!isCollapsed && (
          <>
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>OR</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <h3 className="truncate font-medium text-sm">Olivia Rhye</h3>
                    <p className="truncate text-xs text-gray-500">olivia@untitledui.com</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator />
          </>
        )}

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "w-full flex items-center gap-0 transition-all duration-200",
            isCollapsed && "justify-center px-0"
          )}
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform duration-300 ease-in-out",
            isCollapsed && "rotate-180"
          )} />
          <span className={cn(
            "text-xs whitespace-nowrap transition-all duration-300 ease-in-out",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          )}>
            Collapse
          </span>
        </Button>
      </div>
    </div>
  );
}
