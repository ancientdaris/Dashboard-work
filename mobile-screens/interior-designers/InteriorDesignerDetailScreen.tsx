import React, { useEffect, useState } from 'react';
import { ScrollView, Linking } from 'react-native';
import { Box } from '../../../../components/ui/box';
import { VStack } from '../../../../components/ui/vstack';
import { HStack } from '../../../../components/ui/hstack';
import { Heading } from '../../../../components/ui/heading';
import { Text } from '../../../../components/ui/text';
import { Card } from '../../../../components/ui/card';
import { Button, ButtonText } from '../../../../components/ui/button';
import { Spinner } from '../../../../components/ui/spinner';
import { Badge, BadgeText } from '../../../../components/ui/badge';
import { supabase } from '../../../../lib/supabase';
import {
  ChevronLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Palette,
  Briefcase,
  Award,
  Globe,
  DollarSign,
  TrendingUp,
} from 'lucide-react-native';

interface InteriorDesigner {
  id: string;
  user_id: string | null;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
  specialization: string | null;
  years_of_experience: number | null;
  portfolio_url: string | null;
  commission_percentage: number;
  credit_limit: number;
  outstanding_balance: number;
  total_projects: number;
  total_revenue: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const InteriorDesignerDetailScreen = ({ route, navigation }: any) => {
  const { designerId } = route.params;
  const [designer, setDesigner] = useState<InteriorDesigner | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDesigner = async () => {
    try {
      const { data, error } = await supabase
        .from('interior_designers')
        .select('*')
        .eq('id', designerId)
        .single();

      if (error) throw error;
      setDesigner(data);
    } catch (error) {
      console.error('Error fetching interior designer:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigner();
  }, [designerId]);

  const handleOpenPortfolio = async () => {
    if (designer?.portfolio_url) {
      const supported = await Linking.canOpenURL(designer.portfolio_url);
      if (supported) {
        await Linking.openURL(designer.portfolio_url);
      }
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Spinner size="large" />
      </Box>
    );
  }

  if (!designer) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Text>Interior designer not found</Text>
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="lg">
          <HStack className="justify-between items-center">
            <HStack className="items-center" space="md">
              <Button
                variant="link"
                onPress={() => navigation.goBack()}
                className="p-0"
              >
                <ChevronLeft color="#6366f1" size={24} />
              </Button>
              <Heading className="text-2xl">Designer Details</Heading>
            </HStack>
            <Button
              size="sm"
              onPress={() => navigation.navigate('EditInteriorDesigner', { designerId: designer.id })}
            >
              <HStack space="xs" className="items-center">
                <Edit color="#ffffff" size={16} />
                <ButtonText>Edit</ButtonText>
              </HStack>
            </Button>
          </HStack>

          <Card className="p-6">
            <VStack space="lg">
              <HStack className="justify-between items-start">
                <VStack className="flex-1">
                  <Heading size="xl">{designer.name}</Heading>
                  {designer.business_name && (
                    <Text className="text-typography-600 mt-1 text-lg">{designer.business_name}</Text>
                  )}
                  <Text className="text-typography-500 mt-1">ID: {designer.id.slice(0, 8)}</Text>
                </VStack>
                <Badge action={designer.is_active ? 'success' : 'muted'}>
                  <BadgeText>{designer.is_active ? 'Active' : 'Inactive'}</BadgeText>
                </Badge>
              </HStack>

              <VStack space="md">
                {designer.email && (
                  <HStack space="md" className="items-center">
                    <Mail color="#6366f1" size={20} />
                    <Text className="flex-1">{designer.email}</Text>
                  </HStack>
                )}
                {designer.phone && (
                  <HStack space="md" className="items-center">
                    <Phone color="#6366f1" size={20} />
                    <Text className="flex-1">{designer.phone}</Text>
                  </HStack>
                )}
                {(designer.address || designer.city) && (
                  <HStack space="md" className="items-start">
                    <MapPin color="#6366f1" size={20} />
                    <VStack className="flex-1">
                      {designer.address && <Text>{designer.address}</Text>}
                      {(designer.city || designer.state) && (
                        <Text className="text-typography-600">
                          {designer.city}
                          {designer.city && designer.state && ', '}
                          {designer.state} {designer.postal_code}
                        </Text>
                      )}
                      {designer.country && (
                        <Text className="text-typography-600">{designer.country}</Text>
                      )}
                    </VStack>
                  </HStack>
                )}
                {designer.gstin && (
                  <HStack space="md" className="items-center">
                    <CreditCard color="#6366f1" size={20} />
                    <VStack className="flex-1">
                      <Text className="text-xs text-typography-500">GSTIN</Text>
                      <Text>{designer.gstin}</Text>
                    </VStack>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Card>

          <Card className="p-6">
            <VStack space="md">
              <Heading size="lg">Professional Information</Heading>
              {designer.specialization && (
                <HStack space="md" className="items-center">
                  <Palette color="#6366f1" size={20} />
                  <VStack className="flex-1">
                    <Text className="text-xs text-typography-500">Specialization</Text>
                    <Text>{designer.specialization}</Text>
                  </VStack>
                </HStack>
              )}
              {designer.years_of_experience !== null && (
                <HStack space="md" className="items-center">
                  <Award color="#6366f1" size={20} />
                  <VStack className="flex-1">
                    <Text className="text-xs text-typography-500">Years of Experience</Text>
                    <Text>{designer.years_of_experience} years</Text>
                  </VStack>
                </HStack>
              )}
              {designer.portfolio_url && (
                <HStack space="md" className="items-center">
                  <Globe color="#6366f1" size={20} />
                  <VStack className="flex-1">
                    <Text className="text-xs text-typography-500">Portfolio</Text>
                    <Button
                      variant="link"
                      onPress={handleOpenPortfolio}
                      className="p-0 justify-start"
                    >
                      <ButtonText className="text-primary-600 text-sm">View Portfolio</ButtonText>
                    </Button>
                  </VStack>
                </HStack>
              )}
            </VStack>
          </Card>

          <Card className="p-6">
            <VStack space="md">
              <Heading size="lg">Financial Information</Heading>
              <HStack space="md" className="items-center">
                <DollarSign color="#6366f1" size={20} />
                <VStack className="flex-1">
                  <Text className="text-xs text-typography-500">Commission Percentage</Text>
                  <Text className="text-lg font-bold text-typography-900">
                    {Number(designer.commission_percentage).toFixed(2)}%
                  </Text>
                </VStack>
              </HStack>
              <HStack className="justify-between">
                <VStack>
                  <Text className="text-sm text-typography-500">Credit Limit</Text>
                  <Text className="text-xl font-bold text-typography-900 mt-1">
                    ${Number(designer.credit_limit).toFixed(2)}
                  </Text>
                </VStack>
                <VStack className="items-end">
                  <Text className="text-sm text-typography-500">Outstanding Balance</Text>
                  <Text className="text-xl font-bold text-error-600 mt-1">
                    ${Number(designer.outstanding_balance).toFixed(2)}
                  </Text>
                </VStack>
              </HStack>
              <HStack className="justify-between mt-2 pt-4 border-t border-outline-200">
                <VStack>
                  <Text className="text-sm text-typography-500">Available Credit</Text>
                  <Text className="text-lg font-bold text-success-600 mt-1">
                    ${(Number(designer.credit_limit) - Number(designer.outstanding_balance)).toFixed(2)}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>

          <Card className="p-6">
            <VStack space="md">
              <Heading size="lg">Project Statistics</Heading>
              <HStack className="justify-between">
                <VStack>
                  <HStack space="xs" className="items-center">
                    <Briefcase color="#6366f1" size={18} />
                    <Text className="text-sm text-typography-500">Total Projects</Text>
                  </HStack>
                  <Text className="text-2xl font-bold text-typography-900 mt-1">
                    {designer.total_projects || 0}
                  </Text>
                </VStack>
                <VStack className="items-end">
                  <HStack space="xs" className="items-center">
                    <TrendingUp color="#10b981" size={18} />
                    <Text className="text-sm text-typography-500">Total Revenue</Text>
                  </HStack>
                  <Text className="text-2xl font-bold text-success-600 mt-1">
                    ${Number(designer.total_revenue || 0).toFixed(2)}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>

          <Card className="p-6">
            <VStack space="sm">
              <Text className="text-xs text-typography-500">Created At</Text>
              <Text>{new Date(designer.created_at).toLocaleString()}</Text>
              <Text className="text-xs text-typography-500 mt-2">Last Updated</Text>
              <Text>{new Date(designer.updated_at).toLocaleString()}</Text>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </ScrollView>
  );
};
