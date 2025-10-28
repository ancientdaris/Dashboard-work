import ComingSoon from "@/components/ComingSoon";
import { Upload } from "lucide-react";

export default function BulkUploadPage() {
  return (
    <ComingSoon 
      title="Bulk Upload"
      description="Upload products, inventory, and data in bulk via CSV/Excel files"
      icon={<Upload className="h-16 w-16 text-blue-500" />}
    />
  );
}
