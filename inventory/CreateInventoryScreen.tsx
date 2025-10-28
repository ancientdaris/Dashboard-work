import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Button, ButtonText } from '../../../components/ui/button';
import { Input, InputField } from '../../../components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '../../../components/ui/form-control';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem, SelectIcon, SelectDragIndicatorWrapper, SelectDragIndicator } from '../../../components/ui/select';
import { Alert, AlertText } from '../../../components/ui/alert';
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';

type Product = Database['public']['Tables']['products']['Row'];

export const CreateInventoryScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantityInStock, setQuantityInStock] = useState('');
  const [reorderLevel, setReorderLevel] = useState('10');
  const [reorderQuantity, setReorderQuantity] = useState('50');
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('name');
    if (data) setProducts(data);
  };

  const handleCreate = async () => {
    if (!selectedProduct || !quantityInStock) {
      setErrorMessage('Product and quantity are required');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const { error } = await supabase.from('inventory').insert({
        product_id: selectedProduct,
        quantity_in_stock: parseInt(quantityInStock),
        reorder_level: parseInt(reorderLevel),
        reorder_quantity: parseInt(reorderQuantity),
        warehouse_location: warehouseLocation || null,
        last_restocked_at: new Date().toISOString(),
      });

      if (error) throw error;

      setSuccessMessage('Inventory created successfully');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create inventory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="lg">
          <Heading className="text-2xl">Add Inventory</Heading>

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
              <FormControlLabelText>Select Product *</FormControlLabelText>
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
                      label={`${product.name} (${product.sku})`}
                      value={product.id}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Quantity in Stock *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="Enter quantity"
                value={quantityInStock}
                onChangeText={setQuantityInStock}
                keyboardType="numeric"
              />
            </Input>
          </FormControl>

          <HStack space="md">
            <FormControl className="flex-1">
              <FormControlLabel>
                <FormControlLabelText>Reorder Level</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="10"
                  value={reorderLevel}
                  onChangeText={setReorderLevel}
                  keyboardType="numeric"
                />
              </Input>
            </FormControl>

            <FormControl className="flex-1">
              <FormControlLabel>
                <FormControlLabelText>Reorder Quantity</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  placeholder="50"
                  value={reorderQuantity}
                  onChangeText={setReorderQuantity}
                  keyboardType="numeric"
                />
              </Input>
            </FormControl>
          </HStack>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Warehouse Location</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="e.g., Aisle 3, Shelf B"
                value={warehouseLocation}
                onChangeText={setWarehouseLocation}
              />
            </Input>
          </FormControl>

          <Button
            onPress={handleCreate}
            isDisabled={loading}
            className="mt-4 bg-primary-600"
          >
            <ButtonText>{loading ? 'Creating...' : 'Add Inventory'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};
