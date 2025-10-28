import React, { useEffect, useState } from 'react';
import { ScrollView, Image, Share, TouchableOpacity, Alert } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import { Card } from '../../../components/ui/card';
import { Spinner } from '../../../components/ui/spinner';
import { Badge, BadgeText } from '../../../components/ui/badge';
import { Divider } from '../../../components/ui/divider';
import { Button, ButtonText } from '../../../components/ui/button';
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';
import { Package, Share2, ZoomIn } from 'lucide-react-native';

type Product = Database['public']['Tables']['products']['Row'] & {
  inventory?: Database['public']['Tables']['inventory']['Row'];
};

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageViewVisible, setImageViewVisible] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          inventory (*)
        `)
        .eq('id', productId)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareProduct = async () => {
    try {
      const message = `🛍️ Check out this product!\n\n${product?.name}\n💰 Price: $${Number(product?.unit_price).toFixed(2)}\n📦 SKU: ${product?.sku}\n${product?.description ? '\n' + product.description : ''}\n\n${product?.image_url || ''}`;

      await Share.share({
        message,
        title: product?.name || 'Product',
        url: product?.image_url || undefined,
      });
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share product');
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Spinner size="large" />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box className="flex-1 justify-center items-center p-4">
        <Text>Product not found</Text>
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="lg">
          {/* Product Image & Header */}
          <Card className="p-4">
            <VStack space="md" className="items-center">
              {product.image_url ? (
                <TouchableOpacity onPress={() => setImageViewVisible(true)}>
                  <Box className="relative">
                    <Image
                      source={{ uri: product.image_url }}
                      style={{ width: 192, height: 192, borderRadius: 8 }}
                    />
                    <Box className="absolute bottom-2 right-2 bg-black/50 rounded-full p-2">
                      <ZoomIn color="#ffffff" size={20} />
                    </Box>
                  </Box>
                </TouchableOpacity>
              ) : (
                <Box className="w-48 h-48 bg-background-200 rounded-lg justify-center items-center">
                  <Package color="#6b7280" size={96} />
                </Box>
              )}

              <VStack space="xs" className="items-center">
                <Heading className="text-2xl text-center">{product.name}</Heading>
                <Badge action={product.is_active ? 'success' : 'muted'}>
                  <BadgeText>{product.is_active ? 'Active' : 'Inactive'}</BadgeText>
                </Badge>
              </VStack>

              {/* Share Button */}
              <Button
                onPress={shareProduct}
                className="w-full mt-2 bg-primary-600"
                size="md"
              >
                <HStack space="xs" className="items-center">
                  <Share2 color="#ffffff" size={18} />
                  <ButtonText>Share Product</ButtonText>
                </HStack>
              </Button>
            </VStack>
          </Card>

          {/* Image Modal for fullscreen view */}
          {imageViewVisible && product.image_url && (
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.9)',
                zIndex: 1000,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={() => setImageViewVisible(false)}
                style={{
                  position: 'absolute',
                  top: 40,
                  right: 20,
                  zIndex: 1001,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 20,
                  padding: 8,
                }}
              >
                <Text className="text-white text-2xl font-bold">✕</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: product.image_url }}
                style={{ width: '90%', height: '70%' }}
                resizeMode="contain"
              />
            </Box>
          )}

          {/* Basic Info */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Basic Information</Heading>
              <Divider />

              <VStack space="sm">
                <HStack className="justify-between">
                  <Text className="text-typography-600">SKU</Text>
                  <Text className="font-bold">{product.sku}</Text>
                </HStack>
                {product.category && (
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Category</Text>
                    <Text className="font-bold">{product.category}</Text>
                  </HStack>
                )}
                {product.brand && (
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Brand</Text>
                    <Text className="font-bold">{product.brand}</Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Card>

          {/* Pricing */}
          <Card className="p-4">
            <VStack space="md">
              <Heading className="text-base">Pricing</Heading>
              <Divider />

              <VStack space="sm">
                <HStack className="justify-between">
                  <Text className="text-typography-600">Unit Price</Text>
                  <Text className="font-bold text-xl text-success-600">
                    ${Number(product.unit_price).toFixed(2)}
                  </Text>
                </HStack>
                {product.cost_price && (
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Cost Price</Text>
                    <Text className="font-bold">${Number(product.cost_price).toFixed(2)}</Text>
                  </HStack>
                )}
                <HStack className="justify-between">
                  <Text className="text-typography-600">Tax Rate</Text>
                  <Text className="font-bold">{(Number(product.tax_rate) * 100).toFixed(0)}%</Text>
                </HStack>
                {product.cost_price && (
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Margin</Text>
                    <Text className="font-bold text-info-600">
                      {(((Number(product.unit_price) - Number(product.cost_price)) / Number(product.unit_price)) * 100).toFixed(1)}%
                    </Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Card>

          {/* Inventory */}
          {product.inventory && (
            <Card className="p-4">
              <VStack space="md">
                <Heading className="text-base">Inventory</Heading>
                <Divider />

                <VStack space="sm">
                  <HStack className="justify-between">
                    <Text className="text-typography-600">In Stock</Text>
                    <Text
                      className={`font-bold text-xl ${product.inventory.quantity_in_stock <= product.inventory.reorder_level ? 'text-error-600' : 'text-success-600'}`}
                    >
                      {product.inventory.quantity_in_stock} units
                    </Text>
                  </HStack>
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Reorder Level</Text>
                    <Text className="font-bold">{product.inventory.reorder_level} units</Text>
                  </HStack>
                  <HStack className="justify-between">
                    <Text className="text-typography-600">Reorder Quantity</Text>
                    <Text className="font-bold">{product.inventory.reorder_quantity} units</Text>
                  </HStack>
                  {product.inventory.warehouse_location && (
                    <HStack className="justify-between">
                      <Text className="text-typography-600">Location</Text>
                      <Text className="font-bold">{product.inventory.warehouse_location}</Text>
                    </HStack>
                  )}
                </VStack>
              </VStack>
            </Card>
          )}

          {/* Description */}
          {product.description && (
            <Card className="p-4">
              <VStack space="md">
                <Heading className="text-base">Description</Heading>
                <Text>{product.description}</Text>
              </VStack>
            </Card>
          )}

          {/* Timestamps */}
          <Card className="p-4">
            <VStack space="sm">
              <HStack className="justify-between">
                <Text className="text-sm text-typography-600">Created</Text>
                <Text className="text-sm">{new Date(product.created_at).toLocaleString()}</Text>
              </HStack>
              <HStack className="justify-between">
                <Text className="text-sm text-typography-600">Last Updated</Text>
                <Text className="text-sm">{new Date(product.updated_at).toLocaleString()}</Text>
              </HStack>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </ScrollView>
  );
};
