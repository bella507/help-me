'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  BarChart3,
  Bed,
  BookOpen,
  Heart,
  FileText,
  Globe,
  HelpCircle,
  Map,
  Menu,
  Newspaper,
  Package,
  Phone,
  Users,
} from 'lucide-react';
import type { Language, TabType, UserRole } from '@/app/types';
import { HelpRequestForm } from './components/HelpRequestForm';
import { NewsFeed } from './components/NewsFeed';
import { RequestsList } from './components/RequestsList';
import { SheltersList } from './components/SheltersList';
import { MapOverview } from './components/MapOverview';
import { EmergencyContacts } from './components/EmergencyContacts';
import { PreparationGuide } from './components/PreparationGuide';
import { VolunteerForm } from './components/VolunteerForm';
import { DonationsList } from './components/DonationsList';
import { FAQ } from './components/FAQ';
import { RiskAreas } from './components/RiskAreas';
import { MyRequests } from './components/MyRequests';
import { Weather } from './components/Weather';
import { Dashboard } from './components/Dashboard';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { Toaster } from './components/ui/sonner';
import { initializeMockData } from './data/mockData';
import { HomeHeader } from './components/home/HomeHeader';
import { HeroSection } from './components/home/HeroSection';
import { TabNavigation, type HomeTab } from './components/home/TabNavigation';
import { MenuOverlay } from './components/home/MenuOverlay';
import { SosControls } from './components/home/SosControls';
import { EmergencyFooter } from './components/home/EmergencyFooter';

type MenuItem = HomeTab & { description?: string };

const TRANSLATIONS: Record<
  Language,
  {
    title: string;
    subtitle: string;
    request: string;
    news: string;
    status: string;
    shelters: string;
    map: string;
    menu: string;
    emergency: string;
    sos: string;
  }
> = {
  th: {
    title: 'ศูนย์ช่วยเหลือผู้ประสบภัย',
    subtitle: 'พร้อมดูแลคุณตลอด 24 ชม.',
    request: 'ขอความช่วยเหลือ',
    news: 'ข่าวสาร',
    status: 'ติดตามสถานะ',
    shelters: 'ที่พักพิง',
    map: 'แผนที่',
    menu: 'เมนูเพิ่มเติม',
    emergency: 'กรณีฉุกเฉิน โทร',
    sos: 'SOS ฉุกเฉิน',
  },
  en: {
    title: 'Disaster Relief Center',
    subtitle: '24/7 Support Available',
    request: 'Request Help',
    news: 'News',
    status: 'Track Status',
    shelters: 'Shelters',
    map: 'Map',
    menu: 'More',
    emergency: 'Emergency Call',
    sos: 'SOS Emergency',
  },
};

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('request');
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('th');

  useEffect(() => {
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);

    const roleTimeout = window.setTimeout(() => {
      const storedRole = localStorage.getItem('userRole');
      if (storedRole === 'admin' || storedRole === 'volunteer') {
        setUserRole(storedRole as UserRole);
      }
    }, 0);

    const loginTimeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('login') === 'true') {
        setShowLogin(true);
      }
    }, 0);

    initializeMockData();

    return () => {
      window.clearTimeout(roleTimeout);
      window.clearTimeout(loginTimeout);
    };
  }, []);

  const t = TRANSLATIONS[language];

  const mainTabs = useMemo<HomeTab[]>(
    () => [
      { id: 'request', icon: FileText, label: t.request },
      { id: 'news', icon: Newspaper, label: t.news },
      { id: 'status', icon: Heart, label: t.status },
      { id: 'shelters', icon: Bed, label: t.shelters },
      { id: 'map', icon: Map, label: t.map },
    ],
    [t]
  );

  const menuItems = useMemo<MenuItem[]>(
    () => [
      { id: 'emergency', icon: Phone, label: t.emergency, description: 'หมายเลขติดต่อสำคัญ' },
      { id: 'guide', icon: BookOpen, label: 'คู่มือเตรียมพร้อม', description: 'แนวทางรับมือภัย' },
      { id: 'volunteer', icon: Users, label: 'อาสาสมัคร', description: 'ลงทะเบียนช่วยเหลือ' },
      { id: 'donations', icon: Package, label: 'ของบริจาค', description: 'สิ่งของที่ต้องการ' },
      { id: 'risk', icon: AlertTriangle, label: 'พื้นที่เสี่ยง', description: 'ข้อมูลพื้นที่เสี่ยงภัย' },
      { id: 'faq', icon: HelpCircle, label: 'คำถามที่พบบ่อย', description: 'FAQ และคำตอบ' },
      { id: 'my-requests', icon: AlertOctagon, label: 'คำขอของฉัน', description: 'คำขอที่คุณส่ง' },
      { id: 'weather', icon: Globe, label: 'สภาพอากาศ', description: 'ตรวจสอบสภาพอากาศ' },
      { id: 'dashboard', icon: BarChart3, label: 'แดชบอร์ด', description: 'ภาพรวมสถานการณ์' },
    ],
    [t.emergency]
  );

  const handleLogin = (role: 'admin' | 'volunteer') => {
    setUserRole(role);
    setShowLogin(false);
  };

  if (showLogin && userRole === 'user') {
    return <AdminLogin onLogin={handleLogin} onBack={() => setShowLogin(false)} />;
  }

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  if (userRole === 'volunteer') {
    return <VolunteerDashboard />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <SosControls onRequest={() => setActiveTab('request')} />

      <HomeHeader
        darkMode={darkMode}
        language={language}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
        onToggleLanguage={() => setLanguage((prev) => (prev === 'th' ? 'en' : 'th'))}
      />

      <HeroSection darkMode={darkMode} onRequest={() => setActiveTab('request')} />

      <TabNavigation
        tabs={mainTabs}
        activeTab={activeTab}
        menuLabel={t.menu}
        menuIcon={Menu}
        showMenu={showMenu}
        onSelect={(tab) => {
          setActiveTab(tab);
          setShowMenu(false);
        }}
        onToggleMenu={() => setShowMenu((prev) => !prev)}
      />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-6 lg:px-8">
        {activeTab === 'request' && <HelpRequestForm />}
        {activeTab === 'news' && <NewsFeed />}
        {activeTab === 'status' && <RequestsList />}
        {activeTab === 'shelters' && <SheltersList />}
        {activeTab === 'map' && <MapOverview />}
        {activeTab === 'emergency' && <EmergencyContacts />}
        {activeTab === 'guide' && <PreparationGuide />}
        {activeTab === 'volunteer' && <VolunteerForm />}
        {activeTab === 'donations' && <DonationsList />}
        {activeTab === 'faq' && <FAQ />}
        {activeTab === 'risk' && <RiskAreas />}
        {activeTab === 'my-requests' && <MyRequests />}
        {activeTab === 'weather' && <Weather />}
        {activeTab === 'dashboard' && <Dashboard />}
      </main>

      <EmergencyFooter emergencyLabel={t.emergency} onLogin={() => setShowLogin(true)} />

      <MenuOverlay
        open={showMenu}
        menuLabel={t.menu}
        items={menuItems}
        activeTab={activeTab}
        onSelect={(tab) => {
          setActiveTab(tab);
          setShowMenu(false);
        }}
        onClose={() => setShowMenu(false)}
      />

      <Toaster position="top-center" richColors />
    </div>
  );
}
