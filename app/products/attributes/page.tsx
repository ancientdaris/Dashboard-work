"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sidebar } from "@/components/layout/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { 
  ArrowLeft, 
  Plus, 
  Edit2, 
  Trash2, 
  Tag, 
  Layers, 
  Ruler, 
  Palette, 
  Sparkles, 
  Eye,
  Loader2,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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

export default function AttributesPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<AttributeType>('categories');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
      const supabase = createClient();
      const { data, error } = await supabase
        .from(selectedType)
        .select('*')
        .order('name');

      if (error) throw error;
      setAttributes(data || []);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to fetch attributes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAttribute = async () => {
    if (!name.trim()) {
      setErrorMessage('Name is required');
      return;
    }

    try {
      const supabase = createClient();
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
        setSuccessMessage('Attribute updated successfully');
      } else {
        const { error } = await supabase
          .from(selectedType)
          .insert(payload);

        if (error) throw error;
        setSuccessMessage('Attribute created successfully');
      }

      resetForm();
      fetchAttributes();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to save attribute');
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
    if (!confirm('Are you sure you want to delete this attribute? This action cannot be undone.')) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from(selectedType)
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccessMessage('Attribute deleted successfully');
      fetchAttributes();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to delete attribute');
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setIcon('');
    setHexCode('');
    setEditingId(null);
    setShowAddForm(false);
    setErrorMessage('');
  };

  const IconComponent = attributeConfig[selectedType].icon;

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8 max-w-full mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/products')}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Product Attributes</h1>
                <p className="text-muted-foreground mt-1">
                  Manage categories, sizes, colors, and other product attributes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="attributeType" className="text-sm font-medium">Attribute Type:</Label>
                <Select
                  value={selectedType}
                  onValueChange={(value) => {
                    setSelectedType(value as AttributeType);
                    resetForm();
                  }}
                >
                  <SelectTrigger id="attributeType" className="w-[180px]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(attributeConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {successMessage && (
              <Alert className="border-green-500 bg-green-50">
                <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
              </Alert>
            )}

            {/* Add Button */}
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ backgroundColor: attributeConfig[selectedType].color }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {attributeConfig[selectedType].label}
            </Button>

            {/* Add/Edit Form */}
            {showAddForm && (
              <Card className="border-2" style={{ borderColor: attributeConfig[selectedType].color }}>
                <CardHeader>
                  <CardTitle>
                    {editingId ? 'Edit' : 'Add New'} {attributeConfig[selectedType].label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      placeholder={`e.g., ${selectedType === 'colors' ? 'Red' : 'Example'}`}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  {selectedType === 'colors' && (
                    <div className="space-y-2">
                      <Label htmlFor="hexCode">Hex Code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="hexCode"
                          placeholder="#FF0000"
                          value={hexCode}
                          onChange={(e) => setHexCode(e.target.value)}
                          maxLength={7}
                        />
                        {hexCode && (
                          <div
                            className="w-12 h-10 rounded border border-gray-300"
                            style={{ backgroundColor: hexCode }}
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Optional description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon (emoji)</Label>
                    <Input
                      id="icon"
                      placeholder="e.g., 📱"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      maxLength={2}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveAttribute} className="flex-1">
                      {editingId ? 'Update' : 'Save'}
                    </Button>
                    <Button onClick={resetForm} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Attributes List */}
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : attributes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-4">
                  <IconComponent className="h-12 w-12 text-gray-400 mx-auto" />
                  <p className="text-muted-foreground">
                    No {attributeConfig[selectedType].label.toLowerCase()} yet. Add your first one to get started.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {attributes.map((attribute) => (
                  <Card key={attribute.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3 flex-1">
                          {attribute.icon && (
                            <span className="text-2xl">{attribute.icon}</span>
                          )}
                          {selectedType === 'colors' && attribute.hex_code && (
                            <div
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: attribute.hex_code }}
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-base">
                              {attribute.name}
                            </p>
                            {attribute.description && (
                              <p className="text-sm text-muted-foreground">
                                {attribute.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(attribute)}
                          >
                            <Edit2 className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(attribute.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
