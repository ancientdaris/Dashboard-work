"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ImageIcon,
  ArrowLeft,
  Loader2,
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
import { createClient } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface ProductFormData {
  name: string;
  sku: string;
  description: string;
  category: string;
  brand: string;
  unit_price: number;
  cost_price: number;
  tax_rate: number;
  hsn_code: string;
  sac_code: string;
  barcode: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  } | null;
  is_active: boolean;
  batch_tracking_enabled: boolean;
  expiry_date: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    category: '',
    brand: '',
    unit_price: 0,
    cost_price: 0,
    tax_rate: 18,
    hsn_code: '',
    sac_code: '',
    barcode: '',
    weight: 0,
    dimensions: null,
    is_active: true,
    batch_tracking_enabled: false,
    expiry_date: '',
  });

  const [showErrors, setShowErrors] = useState(false);

  const handleInputChange = (field: keyof ProductFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDimensionsChange = (dimensions: string) => {
    // Parse dimensions like "10 × 20 × 30"
    const parts = dimensions.split('×').map(p => parseFloat(p.trim()));
    if (parts.length === 3 && parts.every(p => !isNaN(p))) {
      setFormData(prev => ({
        ...prev,
        dimensions: {
          length: parts[0],
          width: parts[1],
          height: parts[2],
          unit: 'cm'
        }
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.name.trim()) {
      errors.push("Product name is required");
    }
    if (!formData.sku.trim()) {
      errors.push("SKU is required");
    }
    if (formData.unit_price <= 0) {
      errors.push("Unit price must be greater than 0");
    }

    if (errors.length > 0) {
      toast({
        title: "Please fill in all required fields",
        description: errors.join(", "),
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setShowErrors(true);
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { error } = await (supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('products') as any)
        .insert({
          name: formData.name,
          sku: formData.sku,
          description: formData.description || null,
          category: formData.category || null,
          brand: formData.brand || null,
          unit_price: formData.unit_price,
          cost_price: formData.cost_price || null,
          tax_rate: formData.tax_rate,
          hsn_code: formData.hsn_code || null,
          sac_code: formData.sac_code || null,
          barcode: formData.barcode || null,
          weight: formData.weight || null,
          dimensions: formData.dimensions,
          is_active: formData.is_active,
          batch_tracking_enabled: formData.batch_tracking_enabled,
          expiry_date: formData.expiry_date || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });

      router.push('/products');
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <Button 
                type="button"
                className="bg-slate-900 hover:bg-slate-800 shrink-0"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Product'
                )}
              </Button>
            </div>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit}>
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
                      <Input 
                        placeholder="Enter product name" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={showErrors && !formData.name.trim() ? 'border-red-500' : ''}
                        required
                      />
                      {showErrors && !formData.name.trim() && (
                        <p className="text-sm text-red-500">Product name is required</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>SKU <span className="text-red-500">*</span></Label>
                      <Input 
                        placeholder="Enter SKU" 
                        value={formData.sku}
                        onChange={(e) => handleInputChange('sku', e.target.value)}
                        className={showErrors && !formData.sku.trim() ? 'border-red-500' : ''}
                        required
                      />
                      {showErrors && !formData.sku.trim() && (
                        <p className="text-sm text-red-500">SKU is required</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea 
                        placeholder="Enter product description"
                        className="min-h-[120px]"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="clothing">Clothing</SelectItem>
                              <SelectItem value="food">Food</SelectItem>
                              <SelectItem value="beverages">Beverages</SelectItem>
                              <SelectItem value="home-goods">Home Goods</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Brand</Label>
                        <Input 
                          placeholder="Enter brand name" 
                          value={formData.brand}
                          onChange={(e) => handleInputChange('brand', e.target.value)}
                        />
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
                      <Input 
                        placeholder="Enter HSN code" 
                        value={formData.hsn_code}
                        onChange={(e) => handleInputChange('hsn_code', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax Rate (%)</Label>
                      <Input 
                        type="number" 
                        value={formData.tax_rate}
                        onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>


                <div>
                  <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Minimum Order Quantity</Label>
                      <Input type="number" defaultValue="1" />
                    </div>
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input 
                        type="number" 
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dimensions</Label>
                      <Input 
                        placeholder="L × W × H (cm)" 
                        onChange={(e) => handleDimensionsChange(e.target.value)}
                      />
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
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                      />
                      <span className="text-sm font-medium">
                        {formData.is_active ? "Active" : "Inactive"}
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
                        <Label>Unit Price <span className="text-red-500">*</span></Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                          <Input 
                            type="number" 
                            step="0.01"
                            value={formData.unit_price}
                            onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value) || 0)}
                            className={`pl-7 ${showErrors && formData.unit_price <= 0 ? 'border-red-500' : ''}`}
                            required
                          />
                        </div>
                        {showErrors && formData.unit_price <= 0 && (
                          <p className="text-sm text-red-500">Unit price must be greater than 0</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label>Cost Price</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-2.5 text-muted-foreground">₹</span>
                          <Input 
                            type="number" 
                            step="0.01"
                            value={formData.cost_price}
                            onChange={(e) => handleInputChange('cost_price', parseFloat(e.target.value) || 0)}
                            className="pl-7" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div>
                  <h2 className="text-lg font-semibold mb-4">Inventory</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Stock Quantity <span className="text-red-500">*</span></Label>
                      <Input type="number" defaultValue="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Reorder Level</Label>
                      <Input type="number" defaultValue="5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Barcode</Label>
                      <Input 
                        placeholder="Scan or enter barcode" 
                        value={formData.barcode}
                        onChange={(e) => handleInputChange('barcode', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          </form>
        </div>
      </div>
    </div>
  );
}