import ComingSoon from "@/components/ComingSoon";
import { Wallet } from "lucide-react";

export default function CreditManagementPage() {
  return (
    <ComingSoon 
      title="Credit Management"
      description="Manage loans, EMI tracking, and credit facilities for your customers"
      icon={<Wallet className="h-16 w-16 text-green-500" />}
    />
  );
}
