'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  BarChart3,
  Bed,
  BookOpen,
  Globe,
  Heart,
  HelpCircle,
  Map,
  Menu,
  Newspaper,
  Package,
  Phone,
  Users,
} from 'lucide-react';
import type { TabType, UserRole } from '@/app/types';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { Dashboard } from './components/Dashboard';
import { DonationsList } from './components/DonationsList';
import { EmergencyContacts } from './components/EmergencyContacts';
import { FAQ } from './components/FAQ';
import { HelpRequestModal } from './components/HelpRequestModal';
import { MapOverview } from './components/MapOverview';
import { MyRequests } from './components/MyRequests';
import { NewsFeed } from './components/NewsFeed';
import { PreparationGuide } from './components/PreparationGuide';
import { RequestsList } from './components/RequestsList';
import { RiskAreas } from './components/RiskAreas';
import { SheltersList } from './components/SheltersList';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { VolunteerForm } from './components/VolunteerForm';
import { Weather } from './components/Weather';
import { initializeMockData } from './data/mockData';
import { EmergencyFooter } from './components/home/EmergencyFooter';
import { HeroSection } from './components/home/HeroSection';
import { HomeHeader } from './components/home/HomeHeader';
import { MenuOverlay } from './components/home/MenuOverlay';
import { SosControls } from './components/home/SosControls';
import { TabNavigation, type HomeTab } from './components/home/TabNavigation';

type MenuItem = HomeTab & { description?: string };

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'emergency',
    icon: Phone,
    label: 'หมายเลขฉุกเฉิน',
    description: 'หมายเลขติดต่อสำคัญ',
  },
  {
    id: 'guide',
    icon: BookOpen,
    label: 'คู่มือเตรียมพร้อม',
    description: 'แนวทางรับมือภัย',
  },
  {
    id: 'volunteer',
    icon: Users,
    label: 'อาสาสมัคร',
    description: 'ลงทะเบียนช่วยเหลือ',
  },
  {
    id: 'donations',
    icon: Package,
    label: 'ของบริจาค',
    description: 'สิ่งของที่ต้องการ',
  },
  {
    id: 'risk',
    icon: AlertTriangle,
    label: 'พื้นที่เสี่ยง',
    description: 'ข้อมูลพื้นที่เสี่ยงภัย',
  },
  {
    id: 'faq',
    icon: HelpCircle,
    label: 'คำถามที่พบบ่อย',
    description: 'FAQ และคำตอบ',
  },
  {
    id: 'my-requests',
    icon: AlertOctagon,
    label: 'คำขอของฉัน',
    description: 'คำขอที่คุณส่ง',
  },
  {
    id: 'weather',
    icon: Globe,
    label: 'สภาพอากาศ',
    description: 'ตรวจสอบสภาพอากาศ',
  },
  {
    id: 'dashboard',
    icon: BarChart3,
    label: 'แดชบอร์ด',
    description: 'ภาพรวมสถานการณ์',
  },
];

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('news');
  const [showMenu, setShowMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const darkMode = false;

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

  return (
    <AppContent
      userRole={userRole}
      setUserRole={setUserRole}
      showLogin={showLogin}
      setShowLogin={setShowLogin}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      showMenu={showMenu}
      setShowMenu={setShowMenu}
      showHelpModal={showHelpModal}
      setShowHelpModal={setShowHelpModal}
      darkMode={darkMode}
    />
  );
}

type AppContentProps = {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  showMenu: boolean;
  setShowMenu: (show: boolean | ((prev: boolean) => boolean)) => void;
  showHelpModal: boolean;
  setShowHelpModal: (show: boolean) => void;
  darkMode: boolean;
};

function AppContent({
  userRole,
  setUserRole,
  showLogin,
  setShowLogin,
  activeTab,
  setActiveTab,
  showMenu,
  setShowMenu,
  showHelpModal,
  setShowHelpModal,
  darkMode,
}: AppContentProps) {
  const mainTabs = useMemo<HomeTab[]>(
    () => [
      { id: 'news', icon: Newspaper, label: 'ข่าวสาร' },
      { id: 'status', icon: Heart, label: 'ติดตามสถานะ' },
      { id: 'shelters', icon: Bed, label: 'ที่พักพิง' },
      { id: 'map', icon: Map, label: 'แผนที่' },
    ],
    []
  );

  const handleLogin = (role: 'admin' | 'volunteer') => {
    setUserRole(role);
    setShowLogin(false);
  };

  if (showLogin && userRole === 'user') {
    return (
      <AdminLogin onLogin={handleLogin} onBack={() => setShowLogin(false)} />
    );
  }

  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  if (userRole === 'volunteer') {
    return <VolunteerDashboard />;
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* <SosControls onRequest={() => setShowHelpModal(true)} /> */}

      <HomeHeader title="ศูนย์ช่วยเหลือผู้ประสบภัย" />

      <HeroSection
        darkMode={darkMode}
        onRequest={() => setShowHelpModal(true)}
      />

      {/* <TabNavigation
        tabs={mainTabs}
        activeTab={activeTab}
        menuLabel="เมนูเพิ่มเติม"
        menuIcon={Menu}
        showMenu={showMenu}
        onSelect={tab => {
          setActiveTab(tab);
          setShowMenu(false);
        }}
        onToggleMenu={() => setShowMenu(prev => !prev)}
      />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-6 lg:px-8">
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

      <EmergencyFooter
        emergencyLabel="กรณีฉุกเฉิน โทร"
        loginLabel="เข้าสู่ระบบ"
        orLabel="หรือ"
        onLogin={() => setShowLogin(true)}
      /> */}

      {/* <MenuOverlay
        open={showMenu}
        menuLabel="เมนูเพิ่มเติม"
        items={MENU_ITEMS}
        activeTab={activeTab}
        onSelect={tab => {
          setActiveTab(tab);
          setShowMenu(false);
        }}
        onClose={() => setShowMenu(false)}
      /> */}

      <HelpRequestModal open={showHelpModal} onOpenChange={setShowHelpModal} />
    </div>
  );
}
