'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { format } from 'date-fns';
import { Activity, Clock, User, HardDrive, Globe, Smartphone } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  } | null;
}

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('activity_logs')
          .select(`
            *,
            profiles (full_name, email)
          `)
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1);

        if (fetchError) throw fetchError;
        
        setLogs(data || []);
      } catch (err) {
        console.error('Error fetching activity logs:', err);
        setError('Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, [page]);

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'create':
        return <Activity className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Activity className="h-4 w-4 text-yellow-500" />;
      case 'delete':
        return <Activity className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeviceIcon = (userAgent: string | null) => {
    if (!userAgent) return null;
    
    if (userAgent.includes('Mobile')) {
      return <Smartphone className="h-4 w-4 text-gray-400" />;
    }
    return <HardDrive className="h-4 w-4 text-gray-400" />;
  };

  if (loading && logs.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (logs.length === 0) {
    return <div className="text-muted-foreground text-center py-8">No activity logs found</div>;
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-accent">
                  {getActionIcon(log.action)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium capitalize">
                      {log.action.replace(/_/g, ' ')}
                    </span>
                    {log.entity_type && (
                      <span className="text-sm text-muted-foreground">
                        {log.entity_type}
                        {log.entity_id && `#${log.entity_id.substring(0, 4)}`}
                      </span>
                    )}
                  </div>
                  
                  {log.profiles && (
                    <div className="text-sm text-muted-foreground">
                      {log.profiles.full_name || log.profiles.email}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}</span>
                    </div>
                    
                    {log.ip_address && (
                      <div className="flex items-center space-x-1">
                        <Globe className="h-3 w-3" />
                        <span>{log.ip_address}</span>
                      </div>
                    )}
                    
                    {log.user_agent && (
                      <div className="flex items-center space-x-1">
                        {getDeviceIcon(log.user_agent)}
                        <span>
                          {log.user_agent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <details>
                    <summary className="cursor-pointer hover:underline">Details</summary>
                    <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-w-xs">
                      {JSON.stringify(log.metadata, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm rounded-md border disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          Page {page}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={logs.length < pageSize}
          className="px-4 py-2 text-sm rounded-md border disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
