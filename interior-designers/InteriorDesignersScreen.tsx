import React, { useEffect, useState } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Box } from '../../../components/ui/box';
import { VStack } from '../../../components/ui/vstack';
import { HStack } from '../../../components/ui/hstack';
import { Text } from '../../../components/ui/text';
import { Card } from '../../../components/ui/card';
import { Spinner } from '../../../components/ui/spinner';
import { Badge, BadgeText } from '../../../components/ui/badge';
import { Button, ButtonText } from '../../../components/ui/button';
import { Input, InputField } from '../../../components/ui/input';
import { supabase } from '../../../lib/supabase';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { InteriorDesignerDetailScreen } from './interior-designers/InteriorDesignerDetailScreen';
import { CreateInteriorDesignerScreen } from './interior-designers/CreateInteriorDesignerScreen';
import { EditInteriorDesignerScreen } from './interior-designers/EditInteriorDesignerScreen';
import { Palette, Briefcase, Award } from 'lucide-react-native';

interface InteriorDesigner {
  id: string;
  user_id: string | null;
  name: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  gstin: string | null;
  specialization: string | null;
  years_of_experience: number;
  portfolio_url: string | null;
  commission_percentage: number;
  credit_limit: number;
  outstanding_balance: number;
  total_projects: number;
  total_revenue: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const Stack = createNativeStackNavigator();

const InteriorDesignersListScreen = ({ navigation }: any) => {
  const [designers, setDesigners] = useState<InteriorDesigner[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDesigners = async () => {
    try {
      const { data, error } = await supabase
        .from('interior_designers')
        .select('*')
        .order('name');

      if (error) throw error;
      setDesigners(data || []);
    } catch (error) {
      console.error('Error fetching interior designers:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDesigners();
  }, []);

  const filteredDesigners = designers.filter((designer) =>
    designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    designer.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    designer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    designer.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    designer.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
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
              placeholder="Search designers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
          <Button onPress={() => navigation.navigate('CreateInteriorDesigner')}>
            <ButtonText>+ New</ButtonText>
          </Button>
        </HStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchDesigners(); }} />}
        >
          <VStack space="md" className="pb-20">
            {filteredDesigners.length === 0 ? (
              <Card className="p-8 items-center">
                <Palette color="#9ca3af" size={48} />
                <Text className="text-xl text-typography-600 mt-4">No interior designers found</Text>
              </Card>
            ) : (
              filteredDesigners.map((designer) => (
                <TouchableOpacity
                  key={designer.id}
                  onPress={() => navigation.navigate('InteriorDesignerDetail', { designerId: designer.id })}
                  activeOpacity={0.7}
                >
                  <Card className="p-4 bg-background-0 rounded-lg border border-outline-200">
                    <VStack space="sm">
                      <HStack className="justify-between items-start">
                        <VStack className="flex-1">
                          <Text className="font-semibold text-base text-typography-900">
                            {designer.name}
                          </Text>
                          {designer.business_name && (
                            <Text className="text-xs text-typography-600 mt-0.5">
                              {designer.business_name}
                            </Text>
                          )}
                          {designer.specialization && (
                            <HStack space="xs" className="items-center mt-1">
                              <Palette color="#6366f1" size={14} />
                              <Text className="text-xs text-typography-600">
                                {designer.specialization}
                              </Text>
                            </HStack>
                          )}
                          {designer.email && (
                            <Text className="text-xs text-typography-500 mt-0.5">
                              {designer.email}
                            </Text>
                          )}
                          {designer.phone && (
                            <Text className="text-xs text-typography-600 mt-0.5">
                              {designer.phone}
                            </Text>
                          )}
                        </VStack>
                        <Badge action={designer.is_active ? 'success' : 'muted'} className="ml-2">
                          <BadgeText className="text-xs">
                            {designer.is_active ? 'Active' : 'Inactive'}
                          </BadgeText>
                        </Badge>
                      </HStack>

                      <HStack className="justify-between items-center mt-2 pt-2 border-t border-outline-100">
                        <VStack>
                          <HStack space="xs" className="items-center">
                            <Briefcase color="#6366f1" size={14} />
                            <Text className="text-xs text-typography-500">
                              {designer.total_projects} Projects
                            </Text>
                          </HStack>
                          {designer.years_of_experience > 0 && (
                            <HStack space="xs" className="items-center mt-0.5">
                              <Award color="#10b981" size={14} />
                              <Text className="text-xs text-typography-500">
                                {designer.years_of_experience} Years Exp.
                              </Text>
                            </HStack>
                          )}
                        </VStack>
                        <VStack className="items-end">
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Commission
                          </Text>
                          <Text className="text-lg font-bold text-success-600 mt-0.5">
                            {Number(designer.commission_percentage).toFixed(1)}%
                          </Text>
                        </VStack>
                        <VStack className="items-end">
                          <Text className="text-xs text-typography-500 uppercase tracking-wide">
                            Revenue
                          </Text>
                          <Text className="text-lg font-bold text-typography-900 mt-0.5">
                            ${Number(designer.total_revenue).toFixed(0)}
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
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

export const InteriorDesignersScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: 'none',
      }}
    >
      <Stack.Screen
        name="InteriorDesignersList"
        component={InteriorDesignersListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InteriorDesignerDetail"
        component={InteriorDesignerDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateInteriorDesigner"
        component={CreateInteriorDesignerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditInteriorDesigner"
        component={EditInteriorDesignerScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
