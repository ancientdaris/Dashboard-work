import ComingSoon from "@/components/ComingSoon";
import { Gift } from "lucide-react";

export default function ReferralProgramPage() {
  return (
    <ComingSoon 
      title="Referral Program"
      description="Refer new users and earn rewards and incentives"
      icon={<Gift className="h-16 w-16 text-pink-500" />}
    />
  );
}
