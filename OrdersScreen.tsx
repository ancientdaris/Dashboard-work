import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Box } from '../../components/ui/box';
import { VStack } from '../../components/ui/vstack';
import { HStack } from '../../components/ui/hstack';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Card } from '../../components/ui/card';
import { Button, ButtonText } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import { Badge, BadgeText } from '../../components/ui/badge';
import { Input, InputField } from '../../components/ui/input';
import { InputSlot } from '../../components/ui/input';
import { InputIcon } from '../../components/ui/input';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OrderDetailScreen } from './orders/OrderDetailScreen';
import { CreateOrderScreen } from './orders/CreateOrderScreen';

type Order = Database['public']['Tables']['orders']['Row'] & {
  retailers?: Database['public']['Tables']['retailers']['Row'];
  customers?: Database['public']['Tables']['customers']['Row'];
};

const Stack = createNativeStackNavigator();

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

const OrdersListScreen = ({ navigation }: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          retailers (*),
          customers (*)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const filteredOrders = orders.filter((order) => {
    const buyerName = order.retailers?.name || order.customers?.name || '';
    const matchesSearch = order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      buyerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '$yellow600';
      case 'confirmed':
        return '$blue600';
      case 'processing':
        return '$purple600';
      case 'shipped':
        return '$indigo600';
      case 'delivered':
        return '$green600';
      case 'cancelled':
        return '$red600';
      default:
        return '$gray600';
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Spinner className="text-xl" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-50">
      <VStack space="md" className="p-4">
        {/* Search and Create */}
        <HStack space="md" className="items-center">
          <Input className="flex-1">
            <InputField
              placeholder="Search orders..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
          <Button onPress={() => navigation.navigate('CreateOrder')}>
            <ButtonText>+ New</ButtonText>
          </Button>
        </HStack>

        {/* Status Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <HStack space="sm">
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status.value}
                onPress={() => setSelectedStatus(status.value)}
                activeOpacity={0.7}
              >
                <Badge
                  action={
                    selectedStatus === status.value
                      ? 'info'
                      : status.value === 'delivered'
                      ? 'success'
                      : status.value === 'cancelled'
                      ? 'error'
                      : status.value === 'pending'
                      ? 'warning'
                      : 'muted'
                  }
                  variant={selectedStatus === status.value ? 'solid' : 'outline'}
                  className="px-4 py-2"
                >
                  <BadgeText className="text-sm font-medium">{status.label}</BadgeText>
                </Badge>
              </TouchableOpacity>
            ))}
          </HStack>
        </ScrollView>

        {/* Orders List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <VStack space="md" className="pb-20">
            {filteredOrders.length === 0 ? (
              <Card className="p-8 items-center">
                <Text className="text-xl text-typography-600">
                  No orders found
                </Text>
                <Text className="text-sm text-typography-500 mt-2">
                  Create your first order to get started
                </Text>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => navigation.navigate('OrderDetail', { orderId: order.id })}
                  activeOpacity={0.7}
                >
                  <Card className="p-4 bg-background-0 rounded-lg border border-outline-200">
                    <VStack space="sm">
                      <HStack className="justify-between items-start">
                        <VStack className="flex-1">
                          <Text className="font-semibold text-base text-typography-900">
                            {order.order_number}
                          </Text>
                          <HStack space="xs" className="items-center mt-0.5">
                            <Text className="text-sm text-typography-500">
                              {order.retailers?.name || order.customers?.name || 'Unknown Buyer'}
                            </Text>
                            <Badge
                              variant="outline"
                              size="sm"
                              action="muted"
                            >
                              <BadgeText className="text-xs">
                                {order.retailers ? 'Retailer' : 'Customer'}
                              </BadgeText>
                            </Badge>
                          </HStack>
                        </VStack>
                        <Badge
                          action={
                            order.status === 'delivered' ? 'success' :
                            order.status === 'cancelled' ? 'error' :
                            order.status === 'pending' ? 'warning' :
                            'info'
                          }
                          className="capitalize"
                        >
                          <BadgeText className="text-xs">{order.status}</BadgeText>
                        </Badge>
                      </HStack>

                      <HStack className="justify-between items-end mt-2 pt-2 border-t border-outline-100">
                        <VStack>
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Total Amount
                          </Text>
                          <Text className="text-lg font-bold text-typography-900 mt-0.5">
                            ${Number(order.total_amount).toFixed(2)}
                          </Text>
                        </VStack>
                        <VStack className="items-end">
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Created
                          </Text>
                          <Text className="text-sm text-typography-700 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString()}
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

export const OrdersScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'none',
      }}
    >
      <Stack.Screen
        name="OrdersList"
        component={OrdersListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateOrder"
        component={CreateOrderScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
