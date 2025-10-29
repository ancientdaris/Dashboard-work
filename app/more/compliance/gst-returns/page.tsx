"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, Calendar, CheckCircle2, Clock, AlertTriangle, ArrowLeft } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import Link from "next/link";

export default function GSTReturnsPage() {
  const gstReturns = [
    {
      id: 1,
      type: "GSTR-1",
      period: "March 2024",
      dueDate: "2024-04-11",
      status: "filed",
      filedDate: "2024-04-10",
      amount: "₹1,25,000"
    },
    {
      id: 2,
      type: "GSTR-3B",
      period: "March 2024",
      dueDate: "2024-04-20",
      status: "filed",
      filedDate: "2024-04-18",
      amount: "₹45,000"
    },
    {
      id: 3,
      type: "GSTR-1",
      period: "April 2024",
      dueDate: "2024-05-11",
      status: "pending",
      amount: "₹1,35,000"
    },
    {
      id: 4,
      type: "GSTR-3B",
      period: "April 2024",
      dueDate: "2024-05-20",
      status: "pending",
      amount: "₹52,000"
    },
    {
      id: 5,
      type: "GSTR-9",
      period: "FY 2023-24",
      dueDate: "2024-12-31",
      status: "upcoming",
      amount: "Annual Return"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'filed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'upcoming':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      filed: "default",
      pending: "secondary",
      upcoming: "outline"
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
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
                <h1 className="text-3xl font-bold tracking-tight">GST Returns</h1>
                <p className="text-muted-foreground">Manage and file your GST returns</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                File New Return
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Filed</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">20</div>
                <p className="text-xs text-muted-foreground">Successfully filed</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Action required</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                <Calendar className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Next 30 days</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>GST Returns History</CardTitle>
              <CardDescription>View and manage all your GST return filings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gstReturns.map((gstReturn) => (
                  <div
                    key={gstReturn.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(gstReturn.status)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{gstReturn.type}</h3>
                          {getStatusBadge(gstReturn.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Period: {gstReturn.period}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Due: {new Date(gstReturn.dueDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          {gstReturn.filedDate && (
                            <span className="text-green-600">
                              Filed: {new Date(gstReturn.filedDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-semibold">{gstReturn.amount}</p>
                        <p className="text-xs text-muted-foreground">Tax Amount</p>
                      </div>
                      <div className="flex gap-2">
                        {gstReturn.status === 'filed' ? (
                          <>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </>
                        ) : (
                          <Button size="sm">
                            File Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common GST return tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  File GSTR-1
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  File GSTR-3B
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Download GSTR-2A
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Filing Calendar
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Dates</CardTitle>
                <CardDescription>Upcoming GST return deadlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">GSTR-1 (April 2024)</p>
                    <p className="text-sm text-muted-foreground">Due: 11th May 2024</p>
                  </div>
                  <Badge variant="secondary">5 days left</Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">GSTR-3B (April 2024)</p>
                    <p className="text-sm text-muted-foreground">Due: 20th May 2024</p>
                  </div>
                  <Badge variant="secondary">14 days left</Badge>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">GSTR-9 (FY 2023-24)</p>
                    <p className="text-sm text-muted-foreground">Due: 31st Dec 2024</p>
                  </div>
                  <Badge variant="outline">Annual</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
