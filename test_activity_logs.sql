-- ============================================
-- TEST ACTIVITY LOGS
-- Run these queries to check if everything works
-- ============================================

-- 1. Check if table exists and view structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'activity_logs'
ORDER BY ordinal_position;

-- 2. Check RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'activity_logs';

-- 3. View all policies on activity_logs
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'activity_logs';

-- 4. Check indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'activity_logs'
  AND schemaname = 'public';

-- 5. Count existing logs (will only show your own logs due to RLS)
SELECT COUNT(*) as total_logs FROM public.activity_logs;

-- 6. View your recent activity logs (last 10)
SELECT 
  id,
  action,
  entity_type,
  entity_id,
  metadata,
  ip_address,
  user_agent,
  created_at
FROM public.activity_logs
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;

-- 7. Test manual insert (should work if you're authenticated)
-- Uncomment to test:
/*
INSERT INTO public.activity_logs (
  user_id, 
  action, 
  metadata
) VALUES (
  auth.uid(), 
  'manual_test', 
  '{"source": "sql_editor", "timestamp": "' || NOW()::text || '"}'::jsonb
);
*/

-- 8. After running the insert above, check if it worked:
-- SELECT * FROM public.activity_logs WHERE action = 'manual_test' ORDER BY created_at DESC LIMIT 1;

-- 9. Check for any foreign key constraints
SELECT
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'activity_logs';

-- 10. View activity logs with user profile info (if profiles table exists)
SELECT 
  al.id,
  al.action,
  al.entity_type,
  al.created_at,
  p.email,
  p.full_name
FROM public.activity_logs al
LEFT JOIN public.profiles p ON al.user_id = p.id
WHERE al.user_id = auth.uid()
ORDER BY al.created_at DESC
LIMIT 10;
