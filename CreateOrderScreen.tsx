import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import { Card } from '../../../components/ui/card';
import { Button, ButtonText } from '../../../components/ui/button';
import { Input, InputField } from '../../../components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '../../../components/ui/form-control';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem } from '../../../components/ui/select';
import { Textarea, TextareaInput } from '../../../components/ui/textarea';
import { Alert, AlertText } from '../../../components/ui/alert';
import { SelectIcon, SelectDragIndicatorWrapper, SelectDragIndicator } from '../../../components/ui/select';
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';
import { useAuth } from '../../../contexts/AuthContext';

type Retailer = Database['public']['Tables']['retailers']['Row'];
type Customer = Database['public']['Tables']['customers']['Row'];
type Product = Database['public']['Tables']['products']['Row'];

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export const CreateOrderScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [buyerType, setBuyerType] = useState<'retailer' | 'customer'>('retailer');
  const [buyerMode, setBuyerMode] = useState<'select' | 'create'>('select');
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedRetailer, setSelectedRetailer] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');

  // New retailer/customer fields
  const [newBuyerName, setNewBuyerName] = useState('');
  const [newBuyerEmail, setNewBuyerEmail] = useState('');
  const [newBuyerPhone, setNewBuyerPhone] = useState('');
  const [newBuyerAddress, setNewBuyerAddress] = useState('');
  const [newBuyerCity, setNewBuyerCity] = useState('');
  const [newBuyerState, setNewBuyerState] = useState('');

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('pending');
  const [discountPercent, setDiscountPercent] = useState('0');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [priority, setPriority] = useState('normal');

  useEffect(() => {
    fetchRetailers();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchRetailers = async () => {
    const { data } = await supabase
      .from('retailers')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (data) setRetailers(data);
  };

  const fetchCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (data) setCustomers(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('name');
    if (data) setProducts(data);
  };

  const addItem = () => {
    if (!selectedProduct || !quantity) return;

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const qty = parseInt(quantity);
    const lineTotal = qty * Number(product.unit_price);

    const newItem: OrderItem = {
      product_id: product.id,
      product_name: product.name,
      quantity: qty,
      unit_price: Number(product.unit_price),
      line_total: lineTotal,
    };

    setOrderItems([...orderItems, newItem]);
    setSelectedProduct('');
    setQuantity('1');
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const discountAmount = subtotal * (parseFloat(discountPercent) / 100);
    const totalAmount = subtotal + taxAmount - discountAmount;

    return { subtotal, taxAmount, discountAmount, totalAmount };
  };

  const createNewBuyer = async () => {
    if (!newBuyerName) {
      throw new Error('Name is required');
    }

    if (buyerType === 'retailer') {
      const { data, error } = await supabase
        .from('retailers')
        .insert({
          name: newBuyerName,
          email: newBuyerEmail || null,
          phone: newBuyerPhone || null,
          address: newBuyerAddress || null,
          city: newBuyerCity || null,
          state: newBuyerState || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } else {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: newBuyerName,
          email: newBuyerEmail || null,
          phone: newBuyerPhone || null,
          address: newBuyerAddress || null,
          city: newBuyerCity || null,
          state: newBuyerState || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    }
  };

  const handleCreateOrder = async () => {
    let buyerId: string | null = null;

    // Validate based on mode
    if (buyerMode === 'select') {
      buyerId = buyerType === 'retailer' ? selectedRetailer : selectedCustomer;
      if (!buyerId) {
        setErrorMessage(`Please select a ${buyerType}`);
        return;
      }
    } else {
      if (!newBuyerName) {
        setErrorMessage('Please enter a name for the new buyer');
        return;
      }
    }

    if (orderItems.length === 0) {
      setErrorMessage('Please add at least one item');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Create new buyer if in create mode
      if (buyerMode === 'create') {
        buyerId = await createNewBuyer();
      }

      const { subtotal, taxAmount, discountAmount, totalAmount } = calculateTotals();
      const orderNumber = `ORD-${Date.now()}`;

      // Create order with either customer_id or retailer_id
      const orderData: any = {
        order_number: orderNumber,
        status,
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        notes,
        created_by: user?.id,
      };

      if (buyerType === 'retailer') {
        orderData.retailer_id = buyerId;
      } else {
        orderData.customer_id = buyerId;
      }

      const { data: createdOrder, error: orderError } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const itemsToInsert = orderItems.map(item => ({
        order_id: createdOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: 0.1,
        discount_amount: 0,
        line_total: item.line_total,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) throw itemsError;

      setSuccessMessage('Order created successfully');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="lg">
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

          {/* Buyer Selection */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Order Details</Heading>

              {/* Buyer Type Selector */}
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Buyer Type *</FormControlLabelText>
                </FormControlLabel>
                <Select selectedValue={buyerType} onValueChange={(value) => {
                  setBuyerType(value as 'retailer' | 'customer');
                  setSelectedRetailer('');
                  setSelectedCustomer('');
                  setNewBuyerName('');
                  setNewBuyerEmail('');
                  setNewBuyerPhone('');
                  setNewBuyerAddress('');
                  setNewBuyerCity('');
                  setNewBuyerState('');
                }}>
                  <SelectTrigger>
                    <SelectInput placeholder="Select buyer type" />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="Retailer" value="retailer" />
                      <SelectItem label="Customer" value="customer" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>

              {/* Mode Toggle Buttons */}
              <HStack space="sm">
                <Button
                  variant={buyerMode === 'select' ? 'solid' : 'outline'}
                  onPress={() => setBuyerMode('select')}
                  className="flex-1"
                >
                  <ButtonText>Select Existing</ButtonText>
                </Button>
                <Button
                  variant={buyerMode === 'create' ? 'solid' : 'outline'}
                  onPress={() => setBuyerMode('create')}
                  className="flex-1"
                >
                  <ButtonText>Create New</ButtonText>
                </Button>
              </HStack>

              {/* Conditional Buyer Selection or Creation */}
              {buyerMode === 'select' ? (
                buyerType === 'retailer' ? (
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText>Select Retailer *</FormControlLabelText>
                    </FormControlLabel>
                    <Select selectedValue={selectedRetailer} onValueChange={setSelectedRetailer}>
                      <SelectTrigger>
                        <SelectInput placeholder="Choose a retailer" />
                        <SelectIcon />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {retailers.map(retailer => (
                            <SelectItem key={retailer.id} label={retailer.name} value={retailer.id} />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  </FormControl>
                ) : (
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText>Select Customer *</FormControlLabelText>
                    </FormControlLabel>
                    <Select selectedValue={selectedCustomer} onValueChange={setSelectedCustomer}>
                      <SelectTrigger>
                        <SelectInput placeholder="Choose a customer" />
                        <SelectIcon />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          {customers.map(customer => (
                            <SelectItem key={customer.id} label={customer.name} value={customer.id} />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                  </FormControl>
                )
              ) : (
                <VStack space="md">
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText>Name *</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder={`Enter ${buyerType} name`}
                        value={newBuyerName}
                        onChangeText={setNewBuyerName}
                      />
                    </Input>
                  </FormControl>

                  <HStack space="md">
                    <FormControl className="flex-1">
                      <FormControlLabel>
                        <FormControlLabelText>Email</FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          placeholder="email@example.com"
                          value={newBuyerEmail}
                          onChangeText={setNewBuyerEmail}
                          keyboardType="email-address"
                        />
                      </Input>
                    </FormControl>

                    <FormControl className="flex-1">
                      <FormControlLabel>
                        <FormControlLabelText>Phone</FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          placeholder="Phone number"
                          value={newBuyerPhone}
                          onChangeText={setNewBuyerPhone}
                          keyboardType="phone-pad"
                        />
                      </Input>
                    </FormControl>
                  </HStack>

                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText>Address</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder="Street address"
                        value={newBuyerAddress}
                        onChangeText={setNewBuyerAddress}
                      />
                    </Input>
                  </FormControl>

                  <HStack space="md">
                    <FormControl className="flex-1">
                      <FormControlLabel>
                        <FormControlLabelText>City</FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          placeholder="City"
                          value={newBuyerCity}
                          onChangeText={setNewBuyerCity}
                        />
                      </Input>
                    </FormControl>

                    <FormControl className="flex-1">
                      <FormControlLabel>
                        <FormControlLabelText>State</FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          placeholder="State"
                          value={newBuyerState}
                          onChangeText={setNewBuyerState}
                        />
                      </Input>
                    </FormControl>
                  </HStack>
                </VStack>
              )}

              <HStack space="md">
                <FormControl className="flex-1">
                  <FormControlLabel>
                    <FormControlLabelText>Status *</FormControlLabelText>
                  </FormControlLabel>
                  <Select selectedValue={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectInput placeholder="Order status" />
                      <SelectIcon />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectItem label="Pending" value="pending" />
                        <SelectItem label="Confirmed" value="confirmed" />
                        <SelectItem label="Processing" value="processing" />
                        <SelectItem label="Shipped" value="shipped" />
                        <SelectItem label="Delivered" value="delivered" />
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </FormControl>

                <FormControl className="flex-1">
                  <FormControlLabel>
                    <FormControlLabelText>Discount %</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="0"
                      value={discountPercent}
                      onChangeText={setDiscountPercent}
                      keyboardType="decimal-pad"
                    />
                  </Input>
                </FormControl>
              </HStack>
            </VStack>
          </Card>

          {/* Add Items */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Add Items</Heading>

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Product</FormControlLabelText>
                </FormControlLabel>
                <Select selectedValue={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger>
                    <SelectInput placeholder="Choose a product" />
                    <SelectIcon />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      {products.map(product => (
                        <SelectItem
                          key={product.id}
                          label={`${product.name} - $${Number(product.unit_price).toFixed(2)}`}
                          value={product.id}
                        />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>

              <HStack space="md" className="items-end">
                <FormControl className="flex-1">
                  <FormControlLabel>
                    <FormControlLabelText>Quantity</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="1"
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="numeric"
                    />
                  </Input>
                </FormControl>

                <Button onPress={addItem} isDisabled={!selectedProduct || !quantity}>
                  <ButtonText>Add Item</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Card>

          {/* Order Items List */}
          {orderItems.length > 0 && (
            <Card className="p-4">
              <VStack space="md">
                <Heading className="text-base">Order Items</Heading>

                {orderItems.map((item, index) => (
                  <HStack key={index} className="justify-between items-center">
                    <VStack className="flex-1">
                      <Text className="font-bold">{item.product_name}</Text>
                      <Text className="text-sm text-typography-600">
                        {item.quantity} × ${item.unit_price.toFixed(2)}
                      </Text>
                    </VStack>
                    <HStack space="md" className="items-center">
                      <Text className="font-bold">${item.line_total.toFixed(2)}</Text>
                      <Button
                        className="text-sm"
                        action="negative"
                        onPress={() => removeItem(index)}
                      >
                        <ButtonText>Remove</ButtonText>
                      </Button>
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Card>
          )}

          {/* Order Summary */}
          {orderItems.length > 0 && (
            <Card className="p-4">
              <VStack space="sm">
                <Heading className="text-base mb-2">Order Summary</Heading>
                <HStack className="justify-between">
                  <Text>Subtotal</Text>
                  <Text>${totals.subtotal.toFixed(2)}</Text>
                </HStack>
                <HStack className="justify-between">
                  <Text>Tax (10%)</Text>
                  <Text>${totals.taxAmount.toFixed(2)}</Text>
                </HStack>
                {parseFloat(discountPercent) > 0 && (
                  <HStack className="justify-between">
                    <Text>Discount ({discountPercent}%)</Text>
                    <Text className="text-error-600">-${totals.discountAmount.toFixed(2)}</Text>
                  </HStack>
                )}
                <HStack className="justify-between pt-2 border-t border-outline-200">
                  <Text className="font-bold text-xl">Total</Text>
                  <Text className="font-bold text-xl text-success-600">
                    ${totals.totalAmount.toFixed(2)}
                  </Text>
                </HStack>
              </VStack>
            </Card>
          )}

          {/* Notes */}
          <Card className="p-4">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Notes (Optional)</FormControlLabelText>
              </FormControlLabel>
              <Textarea>
                <TextareaInput
                  placeholder="Add any notes about this order..."
                  value={notes}
                  onChangeText={setNotes}
                />
              </Textarea>
            </FormControl>
          </Card>

          {/* Create Button */}
          <Button
            onPress={handleCreateOrder}
            isDisabled={
              loading ||
              orderItems.length === 0 ||
              (buyerMode === 'select'
                ? (buyerType === 'retailer' ? !selectedRetailer : !selectedCustomer)
                : !newBuyerName)
            }
          >
            <ButtonText>{loading ? 'Creating...' : 'Create Order'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};
