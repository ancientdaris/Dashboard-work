import ComingSoon from "@/components/ComingSoon";
import { ClipboardCheck } from "lucide-react";

export default function AttendancePage() {
  return (
    <ComingSoon 
      title="Attendance"
      description="Track employee attendance, leaves, and work hours"
      icon={<ClipboardCheck className="h-16 w-16 text-purple-500" />}
    />
  );
}
