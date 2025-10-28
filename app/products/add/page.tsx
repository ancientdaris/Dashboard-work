"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ImageIcon,
  ArrowLeft,
  Loader2,
  X,
  Upload,
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
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

type Attribute = {
  id: string;
  name: string;
  icon: string | null;
  hex_code?: string | null;
};

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
  
  // Attributes
  const [categories, setCategories] = useState<Attribute[]>([]);
  const [applications, setApplications] = useState<Attribute[]>([]);
  const [collections, setCollections] = useState<Attribute[]>([]);
  const [sizes, setSizes] = useState<Attribute[]>([]);
  const [colors, setColors] = useState<Attribute[]>([]);
  const [finishes, setFinishes] = useState<Attribute[]>([]);
  const [lookAndFeels, setLookAndFeels] = useState<Attribute[]>([]);
  
  // Form fields for attributes
  const [application, setApplication] = useState('');
  const [collection, setCollection] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [finish, setFinish] = useState('');
  const [lookAndFeel, setLookAndFeel] = useState('');
  
  // Images
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    description: '',
    category: '',
    brand: '',
    unit_price: 0,
    cost_price: 0,
    tax_rate: 0.18,
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

  useEffect(() => {
    fetchAllAttributes();
  }, []);

  const fetchAllAttributes = async () => {
    try {
      const [categoriesRes, applicationsRes, collectionsRes, sizesRes, colorsRes, finishesRes, lookAndFeelRes] = await Promise.all([
        supabase.from('categories').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('applications').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('collections').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('sizes').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('colors').select('id, name, icon, hex_code').eq('is_active', true).order('name'),
        supabase.from('finishes').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('look_and_feel').select('id, name, icon').eq('is_active', true).order('name'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (applicationsRes.data) setApplications(applicationsRes.data);
      if (collectionsRes.data) setCollections(collectionsRes.data);
      if (sizesRes.data) setSizes(sizesRes.data);
      if (colorsRes.data) setColors(colorsRes.data);
      if (finishesRes.data) setFinishes(finishesRes.data);
      if (lookAndFeelRes.data) setLookAndFeels(lookAndFeelRes.data);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      
      toast({
        title: "Success",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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
          application: application || null,
          collection: collection || null,
          size: size || null,
          color: color || null,
          finish: finish || null,
          look_and_feel: lookAndFeel || null,
          brand: formData.brand || null,
          unit_price: formData.unit_price,
          cost_price: formData.cost_price || null,
          tax_rate: formData.tax_rate,
          hsn_code: formData.hsn_code || null,
          sac_code: formData.sac_code || null,
          barcode: formData.barcode || null,
          weight: formData.weight || null,
          dimensions: formData.dimensions,
          image_url: images[0] || null,
          images: images,
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
      <div className="flex-1 p-4 md:p-6 overflow-auto bg-gray-50">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.name}>
                                  {cat.icon ? `${cat.icon} ` : ''}{cat.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Application</Label>
                        <Select value={application} onValueChange={setApplication}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Application" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {applications.map((app) => (
                                <SelectItem key={app.id} value={app.name}>
                                  {app.icon ? `${app.icon} ` : ''}{app.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Collection</Label>
                        <Select value={collection} onValueChange={setCollection}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Collection" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {collections.map((col) => (
                                <SelectItem key={col.id} value={col.name}>
                                  {col.icon ? `${col.icon} ` : ''}{col.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Size</Label>
                        <Select value={size} onValueChange={setSize}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {sizes.map((sz) => (
                                <SelectItem key={sz.id} value={sz.name}>
                                  {sz.icon ? `${sz.icon} ` : ''}{sz.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Select value={color} onValueChange={setColor}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {colors.map((col) => (
                                <SelectItem key={col.id} value={col.name}>
                                  {col.icon ? `${col.icon} ` : ''}{col.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Finish</Label>
                        <Select value={finish} onValueChange={setFinish}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Finish" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {finishes.map((fin) => (
                                <SelectItem key={fin.id} value={fin.name}>
                                  {fin.icon ? `${fin.icon} ` : ''}{fin.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Look & Feel</Label>
                        <Select value={lookAndFeel} onValueChange={setLookAndFeel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Look & Feel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {lookAndFeels.map((laf) => (
                                <SelectItem key={laf.id} value={laf.name}>
                                  {laf.icon ? `${laf.icon} ` : ''}{laf.name}
                                </SelectItem>
                              ))}
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
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h2 className="text-lg font-semibold mb-4">Tax & Compliance</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>HSN Code (for goods)</Label>
                      <Input 
                        placeholder="Enter HSN code" 
                        value={formData.hsn_code}
                        onChange={(e) => handleInputChange('hsn_code', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SAC Code (for services)</Label>
                      <Input 
                        placeholder="Enter SAC code" 
                        value={formData.sac_code}
                        onChange={(e) => handleInputChange('sac_code', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax Rate (decimal)</Label>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.18"
                        value={formData.tax_rate}
                        onChange={(e) => handleInputChange('tax_rate', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input 
                        type="date"
                        value={formData.expiry_date}
                        onChange={(e) => handleInputChange('expiry_date', e.target.value)}
                      />
                    </div>
                  </div>
                </div>


                <div>
                  <h2 className="text-lg font-semibold mb-4">Additional Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Weight (kg)</Label>
                      <Input 
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.weight}
                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dimensions (L × W × H in cm)</Label>
                      <Input 
                        placeholder="e.g., 10 x 5 x 3" 
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
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5">
                      <Label>Batch Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable batch/lot tracking
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={formData.batch_tracking_enabled}
                        onCheckedChange={(checked) => handleInputChange('batch_tracking_enabled', checked)}
                      />
                      <span className="text-sm font-medium">
                        {formData.batch_tracking_enabled ? "Enabled" : "Disabled"}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Product Images</h2>
                  
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {images.map((url, index) => (
                        <div key={index} className="relative group">
                          <Image
                            src={url}
                            alt={`Product ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="border-2 border-dashed rounded-lg p-8 bg-white/50 border-muted min-h-[200px] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={uploadingImages}
                      >
                        {uploadingImages ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Images
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG up to 10MB each (Multiple images supported)
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
                  <h2 className="text-lg font-semibold mb-4">Product Identification</h2>
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
          </Card>
          </form>
        </div>
      </div>
    </div>
  );
}