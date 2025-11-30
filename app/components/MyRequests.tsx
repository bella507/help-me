import { useState } from 'react';
import {
  AlertOctagon,
  MapPin,
  Clock,
  Package,
  Phone,
  Share2,
  Trash2,
} from 'lucide-react';
import type { HelpRequest } from '@/app/types';

const CATEGORY_NAMES: Record<string, string> = {
  food: 'อาหารและน้ำดื่ม',
  'food-water': 'อาหาร-น้ำดื่ม',
  shelter: 'ที่พักพิง',
  medical: 'การแพทย์',
  clothing: 'เสื้อผ้า',
  evacuation: 'การอพยพ',
  transportation: 'ยานพาหนะ',
  rescue: 'ช่วยเหลือฉุกเฉิน',
  other: 'อื่นๆ',
};

const formatText = (
  template: string,
  values: Record<string, string | number>
) => template.replace(/\{(\w+)\}/g, (_, key) => values[key]?.toString() ?? '');

export function MyRequests() {
  const initialPhone =
    typeof window !== 'undefined' ? localStorage.getItem('userPhone') || '' : '';
  const getRequestsByPhone = (phone: string) => {
    if (!phone || typeof window === 'undefined') return [];
    const stored = localStorage.getItem('helpRequests');
    if (!stored) return [];
    const allRequests = JSON.parse(stored) as HelpRequest[];
    return allRequests.filter(req => req.phone === phone);
  };

  const [requests, setRequests] = useState<HelpRequest[]>(() =>
    initialPhone ? getRequestsByPhone(initialPhone) : []
  );
  const [userPhone, setUserPhone] = useState(initialPhone);
  const [showPhoneInput, setShowPhoneInput] = useState(!initialPhone);

  const getCategoryLabel = (category: string) =>
    CATEGORY_NAMES[category] || category;

  const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));

  const loadRequests = (phone: string) => {
    setRequests(getRequestsByPhone(phone));
  };

  const handlePhoneSubmit = () => {
    if (userPhone.length >= 9) {
      localStorage.setItem('userPhone', userPhone);
      loadRequests(userPhone);
      setShowPhoneInput(false);
    }
  };

  const handleShare = (request: HelpRequest) => {
    const category = getCategoryLabel(request.category);
    const text = formatText(
      'ขอความช่วยเหลือ: {category}\nสถานที่: {location}\nติดต่อ: {phone}',
      {
        category,
        location: request.location,
        phone: request.phone,
      }
    );
    const title = 'คำขอความช่วยเหลือ';

    if (navigator.share) {
      navigator.share({
        title,
        text,
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('คัดลอกข้อมูลแล้ว');
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('ต้องการยกเลิกคำขอนี้หรือไม่?')) {
      const stored = localStorage.getItem('helpRequests');
      if (stored) {
        const allRequests = JSON.parse(stored);
        const updated = allRequests.filter((req: HelpRequest) => req.id !== id);
        localStorage.setItem('helpRequests', JSON.stringify(updated));
        loadRequests(userPhone);
      }
    }
  };

  const getStatusBadge = (status: HelpRequest['status']) => {
    if (status === 'completed') {
      return (
        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs bg-green-100 text-green-700">
          เสร็จสิ้น
        </span>
      );
    } else if (status === 'in-progress') {
      return (
        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs bg-blue-100 text-blue-700">
          กำลังดำเนินการ
        </span>
      );
    }
    return (
      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs bg-orange-100 text-orange-700">
        รอดำเนินการ
      </span>
    );
  };

  const getUrgencyBadge = (urgency: HelpRequest['urgency']) => {
    if (urgency === 'high') {
      return (
        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs bg-red-100 text-red-700">
          เร่งด่วน
        </span>
      );
    } else if (urgency === 'medium') {
      return (
        <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs bg-orange-100 text-orange-700">
          ปานกลาง
        </span>
      );
    }
    return (
      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs bg-green-100 text-green-700">
        ไม่เร่งด่วน
      </span>
    );
  };

  if (showPhoneInput) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg">
              <AlertOctagon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-gray-900">คำขอของฉัน</h2>
              <p className="text-xs sm:text-sm text-gray-500">
                ตรวจสอบคำขอความช่วยเหลือของคุณ
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200 text-center">
            <p className="text-sm sm:text-base text-gray-700 mb-4">
              กรุณากรอกเบอร์โทรศัพท์เพื่อดูคำขอของคุณ
            </p>
            <input
              type="tel"
              value={userPhone}
              onChange={e => setUserPhone(e.target.value)}
              placeholder="0XX-XXX-XXXX"
              className="w-full max-w-xs mx-auto px-4 py-2.5 sm:py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-center mb-3"
            />
            <button
              onClick={handlePhoneSubmit}
              className="w-full max-w-xs px-6 py-2.5 sm:py-3 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors text-sm sm:text-base"
            >
              ดูคำขอของฉัน
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg">
                <AlertOctagon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-gray-900">คำขอของฉัน</h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  {formatText('{count} คำขอทั้งหมด', { count: requests.length })}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('userPhone');
                setUserPhone('');
                setShowPhoneInput(true);
                setRequests([]);
              }}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              เปลี่ยนเบอร์
            </button>
          </div>
        </div>

      {requests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
          <AlertOctagon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
          <p className="text-sm sm:text-base text-gray-500">
            ยังไม่มีคำขอความช่วยเหลือ
          </p>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            คำขอที่คุณส่งจะแสดงที่นี่
          </p>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {requests.map(request => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-2 sm:gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  <h3 className="text-sm sm:text-base text-gray-900">
                    {getCategoryLabel(request.category)}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {getStatusBadge(request.status)}
                  {getUrgencyBadge(request.urgency)}
                </div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                  <span>{request.location}</span>
                </div>
                {request.address && (
                  <div className="pl-5 sm:pl-6 text-[10px] sm:text-xs text-gray-500">
                    {request.address}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{formatDate(request.createdAt)}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`tel:${request.phone}`}
                  className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors text-xs sm:text-sm"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>โทร</span>
                </a>
                <button
                  onClick={() => handleShare(request)}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 text-gray-700 transition-colors text-xs sm:text-sm"
                >
                  <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>แชร์</span>
                </button>
                <button
                  onClick={() => handleDelete(request.id)}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 text-red-600 transition-colors text-xs sm:text-sm"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
