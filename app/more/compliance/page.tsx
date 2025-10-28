import ComingSoon from "@/components/ComingSoon";
import { FileCheck } from "lucide-react";

export default function CompliancePage() {
  return (
    <ComingSoon 
      title="Compliance"
      description="GST filing, tax management, and regulatory compliance"
      icon={<FileCheck className="h-16 w-16 text-red-500" />}
    />
  );
}
