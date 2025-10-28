import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Text } from '../../../components/ui/text';
import { Card } from '../../../components/ui/card';
import { Spinner } from '../../../components/ui/spinner';
import { Badge, BadgeText } from '../../../components/ui/badge';
import { Button, ButtonText } from '../../../components/ui/button';
import { Input, InputField } from '../../../components/ui/input';
import { supabase } from '../../../lib/supabase';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomerDetailScreen } from './customers/CustomerDetailScreen';
import { CreateCustomerScreen } from './customers/CreateCustomerScreen';
import { EditCustomerScreen } from './customers/EditCustomerScreen';
import { Users } from 'lucide-react-native';

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

const Stack = createNativeStackNavigator();

const CustomersListScreen = ({ navigation }: any) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-50">
      <VStack space="md" className="p-4">
        <HStack space="md" className="items-center">
          <Input className="flex-1">
            <InputField
              placeholder="Search customers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
          <Button onPress={() => navigation.navigate('CreateCustomer')}>
            <ButtonText>+ New</ButtonText>
          </Button>
        </HStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCustomers(); }} />}
        >
          <VStack space="md" className="pb-20">
            {filteredCustomers.length === 0 ? (
              <Card className="p-8 items-center">
                <Users color="#9ca3af" size={48} />
                <Text className="text-xl text-typography-600 mt-4">No customers found</Text>
              </Card>
            ) : (
              filteredCustomers.map((customer) => (
                <TouchableOpacity
                  key={customer.id}
                  onPress={() => navigation.navigate('CustomerDetail', { customerId: customer.id })}
                  activeOpacity={0.7}
                >
                  <Card className="p-4 bg-background-0 rounded-lg border border-outline-200">
                    <VStack space="sm">
                      <HStack className="justify-between items-start">
                        <VStack className="flex-1">
                          <Text className="font-semibold text-base text-typography-900">
                            {customer.name}
                          </Text>
                          {customer.email && (
                            <Text className="text-xs text-typography-500 mt-0.5">
                              {customer.email}
                            </Text>
                          )}
                          {customer.phone && (
                            <Text className="text-xs text-typography-600 mt-0.5">
                              {customer.phone}
                            </Text>
                          )}
                        </VStack>
                        <Badge action={customer.is_active ? 'success' : 'muted'} className="ml-2">
                          <BadgeText className="text-xs">
                            {customer.is_active ? 'Active' : 'Inactive'}
                          </BadgeText>
                        </Badge>
                      </HStack>
                      {customer.address && (
                        <Text className="text-xs text-typography-600 mt-1">
                          {customer.address}
                          {customer.city && `, ${customer.city}`}
                          {customer.state && `, ${customer.state}`}
                        </Text>
                      )}
                      <HStack className="justify-between items-end mt-2 pt-2 border-t border-outline-100">
                        <VStack>
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Credit Limit
                          </Text>
                          <Text className="text-lg font-bold text-typography-900 mt-0.5">
                            ${Number(customer.credit_limit).toFixed(2)}
                          </Text>
                        </VStack>
                        <VStack className="items-end">
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Outstanding
                          </Text>
                          <Text className="text-lg font-bold text-error-600 mt-0.5">
                            ${Number(customer.outstanding_balance).toFixed(2)}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </Card>
                </TouchableOpacity>
              ))
            )}
          </VStack>
        </ScrollView>
      </VStack>
    </Box>
  );
};

export const CustomersScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'none',
      }}
    >
      <Stack.Screen
        name="CustomersList"
        component={CustomersListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CustomerDetail"
        component={CustomerDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateCustomer"
        component={CreateCustomerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditCustomer"
        component={EditCustomerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
