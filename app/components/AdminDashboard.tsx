import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Shield,
  LogOut,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  User,
  Phone,
  MapPin,
  Package,
  Calendar,
  Edit2,
  Trash2,
  UserCheck,
  Send,
  Bell,
  Newspaper,
  Home,
  AlertTriangle,
  Settings,
  FileText,
  Download,
  BarChart3,
  Plus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  requestStorage,
  volunteerStorage,
  newsStorage,
  shelterStorage,
  riskStorage,
  donationStorage,
  faqStorage,
  notificationStorage,
  userStorage,
  formatDate,
  generateId,
  formatSkills,
  getStatusBadge,
  getUrgencyBadge,
  getRiskBadge,
  getShelterStatusBadge,
} from '@/app/lib/utils';
import {
  CATEGORY_LABELS,
  REQUEST_STATUS,
  URGENCY_LEVELS,
} from '@/app/lib/constants';
import type {
  AdminTab,
  DonationNeed,
  FAQItem,
  HelpRequest,
  NewsItem,
  RiskArea,
  Shelter,
  Volunteer,
} from '@/app/types';
import { Toaster } from './ui/sonner';
import { AlertDialog } from './ui/alert-dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

type AlertState = {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
};

type ModalState = {
  assign: boolean;
  news: boolean;
  shelter: boolean;
  risk: boolean;
  donation: boolean;
  faq: boolean;
  notification: boolean;
};

type EditableItem =
  | NewsItem
  | Shelter
  | RiskArea
  | DonationNeed
  | FAQItem
  | null;
type NotificationType = 'info' | 'warning' | 'success' | 'error';

const INITIAL_ALERT: AlertState = {
  open: false,
  title: '',
  description: '',
  onConfirm: () => {},
};

const DEFAULT_VOLUNTEERS: Volunteer[] = [
  {
    id: 'v1',
    name: 'สมชาย ใจดี',
    phone: '081-234-5678',
    email: '',
    skills: ['อาหาร', 'การแพทย์'],
    availability: 'พร้อมทำงาน',
    status: 'approved',
    assignedTasks: 0,
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'v2',
    name: 'สมหญิง รักษ์ชาติ',
    phone: '082-345-6789',
    email: '',
    skills: ['ที่พักพิง', 'การอพยพ'],
    availability: 'พร้อมทำงาน',
    status: 'approved',
    assignedTasks: 0,
    verified: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'v3',
    name: 'วิชัย ช่วยเหลือ',
    phone: '083-456-7890',
    email: '',
    skills: ['เสื้อผ้า', 'อื่นๆ'],
    availability: 'พร้อมทำงาน',
    status: 'pending',
    assignedTasks: 0,
    verified: false,
    createdAt: new Date().toISOString(),
  },
];

const TABS: { id: AdminTab; icon: LucideIcon; label: string }[] = [
  { id: 'overview', icon: BarChart3, label: 'ภาพรวม' },
  { id: 'requests', icon: AlertCircle, label: 'คำขอช่วยเหลือ' },
  { id: 'volunteers', icon: Users, label: 'อาสาสมัคร' },
  { id: 'news', icon: Newspaper, label: 'ข่าวสาร' },
  { id: 'shelters', icon: Home, label: 'ศูนย์พักพิง' },
  { id: 'risks', icon: AlertTriangle, label: 'พื้นที่เสี่ยง' },
  { id: 'donations', icon: Package, label: 'ของบริจาค' },
  { id: 'faq', icon: FileText, label: 'FAQ' },
  { id: 'notifications', icon: Bell, label: 'แจ้งเตือน' },
  { id: 'settings', icon: Settings, label: 'ตั้งค่า' },
];

const getCategoryLabel = (category: string) =>
  CATEGORY_LABELS[category] || category;

const normalizeUrgency = (urgency: string): HelpRequest['urgency'] =>
  urgency === 'critical'
    ? URGENCY_LEVELS.HIGH
    : (urgency as HelpRequest['urgency']);

const hydrateVolunteers = (requests: HelpRequest[]) => {
  const saved = volunteerStorage.getAll();
  const base = saved.length ? saved : DEFAULT_VOLUNTEERS;

  if (!saved.length) {
    volunteerStorage.save(base);
  }

  return base.map(volunteer => ({
    ...volunteer,
    verified: volunteer.verified ?? true,
    assignedTasks: requests.filter(
      req =>
        req.assignedTo === volunteer.id &&
        req.status !== REQUEST_STATUS.COMPLETED
    ).length,
  }));
};

function BadgePill({ config }: { config: ReturnType<typeof getStatusBadge> }) {
  return (
    <Badge
      className={`border ${config.bgClass} ${config.textClass} ${config.borderClass}`}
    >
      {config.text}
    </Badge>
  );
}

const StatusPill = ({ status }: { status: string }) => (
  <BadgePill config={getStatusBadge(status)} />
);

const UrgencyPill = ({ urgency }: { urgency: string }) => (
  <BadgePill config={getUrgencyBadge(urgency)} />
);

const RiskPill = ({ level }: { level: string }) => (
  <BadgePill config={getRiskBadge(level)} />
);

const ShelterStatusPill = ({ status }: { status: string }) => (
  <BadgePill config={getShelterStatusBadge(status)} />
);

function ModalShell({
  title,
  onClose,
  children,
  footer,
  maxWidth = 'max-w-lg',
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}) {
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`fixed top-1/2 left-1/2 z-50 w-[90%] ${maxWidth} max-h-[90vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto`}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{title}</CardTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {children}
            {footer && <div className="flex gap-2">{footer}</div>}
          </CardContent>
        </Card>
      </div>
    </>
  );
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
  const [filterStatus, setFilterStatus] = useState<
    'all' | HelpRequest['status']
  >('all');
  const [filterUrgency, setFilterUrgency] = useState<
    'all' | HelpRequest['urgency']
  >('all');
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(
    null
  );
  const [adminNotes, setAdminNotes] = useState('');
  const [editingItem, setEditingItem] = useState<EditableItem>(null);
  const [modals, setModals] = useState<ModalState>({
    assign: false,
    news: false,
    shelter: false,
    risk: false,
    donation: false,
    faq: false,
    notification: false,
  });
  const [alertDialog, setAlertDialog] = useState<AlertState>(INITIAL_ALERT);

  const syncData = () => {
    const loadedRequests = requestStorage.getAll().map(req => ({
      ...req,
      urgency: normalizeUrgency(req.urgency),
    }));
    setRequests(loadedRequests);
    setVolunteers(hydrateVolunteers(loadedRequests));
    setNews(newsStorage.getAll());
    setShelters(shelterStorage.getAll());
    setRisks(riskStorage.getAll());
    setDonations(donationStorage.getAll());
    setFaqs(faqStorage.getAll());
  };

  useEffect(() => {
    const timeout = window.setTimeout(syncData, 0);
    const interval = window.setInterval(syncData, 5000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  const persistRequests = (next: HelpRequest[]) => {
    setRequests(next);
    requestStorage.save(next);
    setVolunteers(hydrateVolunteers(next));
  };

  const persistVolunteers = (next: Volunteer[]) => {
    setVolunteers(next);
    volunteerStorage.save(next);
  };

  const persistNews = (next: NewsItem[]) => {
    setNews(next);
    newsStorage.save(next);
  };

  const persistShelters = (next: Shelter[]) => {
    setShelters(next);
    shelterStorage.save(next);
  };

  const persistRisks = (next: RiskArea[]) => {
    setRisks(next);
    riskStorage.save(next);
  };

  const persistDonations = (next: DonationNeed[]) => {
    setDonations(next);
    donationStorage.save(next);
  };

  const persistFaqs = (next: FAQItem[]) => {
    setFaqs(next);
    faqStorage.save(next);
  };

  const confirmDelete = (
    title: string,
    description: string,
    onConfirm: () => void
  ) => setAlertDialog({ open: true, title, description, onConfirm });

  const handleLogout = () => {
    userStorage.clearRole();
    localStorage.removeItem('username');
    window.location.reload();
  };

  const updateRequestStatus = (id: string, status: HelpRequest['status']) => {
    const updatedRequests = requests.map(req =>
      req.id === id ? { ...req, status } : req
    );
    persistRequests(updatedRequests);
    toast.success('อัพเดทสถานะสำเร็จ');
  };

  const assignToVolunteer = (requestId: string, volunteerId: string) => {
    const updatedRequests = requests.map(req =>
      req.id === requestId
        ? {
            ...req,
            assignedTo: volunteerId,
            status: REQUEST_STATUS.IN_PROGRESS,
            notes: adminNotes,
          }
        : req
    );
    persistRequests(updatedRequests);

    const request = requests.find(r => r.id === requestId);
    if (request) {
      notificationStorage.add({
        id: generateId(),
        type: 'info',
        title: 'งานใหม่ได้รับมอบหมาย',
        message: `คุณได้รับมอบหมายให้ช่วยเหลือคุณ${request.name}`,
        time: new Date().toISOString(),
        read: false,
      });
    }

    setModals(prev => ({ ...prev, assign: false }));
    setAdminNotes('');
    toast.success('มอบหมายงานสำเร็จ');
  };

  const deleteRequest = (id: string) =>
    confirmDelete(
      'ยืนยันการลบ',
      'คุณแน่ใจหรือไม่ที่จะลบคำขอนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      () => {
        const updatedRequests = requests.filter(req => req.id !== id);
        persistRequests(updatedRequests);
        toast.success('ลบคำขอสำเร็จ');
      }
    );

  const verifyVolunteer = (id: string) => {
    const updatedVolunteers: Volunteer[] = volunteers.map(vol =>
      vol.id === id
        ? { ...vol, verified: true, status: 'active' as Volunteer['status'] }
        : vol
    );
    persistVolunteers(updatedVolunteers);
    toast.success('ยืนยันอาสาสมัครสำเร็จ');
  };

  const deleteVolunteer = (id: string) =>
    confirmDelete(
      'ยืนยันการลบ',
      'คุณแน่ใจหรือไม่ที่จะลบอาสาสมัครนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      () => {
        const updatedVolunteers = volunteers.filter(vol => vol.id !== id);
        persistVolunteers(updatedVolunteers);
        toast.success('ลบอาสาสมัครสำเร็จ');
      }
    );

  const deleteNews = (id: string) =>
    confirmDelete(
      'ยืนยันการลบ',
      'คุณแน่ใจหรือไม่ที่จะลบข่าวนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
      () => {
        const updatedNews = news.filter(item => item.id !== id);
        persistNews(updatedNews);
        toast.success('ลบข่าวสำเร็จ');
      }
    );

  const saveNews = (newsData: Partial<NewsItem>) => {
    if (!newsData.title || !newsData.content) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem && 'content' in editingItem) {
      const updatedNews = news.map(item =>
        item.id === editingItem.id ? { ...item, ...newsData } : item
      );
      persistNews(updatedNews);
      toast.success('แก้ไขข่าวสารสำเร็จ');
    } else {
      const newItem: NewsItem = {
        id: generateId(),
        title: newsData.title!,
        content: newsData.content!,
        category: newsData.category || 'general',
        createdAt: new Date().toISOString(),
        author: 'Admin',
        type: newsData.type ?? 'info',
        urgent: Boolean(newsData.urgent),
      };
      const updatedNews = [newItem, ...news];
      persistNews(updatedNews);
      toast.success('เพิ่มข่าวสารสำเร็จ');
    }

    setModals(prev => ({ ...prev, news: false }));
    setEditingItem(null);
  };

  const saveShelter = (shelterData: Partial<Shelter>) => {
    if (!shelterData.name || !shelterData.location) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem && 'capacity' in editingItem) {
      const updatedShelters = shelters.map(item =>
        item.id === editingItem.id ? { ...item, ...shelterData } : item
      );
      persistShelters(updatedShelters);
      toast.success('แก้ไขศูนย์พักพิงสำเร็จ');
    } else {
      const newItem: Shelter = {
        id: generateId(),
        name: shelterData.name!,
        location: shelterData.location!,
        capacity: Number(shelterData.capacity) || 0,
        occupied: Number(shelterData.occupied) || 0,
        currentOccupancy: Number(shelterData.occupied) || 0,
        facilities: shelterData.facilities || [],
        status: (shelterData.status as Shelter['status']) || 'open',
        contact: shelterData.contact || 'เจ้าหน้าที่ประสานงาน',
        phone: shelterData.phone || '',
      };
      const updatedShelters = [newItem, ...shelters];
      persistShelters(updatedShelters);
      toast.success('เพิ่มศูนย์พักพิงสำเร็จ');
    }

    setModals(prev => ({ ...prev, shelter: false }));
    setEditingItem(null);
  };

  const saveRisk = (riskData: Partial<RiskArea>) => {
    if (!riskData.name || !riskData.location) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem && 'riskLevel' in editingItem) {
      const updatedRisks = risks.map(item =>
        item.id === editingItem.id ? { ...item, ...riskData } : item
      );
      persistRisks(updatedRisks);
      toast.success('แก้ไขพื้นที่เสี่ยงสำเร็จ');
    } else {
      const newItem: RiskArea = {
        id: generateId(),
        name: riskData.name!,
        location: riskData.location!,
        riskLevel: (riskData.riskLevel as RiskArea['riskLevel']) || 'medium',
        type: riskData.type || 'flood',
        description: riskData.description || '',
      };
      const updatedRisks = [newItem, ...risks];
      persistRisks(updatedRisks);
      toast.success('เพิ่มพื้นที่เสี่ยงสำเร็จ');
    }

    setModals(prev => ({ ...prev, risk: false }));
    setEditingItem(null);
  };

  const saveDonation = (donationData: Partial<DonationNeed>) => {
    if (!donationData.item) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem && 'urgency' in editingItem) {
      const updatedDonations = donations.map(item =>
        item.id === editingItem.id ? { ...item, ...donationData } : item
      );
      persistDonations(updatedDonations);
      toast.success('แก้ไขของบริจาคสำเร็จ');
    } else {
      const newItem: DonationNeed = {
        id: generateId(),
        item: donationData.item!,
        category: donationData.category || 'อื่นๆ',
        urgency:
          (donationData.urgency as DonationNeed['urgency']) ||
          URGENCY_LEVELS.MEDIUM,
        quantity: donationData.quantity || '',
        status: donationData.status || 'needed',
      };
      const updatedDonations = [newItem, ...donations];
      persistDonations(updatedDonations);
      toast.success('เพิ่มของบริจาคสำเร็จ');
    }

    setModals(prev => ({ ...prev, donation: false }));
    setEditingItem(null);
  };

  const saveFaq = (faqData: Partial<FAQItem>) => {
    if (!faqData.question || !faqData.answer) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    if (editingItem && 'answer' in editingItem) {
      const updatedFaqs = faqs.map(item =>
        item.id === editingItem.id ? { ...item, ...faqData } : item
      );
      persistFaqs(updatedFaqs);
      toast.success('แก้ไข FAQ สำเร็จ');
    } else {
      const newItem: FAQItem = {
        id: generateId(),
        question: faqData.question!,
        answer: faqData.answer!,
        category: faqData.category || 'ทั่วไป',
      };
      const updatedFaqs = [newItem, ...faqs];
      persistFaqs(updatedFaqs);
      toast.success('เพิ่ม FAQ สำเร็จ');
    }

    setModals(prev => ({ ...prev, faq: false }));
    setEditingItem(null);
  };

  const sendNotification = (
    title: string,
    message: string,
    type: 'info' | 'warning' | 'success' | 'error'
  ) => {
    notificationStorage.add({
      id: generateId(),
      type,
      title,
      message,
      time: new Date().toISOString(),
      read: false,
    });
    toast.success('ส่งการแจ้งเตือนสำเร็จ');
    setModals(prev => ({ ...prev, notification: false }));
  };

  const exportData = (
    dataType: 'requests' | 'volunteers' | 'news' | 'shelters'
  ) => {
    const map = {
      requests: { data: requests, filename: 'help-requests.json' },
      volunteers: { data: volunteers, filename: 'volunteers.json' },
      news: { data: news, filename: 'news.json' },
      shelters: { data: shelters, filename: 'shelters.json' },
    };

    const entry = map[dataType];
    const blob = new Blob([JSON.stringify(entry.data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = entry.filename;
    a.click();
    toast.success('ดาวน์โหลดข้อมูลสำเร็จ');
  };

  const handleStatusFilter = (e: ChangeEvent<HTMLSelectElement>) =>
    setFilterStatus(e.target.value as HelpRequest['status'] | 'all');

  const handleUrgencyFilter = (e: ChangeEvent<HTMLSelectElement>) =>
    setFilterUrgency(e.target.value as HelpRequest['urgency'] | 'all');

  const filteredRequests = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return requests.filter(req => {
      const matchSearch =
        req.name.toLowerCase().includes(term) ||
        req.phone.includes(searchTerm) ||
        req.location.toLowerCase().includes(term);
      const matchStatus = filterStatus === 'all' || req.status === filterStatus;
      const matchUrgency =
        filterUrgency === 'all' || req.urgency === filterUrgency;
      return matchSearch && matchStatus && matchUrgency;
    });
  }, [requests, searchTerm, filterStatus, filterUrgency]);

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter(r => r.status === REQUEST_STATUS.PENDING).length,
      inProgress: requests.filter(r => r.status === REQUEST_STATUS.IN_PROGRESS)
        .length,
      completed: requests.filter(r => r.status === REQUEST_STATUS.COMPLETED)
        .length,
      volunteers: volunteers.length,
      verifiedVolunteers: volunteers.filter(v => v.verified).length,
      openShelters: shelters.filter(
        s => s.status === 'open' || s.status === 'available'
      ).length,
      criticalRisks: risks.filter(r => r.riskLevel === 'critical').length,
    }),
    [requests, volunteers, shelters, risks]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-50 bg-primary border-b border-[#e14a21]">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-white/20 p-2">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-base text-white sm:text-lg">
                    ระบบจัดการผู้ดูแล
                  </h1>
                  <p className="text-xs text-white/80">Admin Dashboard</p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="bg-white/10 text-white hover:bg-white/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">ออกจากระบบ</span>
              </Button>
            </div>
          </div>
        </header>

      <div className="sticky top-[57px] z-40 border-b border-gray-200 bg-white sm:top-[65px]">
        <div className="mx-auto max-w-7xl px-2 sm:px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex shrink-0 items-center gap-2 px-3 py-3 sm:px-4 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="whitespace-nowrap text-xs sm:text-sm">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl text-gray-900">ภาพรวมระบบ</h2>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <AlertCircle className="h-5 w-5 text-blue-600" />
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
                    <div className="rounded-lg bg-yellow-100 p-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
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
                    <div className="rounded-lg bg-green-100 p-2">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">อาสาสมัคร</p>
                      <p className="text-2xl text-gray-900">
                        {stats.verifiedVolunteers}/{stats.volunteers}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-red-100 p-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">พื้นที่วิกฤต</p>
                      <p className="text-2xl text-gray-900">
                        {stats.criticalRisks}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>คำขอล่าสุด</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {requests.slice(0, 5).map(req => (
                      <div
                        key={req.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{req.name}</p>
                          <p className="text-xs text-gray-500">
                            {getCategoryLabel(req.category)}
                          </p>
                        </div>
                        <StatusPill status={req.status} />
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
                      <div
                        key={shelter.id}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            {shelter.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {shelter.occupied}/{shelter.capacity} คน
                          </p>
                        </div>
                        <ShelterStatusPill status={shelter.status} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการคำขอความช่วยเหลือ</h2>
              <Button onClick={() => exportData('requests')} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="ค้นหา..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterStatus}
                    onChange={handleStatusFilter}
                    className="rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
                  >
                    <option value="all">สถานะทั้งหมด</option>
                    <option value="pending">รอดำเนินการ</option>
                    <option value="in-progress">กำลังดำเนินการ</option>
                    <option value="completed">เสร็จสิ้น</option>
                  </select>
                  <select
                    value={filterUrgency}
                    onChange={handleUrgencyFilter}
                    className="rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
                  >
                    <option value="all">ความเร่งด่วนทั้งหมด</option>
                    <option value="low">ปกติ</option>
                    <option value="medium">ค่อนข้างเร่งด่วน</option>
                    <option value="high">เร่งด่วน</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {filteredRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-900">
                            {request.name}
                          </p>
                          <UrgencyPill urgency={request.urgency} />
                          <StatusPill status={request.status} />
                        </div>
                        <div className="grid gap-2 text-xs text-gray-600 sm:grid-cols-2">
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {request.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {request.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="h-3 w-3" />
                            {getCategoryLabel(request.category)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(request.createdAt)}
                          </div>
                        </div>
                        {request.notes && (
                          <div className="rounded border border-yellow-200 bg-yellow-50 p-2 text-xs text-gray-600">
                            <span className="text-gray-700">หมายเหตุ: </span>
                            <span>{request.notes}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {request.status === REQUEST_STATUS.PENDING && (
                          <Button
                            onClick={() => {
                              setSelectedRequest(request);
                              setModals(prev => ({ ...prev, assign: true }));
                            }}
                            size="sm"
                          >
                            <UserCheck className="mr-1 h-4 w-4" />
                            มอบหมาย
                          </Button>
                        )}
                        {request.status === REQUEST_STATUS.IN_PROGRESS && (
                          <Button
                            onClick={() =>
                              updateRequestStatus(
                                request.id,
                                REQUEST_STATUS.COMPLETED
                              )
                            }
                            size="sm"
                            variant="outline"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            เสร็จสิ้น
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteRequest(request.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการอาสาสมัคร</h2>
              <Button
                onClick={() => exportData('volunteers')}
                variant="outline"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {volunteers.map(volunteer => (
                <Card key={volunteer.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-900">
                              {volunteer.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {volunteer.phone}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={volunteer.verified ? 'success' : 'warning'}
                        >
                          {volunteer.verified ? (
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              ยืนยันแล้ว
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              รอยืนยัน
                            </span>
                          )}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-gray-500">ทักษะ:</p>
                        <div className="flex flex-wrap gap-1">
                          {formatSkills(volunteer.skills).map((skill, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-gray-100 px-2 py-0.5 text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">งานที่ได้รับ:</span>
                        <span className="text-gray-900">
                          {volunteer.assignedTasks} งาน
                        </span>
                      </div>

                      <div className="flex gap-2">
                        {!volunteer.verified && (
                          <Button
                            onClick={() => verifyVolunteer(volunteer.id)}
                            size="sm"
                            className="flex-1"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            ยืนยัน
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteVolunteer(volunteer.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการข่าวสาร</h2>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setModals(prev => ({ ...prev, news: true }));
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มข่าว
              </Button>
            </div>

            <div className="space-y-3">
              {news.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="mb-1 text-sm text-gray-900">
                          {item.title}
                        </h3>
                        <p className="mb-2 text-xs text-gray-600">
                          {item.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge variant="secondary">{item.category}</Badge>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(item);
                            setModals(prev => ({ ...prev, news: true }));
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteNews(item.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'shelters' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการศูนย์พักพิง</h2>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setModals(prev => ({ ...prev, shelter: true }));
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มศูนย์พักพิง
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {shelters.map(shelter => (
                <Card key={shelter.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm text-gray-900">
                            {shelter.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {shelter.location}
                          </p>
                        </div>
                        <ShelterStatusPill status={shelter.status} />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">ความจุ:</span>
                        <span className="text-gray-900">
                          {shelter.occupied}/{shelter.capacity} คน
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(shelter);
                            setModals(prev => ({ ...prev, shelter: true }));
                          }}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Edit2 className="mr-1 h-4 w-4" />
                          แก้ไข
                        </Button>
                        <Button
                          onClick={() =>
                            confirmDelete(
                              'ยืนยันการลบ',
                              'คุณแน่ใจหรือไม่ที่จะลบศูนย์พักพิงนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
                              () => {
                                const updatedShelters = shelters.filter(
                                  item => item.id !== shelter.id
                                );
                                persistShelters(updatedShelters);
                                toast.success('ลบศูนย์พักพิงสำเร็จ');
                              }
                            )
                          }
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการพื้นที่เสี่ยง</h2>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setModals(prev => ({ ...prev, risk: true }));
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มพื้นที่เสี่ยง
              </Button>
            </div>

            <div className="space-y-3">
              {risks.map(risk => (
                <Card key={risk.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-sm text-gray-900">{risk.name}</h3>
                          <RiskPill level={risk.riskLevel} />
                        </div>
                        <p className="mb-1 text-xs text-gray-600">
                          {risk.location}
                        </p>
                        {risk.description && (
                          <p className="text-xs text-gray-500">
                            {risk.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(risk);
                            setModals(prev => ({ ...prev, risk: true }));
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            confirmDelete(
                              'ยืนยันการลบ',
                              'คุณแน่ใจหรือไม่ที่จะลบพื้นที่เสี่ยงนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
                              () => {
                                const updatedRisks = risks.filter(
                                  item => item.id !== risk.id
                                );
                                persistRisks(updatedRisks);
                                toast.success('ลบพื้นที่เสี่ยงสำเร็จ');
                              }
                            )
                          }
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการของบริจาค</h2>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setModals(prev => ({ ...prev, donation: true }));
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                เพิ่มรายการ
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {donations.map(donation => (
                <Card key={donation.id}>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm text-gray-900">
                            {donation.item}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {donation.category}
                          </p>
                        </div>
                        <UrgencyPill urgency={donation.urgency} />
                      </div>

                      {donation.quantity && (
                        <p className="text-xs text-gray-600">
                          จำนวน: {donation.quantity}
                        </p>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(donation);
                            setModals(prev => ({ ...prev, donation: true }));
                          }}
                          size="sm"
                          variant="outline"
                          className="flex-1"
                        >
                          <Edit2 className="mr-1 h-4 w-4" />
                          แก้ไข
                        </Button>
                        <Button
                          onClick={() =>
                            confirmDelete(
                              'ยืนยันการลบ',
                              'คุณแน่ใจหรือไม่ที่จะลบรายการนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
                              () => {
                                const updatedDonations = donations.filter(
                                  item => item.id !== donation.id
                                );
                                persistDonations(updatedDonations);
                                toast.success('ลบรายการสำเร็จ');
                              }
                            )
                          }
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">จัดการคำถามที่พบบ่อย</h2>
              <Button
                onClick={() => {
                  setEditingItem(null);
                  setModals(prev => ({ ...prev, faq: true }));
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                เพิ่ม FAQ
              </Button>
            </div>

            <div className="space-y-3">
              {faqs.map(faq => (
                <Card key={faq.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-sm text-gray-900">
                            {faq.question}
                          </h3>
                          <Badge variant="secondary">{faq.category}</Badge>
                        </div>
                        <p className="text-xs text-gray-600">{faq.answer}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            setEditingItem(faq);
                            setModals(prev => ({ ...prev, faq: true }));
                          }}
                          size="sm"
                          variant="outline"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() =>
                            confirmDelete(
                              'ยืนยันการลบ',
                              'คุณแน่ใจหรือไม่ที่จะลบคำถามนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้',
                              () => {
                                const updatedFaqs = faqs.filter(
                                  item => item.id !== faq.id
                                );
                                persistFaqs(updatedFaqs);
                                toast.success('ลบคำถามสำเร็จ');
                              }
                            )
                          }
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-gray-900">ส่งการแจ้งเตือน</h2>
              <Button
                onClick={() =>
                  setModals(prev => ({ ...prev, notification: true }))
                }
              >
                <Send className="mr-2 h-4 w-4" />
                ส่งแจ้งเตือนใหม่
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="py-8 text-center">
                  <Bell className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-600">
                    คลิกปุ่มด้านบนเพื่อส่งการแจ้งเตือนไปยังผู้ใช้ทั้งหมด
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl text-gray-900">ตั้งค่าระบบ</h2>

            <Card>
              <CardHeader>
                <CardTitle>การส่งออกข้อมูล</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    onClick={() => exportData('requests')}
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export คำขอช่วยเหลือ
                  </Button>
                  <Button
                    onClick={() => exportData('volunteers')}
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export อาสาสมัคร
                  </Button>
                  <Button onClick={() => exportData('news')} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export ข่าวสาร
                  </Button>
                  <Button
                    onClick={() => exportData('shelters')}
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
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
                    <span className="text-gray-900">
                      {stats.verifiedVolunteers}
                    </span>
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

      {modals.assign && selectedRequest && (
        <ModalShell
          title="มอบหมายงานให้อาสาสมัคร"
          onClose={() => setModals(prev => ({ ...prev, assign: false }))}
          maxWidth="max-w-md"
        >
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="mb-1 text-sm text-gray-900">
              คำขอ: {selectedRequest.name}
            </p>
            <p className="text-xs text-gray-600">
              {getCategoryLabel(selectedRequest.category)}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-700">
              หมายเหตุสำหรับอาสาสมัคร
            </label>
            <Textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              placeholder="ข้อมูลเพิ่มเติมสำหรับอาสาสมัคร..."
              rows={3}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-700">
              เลือกอาสาสมัคร
            </label>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {volunteers
                .filter(v => v.verified)
                .map(volunteer => (
                  <button
                    key={volunteer.id}
                    onClick={() =>
                      assignToVolunteer(selectedRequest.id, volunteer.id)
                    }
                    className="w-full rounded-lg border-2 border-gray-200 p-3 text-left transition-colors hover:border-primary"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-900">
                          {volunteer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatSkills(volunteer.skills).join(', ')}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {volunteer.assignedTasks} งาน
                      </Badge>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          <Button
            onClick={() => setModals(prev => ({ ...prev, assign: false }))}
            variant="outline"
            className="w-full"
          >
            ยกเลิก
          </Button>
        </ModalShell>
      )}

      {modals.news && (
        <NewsModal
          editingItem={editingItem as NewsItem | null}
          onSave={saveNews}
          onClose={() => {
            setModals(prev => ({ ...prev, news: false }));
            setEditingItem(null);
          }}
        />
      )}

      {modals.shelter && (
        <ShelterModal
          editingItem={editingItem as Shelter | null}
          onSave={saveShelter}
          onClose={() => {
            setModals(prev => ({ ...prev, shelter: false }));
            setEditingItem(null);
          }}
        />
      )}

      {modals.risk && (
        <RiskModal
          editingItem={editingItem as RiskArea | null}
          onSave={saveRisk}
          onClose={() => {
            setModals(prev => ({ ...prev, risk: false }));
            setEditingItem(null);
          }}
        />
      )}

      {modals.donation && (
        <DonationModal
          editingItem={editingItem as DonationNeed | null}
          onSave={saveDonation}
          onClose={() => {
            setModals(prev => ({ ...prev, donation: false }));
            setEditingItem(null);
          }}
        />
      )}

      {modals.faq && (
        <FaqModal
          editingItem={editingItem as FAQItem | null}
          onSave={saveFaq}
          onClose={() => {
            setModals(prev => ({ ...prev, faq: false }));
            setEditingItem(null);
          }}
        />
      )}

      {modals.notification && (
        <NotificationModal
          onSend={sendNotification}
          onClose={() => setModals(prev => ({ ...prev, notification: false }))}
        />
      )}

      <Toaster position="top-center" richColors />

      <AlertDialog
        open={alertDialog.open}
        onOpenChange={open => setAlertDialog({ ...alertDialog, open })}
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

function NewsModal({
  editingItem,
  onSave,
  onClose,
}: {
  editingItem: NewsItem | null;
  onSave: (data: Partial<NewsItem>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    category: string;
    type: NewsItem['type'];
    urgent: boolean;
  }>({
    title: editingItem?.title || '',
    content: editingItem?.content || '',
    category: editingItem?.category || 'general',
    type: editingItem?.type || 'info',
    urgent: editingItem?.urgent || false,
  });

  return (
    <ModalShell
      title={editingItem ? 'แก้ไขข่าว' : 'เพิ่มข่าวใหม่'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={() => onSave(formData)} className="flex-1">
            บันทึก
          </Button>
          <Button onClick={onClose} variant="outline">
            ยกเลิก
          </Button>
        </>
      }
    >
      <div>
        <label className="mb-2 block text-sm text-gray-700">หัวข้อข่าว</label>
        <Input
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="หัวข้อข่าว"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">เนื้อหา</label>
        <Textarea
          value={formData.content}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          placeholder="เนื้อหาข่าว"
          rows={5}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-gray-700">ประเภท</label>
          <select
            value={formData.category}
            onChange={e =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
          >
            <option value="general">ทั่วไป</option>
            <option value="emergency">ฉุกเฉิน</option>
            <option value="warning">เตือนภัย</option>
            <option value="announcement">ประกาศ</option>
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-700">ระดับ</label>
          <select
            value={formData.type}
            onChange={e =>
              setFormData({
                ...formData,
                type: e.target.value as NewsItem['type'],
              })
            }
            className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
          >
            <option value="info">ข้อมูล</option>
            <option value="update">อัปเดต</option>
            <option value="warning">เตือนภัย</option>
          </select>
        </div>
      </div>
    </ModalShell>
  );
}

function ShelterModal({
  editingItem,
  onSave,
  onClose,
}: {
  editingItem: Shelter | null;
  onSave: (data: Partial<Shelter>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    location: editingItem?.location || '',
    capacity: editingItem?.capacity || 0,
    occupied: editingItem?.occupied || 0,
    status: editingItem?.status || 'open',
  });

  return (
    <ModalShell
      title={editingItem ? 'แก้ไขศูนย์พักพิง' : 'เพิ่มศูนย์พักพิง'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={() => onSave(formData)} className="flex-1">
            บันทึก
          </Button>
          <Button onClick={onClose} variant="outline">
            ยกเลิก
          </Button>
        </>
      }
    >
      <div>
        <label className="mb-2 block text-sm text-gray-700">
          ชื่อศูนย์พักพิง
        </label>
        <Input
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="ชื่อศูนย์พักพิง"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">สถานที่</label>
        <Input
          value={formData.location}
          onChange={e => setFormData({ ...formData, location: e.target.value })}
          placeholder="สถานที่"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm text-gray-700">
            ความจุ (คน)
          </label>
          <Input
            type="number"
            value={formData.capacity}
            onChange={e =>
              setFormData({
                ...formData,
                capacity: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-700">
            ใช้งานแล้ว (คน)
          </label>
          <Input
            type="number"
            value={formData.occupied}
            onChange={e =>
              setFormData({
                ...formData,
                occupied: parseInt(e.target.value) || 0,
              })
            }
            placeholder="0"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">สถานะ</label>
        <select
          value={formData.status}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFormData({
              ...formData,
              status: e.target.value as Shelter['status'],
            })
          }
          className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
        >
          <option value="open">เปิด</option>
          <option value="full">เต็ม</option>
          <option value="closed">ปิด</option>
        </select>
      </div>
    </ModalShell>
  );
}

function RiskModal({
  editingItem,
  onSave,
  onClose,
}: {
  editingItem: RiskArea | null;
  onSave: (data: Partial<RiskArea>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    name: editingItem?.name || '',
    location: editingItem?.location || '',
    riskLevel: editingItem?.riskLevel || 'medium',
    description: editingItem?.description || '',
  });

  return (
    <ModalShell
      title={editingItem ? 'แก้ไขพื้นที่เสี่ยง' : 'เพิ่มพื้นที่เสี่ยง'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={() => onSave(formData)} className="flex-1">
            บันทึก
          </Button>
          <Button onClick={onClose} variant="outline">
            ยกเลิก
          </Button>
        </>
      }
    >
      <div>
        <label className="mb-2 block text-sm text-gray-700">ชื่อพื้นที่</label>
        <Input
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder="ชื่อพื้นที่"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">สถานที่</label>
        <Input
          value={formData.location}
          onChange={e => setFormData({ ...formData, location: e.target.value })}
          placeholder="สถานที่"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">
          ระดับความเสี่ยง
        </label>
        <select
          value={formData.riskLevel}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFormData({
              ...formData,
              riskLevel: e.target.value as RiskArea['riskLevel'],
            })
          }
          className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
        >
          <option value="low">ต่ำ</option>
          <option value="medium">ปานกลาง</option>
          <option value="high">สูง</option>
          <option value="critical">วิกฤต</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">รายละเอียด</label>
        <Textarea
          value={formData.description}
          onChange={e =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="รายละเอียดเพิ่มเติม"
          rows={3}
        />
      </div>
    </ModalShell>
  );
}

function DonationModal({
  editingItem,
  onSave,
  onClose,
}: {
  editingItem: DonationNeed | null;
  onSave: (data: Partial<DonationNeed>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    item: editingItem?.item || '',
    category: editingItem?.category || 'อื่นๆ',
    urgency: editingItem?.urgency || URGENCY_LEVELS.MEDIUM,
    quantity: editingItem?.quantity || '',
    status: editingItem?.status || 'needed',
  });

  return (
    <ModalShell
      title={editingItem ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={() => onSave(formData)} className="flex-1">
            บันทึก
          </Button>
          <Button onClick={onClose} variant="outline">
            ยกเลิก
          </Button>
        </>
      }
    >
      <div>
        <label className="mb-2 block text-sm text-gray-700">รายการ</label>
        <Input
          value={formData.item}
          onChange={e => setFormData({ ...formData, item: e.target.value })}
          placeholder="ชื่อสิ่งของ"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">ประเภท</label>
        <select
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
        >
          <option value="อาหาร">อาหาร</option>
          <option value="น้ำดื่ม">น้ำดื่ม</option>
          <option value="เสื้อผ้า">เสื้อผ้า</option>
          <option value="ยา">ยา</option>
          <option value="อื่นๆ">อื่นๆ</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">จำนวน</label>
        <Input
          value={formData.quantity}
          onChange={e => setFormData({ ...formData, quantity: e.target.value })}
          placeholder="เช่น 100 กล่อง"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">ความเร่งด่วน</label>
        <select
          value={formData.urgency}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFormData({
              ...formData,
              urgency: e.target.value as DonationNeed['urgency'],
            })
          }
          className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
        >
          <option value="low">ปกติ</option>
          <option value="medium">ค่อนข้างเร่งด่วน</option>
          <option value="high">เร่งด่วน</option>
        </select>
      </div>
    </ModalShell>
  );
}

function FaqModal({
  editingItem,
  onSave,
  onClose,
}: {
  editingItem: FAQItem | null;
  onSave: (data: Partial<FAQItem>) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    question: editingItem?.question || '',
    answer: editingItem?.answer || '',
    category: editingItem?.category || 'ทั่วไป',
  });

  return (
    <ModalShell
      title={editingItem ? 'แก้ไข FAQ' : 'เพิ่ม FAQ ใหม่'}
      onClose={onClose}
      footer={
        <>
          <Button onClick={() => onSave(formData)} className="flex-1">
            บันทึก
          </Button>
          <Button onClick={onClose} variant="outline">
            ยกเลิก
          </Button>
        </>
      }
    >
      <div>
        <label className="mb-2 block text-sm text-gray-700">คำถาม</label>
        <Input
          value={formData.question}
          onChange={e => setFormData({ ...formData, question: e.target.value })}
          placeholder="คำถาม"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">คำตอบ</label>
        <Textarea
          value={formData.answer}
          onChange={e => setFormData({ ...formData, answer: e.target.value })}
          placeholder="คำตอบ"
          rows={5}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">หมวดหมู่</label>
        <Input
          value={formData.category}
          onChange={e => setFormData({ ...formData, category: e.target.value })}
          placeholder="หมวดหมู่"
        />
      </div>
    </ModalShell>
  );
}

function NotificationModal({
  onSend,
  onClose,
}: {
  onSend: (title: string, message: string, type: NotificationType) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as NotificationType,
  });

  return (
    <ModalShell
      title="ส่งการแจ้งเตือนใหม่"
      onClose={onClose}
      footer={
        <>
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
            <Send className="mr-2 h-4 w-4" />
            ส่งแจ้งเตือน
          </Button>
          <Button onClick={onClose} variant="outline">
            ยกเลิก
          </Button>
        </>
      }
    >
      <div>
        <label className="mb-2 block text-sm text-gray-700">หัวข้อ</label>
        <Input
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          placeholder="หัวข้อการแจ้งเตือน"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">ข้อความ</label>
        <Textarea
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          placeholder="ข้อความแจ้งเตือน"
          rows={4}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm text-gray-700">ประเภท</label>
        <select
          value={formData.type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setFormData({
              ...formData,
              type: e.target.value as NotificationType,
            })
          }
          className="w-full rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-primary focus:outline-none"
        >
          <option value="info">ข้อมูล</option>
          <option value="warning">เตือน</option>
          <option value="success">สำเร็จ</option>
          <option value="error">ข้อผิดพลาด</option>
        </select>
      </div>
    </ModalShell>
  );
}
