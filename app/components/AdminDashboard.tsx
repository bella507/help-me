import { useState, useEffect } from 'react';
import { Shield, LogOut, Users, CheckCircle, Clock, AlertCircle, Search, Filter, User, Phone, MapPin, Package, Calendar, Edit2, Trash2, UserCheck, Send, Bell, Newspaper, Home, AlertTriangle, Settings, FileText, Download, BarChart3, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { AlertDialog } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

type AdminTab = 'overview' | 'requests' | 'volunteers' | 'news' | 'shelters' | 'risks' | 'donations' | 'faq' | 'notifications' | 'settings';

interface HelpRequest {
  id: string;
  name: string;
  phone: string;
  location: string;
  category: string;
  urgency: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  assignedTo?: string;
  notes?: string;
}

interface Volunteer {
  id: string;
  name: string;
  phone: string;
  skills: string[] | string;
  availability: string;
  assignedTasks: number;
  verified: boolean;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  author: string;
}

interface Shelter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  occupied: number;
  facilities: string[];
  status: 'open' | 'full' | 'closed';
}

interface RiskArea {
  id: string;
  name: string;
  location: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
}

interface DonationNeed {
  id: string;
  item: string;
  category: string;
  urgency: 'low' | 'medium' | 'high';
  quantity: string;
  status: 'needed' | 'partial' | 'fulfilled';
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [risks, setRisks] = useState<RiskArea[]>([]);
  const [donations, setDonations] = useState<DonationNeed[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  // Modal states
  const [showNewsModal, setShowNewsModal] = useState(false);
  const [showShelterModal, setShowShelterModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  
  const [editingItem, setEditingItem] = useState<any>(null);

  // Alert Dialog state
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    // Load requests
    const storedRequests = localStorage.getItem('helpRequests');
    if (storedRequests) {
      setRequests(JSON.parse(storedRequests));
    }

    // Load volunteers
    const storedVolunteers = localStorage.getItem('volunteers');
    if (storedVolunteers) {
      const vols = JSON.parse(storedVolunteers);
      const requestsData = JSON.parse(storedRequests || '[]');
      const volunteerStats = vols.map((vol: Volunteer) => ({
        ...vol,
        verified: vol.verified !== false,
        assignedTasks: requestsData.filter((req: HelpRequest) => req.assignedTo === vol.id && req.status !== 'completed').length
      }));
      setVolunteers(volunteerStats);
    } else {
      const mockVolunteers = [
        { id: 'v1', name: 'สมชาย ใจดี', phone: '081-234-5678', skills: ['อาหาร', 'การแพทย์'], availability: 'พร้อมทำงาน', assignedTasks: 0, verified: true },
        { id: 'v2', name: 'สมหญิง รักษ์ชาติ', phone: '082-345-6789', skills: ['ที่พักพิง', 'การอพยพ'], availability: 'พร้อมทำงาน', assignedTasks: 0, verified: true },
        { id: 'v3', name: 'วิชัย ช่วยเหลือ', phone: '083-456-7890', skills: ['เสื้อผ้า', 'อื่นๆ'], availability: 'พร้อมทำงาน', assignedTasks: 0, verified: false }
      ];
      setVolunteers(mockVolunteers);
      localStorage.setItem('volunteers', JSON.stringify(mockVolunteers));
    }

    // Load news
    const storedNews = localStorage.getItem('newsItems');
    if (storedNews) {
      setNews(JSON.parse(storedNews));
    }

    // Load shelters
    const storedShelters = localStorage.getItem('shelters');
    if (storedShelters) {
      setShelters(JSON.parse(storedShelters));
    }

    // Load risks
    const storedRisks = localStorage.getItem('riskAreas');
    if (storedRisks) {
      setRisks(JSON.parse(storedRisks));
    }

    // Load donations
    const storedDonations = localStorage.getItem('donationNeeds');
    if (storedDonations) {
      setDonations(JSON.parse(storedDonations));
    }

    // Load FAQs
    const storedFaqs = localStorage.getItem('faqs');
    if (storedFaqs) {
      setFaqs(JSON.parse(storedFaqs));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.reload();
  };

  // Request management
  const updateRequestStatus = (id: string, status: HelpRequest['status']) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('helpRequests', JSON.stringify(updatedRequests));
    toast.success('อัพเดทสถานะสำเร็จ');
  };

  const assignToVolunteer = (requestId: string, volunteerId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId ? { ...req, assignedTo: volunteerId, status: 'in-progress' as const, notes: adminNotes } : req
    );
    setRequests(updatedRequests);
    localStorage.setItem('helpRequests', JSON.stringify(updatedRequests));
    
    const volunteer = volunteers.find(v => v.id === volunteerId);
    const request = requests.find(r => r.id === requestId);
    if (volunteer && request) {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      notifications.unshift({
        id: Date.now().toString(),
        type: 'info',
        title: 'งานใหม่ได้รับมอบหมาย',
        message: `คุณได้รับมอบหมายให้ช่วยเหลือคุณ${request.name}`,
        time: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }

    setShowAssignModal(false);
    setAdminNotes('');
    toast.success('มอบหมายงานสำเร็จ');
  };

  const deleteRequest = (id: string) => {
    setAlertDialog({
      open: true,
      title: 'ยืนยันการลบ',
      description: 'คุณแน่ใจหรือไม่ที่จะลบคำขอนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      onConfirm: () => {
        const updatedRequests = requests.filter(req => req.id !== id);
        setRequests(updatedRequests);
        localStorage.setItem('helpRequests', JSON.stringify(updatedRequests));
        toast.success('ลบคำขอสำเร็จ');
      }
    });
  };

  // Volunteer management
  const verifyVolunteer = (id: string) => {
    const updatedVolunteers = volunteers.map(vol =>
      vol.id === id ? { ...vol, verified: true } : vol
    );
    setVolunteers(updatedVolunteers);
    localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
    toast.success('ยืนยันอาสาสมัครสำเร็จ');
  };

  const deleteVolunteer = (id: string) => {
    setAlertDialog({
      open: true,
      title: 'ยืนยันการลบ',
      description: 'คุณแน่ใจหรือไม่ที่จะลบอาสาสมัครนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      onConfirm: () => {
        const updatedVolunteers = volunteers.filter(vol => vol.id !== id);
        setVolunteers(updatedVolunteers);
        localStorage.setItem('volunteers', JSON.stringify(updatedVolunteers));
        toast.success('ลบอาสาสมัครสำเร็จ');
      }
    });
  };

  // News management
  const saveNews = (newsData: Partial<NewsItem>) => {
    if (!newsData.title || !newsData.content) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem) {
      const updatedNews = news.map(item =>
        item.id === editingItem.id ? { ...item, ...newsData } : item
      );
      setNews(updatedNews);
      localStorage.setItem('newsItems', JSON.stringify(updatedNews));
      toast.success('แก้ไขข่าวสารสำเร็จ');
    } else {
      const newItem: NewsItem = {
        id: Date.now().toString(),
        title: newsData.title!,
        content: newsData.content!,
        category: newsData.category || 'general',
        createdAt: new Date().toISOString(),
        author: 'Admin'
      };
      const updatedNews = [newItem, ...news];
      setNews(updatedNews);
      localStorage.setItem('newsItems', JSON.stringify(updatedNews));
      toast.success('เพิ่มข่าวสารสำเร็จ');
    }
    setShowNewsModal(false);
    setEditingItem(null);
  };

  const deleteNews = (id: string) => {
    setAlertDialog({
      open: true,
      title: 'ยืนยันการลบ',
      description: 'คุณแน่ใจหรือไม่ที่จะลบข่าวนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      onConfirm: () => {
        const updatedNews = news.filter(item => item.id !== id);
        setNews(updatedNews);
        localStorage.setItem('newsItems', JSON.stringify(updatedNews));
        toast.success('ลบข่าวสำเร็จ');
      }
    });
  };

  // Shelter management
  const saveShelter = (shelterData: Partial<Shelter>) => {
    if (!shelterData.name || !shelterData.location) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem) {
      const updatedShelters = shelters.map(item =>
        item.id === editingItem.id ? { ...item, ...shelterData } : item
      );
      setShelters(updatedShelters);
      localStorage.setItem('shelters', JSON.stringify(updatedShelters));
      toast.success('แก้ไขศูนย์พักพิงสำเร็จ');
    } else {
      const newItem: Shelter = {
        id: Date.now().toString(),
        name: shelterData.name!,
        location: shelterData.location!,
        capacity: shelterData.capacity || 0,
        occupied: shelterData.occupied || 0,
        facilities: shelterData.facilities || [],
        status: shelterData.status || 'open'
      };
      const updatedShelters = [newItem, ...shelters];
      setShelters(updatedShelters);
      localStorage.setItem('shelters', JSON.stringify(updatedShelters));
      toast.success('เพิ่มศูนย์พักพิงสำเร็จ');
    }
    setShowShelterModal(false);
    setEditingItem(null);
  };

  const deleteShelter = (id: string) => {
    setAlertDialog({
      open: true,
      title: 'ยืนยันการลบ',
      description: 'คุณแน่ใจหรือไม่ที่จะลบศูนย์พักพิงนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      onConfirm: () => {
        const updatedShelters = shelters.filter(item => item.id !== id);
        setShelters(updatedShelters);
        localStorage.setItem('shelters', JSON.stringify(updatedShelters));
        toast.success('ลบศูนย์พักพิงสำเร็จ');
      }
    });
  };

  // Risk area management
  const saveRisk = (riskData: Partial<RiskArea>) => {
    if (!riskData.name || !riskData.location) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem) {
      const updatedRisks = risks.map(item =>
        item.id === editingItem.id ? { ...item, ...riskData } : item
      );
      setRisks(updatedRisks);
      localStorage.setItem('riskAreas', JSON.stringify(updatedRisks));
      toast.success('แก้ไขพื้นที่เสี่ยงสำเร็จ');
    } else {
      const newItem: RiskArea = {
        id: Date.now().toString(),
        name: riskData.name!,
        location: riskData.location!,
        riskLevel: riskData.riskLevel || 'medium',
        type: riskData.type || 'flood',
        description: riskData.description || ''
      };
      const updatedRisks = [newItem, ...risks];
      setRisks(updatedRisks);
      localStorage.setItem('riskAreas', JSON.stringify(updatedRisks));
      toast.success('เพิ่มพื้นที่เสี่ยงสำเร็จ');
    }
    setShowRiskModal(false);
    setEditingItem(null);
  };

  const deleteRisk = (id: string) => {
    setAlertDialog({
      open: true,
      title: 'ยืนยันการลบ',
      description: 'คุณแน่ใจหรือไม่ที่จะลบพื้นที่เสี่ยงนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      onConfirm: () => {
        const updatedRisks = risks.filter(item => item.id !== id);
        setRisks(updatedRisks);
        localStorage.setItem('riskAreas', JSON.stringify(updatedRisks));
        toast.success('ลบพื้นที่เสี่ยงสำเร็จ');
      }
    });
  };

  // Donation management
  const saveDonation = (donationData: Partial<DonationNeed>) => {
    if (!donationData.item) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem) {
      const updatedDonations = donations.map(item =>
        item.id === editingItem.id ? { ...item, ...donationData } : item
      );
      setDonations(updatedDonations);
      localStorage.setItem('donationNeeds', JSON.stringify(updatedDonations));
      toast.success('แก้ไขของบริจาคสำเร็จ');
    } else {
      const newItem: DonationNeed = {
        id: Date.now().toString(),
        item: donationData.item!,
        category: donationData.category || 'อื่นๆ',
        urgency: donationData.urgency || 'medium',
        quantity: donationData.quantity || '',
        status: donationData.status || 'needed'
      };
      const updatedDonations = [newItem, ...donations];
      setDonations(updatedDonations);
      localStorage.setItem('donationNeeds', JSON.stringify(updatedDonations));
      toast.success('เพิ่มของบริจาคสำเร็จ');
    }
    setShowDonationModal(false);
    setEditingItem(null);
  };

  const deleteDonation = (id: string) => {
    setAlertDialog({
      open: true,
      title: 'ยืนยันการลบ',
      description: 'คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      onConfirm: () => {
        const updatedDonations = donations.filter(item => item.id !== id);
        setDonations(updatedDonations);
        localStorage.setItem('donationNeeds', JSON.stringify(updatedDonations));
        toast.success('ลบรายการสำเร็จ');
      }
    });
  };

  // FAQ management
  const saveFaq = (faqData: Partial<FAQItem>) => {
    if (!faqData.question || !faqData.answer) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem) {
      const updatedFaqs = faqs.map(item =>
        item.id === editingItem.id ? { ...item, ...faqData } : item
      );
      setFaqs(updatedFaqs);
      localStorage.setItem('faqs', JSON.stringify(updatedFaqs));
      toast.success('แก้ไข FAQ สำเร็จ');
    } else {
      const newItem: FAQItem = {
        id: Date.now().toString(),
        question: faqData.question!,
        answer: faqData.answer!,
        category: faqData.category || 'ทั่วไป'
      };
      const updatedFaqs = [newItem, ...faqs];
      setFaqs(updatedFaqs);
      localStorage.setItem('faqs', JSON.stringify(updatedFaqs));
      toast.success('เพิ่ม FAQ สำเร็จ');
    }
    setShowFaqModal(false);
    setEditingItem(null);
  };

  const deleteFaq = (id: string) => {
    setAlertDialog({
      open: true,
      title: 'ยืนยันการลบ',
      description: 'คุณแน่ใจหรือไม่ที่จะลบคำถามนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      onConfirm: () => {
        const updatedFaqs = faqs.filter(item => item.id !== id);
        setFaqs(updatedFaqs);
        localStorage.setItem('faqs', JSON.stringify(updatedFaqs));
        toast.success('ลบคำถามสำเร็จ');
      }
    });
  };

  // Send notification
  const sendNotification = (title: string, message: string, type: 'info' | 'warning' | 'success' | 'error') => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifications.unshift({
      id: Date.now().toString(),
      type,
      title,
      message,
      time: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(notifications));
    toast.success('ส่งการแจ้งเตือนสำเร็จ');
    setShowNotificationModal(false);
  };

  // Export data
  const exportData = (dataType: string) => {
    let data: any[] = [];
    let filename = '';

    switch (dataType) {
      case 'requests':
        data = requests;
        filename = 'help-requests.json';
        break;
      case 'volunteers':
        data = volunteers;
        filename = 'volunteers.json';
        break;
      case 'news':
        data = news;
        filename = 'news.json';
        break;
      case 'shelters':
        data = shelters;
        filename = 'shelters.json';
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    toast.success('ดาวน์โหลดข้อมูลสำเร็จ');
  };

  const filteredRequests = requests.filter(req => {
    const matchSearch = req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       req.phone.includes(searchTerm) ||
                       req.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchUrgency = filterUrgency === 'all' || req.urgency === filterUrgency;
    return matchSearch && matchStatus && matchUrgency;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    volunteers: volunteers.length,
    verifiedVolunteers: volunteers.filter(v => v.verified).length,
    openShelters: shelters.filter(s => s.status === 'open').length,
    criticalRisks: risks.filter(r => r.riskLevel === 'critical').length
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      food: 'อาหาร',
      water: 'น้ำดื่ม',
      medical: 'การแพทย์',
      shelter: 'ที่พักพิง',
      evacuation: 'การอพยพ',
      clothing: 'เสื้อผ้า',
      other: 'อื่นๆ'
    };
    return categories[category] || category;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels: Record<string, string> = {
      low: 'ปกติ',
      medium: 'ค่อนข้างเร่งด่วน',
      high: 'เร่งด่วน',
      critical: 'วิกฤต'
    };
    return labels[urgency] || urgency;
  };

  const getUrgencyColor = (urgency: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700'
    };
    return colors[urgency] || 'bg-gray-100 text-gray-700';
  };

  const tabs = [
    { id: 'overview' as AdminTab, icon: BarChart3, label: 'ภาพรวม' },
    { id: 'requests' as AdminTab, icon: AlertCircle, label: 'คำขอช่วยเหลือ' },
    { id: 'volunteers' as AdminTab, icon: Users, label: 'อาสาสมัคร' },
    { id: 'news' as AdminTab, icon: Newspaper, label: 'ข่าวสาร' },
    { id: 'shelters' as AdminTab, icon: Home, label: 'ศูนย์พักพิง' },
    { id: 'risks' as AdminTab, icon: AlertTriangle, label: 'พื้นที่เสี่ยง' },
    { id: 'donations' as AdminTab, icon: Package, label: 'ของบริจาค' },
    { id: 'faq' as AdminTab, icon: FileText, label: 'FAQ' },
    { id: 'notifications' as AdminTab, icon: Bell, label: 'แจ้งเตือน' },
    { id: 'settings' as AdminTab, icon: Settings, label: 'ตั้งค่า' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary border-b border-[#e14a21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg text-white">ระบบจัดการผู้ดูแล</h1>
                <p className="text-xs text-white/80">Admin Dashboard</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="bg-white/10 hover:bg-white/20 text-white border-0">
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="sticky top-[57px] sm:top-[65px] z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-3 sm:px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-xs sm:text-sm whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl text-gray-900">ภาพรวมระบบ</h2>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">คำขอทั้งหมด</p>
                      <p className="text-2xl text-gray-900">{stats.total}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-yellow-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">รอดำเนินการ</p>
                      <p className="text-2xl text-gray-900">{stats.pending}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">อาสาสมัคร</p>
                      <p className="text-2xl text-gray-900">{stats.verifiedVolunteers}/{stats.volunteers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">พื้นที่วิกฤต</p>
                      <p className="text-2xl text-gray-900">{stats.criticalRisks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>คำขอล่าสุด</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {requests.slice(0, 5).map(req => (
                      <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{req.name}</p>
                          <p className="text-xs text-gray-500">{getCategoryName(req.category)}</p>
                        </div>
                        <Badge variant={
                          req.status === 'completed' ? 'success' :
                          req.status === 'in-progress' ? 'warning' : 'default'
                        }>
                          {req.status === 'pending' ? 'รอดำเนินการ' :
                           req.status === 'in-progress' ? 'กำลังดำเนินการ' : 'เสร็จสิ้น'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ศูนย์พักพิง</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shelters.slice(0, 5).map(shelter => (
                      <div key={shelter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{shelter.name}</p>
                          <p className="text-xs text-gray-500">{shelter.occupied}/{shelter.capacity} คน</p>
                        </div>
                        <Badge variant={
                          shelter.status === 'open' ? 'success' :
                          shelter.status === 'full' ? 'warning' : 'secondary'
                        }>
                          {shelter.status === 'open' ? 'เปิด' :
                           shelter.status === 'full' ? 'เต็ม' : 'ปิด'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการคำขอความช่วยเหลือ</h2>
              <Button onClick={() => exportData('requests')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="ค้นหา..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="pending">รอดำเนินการ</option>
                    <option value="in-progress">กำลังดำเนินการ</option>
                    <option value="completed">เสร็จสิ้น</option>
                  </select>
                  <select
                    value={filterUrgency}
                    onChange={(e) => setFilterUrgency(e.target.value)}
                    className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  >
                    <option value="all">ความเร่งด่วนทั้งหมด</option>
                    <option value="low">ปกติ</option>
                    <option value="medium">ค่อนข้างเร่งด่วน</option>
                    <option value="high">เร่งด่วน</option>
                    <option value="critical">วิกฤต</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Requests List */}
            <div className="space-y-3">
              {filteredRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-900">{request.name}</p>
                          <Badge className={getUrgencyColor(request.urgency)}>
                            {getUrgencyLabel(request.urgency)}
                          </Badge>
                          <Badge variant={
                            request.status === 'completed' ? 'success' :
                            request.status === 'in-progress' ? 'warning' : 'default'
                          }>
                            {request.status === 'pending' ? 'รอดำเนินการ' :
                             request.status === 'in-progress' ? 'กำลังดำเนินการ' : 'เสร็จสิ้น'}
                          </Badge>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {request.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {request.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-3 h-3" />
                            {getCategoryName(request.category)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(request.createdAt).toLocaleDateString('th-TH')}
                          </div>
                        </div>
                        {request.notes && (
                          <div className="text-xs bg-yellow-50 border border-yellow-200 rounded p-2">
                            <span className="text-gray-700">หมายเหตุ: </span>
                            <span className="text-gray-600">{request.notes}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <Button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowAssignModal(true);
                            }}
                            size="sm"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            มอบหมาย
                          </Button>
                        )}
                        {request.status === 'in-progress' && (
                          <Button
                            onClick={() => updateRequestStatus(request.id, 'completed')}
                            size="sm"
                            variant="outline"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            เสร็จสิ้น
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteRequest(request.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Volunteers Tab */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการอาสาสมัคร</h2>
              <Button onClick={() => exportData('volunteers')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteers.map(volunteer => (
                <Card key={volunteer.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">{volunteer.name}</p>
                            <p className="text-xs text-gray-500">{volunteer.phone}</p>
                          </div>
                        </div>
                        {volunteer.verified ? (
                          <Badge variant="success">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ยืนยันแล้ว
                          </Badge>
                        ) : (
                          <Badge variant="warning">
                            <Clock className="w-3 h-3 mr-1" />
                            รอยืนยัน
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">���ักษะ:</p>
                        <div className="flex flex-wrap gap-1">
                          {(Array.isArray(volunteer.skills) 
                            ? volunteer.skills 
                            : volunteer.skills.split(',').map(s => s.trim())
                          ).map((skill, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">งานที่ได้รับ:</span>
                        <span className="text-gray-900">{volunteer.assignedTasks} งาน</span>
                      </div>

                      <div className="flex gap-2">
                        {!volunteer.verified && (
                          <Button
                            onClick={() => verifyVolunteer(volunteer.id)}
                            size="sm"
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            ยืนยัน
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteVolunteer(volunteer.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* News Tab */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการข่าวสาร</h2>
              <Button onClick={() => {
                setEditingItem(null);
                setShowNewsModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มข่าว
              </Button>
            </div>

            <div className="space-y-3">
              {news.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-sm text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-xs text-gray-600 mb-2">{item.content}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="secondary">{item.category}</Badge>
                          <span>{new Date(item.createdAt).toLocaleDateString('th-TH')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(item);
                            setShowNewsModal(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteNews(item.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Shelters Tab */}
        {activeTab === 'shelters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการศูนย์พักพิง</h2>
              <Button onClick={() => {
                setEditingItem(null);
                setShowShelterModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มศูนย์พักพิง
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {shelters.map(shelter => (
                <Card key={shelter.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm text-gray-900">{shelter.name}</h3>
                          <p className="text-xs text-gray-500">{shelter.location}</p>
                        </div>
                        <Badge variant={
                          shelter.status === 'open' ? 'success' :
                          shelter.status === 'full' ? 'warning' : 'secondary'
                        }>
                          {shelter.status === 'open' ? 'เปิด' :
                           shelter.status === 'full' ? 'เต็ม' : 'ปิด'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">ความจุ:</span>
                        <span className="text-gray-900">{shelter.occupied}/{shelter.capacity} คน</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(shelter);
                            setShowShelterModal(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          แก้ไข
                        </Button>
                        <Button
                          onClick={() => deleteShelter(shelter.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการพื้นที่เสี่ยง</h2>
              <Button onClick={() => {
                setEditingItem(null);
                setShowRiskModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มพื้นที่เสี่ยง
              </Button>
            </div>

            <div className="space-y-3">
              {risks.map(risk => (
                <Card key={risk.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm text-gray-900">{risk.name}</h3>
                          <Badge className={
                            risk.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                            risk.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                            risk.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }>
                            {risk.riskLevel === 'critical' ? 'วิกฤต' :
                             risk.riskLevel === 'high' ? 'สูง' :
                             risk.riskLevel === 'medium' ? 'ปานกลาง' : 'ต่ำ'}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{risk.location}</p>
                        {risk.description && (
                          <p className="text-xs text-gray-500">{risk.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(risk);
                            setShowRiskModal(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteRisk(risk.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการของบริจาค</h2>
              <Button onClick={() => {
                setEditingItem(null);
                setShowDonationModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มรายการ
              </Button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {donations.map(donation => (
                <Card key={donation.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm text-gray-900">{donation.item}</h3>
                          <p className="text-xs text-gray-500">{donation.category}</p>
                        </div>
                        <Badge className={getUrgencyColor(donation.urgency)}>
                          {getUrgencyLabel(donation.urgency)}
                        </Badge>
                      </div>

                      {donation.quantity && (
                        <p className="text-xs text-gray-600">จำนวน: {donation.quantity}</p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(donation);
                            setShowDonationModal(true);
                          }}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          แก้ไข
                        </Button>
                        <Button
                          onClick={() => deleteDonation(donation.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการคำถามที่พบบ่อย</h2>
              <Button onClick={() => {
                setEditingItem(null);
                setShowFaqModal(true);
              }}>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่ม FAQ
              </Button>
            </div>

            <div className="space-y-3">
              {faqs.map(faq => (
                <Card key={faq.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm text-gray-900">{faq.question}</h3>
                          <Badge variant="secondary">{faq.category}</Badge>
                        </div>
                        <p className="text-xs text-gray-600">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(faq);
                            setShowFaqModal(true);
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteFaq(faq.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">ส่งการแจ้งเตือน</h2>
              <Button onClick={() => setShowNotificationModal(true)}>
                <Send className="w-4 h-4 mr-2" />
                ส่งแจ้งเตือนใหม่
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">คลิกปุ่มด้านบนเพื่อส่งการแจ้งเตือนไปยังผู้ใช้ทั้งหมด</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl text-gray-900">ตั้งค่าระบบ</h2>

            <Card>
              <CardHeader>
                <CardTitle>การส่งออกข้อมูล</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Button onClick={() => exportData('requests')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export คำขอช่วยเหลือ
                  </Button>
                  <Button onClick={() => exportData('volunteers')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export อาสาสมัคร
                  </Button>
                  <Button onClick={() => exportData('news')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export ข่าวสาร
                  </Button>
                  <Button onClick={() => exportData('shelters')} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export ศูนย์พักพิง
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลระบบ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>คำขอทั้งหมด:</span>
                    <span className="text-gray-900">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>อาสาสมัครที่ยืนยันแล้ว:</span>
                    <span className="text-gray-900">{stats.verifiedVolunteers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ข่าวสาร:</span>
                    <span className="text-gray-900">{news.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ศูนย์พักพิง:</span>
                    <span className="text-gray-900">{shelters.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Assign Modal */}
      {showAssignModal && selectedRequest && (
        <>
          <div 
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAssignModal(false)}
          />
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>มอบหมายงานให้อาสาสมัคร</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-900 mb-1">คำขอ: {selectedRequest.name}</p>
                  <p className="text-xs text-gray-600">{getCategoryName(selectedRequest.category)}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">หมายเหตุสำหรับอาสาสมัคร</label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="ข้อมูลเพิ่มเติมสำหรับอาสาสมัคร..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">เลือกอาสาสมัคร</label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {volunteers.filter(v => v.verified).map(volunteer => (
                      <button
                        key={volunteer.id}
                        onClick={() => assignToVolunteer(selectedRequest.id, volunteer.id)}
                        className="w-full p-3 text-left rounded-lg border-2 border-gray-200 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-900">{volunteer.name}</p>
                            <p className="text-xs text-gray-500">{Array.isArray(volunteer.skills) ? volunteer.skills.join(', ') : volunteer.skills}</p>
                          </div>
                          <Badge variant="secondary">{volunteer.assignedTasks} งาน</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setShowAssignModal(false)} variant="outline" className="w-full">
                  ยกเลิก
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* News Modal */}
      {showNewsModal && (
        <NewsModal
          editingItem={editingItem}
          onSave={saveNews}
          onClose={() => {
            setShowNewsModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Shelter Modal */}
      {showShelterModal && (
        <ShelterModal
          editingItem={editingItem}
          onSave={saveShelter}
          onClose={() => {
            setShowShelterModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Risk Modal */}
      {showRiskModal && (
        <RiskModal
          editingItem={editingItem}
          onSave={saveRisk}
          onClose={() => {
            setShowRiskModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Donation Modal */}
      {showDonationModal && (
        <DonationModal
          editingItem={editingItem}
          onSave={saveDonation}
          onClose={() => {
            setShowDonationModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <FaqModal
          editingItem={editingItem}
          onSave={saveFaq}
          onClose={() => {
            setShowFaqModal(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Notification Modal */}
      {showNotificationModal && (
        <NotificationModal
          onSend={sendNotification}
          onClose={() => setShowNotificationModal(false)}
        />
      )}

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />

      {/* Alert Dialog */}
      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}
        title={alertDialog.title}
        description={alertDialog.description}
        onConfirm={alertDialog.onConfirm}
        confirmText="ลบ"
        cancelText="ยกเลิก"
        variant="destructive"
      />
    </div>
  );
}

// Modal Components
function NewsModal({ editingItem, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    title: editingItem?.title || '',
    content: editingItem?.content || '',
    category: editingItem?.category || 'general'
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingItem ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}</CardTitle>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">หัวข้อข่าว</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="หัวข้อข่าว"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">เนื้อหา</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="เนื้อหาข่าว"
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">ประเภท</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
              >
                <option value="general">ทั่วไป</option>
                <option value="emergency">ฉุกเฉิน</option>
                <option value="warning">เตือนภัย</option>
                <option value="announcement">ประกาศ</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onSave(formData)} className="flex-1">
                บันทึก
              </Button>
              <Button onClick={onClose} variant="outline">
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ShelterModal({ editingItem, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    location: editingItem?.location || '',
    capacity: editingItem?.capacity || 0,
    occupied: editingItem?.occupied || 0,
    status: editingItem?.status || 'open'
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingItem ? 'แก้ไขศูนย์พักพิง' : 'เพิ่มศูนย์พักพิง'}</CardTitle>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">ชื่อศูนย์พักพิง</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ชื่อศูนย์พักพิง"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">สถานที่</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="สถานที่"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-700 mb-2">ความจุ (คน)</label>
                <Input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">ใช้งานแล้ว (คน)</label>
                <Input
                  type="number"
                  value={formData.occupied}
                  onChange={(e) => setFormData({ ...formData, occupied: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">สถานะ</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
              >
                <option value="open">เปิด</option>
                <option value="full">เต็ม</option>
                <option value="closed">ปิด</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onSave(formData)} className="flex-1">
                บันทึก
              </Button>
              <Button onClick={onClose} variant="outline">
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function RiskModal({ editingItem, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    location: editingItem?.location || '',
    riskLevel: editingItem?.riskLevel || 'medium',
    type: editingItem?.type || 'flood',
    description: editingItem?.description || ''
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingItem ? 'แก้ไขพื้นที่เสี่ยง' : 'เพิ่มพื้นที่เสี่ยง'}</CardTitle>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">ชื่อพื้นที่</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="ชื่อพื้นที่"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">สถานที่</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="สถานที่"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">ระดับความเสี่ยง</label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
              >
                <option value="low">ต่ำ</option>
                <option value="medium">ปานกลาง</option>
                <option value="high">สูง</option>
                <option value="critical">วิกฤต</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">รายละเอียด</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="รายละเอียดเพิ่มเติม"
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onSave(formData)} className="flex-1">
                บันทึก
              </Button>
              <Button onClick={onClose} variant="outline">
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function DonationModal({ editingItem, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    item: editingItem?.item || '',
    category: editingItem?.category || 'อื่นๆ',
    urgency: editingItem?.urgency || 'medium',
    quantity: editingItem?.quantity || '',
    status: editingItem?.status || 'needed'
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingItem ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}</CardTitle>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">รายการ</label>
              <Input
                value={formData.item}
                onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                placeholder="ชื่อสิ่งของ"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">ประเภท</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
              >
                <option value="อาหาร">อ���หาร</option>
                <option value="น้ำดื่ม">น้ำดื่ม</option>
                <option value="เสื้อผ้า">เสื้อผ้า</option>
                <option value="ยา">ยา</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">จำนวน</label>
              <Input
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="เช่น 100 กล่อง"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">ความเร่งด่วน</label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
              >
                <option value="low">ปกติ</option>
                <option value="medium">ค่อนข้างเร่งด่วน</option>
                <option value="high">เร่งด่วน</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onSave(formData)} className="flex-1">
                บันทึก
              </Button>
              <Button onClick={onClose} variant="outline">
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function FaqModal({ editingItem, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    question: editingItem?.question || '',
    answer: editingItem?.answer || '',
    category: editingItem?.category || 'ทั่วไป'
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg max-h-[90vh] overflow-y-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingItem ? 'แก้ไข FAQ' : 'เพิ่ม FAQ ใหม่'}</CardTitle>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">คำถาม</label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="คำถาม"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">คำตอบ</label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="คำตอบ"
                rows={5}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">หมวดหมู่</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="หมวดหมู่"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onSave(formData)} className="flex-1">
                บันทึก
              </Button>
              <Button onClick={onClose} variant="outline">
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function NotificationModal({ onSend, onClose }: any) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'error'
  });

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[90%] max-w-lg">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ส่งการแจ้งเตือนใหม่</CardTitle>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">หัวข้อ</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="หัวข้อการแจ้งเตือน"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">ข้อความ</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="ข้อความแจ้งเตือน"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">ประเภท</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
              >
                <option value="info">ข้อมูล</option>
                <option value="warning">เตือน</option>
                <option value="success">สำเร็จ</option>
                <option value="error">ข้อผิดพลาด</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (formData.title && formData.message) {
                    onSend(formData.title, formData.message, formData.type);
                  } else {
                    toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
                  }
                }} 
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                ส่งแจ้งเตือน
              </Button>
              <Button onClick={onClose} variant="outline">
                ยกเลิก
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
