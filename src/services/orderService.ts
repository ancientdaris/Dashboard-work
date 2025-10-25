import { fetchTableData, fetchById, insertRecord, updateRecord, deleteRecord } from '@/lib/supabase/db';
import type { Database } from '@/types/database.types';
type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderItem = Database['public']['Tables']['order_items']['Row'];
type OrderStatus = Database['public']['Enums']['order_status'];
type Retailer = Database['public']['Tables']['retailers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

const TABLES = {
  ORDERS: 'orders' as const,
  ORDER_ITEMS: 'order_items' as const,
} as const;

type OrderWithRelations = Order & {
  retailer: Retailer;
  items: Array<OrderItem & { product: Product }>;
};

export async function getOrders(
  filters: Partial<Order> = {},
  options: {
    limit?: number;
    offset?: number;
    orderBy?: { column: keyof Order; ascending: boolean };
  } = {}
): Promise<{ data: OrderWithRelations[] | null; error: Error | null }> {
  return fetchTableData(
    TABLES.ORDERS,
    {
      columns: '*, retailer:retailers(*), items:order_items(*, product:products(*))',
      filters,
      ...options,
    }
  ) as Promise<{ data: OrderWithRelations[] | null; error: Error | null }>;
}

export async function getOrderById(
  id: string
): Promise<{ data: OrderWithRelations | null; error: Error | null }> {
  return fetchById(
    TABLES.ORDERS,
    id,
    '*, retailer:retailers(*), items:order_items(*, product:products(*))'
  ) as Promise<{ data: OrderWithRelations | null; error: Error | null }>;
}

export async function createOrder(orderData: {
  order_number: string;
  retailer_id: string;
  status: OrderStatus;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  notes?: string;
  created_by: string;
  items: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    discount_amount: number;
    line_total: number;
  }>;
}): Promise<{ data: OrderWithRelations | null; error: Error | null }> {
  const { items, ...order } = orderData;
  
  try {
    // Insert the order
    const { data: orderResult, error } = await insertRecord(
      'orders',
      order as Omit<OrderInsert, 'id' | 'created_at' | 'updated_at'>
    );
    
    if (error || !orderResult) {
      return { data: null, error: error || new Error('Failed to create order') };
    }
    
    // Add order items
    const orderItems = items.map(item => ({
      ...item,
      order_id: orderResult.id,
    }));
    
    const results = await Promise.all(
      orderItems.map(item => 
        insertRecord('order_items', item as Omit<OrderItem, 'id' | 'created_at' | 'updated_at'>)
      )
    );
    
    const itemsError = results.find(r => r.error)?.error || null;
    
    if (itemsError) {
      // In a real app, you might want to delete the order if items can't be added
      return { data: null, error: itemsError };
    }
    
    // Fetch the complete order with all relations
    return getOrderById(orderResult.id);
  } catch (error) {
    console.error('Error in createOrder:', error);
    return { data: null, error: error as Error };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ data: Order | null; error: Error | null }> {
  return updateRecord(
    TABLES.ORDERS,
    orderId,
    { 
      status,
      updated_at: new Date().toISOString()
    } as Partial<Order>
  );
}

export async function deleteOrder(
  orderId: string
): Promise<{ error: Error | null }> {
  try {
    // First, delete order items
    const { error: itemsError } = await deleteRecord(TABLES.ORDER_ITEMS, orderId);
    
    if (itemsError) {
      return { error: itemsError };
    }
    
    // Then delete the order
    return deleteRecord(TABLES.ORDERS, orderId);
  } catch (error) {
    console.error('Error in deleteOrder:', error);
    return { error: error as Error };
  }
}

export async function getOrdersByRetailer(
  retailerId: string,
  status?: OrderStatus
): Promise<{ data: OrderWithRelations[] | null; error: Error | null }> {
  const filters: Record<string, unknown> = { retailer_id: retailerId };
  
  if (status) {
    filters.status = status;
  }
  
  return fetchTableData(
    TABLES.ORDERS,
    {
      columns: '*, items:order_items(*, product:products(*))',
      filters,
      orderBy: { column: 'created_at', ascending: false },
    }
  ) as Promise<{ data: OrderWithRelations[] | null; error: Error | null }>;
}

export async function getOrderItems(
  orderId: string
): Promise<{ data: Array<OrderItem & { product: Product }> | null; error: Error | null }> {
  return fetchTableData(
    TABLES.ORDER_ITEMS,
    {
      columns: '*, product:products(*)',
      filters: { order_id: orderId }
    }
  ) as Promise<{ data: Array<OrderItem & { product: Product }> | null; error: Error | null }>;
}
