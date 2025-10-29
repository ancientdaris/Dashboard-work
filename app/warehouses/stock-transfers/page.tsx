"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  product_id: string;
  from_warehouse_id: string;
  to_warehouse_id: string;
  quantity: string;
  notes: string;
}

interface FormErrors {
  product_id?: string;
  from_warehouse_id?: string;
  to_warehouse_id?: string;
  quantity?: string;
}

export default function StockTransferPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedFromWarehouse, setSelectedFromWarehouse] = useState<any>(null);
  const [selectedToWarehouse, setSelectedToWarehouse] = useState<any>(null);
  const [availableStock, setAvailableStock] = useState<number>(0);

  const [formData, setFormData] = useState<FormData>({
    product_id: "",
    from_warehouse_id: "",
    to_warehouse_id: "",
    quantity: "",
    notes: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch warehouses
      const { data: warehousesData, error: warehousesError } = await supabase
        .from("warehouses")
        .select("*")
        .eq("is_active", true)
        .order("name");

      if (warehousesError) throw warehousesError;
      setWarehouses(warehousesData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const checkAvailableStock = async (productId: string, warehouseId: string) => {
    if (!productId || !warehouseId) return;

    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("quantity_in_stock")
        .eq("product_id", productId)
        .eq("warehouse_id", warehouseId)
        .single();

      if (error) {
        console.error("Error checking stock:", error);
        setAvailableStock(0);
        return;
      }

      setAvailableStock(data?.quantity_in_stock || 0);
    } catch (error) {
      console.error("Error checking stock:", error);
      setAvailableStock(0);
    }
  };

  useEffect(() => {
    if (formData.product_id && formData.from_warehouse_id) {
      checkAvailableStock(formData.product_id, formData.from_warehouse_id);
    }
  }, [formData.product_id, formData.from_warehouse_id]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.product_id) {
      newErrors.product_id = "Please select a product";
    }

    if (!formData.from_warehouse_id) {
      newErrors.from_warehouse_id = "Please select source warehouse";
    }

    if (!formData.to_warehouse_id) {
      newErrors.to_warehouse_id = "Please select destination warehouse";
    } else if (formData.from_warehouse_id === formData.to_warehouse_id) {
      newErrors.to_warehouse_id = "Source and destination warehouses must be different";
    }

    const quantity = parseInt(formData.quantity);
    if (!formData.quantity || isNaN(quantity) || quantity <= 0) {
      newErrors.quantity = "Enter a valid quantity greater than 0";
    } else if (quantity > availableStock) {
      newErrors.quantity = `Insufficient stock. Available: ${availableStock}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateTransferNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    return `ST${timestamp}${random}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const transferData = {
        transfer_number: generateTransferNumber(),
        product_id: formData.product_id,
        from_warehouse_id: formData.from_warehouse_id,
        to_warehouse_id: formData.to_warehouse_id,
        quantity: parseInt(formData.quantity),
        status: "pending",
        requested_by: user?.id,
        notes: formData.notes.trim() || null,
      };

      const { error } = await supabase
        .from("stock_transfers")
        .insert([transferData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Stock transfer request created successfully. Awaiting approval.",
      });

      router.push("/warehouses");
    } catch (error: any) {
      console.error("Error creating transfer:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create stock transfer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50 p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div>
                    <CardTitle className="text-2xl">New Stock Transfer</CardTitle>
                    <CardDescription>Transfer stock between warehouses</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Form */}
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Product Selection */}
                <div className="space-y-2">
                  <Label htmlFor="product">
                    Product <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={formData.product_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, product_id: value });
                      const product = products.find((p) => p.id === value);
                      setSelectedProduct(product);
                      setErrors({ ...errors, product_id: undefined });
                    }}
                  >
                    <SelectTrigger className={errors.product_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.product_id && (
                    <p className="text-xs text-red-600">{errors.product_id}</p>
                  )}
                </div>

                {/* From Warehouse */}
                <div className="space-y-2">
                  <Label htmlFor="from_warehouse">
                    From Warehouse <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={formData.from_warehouse_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, from_warehouse_id: value });
                      const warehouse = warehouses.find((w) => w.id === value);
                      setSelectedFromWarehouse(warehouse);
                      setErrors({ ...errors, from_warehouse_id: undefined });
                    }}
                  >
                    <SelectTrigger className={errors.from_warehouse_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select source warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name} - {warehouse.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.from_warehouse_id && (
                    <p className="text-xs text-red-600">{errors.from_warehouse_id}</p>
                  )}
                  {availableStock > 0 && formData.from_warehouse_id && formData.product_id && (
                    <div className="p-2 bg-blue-50 rounded text-sm text-blue-700">
                      Available Stock: <span className="font-bold">{availableStock}</span> units
                    </div>
                  )}
                </div>

                {/* To Warehouse */}
                <div className="space-y-2">
                  <Label htmlFor="to_warehouse">
                    To Warehouse <span className="text-red-600">*</span>
                  </Label>
                  <Select
                    value={formData.to_warehouse_id}
                    onValueChange={(value) => {
                      setFormData({ ...formData, to_warehouse_id: value });
                      const warehouse = warehouses.find((w) => w.id === value);
                      setSelectedToWarehouse(warehouse);
                      setErrors({ ...errors, to_warehouse_id: undefined });
                    }}
                  >
                    <SelectTrigger className={errors.to_warehouse_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select destination warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses
                        .filter((w) => w.id !== formData.from_warehouse_id)
                        .map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name} - {warehouse.city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.to_warehouse_id && (
                    <p className="text-xs text-red-600">{errors.to_warehouse_id}</p>
                  )}
                </div>

                {/* Transfer Visual */}
                {selectedFromWarehouse && selectedToWarehouse && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-center gap-4">
                        <span className="font-semibold text-blue-900">
                          {selectedFromWarehouse.name}
                        </span>
                        <ArrowRightLeft className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-900">
                          {selectedToWarehouse.name}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantity <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity to transfer"
                    value={formData.quantity}
                    onChange={(e) => {
                      setFormData({ ...formData, quantity: e.target.value.replace(/\D/g, "") });
                      setErrors({ ...errors, quantity: undefined });
                    }}
                    className={errors.quantity ? "border-red-500" : ""}
                  />
                  {errors.quantity && (
                    <p className="text-xs text-red-600">{errors.quantity}</p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter any additional notes or instructions"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <Button className="w-full" onClick={handleSubmit} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Creating..." : "Create Transfer Request"}
                </Button>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <p className="text-xs text-yellow-800">
                  <span className="font-semibold">Note:</span> Stock transfer requests require
                  approval before being processed. The stock will be deducted from the source
                  warehouse and added to the destination warehouse upon approval.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
