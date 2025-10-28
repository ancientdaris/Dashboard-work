import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Box } from '../../components/ui/box';
import { VStack } from '../../components/ui/vstack';
import { HStack } from '../../components/ui/hstack';
import { Heading } from '../../components/ui/heading';
import { Text } from '../../components/ui/text';
import { Card } from '../../components/ui/card';
import { Spinner } from '../../components/ui/spinner';
import { Badge, BadgeText } from '../../components/ui/badge';
import { Input, InputField } from '../../components/ui/input';
import { Button, ButtonText } from '../../components/ui/button';
import { Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop, SelectContent, SelectItem, SelectIcon, SelectDragIndicatorWrapper, SelectDragIndicator } from '../../components/ui/select';
import { supabase } from '../../lib/supabase';
import { Database } from '../../lib/database.types';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateInventoryScreen } from './CreateInventoryScreen';
import { AlertTriangle, MapPin, Filter, Plus, Minus, Edit2, Check, X } from 'lucide-react-native';

const Stack = createNativeStackNavigator();

type Inventory = Database['public']['Tables']['inventory']['Row'] & {
  products?: Database['public']['Tables']['products']['Row'];
};

const InventoryListScreen = ({ navigation }: any) => {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [manualQuantity, setManualQuantity] = useState('');

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select(`
          *,
          products (*)
        `)
        .order('quantity_in_stock', { ascending: true });

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchInventory();
  };

  const updateStockQuantity = async (item: Inventory, delta: number) => {
    try {
      // Add item to updating set
      setUpdatingItems(prev => new Set(prev).add(item.id));

      // Calculate new quantity
      const newQuantity = Math.max(0, item.quantity_in_stock + delta);

      // Update in database
      const { error } = await supabase
        .from('inventory')
        .update({ quantity_in_stock: newQuantity })
        .eq('id', item.id);

      if (error) throw error;

      // Update local state
      setInventory(prev => prev.map(inv =>
        inv.id === item.id ? { ...inv, quantity_in_stock: newQuantity } : inv
      ));
    } catch (error) {
      console.error('Error updating stock quantity:', error);
    } finally {
      // Remove item from updating set
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const startManualEdit = (item: Inventory) => {
    setEditingItemId(item.id);
    setManualQuantity(item.quantity_in_stock.toString());
  };

  const cancelManualEdit = () => {
    setEditingItemId(null);
    setManualQuantity('');
  };

  const saveManualQuantity = async (item: Inventory) => {
    try {
      const newQuantity = parseInt(manualQuantity, 10);
      if (isNaN(newQuantity) || newQuantity < 0) {
        console.error('Invalid quantity');
        return;
      }

      // Add item to updating set
      setUpdatingItems(prev => new Set(prev).add(item.id));

      // Update in database
      const { error } = await supabase
        .from('inventory')
        .update({ quantity_in_stock: newQuantity })
        .eq('id', item.id);

      if (error) throw error;

      // Update local state
      setInventory(prev => prev.map(inv =>
        inv.id === item.id ? { ...inv, quantity_in_stock: newQuantity } : inv
      ));

      // Reset editing state
      setEditingItemId(null);
      setManualQuantity('');
    } catch (error) {
      console.error('Error updating stock quantity:', error);
    } finally {
      // Remove item from updating set
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const filteredInventory = inventory.filter((item) => {
    // Search filter
    const matchesSearch = item.products?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.products?.sku.toLowerCase().includes(searchQuery.toLowerCase());

    // Stock filter
    let matchesStock = true;
    if (stockFilter === 'low_stock') {
      matchesStock = item.quantity_in_stock <= item.reorder_level && item.quantity_in_stock > 0;
    } else if (stockFilter === 'out_of_stock') {
      matchesStock = item.quantity_in_stock === 0;
    } else if (stockFilter === 'in_stock') {
      matchesStock = item.quantity_in_stock > item.reorder_level;
    }

    return matchesSearch && matchesStock;
  });

  const lowStockItems = filteredInventory.filter(
    (item) => item.quantity_in_stock <= item.reorder_level
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
              placeholder="Search inventory..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
          <Button onPress={() => navigation.navigate('CreateInventory')}>
            <ButtonText>+ Add</ButtonText>
          </Button>
        </HStack>

        {/* Filter by Stock Status */}
        <Card className="p-3">
          <HStack space="sm" className="items-center">
            <Filter color="#6366f1" size={18} />
            <Text className="text-sm font-medium">Filter:</Text>
            <Box className="flex-1">
              <Select selectedValue={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger variant="outline" size="sm">
                  <SelectInput placeholder="All Items" />
                  <SelectIcon />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="All Items" value="all" />
                    <SelectItem label="In Stock" value="in_stock" />
                    <SelectItem label="Low Stock" value="low_stock" />
                    <SelectItem label="Out of Stock" value="out_of_stock" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>
          </HStack>
        </Card>

        {lowStockItems.length > 0 && (
          <Card className="p-4 bg-warning-50 border-warning-300 border">
            <HStack space="sm" className="items-center">
              <AlertTriangle color="#d97706" size={32} />
              <VStack className="flex-1">
                <Text className="font-bold text-warning-700">
                  Low Stock Alert
                </Text>
                <Text className="text-sm text-warning-600">
                  {lowStockItems.length} items need restocking
                </Text>
              </VStack>
            </HStack>
          </Card>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <VStack space="md" className="pb-20">
            {filteredInventory.length === 0 ? (
              <Card className="p-8 items-center">
                <Text className="text-xl text-typography-600">
                  No inventory items found
                </Text>
              </Card>
            ) : (
              filteredInventory.map((item) => (
                <Card key={item.id} className="p-4 bg-background-0 rounded-lg border border-outline-200">
                  <VStack space="sm">
                    <HStack className="justify-between items-start">
                      <VStack className="flex-1">
                        <Text className="font-semibold text-base text-typography-900">
                          {item.products?.name || 'Unknown Product'}
                        </Text>
                        <Text className="text-xs text-typography-500 mt-0.5">
                          SKU: {item.products?.sku || 'N/A'}
                        </Text>
                      </VStack>
                      {item.quantity_in_stock <= item.reorder_level && (
                        <Badge action="warning" className="ml-2">
                          <BadgeText className="text-xs">Low Stock</BadgeText>
                        </Badge>
                      )}
                    </HStack>

                    <HStack className="justify-between items-end mt-2 pt-2 border-t border-outline-100">
                      <VStack>
                        <Text className="text-xs text-typography-500 uppercase tracking-wide">
                          In Stock
                        </Text>
                        {editingItemId === item.id ? (
                          <HStack space="xs" className="items-center mt-1">
                            <Input style={{ width: 80, height: 36 }}>
                              <InputField
                                value={manualQuantity}
                                onChangeText={setManualQuantity}
                                keyboardType="numeric"
                                style={{ textAlign: 'center', fontSize: 16 }}
                              />
                            </Input>
                            <TouchableOpacity
                              onPress={() => saveManualQuantity(item)}
                              disabled={updatingItems.has(item.id)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: updatingItems.has(item.id) ? '#e5e7eb' : '#10b981',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Check color="#ffffff" size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={cancelManualEdit}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: '#6b7280',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <X color="#ffffff" size={18} />
                            </TouchableOpacity>
                          </HStack>
                        ) : (
                          <HStack space="sm" className="items-center mt-1">
                            <TouchableOpacity
                              onPress={() => updateStockQuantity(item, -1)}
                              disabled={item.quantity_in_stock === 0 || updatingItems.has(item.id)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: item.quantity_in_stock === 0 || updatingItems.has(item.id) ? '#e5e7eb' : '#ef4444',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Minus color="#ffffff" size={18} />
                            </TouchableOpacity>
                            <Text
                              className={`text-xl font-bold ${
                                item.quantity_in_stock <= item.reorder_level
                                  ? 'text-error-600'
                                  : 'text-typography-900'
                              }`}
                              style={{ minWidth: 40, textAlign: 'center' }}
                            >
                              {updatingItems.has(item.id) ? '...' : item.quantity_in_stock}
                            </Text>
                            <TouchableOpacity
                              onPress={() => updateStockQuantity(item, 1)}
                              disabled={updatingItems.has(item.id)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: updatingItems.has(item.id) ? '#e5e7eb' : '#10b981',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Plus color="#ffffff" size={18} />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => startManualEdit(item)}
                              disabled={updatingItems.has(item.id)}
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: updatingItems.has(item.id) ? '#e5e7eb' : '#6366f1',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Edit2 color="#ffffff" size={16} />
                            </TouchableOpacity>
                          </HStack>
                        )}
                      </VStack>
                      <VStack className="items-center">
                        <Text className="text-xs text-typography-500 uppercase tracking-wide">
                          Reorder Level
                        </Text>
                        <Text className="text-sm font-semibold text-typography-700 mt-0.5">
                          {item.reorder_level}
                        </Text>
                      </VStack>
                      <VStack className="items-end">
                        <Text className="text-xs text-typography-500 uppercase tracking-wide">
                          Reorder Qty
                        </Text>
                        <Text className="text-sm font-semibold text-typography-700 mt-0.5">
                          {item.reorder_quantity}
                        </Text>
                      </VStack>
                    </HStack>

                    {item.warehouse_location && (
                      <HStack space="xs" className="items-center mt-2 pt-2 border-t border-outline-100">
                        <MapPin color="#6366f1" size={14} strokeWidth={2} />
                        <Text className="text-xs text-typography-600">
                          {item.warehouse_location}
                        </Text>
                      </HStack>
                    )}
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

export const InventoryScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'none',
      }}
    >
      <Stack.Screen name="InventoryList" component={InventoryListScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreateInventory" component={CreateInventoryScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};
