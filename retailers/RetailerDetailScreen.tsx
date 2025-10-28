import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box } from '../../../../components/ui/box';
import { VStack } from '../../../../components/ui/vstack';
import { HStack } from '../../../../components/ui/hstack';
import { Heading } from '../../../../components/ui/heading';
import { Text } from '../../../../components/ui/text';
import { Card } from '../../../../components/ui/card';
import { Spinner } from '../../../../components/ui/spinner';
import { Badge, BadgeText } from '../../../../components/ui/badge';
import { Button, ButtonText } from '../../../../components/ui/button';
import { Divider } from '../../../../components/ui/divider';
import { FileCheck, X, Clock } from 'lucide-react-native';
import { supabase } from '../../../../lib/supabase';
import { Database } from '../../../../lib/database.types';

type Retailer = Database['public']['Tables']['retailers']['Row'];

export const RetailerDetailScreen = ({ route, navigation }: any) => {
  const { retailerId } = route.params;
  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRetailerDetails();
  }, [retailerId]);

  const fetchRetailerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('id', retailerId)
        .single();

      if (error) throw error;
      setRetailer(data);
    } catch (error) {
      console.error('Error fetching retailer details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getKYCBadgeColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'submitted': return 'info';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  const DocumentStatus = ({ label, uploaded, verified }: { label: string; uploaded: boolean; verified: boolean }) => (
    <HStack className="items-center justify-between py-2 px-3 bg-background-0 rounded">
      <Text className="text-sm flex-1">{label}</Text>
      {uploaded ? (
        verified ? (
          <HStack space="xs" className="items-center">
            <FileCheck color="#16a34a" size={16} />
            <Text className="text-xs text-success-600">Verified</Text>
          </HStack>
        ) : (
          <HStack space="xs" className="items-center">
            <Clock color="#f59e0b" size={16} />
            <Text className="text-xs text-warning-600">Pending</Text>
          </HStack>
        )
      ) : (
        <HStack space="xs" className="items-center">
          <X color="#dc2626" size={16} />
          <Text className="text-xs text-error-600">Not Uploaded</Text>
        </HStack>
      )}
    </HStack>
  );

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Spinner className="text-xl" />
      </Box>
    );
  }

  if (!retailer) {
    return (
      <Box className="flex-1 justify-center items-center p-4">
        <Text>Retailer not found</Text>
      </Box>
    );
  }

  const businessTypeName = {
    proprietorship: 'Proprietorship',
    private_limited: 'Private Limited',
    llp: 'LLP',
    other: 'Other'
  }[retailer.business_type || 'other'] || 'N/A';

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="lg">
          {/* Header */}
          <Card className="p-4">
            <VStack space="md">
              <HStack className="justify-between items-start">
                <VStack className="flex-1">
                  <Heading className="text-2xl">{retailer.name}</Heading>
                  <Text className="text-sm text-typography-500 mt-1">Owner: {retailer.owner_name}</Text>
                </VStack>
                <VStack space="xs" className="items-end">
                  <Badge action={retailer.is_active ? 'success' : 'muted'}>
                    <BadgeText>{retailer.is_active ? 'Active' : 'Inactive'}</BadgeText>
                  </Badge>
                  <Badge action={getKYCBadgeColor(retailer.kyc_status)}>
                    <BadgeText className="text-xs">KYC: {retailer.kyc_status}</BadgeText>
                  </Badge>
                </VStack>
              </HStack>

              <Divider className="my-2" />

              <HStack space="md">
                <Button className="flex-1" onPress={() => navigation.navigate('EditRetailer', { retailerId: retailer.id })}>
                  <ButtonText>Edit Details</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Card>

          {/* Business Information */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Business Information</Heading>
              <Divider />

              <HStack className="justify-between">
                <Text className="text-typography-600">Business Type</Text>
                <Text className="font-semibold">{businessTypeName}</Text>
              </HStack>
              {retailer.gst_number && (
                <HStack className="justify-between">
                  <Text className="text-typography-600">GST Number</Text>
                  <Text className="font-semibold">{retailer.gst_number}</Text>
                </HStack>
              )}
            </VStack>
          </Card>

          {/* Contact Information */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Contact Information</Heading>
              <Divider />

              {retailer.mobile_number && (
                <HStack className="justify-between">
                  <Text className="text-typography-600">Mobile Number</Text>
                  <Text className="font-semibold">{retailer.mobile_number}</Text>
                </HStack>
              )}
              {retailer.email && (
                <HStack className="justify-between">
                  <Text className="text-typography-600">Email</Text>
                  <Text className="font-semibold">{retailer.email}</Text>
                </HStack>
              )}
            </VStack>
          </Card>

          {/* Address */}
          {(retailer.address || retailer.city || retailer.state) && (
            <Card className="p-4">
              <VStack space="md">
                <Heading className="text-base">Address</Heading>
                <Divider />

                <VStack space="xs">
                  {retailer.address && <Text>{retailer.address}</Text>}
                  {(retailer.city || retailer.state || retailer.postal_code) && (
                    <Text>
                      {[retailer.city, retailer.state, retailer.postal_code]
                        .filter(Boolean)
                        .join(', ')}
                    </Text>
                  )}
                </VStack>
              </VStack>
            </Card>
          )}

          {/* KYC Documents Status */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">KYC Documents Status</Heading>
              <Divider />

              {retailer.kyc_rejection_reason && (
                <Box className="bg-error-50 p-3 rounded border border-error-300">
                  <Text className="text-xs text-error-900 font-semibold mb-1">Rejection Reason:</Text>
                  <Text className="text-sm text-error-800">{retailer.kyc_rejection_reason}</Text>
                </Box>
              )}

              <VStack space="sm">
                <Text className="text-xs text-typography-500 font-semibold uppercase mt-2">Company Documents</Text>
                <DocumentStatus
                  label="Company PAN Card"
                  uploaded={!!retailer.company_pan_card}
                  verified={retailer.company_pan_card_verified}
                />

                {retailer.business_type === 'proprietorship' && (
                  <>
                    <Text className="text-xs text-typography-500 font-semibold uppercase mt-2">Proprietorship KYC</Text>
                    <DocumentStatus
                      label="GST Certificate"
                      uploaded={!!retailer.gst_certificate}
                      verified={retailer.gst_certificate_verified}
                    />
                    <DocumentStatus
                      label="Udhyam Aadhar"
                      uploaded={!!retailer.udhyam_aadhar}
                      verified={retailer.udhyam_aadhar_verified}
                    />
                    <DocumentStatus
                      label="Gumasta Certificate"
                      uploaded={!!retailer.gumasta_certificate}
                      verified={retailer.gumasta_certificate_verified}
                    />
                  </>
                )}

                {(retailer.business_type === 'private_limited' || retailer.business_type === 'llp') && (
                  <>
                    <Text className="text-xs text-typography-500 font-semibold uppercase mt-2">Company Registration</Text>
                    <DocumentStatus
                      label="AOA (Articles of Association)"
                      uploaded={!!retailer.aoa_document}
                      verified={retailer.aoa_document_verified}
                    />
                    <DocumentStatus
                      label="MOA (Memorandum of Association)"
                      uploaded={!!retailer.moa_document}
                      verified={retailer.moa_document_verified}
                    />
                    <DocumentStatus
                      label="Certificate of Incorporation"
                      uploaded={!!retailer.certificate_of_incorporation}
                      verified={retailer.certificate_of_incorporation_verified}
                    />
                    {retailer.cin_number && (
                      <HStack className="justify-between py-2 px-3 bg-background-0 rounded">
                        <Text className="text-sm text-typography-600">CIN Number</Text>
                        <Text className="text-sm font-semibold">{retailer.cin_number}</Text>
                      </HStack>
                    )}
                  </>
                )}

                <Text className="text-xs text-typography-500 font-semibold uppercase mt-2">Owner Documents</Text>
                <DocumentStatus
                  label="Owner PAN Card"
                  uploaded={!!retailer.owner_pan_card}
                  verified={retailer.owner_pan_card_verified}
                />
                <DocumentStatus
                  label="Owner Aadhar Card (Front)"
                  uploaded={!!retailer.owner_aadhar_card_front}
                  verified={retailer.owner_aadhar_card_front_verified}
                />
                <DocumentStatus
                  label="Owner Aadhar Card (Back)"
                  uploaded={!!retailer.owner_aadhar_card_back}
                  verified={retailer.owner_aadhar_card_back_verified}
                />
              </VStack>

              {retailer.kyc_submitted_at && (
                <Text className="text-xs text-typography-500 mt-2">
                  Submitted: {new Date(retailer.kyc_submitted_at).toLocaleDateString()}
                </Text>
              )}
              {retailer.kyc_verified_at && (
                <Text className="text-xs text-success-600 mt-1">
                  Verified: {new Date(retailer.kyc_verified_at).toLocaleDateString()}
                </Text>
              )}
            </VStack>
          </Card>

          {/* Financial Information */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Financial Information</Heading>
              <Divider />

              <HStack className="justify-between">
                <VStack>
                  <Text className="text-xs text-typography-500">
                    Credit Limit
                  </Text>
                  <Text className="text-2xl font-bold text-info-600">
                    ₹{Number(retailer.credit_limit).toFixed(2)}
                  </Text>
                </VStack>
                <VStack className="items-end">
                  <Text className="text-xs text-typography-500">
                    Outstanding Balance
                  </Text>
                  <Text className="text-2xl font-bold text-error-600">
                    ₹{Number(retailer.outstanding_balance).toFixed(2)}
                  </Text>
                </VStack>
              </HStack>

              <Divider />

              <HStack className="justify-between">
                <Text className="text-typography-600">Available Credit</Text>
                <Text className="font-bold text-success-600 text-lg">
                  ₹
                  {(
                    Number(retailer.credit_limit) - Number(retailer.outstanding_balance)
                  ).toFixed(2)}
                </Text>
              </HStack>
            </VStack>
          </Card>

          {/* Timestamps */}
          <Card className="p-4 mb-8">
            <VStack space="sm">
              <HStack className="justify-between">
                <Text className="text-sm text-typography-600">
                  Created
                </Text>
                <Text className="text-sm">{new Date(retailer.created_at).toLocaleString()}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-sm text-typography-600">
                  Last Updated
                </Text>
                <Text className="text-sm">{new Date(retailer.updated_at).toLocaleString()}</Text>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </ScrollView>
  );
};
