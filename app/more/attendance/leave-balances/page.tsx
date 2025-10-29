'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Clock,
  Search,
  ArrowLeft
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface StaffLeaveBalance {
  id: string;
  employee_id: string;
  user: {
    full_name: string;
  };
  position: string;
  casual_leave: number;
  sick_leave: number;
  earned_leave: number;
}

export default function LeaveBalancesPage() {
  const [staff, setStaff] = useState<StaffLeaveBalance[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffLeaveBalance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = staff.filter(s => 
        s.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.employee_id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStaff(filtered);
    } else {
      setFilteredStaff(staff);
    }
  }, [searchQuery, staff]);

  const fetchLeaveBalances = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select(`
          id,
          employee_id,
          position,
          casual_leave,
          sick_leave,
          earned_leave,
          user:profiles!inner(full_name)
        `)
        .eq('is_active', true)
        .order('employee_id');

      if (error) throw error;
      
      // Transform data to match interface
      const transformedData = (data || []).map((item: any) => ({
        ...item,
        user: Array.isArray(item.user) ? item.user[0] : item.user
      }));
      
      setStaff(transformedData);
      setFilteredStaff(transformedData);
    } catch (error) {
      console.error('Error fetching leave balances:', error);
      toast({
        title: 'Error',
        description: 'Failed to load leave balances',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
                    Leave Balances
                  </h1>
                  <p className="text-muted-foreground">
                    View staff leave balances and entitlements
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by name or employee ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-4">
                  {filteredStaff.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">
                              {member.user?.full_name || 'Unknown'}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {member.employee_id} • {member.position || 'No Position'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                              <div className="text-2xl font-bold text-blue-600">
                                {member.casual_leave || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Casual Leave</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-green-600">
                                {member.sick_leave || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Sick Leave</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-purple-600">
                                {member.earned_leave || 0}
                              </div>
                              <div className="text-xs text-muted-foreground">Earned Leave</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredStaff.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Clock className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Staff Found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery ? 'No staff members match your search.' : 'No active staff members found.'}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
