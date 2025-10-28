import ComingSoon from "@/components/ComingSoon";
import { DollarSign } from "lucide-react";

export default function SalaryManagementPage() {
  return (
    <ComingSoon 
      title="Salary Management"
      description="Manage payroll, incentives, and employee compensation"
      icon={<DollarSign className="h-16 w-16 text-green-500" />}
    />
  );
}
