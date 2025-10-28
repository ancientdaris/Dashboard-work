import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
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
import { ChevronLeft, Edit, Mail, Phone, MapPin, CreditCard } from 'lucide-react-native';

interface Customer {
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
  credit_limit: number;
  outstanding_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const CustomerDetailScreen = ({ route, navigation }: any) => {
  const { customerId } = route.params;
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) throw error;
      setCustomer(data);
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Spinner size="large" />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Text>Customer not found</Text>
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
              <Heading className="text-2xl">Customer Details</Heading>
            </HStack>
            <Button
              size="sm"
              onPress={() => navigation.navigate('EditCustomer', { customerId: customer.id })}
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
                  <Heading size="xl">{customer.name}</Heading>
                  <Text className="text-typography-500 mt-1">Customer ID: {customer.id.slice(0, 8)}</Text>
                </VStack>
                <Badge action={customer.is_active ? 'success' : 'muted'}>
                  <BadgeText>{customer.is_active ? 'Active' : 'Inactive'}</BadgeText>
                </Badge>
              </HStack>

              <VStack space="md">
                {customer.email && (
                  <HStack space="md" className="items-center">
                    <Mail color="#6366f1" size={20} />
                    <Text className="flex-1">{customer.email}</Text>
                  </HStack>
                )}
                {customer.phone && (
                  <HStack space="md" className="items-center">
                    <Phone color="#6366f1" size={20} />
                    <Text className="flex-1">{customer.phone}</Text>
                  </HStack>
                )}
                {(customer.address || customer.city) && (
                  <HStack space="md" className="items-start">
                    <MapPin color="#6366f1" size={20} />
                    <VStack className="flex-1">
                      {customer.address && <Text>{customer.address}</Text>}
                      {(customer.city || customer.state) && (
                        <Text className="text-typography-600">
                          {customer.city}
                          {customer.city && customer.state && ', '}
                          {customer.state} {customer.postal_code}
                        </Text>
                      )}
                      {customer.country && (
                        <Text className="text-typography-600">{customer.country}</Text>
                      )}
                    </VStack>
                  </HStack>
                )}
                {customer.gstin && (
                  <HStack space="md" className="items-center">
                    <CreditCard color="#6366f1" size={20} />
                    <VStack className="flex-1">
                      <Text className="text-xs text-typography-500">GSTIN</Text>
                      <Text>{customer.gstin}</Text>
                    </VStack>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Card>

          <Card className="p-6">
            <VStack space="md">
              <Heading size="lg">Financial Information</Heading>
              <HStack className="justify-between">
                <VStack>
                  <Text className="text-sm text-typography-500">Credit Limit</Text>
                  <Text className="text-xl font-bold text-typography-900 mt-1">
                    ${Number(customer.credit_limit).toFixed(2)}
                  </Text>
                </VStack>
                <VStack className="items-end">
                  <Text className="text-sm text-typography-500">Outstanding Balance</Text>
                  <Text className="text-xl font-bold text-error-600 mt-1">
                    ${Number(customer.outstanding_balance).toFixed(2)}
                  </Text>
                </VStack>
              </HStack>
              <HStack className="justify-between mt-2 pt-4 border-t border-outline-200">
                <VStack>
                  <Text className="text-sm text-typography-500">Available Credit</Text>
                  <Text className="text-lg font-bold text-success-600 mt-1">
                    ${(Number(customer.credit_limit) - Number(customer.outstanding_balance)).toFixed(2)}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>

          <Card className="p-6">
            <VStack space="sm">
              <Text className="text-xs text-typography-500">Created At</Text>
              <Text>{new Date(customer.created_at).toLocaleString()}</Text>
              <Text className="text-xs text-typography-500 mt-2">Last Updated</Text>
              <Text>{new Date(customer.updated_at).toLocaleString()}</Text>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </ScrollView>
  );
};
