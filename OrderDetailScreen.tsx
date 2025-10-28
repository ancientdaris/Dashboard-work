import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import { Card } from '../../../components/ui/card';
import { Button, ButtonText } from '../../../components/ui/button';
import { Divider } from '../../../components/ui/divider';
import { Spinner } from '../../../components/ui/spinner';
import { Badge, BadgeText } from '../../../components/ui/badge';;
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'] & {
  retailers?: Database['public']['Tables']['retailers']['Row'];
  order_items?: Array<
    Database['public']['Tables']['order_items']['Row'] & {
      products?: Database['public']['Tables']['products']['Row'];
    }
  >;
};

export const OrderDetailScreen = ({ route }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          retailers (*),
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Spinner className="text-xl" />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box className="flex-1 justify-center items-center p-4">
        <Text>Order not found</Text>
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="lg">
          {/* Order Header */}
          <Card className="p-4">
            <VStack space="md">
              <HStack className="justify-between items-center">
                <Heading className="text-2xl">{order.order_number}</Heading>
                <Badge action={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'error' : 'info'}>
                  <BadgeText>{order.status}</BadgeText>
                </Badge>
              </HStack>

              <Divider />

              <VStack space="sm">
                <Text className="text-sm text-typography-600">Customer</Text>
                <Text className="text-xl font-bold">
                  {order.retailers?.name || 'Unknown'}
                </Text>
                {order.retailers?.email && (
                  <Text className="text-sm text-typography-600">{order.retailers.email}</Text>
                )}
                {order.retailers?.phone && (
                  <Text className="text-sm text-typography-600">{order.retailers.phone}</Text>
                )}
              </VStack>
            </VStack>
          </Card>

          {/* Order Items */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Order Items</Heading>
              <Divider />

              {order.order_items && order.order_items.length > 0 ? (
                <VStack space="sm">
                  {order.order_items.map((item, index) => (
                    <Box key={item.id}>
                      <HStack className="justify-between items-center">
                        <VStack className="flex-1">
                          <Text className="font-bold">
                            {item.products?.name || 'Unknown Product'}
                          </Text>
                          <Text className="text-sm text-typography-600">
                            SKU: {item.products?.sku || 'N/A'}
                          </Text>
                          <Text className="text-sm text-typography-600">
                            Qty: {item.quantity} × ${Number(item.unit_price).toFixed(2)}
                          </Text>
                        </VStack>
                        <Text className="font-bold text-xl">
                          ${Number(item.line_total).toFixed(2)}
                        </Text>
                      </HStack>
                      {index < order.order_items!.length - 1 && <Divider className="mt-2" />}
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Text className="text-typography-600">No items in this order</Text>
              )}
            </VStack>
          </Card>

          {/* Order Summary */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Order Summary</Heading>
              <Divider />

              <VStack space="sm">
                <HStack className="justify-between">
                  <Text>Subtotal</Text>
                  <Text>${Number(order.subtotal).toFixed(2)}</Text>
                </HStack>
                <HStack className="justify-between">
                  <Text>Tax</Text>
                  <Text>${Number(order.tax_amount).toFixed(2)}</Text>
                </HStack>
                <HStack className="justify-between">
                  <Text>Discount</Text>
                  <Text className="text-error-600">-${Number(order.discount_amount).toFixed(2)}</Text>
                </HStack>
                <Divider />
                <HStack className="justify-between">
                  <Text className="font-bold text-xl">Total</Text>
                  <Text className="font-bold text-xl text-success-600">
                    ${Number(order.total_amount).toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </Card>

          {/* Order Notes */}
          {order.notes && (
            <Card className="p-4">
              <VStack space="md">
                <Heading className="text-base">Notes</Heading>
                <Text>{order.notes}</Text>
              </VStack>
            </Card>
          )}

          {/* Timestamps */}
          <Card className="p-4">
            <VStack space="sm">
              <HStack className="justify-between">
                <Text className="text-sm text-typography-600">Created</Text>
                <Text className="text-sm">{new Date(order.created_at).toLocaleString()}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-sm text-typography-600">Last Updated</Text>
                <Text className="text-sm">{new Date(order.updated_at).toLocaleString()}</Text>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </ScrollView>
  );
};
