import { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, Search, Package, MapPin, Circle, AlertTriangle, Phone as PhoneIcon, Star, Users, Baby, Accessibility, Heart, PawPrint, Pill, User, ChevronDown, ChevronUp } from 'lucide-react';
import { RatingSystem } from './RatingSystem';

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
  specialNeeds?: {
    elderly?: boolean;
    children?: boolean;
    disabled?: boolean;
    pregnant?: boolean;
    pets?: boolean;
    medical?: boolean;
  };
  elderlyCount?: number;
  childrenCount?: number;
  disabledCount?: number;
  pregnantCount?: number;
  petsCount?: number;
  petsType?: string;
  medicalNeeds?: string;
}

export function RequestsList() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [showRating, setShowRating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [sortByUrgency, setSortByUrgency] = useState(true);

  useEffect(() => {
    const loadRequests = () => {
      const stored = localStorage.getItem('helpRequests');
      if (stored) {
        setRequests(JSON.parse(stored));
      }
    };

    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredRequests = requests
    .filter(req => searchPhone === '' || req.phone.includes(searchPhone))
    .filter(req => filterStatus === 'all' || req.status === filterStatus)
    .sort((a, b) => {
      // Sort by urgency first (if enabled)
      if (sortByUrgency) {
        const urgencyOrder = { high: 0, medium: 1, low: 2 };
        const urgencyDiff = urgencyOrder[a.urgency as keyof typeof urgencyOrder] - urgencyOrder[b.urgency as keyof typeof urgencyOrder];
        if (urgencyDiff !== 0) return urgencyDiff;
      }
      // Then by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Calculate statistics
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    inProgress: requests.filter(r => r.status === 'in-progress').length,
    completed: requests.filter(r => r.status === 'completed').length
  };

  const getStatusBadge = (status: HelpRequest['status']) => {
    switch (status) {
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4" />,
          text: 'เสร็จสิ้น',
          bg: 'bg-green-100',
          text_color: 'text-green-700'
        };
      case 'in-progress':
        return {
          icon: <Clock className="w-4 h-4" />,
          text: 'กำลังดำเนินการ',
          bg: 'bg-blue-100',
          text_color: 'text-blue-700'
        };
      default:
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'รอดำเนินการ',
          bg: 'bg-orange-100',
          text_color: 'text-orange-700'
        };
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return { 
          icon: <AlertTriangle className="w-4 h-4" />,
          text: 'เร่งด่วน', 
          bg: 'bg-red-100',
          text_color: 'text-red-700'
        };
      case 'medium':
        return { 
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'ปานกลาง', 
          bg: 'bg-orange-100',
          text_color: 'text-orange-700'
        };
      default:
        return { 
          icon: <Circle className="w-4 h-4" />,
          text: 'ไม่เร่งด่วน', 
          bg: 'bg-green-100',
          text_color: 'text-green-700'
        };
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

  return (
    <div className="space-y-4">
      {/* Statistics */}
      {stats.total > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setFilterStatus('all')}
            className={`text-left border rounded-lg p-4 transition-all ${
              filterStatus === 'all' 
                ? 'bg-gray-900 border-gray-900 text-white' 
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`flex items-center gap-2 mb-1 ${filterStatus === 'all' ? 'text-white' : 'text-gray-600'}`}>
              <Package className="w-4 h-4" />
              <span className="text-xs">ทั้งหมด</span>
            </div>
            <div className={`text-2xl ${filterStatus === 'all' ? 'text-white' : 'text-gray-900'}`}>{stats.total}</div>
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`text-left border rounded-lg p-4 transition-all ${
              filterStatus === 'pending' 
                ? 'bg-orange-500 border-orange-500 text-white' 
                : 'bg-white border-orange-200 hover:border-orange-300'
            }`}
          >
            <div className={`flex items-center gap-2 mb-1 ${filterStatus === 'pending' ? 'text-white' : 'text-orange-600'}`}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">รอดำเนินการ</span>
            </div>
            <div className={`text-2xl ${filterStatus === 'pending' ? 'text-white' : 'text-orange-600'}`}>{stats.pending}</div>
          </button>
          <button
            onClick={() => setFilterStatus('in-progress')}
            className={`text-left border rounded-lg p-4 transition-all ${
              filterStatus === 'in-progress' 
                ? 'bg-blue-500 border-blue-500 text-white' 
                : 'bg-white border-blue-200 hover:border-blue-300'
            }`}
          >
            <div className={`flex items-center gap-2 mb-1 ${filterStatus === 'in-progress' ? 'text-white' : 'text-blue-600'}`}>
              <Clock className="w-4 h-4" />
              <span className="text-xs">กำลังดำเนินการ</span>
            </div>
            <div className={`text-2xl ${filterStatus === 'in-progress' ? 'text-white' : 'text-blue-600'}`}>{stats.inProgress}</div>
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`text-left border rounded-lg p-4 transition-all ${
              filterStatus === 'completed' 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'bg-white border-green-200 hover:border-green-300'
            }`}
          >
            <div className={`flex items-center gap-2 mb-1 ${filterStatus === 'completed' ? 'text-white' : 'text-green-600'}`}>
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs">เสร็จสิ้น</span>
            </div>
            <div className={`text-2xl ${filterStatus === 'completed' ? 'text-white' : 'text-green-600'}`}>{stats.completed}</div>
          </button>
        </div>
      )}

      {/* Search Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-gray-900 mb-1">ติดตามสถานะคำขอ</h2>
        <p className="text-sm text-gray-600 mb-4">ค้นหาด้วยเบอร์โทรศัพท์</p>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            placeholder="0xx-xxx-xxxx"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-900 mb-1">
            {searchPhone ? 'ไม่พบคำขอที่ตรงกับเบอร์โทรศัพท์' : filterStatus !== 'all' ? `ไม่มีคำขอในสถานะนี้` : 'ยังไม่มีคำขอความช่วยเหลือ'}
          </p>
          <p className="text-sm text-gray-500">
            {searchPhone ? 'ลองค้นหาด้วยเบอร์อื่น' : filterStatus !== 'all' ? 'ลองเลือกดูสถานะอื่น' : 'กรอกเบอร์โทรศัพท์เพื่อค้นหา'}
          </p>
        </div>
      ) : (
        <>
          {/* Result Count */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-gray-600">
              แสดง <span className="text-gray-900">{filteredRequests.length}</span> รายการ
              {filterStatus !== 'all' && <span className="text-gray-500"> (กรองตามสถานะ)</span>}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">เรียงด่วนก่อน</span>
              <button
                onClick={() => setSortByUrgency(!sortByUrgency)}
                className={`w-10 h-6 rounded-full transition-colors relative ${
                  sortByUrgency ? 'bg-primary' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  sortByUrgency ? 'right-1' : 'left-1'
                }`} />
              </button>
            </div>
          </div>

          <div className="space-y-3">{filteredRequests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            const isExpanded = expandedId === request.id;
            const hasSpecialNeeds = request.specialNeeds && Object.values(request.specialNeeds).some(v => v);
            
            return (
              <div
                key={request.id}
                className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-all"
              >
                {/* Visual Status Bar */}
                <div className={`h-1.5 ${
                  request.status === 'completed' ? 'bg-green-500' :
                  request.status === 'in-progress' ? 'bg-blue-500' : 'bg-orange-500'
                }`} />

                <div className="p-4">
                  {/* Compact Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      {/* Name + Status */}
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-gray-900 truncate">{request.name}</h3>
                        {request.urgency === 'high' && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500 text-white flex-shrink-0">
                            <AlertTriangle className="w-3 h-3" />
                            <span className="text-xs">ด่วน</span>
                          </div>
                        )}
                      </div>

                      {/* Phone + Category */}
                      <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1.5">
                          <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                          <span>{request.phone}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="truncate">{getCategoryName(request.category)}</span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{request.location}</span>
                      </div>

                      {/* Special Needs Icons Only */}
                      {hasSpecialNeeds && (
                        <div className="flex items-center gap-1.5">
                          {request.specialNeeds?.elderly && (
                            <div className="p-1.5 bg-gray-100 rounded" title={`ผู้สูงอายุ ${request.elderlyCount || ''} คน`}>
                              <Users className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                          )}
                          {request.specialNeeds?.children && (
                            <div className="p-1.5 bg-gray-100 rounded" title={`เด็ก ${request.childrenCount || ''} คน`}>
                              <Baby className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                          )}
                          {request.specialNeeds?.disabled && (
                            <div className="p-1.5 bg-gray-100 rounded" title="ผู้พิการ">
                              <Accessibility className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                          )}
                          {request.specialNeeds?.pregnant && (
                            <div className="p-1.5 bg-gray-100 rounded" title={`หญิงมีครรภ์ ${request.pregnantCount || ''} คน`}>
                              <Heart className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                          )}
                          {request.specialNeeds?.pets && (
                            <div className="p-1.5 bg-gray-100 rounded" title="สัตว์เลี้ยง">
                              <PawPrint className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                          )}
                          {request.specialNeeds?.medical && (
                            <div className="p-1.5 bg-gray-100 rounded" title="ต้องการยา">
                              <Pill className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expand Button */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : request.id)}
                      className="flex-shrink-0 p-1.5 hover:bg-gray-100 rounded transition-colors"
                      title={isExpanded ? "ซ่อนรายละเอียด" : "ดูรายละเอียด"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="pt-3 mt-3 border-t border-gray-200 space-y-3">
                      {/* Description */}
                      {request.description && (
                        <div>
                          <div className="text-xs text-gray-500 mb-1">รายละเอียด</div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {request.description}
                          </p>
                        </div>
                      )}

                      {/* Special Needs Detail */}
                      {hasSpecialNeeds && (
                        <div>
                          <div className="text-xs text-gray-500 mb-2">กลุ่มเสี่ยงพิเศษ</div>
                          <div className="space-y-1.5 text-sm text-gray-700">
                            {request.specialNeeds?.elderly && request.elderlyCount && (
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span>ผู้สูงอายุ {request.elderlyCount} คน</span>
                              </div>
                            )}
                            {request.specialNeeds?.children && request.childrenCount && (
                              <div className="flex items-center gap-2">
                                <Baby className="w-4 h-4 text-gray-400" />
                                <span>เด็ก {request.childrenCount} คน</span>
                              </div>
                            )}
                            {request.specialNeeds?.disabled && (
                              <div className="flex items-center gap-2">
                                <Accessibility className="w-4 h-4 text-gray-400" />
                                <span>ผู้พิการ {request.disabledCount || 1} คน</span>
                              </div>
                            )}
                            {request.specialNeeds?.pregnant && request.pregnantCount && (
                              <div className="flex items-center gap-2">
                                <Heart className="w-4 h-4 text-gray-400" />
                                <span>หญิงมีครรภ์ {request.pregnantCount} คน</span>
                              </div>
                            )}
                            {request.specialNeeds?.pets && (
                              <div className="flex items-center gap-2">
                                <PawPrint className="w-4 h-4 text-gray-400" />
                                <span>{request.petsType || `สัตว์เลี้ยง ${request.petsCount || 1} ตัว`}</span>
                              </div>
                            )}
                            {request.specialNeeds?.medical && (
                              <div className="flex items-center gap-2">
                                <Pill className="w-4 h-4 text-gray-400" />
                                <span>{request.medicalNeeds || 'ต้องการยา/อุปกรณ์ทางการแพทย์'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {request.notes && (
                        <div className="p-2.5 bg-yellow-50 border-l-2 border-yellow-400 rounded-r">
                          <div className="text-xs text-yellow-700 mb-0.5">หมายเหตุ</div>
                          <p className="text-sm text-yellow-800">{request.notes}</p>
                        </div>
                      )}

                      {request.volunteerNotes && (
                        <div className="p-2.5 bg-green-50 border-l-2 border-green-400 rounded-r">
                          <div className="text-xs text-green-700 mb-0.5">ความคืบหน้า</div>
                          <p className="text-sm text-green-800">{request.volunteerNotes}</p>
                        </div>
                      )}

                      {/* Rating Button */}
                      {request.status === 'completed' && (
                        <button
                          onClick={() => setShowRating(request.id)}
                          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors text-sm w-full"
                        >
                          <Star className="w-4 h-4" />
                          <span>ให้คะแนนความพึงพอใจ</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Compact Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className={`flex items-center gap-1.5 text-xs ${statusBadge.text_color}`}>
                      {statusBadge.icon}
                      <span>{statusBadge.text}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(request.createdAt).toLocaleString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </>
      )}

      {/* Rating Modal */}
      {showRating && (
        <RatingSystem
          requestId={showRating}
          onClose={() => setShowRating(null)}
        />
      )}
    </div>
  );
}