import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native';
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
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem, SelectIcon, SelectDragIndicatorWrapper, SelectDragIndicator } from '../../components/ui/select';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProductDetailScreen } from './products/ProductDetailScreen';
import { CreateProductScreen } from './products/CreateProductScreen';
import { AttributesScreen } from './products/AttributesScreen';
import { Package, Filter, Tags } from 'lucide-react-native';

type Product = Database['public']['Tables']['products']['Row'];

const Stack = createNativeStackNavigator();

const ProductsListScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = product.is_active === true;
    } else if (statusFilter === 'inactive') {
      matchesStatus = product.is_active === false;
    }

    return matchesSearch && matchesStatus;
  });

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
        <HStack space="md" className="items-center">
          <Input className="flex-1">
            <InputField
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
          <Button onPress={() => navigation.navigate('CreateProduct')}>
            <ButtonText>+ New</ButtonText>
          </Button>
        </HStack>

        {/* Action Buttons */}
        <HStack space="sm">
          <Button
            onPress={() => navigation.navigate('Attributes')}
            className="flex-1 bg-success-600"
            size="sm"
          >
            <HStack space="xs" className="items-center">
              <Tags color="#ffffff" size={16} />
              <ButtonText>Manage Attributes</ButtonText>
            </HStack>
          </Button>
        </HStack>

        {/* Filter by Status */}
        <Card className="p-3">
          <HStack space="sm" className="items-center">
            <Filter color="#6366f1" size={18} />
            <Text className="text-sm font-medium">Filter:</Text>
            <Box className="flex-1">
              <Select selectedValue={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger variant="outline" size="sm">
                  <SelectInput placeholder="All Products" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="All Products" value="all" />
                    <SelectItem label="Active Only" value="active" />
                    <SelectItem label="Inactive Only" value="inactive" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
          </HStack>
        </Card>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <VStack space="md" className="pb-20">
            {filteredProducts.length === 0 ? (
              <Card className="p-8 items-center">
                <Text className="text-xl text-typography-600">
                  No products found
                </Text>
              </Card>
            ) : (
              filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                  activeOpacity={0.7}
                >
                  <Card className="p-4 bg-background-0 rounded-lg border border-outline-200">
                    <HStack space="md">
                      {product.image_url ? (
                        <Box className="w-18 h-18 rounded-lg overflow-hidden border border-outline-200">
                          <Image
                            source={{ uri: product.image_url }}
                            style={{ width: 72, height: 72 }}
                            resizeMode="cover"
                          />
                        </Box>
                      ) : (
                        <Box className="w-18 h-18 bg-background-100 rounded-lg justify-center items-center border border-outline-200">
                          <Package color="#6366f1" size={32} strokeWidth={2} />
                        </Box>
                      )}

                      <VStack className="flex-1" space="xs">
                        <HStack className="justify-between items-start">
                          <VStack className="flex-1">
                            <Text className="font-semibold text-base text-typography-900">
                              {product.name}
                            </Text>
                            <Text className="text-xs text-typography-500 mt-0.5">
                              SKU: {product.sku}
                            </Text>
                          </VStack>
                          <Badge action={product.is_active ? 'success' : 'muted'} className="ml-2">
                            <BadgeText className="text-xs">
                              {product.is_active ? 'Active' : 'Inactive'}
                            </BadgeText>
                          </Badge>
                        </HStack>

                        {product.category && (
                          <Text className="text-xs text-typography-500">
                            {product.category}
                          </Text>
                        )}

                        <HStack className="justify-between items-end mt-1 pt-2 border-t border-outline-100">
                          <VStack>
                            <Text className="text-xs text-typography-500 uppercase tracking-wide">
                              Price
                            </Text>
                            <Text className="text-lg font-bold text-typography-900 mt-0.5">
                              ${Number(product.unit_price).toFixed(2)}
                            </Text>
                          </VStack>
                          {product.cost_price && (
                            <VStack className="items-end">
                              <Text className="text-xs text-typography-500 uppercase tracking-wide">
                                Cost
                              </Text>
                              <Text className="text-sm text-typography-700 mt-0.5">
                                ${Number(product.cost_price).toFixed(2)}
                              </Text>
                            </VStack>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
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

export const ProductsScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'none',
      }}
    >
      <Stack.Screen
        name="ProductsList"
        component={ProductsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateProduct"
        component={CreateProductScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Attributes"
        component={AttributesScreen}
        options={{
          headerShown: true,
          title: 'Product Attributes'
        }}
      />
    </Stack.Navigator>
  );
};
