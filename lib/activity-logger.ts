import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/database.types';

export type ActivityAction = 
  | 'login' 
  | 'logout' 
  | 'signup'
  | 'password_reset'
  | 'profile_update'
  | 'create'
  | 'update'
  | 'delete';

interface LogActivityParams {
  action: ActivityAction;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

type ActivityLogInsert = Database['public']['Tables']['activity_logs']['Insert'];

/**
 * Logs user activity to the activity_logs table
 */
export async function logActivity({
  action,
  entityType,
  entityId,
  metadata,
}: LogActivityParams): Promise<void> {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Cannot log activity: No authenticated user');
      return;
    }

    // Get user agent and IP (IP will be null on client-side, but that's okay)
    const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : null;

    // Insert activity log
    const logData: ActivityLogInsert = {
      user_id: user.id,
      action,
      entity_type: entityType || null,
      entity_id: entityId || null,
      metadata: metadata || null,
      user_agent: userAgent,
      ip_address: null, // Will be captured by database trigger or backend
      changed_from: {},
      changed_to: {}
    };

    const { error, data } = await supabase
      .from('activity_logs')
      .insert(logData)
      .select();

    if (error) {
      console.error('❌ Failed to log activity:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
    } else {
      console.log('✅ Activity logged successfully:', data);
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}
