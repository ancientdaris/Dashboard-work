import React, { useState, useEffect } from 'react';
import { ScrollView, Switch, Image, TouchableOpacity, FlatList } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Button, ButtonText } from '../../../components/ui/button';
import { Input, InputField } from '../../../components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '../../../components/ui/form-control';
import { Textarea, TextareaInput } from '../../../components/ui/textarea';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '../../../components/ui/select';
import { Alert, AlertText } from '../../../components/ui/alert';
import { Text } from '../../../components/ui/text';
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { Camera, X, ChevronDown, Video as VideoIcon, Image as ImageIcon } from 'lucide-react-native';

type Attribute = {
  id: string;
  name: string;
  icon: string | null;
  hex_code?: string | null;
};

export const CreateProductScreen = ({ navigation }: any) => {

  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Attribute[]>([]);
  const [application, setApplication] = useState('');
  const [applications, setApplications] = useState<Attribute[]>([]);
  const [collection, setCollection] = useState('');
  const [collections, setCollections] = useState<Attribute[]>([]);
  const [size, setSize] = useState('');
  const [sizes, setSizes] = useState<Attribute[]>([]);
  const [color, setColor] = useState('');
  const [colors, setColors] = useState<Attribute[]>([]);
  const [finish, setFinish] = useState('');
  const [finishes, setFinishes] = useState<Attribute[]>([]);
  const [lookAndFeel, setLookAndFeel] = useState('');
  const [lookAndFeels, setLookAndFeels] = useState<Attribute[]>([]);
  const [brand, setBrand] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [taxRate, setTaxRate] = useState('0.1');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [sacCode, setSacCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcode, setBarcode] = useState('');
  const [weight, setWeight] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [batchTrackingEnabled, setBatchTrackingEnabled] = useState(false);
  const [images, setImages] = useState<Array<{ preview: string; url: string; uploading: boolean }>>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoPreview, setVideoPreview] = useState(''); // Local preview before upload
  const [mediaUploading, setMediaUploading] = useState(false);
  const [uploadingType, setUploadingType] = useState<'image' | 'video' | null>(null);

  useEffect(() => {
    fetchAllAttributes();
  }, []);

  const fetchAllAttributes = async () => {
    try {
      const [categoriesRes, applicationsRes, collectionsRes, sizesRes, colorsRes, finishesRes, lookAndFeelRes] = await Promise.all([
        supabase.from('categories').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('applications').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('collections').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('sizes').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('colors').select('id, name, icon, hex_code').eq('is_active', true).order('name'),
        supabase.from('finishes').select('id, name, icon').eq('is_active', true).order('name'),
        supabase.from('look_and_feel').select('id, name, icon').eq('is_active', true).order('name'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (applicationsRes.data) setApplications(applicationsRes.data);
      if (collectionsRes.data) setCollections(collectionsRes.data);
      if (sizesRes.data) setSizes(sizesRes.data);
      if (colorsRes.data) setColors(colorsRes.data);
      if (finishesRes.data) setFinishes(finishesRes.data);
      if (lookAndFeelRes.data) setLookAndFeels(lookAndFeelRes.data);
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  const pickMedia = async (type: 'image' | 'video') => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setErrorMessage('Permission to access media library is required');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        allowsMultipleSelection: type === 'image', // Multiple only for images
        quality: 0.8,
        videoMaxDuration: 60, // 60 seconds max for videos
      });

      if (!result.canceled) {
        if (type === 'image') {
          // Handle multiple images
          const newImages = result.assets.map(asset => ({
            preview: asset.uri,
            url: '',
            uploading: true
          }));

          setImages(prev => [...prev, ...newImages]);

          // Upload each image
          result.assets.forEach((asset, index) => {
            uploadImage(asset.uri, images.length + index);
          });
        } else {
          // Handle single video
          const uri = result.assets[0].uri;
          setVideoPreview(uri);
          uploadMedia(uri, type);
        }
      }
    } catch (error: any) {
      setErrorMessage(`Failed to pick ${type}: ` + error.message);
    }
  };

  const uploadImage = async (uri: string, index: number) => {
    try {
      console.log(`Starting image upload from:`, uri);

      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log(`Image file read, size:`, base64.length);

      const fileExt = uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}_${index}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log(`Uploading to: ${filePath}`);

      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(base64);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, arrayBuffer, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (error) {
        console.error('Upload error:', error);
        throw error;
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log(`Public URL: ${publicUrl}`);

      // Update the specific image in array
      setImages(prev => prev.map((img, i) =>
        i === index ? { ...img, url: publicUrl, uploading: false } : img
      ));

      setSuccessMessage('Image uploaded successfully');
    } catch (error: any) {
      console.error(`Upload image error:`, error);
      setErrorMessage(`Failed to upload image: ` + error.message);

      // Mark image as failed
      setImages(prev => prev.map((img, i) =>
        i === index ? { ...img, uploading: false } : img
      ));
    }
  };

  const uploadMedia = async (uri: string, type: 'video') => {
    setMediaUploading(true);
    setUploadingType(type);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      console.log(`Starting ${type} upload from:`, uri);

      const fileExt = uri.split('.').pop()?.toLowerCase() || 'mp4';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      console.log(`Uploading to: ${filePath}`);

      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri);
      console.log(`File size: ${fileInfo.size} bytes`);

      // For videos, use FormData to upload directly from URI
      const formData = new FormData();
      formData.append('file', {
        uri: uri,
        name: fileName,
        type: `video/${fileExt}`,
      } as any);

      // Get Supabase upload URL
      const { data: { session } } = await supabase.auth.getSession();
      const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

      const uploadUrl = `${supabaseUrl}/storage/v1/object/product-videos/${filePath}`;

      // Upload using fetch with FormData
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token || supabaseAnonKey}`,
          'apikey': supabaseAnonKey || '',
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Upload failed: ${errorText}`);
      }

      console.log('Upload successful');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-videos')
        .getPublicUrl(filePath);

      console.log(`Public URL: ${publicUrl}`);

      setVideoUrl(publicUrl);
      setSuccessMessage('Video uploaded successfully');
      console.log('Video URL set to:', publicUrl);
    } catch (error: any) {
      console.error(`Upload ${type} error:`, error);
      setErrorMessage(`Failed to upload ${type}: ` + error.message);
    } finally {
      setMediaUploading(false);
      setUploadingType(null);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideoUrl('');
    setVideoPreview('');
  };

  const handleCreateProduct = async () => {
    if (!sku || !name || !unitPrice) {
      setErrorMessage('SKU, name, and unit price are required');
      return;
    }

    setLoading(true);

    try {
      // Parse dimensions string into JSONB format if provided
      let dimensionsJson = null;
      if (dimensions) {
        const parts = dimensions.split('x').map(s => s.trim());
        if (parts.length === 3) {
          dimensionsJson = {
            length: parseFloat(parts[0]),
            width: parseFloat(parts[1]),
            height: parseFloat(parts[2]),
            unit: 'cm'
          };
        }
      }

      // Get all uploaded image URLs
      const imageUrls = images.map(img => img.url).filter(url => url);

      const { error } = await supabase.from('products').insert({
        sku,
        name,
        description: description || null,
        category: category || null,
        application: application || null,
        collection: collection || null,
        size: size || null,
        color: color || null,
        finish: finish || null,
        look_and_feel: lookAndFeel || null,
        brand: brand || null,
        unit_price: parseFloat(unitPrice),
        cost_price: costPrice ? parseFloat(costPrice) : null,
        tax_rate: parseFloat(taxRate),
        is_active: isActive,
        hsn_code: hsnCode || null,
        sac_code: sacCode || null,
        expiry_date: expiryDate || null,
        image_url: imageUrls[0] || null, // Keep first image for backward compatibility
        images: imageUrls, // Store all images as array
        video_url: videoUrl || null,
        barcode: barcode || null,
        weight: weight ? parseFloat(weight) : null,
        dimensions: dimensionsJson,
        batch_tracking_enabled: batchTrackingEnabled,
      });

      if (error) throw error;

      setSuccessMessage('Product created successfully');
      setTimeout(() => navigation.goBack(), 1500);

      navigation.goBack();
    } catch (error: any) {
      setErrorMessage(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="md">
          {/* Error Message */}
          {errorMessage && (
            <Alert action="error" variant="solid">
              <AlertText>{errorMessage}</AlertText>
            </Alert>
          )}

          {/* Success Message */}
          {successMessage && (
            <Alert action="success" variant="solid">
              <AlertText>{successMessage}</AlertText>
            </Alert>
          )}

          {/* Product Images Upload (Multiple) */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Product Images (Multiple)</FormControlLabelText>
            </FormControlLabel>

            {images.length > 0 && (
              <Box className="mb-3">
                <FlatList
                  data={images}
                  numColumns={3}
                  keyExtractor={(item, index) => `${item.preview}_${index}`}
                  scrollEnabled={false}
                  renderItem={({ item, index }) => (
                    <Box
                      style={{
                        width: '31%',
                        marginRight: index % 3 !== 2 ? '3.5%' : 0,
                        marginBottom: 12,
                      }}
                    >
                      <Box className="relative">
                        <Image
                          source={{ uri: item.url || item.preview }}
                          style={{ width: '100%', aspectRatio: 1, borderRadius: 8 }}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          onPress={() => removeImage(index)}
                          style={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            borderRadius: 12,
                            padding: 4,
                          }}
                        >
                          <X color="#ffffff" size={16} />
                        </TouchableOpacity>
                        {item.uploading && (
                          <Box
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              borderBottomLeftRadius: 8,
                              borderBottomRightRadius: 8,
                              padding: 4,
                            }}
                          >
                            <Text className="text-white text-xs text-center">Uploading...</Text>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  )}
                />
              </Box>
            )}

            <TouchableOpacity onPress={() => pickMedia('image')}>
              <Box className="border-2 border-dashed border-outline-300 rounded-lg p-8 items-center justify-center bg-background-50">
                <ImageIcon color="#6b7280" size={48} />
                <Text className="text-typography-500 mt-2">
                  Tap to upload {images.length > 0 ? 'more' : ''} images (multiple)
                </Text>
              </Box>
            </TouchableOpacity>
          </FormControl>

          {/* Product Video Upload (Single) */}
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Product Video (Single)</FormControlLabelText>
            </FormControlLabel>
            {(videoPreview || videoUrl) ? (
              <Box className="relative">
                <Video
                  source={{ uri: videoUrl || videoPreview }}
                  style={{ width: '100%', height: 200, borderRadius: 8 }}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                />
                <TouchableOpacity
                  onPress={removeVideo}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    borderRadius: 20,
                    padding: 8,
                  }}
                >
                  <X color="#ffffff" size={20} />
                </TouchableOpacity>
                {(mediaUploading && uploadingType === 'video') && (
                  <Box
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      borderRadius: 8,
                      padding: 8,
                    }}
                  >
                    <Text className="text-white text-center">Uploading...</Text>
                  </Box>
                )}
              </Box>
            ) : (
              <TouchableOpacity onPress={() => pickMedia('video')} disabled={mediaUploading && uploadingType === 'video'}>
                <Box className="border-2 border-dashed border-outline-300 rounded-lg p-8 items-center justify-center bg-background-50">
                  <VideoIcon color="#6b7280" size={48} />
                  <Text className="text-typography-500 mt-2">
                    Tap to upload video (max 60s)
                  </Text>
                </Box>
              </TouchableOpacity>
            )}
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>SKU *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Product SKU" value={sku} onChangeText={setSku} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Name *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Product name" value={name} onChangeText={setName} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Description</FormControlLabelText>
            </FormControlLabel>
            <Textarea>
              <TextareaInput
                placeholder="Product description"
                value={description}
                onChangeText={setDescription}
              />
            </Textarea>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Category</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectInput placeholder="Select category" />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {categories.map((cat) => (
                    <SelectItem
                      key={cat.id}
                      label={`${cat.icon ? cat.icon + ' ' : ''}${cat.name}`}
                      value={cat.name}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Application</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={application} onValueChange={setApplication}>
              <SelectTrigger>
                <SelectInput placeholder="Select application" />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {applications.map((app) => (
                    <SelectItem
                      key={app.id}
                      label={`${app.icon ? app.icon + ' ' : ''}${app.name}`}
                      value={app.name}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Collection</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={collection} onValueChange={setCollection}>
              <SelectTrigger>
                <SelectInput placeholder="Select collection" />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {collections.map((col) => (
                    <SelectItem
                      key={col.id}
                      label={`${col.icon ? col.icon + ' ' : ''}${col.name}`}
                      value={col.name}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Size</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectInput placeholder="Select size" />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {sizes.map((sz) => (
                    <SelectItem
                      key={sz.id}
                      label={`${sz.icon ? sz.icon + ' ' : ''}${sz.name}`}
                      value={sz.name}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Color</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectInput placeholder="Select color" />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {colors.map((col) => (
                    <SelectItem
                      key={col.id}
                      label={`${col.icon ? col.icon + ' ' : ''}${col.name}`}
                      value={col.name}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Finish</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={finish} onValueChange={setFinish}>
              <SelectTrigger>
                <SelectInput placeholder="Select finish" />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {finishes.map((fin) => (
                    <SelectItem
                      key={fin.id}
                      label={`${fin.icon ? fin.icon + ' ' : ''}${fin.name}`}
                      value={fin.name}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Look & Feel</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={lookAndFeel} onValueChange={setLookAndFeel}>
              <SelectTrigger>
                <SelectInput placeholder="Select look & feel" />
                <SelectIcon className="mr-3" as={ChevronDown} />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  {lookAndFeels.map((laf) => (
                    <SelectItem
                      key={laf.id}
                      label={`${laf.icon ? laf.icon + ' ' : ''}${laf.name}`}
                      value={laf.name}
                    />
                  ))}
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Brand</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Brand" value={brand} onChangeText={setBrand} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Unit Price *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0.00"
                value={unitPrice}
                onChangeText={setUnitPrice}
                keyboardType="decimal-pad"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Cost Price</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0.00"
                value={costPrice}
                onChangeText={setCostPrice}
                keyboardType="decimal-pad"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Tax Rate (decimal)</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0.1"
                value={taxRate}
                onChangeText={setTaxRate}
                keyboardType="decimal-pad"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>HSN Code (for goods)</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="Enter HSN code"
                value={hsnCode}
                onChangeText={setHsnCode}
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>SAC Code (for services)</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="Enter SAC code"
                value={sacCode}
                onChangeText={setSacCode}
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Expiry Date</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="YYYY-MM-DD"
                value={expiryDate}
                onChangeText={setExpiryDate}
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Barcode</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="Enter barcode"
                value={barcode}
                onChangeText={setBarcode}
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Weight (kg)</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0.00"
                value={weight}
                onChangeText={setWeight}
                keyboardType="decimal-pad"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Dimensions (L x W x H in cm)</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="e.g., 10 x 5 x 3"
                value={dimensions}
                onChangeText={setDimensions}
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Batch Tracking Enabled</FormControlLabelText>
            </FormControlLabel>
            <Switch value={batchTrackingEnabled} onValueChange={setBatchTrackingEnabled} />
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Active</FormControlLabelText>
            </FormControlLabel>
            <Switch value={isActive} onValueChange={setIsActive} />
          </FormControl>

          <Button onPress={handleCreateProduct} isDisabled={loading} className="mt-4">
            <ButtonText>{loading ? 'Creating...' : 'Create Product'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};
