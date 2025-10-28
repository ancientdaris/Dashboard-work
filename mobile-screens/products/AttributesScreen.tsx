import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Heading } from '../../../components/ui/heading';
import { Text } from '../../../components/ui/text';
import { Card } from '../../../components/ui/card';
import { Button, ButtonText } from '../../../components/ui/button';
import { Input, InputField } from '../../../components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '../../../components/ui/form-control';
import { Textarea, TextareaInput } from '../../../components/ui/textarea';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '../../../components/ui/select';
import { Spinner } from '../../../components/ui/spinner';
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';
import { Plus, Edit2, Trash2, ChevronDown, Tag, Layers, Ruler, Palette, Sparkles, Eye } from 'lucide-react-native';

type AttributeType = 'categories' | 'applications' | 'collections' | 'sizes' | 'colors' | 'finishes' | 'look_and_feel';

type Attribute = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  hex_code?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const attributeConfig = {
  categories: { label: 'Categories', icon: Tag, color: '#10b981' },
  applications: { label: 'Applications', icon: Layers, color: '#3b82f6' },
  collections: { label: 'Collections', icon: Layers, color: '#8b5cf6' },
  sizes: { label: 'Sizes', icon: Ruler, color: '#f59e0b' },
  colors: { label: 'Colors', icon: Palette, color: '#ec4899' },
  finishes: { label: 'Finishes', icon: Sparkles, color: '#14b8a6' },
  look_and_feel: { label: 'Look & Feel', icon: Eye, color: '#6366f1' },
};

export const AttributesScreen = ({ navigation }: any) => {
  const [selectedType, setSelectedType] = useState<AttributeType>('categories');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');
  const [hexCode, setHexCode] = useState('');

  useEffect(() => {
    fetchAttributes();
  }, [selectedType]);

  const fetchAttributes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from(selectedType)
        .select('*')
        .order('name');

      if (error) throw error;
      setAttributes(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch attributes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttribute = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name is required');
      return;
    }

    try {
      const payload: any = {
        name: name.trim(),
        description: description.trim() || null,
        icon: icon.trim() || null,
      };

      if (selectedType === 'colors' && hexCode) {
        payload.hex_code = hexCode.trim();
      }

      if (editingId) {
        const { error } = await supabase
          .from(selectedType)
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        Alert.alert('Success', 'Attribute updated successfully');
      } else {
        const { error } = await supabase
          .from(selectedType)
          .insert(payload);

        if (error) throw error;
        Alert.alert('Success', 'Attribute created successfully');
      }

      resetForm();
      fetchAttributes();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save attribute');
    }
  };

  const handleEdit = (attribute: Attribute) => {
    setEditingId(attribute.id);
    setName(attribute.name);
    setDescription(attribute.description || '');
    setIcon(attribute.icon || '');
    setHexCode(attribute.hex_code || '');
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Attribute',
      'Are you sure you want to delete this attribute? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from(selectedType)
                .delete()
                .eq('id', id);

              if (error) throw error;
              Alert.alert('Success', 'Attribute deleted successfully');
              fetchAttributes();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete attribute');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('');
    setHexCode('');
    setEditingId(null);
    setShowAddForm(false);
  };

  const IconComponent = attributeConfig[selectedType].icon;

  return (
    <Box style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <VStack space="lg">
          {/* Type Selector */}
          <VStack space="md">
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Attribute Type</FormControlLabelText>
              </FormControlLabel>
              <Select
                selectedValue={selectedType}
                onValueChange={(value) => {
                  setSelectedType(value as AttributeType);
                  resetForm();
                }}
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select type" />
                  <SelectIcon className="mr-3" as={ChevronDown} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {Object.entries(attributeConfig).map(([key, config]) => (
                      <SelectItem
                        key={key}
                        label={config.label}
                        value={key}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
            </FormControl>
          </VStack>

          {/* Add Button */}
          <Button
            onPress={() => setShowAddForm(!showAddForm)}
            size="sm"
            style={{ backgroundColor: attributeConfig[selectedType].color }}
          >
            <HStack space="xs" className="items-center">
              <Plus color="#ffffff" size={16} />
              <ButtonText>Add {attributeConfig[selectedType].label}</ButtonText>
            </HStack>
          </Button>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="p-4 bg-primary-50">
              <VStack space="md">
                <Heading className="text-base">
                  {editingId ? 'Edit' : 'Add New'} {attributeConfig[selectedType].label}
                </Heading>

                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Name *</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder={`e.g., ${selectedType === 'colors' ? 'Red' : 'Example'}`}
                      value={name}
                      onChangeText={setName}
                    />
                  </Input>
                </FormControl>

                {selectedType === 'colors' && (
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText>Hex Code</FormControlLabelText>
                    </FormControlLabel>
                    <Input>
                      <InputField
                        placeholder="#FF0000"
                        value={hexCode}
                        onChangeText={setHexCode}
                        maxLength={7}
                      />
                    </Input>
                  </FormControl>
                )}

                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Description</FormControlLabelText>
                  </FormControlLabel>
                  <Textarea>
                    <TextareaInput
                      placeholder="Optional description"
                      value={description}
                      onChangeText={setDescription}
                    />
                  </Textarea>
                </FormControl>

                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Icon (emoji)</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="e.g., 📱"
                      value={icon}
                      onChangeText={setIcon}
                      maxLength={2}
                    />
                  </Input>
                </FormControl>

                <HStack space="sm">
                  <Button
                    onPress={handleSaveAttribute}
                    className="flex-1 bg-success-600"
                  >
                    <ButtonText>{editingId ? 'Update' : 'Save'}</ButtonText>
                  </Button>
                  <Button
                    onPress={resetForm}
                    className="flex-1"
                    variant="outline"
                  >
                    <ButtonText>Cancel</ButtonText>
                  </Button>
                </HStack>
              </VStack>
            </Card>
          )}

          {/* Attributes List */}
          {loading ? (
            <Box className="flex-1 justify-center items-center py-8">
              <Spinner size="large" />
            </Box>
          ) : attributes.length === 0 ? (
            <Card className="p-8">
              <VStack space="md" className="items-center">
                <IconComponent color="#6b7280" size={48} />
                <Text className="text-center text-typography-600">
                  No {attributeConfig[selectedType].label.toLowerCase()} yet. Add your first one to get started.
                </Text>
              </VStack>
            </Card>
          ) : (
            <VStack space="md">
              {attributes.map((attribute) => (
                <Card key={attribute.id} className="p-4">
                  <HStack className="justify-between items-center">
                    <HStack space="sm" className="items-center flex-1">
                      {attribute.icon && (
                        <Text className="text-2xl">{attribute.icon}</Text>
                      )}
                      {selectedType === 'colors' && attribute.hex_code && (
                        <Box
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: attribute.hex_code,
                            borderWidth: 1,
                            borderColor: '#e5e7eb',
                          }}
                        />
                      )}
                      <VStack className="flex-1">
                        <Text className="font-semibold text-base">
                          {attribute.name}
                        </Text>
                        {attribute.description && (
                          <Text className="text-sm text-typography-600">
                            {attribute.description}
                          </Text>
                        )}
                      </VStack>
                    </HStack>

                    <HStack space="xs">
                      <TouchableOpacity onPress={() => handleEdit(attribute)}>
                        <Box className="p-2 bg-info-100 rounded-lg">
                          <Edit2 color="#0284c7" size={18} />
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(attribute.id)}>
                        <Box className="p-2 bg-error-100 rounded-lg">
                          <Trash2 color="#dc2626" size={18} />
                        </Box>
                      </TouchableOpacity>
                    </HStack>
                  </HStack>
                </Card>
              ))}
            </VStack>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};
