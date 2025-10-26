'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
const supabase = createClient();
import { format, formatDistanceToNow } from 'date-fns';
import { Activity, Clock, User, HardDrive, Globe, Smartphone, RefreshCw } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { Button } from '../../components/ui/button';
import { toast } from '../../components/ui/use-toast';

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  profiles?: {
    full_name?: string | null;
    email?: string | null;
  } | null;
}

export function ActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  
  const fetchActivityLogs = useCallback(async (refresh = false) => {
    try {
      setLoading(true);
      const currentPage = refresh ? 1 : page;
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        setError('Please sign in to view activity logs');
        setLoading(false);
        return;
      }

      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, count, error: fetchError } = await supabase
        .from('activity_logs')
        .select('*, profiles (full_name, email)', { count: 'exact' })
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (fetchError) throw fetchError;
      
      if (refresh || currentPage === 1) {
        setLogs(data || []);
      } else {
        setLogs(prev => [...prev, ...(data || [])]);
      }
      
      setHasMore((count || 0) > currentPage * pageSize);
      if (refresh) {
        setPage(1);
      }
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      setError('Failed to load activity logs');
      toast({
        title: 'Error',
        description: 'Failed to load activity logs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);
  
  useEffect(() => {
    fetchActivityLogs();
  }, [fetchActivityLogs]);

  useEffect(() => {
    const fetchActivityLogs = async (refresh = false) => {
      try {
        setLoading(true);
        if (refresh) {
          setPage(1);
          setLogs([]);
        }
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          setError('Please sign in to view activity logs');
          setLoading(false);
          return;
        }

        const from = (page - 1) * pageSize;
        const to = from + pageSize - 1;
        
        const { data, count, error: fetchError } = await supabase
          .from('activity_logs')
          .select('*, profiles (full_name, email)', { count: 'exact' })
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .range(from, to);

        if (fetchError) throw fetchError;
        
        if (refresh) {
          setLogs(data || []);
        } else {
          setLogs(prev => [...prev, ...(data || [])]);
        }
        
        setHasMore((count || 0) > page * pageSize);
      } catch (err) {
        console.error('Error fetching activity logs:', err);
        setError('Failed to load activity logs');
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, [page, pageSize]);

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

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const refreshLogs = () => {
    fetchActivityLogs(true);
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
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          <p className="font-medium">Error loading activity logs</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  const getActionText = (log: ActivityLog) => {
    const userName = log.profiles?.full_name || log.profiles?.email?.split('@')[0] || 'User';
    
    switch (log.action) {
      case 'login':
        return `${userName} logged in`;
      case 'logout':
        return `${userName} logged out`;
      case 'profile_update':
        return `${userName} updated their profile`;
      case 'password_change':
        return `${userName} changed their password`;
      case 'settings_update':
        return `${userName} updated their settings`;
      case 'session_revoked':
        return `Session was revoked for ${userName}`;
      default:
        return `${userName} performed ${log.action} action`;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshLogs}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Recent Activity</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={refreshLogs}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      <div className="space-y-2">
        {logs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No activity logs found</p>
          <p className="text-sm">Your activities will appear here</p>
        </div>
        ) : (
          logs.map((log: ActivityLog) => (
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
        logs.map((log) => (
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
