// DISCOM Names
export const DISCOM_NAMES = [
  'MSEDCL',
  'Tata Power',
  'Adani Electricity',
  'BSES Rajdhani',
  'BSES Yamuna',
  'TPDDL',
  'NDMC',
  'Other',
] as const;

export type DiscomName = (typeof DISCOM_NAMES)[number];

// KYC Document Types
export const KYC_DOCUMENT_TYPES = [
  'aadhaar',
  'pan',
  'electricity_bill',
  'gst',
  'society_registration',
] as const;

// Energy Constants
export const ENERGY_INTERVAL_MINUTES = 15;
export const CARBON_SAVINGS_FACTOR = 0.82; // kg CO2 per kWh (India grid average)

// Trading Constants
export const MIN_SELL_PRICE = 0;
export const MAX_SELL_PRICE = 50; // INR per unit
export const DEFAULT_RESERVE_POWER = 40; // percentage

// Wallet Constants
export const MIN_WALLET_BALANCE = 0;
export const MAX_ENERGY_BALANCE = 10000; // kWh

// API Constants
export const API_TIMEOUT = 30000; // 30 seconds
export const OTP_RESEND_COOLDOWN = 30; // seconds

// Map Constants
export const DEFAULT_MAP_ZOOM = 12;
export const SEARCH_RADIUS_KM = 10; // default search radius

// Notification Types
export const NOTIFICATION_TYPES = {
  TRADE_ALERT: 'trade_alert',
  KYC_STATUS: 'kyc_status',
  FAULT_DETECTION: 'fault_detection',
  ORDER_STATUS: 'order_status',
} as const;

