'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ClipboardCheck,
  UserCheck,
  UserX,
  Clock,
  Calendar,
  TrendingUp,
  FileText,
  ChevronRight,
  Users
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface AttendanceStats {
  totalStaff: number;
  presentToday: number;
  absentToday: number;
  onLeave: number;
  attendanceRate: number;
}

export default function AttendancePage() {
  const [stats, setStats] = useState<AttendanceStats>({
    totalStaff: 0,
    presentToday: 0,
    absentToday: 0,
    onLeave: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchAttendanceStats();
  }, []);

  const fetchAttendanceStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get total staff count
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('id, is_active')
        .eq('is_active', true);

      if (staffError) throw staffError;

      const totalStaff = staffData?.length || 0;

      // Get today's attendance
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('status')
        .eq('date', today);

      if (attendanceError) throw attendanceError;

      const presentToday = attendanceData?.filter(a => a.status === 'present').length || 0;
      const absentToday = attendanceData?.filter(a => a.status === 'absent').length || 0;

      // Get leave requests for today
      const { data: leaveData, error: leaveError } = await supabase
        .from('leave_requests')
        .select('id')
        .eq('status', 'approved')
        .lte('start_date', today)
        .gte('end_date', today);

      if (leaveError) throw leaveError;

      const onLeave = leaveData?.length || 0;
      const attendanceRate = totalStaff > 0 ? (presentToday / totalStaff) * 100 : 0;

      setStats({
        totalStaff,
        presentToday,
        absentToday,
        onLeave,
        attendanceRate
      });
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attendance statistics',
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
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold tracking-tight text-gray-900 mb-2">
                Attendance Management
              </h1>
              <p className="text-muted-foreground">
                Track employee attendance, leaves, and work hours
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Staff
                      </CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalStaff}</div>
                      <p className="text-xs text-muted-foreground mt-1">Active employees</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Present Today
                      </CardTitle>
                      <UserCheck className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{stats.presentToday}</div>
                      <p className="text-xs text-muted-foreground mt-1">Marked present</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        On Leave
                      </CardTitle>
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">{stats.onLeave}</div>
                      <p className="text-xs text-muted-foreground mt-1">Approved leaves</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Attendance Rate
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{stats.attendanceRate.toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground mt-1">Today&apos;s rate</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Mark Attendance */}
                    <Link href="/more/attendance/mark">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <ClipboardCheck className="h-6 w-6 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-base text-gray-900">
                                  Mark Attendance
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Record daily attendance for staff
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Leave Requests */}
                    <Link href="/more/attendance/leave-requests">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-orange-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-base text-gray-900">
                                  Leave Requests
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Manage leave applications
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Leave Balances */}
                    <Link href="/more/attendance/leave-balances">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Clock className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-base text-gray-900">
                                  Leave Balances
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  View staff leave balances
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>

                    {/* Attendance Reports */}
                    <Link href="/more/attendance/reports">
                      <Card className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="p-2 bg-purple-100 rounded-lg">
                                <FileText className="h-6 w-6 text-purple-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-base text-gray-900">
                                  Attendance Reports
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                  Generate attendance reports
                                </p>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
