import React, { useState, useEffect } from 'react';
import { ScrollView, Alert, RefreshControl } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Button, ButtonText } from '../../../components/ui/button';
import { Input, InputField } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import { Badge, BadgeText } from '../../../components/ui/badge';
import { supabase } from '../../../lib/supabase';
import { TrendingDown, AlertTriangle, DollarSign, Package } from 'lucide-react-native';

interface DeadStockProduct {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  original_price: number;
  discount_percentage: number;
  sale_price: number;
  is_dead_stock: boolean;
  reason: string;
}

export const DeadStockSaleScreen = ({ navigation }: any) => {
  const [deadStock, setDeadStock] = useState<DeadStockProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalValue: 0,
    itemCount: 0,
    potentialSavings: 0
  });

  useEffect(() => {
    fetchDeadStock();
  }, []);

  const fetchDeadStock = async () => {
    try {
      setRefreshing(true);

      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          sku,
          name,
          unit_price,
          is_dead_stock,
          dead_stock_discount,
          inventory (quantity_in_stock)
        `)
        .eq('is_dead_stock', true)
        .eq('is_active', true);

      if (error) throw error;

      const products = (data || []).map((p: any) => {
        const discount = p.dead_stock_discount || 20;
        const salePrice = p.unit_price * (1 - discount / 100);
        const quantity = p.inventory?.[0]?.quantity_in_stock || 0;

        return {
          id: p.id,
          sku: p.sku,
          name: p.name,
          quantity,
          original_price: p.unit_price,
          discount_percentage: discount,
          sale_price: salePrice,
          is_dead_stock: p.is_dead_stock,
          reason: 'Low demand' // Could come from dead_stock_analytics table
        };
      });

      setDeadStock(products);

      // Calculate stats
      const totalValue = products.reduce((sum: number, p: DeadStockProduct) =>
        sum + (p.sale_price * p.quantity), 0
      );
      const potentialSavings = products.reduce((sum: number, p: DeadStockProduct) =>
        sum + ((p.original_price - p.sale_price) * p.quantity), 0
      );

      setStats({
        totalValue,
        itemCount: products.length,
        potentialSavings
      });
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setRefreshing(false);
    }
  };

  const markAsDeadStock = async (productId: string, discount: number) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('products')
        .update({
          is_dead_stock: true,
          dead_stock_discount: discount,
          dead_stock_listed_at: new Date().toISOString()
        })
        .eq('id', productId);

      if (error) throw error;

      Alert.alert('Success', 'Product marked as dead stock');
      fetchDeadStock();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeFromDeadStock = async (productId: string) => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('products')
        .update({
          is_dead_stock: false,
          dead_stock_discount: 0,
          dead_stock_listed_at: null
        })
        .eq('id', productId);

      if (error) throw error;

      Alert.alert('Success', 'Product removed from dead stock');
      fetchDeadStock();
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDeadStock} />}
    >
      <Box className="p-4">
        <VStack space="lg">
          <Card className="p-4 bg-gradient-to-r from-orange-600 to-orange-700">
            <HStack space="md" className="items-center mb-3">
              <TrendingDown size={24} color="#ffffff" />
              <Heading size="xl" className="text-white">Dead Stock Clearance</Heading>
            </HStack>
            <Text size="sm" className="text-orange-100 mb-4">
              Clear slow-moving inventory at discounted prices
            </Text>

            <HStack space="md" className="justify-around">
              <VStack className="items-center">
                <Package size={20} color="#fff" />
                <Text size="2xl" className="font-bold text-white mt-1">{stats.itemCount}</Text>
                <Text size="xs" className="text-orange-200">Items</Text>
              </VStack>
              <VStack className="items-center">
                <DollarSign size={20} color="#fff" />
                <Text size="2xl" className="font-bold text-white mt-1">₹{(stats.totalValue / 1000).toFixed(0)}K</Text>
                <Text size="xs" className="text-orange-200">Value</Text>
              </VStack>
              <VStack className="items-center">
                <TrendingDown size={20} color="#fef08a" />
                <Text size="2xl" className="font-bold text-yellow-200 mt-1">₹{(stats.potentialSavings / 1000).toFixed(0)}K</Text>
                <Text size="xs" className="text-orange-200">Discount</Text>
              </VStack>
            </HStack>
          </Card>

          {deadStock.length === 0 ? (
            <Card className="p-8 bg-white items-center">
              <Package size={48} color="#9ca3af" />
              <Text size="md" className="text-gray-600 mt-4 text-center">
                No dead stock items found
              </Text>
            </Card>
          ) : (
            <VStack space="md">
              {deadStock.map((product) => (
                <Card key={product.id} className="p-4 bg-white">
                  <VStack space="sm">
                    <HStack className="justify-between items-start">
                      <VStack className="flex-1">
                        <Text size="lg" className="font-bold">{product.name}</Text>
                        <Text size="sm" className="text-gray-600">SKU: {product.sku}</Text>
                      </VStack>
                      <Badge size="lg" variant="solid" action="error">
                        <BadgeText>{product.discount_percentage}% OFF</BadgeText>
                      </Badge>
                    </HStack>

                    <HStack className="items-center justify-between">
                      <VStack>
                        <Text size="xs" className="text-gray-500 line-through">
                          ₹{product.original_price.toFixed(2)}
                        </Text>
                        <Text size="xl" className="font-bold text-green-700">
                          ₹{product.sale_price.toFixed(2)}
                        </Text>
                      </VStack>
                      <VStack className="items-end">
                        <Text size="sm" className="text-gray-600">Stock: {product.quantity} units</Text>
                        <Text size="xs" className="text-orange-600">{product.reason}</Text>
                      </VStack>
                    </HStack>

                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 mt-2"
                      onPress={() => removeFromDeadStock(product.id)}
                      isDisabled={loading}
                    >
                      <ButtonText className="text-red-600">Remove from Sale</ButtonText>
                    </Button>
                  </VStack>
                </Card>
              ))}
            </VStack>
          )}

          <Card className="p-4 bg-yellow-50">
            <HStack space="sm" className="items-start mb-3">
              <AlertTriangle size={20} color="#f59e0b" />
              <Heading size="sm" className="text-yellow-900">About Dead Stock Sales</Heading>
            </HStack>
            <VStack space="xs">
              <Text size="sm" className="text-yellow-800">
                • Clear slow-moving inventory quickly
              </Text>
              <Text size="sm" className="text-yellow-800">
                • Recover capital tied up in stock
              </Text>
              <Text size="sm" className="text-yellow-800">
                • Attract price-sensitive customers
              </Text>
              <Text size="sm" className="text-yellow-800">
                • Make room for new inventory
              </Text>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </ScrollView>
  );
};
