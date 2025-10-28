import { createClient } from './supabase';

type LogActivityParams = {
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, any>;
};

export const logActivity = async (params: LogActivityParams): Promise<void> => {
  try {
    const supabase = createClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    const { error } = await supabase.rpc('log_activity', {
      p_action: params.action,
      p_entity_type: params.entityType || null,
      p_entity_id: params.entityId || null,
      p_metadata: params.metadata || null
    } as any);
    
    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// Common activity types
export const ActivityActions = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE_UPDATE: 'profile_update',
  PASSWORD_CHANGE: 'password_change',
  SETTINGS_UPDATE: 'settings_update',
  SESSION_REVOKED: 'session_revoked'
} as const;
