import React, { useState, useEffect } from 'react';
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
import { Spinner } from '../../../../components/ui/spinner';
import { Alert, AlertText } from '../../../../components/ui/alert';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '../../../../components/ui/select';
import { Badge, BadgeText } from '../../../../components/ui/badge';
import { ChevronDown } from 'lucide-react-native';
import { supabase } from '../../../../lib/supabase';
import { Database } from '../../../../lib/database.types';

type Retailer = Database['public']['Tables']['retailers']['Row'];
type BusinessType = Database['public']['Enums']['business_type_enum'];

export const EditRetailerScreen = ({ route, navigation }: any) => {
  const { retailerId } = route.params;

  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('proprietorship');
  const [creditLimit, setCreditLimit] = useState('0');
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    fetchRetailer();
  }, [retailerId]);

  const fetchRetailer = async () => {
    try {
      const { data, error } = await supabase
        .from('retailers')
        .select('*')
        .eq('id', retailerId)
        .single();

      if (error || !data) {
        setErrorMessage('Failed to load retailer data');
        setLoading(false);
        return;
      }

      const retailerData = data as Retailer;
      setRetailer(retailerData);
      setName(retailerData.name);
      setOwnerName(retailerData.owner_name);
      setEmail(retailerData.email || '');
      setMobileNumber(retailerData.mobile_number || '');
      setAddress(retailerData.address || '');
      setCity(retailerData.city || '');
      setState(retailerData.state || '');
      setPostalCode(retailerData.postal_code || '');
      setGstNumber(retailerData.gst_number || '');
      setBusinessType(retailerData.business_type || 'proprietorship');
      setCreditLimit(retailerData.credit_limit?.toString() || '0');
      setIsActive(retailerData.is_active);
    } catch (error) {
      console.error('Error fetching retailer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRetailer = async () => {
    if (!name.trim()) {
      setErrorMessage('Retailer name is required');
      return;
    }
    if (!ownerName.trim()) {
      setErrorMessage('Owner name is required');
      return;
    }
    if (!mobileNumber.trim()) {
      setErrorMessage('Mobile number is required');
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase
        .from('retailers')
        .update({
          name: name.trim(),
          owner_name: ownerName.trim(),
          email: email.trim() || null,
          mobile_number: mobileNumber.trim(),
          address: address.trim() || null,
          city: city.trim() || null,
          state: state.trim() || null,
          postal_code: postalCode.trim() || null,
          gst_number: gstNumber.trim() || null,
          business_type: businessType,
          credit_limit: parseFloat(creditLimit) || 0,
          is_active: isActive,
        })
        .eq('id', retailerId);

      if (error) throw error;

      setSuccessMessage('Retailer updated successfully');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRetailer = async () => {
    setDeleting(true);

    try {
      const { error } = await supabase.from('retailers').delete().eq('id', retailerId);

      if (error) throw error;

      setSuccessMessage('Retailer deleted successfully');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error: any) {
      setErrorMessage(error.message || 'Operation failed');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Spinner className="text-xl" />
      </Box>
    );
  }

  if (!retailer) {
    return (
      <Box className="flex-1 justify-center items-center p-4">
        <Heading>Retailer not found</Heading>
      </Box>
    );
  }

  const getKYCBadgeColor = (status: string) => {
    switch (status) {
      case 'verified': return 'success';
      case 'submitted': return 'info';
      case 'rejected': return 'error';
      default: return 'warning';
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="md">
          <HStack className="justify-between items-center">
            <Heading className="text-2xl">Edit Retailer</Heading>
            <Badge action={getKYCBadgeColor(retailer.kyc_status)}>
              <BadgeText className="text-xs uppercase">KYC: {retailer.kyc_status}</BadgeText>
            </Badge>
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

          <Text className="text-xs text-info-600 bg-info-50 p-3 rounded">
            Note: KYC documents cannot be edited after creation. Contact support to update documents.
          </Text>

          {/* Basic Information */}
          <Heading className="text-lg mt-4">Basic Information</Heading>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Retailer Name *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Retailer name" value={name} onChangeText={setName} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Owner Name *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Owner name" value={ownerName} onChangeText={setOwnerName} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Mobile Number *</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField
                placeholder="Mobile number"
                value={mobileNumber}
                onChangeText={setMobileNumber}
                keyboardType="phone-pad"
              />
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
              <FormControlLabelText>Business Type</FormControlLabelText>
            </FormControlLabel>
            <Select selectedValue={businessType} onValueChange={(value) => setBusinessType(value as BusinessType)}>
              <SelectTrigger>
                <SelectInput placeholder="Select business type" />
                <SelectIcon>
                  <ChevronDown color="#6366f1" size={20} />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator />
                  </SelectDragIndicatorWrapper>
                  <SelectItem label="Proprietorship" value="proprietorship" />
                  <SelectItem label="Private Limited" value="private_limited" />
                  <SelectItem label="LLP" value="llp" />
                  <SelectItem label="Other" value="other" />
                </SelectContent>
              </SelectPortal>
            </Select>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>GST Number</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="GST Number" value={gstNumber} onChangeText={setGstNumber} autoCapitalize="characters" />
            </Input>
          </FormControl>

          {/* Address */}
          <Heading className="text-lg mt-4">Address</Heading>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Address</FormControlLabelText>
            </FormControlLabel>
            <Textarea>
              <TextareaInput placeholder="Street address" value={address} onChangeText={setAddress} />
            </Textarea>
          </FormControl>

          <HStack space="md">
            <FormControl className="flex-1">
              <FormControlLabel>
                <FormControlLabelText>City</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField placeholder="City" value={city} onChangeText={setCity} />
              </Input>
            </FormControl>

            <FormControl className="flex-1">
              <FormControlLabel>
                <FormControlLabelText>State</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField placeholder="State" value={state} onChangeText={setState} />
              </Input>
            </FormControl>
          </HStack>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Postal Code</FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Postal code" value={postalCode} onChangeText={setPostalCode} keyboardType="number-pad" />
            </Input>
          </FormControl>

          {/* Financial */}
          <Heading className="text-lg mt-4">Financial Settings</Heading>

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
                <FormControlLabelText>Active Status</FormControlLabelText>
              </FormControlLabel>
              <Switch value={isActive} onValueChange={setIsActive} />
            </HStack>
          </FormControl>

          {/* Action Buttons */}
          <HStack space="md" className="mt-4 mb-8">
            <Button className="flex-1" onPress={handleUpdateRetailer} isDisabled={saving || deleting}>
              <ButtonText>{saving ? 'Updating...' : 'Update Retailer'}</ButtonText>
            </Button>
            <Button
              className="flex-1"
              action="negative"
              onPress={handleDeleteRetailer}
              isDisabled={saving || deleting}
            >
              <ButtonText>{deleting ? 'Deleting...' : 'Delete'}</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Box>
    </ScrollView>
  );
};
