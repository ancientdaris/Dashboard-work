import ComingSoon from "@/components/ComingSoon";
import { Building2 } from "lucide-react";

export default function WholesalersPage() {
  return (
    <ComingSoon 
      title="Wholesalers"
      description="Manage your wholesaler network and supplier relationships"
      icon={<Building2 className="h-16 w-16 text-orange-500" />}
    />
  );
}
