'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from 'next/dynamic';

// Dynamically import components with no SSR to avoid window is not defined errors
const StaffTable = dynamic(() => import('@/components/staff/staff-table'), { ssr: false });
const StaffPerformance = dynamic(() => import('@/components/staff/staff-performance'), { ssr: false });
const StaffSalaries = dynamic(() => import('@/components/staff/staff-salaries'), { ssr: false });

export default function StaffPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Staff Management</h1>
      
      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="staff">Staff Members</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="salaries">Salaries</TabsTrigger>
        </TabsList>
        
        <TabsContent value="staff">
          <StaffTable />
        </TabsContent>
        
        <TabsContent value="performance">
          <StaffPerformance />
        </TabsContent>
        
        <TabsContent value="salaries">
          <StaffSalaries />
        </TabsContent>
      </Tabs>
    </div>
  );
}
