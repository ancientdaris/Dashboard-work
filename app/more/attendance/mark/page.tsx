'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ClipboardCheck,
  UserCheck,
  UserX,
  Search,
  ArrowLeft,
  RefreshCw,
  Save
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface StaffMember {
  id: string;
  employee_id: string;
  user: {
    full_name: string;
  };
  position: string;
  attendance_status?: 'present' | 'absent' | 'half_day' | null;
}

export default function MarkAttendancePage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchStaffAndAttendance();
  }, [selectedDate]);

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

  const fetchStaffAndAttendance = async () => {
    try {
      // Fetch all active staff
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select(`
          id,
          employee_id,
          position,
          profiles!inner(full_name)
        `)
        .eq('is_active', true)
        .order('employee_id');

      if (staffError) throw staffError;

      // Fetch attendance for selected date
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('staff_id, status')
        .eq('date', selectedDate);

      if (attendanceError) throw attendanceError;

      // Merge attendance status with staff data
      const attendanceMap = new Map(attendanceData?.map(a => [a.staff_id, a.status]) || []);
      const staffWithAttendance = staffData?.map(s => ({
        id: s.id,
        employee_id: s.employee_id,
        position: s.position,
        user: {
          full_name: (s.profiles as any)?.full_name || 'Unknown'
        },
        attendance_status: attendanceMap.get(s.id) as any || null
      })) || [];

      setStaff(staffWithAttendance);
      setFilteredStaff(staffWithAttendance);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: 'Error',
        description: 'Failed to load staff data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = (staffId: string, status: 'present' | 'absent' | 'half_day') => {
    setStaff(prev => prev.map(s => 
      s.id === staffId ? { ...s, attendance_status: status } : s
    ));
  };

  const saveAttendance = async () => {
    try {
      setSaving(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      const attendanceRecords = staff
        .filter(s => s.attendance_status)
        .map(s => ({
          staff_id: s.id,
          date: selectedDate,
          status: s.attendance_status,
          marked_by: user?.id
        }));

      if (attendanceRecords.length === 0) {
        toast({
          title: 'No Changes',
          description: 'Please mark attendance for at least one staff member',
          variant: 'destructive',
        });
        return;
      }

      // Upsert attendance records
      const { error } = await supabase
        .from('attendance')
        .upsert(attendanceRecords, {
          onConflict: 'staff_id,date'
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Attendance saved for ${attendanceRecords.length} staff members`,
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to save attendance',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'absent':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'half_day':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
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
              <div className="flex items-center gap-4 mb-4">
                <Link href="/more/attendance">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <div className="flex-1">
                  <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Mark Attendance
                  </h1>
                  <p className="text-muted-foreground">
                    Record daily attendance for staff members
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-auto"
                  />
                  <Button
                    onClick={saveAttendance}
                    disabled={saving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saving ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Attendance
                  </Button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Search */}
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

                {/* Staff List */}
                <div className="grid gap-4">
                  {filteredStaff.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <div>
                                <h3 className="font-semibold text-base">
                                  {member.user?.full_name || 'Unknown'}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {member.employee_id} • {member.position || 'No Position'}
                                </p>
                              </div>
                              {member.attendance_status && (
                                <Badge variant="outline" className={getStatusColor(member.attendance_status)}>
                                  {member.attendance_status.replace('_', ' ').toUpperCase()}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant={member.attendance_status === 'present' ? 'default' : 'outline'}
                              onClick={() => markAttendance(member.id, 'present')}
                              className={member.attendance_status === 'present' ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Present
                            </Button>
                            <Button
                              size="sm"
                              variant={member.attendance_status === 'half_day' ? 'default' : 'outline'}
                              onClick={() => markAttendance(member.id, 'half_day')}
                              className={member.attendance_status === 'half_day' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                            >
                              Half Day
                            </Button>
                            <Button
                              size="sm"
                              variant={member.attendance_status === 'absent' ? 'default' : 'outline'}
                              onClick={() => markAttendance(member.id, 'absent')}
                              className={member.attendance_status === 'absent' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Absent
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredStaff.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <ClipboardCheck className="h-16 w-16 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Staff Found</h3>
                      <p className="text-sm text-muted-foreground text-center max-w-md">
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
