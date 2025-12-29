/**
 * Unified Authentication Validation Utilities
 * Supports both email and mobile number login
 */

// ============================================
// TYPES
// ============================================

export type IdentifierType = 'email' | 'mobile' | 'unknown';

export interface IdentifierValidation {
  type: IdentifierType;
  isValid: boolean;
  formattedValue: string;
  error?: string;
}

export interface MobileValidation {
  isValid: boolean;
  formattedNumber: string;
  error?: string;
}

export interface EmailValidation {
  isValid: boolean;
  formattedEmail: string;
  error?: string;
}

// ============================================
// CONSTANTS
// ============================================

export const INDIA_COUNTRY_CODE = '+91';
export const MOBILE_LENGTH = 10;
export const MIN_PASSWORD_LENGTH = 8;

// Regex patterns
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/; // Indian mobile: starts with 6-9, 10 digits
const DIGITS_ONLY_REGEX = /^\d+$/;

// ============================================
// IDENTIFIER DETECTION
// ============================================

/**
 * Detect whether input is email or mobile number
 */
export function detectIdentifierType(input: string): IdentifierType {
  const trimmed = input.trim();
  
  if (!trimmed) return 'unknown';
  
  // Contains @ means it's likely an email
  if (trimmed.includes('@')) {
    return 'email';
  }
  
  // Remove any prefix like +91 for checking
  const cleaned = cleanMobileNumber(trimmed);
  
  // If it contains only digits and is reasonable length, it's a mobile
  if (DIGITS_ONLY_REGEX.test(cleaned) && cleaned.length >= 10 && cleaned.length <= 12) {
    return 'mobile';
  }
  
  // Pure digits (even partial) suggest mobile
  if (DIGITS_ONLY_REGEX.test(trimmed)) {
    return 'mobile';
  }
  
  return 'unknown';
}

// ============================================
// EMAIL VALIDATION
// ============================================

/**
 * Validate email address
 */
export function validateEmail(email: string): EmailValidation {
  const trimmed = email.trim().toLowerCase();
  
  if (!trimmed) {
    return {
      isValid: false,
      formattedEmail: '',
      error: 'Email is required',
    };
  }
  
  if (!EMAIL_REGEX.test(trimmed)) {
    return {
      isValid: false,
      formattedEmail: trimmed,
      error: 'Enter a valid email address',
    };
  }
  
  return {
    isValid: true,
    formattedEmail: trimmed,
  };
}

// ============================================
// MOBILE NUMBER VALIDATION
// ============================================

/**
 * Clean mobile number - remove all non-digits except leading +
 */
export function cleanMobileNumber(input: string): string {
  // Remove spaces, dashes, parentheses
  let cleaned = input.replace(/[\s\-\(\)]/g, '');
  
  // Handle +91 prefix
  if (cleaned.startsWith('+91')) {
    cleaned = cleaned.substring(3);
  } else if (cleaned.startsWith('91') && cleaned.length === 12) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  return cleaned;
}

/**
 * Validate Indian mobile number
 */
export function validateMobileNumber(input: string): MobileValidation {
  const cleaned = cleanMobileNumber(input);
  
  if (!cleaned) {
    return {
      isValid: false,
      formattedNumber: '',
      error: 'Mobile number is required',
    };
  }
  
  if (!DIGITS_ONLY_REGEX.test(cleaned)) {
    return {
      isValid: false,
      formattedNumber: cleaned,
      error: 'Enter digits only',
    };
  }
  
  if (cleaned.length !== MOBILE_LENGTH) {
    return {
      isValid: false,
      formattedNumber: cleaned,
      error: `Enter ${MOBILE_LENGTH} digit mobile number`,
    };
  }
  
  if (!MOBILE_REGEX.test(cleaned)) {
    return {
      isValid: false,
      formattedNumber: cleaned,
      error: 'Enter a valid Indian mobile number',
    };
  }
  
  return {
    isValid: true,
    formattedNumber: `${INDIA_COUNTRY_CODE}${cleaned}`,
  };
}

/**
 * Format mobile number for display (xxx xxxxx xxxxx)
 */
export function formatMobileForDisplay(input: string): string {
  const cleaned = cleanMobileNumber(input);
  if (cleaned.length <= 5) {
    return cleaned;
  }
  return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
}

// ============================================
// UNIFIED IDENTIFIER VALIDATION
// ============================================

/**
 * Validate identifier (email or mobile) and return formatted value
 */
export function validateIdentifier(input: string): IdentifierValidation {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return {
      type: 'unknown',
      isValid: false,
      formattedValue: '',
      error: 'Email or mobile number is required',
    };
  }
  
  const type = detectIdentifierType(trimmed);
  
  if (type === 'email') {
    const emailResult = validateEmail(trimmed);
    return {
      type: 'email',
      isValid: emailResult.isValid,
      formattedValue: emailResult.formattedEmail,
      error: emailResult.error,
    };
  }
  
  if (type === 'mobile') {
    const mobileResult = validateMobileNumber(trimmed);
    return {
      type: 'mobile',
      isValid: mobileResult.isValid,
      formattedValue: mobileResult.formattedNumber,
      error: mobileResult.error,
    };
  }
  
  return {
    type: 'unknown',
    isValid: false,
    formattedValue: trimmed,
    error: 'Enter a valid email or mobile number',
  };
}

// ============================================
// PASSWORD VALIDATION
// ============================================

export interface PasswordValidation {
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

/**
 * Validate password against all requirements
 * SECURITY: Never log the actual password
 */
export function validatePassword(password: string): PasswordValidation {
  const hasMinLength = password.length >= MIN_PASSWORD_LENGTH;
  const hasUppercase = UPPERCASE_REGEX.test(password);
  const hasLowercase = LOWERCASE_REGEX.test(password);
  const hasNumber = NUMBER_REGEX.test(password);
  const hasSpecialChar = SPECIAL_CHAR_REGEX.test(password);

  const isValid =
    hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;

  return {
    isValid,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  };
}

/**
 * Check if passwords match
 * SECURITY: Never log passwords
 */
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

/**
 * Get password strength level for UI display
 */
export function getPasswordStrength(validation: PasswordValidation): 'weak' | 'medium' | 'strong' {
  const passedCount = [
    validation.hasMinLength,
    validation.hasUppercase,
    validation.hasLowercase,
    validation.hasNumber,
    validation.hasSpecialChar,
  ].filter(Boolean).length;

  if (passedCount <= 2) return 'weak';
  if (passedCount <= 4) return 'medium';
  return 'strong';
}

// ============================================
// TERMS VALIDATION
// ============================================

/**
 * Validate terms acceptance
 */
export function validateTermsAccepted(accepted: boolean): { isValid: boolean; error?: string } {
  if (!accepted) {
    return {
      isValid: false,
      error: 'Please accept Terms & Conditions to continue',
    };
  }
  return { isValid: true };
}
