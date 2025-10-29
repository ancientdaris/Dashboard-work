"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, ShieldCheck, AlertCircle, CheckCircle2, Clock, AlertTriangle, ArrowRight, History } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import Link from "next/link";

export default function CompliancePage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
              <p className="text-muted-foreground">Manage your business compliance in one place</p>
            </div>
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="gst">GST</TabsTrigger>
              <TabsTrigger value="taxes">Taxes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">Requires your attention</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">In the next 15 days</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-xs text-muted-foreground">Good standing</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Documents</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground">Total documents</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>Your recent compliance activities and updates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { 
                        id: 1, 
                        title: "GST Return Filed", 
                        description: "GSTR-3B for March 2023", 
                        date: "2023-04-20", 
                        status: "completed" 
                      },
                      { 
                        id: 2, 
                        title: "TDS Payment Due", 
                        description: "Q4 TDS payment pending", 
                        date: "2023-04-30", 
                        status: "pending" 
                      },
                      { 
                        id: 3, 
                        title: "Annual Compliance", 
                        description: "Annual return filing required", 
                        date: "2023-03-15", 
                        status: "overdue" 
                      },
                    ].map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {activity.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : activity.status === 'pending' ? (
                            <Clock className="h-5 w-5 text-amber-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{activity.title}</h3>
                            <span className="text-xs text-muted-foreground">{activity.date}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common compliance tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      File GSTR-1
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Pay TDS
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Upload Documents
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      View Compliance Calendar
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="gst" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Link href="/more/compliance/gst-returns">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>GST Returns</CardTitle>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription>View and manage your GST filings and returns</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Filed Returns</span>
                          <span className="font-semibold">20</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Pending</span>
                          <span className="font-semibold text-amber-600">2</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Card>
                  <CardHeader>
                    <CardTitle>GST Payments</CardTitle>
                    <CardDescription>Manage your GST payment history</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Paid</span>
                        <span className="font-semibold">₹5,45,000</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">This Quarter</span>
                        <span className="font-semibold">₹1,35,000</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="taxes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tax Management</CardTitle>
                  <CardDescription>Manage your business taxes and payments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-md border p-4">
                      <div>
                        <h3 className="font-medium">TDS/TCS</h3>
                        <p className="text-sm text-muted-foreground">Manage Tax Deducted at Source</p>
                      </div>
                      <Button variant="outline">View Details</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-4">
                      <div>
                        <h3 className="font-medium">Advance Tax</h3>
                        <p className="text-sm text-muted-foreground">Upcoming and past advance tax payments</p>
                      </div>
                      <Button variant="outline">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/more/compliance/documents">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Document Vault</CardTitle>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription>Store and manage compliance documents</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Documents</span>
                          <span className="font-semibold">24</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Storage Used</span>
                          <span className="font-semibold">156 MB</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link href="/more/compliance/audit-trail">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Audit Trail</CardTitle>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription>Track all compliance activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Events</span>
                          <span className="font-semibold">1,247</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Today</span>
                          <span className="font-semibold">24</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Card>
                  <CardHeader>
                    <CardTitle>Certificates</CardTitle>
                    <CardDescription>Business certificates and licenses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Active</span>
                        <span className="font-semibold">8</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Expiring Soon</span>
                        <span className="font-semibold text-amber-600">1</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
