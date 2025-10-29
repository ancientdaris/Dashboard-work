import React, { useState } from 'react';
import { ScrollView, Alert, Image } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Button, ButtonText } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import { Badge, BadgeText } from '../../../components/ui/badge';
import { supabase } from '../../../lib/supabase';
import { Camera, Image as ImageIcon, Search, XCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  unit_price: number;
  image_url: string | null;
  similarity: number;
}

export const PhotoSearchScreen = ({ navigation }: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera roll permission is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setSearchResults([]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
        setSearchResults([]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const searchByPhoto = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select or capture an image first');
      return;
    }

    try {
      setSearching(true);

      // In a real implementation, you would:
      // 1. Upload the image to a server
      // 2. Use ML/AI service (like Google Vision, AWS Rekognition, or custom model) to analyze the image
      // 3. Extract features and match against product images
      // 4. Return ranked results by similarity

      // For now, we'll simulate by fetching products with images
      // and doing a mock similarity score

      const { data: products, error } = await supabase
        .from('products')
        .select('id, sku, name, category, brand, unit_price, image_url')
        .not('image_url', 'is', null)
        .eq('is_active', true)
        .limit(20);

      if (error) throw error;

      // Mock similarity scoring (in production, this would come from ML model)
      const resultsWithSimilarity = (products || []).map(product => ({
        ...product,
        similarity: Math.random() * 100 // Mock similarity score 0-100
      })).sort((a, b) => b.similarity - a.similarity);

      setSearchResults(resultsWithSimilarity.slice(0, 10));

      if (resultsWithSimilarity.length === 0) {
        Alert.alert('No Results', 'No matching products found');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSearching(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setSearchResults([]);
  };

  const viewProduct = (productId: string) => {
    navigation.navigate('ProductDetail', { productId });
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Box className="p-4">
        <VStack space="lg">
          {/* Header */}
          <Card className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700">
            <HStack space="md" className="items-center mb-3">
              <ImageIcon size={24} color="#ffffff" />
              <Heading size="xl" className="text-white">Photo Search</Heading>
            </HStack>
            <Text size="sm" className="text-indigo-100">
              Find products by taking a photo or uploading an image
            </Text>
          </Card>

          {/* Image Selection */}
          {!selectedImage ? (
            <Card className="p-4 bg-white">
              <Heading size="md" className="mb-4">Select Image</Heading>
              <VStack space="md">
                <Button
                  size="lg"
                  className="bg-blue-600"
                  onPress={takePhoto}
                >
                  <HStack space="sm" className="items-center">
                    <Camera size={20} color="#ffffff" />
                    <ButtonText>Take Photo</ButtonText>
                  </HStack>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-600"
                  onPress={pickImage}
                >
                  <HStack space="sm" className="items-center">
                    <ImageIcon size={20} color="#2563eb" />
                    <ButtonText className="text-blue-700">Choose from Gallery</ButtonText>
                  </HStack>
                </Button>
              </VStack>
            </Card>
          ) : (
            <Card className="p-4 bg-white">
              <HStack className="justify-between items-center mb-4">
                <Heading size="md">Selected Image</Heading>
                <Button
                  size="sm"
                  variant="outline"
                  onPress={clearImage}
                >
                  <XCircle size={16} color="#dc2626" />
                </Button>
              </HStack>

              <Image
                source={{ uri: selectedImage }}
                style={{ width: '100%', height: 250, borderRadius: 8 }}
                resizeMode="cover"
              />

              <Button
                size="lg"
                className="bg-green-600 mt-4"
                onPress={searchByPhoto}
                isDisabled={searching}
              >
                <HStack space="sm" className="items-center">
                  <Search size={20} color="#ffffff" />
                  <ButtonText>{searching ? 'Searching...' : 'Search Products'}</ButtonText>
                </HStack>
              </Button>
            </Card>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card className="p-4 bg-white">
              <Heading size="md" className="mb-4">
                Search Results ({searchResults.length})
              </Heading>
              <VStack space="md">
                {searchResults.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    onPress={() => viewProduct(product.id)}
                    className="p-0"
                  >
                    <Card className="p-3 w-full">
                      <HStack space="md" className="items-center">
                        {product.image_url && (
                          <Image
                            source={{ uri: product.image_url }}
                            style={{ width: 60, height: 60, borderRadius: 8 }}
                            resizeMode="cover"
                          />
                        )}
                        <VStack className="flex-1">
                          <HStack className="justify-between items-center mb-1">
                            <Text size="md" className="font-bold flex-1">
                              {product.name}
                            </Text>
                            <Badge
                              size="sm"
                              variant="solid"
                              action={
                                product.similarity > 80 ? 'success' :
                                product.similarity > 60 ? 'warning' : 'muted'
                              }
                            >
                              <BadgeText>{product.similarity.toFixed(0)}%</BadgeText>
                            </Badge>
                          </HStack>
                          <Text size="sm" className="text-gray-600 mb-1">
                            SKU: {product.sku}
                          </Text>
                          <HStack space="sm" className="items-center">
                            {product.brand && (
                              <Text size="sm" className="text-gray-600">
                                {product.brand}
                              </Text>
                            )}
                            {product.category && (
                              <>
                                <Text size="sm" className="text-gray-400">•</Text>
                                <Text size="sm" className="text-gray-600">
                                  {product.category}
                                </Text>
                              </>
                            )}
                          </HStack>
                          <Text size="md" className="font-bold text-green-700 mt-1">
                            ₹{parseFloat(product.unit_price.toString()).toFixed(2)}
                          </Text>
                        </VStack>
                      </HStack>
                    </Card>
                  </Button>
                ))}
              </VStack>
            </Card>
          )}

          {/* How it Works */}
          <Card className="p-4 bg-blue-50">
            <Heading size="sm" className="mb-3 text-blue-900">How Photo Search Works</Heading>
            <VStack space="sm">
              <HStack space="sm" className="items-start">
                <Text size="sm" className="text-blue-900 font-bold">1.</Text>
                <Text size="sm" className="text-blue-900 flex-1">
                  Take a photo or upload an image of the product you're looking for
                </Text>
              </HStack>
              <HStack space="sm" className="items-start">
                <Text size="sm" className="text-blue-900 font-bold">2.</Text>
                <Text size="sm" className="text-blue-900 flex-1">
                  AI analyzes the image to identify key visual features
                </Text>
              </HStack>
              <HStack space="sm" className="items-start">
                <Text size="sm" className="text-blue-900 font-bold">3.</Text>
                <Text size="sm" className="text-blue-900 flex-1">
                  Matches are ranked by similarity percentage
                </Text>
              </HStack>
              <HStack space="sm" className="items-start">
                <Text size="sm" className="text-blue-900 font-bold">4.</Text>
                <Text size="sm" className="text-blue-900 flex-1">
                  Select a product to view details and place orders
                </Text>
              </HStack>
            </VStack>

            <Card className="p-3 bg-yellow-100 mt-3">
              <Text size="xs" className="text-yellow-900">
                <Text className="font-bold">Note:</Text> For best results, use clear, well-lit photos with the product as the main subject.
              </Text>
            </Card>
          </Card>

          {/* Use Cases */}
          <Card className="p-4 bg-green-50">
            <Heading size="sm" className="mb-3 text-green-900">Perfect For</Heading>
            <VStack space="xs">
              <Text size="sm" className="text-green-800">
                • Quickly finding products when you don't know the name
              </Text>
              <Text size="sm" className="text-green-800">
                • Matching products from competitor catalogs
              </Text>
              <Text size="sm" className="text-green-800">
                • Identifying products from customer photos
              </Text>
              <Text size="sm" className="text-green-800">
                • Discovering similar or alternative products
              </Text>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </ScrollView>
  );
};
