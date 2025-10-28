import React, { useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';
import { Box } from '../../../../components/ui/box';
import { VStack } from '../../../../components/ui/vstack';
import { HStack } from '../../../../components/ui/hstack';
import { Button, ButtonText } from '../../../../components/ui/button';
import { Input, InputField } from '../../../../components/ui/input';
import { FormControl, FormControlLabel, FormControlLabelText, FormControlError, FormControlErrorText } from '../../../../components/ui/form-control';
import { Textarea, TextareaInput } from '../../../../components/ui/textarea';
import { Heading } from '../../../../components/ui/heading';
import { Text } from '../../../../components/ui/text';
import { Alert, AlertText } from '../../../../components/ui/alert';
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator, SelectItem } from '../../../../components/ui/select';
import { ChevronDown, ChevronLeft, Upload, FileCheck, X } from 'lucide-react-native';
import { supabase } from '../../../../lib/supabase';
import { Database } from '../../../../lib/database.types';

type BusinessType = Database['public']['Enums']['business_type_enum'];

interface DocumentUpload {
  uri: string;
  name: string;
  type: string;
}

export const CreateRetailerScreen = ({ navigation }: any) => {
  // Basic Information
  const [name, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('proprietorship');
  const [creditLimit, setCreditLimit] = useState('0');
  const [isActive, setIsActive] = useState(true);

  // Company Documents
  const [companyPanCard, setCompanyPanCard] = useState<DocumentUpload | null>(null);

  // Proprietorship Documents (any one)
  const [gstCertificate, setGstCertificate] = useState<DocumentUpload | null>(null);
  const [udhyamAadhar, setUdhyamAadhar] = useState<DocumentUpload | null>(null);
  const [gumastaCertificate, setGumastaCertificate] = useState<DocumentUpload | null>(null);

  // Private Limited / LLP Documents (any one)
  const [aoaDocument, setAoaDocument] = useState<DocumentUpload | null>(null);
  const [moaDocument, setMoaDocument] = useState<DocumentUpload | null>(null);
  const [certificateOfIncorporation, setCertificateOfIncorporation] = useState<DocumentUpload | null>(null);
  const [cinNumber, setCinNumber] = useState('');

  // Owner Documents
  const [ownerPanCard, setOwnerPanCard] = useState<DocumentUpload | null>(null);
  const [ownerAadharCardFront, setOwnerAadharCardFront] = useState<DocumentUpload | null>(null);
  const [ownerAadharCardBack, setOwnerAadharCardBack] = useState<DocumentUpload | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const pickDocument = async (setDoc: (doc: DocumentUpload | null) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setDoc({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const pickImage = async (setDoc: (doc: DocumentUpload | null) => void) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setErrorMessage('Permission to access media library is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      const fileExt = asset.uri.split('.').pop()?.toLowerCase() || 'jpg';
      setDoc({
        uri: asset.uri,
        name: `image_${Date.now()}.${fileExt}`,
        type: `image/${fileExt}`,
      });
    }
  };

  const uploadDocument = async (doc: DocumentUpload, path: string): Promise<string | null> => {
    try {
      // Read file as base64
      const base64 = await FileSystem.readAsStringAsync(doc.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(base64);

      const fileExt = doc.name.split('.').pop();
      const fileName = `${path}_${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(filePath, arrayBuffer, {
          contentType: doc.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;
      return filePath;
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleCreateRetailer = async () => {
    setErrorMessage('');

    // Validation
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
    if (!email || !password) {
      setErrorMessage('Email and password are required for retailer login');
      return;
    }
    if (!companyPanCard) {
      setErrorMessage('Company PAN card is required');
      return;
    }
    if (!ownerPanCard) {
      setErrorMessage('Owner PAN card is required');
      return;
    }
    if (!ownerAadharCardFront) {
      setErrorMessage('Owner Aadhar card (front) is required');
      return;
    }
    if (!ownerAadharCardBack) {
      setErrorMessage('Owner Aadhar card (back) is required');
      return;
    }

    // Business type specific validation
    if (businessType === 'proprietorship') {
      if (!gstCertificate && !udhyamAadhar && !gumastaCertificate) {
        setErrorMessage('For Proprietorship: Provide at least one document (GST Certificate, Udhyam Aadhar, or Gumasta Certificate)');
        return;
      }
    } else if (businessType === 'private_limited' || businessType === 'llp') {
      if (!aoaDocument && !moaDocument && !certificateOfIncorporation) {
        setErrorMessage('For Private Limited/LLP: Provide at least one document (AOA, MOA, or Certificate of Incorporation)');
        return;
      }
    }

    setLoading(true);

    try {
      // Save current admin session to restore later
      const { data: { session: adminSession } } = await supabase.auth.getSession();

      let userId = null;

      // Create auth user for retailer (this will change the session)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: ownerName,
            user_type: 'retailer',
          },
        },
      });

      if (authError) throw authError;
      userId = authData.user?.id || null;

      // Upload documents
      const companyPanPath = companyPanCard ? await uploadDocument(companyPanCard, `retailers/${userId}/company_pan`) : null;
      const ownerPanPath = ownerPanCard ? await uploadDocument(ownerPanCard, `retailers/${userId}/owner_pan`) : null;
      const ownerAadharFrontPath = ownerAadharCardFront ? await uploadDocument(ownerAadharCardFront, `retailers/${userId}/owner_aadhar_front`) : null;
      const ownerAadharBackPath = ownerAadharCardBack ? await uploadDocument(ownerAadharCardBack, `retailers/${userId}/owner_aadhar_back`) : null;

      const gstCertPath = gstCertificate ? await uploadDocument(gstCertificate, `retailers/${userId}/gst_cert`) : null;
      const udhyamPath = udhyamAadhar ? await uploadDocument(udhyamAadhar, `retailers/${userId}/udhyam`) : null;
      const gumastaPath = gumastaCertificate ? await uploadDocument(gumastaCertificate, `retailers/${userId}/gumasta`) : null;

      const aoaPath = aoaDocument ? await uploadDocument(aoaDocument, `retailers/${userId}/aoa`) : null;
      const moaPath = moaDocument ? await uploadDocument(moaDocument, `retailers/${userId}/moa`) : null;
      const coiPath = certificateOfIncorporation ? await uploadDocument(certificateOfIncorporation, `retailers/${userId}/coi`) : null;

      // Create retailer record
      const { error } = await supabase.from('retailers').insert([{
        user_id: userId,
        name: name.trim(),
        owner_name: ownerName.trim(),
        email: email || null,
        mobile_number: mobileNumber.trim(),
        address: address.trim() || null,
        city: city.trim() || null,
        state: state.trim() || null,
        postal_code: postalCode.trim() || null,
        gst_number: gstNumber.trim() || null,
        business_type: businessType,
        credit_limit: parseFloat(creditLimit) || 0,
        outstanding_balance: 0,
        is_active: isActive,
        company_pan_card: companyPanPath,
        gst_certificate: gstCertPath,
        udhyam_aadhar: udhyamPath,
        gumasta_certificate: gumastaPath,
        aoa_document: aoaPath,
        moa_document: moaPath,
        certificate_of_incorporation: coiPath,
        cin_number: cinNumber.trim() || null,
        owner_pan_card: ownerPanPath,
        owner_aadhar_card_front: ownerAadharFrontPath,
        owner_aadhar_card_back: ownerAadharBackPath,
        kyc_status: 'submitted',
        kyc_submitted_at: new Date().toISOString(),
      }]);

      if (error) throw error;

      // Restore admin session (sign out the retailer and sign admin back in)
      if (adminSession) {
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token,
        });
      }

      setSuccessMessage('Retailer created successfully with KYC documents');
      setTimeout(() => navigation.goBack(), 2000);
    } catch (error: any) {
      setErrorMessage(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const DocumentUploadButton = ({
    label,
    document,
    onPick,
    onRemove,
    required = false
  }: {
    label: string;
    document: DocumentUpload | null;
    onPick: () => void;
    onRemove: () => void;
    required?: boolean;
  }) => (
    <FormControl>
      <FormControlLabel>
        <FormControlLabelText>{label} {required && <Text className="text-error-600">*</Text>}</FormControlLabelText>
      </FormControlLabel>
      {document ? (
        <HStack className="items-center justify-between p-3 bg-success-50 rounded-lg border border-success-300">
          <HStack space="sm" className="items-center flex-1">
            <FileCheck color="#16a34a" size={20} />
            <Text className="text-sm text-success-900 flex-1" numberOfLines={1}>{document.name}</Text>
          </HStack>
          <Button size="sm" variant="link" onPress={onRemove}>
            <X color="#dc2626" size={20} />
          </Button>
        </HStack>
      ) : (
        <Button onPress={onPick} variant="outline">
          <HStack space="sm" className="items-center">
            <Upload color="#6366f1" size={16} />
            <ButtonText>Upload {label}</ButtonText>
          </HStack>
        </Button>
      )}
    </FormControl>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Box className="p-4">
        <VStack space="md">
          <HStack className="items-center" space="md">
            <Button variant="link" onPress={() => navigation.goBack()} className="p-0">
              <ChevronLeft color="#6366f1" size={24} />
            </Button>
            <Heading className="text-2xl">Create New Retailer</Heading>
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

          {/* Basic Information */}
          <Heading className="text-lg mt-4">Basic Information</Heading>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Retailer Name <Text className="text-error-600">*</Text></FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Business/Shop name" value={name} onChangeText={setBusinessName} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Owner Name <Text className="text-error-600">*</Text></FormControlLabelText>
            </FormControlLabel>
            <Input>
              <InputField placeholder="Owner full name" value={ownerName} onChangeText={setOwnerName} />
            </Input>
          </FormControl>

          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Mobile Number <Text className="text-error-600">*</Text></FormControlLabelText>
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
              <FormControlLabelText>Email <Text className="text-error-600">*</Text></FormControlLabelText>
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
              <FormControlLabelText>Password <Text className="text-error-600">*</Text></FormControlLabelText>
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
              Retailer account will be created. You will remain logged in as admin.
            </Text>
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

          {/* Address Section */}
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

          {/* Company Documents */}
          <Heading className="text-lg mt-4">Company Documents</Heading>
          <Text className="text-sm text-typography-500">Company PAN card is mandatory</Text>

          <DocumentUploadButton
            label="Company PAN Card"
            document={companyPanCard}
            onPick={() => pickImage(setCompanyPanCard)}
            onRemove={() => setCompanyPanCard(null)}
            required
          />

          {/* Proprietorship Documents */}
          {businessType === 'proprietorship' && (
            <>
              <Heading className="text-lg mt-4">Proprietorship KYC Documents</Heading>
              <Text className="text-sm text-typography-500">Provide at least ONE of the following</Text>

              <DocumentUploadButton
                label="GST Certificate"
                document={gstCertificate}
                onPick={() => pickDocument(setGstCertificate)}
                onRemove={() => setGstCertificate(null)}
              />

              <DocumentUploadButton
                label="Udhyam Aadhar"
                document={udhyamAadhar}
                onPick={() => pickDocument(setUdhyamAadhar)}
                onRemove={() => setUdhyamAadhar(null)}
              />

              <DocumentUploadButton
                label="Gumasta Certificate"
                document={gumastaCertificate}
                onPick={() => pickDocument(setGumastaCertificate)}
                onRemove={() => setGumastaCertificate(null)}
              />
            </>
          )}

          {/* Private Limited / LLP Documents */}
          {(businessType === 'private_limited' || businessType === 'llp') && (
            <>
              <Heading className="text-lg mt-4">Company Registration Documents</Heading>
              <Text className="text-sm text-typography-500">Provide at least ONE of the following</Text>

              <DocumentUploadButton
                label="AOA (Articles of Association)"
                document={aoaDocument}
                onPick={() => pickDocument(setAoaDocument)}
                onRemove={() => setAoaDocument(null)}
              />

              <DocumentUploadButton
                label="MOA (Memorandum of Association)"
                document={moaDocument}
                onPick={() => pickDocument(setMoaDocument)}
                onRemove={() => setMoaDocument(null)}
              />

              <DocumentUploadButton
                label="Certificate of Incorporation"
                document={certificateOfIncorporation}
                onPick={() => pickDocument(setCertificateOfIncorporation)}
                onRemove={() => setCertificateOfIncorporation(null)}
              />

              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>CIN Number</FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField placeholder="Corporate Identity Number" value={cinNumber} onChangeText={setCinNumber} autoCapitalize="characters" />
                </Input>
              </FormControl>
            </>
          )}

          {/* Owner Documents */}
          <Heading className="text-lg mt-4">Owner Documents</Heading>
          <Text className="text-sm text-typography-500">All documents are mandatory</Text>

          <DocumentUploadButton
            label="Owner PAN Card"
            document={ownerPanCard}
            onPick={() => pickImage(setOwnerPanCard)}
            onRemove={() => setOwnerPanCard(null)}
            required
          />

          <DocumentUploadButton
            label="Owner Aadhar Card (Front)"
            document={ownerAadharCardFront}
            onPick={() => pickImage(setOwnerAadharCardFront)}
            onRemove={() => setOwnerAadharCardFront(null)}
            required
          />

          <DocumentUploadButton
            label="Owner Aadhar Card (Back)"
            document={ownerAadharCardBack}
            onPick={() => pickImage(setOwnerAadharCardBack)}
            onRemove={() => setOwnerAadharCardBack(null)}
            required
          />

          {/* Financial Settings */}
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

          <Button onPress={handleCreateRetailer} isDisabled={loading} className="mt-4 mb-8">
            <ButtonText>{loading ? 'Creating Retailer...' : 'Create Retailer with KYC'}</ButtonText>
          </Button>
        </VStack>
      </Box>
    </ScrollView>
  );
};
