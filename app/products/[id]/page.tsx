"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Package, Share2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";
import Image from "next/image";

type Product = Database['public']['Tables']['products']['Row'] & {
  inventory?: Database['public']['Tables']['inventory']['Row'];
};

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          inventory (*)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareProduct = () => {
    const message = `Check out this product!\n\n${product?.name}\nPrice: ₹${Number(product?.unit_price).toFixed(2)}\nSKU: ${product?.sku}${product?.description ? '\n\n' + product.description : ''}`;
    
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Product',
        text: message,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(message);
      alert('Product details copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!product) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-lg text-muted-foreground">Product not found</p>
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/products')}
                  className="mt-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Products
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/products')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={shareProduct}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button 
                  onClick={() => router.push(`/products/edit/${product.id}`)}
                >
                  Edit Product
                </Button>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Image and Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Product Image */}
                <Card>
                  <CardContent className="p-6">
                    {product.image_url ? (
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                        <Package className="h-24 w-24 text-gray-400" />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Basic Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6 space-y-3">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">SKU</p>
                      <p className="font-semibold">{product.sku}</p>
                    </div>
                    {product.category && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-semibold">{product.category}</p>
                      </div>
                    )}
                    {product.brand && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Brand</p>
                        <p className="font-semibold">{product.brand}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Name */}
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                    {product.description && (
                      <p className="text-muted-foreground mt-2">{product.description}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Pricing */}
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                  </CardHeader>
                  <Separator />
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Unit Price</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{Number(product.unit_price).toFixed(2)}
                        </p>
                      </div>
                      {product.cost_price && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Cost Price</p>
                          <p className="text-xl font-semibold">
                            ₹{Number(product.cost_price).toFixed(2)}
                          </p>
                        </div>
                      )}
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Tax Rate</p>
                        <p className="text-xl font-semibold">
                          {(Number(product.tax_rate) * 100).toFixed(0)}%
                        </p>
                      </div>
                      {product.cost_price && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Margin</p>
                          <p className="text-xl font-semibold text-blue-600">
                            {(((Number(product.unit_price) - Number(product.cost_price)) / Number(product.unit_price)) * 100).toFixed(1)}%
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Inventory */}
                {product.inventory && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory</CardTitle>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">In Stock</p>
                          <p className={`text-2xl font-bold ${product.inventory.quantity_in_stock <= product.inventory.reorder_level ? 'text-red-600' : 'text-green-600'}`}>
                            {product.inventory.quantity_in_stock}
                          </p>
                          <p className="text-xs text-muted-foreground">units</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Reorder Level</p>
                          <p className="text-xl font-semibold">
                            {product.inventory.reorder_level}
                          </p>
                          <p className="text-xs text-muted-foreground">units</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Reorder Qty</p>
                          <p className="text-xl font-semibold">
                            {product.inventory.reorder_quantity}
                          </p>
                          <p className="text-xs text-muted-foreground">units</p>
                        </div>
                        {product.inventory.warehouse_location && (
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="text-xl font-semibold">
                              {product.inventory.warehouse_location}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Timestamps */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Created</p>
                        <p className="font-medium">{new Date(product.created_at).toLocaleString()}</p>
                      </div>
                      {product.updated_at && (
                        <div>
                          <p className="text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{new Date(product.updated_at).toLocaleString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
