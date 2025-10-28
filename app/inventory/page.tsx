"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Search,
  Package,
  AlertTriangle,
  MapPin,
  Minus,
  Edit2,
  Check,
  X,
  Filter,
  Loader2,
} from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import supabase from "@/utils/supabase/client";

type Product = {
  id: string;
  name: string;
  sku: string;
  is_active: boolean;
  unit_price: number;
  cost_price?: number;
  category?: string;
  brand?: string;
  description?: string;
  image_url?: string;
  barcode?: string;
};

type Warehouse = {
  id: string;
  name: string;
  location: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  is_active: boolean;
};

type Inventory = {
  id: string;
  product_id: string;
  quantity_in_stock: number;
  reorder_level: number;
  reorder_quantity: number;
  warehouse_location: string | null;
  warehouse_id: string | null;
  last_restocked_at: string | null;
  products?: Product;
  warehouses?: Warehouse;
};

export default function InventoryPage() {
    const [inventory, setInventory] = useState<Inventory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [manualQuantity, setManualQuantity] = useState("");

  // Create inventory dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantityInStock, setQuantityInStock] = useState("");
  const [reorderLevel, setReorderLevel] = useState("10");
  const [reorderQuantity, setReorderQuantity] = useState("50");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchInventory = async () => {
    try {
      console.log('Fetching inventory data...');
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
      
      const { data, error } = await supabase
        .from("inventory")
        .select(`
          *,
          products (
            id,
            name,
            sku,
            is_active,
            unit_price,
            category,
            brand,
            description,
            image_url,
            barcode
          ),
          warehouses (
            id,
            name,
            location,
            address,
            city,
            state,
            is_active
          )
        `)
        .order("quantity_in_stock", { ascending: true });

      if (error) {
        console.error('Supabase inventory error:', error);
        throw error;
      }
      console.log('Inventory data fetched:', data);
      console.log('Number of items:', data?.length || 0);
      
      // Filter out inventory items with inactive products
      const activeInventory = (data || []).filter(item => 
        item.products && item.products.is_active !== false
      );
      console.log('Active inventory items:', activeInventory.length);
      
      setInventory(activeInventory);
      setErrorMessage('');
    } catch (error: any) {
      console.error("Error fetching inventory:", error);
      setErrorMessage(error.message || 'Failed to fetch inventory');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products data...');
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, is_active, unit_price, category, brand, description, image_url, barcode")
        .eq("is_active", true)
        .order("name");

      if (error) {
        console.error('Supabase products error:', error);
        throw error;
      }
      console.log('Products data fetched:', data);
      console.log('Number of active products:', data?.length || 0);
      setProducts(data || []);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setErrorMessage(`Failed to fetch products: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const updateStockQuantity = async (item: Inventory, delta: number) => {
    try {
      setUpdatingItems((prev) => new Set(prev).add(item.id));

      const newQuantity = Math.max(0, item.quantity_in_stock + delta);

      const { error } = await supabase
        .from("inventory")
        .update({ quantity_in_stock: newQuantity })
        .eq("id", item.id);

      if (error) throw error;

      setInventory((prev) =>
        prev.map((inv) =>
          inv.id === item.id ? { ...inv, quantity_in_stock: newQuantity } : inv
        )
      );
    } catch (error) {
      console.error("Error updating stock quantity:", error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const startManualEdit = (item: Inventory) => {
    setEditingItemId(item.id);
    setManualQuantity(item.quantity_in_stock.toString());
  };

  const cancelManualEdit = () => {
    setEditingItemId(null);
    setManualQuantity("");
  };

  const saveManualQuantity = async (item: Inventory) => {
    try {
      const newQuantity = parseInt(manualQuantity, 10);
      if (isNaN(newQuantity) || newQuantity < 0) {
        console.error("Invalid quantity");
        return;
      }

      setUpdatingItems((prev) => new Set(prev).add(item.id));

      const { error } = await supabase
        .from("inventory")
        .update({ quantity_in_stock: newQuantity })
        .eq("id", item.id);

      if (error) throw error;

      setInventory((prev) =>
        prev.map((inv) =>
          inv.id === item.id ? { ...inv, quantity_in_stock: newQuantity } : inv
        )
      );

      setEditingItemId(null);
      setManualQuantity("");
    } catch (error) {
      console.error("Error updating stock quantity:", error);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleCreateInventory = async () => {
    if (!selectedProduct || !quantityInStock) {
      setErrorMessage("Product and quantity are required");
      return;
    }

    setCreateLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await supabase.from("inventory").insert({
        product_id: selectedProduct,
        quantity_in_stock: parseInt(quantityInStock),
        reorder_level: parseInt(reorderLevel),
        reorder_quantity: parseInt(reorderQuantity),
        warehouse_location: warehouseLocation || null,
        last_restocked_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccessMessage("Inventory created successfully");
      setTimeout(() => {
        setIsCreateDialogOpen(false);
        fetchInventory();
        // Reset form
        setSelectedProduct("");
        setQuantityInStock("");
        setReorderLevel("10");
        setReorderQuantity("50");
        setWarehouseLocation("");
        setSuccessMessage("");
      }, 1500);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to create inventory");
    } finally {
      setCreateLoading(false);
    }
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.products?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.products?.sku.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStock = true;
    if (stockFilter === "low_stock") {
      matchesStock =
        item.quantity_in_stock <= item.reorder_level &&
        item.quantity_in_stock > 0;
    } else if (stockFilter === "out_of_stock") {
      matchesStock = item.quantity_in_stock === 0;
    } else if (stockFilter === "in_stock") {
      matchesStock = item.quantity_in_stock > item.reorder_level;
    }

    return matchesSearch && matchesStock;
  });

  const lowStockItems = filteredInventory.filter(
    (item) => item.quantity_in_stock <= item.reorder_level
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 space-y-6 p-8 overflow-auto bg-gray-50">
          {/* Error Message */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Inventory Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Track and manage your stock levels
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Inventory
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Inventory</DialogTitle>
                  <DialogDescription>
                    Add a new product to your inventory
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert>
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="product">Select Product *</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {products.length === 0 ? (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                              No active products available
                            </div>
                          ) : (
                            products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} ({product.sku})
                              </SelectItem>
                            ))
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity in Stock *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Enter quantity"
                      value={quantityInStock}
                      onChange={(e) => setQuantityInStock(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reorder-level">Reorder Level</Label>
                      <Input
                        id="reorder-level"
                        type="number"
                        placeholder="10"
                        value={reorderLevel}
                        onChange={(e) => setReorderLevel(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reorder-quantity">Reorder Quantity</Label>
                      <Input
                        id="reorder-quantity"
                        type="number"
                        placeholder="50"
                        value={reorderQuantity}
                        onChange={(e) => setReorderQuantity(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Warehouse Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Aisle 3, Shelf B"
                      value={warehouseLocation}
                      onChange={(e) => setWarehouseLocation(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={handleCreateInventory}
                    disabled={createLoading}
                  >
                    {createLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Add Inventory"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Total Items
                </span>
              </div>
              <div className="text-2xl font-bold">{inventory.length}</div>
            </Card>

            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Low Stock Items
                </span>
              </div>
              <div className="text-2xl font-bold">{lowStockItems.length}</div>
            </Card>

            <Card className="p-4 space-y-2 transition-all hover:shadow-md">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Out of Stock
                </span>
              </div>
              <div className="text-2xl font-bold">
                {inventory.filter((item) => item.quantity_in_stock === 0).length}
              </div>
            </Card>
          </div>

          {/* Debug Info - Remove this after testing */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900">Debug Info:</p>
                <div className="grid grid-cols-2 gap-x-4">
                  <p className="text-xs text-blue-700">Inventory Count: {inventory.length}</p>
                  <p className="text-xs text-blue-700">Products Count: {products.length}</p>
                  <p className="text-xs text-blue-700">Filtered Count: {filteredInventory.length}</p>
                  <p className="text-xs text-blue-700">Loading: {loading ? 'Yes' : 'No'}</p>
                </div>
                {inventory.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold">First Item Details:</p>
                    <p className="text-xs text-blue-700">• Product: {inventory[0].products?.name || 'No product name'}</p>
                    <p className="text-xs text-blue-700">• SKU: {inventory[0].products?.sku || 'N/A'}</p>
                    <p className="text-xs text-blue-700">• Active: {inventory[0].products?.is_active ? 'Yes' : 'No'}</p>
                    <p className="text-xs text-blue-700">• Stock: {inventory[0].quantity_in_stock}</p>
                    <p className="text-xs text-blue-700">• Warehouse: {inventory[0].warehouses?.name || inventory[0].warehouse_location || 'No warehouse'}</p>
                  </div>
                )}
                {products.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-blue-200">
                    <p className="text-xs text-blue-700 font-semibold">Sample Products:</p>
                    {products.slice(0, 3).map((p, i) => (
                      <p key={p.id} className="text-xs text-blue-700">• {p.name} ({p.sku})</p>
                    ))}
                  </div>
                )}
                {errorMessage && (
                  <p className="text-xs text-red-700 font-semibold mt-2">Error: {errorMessage}</p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setLoading(true);
                  fetchInventory();
                  fetchProducts();
                }}
              >
                Refresh Data
              </Button>
            </div>
          </Card>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search inventory..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="All Items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockItems.length > 0 && (
            <Alert className="border-orange-300 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <span className="font-semibold">Low Stock Alert:</span>{" "}
                {lowStockItems.length} items need restocking
              </AlertDescription>
            </Alert>
          )}

          {/* Inventory Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredInventory.length === 0 ? (
              <Card className="col-span-full p-8 text-center">
                <p className="text-xl text-muted-foreground">
                  No inventory items found
                </p>
              </Card>
            ) : (
              filteredInventory.map((item) => (
                <Card
                  key={item.id}
                  className="p-4 space-y-3 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">
                        {item.products?.name || "Unknown Product"}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        SKU: {item.products?.sku || "N/A"}
                      </p>
                      {(item.products?.category || item.products?.brand) && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {item.products?.brand && `${item.products.brand}`}
                          {item.products?.brand && item.products?.category && " • "}
                          {item.products?.category && `${item.products.category}`}
                        </p>
                      )}
                    </div>
                    {item.quantity_in_stock <= item.reorder_level && (
                      <Badge variant="destructive" className="ml-2">
                        Low Stock
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-end justify-between pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        In Stock
                      </p>
                      {editingItemId === item.id ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="number"
                            value={manualQuantity}
                            onChange={(e) => setManualQuantity(e.target.value)}
                            className="w-20 h-9 text-center"
                          />
                          <Button
                            size="icon"
                            variant="default"
                            className="h-8 w-8 bg-green-600 hover:bg-green-700"
                            onClick={() => saveManualQuantity(item)}
                            disabled={updatingItems.has(item.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={cancelManualEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8"
                            onClick={() => updateStockQuantity(item, -1)}
                            disabled={
                              item.quantity_in_stock === 0 ||
                              updatingItems.has(item.id)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span
                            className={`text-xl font-bold min-w-[40px] text-center ${
                              item.quantity_in_stock <= item.reorder_level
                                ? "text-red-600"
                                : "text-gray-900"
                            }`}
                          >
                            {updatingItems.has(item.id)
                              ? "..."
                              : item.quantity_in_stock}
                          </span>
                          <Button
                            size="icon"
                            variant="default"
                            className="h-8 w-8 bg-green-600 hover:bg-green-700"
                            onClick={() => updateStockQuantity(item, 1)}
                            disabled={updatingItems.has(item.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={() => startManualEdit(item)}
                            disabled={updatingItems.has(item.id)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Reorder Level
                      </p>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">
                        {item.reorder_level}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Reorder Qty
                      </p>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">
                        {item.reorder_quantity}
                      </p>
                    </div>
                  </div>

                  {(item.warehouses?.name || item.warehouse_location) && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <MapPin className="h-4 w-4 text-primary" />
                      <p className="text-xs text-gray-600">
                        {item.warehouses?.name || item.warehouse_location}
                        {item.warehouses?.location && ` - ${item.warehouses.location}`}
                      </p>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
