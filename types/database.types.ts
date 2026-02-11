// Re-export the auto-generated Database type from Supabase
// Generated: 2026-02-11
// Source: supabase.generated.ts (full auto-generated types for all 270+ tables)

export type { Database } from './supabase.generated';
import type { Database } from './supabase.generated';

// Re-export Json type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ============================================================
// Enum Types (updated to match current Supabase schema)
// ============================================================
export type UserRole = Database['public']['Enums']['user_role'];
export type OrderStatus = Database['public']['Enums']['order_status'];
export type InvoiceStatus = Database['public']['Enums']['invoice_status'];
export type PaymentStatus = Database['public']['Enums']['payment_status'];
export type DeliveryStatus = Database['public']['Enums']['delivery_status'];
export type BusinessTypeEnum = Database['public']['Enums']['business_type_enum'];
export type CashSalePaymentStatus = Database['public']['Enums']['cash_sale_payment_status'];
export type DeliveryType = Database['public']['Enums']['delivery_type'];
export type ExpenseCategory = Database['public']['Enums']['expense_category'];
export type ExpenseStatus = Database['public']['Enums']['expense_status'];
export type InvoicePaymentStatus = Database['public']['Enums']['invoice_payment_status'];
export type InvoiceTypeEnum = Database['public']['Enums']['invoice_type_enum'];
export type OrderCategory = Database['public']['Enums']['order_category'];
export type SupplyTypeEnum = Database['public']['Enums']['supply_type_enum'];

// ============================================================
// Table Name Type
// ============================================================
export type TableName = keyof Database['public']['Tables'];

// ============================================================
// Row Types (convenience aliases for Database['public']['Tables'][X]['Row'])
// ============================================================
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Product = Database['public']['Tables']['products']['Row'];
export type Retailer = Database['public']['Tables']['retailers']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderItem = Database['public']['Tables']['order_items']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type Payment = Database['public']['Tables']['payments']['Row'];
export type SameDayPayment = Database['public']['Tables']['same_day_payments']['Row'];
export type Delivery = Database['public']['Tables']['deliveries']['Row'];
export type Inventory = Database['public']['Tables']['inventory']['Row'];
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
export type Warehouse = Database['public']['Tables']['warehouses']['Row'];
export type Customer = Database['public']['Tables']['customers']['Row'];
export type Staff = Database['public']['Tables']['staff']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Subcategory = Database['public']['Tables']['subcategories']['Row'];
export type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];
export type InvoicePayment = Database['public']['Tables']['invoice_payments']['Row'];
export type CashSale = Database['public']['Tables']['cash_sales']['Row'];
export type Wholesaler = Database['public']['Tables']['wholesalers']['Row'];

// ============================================================
// Insert Types
// ============================================================
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type RetailerInsert = Database['public']['Tables']['retailers']['Insert'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type PaymentInsert = Database['public']['Tables']['payments']['Insert'];
export type DeliveryInsert = Database['public']['Tables']['deliveries']['Insert'];
export type InventoryInsert = Database['public']['Tables']['inventory']['Insert'];
export type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert'];

// ============================================================
// Relation Types (for queries with joins)
// ============================================================
export type OrderWithRelations = Order & {
  retailer?: Retailer | null;
  items?: Array<OrderItem & { product?: Product | null }>;
};

export type InvoiceWithRelations = Invoice & {
  retailer?: Retailer | null;
  order?: Order | null;
  payments?: Payment[];
};

export type PaymentWithRelations = Payment & {
  retailer?: Retailer | null;
  invoice?: Invoice | null;
};

export type DeliveryWithRelations = Delivery & {
  order?: Order | null;
};

export type InventoryWithRelations = Inventory & {
  product?: Product | null;
};

export type SameDayPaymentWithRelations = SameDayPayment & {
  payment?: Payment | null;
  approver?: Profile | null;
};

export type ActivityLogWithRelations = ActivityLog & {
  user?: Profile | null;
};
