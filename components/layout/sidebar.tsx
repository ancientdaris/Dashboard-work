"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/supabase";
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
  ChevronRight,
  Box,
  Truck,
  Store,
  FileText,
  CreditCard,
  BarChart2,
  User,
  LogOut,
  Settings,
  Warehouse,
  DollarSign,
  Link2,
  Users
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
    subItems: [
      {
        title: "Add Product",
        href: "/products/add",
      }
    ]
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: Package,
  },
  {
    title: "Warehouses",
    href: "/warehouses",
    icon: Warehouse,
    subItems: [
      {
        title: "Wholesaler Links",
        href: "/wholesaler-links",
      }
    ]
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
    title: "Pricing",
    href: "/pricing",
    icon: DollarSign,
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
    title: "Staff",
    href: "/staff",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart2,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, signOut } = useAuth();
  const [profileName, setProfileName] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    if (user) {
      fetchProfileName();
    }
  }, [user]);

  const fetchProfileName = async () => {
    try {
      if (!user) return;
      
      const { data } = await (supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .single() as any) as { data: { full_name: string | null } | null };

      if (data?.full_name) {
        setProfileName(data.full_name);
      }
    } catch (err) {
      console.error('Error fetching profile name:', err);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const displayName = profileName || user?.user_metadata?.full_name;
    if (!displayName) return user?.email?.substring(0, 2).toUpperCase() || "U";
    const names = displayName.split(" ");
    return names.length > 1 
      ? `${names[0][0]}${names[1][0]}`.toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
  };

  const getUserName = () => {
    const name = profileName || user?.user_metadata?.full_name || user?.email || "User";
    // Capitalize first letter of each word
    return name.split(' ').map((word: string) => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getUserEmail = () => {
    return user?.email || "";
  };

  return (
    <div className={cn(
      "flex h-screen flex-col border-r bg-white transition-all duration-300 ease-in-out",
      isCollapsed ? "w-16" : "w-full lg:w-55"
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
          const isActive = pathname === item.href || item.subItems?.some(subItem => pathname === subItem.href);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          
          return (
            <div 
              key={item.href} 
              className="relative group"
              onMouseEnter={() => hasSubItems && !isCollapsed && setOpenDropdown(item.title)}
              onMouseLeave={() => hasSubItems && !isCollapsed && setOpenDropdown(null)}
            >
              <div className="relative">
                <Link 
                  href={item.href} 
                  className={cn(
                    "flex items-center w-full h-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isCollapsed ? "justify-center px-2" : "",
                    isActive 
                      ? "bg-gray-900 text-white hover:bg-gray-800" 
                      : "hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex items-center justify-between w-full ml-2">
                      <span>{item.title}</span>
                      {hasSubItems && (
                        <ChevronRight className={cn(
                          "h-4 w-4 transition-transform duration-200 flex-shrink-0 ml-2",
                          openDropdown === item.title ? "rotate-90" : ""
                        )} />
                      )}
                    </div>
                  )}
                </Link>
                {hasSubItems && (
                  <div 
                    className={cn(
                      "overflow-hidden transition-all duration-200 ease-in-out group-hover:max-h-40 group-hover:opacity-100 hover:bg-transparent",
                      openDropdown === item.title ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                    )}
                    onMouseEnter={() => setOpenDropdown(item.title)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <div className="py-1 pl-2 space-y-1">
                      {item.subItems?.map((subItem) => {
                        const isSubItemActive = pathname === subItem.href;
                        return (
                          <Link 
                            key={subItem.href} 
                            href={subItem.href}
                            className={cn(
                              "block w-full px-3 py-2 text-sm rounded-md transition-colors",
                              isSubItemActive 
                                ? "bg-gray-900 text-white font-medium hover:bg-gray-800" 
                                : "hover:bg-gray-100 active:bg-gray-200"
                            )}
                            onClick={(e) => {
                              // Close the dropdown when a subitem is clicked on mobile
                              if (window.innerWidth < 768) {
                                setOpenDropdown(null);
                              }
                            }}
                          >
                            {subItem.title}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
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
                <button className="w-full group">
                  <div className="flex items-center gap-3 rounded-md p-1.5 bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="relative">
                      <Avatar className="h-7 w-7 ring-2 ring-white shadow-sm">
                        <AvatarImage src="" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-black to-gray-100 text-white font-semibold text-xs">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 overflow-hidden text-left">
                      <h3 className="truncate font-semibold text-sm text-gray-900 group-hover:text-black-600 transition-colors">
                        {getUserName()}
                      </h3>
                      <p className="truncate text-[10px] text-gray-500 mt-0.5">
                        {getUserEmail()}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-black-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-65 p-2">
              
                <Link href="/settings?tab=profile">
                  <DropdownMenuItem className="cursor-pointer rounded-lg hover:bg-black-50 transition-colors py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-black-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-black-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profile Settings</p>
                        <p className="text-xs text-gray-500">Manage your account</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <Separator className="my-2" />
                <DropdownMenuItem 
                  className="cursor-pointer rounded-lg hover:bg-red-50 transition-colors py-2.5 focus:bg-red-50" 
                  onSelect={async (e) => {
                    e.preventDefault();
                    await handleLogout();
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-red-100 flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-600">Log out</p>
                      <p className="text-xs text-gray-500">Sign out of your account</p>
                    </div>
                  </div>
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
