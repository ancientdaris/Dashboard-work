"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { 
  Download, 
  Printer, 
  Copy, 
  Check, 
  Barcode as BarcodeIcon, 
  QrCode,
  Package,
  RefreshCw,
  Save,
  Loader2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase";
import type { Product } from "@/types/database.types";

// Local type since barcodes table was removed from Supabase
// Products now store barcode data directly via the `barcode` field
interface Barcode {
  id: string;
  barcode_type: 'barcode' | 'qrcode';
  barcode_data: string;
  product_id: string | null;
  product_name: string;
  price: string | null;
  sku: string;
  image_url: string | null;
  created_at: string;
  created_by: string | null;
}

export default function BarcodeGeneratorPage() {
  const [barcodeType, setBarcodeType] = useState<"barcode" | "qrcode">("barcode");
  const [barcodeData, setBarcodeData] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [sku, setSku] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [generatedBarcodes, setGeneratedBarcodes] = useState<Barcode[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const supabase = createClient();

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
    fetchBarcodes();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to load products');
    }
  };

  const fetchBarcodes = async () => {
    try {
      setLoading(true);
      // barcodes table has been removed - barcode data is now stored on products directly
      // History is kept in-memory only for the current session
      setGeneratedBarcodes([]);
    } catch (error) {
      console.error('Error fetching barcodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductSelect = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProductId(productId);
      setProductName(product.name);
      setPrice(`₹${product.unit_price}`);
      setSku(product.sku);
      setBarcodeData(product.sku);
    }
  };

  const generateBarcode = () => {
    if (!barcodeData) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (barcodeType === "barcode") {
      // Simple barcode representation (vertical bars)
      const barWidth = 3;
      const barHeight = 80;
      const startX = 20;
      const startY = 20;

      ctx.fillStyle = "black";
      
      // Generate pattern based on data
      for (let i = 0; i < barcodeData.length; i++) {
        const charCode = barcodeData.charCodeAt(i);
        const pattern = charCode % 2 === 0 ? [1, 0, 1, 1] : [1, 1, 0, 1];
        
        pattern.forEach((bar, j) => {
          if (bar === 1) {
            ctx.fillRect(
              startX + (i * 4 + j) * barWidth,
              startY,
              barWidth,
              barHeight
            );
          }
        });
      }

      // Add text below barcode
      ctx.fillStyle = "black";
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(barcodeData, canvas.width / 2, startY + barHeight + 20);
    } else {
      // Simple QR code representation (grid pattern)
      const cellSize = 8;
      const gridSize = 25;
      const startX = (canvas.width - gridSize * cellSize) / 2;
      const startY = 20;

      ctx.fillStyle = "black";

      // Generate pattern based on data
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const index = i * gridSize + j;
          const charCode = barcodeData.charCodeAt(index % barcodeData.length);
          
          if ((charCode + i + j) % 3 !== 0) {
            ctx.fillRect(
              startX + j * cellSize,
              startY + i * cellSize,
              cellSize - 1,
              cellSize - 1
            );
          }
        }
      }
    }
  };

  const handleGenerate = async () => {
    if (!barcodeData) {
      alert('Please enter barcode data');
      return;
    }

    try {
      setSaving(true);
      generateBarcode();

      // Wait a bit for canvas to render
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = canvasRef.current;
      if (!canvas) return;

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      // Upload image to Supabase Storage
      const fileName = `${barcodeType}-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('barcodes')
        .upload(fileName, blob, {
          contentType: 'image/png',
          cacheControl: '3600'
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('barcodes')
        .getPublicUrl(fileName);

      // Store barcode data in-memory (barcodes table has been removed)
      // If a product is selected, update its barcode field
      if (selectedProductId) {
        await supabase
          .from('products')
          .update({ barcode: barcodeData })
          .eq('id', selectedProductId);
      }

      const barcodeRecord: Barcode = {
        id: crypto.randomUUID(),
        barcode_type: barcodeType,
        barcode_data: barcodeData,
        product_id: selectedProductId,
        product_name: productName || "Unnamed Product",
        price: price || null,
        sku: sku || barcodeData,
        image_url: publicUrl,
        created_at: new Date().toISOString(),
        created_by: null,
      };

      setGeneratedBarcodes([barcodeRecord, ...generatedBarcodes]);
      
      alert('Barcode generated and saved successfully!');
      
      // Reset form
      if (!selectedProductId) {
        setBarcodeData("");
        setProductName("");
        setPrice("");
        setSku("");
      }
    } catch (error) {
      console.error('Error generating barcode:', error);
      alert('Failed to generate barcode');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `${barcodeType}-${barcodeData}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handlePrint = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { margin: 0; padding: 20px; text-align: center; }
            img { max-width: 100%; }
          </style>
        </head>
        <body>
          <img src="${canvas.toDataURL()}" />
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(barcodeData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRandomGenerate = () => {
    if (barcodeType === "barcode") {
      // Generate random 13-digit EAN barcode
      const randomBarcode = Math.floor(1000000000000 + Math.random() * 9000000000000).toString();
      setBarcodeData(randomBarcode);
    } else {
      // Generate random URL for QR code
      const randomId = Math.random().toString(36).substring(7);
      setBarcodeData(`https://example.com/product/${randomId}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Barcode Generator</h1>
              <p className="text-muted-foreground">Generate and manage barcodes and QR codes for your products</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Generated</CardTitle>
                <BarcodeIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{generatedBarcodes.length}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Barcodes</CardTitle>
                <BarcodeIcon className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {generatedBarcodes.filter(b => b.barcode_type === "barcode").length}
                </div>
                <p className="text-xs text-muted-foreground">Linear barcodes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">QR Codes</CardTitle>
                <QrCode className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {generatedBarcodes.filter(b => b.barcode_type === "qrcode").length}
                </div>
                <p className="text-xs text-muted-foreground">2D codes</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products</CardTitle>
                <Package className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(generatedBarcodes.map(b => b.sku)).size}
                </div>
                <p className="text-xs text-muted-foreground">Unique SKUs</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Generate Barcode</CardTitle>
                <CardDescription>Create barcodes and QR codes for your products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={barcodeType} onValueChange={(v) => setBarcodeType(v as "barcode" | "qrcode")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="barcode">
                      <BarcodeIcon className="mr-2 h-4 w-4" />
                      Barcode
                    </TabsTrigger>
                    <TabsTrigger value="qrcode">
                      <QrCode className="mr-2 h-4 w-4" />
                      QR Code
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productSelect">Select Product (Optional)</Label>
                    <select
                      id="productSelect"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onChange={(e) => e.target.value && handleProductSelect(e.target.value)}
                      value={selectedProductId || ""}
                    >
                      <option value="">-- Select a product --</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {product.sku}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcodeData">
                      {barcodeType === "barcode" ? "Barcode Number" : "QR Code Data"}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="barcodeData"
                        placeholder={barcodeType === "barcode" ? "Enter barcode number (e.g., 1234567890123)" : "Enter URL or text"}
                        value={barcodeData}
                        onChange={(e) => setBarcodeData(e.target.value)}
                      />
                      <Button variant="outline" size="icon" onClick={handleRandomGenerate}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        placeholder="Enter product name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        placeholder="₹0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input
                        id="sku"
                        placeholder="Enter SKU"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button onClick={handleGenerate} className="w-full" disabled={!barcodeData || saving}>
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <BarcodeIcon className="mr-2 h-4 w-4" />
                    )}
                    {saving ? 'Generating...' : `Generate ${barcodeType === "barcode" ? "Barcode" : "QR Code"}`}
                  </Button>
                </div>

                <div className="rounded-lg border bg-white p-8">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={200}
                      className="border rounded"
                    />
                    {barcodeData && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleDownload}>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                        <Button variant="outline" size="sm" onClick={handlePrint}>
                          <Printer className="mr-2 h-4 w-4" />
                          Print
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCopy}>
                          {copied ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy Data
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
                <CardDescription>Barcode format guidelines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Barcode Formats</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• EAN-13: 13 digits</p>
                    <p>• UPC-A: 12 digits</p>
                    <p>• Code 128: Alphanumeric</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">QR Code Uses</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• Product URLs</p>
                    <p>• Contact information</p>
                    <p>• Payment links</p>
                    <p>• Text data</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Best Practices</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>• Use high contrast</p>
                    <p>• Maintain quiet zones</p>
                    <p>• Test before printing</p>
                    <p>• Keep data concise</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recently Generated</CardTitle>
              <CardDescription>Your barcode generation history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : generatedBarcodes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No barcodes generated yet. Create your first barcode above!
                  </div>
                ) : (
                  generatedBarcodes.map((barcode) => (
                    <div
                      key={barcode.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                          {barcode.barcode_type === "barcode" ? (
                            <BarcodeIcon className="h-6 w-6 text-blue-500" />
                          ) : (
                            <QrCode className="h-6 w-6 text-green-500" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{barcode.product_name}</h3>
                            <Badge variant="outline">
                              {barcode.barcode_type === "barcode" ? "Barcode" : "QR Code"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>SKU: {barcode.sku}</span>
                            <span>•</span>
                            <span>{barcode.price || 'N/A'}</span>
                            <span>•</span>
                            <span>{new Date(barcode.created_at).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {barcode.image_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(barcode.image_url!, '_blank')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            if (barcode.image_url) {
                              const printWindow = window.open('', '_blank');
                              if (printWindow) {
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Print Barcode</title>
                                      <style>
                                        body { margin: 0; padding: 20px; text-align: center; }
                                        img { max-width: 100%; }
                                      </style>
                                    </head>
                                    <body>
                                      <img src="${barcode.image_url}" />
                                      <script>window.print(); window.close();</script>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }
                            }
                          }}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
