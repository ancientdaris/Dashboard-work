import ComingSoon from "@/components/ComingSoon";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <ComingSoon 
      title="Analytics"
      description="Comprehensive business insights and performance analytics"
      icon={<BarChart3 className="h-16 w-16 text-blue-500" />}
    />
  );
}
