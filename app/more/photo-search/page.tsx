import ComingSoon from "@/components/ComingSoon";
import { Camera } from "lucide-react";

export default function PhotoSearchPage() {
  return (
    <ComingSoon 
      title="Photo Search"
      description="Search for products using image recognition technology"
      icon={<Camera className="h-16 w-16 text-blue-500" />}
    />
  );
}
