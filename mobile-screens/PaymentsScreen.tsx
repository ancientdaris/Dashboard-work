import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Text } from '../../../components/ui/text';
import { Card } from '../../../components/ui/card';
import { Spinner } from '../../../components/ui/spinner';
import { Badge, BadgeText } from '../../../components/ui/badge';
import { Button, ButtonText } from '../../../components/ui/button';;
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreatePaymentScreen } from './payments/CreatePaymentScreen';

type Payment = Database['public']['Tables']['payments']['Row'] & {
  retailers?: Database['public']['Tables']['retailers']['Row'];
};

const Stack = createNativeStackNavigator();

const PaymentsListScreen = ({ navigation }: any) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`*, retailers (*)`)
        .order('payment_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Spinner className="text-xl" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-50">
      <VStack space="md" className="p-4">
        <Button onPress={() => navigation.navigate('CreatePayment')}>
          <ButtonText>+ Record Payment</ButtonText>
        </Button>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchPayments(); }} />}
        >
        <VStack space="md" className="pb-20">
          {payments.length === 0 ? (
            <Card className="p-8 items-center">
              <Text className="text-xl text-typography-600">No payments found</Text>
            </Card>
          ) : (
            payments.map((payment) => (
              <Card key={payment.id} className="p-4 bg-background-0 rounded-lg border border-outline-200">
                <VStack space="sm">
                  <HStack className="justify-between items-start">
                    <VStack className="flex-1">
                      <Text className="font-semibold text-base text-typography-900">
                        {payment.payment_number}
                      </Text>
                      <Text className="text-xs text-typography-500 mt-0.5">
                        {payment.retailers?.name}
                      </Text>
                      {payment.payment_method && (
                        <Text className="text-xs text-typography-600 mt-0.5 capitalize">
                          {payment.payment_method}
                        </Text>
                      )}
                    </VStack>
                    <Badge
                      action={
                        payment.status === 'completed' ? 'success' :
                        payment.status === 'failed' ? 'error' :
                        'warning'
                      }
                      className="ml-2 capitalize"
                    >
                      <BadgeText className="text-xs">{payment.status}</BadgeText>
                    </Badge>
                  </HStack>
                  <HStack className="justify-between items-end mt-2 pt-2 border-t border-outline-100">
                    <VStack>
                      <Text className="text-xs text-typography-500 uppercase tracking-wide">
                        Amount
                      </Text>
                      <Text className="text-lg font-bold text-typography-900 mt-0.5">
                        ${Number(payment.amount).toFixed(2)}
                      </Text>
                    </VStack>
                    <VStack className="items-end">
                      <Text className="text-xs text-typography-500 uppercase tracking-wide">
                        Date
                      </Text>
                      <Text className="text-sm text-typography-700 mt-0.5">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </Text>
                      {payment.is_same_day && (
                        <Badge className="mt-1" action="info" size="sm">
                          <BadgeText className="text-xs">Same Day</BadgeText>
                        </Badge>
                      )}
                    </VStack>
                  </HStack>
                </VStack>
              </Card>
            ))
          )}
        </VStack>
      </ScrollView>
      </VStack>
    </Box>
  );
};

export const PaymentsScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PaymentsList" component={PaymentsListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreatePayment" component={CreatePaymentScreen} options={{ title: 'Record Payment' }} />
    </Stack.Navigator>
  );
};
