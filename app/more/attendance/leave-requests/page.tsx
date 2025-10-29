'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar,
  Check,
  X,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface LeaveRequest {
  id: string;
  staff_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  staff: {
    employee_id: string;
    user: {
      full_name: string;
    };
  };
}

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          staff:staff(
            employee_id,
            user:profiles(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leave requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status } : req
      ));

      toast({
        title: 'Success',
        description: `Leave request ${status}`,
      });
    } catch (error) {
      console.error('Error updating leave status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update leave status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredRequests = requests.filter(req => req.status === activeTab);

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="container p-4 md:p-8 max-w-7xl">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Link href="/more/attendance">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Leave Requests
                  </h1>
                  <p className="text-muted-foreground">
                    Manage employee leave applications
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="mb-6">
                  <TabsTrigger value="pending">
                    Pending ({requests.filter(r => r.status === 'pending').length})
                  </TabsTrigger>
                  <TabsTrigger value="approved">
                    Approved ({requests.filter(r => r.status === 'approved').length})
                  </TabsTrigger>
                  <TabsTrigger value="rejected">
                    Rejected ({requests.filter(r => r.status === 'rejected').length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-base">
                                {request.staff?.user?.full_name || 'Unknown'}
                              </h3>
                              <Badge variant="outline" className={getStatusColor(request.status)}>
                                {request.status.toUpperCase()}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {request.staff?.employee_id} • {request.leave_type}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span>From: {new Date(request.start_date).toLocaleDateString()}</span>
                              <span>To: {new Date(request.end_date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm">{request.reason}</p>
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateLeaveStatus(request.id, 'approved')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => updateLeaveStatus(request.id, 'rejected')}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {filteredRequests.length === 0 && (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Leave Requests</h3>
                        <p className="text-sm text-muted-foreground">
                          No {activeTab} leave requests found
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
