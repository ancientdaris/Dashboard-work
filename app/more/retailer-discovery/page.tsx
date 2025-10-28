import ComingSoon from "@/components/ComingSoon";
import { MapPin } from "lucide-react";

export default function RetailerDiscoveryPage() {
  return (
    <ComingSoon 
      title="Retailer Discovery"
      description="Discover and connect with new retailers in your area"
      icon={<MapPin className="h-16 w-16 text-red-500" />}
    />
  );
}
