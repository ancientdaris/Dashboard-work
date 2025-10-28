import ComingSoon from "@/components/ComingSoon";
import { TrendingDown } from "lucide-react";

export default function DeadStockSalePage() {
  return (
    <ComingSoon 
      title="Dead Stock Sale"
      description="Manage clearance sales and liquidate slow-moving inventory"
      icon={<TrendingDown className="h-16 w-16 text-red-500" />}
    />
  );
}
