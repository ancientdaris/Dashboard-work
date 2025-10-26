import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

export default function StaffSalaries() {
  interface StaffSalary {
    id: string;
    staff_id: string;
    basic_salary: number;
    salary_type: string;
    currency: string;
    effective_from: string;
    effective_to: string | null;
    staff?: {
      employee_id: string;
      department: string;
      position: string;
      is_active: boolean;
    };
  }

  const [salaries, setSalaries] = useState<StaffSalary[]>([]);
  const [staffList, setStaffList] = useState<Array<{id: string; employee_id: string; name: string}>>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    salaryType: 'all',
    status: 'active',
  });
  
  const supabase = createClient();

  useEffect(() => {
    fetchSalaries();
    fetchStaff();
  }, [filters]);

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('staff_salaries')
        .select(`
          *,
          staff:staff_id (employee_id, department, position, is_active)
        `);

      // Apply filters
      if (filters.salaryType !== 'all') {
        query = query.eq('salary_type', filters.salaryType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter by active/inactive staff if needed
      const filteredData = data.filter((item: StaffSalary) => 
        filters.status === 'all' || 
        (filters.status === 'active' && item.staff?.is_active) ||
        (filters.status === 'inactive' && !item.staff?.is_active)
      );
      
      setSalaries(filteredData || []);
    } catch (error) {
      console.error('Error fetching salary data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('id, employee_id, name')
        .order('employee_id');
      
      if (error) throw error;
      setStaffList(data || []);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  const filteredSalaries = salaries.filter(salary => 
    (salary.staff?.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (salary.staff?.department?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatCurrency = (amount: number | string | undefined | null, currency: string = 'INR'): string => {
    // Handle null/undefined
    if (amount === undefined || amount === null) return '₹0.00';
    
    // Convert to number if it's a string
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    
    // Handle invalid numbers
    if (isNaN(numAmount)) return '₹0.00';
    // Format as Indian Rupees with proper number formatting
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.round(numAmount * 100) / 100); // Round to 2 decimal places
  };

  const getSalaryTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'monthly': 'Monthly',
      'daily': 'Daily',
      'hourly': 'Hourly',
      'commission_based': 'Commission Based'
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search salaries..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={filters.salaryType}
            onValueChange={(value) => setFilters({...filters, salaryType: value})}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Salary Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="commission_based">Commission Based</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filters.status}
            onValueChange={(value) => setFilters({...filters, status: value})}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="whitespace-nowrap">
            Add Salary Record
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Salary Type</TableHead>
              <TableHead>Basic Salary</TableHead>
              <TableHead>Effective From</TableHead>
              <TableHead>Effective To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Loading salary data...
                </TableCell>
              </TableRow>
            ) : filteredSalaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No salary records found
                </TableCell>
              </TableRow>
            ) : (
              filteredSalaries.map((salary) => (
                <TableRow key={salary.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{salary.staff?.employee_id || 'N/A'}</div>
                      <div className="text-xs text-muted-foreground">
                        {salary.staff?.department || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {getSalaryTypeLabel(salary.salary_type)}
                    </span>
                  </TableCell>
                  <td className="font-mono">
                    {formatCurrency(salary.basic_salary, salary.currency)}
                    {salary.salary_type === 'hourly' && '/hr'}
                    {salary.salary_type === 'daily' && '/day'}
                  </td>
                  <td>{new Date(salary.effective_from).toLocaleDateString()}</td>
                  <td>{salary.effective_to ? new Date(salary.effective_to).toLocaleDateString() : 'Present'}</td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      !salary.effective_to || new Date(salary.effective_to) > new Date()
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {!salary.effective_to || new Date(salary.effective_to) > new Date()
                        ? 'Active'
                        : 'Inactive'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        Delete
                      </Button>
                    </div>
                  </td>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2">Salary Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded border">
            <div className="text-sm text-muted-foreground">Total Active Salaries</div>
            <div className="text-2xl font-bold">
              {salaries.filter(s => !s.effective_to || new Date(s.effective_to) > new Date()).length}
            </div>
          </div>
          <div className="bg-white p-4 rounded border">
            <div className="text-sm text-muted-foreground">Total Monthly Payroll</div>
            <div className="text-2xl font-bold">
              {formatCurrency(
                salaries
                  .filter(s => s.salary_type === 'monthly' && (!s.effective_to || new Date(s.effective_to) > new Date()))
                  .reduce((sum, s) => sum + Number(s.basic_salary || 0), 0),
                'INR'
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded border">
            <div className="text-sm text-muted-foreground">Average Salary</div>
            <div className="text-2xl font-bold">
              {salaries.length > 0 
                ? formatCurrency(
                    salaries
                      .filter(s => s.salary_type === 'monthly' && (!s.effective_to || new Date(s.effective_to) > new Date()))
                      .reduce((sum, s) => sum + Number(s.basic_salary || 0), 0) /
                    Math.max(1, salaries.filter(s => s.salary_type === 'monthly' && (!s.effective_to || new Date(s.effective_to) > new Date())).length),
                    'INR'
                  )
                : formatCurrency(0, 'INR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
