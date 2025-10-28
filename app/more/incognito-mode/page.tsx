import ComingSoon from "@/components/ComingSoon";
import { EyeOff } from "lucide-react";

export default function IncognitoModePage() {
  return (
    <ComingSoon 
      title="Incognito Mode"
      description="Process anonymous cash sales without customer records"
      icon={<EyeOff className="h-16 w-16 text-purple-500" />}
    />
  );
}
