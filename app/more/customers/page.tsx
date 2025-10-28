import ComingSoon from "@/components/ComingSoon";
import { UserPlus } from "lucide-react";

export default function CustomersPage() {
  return (
    <ComingSoon 
      title="Customers"
      description="Comprehensive customer management and relationship tracking"
      icon={<UserPlus className="h-16 w-16 text-blue-500" />}
    />
  );
}
