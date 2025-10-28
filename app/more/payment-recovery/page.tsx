import ComingSoon from "@/components/ComingSoon";
import { AlertCircle } from "lucide-react";

export default function PaymentRecoveryPage() {
  return (
    <ComingSoon 
      title="Payment Recovery"
      description="Smart payment recovery system with automated reminders and tracking"
      icon={<AlertCircle className="h-16 w-16 text-red-500" />}
    />
  );
}
