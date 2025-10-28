import ComingSoon from "@/components/ComingSoon";
import { Settings } from "lucide-react";

export default function AdminPanelPage() {
  return (
    <ComingSoon 
      title="Admin Panel"
      description="System configuration, user management, and advanced settings"
      icon={<Settings className="h-16 w-16 text-gray-500" />}
    />
  );
}
