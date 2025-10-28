import React, { useEffect, useState } from 'react';
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
import { Spinner } from '../../../../components/ui/spinner';
import { supabase } from '../../../../lib/supabase';
import { ChevronLeft } from 'lucide-react-native';

export const EditInteriorDesignerScreen = ({ route, navigation }: any) => {
  const { designerId } = route.params;
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [gstin, setGstin] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [commissionPercentage, setCommissionPercentage] = useState('0');
  const [creditLimit, setCreditLimit] = useState('0');
  const [outstandingBalance, setOutstandingBalance] = useState('0');
  const [totalProjects, setTotalProjects] = useState('0');
  const [totalRevenue, setTotalRevenue] = useState('0');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchDesigner();
  }, [designerId]);

  const fetchDesigner = async () => {
    try {
      const { data, error } = await supabase
        .from('interior_designers')
        .select('*')
        .eq('id', designerId)
        .single();

      if (error) throw error;

      setName(data.name || '');
      setBusinessName(data.business_name || '');
      setEmail(data.email || '');
      setPhone(data.phone || '');
      setAddress(data.address || '');
      setCity(data.city || '');
      setState(data.state || '');
      setPostalCode(data.postal_code || '');
      setCountry(data.country || '');
      setGstin(data.gstin || '');
      setSpecialization(data.specialization || '');
      setYearsOfExperience(data.years_of_experience?.toString() || '');
      setPortfolioUrl(data.portfolio_url || '');
      setCommissionPercentage(data.commission_percentage?.toString() || '0');
      setCreditLimit(data.credit_limit?.toString() || '0');
      setOutstandingBalance(data.outstanding_balance?.toString() || '0');
      setTotalProjects(data.total_projects?.toString() || '0');
      setTotalRevenue(data.total_revenue?.toString() || '0');
      setIsActive(data.is_active);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to fetch interior designer');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDesigner = async () => {
    if (!name) {
      setErrorMessage('Designer name is required');
      return;
    }

    setUpdating(true);
    setErrorMessage('');

    try {
      const { error } = await supabase
        .from('interior_designers')
        .update({
          name,
          business_name: businessName || null,
          email: email || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          state: state || null,
          postal_code: postalCode || null,
          country: country || null,
          gstin: gstin || null,
          specialization: specialization || null,
          years_of_experience: yearsOfExperience ? parseInt(yearsOfExperience) : null,
          portfolio_url: portfolioUrl || null,
          commission_percentage: parseFloat(commissionPercentage) || 0,
          credit_limit: parseFloat(creditLimit) || 0,
          outstanding_balance: parseFloat(outstandingBalance) || 0,
          total_projects: parseInt(totalProjects) || 0,
          total_revenue: parseFloat(totalRevenue) || 0,
          is_active: isActive,
        })
        .eq('id', designerId);

      if (error) throw error;

      setSuccessMessage('Interior designer updated successfully');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Operation failed');
    } finally {
      setUpdating(false);
    }
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
        <VStack space="md">
          <HStack className="items-center" space="md">
            <Button
              variant="link"
              onPress={() => navigation.goBack()}
              className="p-0"
            >
              <ChevronLeft color="#6366f1" size={24} />
            </Button>
            <Heading className="text-2xl">Edit Interior Designer</Heading>
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

          <Text className="text-lg font-bold text-typography-900 mt-2">Personal & Business Info</Text>

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
              <FormControlLabelText>Email</FormControlLabelText>
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

          <Text className="text-lg font-bold text-typography-900 mt-4">Professional Info</Text>

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

          <Text className="text-lg font-bold text-typography-900 mt-4">Financial Info</Text>

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
            <FormControlLabel>
              <FormControlLabelText>Outstanding Balance</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0.00"
                value={outstandingBalance}
                onChangeText={setOutstandingBalance}
                keyboardType="decimal-pad"
              />
            </Input>
          </FormControl>

          <Text className="text-lg font-bold text-typography-900 mt-4">Project Statistics</Text>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Total Projects</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0"
                value={totalProjects}
                onChangeText={setTotalProjects}
                keyboardType="number-pad"
              />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Total Revenue</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="0.00"
                value={totalRevenue}
                onChangeText={setTotalRevenue}
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

          <Button onPress={handleUpdateDesigner} isDisabled={updating} className="mt-4 mb-8">
            <ButtonText>{updating ? 'Updating...' : 'Update Interior Designer'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};
