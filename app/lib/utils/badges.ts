import { REQUEST_STATUS, URGENCY_LEVELS, RISK_LEVELS } from '../constants';

// ========================================
// Badge Configuration Types
// ========================================

export interface BadgeConfig {
  text: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  icon?: string;
}

// ========================================
// Status Badges
// ========================================

export function getStatusBadge(status: string): BadgeConfig {
  switch (status) {
    case REQUEST_STATUS.COMPLETED:
      return {
        icon: 'CheckCircle',
        text: 'เสร็จสิ้น',
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        borderClass: 'border-green-200',
      };
    case REQUEST_STATUS.IN_PROGRESS:
      return {
        icon: 'Clock',
        text: 'กำลังดำเนินการ',
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-200',
      };
    case REQUEST_STATUS.PENDING:
    default:
      return {
        icon: 'AlertCircle',
        text: 'รอดำเนินการ',
        bgClass: 'bg-orange-100',
        textClass: 'text-orange-700',
        borderClass: 'border-orange-200',
      };
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case REQUEST_STATUS.COMPLETED:
      return 'green';
    case REQUEST_STATUS.IN_PROGRESS:
      return 'blue';
    case REQUEST_STATUS.PENDING:
    default:
      return 'orange';
  }
}

// ========================================
// Urgency Badges
// ========================================

export function getUrgencyBadge(urgency: string): BadgeConfig {
  switch (urgency) {
    case URGENCY_LEVELS.HIGH:
      return {
        text: 'ด่วนมาก',
        bgClass: 'bg-red-100',
        textClass: 'text-red-700',
        borderClass: 'border-red-200',
      };
    case URGENCY_LEVELS.MEDIUM:
      return {
        text: 'ปานกลาง',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-700',
        borderClass: 'border-yellow-200',
      };
    case URGENCY_LEVELS.LOW:
    default:
      return {
        text: 'ไม่ด่วน',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-700',
        borderClass: 'border-gray-200',
      };
  }
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case URGENCY_LEVELS.HIGH:
      return 'red';
    case URGENCY_LEVELS.MEDIUM:
      return 'yellow';
    case URGENCY_LEVELS.LOW:
    default:
      return 'gray';
  }
}

// ========================================
// Risk Level Badges
// ========================================

export function getRiskBadge(level: string): BadgeConfig {
  switch (level) {
    case RISK_LEVELS.CRITICAL:
      return {
        text: 'วิกฤต',
        bgClass: 'bg-red-100',
        textClass: 'text-red-700',
        borderClass: 'border-red-200',
      };
    case RISK_LEVELS.HIGH:
      return {
        text: 'สูง',
        bgClass: 'bg-orange-100',
        textClass: 'text-orange-700',
        borderClass: 'border-orange-200',
      };
    case RISK_LEVELS.MEDIUM:
      return {
        text: 'ปานกลาง',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-700',
        borderClass: 'border-yellow-200',
      };
    case RISK_LEVELS.LOW:
    default:
      return {
        text: 'ต่ำ',
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        borderClass: 'border-green-200',
      };
  }
}

export function getRiskColor(level: string): string {
  switch (level) {
    case RISK_LEVELS.CRITICAL:
    case RISK_LEVELS.HIGH:
      return 'red';
    case RISK_LEVELS.MEDIUM:
      return 'yellow';
    case RISK_LEVELS.LOW:
    default:
      return 'green';
  }
}

// ========================================
// Shelter Status Badges
// ========================================

export function getShelterStatusBadge(status: string): BadgeConfig {
  switch (status) {
    case 'open':
    case 'available':
      return {
        text: 'เปิดให้บริการ',
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        borderClass: 'border-green-200',
      };
    case 'limited':
      return {
        text: 'เหลือที่จำกัด',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-700',
        borderClass: 'border-yellow-200',
      };
    case 'full':
      return {
        text: 'เต็ม',
        bgClass: 'bg-orange-100',
        textClass: 'text-orange-700',
        borderClass: 'border-orange-200',
      };
    case 'closed':
    default:
      return {
        text: 'ปิดให้บริการ',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-700',
        borderClass: 'border-gray-200',
      };
  }
}

// ========================================
// Donation Status Badges
// ========================================

export function getDonationStatusBadge(status: string): BadgeConfig {
  switch (status) {
    case 'needed':
      return {
        text: 'ต้องการ',
        bgClass: 'bg-red-100',
        textClass: 'text-red-700',
        borderClass: 'border-red-200',
      };
    case 'partial':
      return {
        text: 'ได้รับบางส่วน',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-700',
        borderClass: 'border-yellow-200',
      };
    case 'fulfilled':
      return {
        text: 'ครบแล้ว',
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        borderClass: 'border-green-200',
      };
    default:
      return {
        text: status,
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-700',
        borderClass: 'border-gray-200',
      };
  }
}

// ========================================
// Volunteer Status Badges
// ========================================

export function getVolunteerStatusBadge(status: string): BadgeConfig {
  switch (status) {
    case 'active':
      return {
        text: 'กำลังปฏิบัติงาน',
        bgClass: 'bg-green-100',
        textClass: 'text-green-700',
        borderClass: 'border-green-200',
      };
    case 'approved':
      return {
        text: 'อนุมัติแล้ว',
        bgClass: 'bg-blue-100',
        textClass: 'text-blue-700',
        borderClass: 'border-blue-200',
      };
    case 'pending':
      return {
        text: 'รออนุมัติ',
        bgClass: 'bg-yellow-100',
        textClass: 'text-yellow-700',
        borderClass: 'border-yellow-200',
      };
    case 'inactive':
    default:
      return {
        text: 'ไม่ได้ปฏิบัติงาน',
        bgClass: 'bg-gray-100',
        textClass: 'text-gray-700',
        borderClass: 'border-gray-200',
      };
  }
}
