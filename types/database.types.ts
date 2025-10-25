export type UserRole = 'admin' | 'manager' | 'viewer';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
  business_type: 'wholesaler' | 'retailer' | 'designer' | null;
  account_status: 'pending' | 'approved' | 'suspended' | 'rejected';
  gst_number: string | null;
  pan_number: string | null;
  business_name: string | null;
  verification_documents: any | null; // You might want to type this more specifically based on your needs
  verified_at: string | null;
  verified_by: string | null;
}
