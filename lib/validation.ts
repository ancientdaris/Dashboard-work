/**
 * Input validation and sanitization utilities to prevent injection and XSS attacks
 */

// HTML entity encoding map for XSS prevention
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Sanitize string input by encoding HTML entities to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return String(input).replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
}

/**
 * Validate and sanitize email input
 */
export function validateEmail(email: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(email.trim().toLowerCase());
  
  // Email regex pattern
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Email is required' };
  }
  
  if (sanitized.length > 254) {
    return { isValid: false, sanitized, error: 'Email is too long' };
  }
  
  if (!emailRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Invalid email format' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { isValid: boolean; error?: string } {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }
  
  if (password.length > 128) {
    return { isValid: false, error: 'Password is too long (max 128 characters)' };
  }
  
  // Check for at least one uppercase, one lowercase, and one number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return { 
      isValid: false, 
      error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    };
  }
  
  return { isValid: true };
}

/**
 * Validate and sanitize name input
 */
export function validateName(name: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(name.trim());
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Name is required' };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, sanitized, error: 'Name must be at least 2 characters long' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, sanitized, error: 'Name is too long (max 100 characters)' };
  }
  
  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s'-]+$/;
  if (!nameRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize mobile number
 */
export function validateMobileNumber(mobile: string): { isValid: boolean; sanitized: string; error?: string } {
  // Remove all non-digit characters for validation
  const digitsOnly = mobile.replace(/\D/g, '');
  
  if (!digitsOnly) {
    return { isValid: false, sanitized: '', error: 'Mobile number is required' };
  }
  
  // Indian mobile numbers: 10 digits, optionally with +91 country code
  if (digitsOnly.length === 10) {
    return { isValid: true, sanitized: digitsOnly };
  } else if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return { isValid: true, sanitized: digitsOnly.substring(2) };
  } else {
    return { isValid: false, sanitized: digitsOnly, error: 'Invalid mobile number format (must be 10 digits)' };
  }
}

/**
 * Validate and sanitize business name
 */
export function validateBusinessName(name: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(name.trim());
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'Business name is required' };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, sanitized, error: 'Business name must be at least 2 characters long' };
  }
  
  if (sanitized.length > 200) {
    return { isValid: false, sanitized, error: 'Business name is too long (max 200 characters)' };
  }
  
  // Allow alphanumeric, spaces, and common business characters
  const businessNameRegex = /^[a-zA-Z0-9\s.,'&()-]+$/;
  if (!businessNameRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Business name contains invalid characters' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize GST number
 */
export function validateGSTNumber(gst: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(gst.trim().toUpperCase());
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'GST number is required' };
  }
  
  // GST format: 2 digits (state code) + 10 alphanumeric (PAN) + 1 digit (entity number) + 1 letter (Z by default) + 1 alphanumeric (checksum)
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (!gstRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'Invalid GST number format' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate and sanitize city name
 */
export function validateCity(city: string): { isValid: boolean; sanitized: string; error?: string } {
  const sanitized = sanitizeInput(city.trim());
  
  if (!sanitized) {
    return { isValid: false, sanitized: '', error: 'City is required' };
  }
  
  if (sanitized.length < 2) {
    return { isValid: false, sanitized, error: 'City name must be at least 2 characters long' };
  }
  
  if (sanitized.length > 100) {
    return { isValid: false, sanitized, error: 'City name is too long (max 100 characters)' };
  }
  
  // Allow only letters, spaces, and hyphens
  const cityRegex = /^[a-zA-Z\s-]+$/;
  if (!cityRegex.test(sanitized)) {
    return { isValid: false, sanitized, error: 'City name can only contain letters, spaces, and hyphens' };
  }
  
  return { isValid: true, sanitized };
}

/**
 * Validate business type
 */
export function validateBusinessType(type: string | null): { isValid: boolean; error?: string } {
  if (!type) {
    return { isValid: false, error: 'Business type is required' };
  }
  
  const validTypes = ['retailer', 'wholesaler'];
  if (!validTypes.includes(type)) {
    return { isValid: false, error: 'Invalid business type' };
  }
  
  return { isValid: true };
}

/**
 * Comprehensive validation for signup form
 */
export interface SignUpValidation {
  isValid: boolean;
  errors: {
    fullName?: string;
    email?: string;
    mobileNumber?: string;
    password?: string;
    confirmPassword?: string;
    businessType?: string;
    businessName?: string;
    gstNumber?: string;
    city?: string;
  };
  sanitizedData: {
    fullName: string;
    email: string;
    mobileNumber: string;
    businessName: string;
    gstNumber: string;
    city: string;
  };
}

export function validateSignUpForm(data: {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  businessType: string | null;
  businessName: string;
  gstNumber: string;
  city: string;
}): SignUpValidation {
  const errors: SignUpValidation['errors'] = {};
  let isValid = true;

  // Validate full name
  const nameValidation = validateName(data.fullName);
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.error;
    isValid = false;
  }

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  // Validate mobile number
  const mobileValidation = validateMobileNumber(data.mobileNumber);
  if (!mobileValidation.isValid) {
    errors.mobileNumber = mobileValidation.error;
    isValid = false;
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error;
    isValid = false;
  }

  // Validate password confirmation
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  // Validate business type
  const businessTypeValidation = validateBusinessType(data.businessType);
  if (!businessTypeValidation.isValid) {
    errors.businessType = businessTypeValidation.error;
    isValid = false;
  }

  // Validate business name
  const businessNameValidation = validateBusinessName(data.businessName);
  if (!businessNameValidation.isValid) {
    errors.businessName = businessNameValidation.error;
    isValid = false;
  }

  // Validate GST number
  const gstValidation = validateGSTNumber(data.gstNumber);
  if (!gstValidation.isValid) {
    errors.gstNumber = gstValidation.error;
    isValid = false;
  }

  // Validate city
  const cityValidation = validateCity(data.city);
  if (!cityValidation.isValid) {
    errors.city = cityValidation.error;
    isValid = false;
  }

  return {
    isValid,
    errors,
    sanitizedData: {
      fullName: nameValidation.sanitized,
      email: emailValidation.sanitized,
      mobileNumber: mobileValidation.sanitized,
      businessName: businessNameValidation.sanitized,
      gstNumber: gstValidation.sanitized,
      city: cityValidation.sanitized,
    },
  };
}

/**
 * Comprehensive validation for signin form
 */
export interface SignInValidation {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
  sanitizedData: {
    email: string;
  };
}

export function validateSignInForm(data: {
  email: string;
  password: string;
}): SignInValidation {
  const errors: SignInValidation['errors'] = {};
  let isValid = true;

  // Validate email
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error;
    isValid = false;
  }

  // Basic password check (not full validation for signin)
  if (!data.password) {
    errors.password = 'Password is required';
    isValid = false;
  } else if (data.password.length > 128) {
    errors.password = 'Password is too long';
    isValid = false;
  }

  return {
    isValid,
    errors,
    sanitizedData: {
      email: emailValidation.sanitized,
    },
  };
}
