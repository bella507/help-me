'use client';
import { useState, useEffect } from 'react';
import {
  Heart,
  Newspaper,
  FileText,
  Phone,
  Bed,
  Map,
  BookOpen,
  Users,
  Package,
  HelpCircle,
  AlertTriangle,
  Menu,
  Moon,
  Sun,
  Globe,
  BarChart3,
  AlertOctagon,
  Share2,
  Shield,
} from 'lucide-react';
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
import { NotificationCenter } from './components/NotificationCenter';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { Toaster } from './components/ui/sonner';
import { initializeMockData } from './data/mockData';

type TabType =
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
type Language = 'th' | 'en';

export default function App() {
  const [userRole, setUserRole] = useState<'user' | 'admin' | 'volunteer'>(
    'user'
  );
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('request');
  const [showMenu, setShowMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<Language>('th');
  const [showSOS, setShowSOS] = useState(false);

  useEffect(() => {
    // Preconnect to Google Fonts
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link1);

    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);

    // Check if user is logged in as admin or volunteer
    const storedRole = localStorage.getItem('userRole');
    if (storedRole === 'admin' || storedRole === 'volunteer') {
      setUserRole(storedRole);
    }

    // Check for login parameter in URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
      setShowLogin(true);
    }

    // Initialize mock data
    initializeMockData();
  }, []);

  const handleLogin = (role: 'admin' | 'volunteer') => {
    setUserRole(role);
    setShowLogin(false);
  };

  // Show login page
  if (showLogin && userRole === 'user') {
    return (
      <AdminLogin onLogin={handleLogin} onBack={() => setShowLogin(false)} />
    );
  }

  // Show admin/volunteer dashboards
  if (userRole === 'admin') {
    return <AdminDashboard />;
  }

  if (userRole === 'volunteer') {
    return <VolunteerDashboard />;
  }

  const translations = {
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

  const t = translations[language];

  const mainTabs = [
    { id: 'request' as TabType, icon: FileText, label: t.request },
    { id: 'news' as TabType, icon: Newspaper, label: t.news },
    { id: 'status' as TabType, icon: Heart, label: t.status },
    { id: 'shelters' as TabType, icon: Bed, label: t.shelters },
    { id: 'map' as TabType, icon: Map, label: t.map },
  ];

  const menuItems = [
    {
      id: 'emergency' as TabType,
      icon: Phone,
      label: t.emergency,
      description: 'หมายเลขติดต่อสำคัญ',
    },
    {
      id: 'guide' as TabType,
      icon: BookOpen,
      label: 'คู่มือเตรียมพร้อม',
      description: 'แนวทางรับมือภัย',
    },
    {
      id: 'volunteer' as TabType,
      icon: Users,
      label: 'อาสาสมัคร',
      description: 'ลงทะเบียนช่วยเหลือ',
    },
    {
      id: 'donations' as TabType,
      icon: Package,
      label: 'ของบริจาค',
      description: 'สิ่งของที่ต้องการ',
    },
    {
      id: 'risk' as TabType,
      icon: AlertTriangle,
      label: 'พื้นที่เสี่ยง',
      description: 'ข้อมูลพื้นที่เสี่ยงภัย',
    },
    {
      id: 'faq' as TabType,
      icon: HelpCircle,
      label: 'คำถามที่พบบ่อย',
      description: 'FAQ และคำตอบ',
    },
    {
      id: 'my-requests' as TabType,
      icon: AlertOctagon,
      label: 'คำขอของฉัน',
      description: 'คำขอที่คุณส่ง',
    },
    {
      id: 'weather' as TabType,
      icon: Globe,
      label: 'สภาพอากาศ',
      description: 'ตรวจสอบสภาพอากาศ',
    },
    {
      id: 'dashboard' as TabType,
      icon: BarChart3,
      label: 'แดชบอร์ด',
      description: 'ภาพรวมสถานการณ์',
    },
  ];

  const handleMenuItemClick = (tabId: TabType) => {
    setActiveTab(tabId);
    setShowMenu(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* SOS Button - Floating */}
      <button
        onClick={() => setShowSOS(true)}
        className="fixed bottom-20 sm:bottom-28 right-4 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-red-600 hover:bg-red-700 rounded-full shadow-2xl flex items-center justify-center group animate-pulse hover:animate-none transition-all"
      >
        <AlertOctagon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
      </button>

      {/* SOS Modal */}
      {showSOS && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={() => setShowSOS(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[100] w-[90%] max-w-md">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-red-600 p-6 text-center">
                <AlertOctagon className="w-16 h-16 text-white mx-auto mb-3" />
                <h2 className="text-xl text-white">SOS ฉุกเฉิน</h2>
                <p className="text-sm text-red-100 mt-1">
                  โทรออกทันทีในสถานการณ์อันตราย
                </p>
              </div>

              <div className="p-6 space-y-3">
                <a
                  href="tel:191"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg"
                >
                  <Phone className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-lg">โทร 191</div>
                    <div className="text-xs text-red-100">
                      ศูนย์รับแจ้งเหตุฉุกเฉิน
                    </div>
                  </div>
                </a>

                <a
                  href="tel:1669"
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg"
                >
                  <Phone className="w-6 h-6" />
                  <div className="text-left">
                    <div className="text-lg">โทร 1669</div>
                    <div className="text-xs text-red-100">
                      รถฉุกเฉินการแพทย์
                    </div>
                  </div>
                </a>

                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'ต้องการความช่วยเหลือฉุกเฉิน!',
                        text: 'ฉันอยู่ในสถานการณ์ฉุกเฉิน กรุณาช่วยเหลือ!',
                      });
                    }
                    setShowSOS(false);
                    setActiveTab('request');
                  }}
                  className="flex items-center justify-center gap-3 w-full px-6 py-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  <span>แชร์ตำแหน่งฉุกเฉิน</span>
                </button>

                <button
                  onClick={() => setShowSOS(false)}
                  className="w-full px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 text-gray-700 transition-colors"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Header */}
      <header
        className={`sticky top-0 z-50 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-b`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Minimal */}
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-sm ${
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                }`}
              >
                ศูนย์ช่วยเหลือผู้ประสบภัย
              </span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {darkMode ? (
                  <Sun className="w-4 h-4 text-yellow-400" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-700" />
                )}
              </button>
              <button
                onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <Globe
                  className={`w-4 h-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-br from-gray-50 via-white to-orange-50 border-b-2 border-gray-100 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #f9572b 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Main Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 border-2 border-green-200">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                  </div>
                  <span className="text-sm text-green-700">
                    พร้อมให้บริการตลอด 24 ชั่วโมง
                  </span>
                </div>
              </div>

              {/* Main Title */}
              <div className="space-y-3">
                <h1
                  className={`text-3xl sm:text-4xl lg:text-5xl ${
                    darkMode ? 'text-gray-100' : 'text-gray-900'
                  } leading-tight`}
                >
                  ศูนย์ช่วยเหลือ
                  <br />
                  ผู้ประสบภัย
                </h1>
                <p
                  className={`text-lg sm:text-xl ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  พร้อมดูแลคุณทุกขณะ ไม่ว่าจะเกิดอะไรขึ้น
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto lg:mx-0">
                <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-100 shadow-sm">
                  <div className="text-2xl sm:text-3xl text-primary mb-1">
                    24/7
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    เปิดบริการ
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-100 shadow-sm">
                  <div className="text-2xl sm:text-3xl text-primary mb-1">
                    ฟรี
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    ไม่มีค่าใช้จ่าย
                  </div>
                </div>
                <div className="bg-white rounded-xl p-3 sm:p-4 border-2 border-gray-100 shadow-sm">
                  <div className="text-2xl sm:text-3xl text-primary mb-1">
                    &lt;5
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    นาที ตอบรับ
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <button
                  onClick={() => setActiveTab('request')}
                  className="group relative px-8 py-4 bg-primary hover:bg-[#e14a21] text-white rounded-xl transition-all shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2 text-lg">
                    <FileText className="w-5 h-5" />
                    ขอความช่วยเหลือเลย
                  </span>
                </button>
                <a
                  href="tel:191"
                  className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 rounded-xl border-2 border-gray-200 hover:border-primary transition-all shadow-sm hover:shadow-md"
                >
                  <span className="flex items-center justify-center gap-2 text-lg">
                    <Phone className="w-5 h-5" />
                    โทร 191 ฉุกเฉิน
                  </span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 pt-2">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" />
                  <span>ปลอดภัย</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span>เชื่อถือได้</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>ช่วยเหลือแล้ว 1,000+ คน</span>
                </div>
              </div>
            </div>

            {/* Right: Emergency Card */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-xl p-6 space-y-4">
                <div className="text-center pb-4 border-b border-gray-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-orange-600 rounded-2xl mb-3 shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-1">หมายเลขฉุกเฉิน</h3>
                  <p className="text-sm text-gray-600">
                    โทรออกได้ทันทีตลอด 24 ชั่วโมง
                  </p>
                </div>

                <div className="space-y-2">
                  <a
                    href="tel:191"
                    className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-gray-900">แจ้งเหตุฉุกเฉิน</div>
                        <div className="text-xs text-gray-600">
                          ตำรวจ เหตุร้าย อัคคีภัย
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl text-red-600">191</div>
                  </a>

                  <a
                    href="tel:1669"
                    className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-gray-900">รถฉุกเฉินการแพทย์</div>
                        <div className="text-xs text-gray-600">
                          เจ็บป่วย บาดเจ็บ
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl text-blue-600">1669</div>
                  </a>

                  <a
                    href="tel:1784"
                    className="flex items-center justify-between p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="text-gray-900">ศูนย์ช่วยเหลือภัย</div>
                        <div className="text-xs text-gray-600">
                          น้ำท่วม แผ่นดินไหว
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl text-orange-600">1784</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-[57px] sm:top-[65px] lg:top-[73px] z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          {/* Mobile & Tablet: Scrollable tabs */}
          <div className="lg:hidden flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide">
            {mainTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex flex-col items-center gap-1 sm:gap-1.5 py-2 sm:py-3 px-3 sm:px-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-[10px] sm:text-xs whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            ))}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`flex-shrink-0 flex flex-col items-center gap-1 sm:gap-1.5 py-2 sm:py-3 px-3 sm:px-4 border-b-2 transition-colors ${
                showMenu
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs whitespace-nowrap">
                {t.menu}
              </span>
            </button>
          </div>

          {/* Desktop: All tabs visible */}
          <div className="hidden lg:flex gap-1">
            {mainTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1.5 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 border-b-2 transition-colors ${
                showMenu
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Menu className="w-5 h-5" />
              <span className="text-xs">{t.menu}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-20 sm:pb-24">
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

      {/* Emergency Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary border-t border-[#e14a21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2 sm:gap-3 text-white">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm">{t.emergency}</span>
              <a
                href="tel:191"
                className="bg-white/20 hover:bg-white/30 transition-colors px-2.5 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm"
              >
                191
              </a>
              <span className="text-xs sm:text-sm text-white/80">หรือ</span>
              <a
                href="tel:1669"
                className="bg-white/20 hover:bg-white/30 transition-colors px-2.5 sm:px-3 py-0.5 sm:py-1 rounded text-xs sm:text-sm"
              >
                1669
              </a>
            </div>
            <button
              onClick={() => setShowLogin(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 transition-colors border border-white/20"
            >
              <Shield className="w-3.5 h-3.5 text-white" />
              <span className="text-xs text-white">เข้าสู่ระบบ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Overlay */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMenu(false)}
          />
          <div className="fixed top-[120px] sm:top-[130px] lg:top-[145px] left-0 right-0 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-[70vh] overflow-y-auto">
              <div className="p-3 sm:p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm sm:text-base text-gray-900">
                    {t.menu}
                  </h2>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="text-xl sm:text-2xl">×</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 p-2 sm:p-3">
                {menuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-lg border-2 transition-all text-center ${
                        isActive
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      <div>
                        <div className="text-xs sm:text-sm">{item.label}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">
                          {item.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}
