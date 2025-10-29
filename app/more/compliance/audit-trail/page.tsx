"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  ArrowLeft, 
  User, 
  Clock, 
  CheckCircle2,
  Edit,
  Trash2,
  Upload,
  Eye
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import Link from "next/link";

export default function AuditTrailPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const auditLogs = [
    {
      id: 1,
      action: "GST Return Filed",
      description: "GSTR-3B for March 2024 filed successfully",
      user: "Rajesh Kumar",
      timestamp: "2024-04-18T14:30:00",
      type: "filing",
      status: "success",
      details: "Tax Amount: ₹45,000"
    },
    {
      id: 2,
      action: "Document Uploaded",
      description: "Bank Statement March 2024 uploaded",
      user: "Priya Sharma",
      timestamp: "2024-04-17T10:15:00",
      type: "upload",
      status: "success",
      details: "File Size: 3.2 MB"
    },
    {
      id: 3,
      action: "Document Verified",
      description: "TDS Certificate Q4 2023 verified",
      user: "System",
      timestamp: "2024-04-16T16:45:00",
      type: "verification",
      status: "success",
      details: "Auto-verified"
    },
    {
      id: 4,
      action: "User Access Modified",
      description: "Access granted to Amit Patel for GST module",
      user: "Admin",
      timestamp: "2024-04-15T09:20:00",
      type: "access",
      status: "success",
      details: "Role: Viewer"
    },
    {
      id: 5,
      action: "Payment Processed",
      description: "TDS payment for Q4 2023 processed",
      user: "Rajesh Kumar",
      timestamp: "2024-04-14T11:30:00",
      type: "payment",
      status: "success",
      details: "Amount: ₹25,000"
    },
    {
      id: 6,
      action: "Document Deleted",
      description: "Old invoice register removed",
      user: "Priya Sharma",
      timestamp: "2024-04-13T15:10:00",
      type: "deletion",
      status: "warning",
      details: "Permanent deletion"
    },
    {
      id: 7,
      action: "Report Generated",
      description: "Compliance report for Q1 2024 generated",
      user: "System",
      timestamp: "2024-04-12T08:00:00",
      type: "report",
      status: "success",
      details: "PDF format"
    },
    {
      id: 8,
      action: "Failed Login Attempt",
      description: "Multiple failed login attempts detected",
      user: "Unknown",
      timestamp: "2024-04-11T22:30:00",
      type: "security",
      status: "error",
      details: "IP: 192.168.1.100"
    },
    {
      id: 9,
      action: "Settings Updated",
      description: "Notification preferences updated",
      user: "Rajesh Kumar",
      timestamp: "2024-04-10T13:45:00",
      type: "settings",
      status: "success",
      details: "Email notifications enabled"
    },
    {
      id: 10,
      action: "Data Export",
      description: "Transaction data exported for analysis",
      user: "Priya Sharma",
      timestamp: "2024-04-09T10:00:00",
      type: "export",
      status: "success",
      details: "Format: CSV"
    }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'filing':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'upload':
        return <Upload className="h-5 w-5 text-green-500" />;
      case 'verification':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'access':
        return <User className="h-5 w-5 text-purple-500" />;
      case 'payment':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'deletion':
        return <Trash2 className="h-5 w-5 text-red-500" />;
      case 'report':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'security':
        return <User className="h-5 w-5 text-red-500" />;
      case 'settings':
        return <Edit className="h-5 w-5 text-gray-500" />;
      case 'export':
        return <Download className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className?: string }> = {
      success: { variant: "default", className: "bg-green-500" },
      warning: { variant: "secondary", className: "bg-amber-500 text-white" },
      error: { variant: "destructive" }
    };
    const config = variants[status] || { variant: "outline" };
    return (
      <Badge variant={config.variant} className={config.className}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/more/compliance">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
                <p className="text-muted-foreground">Track all compliance activities and system events</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Logs
              </Button>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Events logged</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <User className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                <User className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Log</CardTitle>
                  <CardDescription>Complete history of all compliance activities</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search activities..."
                    className="pl-8 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => {
                  const { date, time } = formatTimestamp(log.timestamp);
                  return (
                    <div
                      key={log.id}
                      className="flex items-start gap-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActionIcon(log.type)}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{log.action}</h3>
                              {getStatusBadge(log.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">{log.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {log.user}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {date} at {time}
                              </span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        {log.details && (
                          <div className="rounded-md bg-gray-100 px-3 py-2 text-sm">
                            <span className="font-medium">Details: </span>
                            <span className="text-muted-foreground">{log.details}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity by Type</CardTitle>
                <CardDescription>Distribution of activities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { type: "Filing", count: 45, color: "bg-blue-500" },
                  { type: "Document Upload", count: 38, color: "bg-green-500" },
                  { type: "Verification", count: 32, color: "bg-purple-500" },
                  { type: "Payment", count: 28, color: "bg-amber-500" },
                  { type: "Access Control", count: 15, color: "bg-gray-500" }
                ].map((item) => (
                  <div key={item.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${item.color}`} />
                      <span className="text-sm">{item.type}</span>
                    </div>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Users active in the last 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Rajesh Kumar", role: "Admin", activities: 12 },
                  { name: "Priya Sharma", role: "Manager", activities: 8 },
                  { name: "Amit Patel", role: "Viewer", activities: 3 },
                  { name: "System", role: "Automated", activities: 15 }
                ].map((user) => (
                  <div key={user.name} className="flex items-center justify-between rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{user.activities} activities</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
