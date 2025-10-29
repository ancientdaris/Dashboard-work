"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Upload, Search, Filter, Folder, File, ArrowLeft, Eye, Trash2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import Link from "next/link";

export default function ComplianceDocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const documents = [
    {
      id: 1,
      name: "GST Registration Certificate",
      type: "PDF",
      category: "GST",
      size: "2.4 MB",
      uploadDate: "2024-01-15",
      status: "verified"
    },
    {
      id: 2,
      name: "GSTR-3B March 2024",
      type: "PDF",
      category: "GST Returns",
      size: "1.8 MB",
      uploadDate: "2024-04-18",
      status: "verified"
    },
    {
      id: 3,
      name: "TDS Certificate Q4 2023",
      type: "PDF",
      category: "TDS",
      size: "856 KB",
      uploadDate: "2024-04-05",
      status: "verified"
    },
    {
      id: 4,
      name: "PAN Card",
      type: "PDF",
      category: "Identity",
      size: "512 KB",
      uploadDate: "2024-01-10",
      status: "verified"
    },
    {
      id: 5,
      name: "Bank Statement March 2024",
      type: "PDF",
      category: "Banking",
      size: "3.2 MB",
      uploadDate: "2024-04-01",
      status: "pending"
    },
    {
      id: 6,
      name: "Annual Return FY 2022-23",
      type: "PDF",
      category: "Annual Filing",
      size: "4.1 MB",
      uploadDate: "2023-12-20",
      status: "verified"
    },
    {
      id: 7,
      name: "Invoice Register Q1 2024",
      type: "XLSX",
      category: "Invoices",
      size: "1.5 MB",
      uploadDate: "2024-04-10",
      status: "verified"
    },
    {
      id: 8,
      name: "Audit Report FY 2022-23",
      type: "PDF",
      category: "Audit",
      size: "5.6 MB",
      uploadDate: "2023-11-30",
      status: "verified"
    }
  ];

  const categories = [
    { name: "All Documents", count: 8, icon: FileText },
    { name: "GST", count: 2, icon: Folder },
    { name: "TDS", count: 1, icon: Folder },
    { name: "Annual Filing", count: 1, icon: Folder },
    { name: "Banking", count: 1, icon: Folder },
    { name: "Audit", count: 1, icon: Folder }
  ];

  const getStatusBadge = (status: string) => {
    return status === "verified" ? (
      <Badge variant="default" className="bg-green-500">Verified</Badge>
    ) : (
      <Badge variant="secondary">Pending</Badge>
    );
  };

  const getFileIcon = (type: string) => {
    return type === "PDF" ? (
      <FileText className="h-8 w-8 text-red-500" />
    ) : (
      <File className="h-8 w-8 text-green-500" />
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
                <h1 className="text-3xl font-bold tracking-tight">Document Vault</h1>
                <p className="text-muted-foreground">Store and manage your compliance documents securely</p>
              </div>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">All categories</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <FileText className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">21</div>
                <p className="text-xs text-muted-foreground">Documents verified</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <FileText className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Awaiting verification</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Folder className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156 MB</div>
                <p className="text-xs text-muted-foreground">of 5 GB</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    className="w-full justify-start"
                  >
                    <category.icon className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">{category.name}</span>
                    <Badge variant="secondary">{category.count}</Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Documents</CardTitle>
                    <CardDescription>Browse and manage your uploaded documents</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documents..."
                        className="pl-8 w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {getFileIcon(doc.type)}
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{doc.name}</h3>
                            {getStatusBadge(doc.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{doc.category}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>
                              Uploaded {new Date(doc.uploadDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Documents uploaded in the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center gap-3">
                      {getFileIcon(doc.type)}
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(doc.uploadDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
