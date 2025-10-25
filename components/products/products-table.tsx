'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { Edit, Trash2, Eye, Package, Plus } from 'lucide-react';

type Product = {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string | null;
  brand: string | null;
  unit_price: number;
  cost_price: number | null;
  tax_rate: number | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  hsn_code: string | null;
  sac_code: string | null;
  expiry_date: string | null;
  batch_tracking_enabled: boolean;
  barcode: string | null;
  weight: number | null;
  dimensions: any;
  is_dead_stock: boolean;
  dead_stock_discount: number | null;
  dead_stock_listed_at: string | null;
};

interface ProductsTableProps {
  searchTerm: string;
}

export function ProductsTable({ searchTerm }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 10;
  const supabase = createClient();

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,sku.ilike.%${searchTerm}%,barcode.eq.${searchTerm}`);
      }

      const { data, count, error } = await query;

      if (error) throw error;

      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Refresh the products list
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  if (loading && products.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 w-full animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-10 w-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.brand}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{product.category || '-'}</TableCell>
                  <TableCell className="text-right">
                    ₹{product.unit_price.toFixed(2)}
                    {product.is_dead_stock && product.dead_stock_discount && (
                      <div className="text-xs text-gray-500 line-through">
                        ₹{(product.unit_price / (1 - product.dead_stock_discount / 100)).toFixed(2)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {product.is_dead_stock && (
                      <Badge variant="destructive" className="ml-2">
                        Dead Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.batch_tracking_enabled ? 'Tracked' : 'Not Tracked'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(product.updated_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">{(page - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min(page * itemsPerPage, totalCount)}
            </span>{' '}
            of <span className="font-medium">{totalCount}</span> products
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
