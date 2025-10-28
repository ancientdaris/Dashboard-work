-- Test queries to check if data exists and RLS policies

-- Check if inventory table has data
SELECT COUNT(*) as inventory_count FROM public.inventory;

-- Check if products table has data
SELECT COUNT(*) as products_count FROM public.products WHERE is_active = true;

-- Check if warehouses table has data
SELECT COUNT(*) as warehouses_count FROM public.warehouses;

-- Sample inventory data with joins
SELECT 
  i.id,
  i.quantity_in_stock,
  i.reorder_level,
  i.warehouse_location,
  p.name as product_name,
  p.sku,
  w.name as warehouse_name,
  w.location as warehouse_location_full
FROM public.inventory i
LEFT JOIN public.products p ON i.product_id = p.id
LEFT JOIN public.warehouses w ON i.warehouse_id = w.id
LIMIT 5;

-- Check RLS policies on inventory table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'inventory';

-- Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename IN ('inventory', 'products', 'warehouses');
