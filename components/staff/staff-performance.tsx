import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCallback, useEffect, useState } from 'react';
import { Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StaffMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  employee_id: string;
  department: string;
  position: string;
}

interface PerformanceSummary {
  totalOrders: number;
  totalSales: number;
  averageEfficiency: string | null;
  averageCustomerSatisfaction: string | null;
}

interface PerformanceData {
  id: string;
  staff_id: string;
  date: string;
  orders_handled: number;
  total_sales: string | number;
  efficiency_score: number | null;
  customer_satisfaction_score: number | null;
  staff?: StaffMember;
}

export default function StaffPerformance() {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Start of current month
    end: new Date().toISOString().split('T')[0] // Today
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const supabase = createClient();

  const fetchPerformanceData = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff_performance')
        .select(`
          *,
          staff:staff_id (id, first_name, last_name, email, employee_id, department, position)
        `)
        .gte('date', dateRange.start)
        .lte('date', dateRange.end)
        .order('date', { ascending: false });

      if (error) throw error;
      
      setPerformanceData(data || []);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  }, [dateRange, supabase]);

  useEffect(() => {
    fetchPerformanceData();
  }, [fetchPerformanceData]);

  const filteredData = performanceData.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.staff?.employee_id?.toLowerCase().includes(searchLower) ||
      item.staff?.department?.toLowerCase().includes(searchLower)
    );
  });

  const getPerformanceSummary = (data: PerformanceData[]): PerformanceSummary => {
    const totalOrders = data.reduce((sum, item) => sum + (item.orders_handled || 0), 0);
    const totalSales = data.reduce((sum, item) => {
      const salesValue = typeof item.total_sales === 'number' ? item.total_sales.toString() : item.total_sales || '0';
      return sum + parseFloat(salesValue);
    }, 0);
    const averageEfficiency = data.length > 0 ? (data.reduce((sum, item) => sum + (item.efficiency_score || 0), 0) / data.length).toFixed(1) : null;
    const averageCustomerSatisfaction = data.length > 0 ? (data.reduce((sum, item) => sum + (item.customer_satisfaction_score || 0), 0) / data.length).toFixed(1) : null;

    return { totalOrders, totalSales, averageEfficiency, averageCustomerSatisfaction };
  };

  const performanceSummary = getPerformanceSummary(performanceData);

  const getEfficiencyColor = (score: number | null): string => {
    if (score === null) return 'bg-gray-100 text-gray-800';
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search performance..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-36"
            />
            <span>to</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-36"
            />
          </div>
          <Button onClick={fetchPerformanceData} disabled={loading}>
            Apply
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders Handled</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.reduce((sum, item) => sum + (item.orders_handled || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{performanceData.reduce((sum, item) => {
                const salesValue = typeof item.total_sales === 'number' 
                  ? item.total_sales.toString() 
                  : item.total_sales || '0';
                return sum + parseFloat(salesValue);
              }, 0).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Efficiency</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.length > 0 
                ? (performanceData.reduce((sum, item) => sum + (item.efficiency_score || 0), 0) / performanceData.length).toFixed(1) + '%'
                : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Customer Satisfaction</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.length > 0 
                ? (performanceData.reduce((sum, item) => sum + (item.customer_satisfaction_score || 0), 0) / performanceData.length).toFixed(1) + '%'
                : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Orders Handled</TableHead>
              <TableHead className="text-right">Sales (₹)</TableHead>
              <TableHead className="text-right">Efficiency</TableHead>
              <TableHead className="text-right">Customer Satisfaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading performance data...
                </TableCell>
              </TableRow>
            ) : filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No performance data found for the selected period
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.staff?.employee_id || 'N/A'}
                  </TableCell>
                  <TableCell>{item.staff?.department || '-'}</TableCell>
                  <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">{item.orders_handled?.toLocaleString() || '0'}</TableCell>
                  <TableCell className="text-right">
                    {item.total_sales 
                      ? `₹${parseFloat(
                          typeof item.total_sales === 'number' 
                            ? item.total_sales.toString() 
                            : item.total_sales || '0'
                        ).toLocaleString('en-IN', {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2
                        })}`
                      : '₹0.00'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.efficiency_score !== null && item.efficiency_score !== undefined ? (
                      <span className={`px-2 py-1 rounded-full text-xs ${getEfficiencyColor(item.efficiency_score)}`}>
                        {item.efficiency_score.toFixed(1)}%
                      </span>
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.customer_satisfaction_score !== null && item.customer_satisfaction_score !== undefined 
                      ? `${item.customer_satisfaction_score.toFixed(1)}%` 
                      : 'N/A'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
