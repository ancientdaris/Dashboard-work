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
import { Badge, BadgeText } from '../../../components/ui/badge';
import { Spinner } from '../../../components/ui/spinner';
import { supabase } from '../../../lib/supabase';
import { Database } from '../../../lib/database.types';
import { Plus, Tag, Edit2, Trash2 } from 'lucide-react-native';

type Category = Database['public']['Tables']['categories']['Row'];

export const CategoriesScreen = ({ navigation }: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Category name is required');
      return;
    }

    try {
      if (editingId) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: name.trim(),
            description: description.trim() || null,
            icon: icon.trim() || null,
          })
          .eq('id', editingId);

        if (error) throw error;
        Alert.alert('Success', 'Category updated successfully');
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert({
            name: name.trim(),
            description: description.trim() || null,
            icon: icon.trim() || null,
          });

        if (error) throw error;
        Alert.alert('Success', 'Category created successfully');
      }

      // Reset form and refresh
      resetForm();
      fetchCategories();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || '');
    setIcon(category.icon || '');
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Delete Category',
      'Are you sure you want to delete this category? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

              if (error) throw error;
              Alert.alert('Success', 'Category deleted successfully');
              fetchCategories();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete category');
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
    setEditingId(null);
    setShowAddForm(false);
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-background-50">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="lg">
          {/* Header */}
          <HStack className="justify-between items-center">
            <Heading className="text-2xl">Product Categories</Heading>
            <Button
              onPress={() => setShowAddForm(!showAddForm)}
              size="sm"
              className="bg-primary-600"
            >
              <HStack space="xs" className="items-center">
                <Plus color="#ffffff" size={16} />
                <ButtonText>Add New</ButtonText>
              </HStack>
            </Button>
          </HStack>

          {/* Add/Edit Form */}
          {showAddForm && (
            <Card className="p-4 bg-primary-50">
              <VStack space="md">
                <Heading className="text-base">
                  {editingId ? 'Edit Category' : 'Add New Category'}
                </Heading>

                <FormControl>
                  <FormControlLabel>
                    <FormControlLabelText>Category Name *</FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="e.g., Electronics"
                      value={name}
                      onChangeText={setName}
                    />
                  </Input>
                </FormControl>

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
                    onPress={handleSaveCategory}
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

          {/* Categories List */}
          {categories.length === 0 ? (
            <Card className="p-8">
              <VStack space="md" className="items-center">
                <Tag color="#6b7280" size={48} />
                <Text className="text-center text-typography-600">
                  No categories yet. Add your first category to get started.
                </Text>
              </VStack>
            </Card>
          ) : (
            <VStack space="md">
              {categories.map((category) => (
                <Card key={category.id} className="p-4">
                  <HStack className="justify-between items-center">
                    <HStack space="sm" className="items-center flex-1">
                      {category.icon && (
                        <Text className="text-2xl">{category.icon}</Text>
                      )}
                      <VStack className="flex-1">
                        <Text className="font-semibold text-base">
                          {category.name}
                        </Text>
                        {category.description && (
                          <Text className="text-sm text-typography-600">
                            {category.description}
                          </Text>
                        )}
                      </VStack>
                    </HStack>

                    <HStack space="xs">
                      <TouchableOpacity onPress={() => handleEdit(category)}>
                        <Box className="p-2 bg-info-100 rounded-lg">
                          <Edit2 color="#0284c7" size={18} />
                        </Box>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(category.id)}>
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
      </Box>
    </ScrollView>
  );
};
