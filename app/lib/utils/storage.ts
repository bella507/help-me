import { STORAGE_KEYS } from '../constants';
import type {
  HelpRequest,
  Volunteer,
  NewsItem,
  Shelter,
  RiskArea,
  DonationNeed,
  FAQItem,
  Notification,
} from '@/app/types';

// ========================================
// Generic Storage Utilities
// ========================================

export const storage = {
  // Generic getter
  get: <T>(key: string): T[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  // Generic setter
  set: <T>(key: string, value: T[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Generic item adder
  add: <T extends { id: string }>(key: string, item: T): void => {
    const items = storage.get<T>(key);
    items.push(item);
    storage.set(key, items);
  },

  // Generic item updater
  update: <T extends { id: string }>(
    key: string,
    id: string,
    updater: (item: T) => T
  ): void => {
    const items = storage.get<T>(key);
    const updatedItems = items.map((item) =>
      item.id === id ? updater(item) : item
    );
    storage.set(key, updatedItems);
  },

  // Generic item remover
  remove: <T extends { id: string }>(key: string, id: string): void => {
    const items = storage.get<T>(key);
    const filteredItems = items.filter((item) => item.id !== id);
    storage.set(key, filteredItems);
  },

  // Clear specific key
  clear: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  // Clear all app data
  clearAll: (): void => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  },
};

// ========================================
// Help Requests
// ========================================

export const requestStorage = {
  getAll: (): HelpRequest[] => storage.get<HelpRequest>(STORAGE_KEYS.HELP_REQUESTS),

  save: (requests: HelpRequest[]): void => storage.set(STORAGE_KEYS.HELP_REQUESTS, requests),

  add: (request: HelpRequest): void => storage.add(STORAGE_KEYS.HELP_REQUESTS, request),

  update: (id: string, updater: (request: HelpRequest) => HelpRequest): void =>
    storage.update(STORAGE_KEYS.HELP_REQUESTS, id, updater),

  remove: (id: string): void => storage.remove(STORAGE_KEYS.HELP_REQUESTS, id),

  getById: (id: string): HelpRequest | undefined => {
    const requests = requestStorage.getAll();
    return requests.find((r) => r.id === id);
  },

  getByStatus: (status: string): HelpRequest[] => {
    const requests = requestStorage.getAll();
    return requests.filter((r) => r.status === status);
  },
};

// ========================================
// Volunteers
// ========================================

export const volunteerStorage = {
  getAll: (): Volunteer[] => storage.get<Volunteer>(STORAGE_KEYS.VOLUNTEERS),

  save: (volunteers: Volunteer[]): void => storage.set(STORAGE_KEYS.VOLUNTEERS, volunteers),

  add: (volunteer: Volunteer): void => storage.add(STORAGE_KEYS.VOLUNTEERS, volunteer),

  update: (id: string, updater: (volunteer: Volunteer) => Volunteer): void =>
    storage.update(STORAGE_KEYS.VOLUNTEERS, id, updater),

  remove: (id: string): void => storage.remove(STORAGE_KEYS.VOLUNTEERS, id),

  getVerified: (): Volunteer[] => {
    const volunteers = volunteerStorage.getAll();
    return volunteers.filter((v) => v.verified);
  },
};

// ========================================
// News Items
// ========================================

export const newsStorage = {
  getAll: (): NewsItem[] => storage.get<NewsItem>(STORAGE_KEYS.NEWS_ITEMS),

  save: (news: NewsItem[]): void => storage.set(STORAGE_KEYS.NEWS_ITEMS, news),

  add: (item: NewsItem): void => storage.add(STORAGE_KEYS.NEWS_ITEMS, item),

  update: (id: string, updater: (item: NewsItem) => NewsItem): void =>
    storage.update(STORAGE_KEYS.NEWS_ITEMS, id, updater),

  remove: (id: string): void => storage.remove(STORAGE_KEYS.NEWS_ITEMS, id),

  getUrgent: (): NewsItem[] => {
    const news = newsStorage.getAll();
    return news.filter((n) => n.urgent);
  },
};

// ========================================
// Shelters
// ========================================

export const shelterStorage = {
  getAll: (): Shelter[] => storage.get<Shelter>(STORAGE_KEYS.SHELTERS),

  save: (shelters: Shelter[]): void => storage.set(STORAGE_KEYS.SHELTERS, shelters),

  add: (shelter: Shelter): void => storage.add(STORAGE_KEYS.SHELTERS, shelter),

  update: (id: string, updater: (shelter: Shelter) => Shelter): void =>
    storage.update(STORAGE_KEYS.SHELTERS, id, updater),

  remove: (id: string): void => storage.remove(STORAGE_KEYS.SHELTERS, id),

  getAvailable: (): Shelter[] => {
    const shelters = shelterStorage.getAll();
    return shelters.filter((s) => s.status === 'open' || s.status === 'available');
  },
};

// ========================================
// Risk Areas
// ========================================

export const riskStorage = {
  getAll: (): RiskArea[] => storage.get<RiskArea>(STORAGE_KEYS.RISK_AREAS),

  save: (risks: RiskArea[]): void => storage.set(STORAGE_KEYS.RISK_AREAS, risks),

  add: (risk: RiskArea): void => storage.add(STORAGE_KEYS.RISK_AREAS, risk),

  update: (id: string, updater: (risk: RiskArea) => RiskArea): void =>
    storage.update(STORAGE_KEYS.RISK_AREAS, id, updater),

  remove: (id: string): void => storage.remove(STORAGE_KEYS.RISK_AREAS, id),

  getCritical: (): RiskArea[] => {
    const risks = riskStorage.getAll();
    return risks.filter((r) => r.riskLevel === 'critical' || r.riskLevel === 'high');
  },
};

// ========================================
// Donations
// ========================================

export const donationStorage = {
  getAll: (): DonationNeed[] => storage.get<DonationNeed>(STORAGE_KEYS.DONATION_NEEDS),

  save: (donations: DonationNeed[]): void => storage.set(STORAGE_KEYS.DONATION_NEEDS, donations),

  add: (donation: DonationNeed): void => storage.add(STORAGE_KEYS.DONATION_NEEDS, donation),

  update: (id: string, updater: (donation: DonationNeed) => DonationNeed): void =>
    storage.update(STORAGE_KEYS.DONATION_NEEDS, id, updater),

  remove: (id: string): void => storage.remove(STORAGE_KEYS.DONATION_NEEDS, id),

  getNeeded: (): DonationNeed[] => {
    const donations = donationStorage.getAll();
    return donations.filter((d) => d.status === 'needed' || d.status === 'partial');
  },
};

// ========================================
// FAQs
// ========================================

export const faqStorage = {
  getAll: (): FAQItem[] => storage.get<FAQItem>(STORAGE_KEYS.FAQS),

  save: (faqs: FAQItem[]): void => storage.set(STORAGE_KEYS.FAQS, faqs),

  add: (faq: FAQItem): void => storage.add(STORAGE_KEYS.FAQS, faq),

  update: (id: string, updater: (faq: FAQItem) => FAQItem): void =>
    storage.update(STORAGE_KEYS.FAQS, id, updater),

  remove: (id: string): void => storage.remove(STORAGE_KEYS.FAQS, id),
};

// ========================================
// Notifications
// ========================================

export const notificationStorage = {
  getAll: (): Notification[] => storage.get<Notification>(STORAGE_KEYS.NOTIFICATIONS),

  save: (notifications: Notification[]): void =>
    storage.set(STORAGE_KEYS.NOTIFICATIONS, notifications),

  add: (notification: Notification): void =>
    storage.add(STORAGE_KEYS.NOTIFICATIONS, notification),

  markAsRead: (id: string): void => {
    storage.update(STORAGE_KEYS.NOTIFICATIONS, id, (notif) => ({
      ...notif,
      read: true,
    }));
  },

  getUnread: (): Notification[] => {
    const notifications = notificationStorage.getAll();
    return notifications.filter((n) => !n.read);
  },

  markAllAsRead: (): void => {
    const notifications = notificationStorage.getAll();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    notificationStorage.save(updated);
  },
};

// ========================================
// User Role
// ========================================

export const userStorage = {
  getRole: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
  },

  setRole: (role: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  },

  clearRole: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  },
};
