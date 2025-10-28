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
    } catch (error) {
      console.error("Error fetching inventory:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch inventory';
      setErrorMessage(errorMessage);
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredInventory.length === 0 ? (
              <Card className="col-span-full p-12 text-center">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-xl font-medium text-muted-foreground">
                  No inventory items found
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try adjusting your search or filters
                </p>
              </Card>
            ) : (
              filteredInventory.map((item) => (
                <Card
                  key={item.id}
                  className="group relative overflow-hidden border-2 hover:border-primary/50 hover:shadow-lg transition-all duration-200"
                >
                  {/* Header Section */}
                  <div className="p-5 pb-4 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-primary transition-colors">
                          {item.products?.name || "Unknown Product"}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant="outline" className="text-xs font-mono">
                            {item.products?.sku || "N/A"}
                          </Badge>
                        </div>
                        {(item.products?.category || item.products?.brand) && (
                          <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                            {item.products?.brand && (
                              <span className="font-medium">{item.products.brand}</span>
                            )}
                            {item.products?.brand && item.products?.category && (
                              <span>•</span>
                            )}
                            {item.products?.category && (
                              <span>{item.products.category}</span>
                            )}
                          </div>
                        )}
                      </div>
                      {item.quantity_in_stock <= item.reorder_level && (
                        <Badge 
                          variant="destructive" 
                          className="shrink-0 shadow-sm"
                        >
                          {item.quantity_in_stock === 0 ? "Out" : "Low"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Stock Control Section */}
                  <div className="px-5 py-4 border-t bg-white">
                    <div className="space-y-4">
                      {/* Stock Quantity */}
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                          Stock Quantity
                        </p>
                        {editingItemId === item.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={manualQuantity}
                              onChange={(e) => setManualQuantity(e.target.value)}
                              className="h-10 text-center font-bold text-lg"
                              autoFocus
                            />
                            <Button
                              size="icon"
                              className="h-10 w-10 bg-green-600 hover:bg-green-700 shrink-0"
                              onClick={() => saveManualQuantity(item)}
                              disabled={updatingItems.has(item.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-10 w-10 shrink-0"
                              onClick={cancelManualEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-10 w-10 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                              onClick={() => updateStockQuantity(item, -1)}
                              disabled={
                                item.quantity_in_stock === 0 ||
                                updatingItems.has(item.id)
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 text-center">
                              <span
                                className={`text-3xl font-bold ${
                                  item.quantity_in_stock === 0
                                    ? "text-red-600"
                                    : item.quantity_in_stock <= item.reorder_level
                                    ? "text-orange-600"
                                    : "text-gray-900"
                                }`}
                              >
                                {updatingItems.has(item.id)
                                  ? "..."
                                  : item.quantity_in_stock}
                              </span>
                            </div>
                            <Button
                              size="icon"
                              className="h-10 w-10 bg-green-600 hover:bg-green-700"
                              onClick={() => updateStockQuantity(item, 1)}
                              disabled={updatingItems.has(item.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-10 w-10 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                              onClick={() => startManualEdit(item)}
                              disabled={updatingItems.has(item.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Reorder Info */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Reorder Level
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {item.reorder_level}
                          </p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                            Reorder Qty
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {item.reorder_quantity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Warehouse Location */}
                  {(item.warehouses?.name || item.warehouse_location) && (
                    <div className="px-5 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-t">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600 shrink-0" />
                        <p className="text-sm font-medium text-blue-900 truncate">
                          {item.warehouses?.name || item.warehouse_location}
                        </p>
                      </div>
                      {item.warehouses?.location && (
                        <p className="text-xs text-blue-700 ml-6 mt-0.5">
                          {item.warehouses.location}
                        </p>
                      )}
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
