// ========================================
// Core Types
// ========================================

export interface HelpRequest {
  id: string;
  name: string;
  phone: string;
  location: string;
  category: string;
  urgency: 'high' | 'medium' | 'low';
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  assignedTo?: string;
  notes?: string;
  volunteerNotes?: string;
  specialNeeds?: SpecialNeeds;
  elderlyCount?: number;
  childrenCount?: number;
  disabledCount?: number;
  pregnantCount?: number;
  petsCount?: number;
  petsType?: string;
  medicalNeeds?: string;
  images?: string[];
}

export interface SpecialNeeds {
  elderly?: boolean;
  children?: boolean;
  disabled?: boolean;
  pregnant?: boolean;
  pets?: boolean;
  medical?: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  skills: string[] | string;
  availability: string;
  status: 'pending' | 'approved' | 'active' | 'inactive';
  assignedTasks: number;
  verified: boolean;
  createdAt: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupied: number;
  currentOccupancy?: number;
  contact: string;
  phone?: string;
  facilities: string[];
  status: 'open' | 'available' | 'limited' | 'full' | 'closed';
  lat?: number;
  lng?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  category?: string;
  type: 'warning' | 'update' | 'info';
  createdAt: string;
  author?: string;
  urgent: boolean;
}

export interface RiskArea {
  id: string;
  name: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  level?: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  estimatedAffected?: number;
  lastUpdated?: string;
}

export interface DonationNeed {
  id: string;
  item: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  quantity: string;
  status: 'needed' | 'partial' | 'fulfilled';
  unit?: string;
  needed?: number;
  received?: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ========================================
// Form Types
// ========================================

export interface HelpRequestFormData {
  name: string;
  phone: string;
  location: string;
  category: string;
  urgency: string;
  description: string;
  elderlyCount: number;
  childrenCount: number;
  disabledCount: number;
  pregnantCount: number;
  petsCount: number;
  petsType: string;
  medicalNeeds: string;
  images: string[];
}

export interface VolunteerFormData {
  name: string;
  phone: string;
  email: string;
  skills: string[];
  availability: string;
}

// ========================================
// UI Types
// ========================================

export type TabType =
  | 'request'
  | 'news'
  | 'status'
  | 'shelters'
  | 'map'
  | 'emergency'
  | 'guide'
  | 'volunteer'
  | 'donations'
  | 'faq'
  | 'risk'
  | 'my-requests'
  | 'weather'
  | 'dashboard';

export type Language = 'th' | 'en';

export type UserRole = 'user' | 'admin' | 'volunteer';

export type AdminTab =
  | 'overview'
  | 'requests'
  | 'volunteers'
  | 'news'
  | 'shelters'
  | 'risks'
  | 'donations'
  | 'faq'
  | 'notifications'
  | 'settings';

// ========================================
// Utility Types
// ========================================

export type RequestStatus = 'pending' | 'in-progress' | 'completed';
export type UrgencyLevel = 'low' | 'medium' | 'high';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
