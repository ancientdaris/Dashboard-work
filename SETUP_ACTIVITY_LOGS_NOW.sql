-- ============================================
-- CRITICAL: RUN THIS IN SUPABASE SQL EDITOR NOW
-- This will create the activity_logs table
-- ============================================

-- Step 1: Create the table
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- Step 3: Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop old policies if they exist
DROP POLICY IF EXISTS "Users can view their own activity logs" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can insert their own activity logs" ON public.activity_logs;

-- Step 5: Create policies
CREATE POLICY "Users can view their own activity logs"
ON public.activity_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity logs"
ON public.activity_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Step 6: Test insert (this will insert a test log for the current user)
INSERT INTO public.activity_logs (user_id, action, metadata)
VALUES (
  auth.uid(), 
  'test_setup', 
  jsonb_build_object('message', 'Activity logs table created successfully', 'timestamp', NOW())
);

-- Step 7: Verify the insert worked
SELECT 
  id,
  action,
  metadata,
  created_at
FROM public.activity_logs
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 1;

-- If you see the test_setup log above, the table is working! ✅
