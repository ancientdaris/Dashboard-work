'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  FileText,
  Download,
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { Sidebar } from '@/components/layout/sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';

interface AttendanceReport {
  date: string;
  totalStaff: number;
  present: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  attendanceRate: number;
}

export default function AttendanceReportsPage() {
  const [reports, setReports] = useState<AttendanceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  const fetchReports = async () => {
    try {
      setLoading(true);

      // Get total staff count
      const { data: staffData } = await supabase
        .from('staff')
        .select('id')
        .eq('is_active', true);

      const totalStaff = staffData?.length || 0;

      // Get attendance data for date range
      const { data: attendanceData, error } = await supabase
        .from('attendance')
        .select('date, status')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;

      // Group by date
      const reportMap = new Map<string, AttendanceReport>();
      
      attendanceData?.forEach((record) => {
        if (!reportMap.has(record.date)) {
          reportMap.set(record.date, {
            date: record.date,
            totalStaff,
            present: 0,
            absent: 0,
            halfDay: 0,
            onLeave: 0,
            attendanceRate: 0
          });
        }

        const report = reportMap.get(record.date)!;
        if (record.status === 'present') report.present++;
        else if (record.status === 'absent') report.absent++;
        else if (record.status === 'half_day') report.halfDay++;
      });

      // Get leave data
      const { data: leaveData } = await supabase
        .from('leave_requests')
        .select('start_date, end_date')
        .eq('status', 'approved')
        .gte('end_date', startDate)
        .lte('start_date', endDate);

      // Add leave counts to reports
      leaveData?.forEach((leave) => {
        const start = new Date(leave.start_date);
        const end = new Date(leave.end_date);
        
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().split('T')[0];
          if (reportMap.has(dateStr)) {
            reportMap.get(dateStr)!.onLeave++;
          }
        }
      });

      // Calculate attendance rates
      const reportsArray = Array.from(reportMap.values()).map(report => ({
        ...report,
        attendanceRate: totalStaff > 0 ? (report.present / totalStaff) * 100 : 0
      }));

      setReports(reportsArray);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attendance reports',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    toast({
      title: 'Export Started',
      description: 'Your attendance report is being prepared...',
    });
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
                    Attendance Reports
                  </h1>
                  <p className="text-muted-foreground">
                    Generate and view attendance reports
                  </p>
                </div>
                <Button onClick={exportReport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Date Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">Start Date</label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium mb-2 block">End Date</label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {reports.map((report) => (
                    <Card key={report.date}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Calendar className="h-5 w-5 text-gray-400" />
                            <div>
                              <h3 className="font-semibold text-base">
                                {new Date(report.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Attendance Rate: {report.attendanceRate.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-6 text-center">
                            <div>
                              <div className="text-2xl font-bold text-green-600">{report.present}</div>
                              <div className="text-xs text-muted-foreground">Present</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-red-600">{report.absent}</div>
                              <div className="text-xs text-muted-foreground">Absent</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-yellow-600">{report.halfDay}</div>
                              <div className="text-xs text-muted-foreground">Half Day</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-orange-600">{report.onLeave}</div>
                              <div className="text-xs text-muted-foreground">On Leave</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {reports.length === 0 && (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reports Found</h3>
                        <p className="text-sm text-muted-foreground">
                          No attendance data available for the selected date range
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
