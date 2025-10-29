"use client";

import { useState } from "react";
import { Camera, Image as ImageIcon, Search, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  unit_price: number;
  image_url: string | null;
  similarity: number;
}

export default function PhotoSearchPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { toast } = useToast();
  const supabase = createClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSearchResults([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const searchByPhoto = async () => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select or capture an image first",
        variant: "destructive",
      });
      return;
    }

    try {
      setSearching(true);

      // In a real implementation, you would:
      // 1. Upload the image to a server
      // 2. Use ML/AI service (like Google Vision, AWS Rekognition, or custom model) to analyze the image
      // 3. Extract features and match against product images
      // 4. Return ranked results by similarity

      // For now, we'll simulate by fetching products with images
      // and doing a mock similarity score

      const { data: products, error } = await supabase
        .from("products")
        .select("id, sku, name, category, brand, unit_price, image_url")
        .not("image_url", "is", null)
        .eq("is_active", true)
        .limit(20);

      if (error) throw error;

      // Mock similarity scoring (in production, this would come from ML model)
      const resultsWithSimilarity = (products || []).map(product => ({
        ...product,
        similarity: Math.random() * 100 // Mock similarity score 0-100
      })).sort((a, b) => b.similarity - a.similarity);

      setSearchResults(resultsWithSimilarity.slice(0, 10));

      if (resultsWithSimilarity.length === 0) {
        toast({
          title: "No Results",
          description: "No matching products found",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSearching(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSearchResults([]);
  };

  const getSimilarityVariant = (similarity: number): "default" | "secondary" | "outline" => {
    if (similarity > 80) return "default";
    if (similarity > 60) return "secondary";
    return "outline";
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <ImageIcon className="h-6 w-6" />
              <CardTitle className="text-2xl">Photo Search</CardTitle>
            </div>
            <CardDescription>
              Find products by taking a photo or uploading an image
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Image Selection */}
        {!selectedImage ? (
          <Card>
            <CardHeader>
              <CardTitle>Select Image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-sm text-gray-600 mb-4">Click to upload an image or drag and drop</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span>
                      <ImageIcon className="mr-2 h-5 w-5" />
                      Choose from Gallery
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Selected Image</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearImage}
                >
                  <XCircle className="h-4 w-4 mr-2 text-red-600" />
                  Clear
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={selectedImage}
                  alt="Selected"
                  fill
                  className="object-contain"
                />
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={searchByPhoto}
                disabled={searching}
              >
                <Search className="mr-2 h-5 w-5" />
                {searching ? "Searching..." : "Search Products"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Search Results ({searchResults.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchResults.map((product) => (
                  <Card key={product.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex gap-4">
                        {product.image_url && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg truncate flex-1">
                              {product.name}
                            </h3>
                            <Badge variant={getSimilarityVariant(product.similarity)}>
                              {product.similarity.toFixed(0)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">SKU: {product.sku}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            {product.brand && <span>{product.brand}</span>}
                            {product.brand && product.category && <span>•</span>}
                            {product.category && <span>{product.category}</span>}
                          </div>
                          <p className="text-xl font-bold">
                            ₹{parseFloat(product.unit_price.toString()).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* How it Works */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold mb-3">How Photo Search Works</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-sm font-bold flex-shrink-0">1.</span>
                <p className="text-sm text-muted-foreground">
                  Take a photo or upload an image of the product you&apos;re looking for
                </p>
              </div>
              <div className="flex gap-3">
                <span className="text-sm font-bold flex-shrink-0">4.</span>
                <p className="text-sm text-muted-foreground">
                  Select a product to view details and place orders
                </p>
              </div>
            </div>
            <Card className="mt-4">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  <span className="font-bold">Note:</span> For best results, use clear, well-lit photos with the product as the main subject.
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-sm font-semibold mb-3">Perfect For</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Quickly finding products when you don&apos;t know the name</li>
              <li>• Matching products from competitor catalogs</li>
              <li>• Identifying products from customer photos</li>
              <li>• Discovering similar or alternative products</li>
            </ul>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
