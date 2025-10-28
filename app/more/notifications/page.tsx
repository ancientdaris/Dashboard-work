import ComingSoon from "@/components/ComingSoon";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <ComingSoon 
      title="Notifications"
      description="Manage alerts, reminders, and system notifications"
      icon={<Bell className="h-16 w-16 text-yellow-500" />}
    />
  );
}
