import { useState, useEffect } from 'react';
import { Users, LogOut, Package, Clock, CheckCircle, MapPin, Phone, User, Navigation, MessageCircle, Camera, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';

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
  volunteerNotes?: string;
  progressPhotos?: string[];
}

export function VolunteerDashboard() {
  const [myTasks, setMyTasks] = useState<HelpRequest[]>([]);
  const [availableTasks, setAvailableTasks] = useState<HelpRequest[]>([]);
  const [selectedTask, setSelectedTask] = useState<HelpRequest | null>(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'my-tasks' | 'available'>('my-tasks');
  const volunteerId = 'v1'; // In real app, get from login

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadTasks = () => {
    const storedRequests = localStorage.getItem('helpRequests');
    if (storedRequests) {
      const requests: HelpRequest[] = JSON.parse(storedRequests);
      setMyTasks(requests.filter(r => r.assignedTo === volunteerId && r.status !== 'completed'));
      setAvailableTasks(requests.filter(r => !r.assignedTo && r.status === 'pending'));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.reload();
  };

  const acceptTask = (taskId: string) => {
    const storedRequests = localStorage.getItem('helpRequests');
    if (storedRequests) {
      const requests: HelpRequest[] = JSON.parse(storedRequests);
      const updatedRequests = requests.map(req =>
        req.id === taskId ? { ...req, assignedTo: volunteerId, status: 'in-progress' as const } : req
      );
      localStorage.setItem('helpRequests', JSON.stringify(updatedRequests));
      loadTasks();
      toast.success('รับงานสำเร็จ!');
    }
  };

  const completeTask = (taskId: string) => {
    const storedRequests = localStorage.getItem('helpRequests');
    if (storedRequests) {
      const requests: HelpRequest[] = JSON.parse(storedRequests);
      const updatedRequests = requests.map(req =>
        req.id === taskId ? { ...req, status: 'completed' as const } : req
      );
      localStorage.setItem('helpRequests', JSON.stringify(updatedRequests));
      
      // Add completion notification
      const task = requests.find(r => r.id === taskId);
      if (task) {
        const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        notifications.unshift({
          id: Date.now().toString(),
          type: 'success',
          title: 'ทำงานเสร็จสิ้น',
          message: `คุณทำงานช่วยเหลือคุณ${task.name}เสร็จสิ้นแล้ว`,
          time: new Date().toISOString(),
          read: false
        });
        localStorage.setItem('notifications', JSON.stringify(notifications));
      }
      
      loadTasks();
      toast.success('ทำงานเสร็จสิ้น! ขอบคุณสำหรับการช่วยเหลือ');
    }
  };

  const saveTaskNotes = (taskId: string) => {
    const storedRequests = localStorage.getItem('helpRequests');
    if (storedRequests) {
      const requests: HelpRequest[] = JSON.parse(storedRequests);
      const updatedRequests = requests.map(req =>
        req.id === taskId ? { ...req, volunteerNotes: taskNotes } : req
      );
      localStorage.setItem('helpRequests', JSON.stringify(updatedRequests));
      setTaskNotes('');
      setSelectedTask(null);
      loadTasks();
      toast.success('บันทึกหมายเหตุสำเร็จ');
    }
  };

  const getCategoryName = (category: string) => {
    const categories: Record<string, string> = {
      food: 'อาหารและน้ำดื่ม',
      shelter: 'ที่พักพิง',
      medical: 'การรักษาพยาบาล',
      clothing: 'เสื้อผ้า',
      evacuation: 'ขอการอพยพ',
      other: 'อื่นๆ'
    };
    return categories[category] || category;
  };

  const getUrgencyLabel = (urgency: string) => {
    const labels: Record<string, string> = {
      high: 'เร่งด่วน',
      medium: 'ปานกลาง',
      low: 'ไม่เร่งด่วน'
    };
    return labels[urgency] || urgency;
  };

  const openNavigation = (location: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2.5 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg text-gray-900">ระบบอาสาสมัคร</h1>
                <p className="text-xs sm:text-sm text-gray-500">Volunteer Dashboard</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-700 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border-2 border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">งานของฉัน</p>
                <p className="text-3xl text-blue-700 mt-1">{myTasks.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">งานใหม่</p>
                <p className="text-3xl text-green-700 mt-1">{availableTasks.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border-2 border-gray-200 mb-6 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('my-tasks')}
              className={`flex-1 px-6 py-3 text-sm transition-colors ${
                activeTab === 'my-tasks'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              งานของฉัน ({myTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('available')}
              className={`flex-1 px-6 py-3 text-sm transition-colors ${
                activeTab === 'available'
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              งานที่รับได้ ({availableTasks.length})
            </button>
          </div>
        </div>

        {/* My Tasks */}
        {activeTab === 'my-tasks' && (
          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">คุณยังไม่มีงานที่ต้องทำ</p>
                <button
                  onClick={() => setActiveTab('available')}
                  className="mt-4 px-6 py-2 rounded-lg bg-primary text-white hover:bg-[#e14a21] transition-colors text-sm"
                >
                  ดูงานที่รับได้
                </button>
              </div>
            ) : (
              myTasks.map(task => (
                <div key={task.id} className="bg-white rounded-xl border-2 border-blue-200 p-4">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base text-gray-900">{task.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            task.urgency === 'high' ? 'bg-red-100 text-red-700' :
                            task.urgency === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {getUrgencyLabel(task.urgency)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(task.createdAt).toLocaleString('th-TH')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Package className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-600">ประเภท: </span>
                          <span className="text-gray-900">{getCategoryName(task.category)}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-gray-600">สถานที่: </span>
                          <span className="text-gray-900">{task.location}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-600">โทร: </span>
                          <a href={`tel:${task.phone}`} className="text-primary hover:underline">
                            {task.phone}
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-600">รายละเอียด: </span>
                          <span className="text-gray-900">{task.description}</span>
                        </div>
                      </div>

                      {task.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-xs">
                          <span className="font-medium text-yellow-900">หมายเหตุจากแอดมิน: </span>
                          <span className="text-yellow-800">{task.notes}</span>
                        </div>
                      )}

                      {task.volunteerNotes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs">
                          <span className="font-medium text-blue-900">หมายเหตุของฉัน: </span>
                          <span className="text-blue-800">{task.volunteerNotes}</span>
                        </div>
                      )}
                    </div>

                    {/* Note Input */}
                    {selectedTask?.id === task.id && (
                      <div className="pt-3 border-t border-gray-200">
                        <textarea
                          value={taskNotes}
                          onChange={(e) => setTaskNotes(e.target.value)}
                          placeholder="บันทึกความคืบหน้าหรือหมายเหตุ..."
                          className="w-full px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm resize-none"
                          rows={3}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => saveTaskNotes(task.id)}
                            className="px-4 py-2 rounded-lg bg-primary text-white text-sm hover:bg-[#e14a21] transition-colors"
                          >
                            บันทึก
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTask(null);
                              setTaskNotes('');
                            }}
                            className="px-4 py-2 rounded-lg border-2 border-gray-200 text-gray-700 text-sm hover:border-gray-300 transition-colors"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => openNavigation(task.location)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>นำทาง</span>
                      </button>
                      <a
                        href={`tel:${task.phone}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>โทร</span>
                      </a>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setTaskNotes(task.volunteerNotes || '');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-sm transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>เพิ่มหมายเหตุ</span>
                      </button>
                      <button
                        onClick={() => completeTask(task.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm transition-colors ml-auto"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>ทำเสร็จแล้ว</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Available Tasks */}
        {activeTab === 'available' && (
          <div className="space-y-3">
            {availableTasks.length === 0 ? (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">ไม่มีงานใหม่ในขณะนี้</p>
              </div>
            ) : (
              availableTasks.map(task => (
                <div key={task.id} className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-300 p-4 transition-colors">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base text-gray-900">{task.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            task.urgency === 'high' ? 'bg-red-100 text-red-700' :
                            task.urgency === 'medium' ? 'bg-orange-100 text-orange-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {getUrgencyLabel(task.urgency)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(task.createdAt).toLocaleString('th-TH')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Package className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-600">ประเภท: </span>
                          <span className="text-gray-900">{getCategoryName(task.category)}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-gray-600">สถานที่: </span>
                          <span className="text-gray-900">{task.location}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <MessageCircle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="text-gray-600">รายละเอียด: </span>
                          <span className="text-gray-900">{task.description}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={() => acceptTask(task.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-[#e14a21] text-white text-sm transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>รับงานนี้</span>
                      </button>
                      <button
                        onClick={() => openNavigation(task.location)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-sm transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>ดูแผนที่</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
    </div>
  );
}