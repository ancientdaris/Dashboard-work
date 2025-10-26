/// <reference types="@supabase/supabase-js" />

declare module '@/lib/supabase/client' {
  import { SupabaseClient } from '@supabase/supabase-js';
  
  export const createClient: () => SupabaseClient;
}
