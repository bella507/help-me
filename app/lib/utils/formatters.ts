// ========================================
// Date Formatters
// ========================================

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'เมื่อสักครู่';
  if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
  if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
  if (diffDays < 7) return `${diffDays} วันที่แล้ว`;

  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ========================================
// Phone Number Formatters
// ========================================

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format: 081-234-5678 or 02-123-4567
  if (cleaned.length === 10) {
    if (cleaned.startsWith('0')) {
      if (cleaned.startsWith('02')) {
        // Bangkok numbers: 02-123-4567
        return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
      }
      // Mobile numbers: 081-234-5678
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
  }

  // Return as-is if doesn't match expected format
  return phone;
}

export function cleanPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  return phone.replace(/\D/g, '');
}

// ========================================
// Number Formatters
// ========================================

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('th-TH').format(num);
}

export function formatPercentage(value: number, total: number): string {
  if (total === 0) return '0%';
  const percentage = (value / total) * 100;
  return `${Math.round(percentage)}%`;
}

// ========================================
// ID Generators
// ========================================

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function generateShortId(): string {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// ========================================
// Text Formatters
// ========================================

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

// ========================================
// Array Formatters
// ========================================

export function formatList(items: string[], max = 3): string {
  if (items.length === 0) return '';
  if (items.length <= max) return items.join(', ');

  const shown = items.slice(0, max);
  const remaining = items.length - max;
  return `${shown.join(', ')} และอีก ${remaining} รายการ`;
}

// ========================================
// Skill Array Formatter
// ========================================

export function formatSkills(skills: string[] | string): string[] {
  if (Array.isArray(skills)) {
    return skills;
  }
  return skills.split(',').map(s => s.trim());
}
