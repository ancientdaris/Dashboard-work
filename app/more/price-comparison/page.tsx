"use client";

import { useState } from "react";
import { TrendingDown, Search, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface PriceResult {
  id: string;
  price: number;
  min_order_quantity: number;
  stock_available: number;
  wholesaler?: {
    business_name: string;
    phone: string;
  };
  product?: {
    name: string;
    sku: string;
    category: string;
    brand: string;
  };
}

export default function PriceComparisonPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<PriceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();

  const searchPrices = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Error",
        description: "Please enter a product name or SKU",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("wholesaler_product_pricing")
        .select(`
          *,
          wholesaler:profiles!wholesaler_id(business_name, phone),
          product:products(name, sku, category, brand)
        `)
        .eq("is_available", true)
        .ilike("products.name", `%${searchQuery}%`)
        .order("price", { ascending: true })
        .limit(20);

      if (error) throw error;
      setResults((data as PriceResult[]) || []);
      
      if (!data || data.length === 0) {
        toast({
          title: "No results",
          description: "No products found matching your search",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchPrices();
    }
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
              <TrendingDown className="h-6 w-6" />
              <CardTitle className="text-2xl">Price Comparison</CardTitle>
            </div>
            <CardDescription>
              Compare prices across multiple wholesalers to get the best deal
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Search Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Input
                placeholder="Search product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
              <Button
                size="lg"
                className="w-full"
                onClick={searchPrices}
                disabled={loading}
              >
                <Search className="mr-2 h-5 w-5" />
                {loading ? "Searching..." : "Compare Prices"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((item, index) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold flex-1">
                        {item.product?.name}
                      </h3>
                      {index === 0 && (
                        <Badge variant="default">
                          Best Price
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      Wholesaler: {item.wholesaler?.business_name}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-3xl font-bold">
                        ₹{parseFloat(item.price.toString()).toFixed(2)}
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-xs text-gray-600">
                          Min Order: {item.min_order_quantity} units
                        </p>
                        <p className="text-xs text-gray-600">
                          Stock: {item.stock_available} units
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="w-full mt-2"
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
