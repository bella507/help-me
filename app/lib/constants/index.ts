// ========================================
// Emergency Numbers
// ========================================

export const EMERGENCY_NUMBERS = {
  POLICE: '191',
  AMBULANCE: '1669',
  DISASTER_CENTER: '1784',
  FIRE: '199',
  HEALTH_HOTLINE: '1422',
} as const;

export const EMERGENCY_CONTACTS = [
  {
    number: EMERGENCY_NUMBERS.POLICE,
    label: 'แจ้งเหตุฉุกเฉิน',
    description: 'ตำรวจ เหตุร้าย อัคคีภัย',
    color: 'red',
  },
  {
    number: EMERGENCY_NUMBERS.AMBULANCE,
    label: 'รถฉุกเฉินการแพทย์',
    description: 'เจ็บป่วย บาดเจ็บ',
    color: 'blue',
  },
  {
    number: EMERGENCY_NUMBERS.DISASTER_CENTER,
    label: 'ศูนย์ช่วยเหลือภัย',
    description: 'น้ำท่วม แผ่นดินไหว',
    color: 'orange',
  },
] as const;

// ========================================
// Status Constants
// ========================================

export const REQUEST_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
} as const;

export const URGENCY_LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

// ========================================
// Categories
// ========================================

export const HELP_CATEGORIES = {
  FOOD: 'food',
  SHELTER: 'shelter',
  MEDICAL: 'medical',
  CLOTHING: 'clothing',
  EVACUATION: 'evacuation',
  TRANSPORTATION: 'transportation',
  OTHER: 'other',
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  food: 'อาหารและน้ำดื่ม',
  shelter: 'ที่พักพิง',
  medical: 'การรักษาพยาบาล',
  clothing: 'เสื้อผ้า',
  evacuation: 'ขอการอพยพ',
  transportation: 'ยานพาหนะ',
  other: 'อื่นๆ',
};

export const STATUS_LABELS: Record<string, string> = {
  pending: 'รอดำเนินการ',
  'in-progress': 'กำลังดำเนินการ',
  completed: 'เสร็จสิ้น',
};

export const URGENCY_LABELS: Record<string, string> = {
  high: 'ด่วนมาก',
  medium: 'ปานกลาง',
  low: 'ไม่ด่วน',
};

export const RISK_LABELS: Record<string, string> = {
  low: 'ต่ำ',
  medium: 'ปานกลาง',
  high: 'สูง',
  critical: 'วิกฤต',
};

// ========================================
// LocalStorage Keys
// ========================================

export const STORAGE_KEYS = {
  HELP_REQUESTS: 'helpRequests',
  VOLUNTEERS: 'volunteers',
  NEWS_ITEMS: 'newsItems',
  SHELTERS: 'shelters',
  RISK_AREAS: 'riskAreas',
  DONATION_NEEDS: 'donationNeeds',
  FAQS: 'faqs',
  NOTIFICATIONS: 'notifications',
  USER_ROLE: 'userRole',
  USER_REQUESTS: 'userRequests',
} as const;

// ========================================
// UI Constants
// ========================================

export const COLORS = {
  PRIMARY: '#f9572b',
  PRIMARY_HOVER: '#e14a21',
} as const;

export const TOAST_DURATION = 3000;

// ========================================
// Form Validation
// ========================================

export const PHONE_REGEX = /^[0-9]{10}$/;
export const MIN_DESCRIPTION_LENGTH = 10;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES = 5;
