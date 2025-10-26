-- Create activity_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  ip_address text,
  user_agent text,
  changed_from jsonb,
  changed_to jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id),
  CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- Add columns if table exists but missing columns
ALTER TABLE public.activity_logs 
ADD COLUMN IF NOT EXISTS changed_from jsonb;

ALTER TABLE public.activity_logs 
ADD COLUMN IF NOT EXISTS changed_to jsonb;

ALTER TABLE public.activity_logs 
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_created 
ON public.activity_logs(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_activity_logs_action 
ON public.activity_logs(action);

CREATE INDEX IF NOT EXISTS idx_activity_logs_entity 
ON public.activity_logs(entity_type, entity_id);

-- Enable Row Level Security
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own activity logs
CREATE POLICY "Users can view own activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (auth.uid()::uuid = user_id);

-- Users can insert their own activity logs
CREATE POLICY "Users can insert own activity logs" 
ON public.activity_logs 
FOR INSERT 
WITH CHECK (auth.uid()::uuid = user_id);

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs" 
ON public.activity_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid()::uuid 
    AND role = 'admin'
  )
);

-- Verify the table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'activity_logs'
ORDER BY ordinal_position;
