import { useState, useEffect } from 'react';
import { MapPin, AlertCircle, Clock, Users, Phone, Navigation, Package } from 'lucide-react';

interface HelpRequest {
  id: string;
  name: string;
  phone: string;
  location: string;
  address: string;
  category: string;
  urgency: string;
  status: string;
  createdAt: string;
  coordinates?: {
    x: number;
    y: number;
  };
}

// Mock coordinates for different areas in Bangkok
const locationCoordinates: Record<string, { x: number; y: number }> = {
  'บางกอกใหญ่': { x: 35, y: 55 },
  'บางกอกน้อย': { x: 30, y: 45 },
  'พระนคร': { x: 50, y: 40 },
  'คลองสาน': { x: 25, y: 60 },
  'ภาษีเจริญ': { x: 20, y: 70 },
  'บางซื่อ': { x: 45, y: 25 },
  'ดอนเมือง': { x: 50, y: 15 },
  'บางเขน': { x: 60, y: 20 },
  'หนองจอก': { x: 80, y: 35 },
  'มีนบุรี': { x: 85, y: 45 },
  'ลาดกระบัง': { x: 75, y: 65 },
  'บางนา': { x: 65, y: 70 },
  'วัฒนา': { x: 60, y: 55 },
  'ปทุมวัน': { x: 55, y: 50 },
  'ดุสิต': { x: 45, y: 35 },
  'ราชเทวี': { x: 50, y: 48 },
  'บางรัก': { x: 55, y: 58 },
  'สาทร': { x: 52, y: 62 },
  'default': { x: 50, y: 50 }
};

const categoryLabels: Record<string, string> = {
  food: 'อาหาร/น้ำ',
  shelter: 'ที่พักพิง',
  medical: 'พยาบาล',
  clothing: 'เสื้อผ้า',
  evacuation: 'อพยพ',
  other: 'อื่นๆ'
};

export function MapOverview() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    const loadRequests = () => {
      const stored = localStorage.getItem('helpRequests');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Add coordinates to each request
        const withCoordinates = parsed.map((req: HelpRequest) => {
          // Try to match location with coordinates
          const locationKey = Object.keys(locationCoordinates).find(key => 
            req.location.includes(key)
          );
          const coords = locationKey 
            ? locationCoordinates[locationKey]
            : locationCoordinates.default;
          
          // Add some random offset for requests in same area
          const randomOffset = { 
            x: coords.x + (Math.random() * 10 - 5), 
            y: coords.y + (Math.random() * 10 - 5) 
          };
          
          return {
            ...req,
            coordinates: randomOffset
          };
        });
        setRequests(withCoordinates);
      }
    };

    loadRequests();
    const interval = setInterval(loadRequests, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredRequests = requests.filter(req => {
    if (filterStatus !== 'all' && req.status !== filterStatus) return false;
    if (filterUrgency !== 'all' && req.urgency !== filterUrgency) return false;
    return true;
  });

  const getMarkerColor = (urgency: string) => {
    if (urgency === 'high') return 'bg-red-500 border-red-600';
    if (urgency === 'medium') return 'bg-orange-500 border-orange-600';
    return 'bg-green-500 border-green-600';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-green-100 text-green-700">สำเร็จ</span>;
    } else if (status === 'processing') {
      return <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-blue-100 text-blue-700">กำลังดำเนินการ</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-orange-100 text-orange-700">รอดำเนินการ</span>;
  };

  const getUrgencyBadge = (urgency: string) => {
    if (urgency === 'high') {
      return <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-red-100 text-red-700">เร่งด่วน</span>;
    } else if (urgency === 'medium') {
      return <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-orange-100 text-orange-700">ปานกลาง</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs bg-green-100 text-green-700">ไม่เร่งด่วน</span>;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    return `${diffDays} วันที่แล้ว`;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Stats */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg">
            <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">แผนที่ภาพรวม</h2>
            <p className="text-xs sm:text-sm text-gray-500">คำขอความช่วยเหลือทั้งหมด</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl text-orange-700">{requests.filter(r => r.status === 'pending').length}</div>
            <div className="text-[10px] sm:text-xs text-orange-600">รอดำเนินการ</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl text-blue-700">{requests.filter(r => r.status === 'processing').length}</div>
            <div className="text-[10px] sm:text-xs text-blue-600">กำลังดำเนินการ</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 text-center">
            <div className="text-lg sm:text-2xl text-green-700">{requests.filter(r => r.status === 'completed').length}</div>
            <div className="text-[10px] sm:text-xs text-green-600">สำเร็จ</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
          <div>
            <div className="text-[10px] sm:text-xs text-gray-600 mb-2">กรองตามสถานะ</div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
                  filterStatus === 'all'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
                  filterStatus === 'pending'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                รอดำเนินการ
              </button>
              <button
                onClick={() => setFilterStatus('processing')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
                  filterStatus === 'processing'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                กำลังดำเนินการ
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
                  filterStatus === 'completed'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                สำเร็จ
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] sm:text-xs text-gray-600 mb-2">กรองตามความเร่งด่วน</div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterUrgency('all')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
                  filterUrgency === 'all'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterUrgency('high')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
                  filterUrgency === 'high'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                เร่งด่วน
              </button>
              <button
                onClick={() => setFilterUrgency('medium')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
                  filterUrgency === 'medium'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                ปานกลาง
              </button>
              <button
                onClick={() => setFilterUrgency('low')}
                className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
                  filterUrgency === 'low'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                ไม่เร่งด่วน
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-6">
        <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
          {/* Map Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200">
            {/* Grid pattern */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Area Labels */}
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-[10px] sm:text-xs text-gray-500">กรุงเทพมหานคร</div>
          <div className="absolute top-[15%] left-[45%] text-[8px] sm:text-[10px] text-gray-400">พระนคร</div>
          <div className="absolute top-[35%] left-[30%] text-[8px] sm:text-[10px] text-gray-400">บางกอกน้อย</div>
          <div className="absolute top-[50%] left-[60%] text-[8px] sm:text-[10px] text-gray-400">วัฒนา</div>
          <div className="absolute top-[65%] left-[25%] text-[8px] sm:text-[10px] text-gray-400">คลองสาน</div>

          {/* Markers */}
          {filteredRequests.map((request) => {
            if (!request.coordinates) return null;
            
            return (
              <button
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 ${
                  selectedRequest?.id === request.id ? 'scale-125 z-20' : 'z-10'
                }`}
                style={{
                  left: `${request.coordinates.x}%`,
                  top: `${request.coordinates.y}%`
                }}
              >
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${getMarkerColor(request.urgency)} shadow-lg flex items-center justify-center`}>
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-white fill-white" />
                </div>
                {selectedRequest?.id === request.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 whitespace-nowrap hidden sm:block">
                    <div className="bg-white px-2 py-1 rounded shadow-lg border border-gray-200 text-[10px] sm:text-xs">
                      {request.location}
                    </div>
                  </div>
                )}
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/95 backdrop-blur rounded-lg p-2 sm:p-3 border border-gray-200 shadow-lg">
            <div className="text-[10px] sm:text-xs text-gray-600 mb-1 sm:mb-2">ความเร่งด่วน</div>
            <div className="space-y-1 sm:space-y-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 border border-red-600"></div>
                <span className="text-[10px] sm:text-xs text-gray-700">เร่งด่วน</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500 border border-orange-600"></div>
                <span className="text-[10px] sm:text-xs text-gray-700">ปานกลาง</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 border border-green-600"></div>
                <span className="text-[10px] sm:text-xs text-gray-700">ไม่เร่งด่วน</span>
              </div>
            </div>
          </div>

          {/* Count */}
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/95 backdrop-blur rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 shadow-lg">
            <div className="text-[10px] sm:text-xs text-gray-600">จำนวนคำขอ</div>
            <div className="text-base sm:text-xl text-primary">{filteredRequests.length}</div>
          </div>
        </div>
      </div>

      {/* Selected Request Details */}
      {selectedRequest && (
        <div className="bg-white border border-primary rounded-lg p-4 sm:p-5 shadow-sm">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h3 className="text-sm sm:text-base text-gray-900">รายละเอียดคำขอ</h3>
            </div>
            <button
              onClick={() => setSelectedRequest(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="text-lg sm:text-xl">×</span>
            </button>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                <span className="text-xs sm:text-sm text-gray-900">{selectedRequest.name}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {getStatusBadge(selectedRequest.status)}
                {getUrgencyBadge(selectedRequest.urgency)}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3 border border-gray-200">
              <div className="text-[10px] sm:text-xs text-gray-600 mb-1">ที่อยู่</div>
              <div className="text-xs sm:text-sm text-gray-900">{selectedRequest.location}</div>
              {selectedRequest.address && (
                <div className="text-[10px] sm:text-xs text-gray-600 mt-1">{selectedRequest.address}</div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{categoryLabels[selectedRequest.category] || selectedRequest.category}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-[10px] sm:text-xs">{formatDate(selectedRequest.createdAt)}</span>
              </div>
            </div>

            <div className="pt-2 sm:pt-3 border-t border-gray-200">
              <a
                href={`tel:${selectedRequest.phone}`}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 sm:py-2.5 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors text-xs sm:text-sm"
              >
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>โทร {selectedRequest.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-gray-500">ไม่พบคำขอความช่วยเหลือ</p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">ลองเปลี่ยนตัวกรองด้านบน</p>
        </div>
      )}

      {/* Info Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-gray-700">
            <p className="text-gray-900 mb-1">วิธีใช้งาน</p>
            <p className="text-[10px] sm:text-xs text-gray-600">
              คลิกที่จุดบนแผนที่เพื่อดูรายละเอียด • ใช้ตัวกรองด้านบนเพื่อค้นหาคำขอ • สีของจุดแสดงระดับความเร่งด่วน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}