"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useState } from "react";
import { 
  ImageIcon,
  ArrowLeft,
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";

export default function NewProductPage() {
  const [productStatus, setProductStatus] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto bg-gray-50">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Add New Product</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Fill in the details to add a new product to your inventory
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild className="shrink-0">
                <Link href="/products" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </Link>
              </Button>
              <Button className="bg-slate-900 hover:bg-slate-800 shrink-0">
                Create Product
              </Button>
            </div>
          </div>

          {/* Content */}
          <Card className="p-6 transition-all hover:shadow-md">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Basic Information</h2>
                    <span className="text-sm text-muted-foreground">Required fields are marked with *</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Name <span className="text-red-500">*</span></Label>
                      <Input placeholder="Enter product name" />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU <span className="text-red-500">*</span></Label>
                      <Input placeholder="Enter SKU" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        placeholder="Enter product description"
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Category <span className="text-red-500">*</span></Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="food">Food</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Brand</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Brand" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="brand1">Brand 1</SelectItem>
                              <SelectItem value="brand2">Brand 2</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Unit <span className="text-red-500">*</span></Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="piece">Piece</SelectItem>
                              <SelectItem value="kg">Kilogram</SelectItem>
                              <SelectItem value="litre">Litre</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-lg font-semibold mb-4">Tax & Compliance</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>HSN Code</Label>
                      <Input placeholder="Enter HSN code" />
                    </div>
                    <div className="space-y-2">
                      <Label>GST Rate (%)</Label>
                      <Input type="number" defaultValue="18" />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Minimum Order Quantity</Label>
                      <Input type="number" defaultValue="1" />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input type="number" defaultValue="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Dimensions</Label>
                      <Input placeholder="L × W × H (cm)" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Status & Product Images */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Status & Visibility</h2>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Product Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable to make product visible
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={productStatus}
                        onCheckedChange={setProductStatus}
                      />
                      <span className="text-sm font-medium">
                        {productStatus ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <h2 className="text-lg font-semibold">Product Images</h2>
                  <div className="border-2 border-dashed rounded-lg p-8 bg-white/50 border-muted min-h-[247px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <Button variant="outline">Upload Images</Button>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator />

                <div>
                  <h2 className="text-lg font-semibold mb-4">Pricing</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Wholesale Price <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                          <Input type="number" defaultValue="0" className="pl-7" />
                          <span className="absolute right-3 top-2.5 text-muted-foreground">.00</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Retail Price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                          <Input type="number" defaultValue="0" className="pl-7" />
                          <span className="absolute right-3 top-2.5 text-muted-foreground">.00</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>MRP</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                          <Input type="number" defaultValue="0" className="pl-7" />
                          <span className="absolute right-3 top-2.5 text-muted-foreground">.00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}