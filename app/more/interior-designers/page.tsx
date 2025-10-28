import ComingSoon from "@/components/ComingSoon";
import { Palette } from "lucide-react";

export default function InteriorDesignersPage() {
  return (
    <ComingSoon 
      title="Interior Designers"
      description="Build partnerships with interior designers and architects"
      icon={<Palette className="h-16 w-16 text-pink-500" />}
    />
  );
}
