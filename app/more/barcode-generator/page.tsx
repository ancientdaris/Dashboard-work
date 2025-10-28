import ComingSoon from "@/components/ComingSoon";
import { Maximize2 } from "lucide-react";

export default function BarcodeGeneratorPage() {
  return (
    <ComingSoon 
      title="Barcode Generator"
      description="Generate and print barcodes for your products"
      icon={<Maximize2 className="h-16 w-16 text-purple-500" />}
    />
  );
}
