'use client';

import { useEffect, useMemo, useState } from 'react';
import { unflatten } from '../utils/flattenMessages';
import {
  AlertOctagon,
  AlertTriangle,
  BarChart3,
  Bed,
  BookOpen,
  FileText,
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
import {
  NextIntlClientProvider,
  useTranslations,
  type AbstractIntlMessages,
} from 'next-intl';
import type { Language, TabType, UserRole } from '@/app/types';
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
import enMessages from '../messages/en.json';
import thMessages from '../messages/th.json';

type MenuItem = HomeTab & { description?: string };

type MenuCopy = {
  emergency: { label: string; description: string };
  guide: { label: string; description: string };
  volunteer: { label: string; description: string };
  donations: { label: string; description: string };
  risk: { label: string; description: string };
  faq: { label: string; description: string };
  myRequests: { label: string; description: string };
  weather: { label: string; description: string };
  dashboard: { label: string; description: string };
};

type HeroCopy = {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
  stats: { value: string; label: string }[];
  requestCta: string;
  callButton: string;
  callNumber: string;
  trust: { safe: string; reliable: string; helped: string };
  emergencyCardTitle: string;
  emergencyCardSubtitle: string;
  numbers: Array<{
    number: string;
    title: string;
    description: string;
    tone: 'red' | 'blue' | 'orange';
  }>;
};

type HeroCopyRaw = Omit<HeroCopy, 'stats'> & {
  stats: {
    openValue: string;
    openLabel: string;
    freeValue: string;
    freeLabel: string;
    responseValue: string;
    responseLabel: string;
  };
};

type SosCopy = {
  modalTitle: string;
  modalSubtitle: string;
  callPoliceTitle: string;
  callPoliceDesc: string;
  callMedicalTitle: string;
  callMedicalDesc: string;
  shareLabel: string;
  shareTitle: string;
  shareText: string;
  closeLabel: string;
};

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('news');
  const [showMenu, setShowMenu] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'th';
    const stored = localStorage.getItem('language');
    return stored === 'en' ? 'en' : 'th';
  });

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

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  // Load the appropriate messages based on language
  const rawMessages = language === 'en' ? enMessages : thMessages;

  // Convert the flat messages back to nested structure for easier use in components
  const messages = useMemo(
    () => unflatten(rawMessages) as AbstractIntlMessages,
    [rawMessages]
  );

  return (
    <NextIntlClientProvider
      locale={language}
      messages={messages}
      timeZone="Asia/Bangkok"
    >
      <AppContent
        userRole={userRole}
        setUserRole={setUserRole}
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        setLanguage={setLanguage}
        showHelpModal={showHelpModal}
        setShowHelpModal={setShowHelpModal}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
      />
    </NextIntlClientProvider>
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
  setDarkMode: (value: boolean | ((prev: boolean) => boolean)) => void;
  language: Language;
  setLanguage: (value: Language | ((prev: Language) => Language)) => void;
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
  const t = useTranslations('home');
  const heroRaw = t.raw('hero') as HeroCopyRaw;
  const heroCopy: HeroCopy = {
    ...heroRaw,
    stats: [
      { value: heroRaw.stats.openValue, label: heroRaw.stats.openLabel },
      { value: heroRaw.stats.freeValue, label: heroRaw.stats.freeLabel },
      {
        value: heroRaw.stats.responseValue,
        label: heroRaw.stats.responseLabel,
      },
    ],
  };
  const sosCopy = t.raw('sosCopy') as SosCopy;
  const menuCopy = t.raw('menuItems') as MenuCopy;

  const mainTabs = useMemo<HomeTab[]>(
    () => [
      { id: 'news', icon: Newspaper, label: t('news') },
      { id: 'status', icon: Heart, label: t('status') },
      { id: 'shelters', icon: Bed, label: t('shelters') },
      { id: 'map', icon: Map, label: t('map') },
    ],
    [t]
  );

  const menuItems = useMemo<MenuItem[]>(
    () => [
      {
        id: 'emergency',
        icon: Phone,
        label: menuCopy.emergency.label,
        description: menuCopy.emergency.description,
      },
      {
        id: 'guide',
        icon: BookOpen,
        label: menuCopy.guide.label,
        description: menuCopy.guide.description,
      },
      {
        id: 'volunteer',
        icon: Users,
        label: menuCopy.volunteer.label,
        description: menuCopy.volunteer.description,
      },
      {
        id: 'donations',
        icon: Package,
        label: menuCopy.donations.label,
        description: menuCopy.donations.description,
      },
      {
        id: 'risk',
        icon: AlertTriangle,
        label: menuCopy.risk.label,
        description: menuCopy.risk.description,
      },
      {
        id: 'faq',
        icon: HelpCircle,
        label: menuCopy.faq.label,
        description: menuCopy.faq.description,
      },
      {
        id: 'my-requests',
        icon: AlertOctagon,
        label: menuCopy.myRequests.label,
        description: menuCopy.myRequests.description,
      },
      {
        id: 'weather',
        icon: Globe,
        label: menuCopy.weather.label,
        description: menuCopy.weather.description,
      },
      {
        id: 'dashboard',
        icon: BarChart3,
        label: menuCopy.dashboard.label,
        description: menuCopy.dashboard.description,
      },
    ],
    [menuCopy]
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
      <SosControls copy={sosCopy} onRequest={() => setShowHelpModal(true)} />

      <HomeHeader title={t('title')} />

      <HeroSection
        darkMode={darkMode}
        onRequest={() => setShowHelpModal(true)}
        copy={heroCopy}
      />

      <TabNavigation
        tabs={mainTabs}
        activeTab={activeTab}
        menuLabel={t('menu')}
        menuIcon={Menu}
        showMenu={showMenu}
        onSelect={tab => {
          setActiveTab(tab);
          setShowMenu(false);
        }}
        onToggleMenu={() => setShowMenu(prev => !prev)}
      />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-6 lg:px-8">
        {/* {activeTab === 'request' && <HelpRequestForm />} */}
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
        emergencyLabel={t('emergency')}
        loginLabel={t('login')}
        orLabel={t('common.or')}
        onLogin={() => setShowLogin(true)}
      />

      <MenuOverlay
        open={showMenu}
        menuLabel={t('menu')}
        items={menuItems}
        activeTab={activeTab}
        onSelect={tab => {
          setActiveTab(tab);
          setShowMenu(false);
        }}
        onClose={() => setShowMenu(false)}
      />

      <HelpRequestModal open={showHelpModal} onOpenChange={setShowHelpModal} />
    </div>
  );
}
