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
import { WholesalerDetailScreen } from './wholesalers/WholesalerDetailScreen';
import { CreateWholesalerScreen } from './wholesalers/CreateWholesalerScreen';
import { EditWholesalerScreen } from './wholesalers/EditWholesalerScreen';
import { Store } from 'lucide-react-native';

interface Wholesaler {
  id: string;
  user_id: string | null;
  business_name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
  tax_id: string | null;
  credit_limit: number;
  outstanding_balance: number;
  discount_percentage: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Stack = createNativeStackNavigator();

const WholesalersListScreen = ({ navigation }: any) => {
  const [wholesalers, setWholesalers] = useState<Wholesaler[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWholesalers = async () => {
    try {
      const { data, error } = await supabase
        .from('wholesalers')
        .select('*')
        .order('business_name');

      if (error) throw error;
      setWholesalers(data || []);
    } catch (error) {
      console.error('Error fetching wholesalers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWholesalers();
  }, []);

  const filteredWholesalers = wholesalers.filter((wholesaler) =>
    wholesaler.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wholesaler.contact_person?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wholesaler.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wholesaler.phone?.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search wholesalers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
          <Button onPress={() => navigation.navigate('CreateWholesaler')}>
            <ButtonText>+ New</ButtonText>
          </Button>
        </HStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchWholesalers(); }} />}
        >
          <VStack space="md" className="pb-20">
            {filteredWholesalers.length === 0 ? (
              <Card className="p-8 items-center">
                <Store color="#9ca3af" size={48} />
                <Text className="text-xl text-typography-600 mt-4">No wholesalers found</Text>
              </Card>
            ) : (
              filteredWholesalers.map((wholesaler) => (
                <TouchableOpacity
                  key={wholesaler.id}
                  onPress={() => navigation.navigate('WholesalerDetail', { wholesalerId: wholesaler.id })}
                  activeOpacity={0.7}
                >
                  <Card className="p-4 bg-background-0 rounded-lg border border-outline-200">
                    <VStack space="sm">
                      <HStack className="justify-between items-start">
                        <VStack className="flex-1">
                          <Text className="font-semibold text-base text-typography-900">
                            {wholesaler.business_name}
                          </Text>
                          {wholesaler.contact_person && (
                            <Text className="text-xs text-typography-600 mt-0.5">
                              Contact: {wholesaler.contact_person}
                            </Text>
                          )}
                          {wholesaler.email && (
                            <Text className="text-xs text-typography-500 mt-0.5">
                              {wholesaler.email}
                            </Text>
                          )}
                          {wholesaler.phone && (
                            <Text className="text-xs text-typography-600 mt-0.5">
                              {wholesaler.phone}
                            </Text>
                          )}
                        </VStack>
                        <Badge action={wholesaler.is_active ? 'success' : 'muted'} className="ml-2">
                          <BadgeText className="text-xs">
                            {wholesaler.is_active ? 'Active' : 'Inactive'}
                          </BadgeText>
                        </Badge>
                      </HStack>
                      {wholesaler.address && (
                        <Text className="text-xs text-typography-600 mt-1">
                          {wholesaler.address}
                          {wholesaler.city && `, ${wholesaler.city}`}
                          {wholesaler.state && `, ${wholesaler.state}`}
                        </Text>
                      )}
                      <HStack className="justify-between items-end mt-2 pt-2 border-t border-outline-100">
                        <VStack>
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Credit Limit
                          </Text>
                          <Text className="text-lg font-bold text-typography-900 mt-0.5">
                            ${Number(wholesaler.credit_limit).toFixed(2)}
                          </Text>
                        </VStack>
                        <VStack className="items-center">
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Discount
                          </Text>
                          <Text className="text-lg font-bold text-success-600 mt-0.5">
                            {Number(wholesaler.discount_percentage).toFixed(1)}%
                          </Text>
                        </VStack>
                        <VStack className="items-end">
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Outstanding
                          </Text>
                          <Text className="text-lg font-bold text-error-600 mt-0.5">
                            ${Number(wholesaler.outstanding_balance).toFixed(2)}
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

export const WholesalersScreen = () => {
  return (
    <Stack.Navigator
      id="wholesalers"
      screenOptions={{
        animation: 'none',
      }}
    >
      <Stack.Screen
        name="WholesalersList"
        component={WholesalersListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="WholesalerDetail"
        component={WholesalerDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateWholesaler"
        component={CreateWholesalerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditWholesaler"
        component={EditWholesalerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
