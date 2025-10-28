import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Box } from '../../../../components/ui/box';
import { VStack } from '../../../../components/ui/vstack';
import { HStack } from '../../../../components/ui/hstack';
import { Button, ButtonText } from '../../../../components/ui/button';
import { Input, InputField } from '../../../../components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '../../../../components/ui/form-control';
import { Textarea, TextareaInput } from '../../../../components/ui/textarea';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem, SelectIcon, SelectDragIndicatorWrapper, SelectDragIndicator } from '../../../../components/ui/select';
import { Heading } from '../../../../components/ui/heading';
import { Text } from '../../../../components/ui/text';
import { Card } from '../../../../components/ui/card';
import { Divider } from '../../../../components/ui/divider';
import { Alert, AlertText } from '../../../../components/ui/alert';
import { supabase } from '../../../../lib/supabase';
import { useAuth } from '../../../../contexts/AuthContext';
import { Database } from '../../../../lib/database.types';

type Order = Database['public']['Tables']['orders']['Row'];
type Retailer = Database['public']['Tables']['retailers']['Row'];

export const CreateInvoiceScreen = ({ route, navigation }: any) => {
  const { orderId: routeOrderId } = route.params || {};
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [selectedOrder, setSelectedOrder] = useState(routeOrderId || '');
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [subtotal, setSubtotal] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchRetailers();
    // Set due date to 30 days from now
    const due = new Date();
    due.setDate(due.getDate() + 30);
    setDueDate(due.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      loadOrderData();
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*, retailers(*)')
      .in('status', ['confirmed', 'processing', 'shipped', 'delivered'])
      .order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const fetchRetailers = async () => {
    const { data } = await supabase
      .from('retailers')
      .select('*')
      .order('name');
    if (data) setRetailers(data);
  };

  const loadOrderData = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('id', selectedOrder)
      .single();

    if (data) {
      setSelectedRetailer(data.retailer_id || '');
      setSubtotal(data.subtotal.toString());
      setTaxAmount(data.tax_amount.toString());
      setDiscountAmount(data.discount_amount.toString());
      setNotes(data.notes || '');
    }
  };

  const calculateTotal = () => {
    const sub = parseFloat(subtotal) || 0;
    const tax = parseFloat(taxAmount) || 0;
    const discount = parseFloat(discountAmount) || 0;
    return sub + tax - discount;
  };

  const handleCreateInvoice = async () => {
    if (!selectedRetailer || !issueDate || !dueDate || !subtotal) {
      setErrorMessage('Please fill all required fields');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const invoiceNumber = `INV-${Date.now()}`;
      const totalAmount = calculateTotal();

      const { error } = await supabase.from('invoices').insert({
        invoice_number: invoiceNumber,
        order_id: selectedOrder || null,
        retailer_id: selectedRetailer,
        status: 'draft',
        issue_date: issueDate,
        due_date: dueDate,
        subtotal: parseFloat(subtotal),
        tax_amount: parseFloat(taxAmount) || 0,
        discount_amount: parseFloat(discountAmount) || 0,
        total_amount: totalAmount,
        notes,
        created_by: user?.id,
      });

      if (error) throw error;

      setSuccessMessage('Invoice created successfully');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="md">
          <Heading className="text-2xl">Create Invoice</Heading>

          {errorMessage && (
            <Alert className="bg-error-100 border border-error-500 rounded-lg p-4">
              <AlertText className="text-error-900">{errorMessage}</AlertText>
            </Alert>
          )}

          {successMessage && (
            <Alert className="bg-success-100 border border-success-500 rounded-lg p-4">
              <AlertText className="text-success-900">{successMessage}</AlertText>
            </Alert>
          )}

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>From Order (Optional)</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={selectedOrder} onValueChange={setSelectedOrder}>
              <SelectTrigger>
                <SelectInput placeholder="Select an order" />
                <SelectIcon />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="None" value="" />
                  {orders.map((order) => (
                    <SelectItem
                      key={order.id}
                      label={`${order.order_number} - $${Number(order.total_amount).toFixed(2)}`}
                      value={order.id}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Retailer *</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={selectedRetailer} onValueChange={setSelectedRetailer}>
              <SelectTrigger>
                <SelectInput placeholder="Select retailer" />
                <SelectIcon />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {retailers.map((retailer) => (
                    <SelectItem key={retailer.id} label={retailer.name} value={retailer.id} />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <HStack space="md">
            <FormControl className="flex-1">
              <FormControlLabel>
                <FormControlLabelText>Issue Date *</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="YYYY-MM-DD"
                  value={issueDate}
                  onChangeText={setIssueDate}
                />
              </Input>
            </FormControl>

            <FormControl className="flex-1">
              <FormControlLabel>
                <FormControlLabelText>Due Date *</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="YYYY-MM-DD"
                  value={dueDate}
                  onChangeText={setDueDate}
                />
              </Input>
            </FormControl>
          </HStack>

          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Amounts</Heading>
              <Divider />

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Subtotal *</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="0.00"
                    value={subtotal}
                    onChangeText={setSubtotal}
                    keyboardType="decimal-pad"
                  />
                </Input>
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Tax Amount</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="0.00"
                    value={taxAmount}
                    onChangeText={setTaxAmount}
                    keyboardType="decimal-pad"
                  />
                </Input>
              </FormControl>

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Discount Amount</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="0.00"
                    value={discountAmount}
                    onChangeText={setDiscountAmount}
                    keyboardType="decimal-pad"
                  />
                </Input>
              </FormControl>

              <HStack className="justify-between pt-2">
                <Text className="font-bold text-xl">Total Amount</Text>
                <Text className="font-bold text-xl text-success-600">
                  ${totalAmount.toFixed(2)}
                </Text>
              </HStack>
            </VStack>
          </Card>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Notes</FormControlLabelText>
            </FormControlLabel>
            <Textarea>
              <TextareaInput
                placeholder="Add any notes..."
                value={notes}
                onChangeText={setNotes}
              />
            </Textarea>
          </FormControl>

          <Button onPress={handleCreateInvoice} isDisabled={loading} className="mt-4">
            <ButtonText>{loading ? 'Creating...' : 'Create Invoice'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};
