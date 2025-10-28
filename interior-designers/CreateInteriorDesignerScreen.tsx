import React, { useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import { Box } from '../../../../components/ui/box';
import { VStack } from '../../../../components/ui/vstack';
import { HStack } from '../../../../components/ui/hstack';
import { Button, ButtonText } from '../../../../components/ui/button';
import { Input, InputField } from '../../../../components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText } from '../../../../components/ui/form-control';
import { Textarea, TextareaInput } from '../../../../components/ui/textarea';
import { Heading } from '../../../../components/ui/heading';
import { Text } from '../../../../components/ui/text';
import { Alert, AlertText } from '../../../../components/ui/alert';
import { supabase } from '../../../../lib/supabase';
import { ChevronLeft } from 'lucide-react-native';

export const CreateInteriorDesignerScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [gstin, setGstin] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState('0');
  const [creditLimit, setCreditLimit] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreateDesigner = async () => {
    if (!name) {
      setErrorMessage('Designer name is required');
      return;
    }

    if (!email || !password) {
      setErrorMessage('Email and password are required');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      let userId = null;

      // Create auth user (required for all interior designers)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            user_type: 'interior_designer',
          },
        },
      });

      if (authError) throw authError;
      userId = authData.user?.id || null;

      // Create interior designer record
      const { error } = await supabase.from('interior_designers').insert([{
        user_id: userId,
        name,
        business_name: businessName || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        postal_code: postalCode || null,
        country: country || 'India',
        gstin: gstin || null,
        specialization: specialization || null,
        years_of_experience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
        portfolio_url: portfolioUrl || null,
        commission_percentage: parseFloat(commissionPercentage) || 0,
        credit_limit: parseFloat(creditLimit) || 0,
        outstanding_balance: 0,
        total_projects: 0,
        total_revenue: 0,
        is_active: isActive,
      }]);

      if (error) throw error;

      setSuccessMessage('Interior designer created successfully');
      setTimeout(() => navigation.goBack(), 1500);
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
          <HStack className="items-center" space="md">
            <Button
              variant="link"
              onPress={() => navigation.goBack()}
              className="p-0"
            >
              <ChevronLeft color="#6366f1" size={24} />
            </Button>
            <Heading className="text-2xl">Create Interior Designer</Heading>
          </HStack>

          {errorMessage && (
            <Alert className="bg-error-100 border border-error-500 rounded-lg p-4">
              <AlertText className="text-error-900">{errorMessage}</AlertText>
            </Alert>
          )}

          {successMessage && (
            <Alert className="bg-success-100 border border-success-500 rounded-lg p-4">
              <AlertText className="text-success-900">{successMessage}</AlertText>
            </Alert>
          )}

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Name *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Designer name" value={name} onChangeText={setName} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Business Name</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Design studio or firm name" value={businessName} onChangeText={setBusinessName} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Email *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Password *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="Password (min 6 characters)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </Input>
            <Text className="text-xs text-typography-500 mt-1">
              Auth account will be created automatically for interior designer login
            </Text>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Phone</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="Phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Address</FormControlLabelText>
            </FormControlLabel>
            <Textarea>
              <TextareaInput placeholder="Street address" value={address} onChangeText={setAddress} />
            </Textarea>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>City</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="City" value={city} onChangeText={setCity} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>State</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="State" value={state} onChangeText={setState} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Postal Code</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Postal code" value={postalCode} onChangeText={setPostalCode} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Country</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Country" value={country} onChangeText={setCountry} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>GSTIN</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="GST Identification Number" value={gstin} onChangeText={setGstin} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Specialization</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="e.g. Residential, Commercial, Hospitality, Retail"
                value={specialization}
                onChangeText={setSpecialization}
              />
            </Input>
            <Text className="text-xs text-typography-500 mt-1">
              Enter design specialization area
            </Text>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Years of Experience</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0"
                value={yearsOfExperience}
                onChangeText={setYearsOfExperience}
                keyboardType="number-pad"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Portfolio URL</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="https://portfolio.example.com"
                value={portfolioUrl}
                onChangeText={setPortfolioUrl}
                keyboardType="url"
                autoCapitalize="none"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Commission Percentage</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0.00"
                value={commissionPercentage}
                onChangeText={setCommissionPercentage}
                keyboardType="decimal-pad"
              />
            </Input>
            <Text className="text-xs text-typography-500 mt-1">
              Percentage commission on projects
            </Text>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Credit Limit</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0.00"
                value={creditLimit}
                onChangeText={setCreditLimit}
                keyboardType="decimal-pad"
              />
            </Input>
          </FormControl>

          <FormControl>
            <HStack className="items-center justify-between">
              <FormControlLabel>
                <FormControlLabelText>Active</FormControlLabelText>
              </FormControlLabel>
              <Switch value={isActive} onValueChange={setIsActive} />
            </HStack>
          </FormControl>

          <Button onPress={handleCreateDesigner} isDisabled={loading} className="mt-4">
            <ButtonText>{loading ? 'Creating...' : 'Create Interior Designer'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};
