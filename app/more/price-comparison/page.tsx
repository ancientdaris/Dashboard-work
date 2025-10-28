import ComingSoon from "@/components/ComingSoon";
import { DollarSign } from "lucide-react";

export default function PriceComparisonPage() {
  return (
    <ComingSoon 
      title="Price Comparison"
      description="Compare prices across suppliers and competitors"
      icon={<DollarSign className="h-16 w-16 text-green-500" />}
    />
  );
}
