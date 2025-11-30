import { useEffect, useMemo, useState } from 'react';
import {
  MapPin,
  AlertCircle,
  Clock,
  Users,
  Phone,
  Navigation,
  Package,
} from 'lucide-react';
import type { HelpRequest } from '@/app/types';
import { CATEGORY_LABELS, REQUEST_STATUS } from '@/app/lib/constants';
import {
  cn,
  formatDate,
  getStatusBadge,
  getUrgencyBadge,
  requestStorage,
} from '@/app/lib/utils';

type RequestWithCoord = HelpRequest & {
  coordinates?: { x: number; y: number };
  address?: string;
};
type StatusFilter = 'all' | HelpRequest['status'];
type UrgencyFilter = 'all' | HelpRequest['urgency'];

const COORDINATES: Record<string, { x: number; y: number }> = {
  บางกอกใหญ่: { x: 35, y: 55 },
  บางกอกน้อย: { x: 30, y: 45 },
  พระนคร: { x: 50, y: 40 },
  คลองสาน: { x: 25, y: 60 },
  ภาษีเจริญ: { x: 20, y: 70 },
  บางซื่อ: { x: 45, y: 25 },
  ดอนเมือง: { x: 50, y: 15 },
  บางเขน: { x: 60, y: 20 },
  หนองจอก: { x: 80, y: 35 },
  มีนบุรี: { x: 85, y: 45 },
  ลาดกระบัง: { x: 75, y: 65 },
  บางนา: { x: 65, y: 70 },
  วัฒนา: { x: 60, y: 55 },
  ปทุมวัน: { x: 55, y: 50 },
  ดุสิต: { x: 45, y: 35 },
  ราชเทวี: { x: 50, y: 48 },
  บางรัก: { x: 55, y: 58 },
  สาทร: { x: 52, y: 62 },
  default: { x: 50, y: 50 },
};

export function MapOverview() {
  const [requests, setRequests] = useState<RequestWithCoord[]>([]);
  const [selectedRequest, setSelectedRequest] =
    useState<RequestWithCoord | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterUrgency, setFilterUrgency] = useState<UrgencyFilter>('all');

  useEffect(() => {
    const sync = () => {
      const data = requestStorage.getAll();
      const withCoords = data.map(req => {
        // ถ้ามี latitude/longitude ใช้พิกัดจริง
        if (req.latitude && req.longitude) {
          // แปลง lat/lng เป็น x,y บนแผนที่
          // พื้นที่กรุงเทพและปริมณฑล: lat 13.7-14.0, lng 100.3-100.7
          const lat = req.latitude;
          const lng = req.longitude;

          // แปลง latitude (13.7-14.0) เป็น y (0-100)
          // ใช้ค่ากลับเพราะ latitude สูง = y ต่ำบนแผนที่
          const y = ((14.0 - lat) / 0.3) * 100;

          // แปลง longitude (100.3-100.7) เป็น x (0-100)
          const x = ((lng - 100.3) / 0.4) * 100;

          return {
            ...req,
            coordinates: {
              x: Math.max(0, Math.min(100, x)),
              y: Math.max(0, Math.min(100, y)),
            },
          };
        }

        // ถ้าไม่มีพิกัด ใช้วิธีเดิม
        const key = Object.keys(COORDINATES).find(k =>
          req.location.includes(k)
        );
        const base = key ? COORDINATES[key] : COORDINATES.default;
        return {
          ...req,
          coordinates: {
            x: base.x + (Math.random() * 10 - 5),
            y: base.y + (Math.random() * 10 - 5),
          },
        };
      });
      setRequests(withCoords);
    };
    const t = window.setTimeout(sync, 0);
    const interval = window.setInterval(sync, 3000);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(interval);
    };
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const statusMatch = filterStatus === 'all' || req.status === filterStatus;
      const urgencyMatch =
        filterUrgency === 'all' || req.urgency === filterUrgency;
      return statusMatch && urgencyMatch;
    });
  }, [requests, filterStatus, filterUrgency]);

  const stats = useMemo(
    () => ({
      pending: requests.filter(r => r.status === REQUEST_STATUS.PENDING).length,
      inProgress: requests.filter(r => r.status === REQUEST_STATUS.IN_PROGRESS)
        .length,
      completed: requests.filter(r => r.status === REQUEST_STATUS.COMPLETED)
        .length,
    }),
    [requests]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <Header
        stats={stats}
        filterStatus={filterStatus}
        filterUrgency={filterUrgency}
        onFilterStatus={setFilterStatus}
        onFilterUrgency={setFilterUrgency}
      />

      <MapCanvas
        requests={filteredRequests}
        selectedRequest={selectedRequest}
        onSelect={setSelectedRequest}
      />

      {selectedRequest && (
        <RequestDetails
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      {filteredRequests.length === 0 && <EmptyState />}

      <InfoNotice />
    </div>
  );
}

function Header({
  stats,
  filterStatus,
  filterUrgency,
  onFilterStatus,
  onFilterUrgency,
}: {
  stats: { pending: number; inProgress: number; completed: number };
  filterStatus: StatusFilter;
  filterUrgency: UrgencyFilter;
  onFilterStatus: (v: StatusFilter) => void;
  onFilterUrgency: (v: UrgencyFilter) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
        <div className="rounded-lg bg-primary/10 p-2 sm:p-2.5">
          <Navigation className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
        </div>
        <div>
          <h2 className="text-gray-900">แผนที่ภาพรวม</h2>
          <p className="text-xs text-gray-500 sm:text-sm">
            คำขอความช่วยเหลือทั้งหมด
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard label="รอดำเนินการ" value={stats.pending} tone="orange" />
        <StatCard label="กำลังดำเนินการ" value={stats.inProgress} tone="blue" />
        <StatCard label="สำเร็จ" value={stats.completed} tone="green" />
      </div>

      <div className="mt-3 space-y-2 sm:mt-4 sm:space-y-3">
        <FilterGroup
          label="กรองตามสถานะ"
          options={[
            { value: 'all', label: 'ทั้งหมด' },
            { value: REQUEST_STATUS.PENDING, label: 'รอดำเนินการ' },
            { value: REQUEST_STATUS.IN_PROGRESS, label: 'กำลังดำเนินการ' },
            { value: REQUEST_STATUS.COMPLETED, label: 'สำเร็จ' },
          ]}
          active={filterStatus}
          onChange={v => onFilterStatus(v as StatusFilter)}
        />
        <FilterGroup
          label="กรองตามความเร่งด่วน"
          options={[
            { value: 'all', label: 'ทั้งหมด' },
            { value: 'high', label: 'เร่งด่วน' },
            { value: 'medium', label: 'ปานกลาง' },
            { value: 'low', label: 'ไม่เร่งด่วน' },
          ]}
          active={filterUrgency}
          onChange={v => onFilterUrgency(v as UrgencyFilter)}
        />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'orange' | 'blue' | 'green';
}) {
  const toneStyles = {
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
  }[tone];
  return (
    <div className={cn('rounded-lg border p-2 text-center sm:p-3', toneStyles)}>
      <div className="text-lg sm:text-2xl">{value}</div>
      <div className="text-[10px] text-current sm:text-xs">{label}</div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  active: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[10px] text-gray-600 sm:text-xs">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded border-2 px-2.5 py-1.5 text-[10px] transition-all sm:px-3 sm:text-xs',
              active === option.value
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function MapCanvas({
  requests,
  selectedRequest,
  onSelect,
}: {
  requests: RequestWithCoord[];
  selectedRequest: RequestWithCoord | null;
  onSelect: (req: RequestWithCoord | null) => void;
}) {
  const markerColor = (urgency: HelpRequest['urgency']) => {
    if (urgency === 'high') return 'bg-red-500 border-red-600';
    if (urgency === 'medium') return 'bg-orange-500 border-orange-600';
    return 'bg-green-500 border-green-600';
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-6">
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 sm:h-[400px] lg:h-[500px]">
        <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(rgba(156, 163, 175, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156, 163, 175, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
        </div>

        <div className="absolute left-2 top-2 text-[10px] text-gray-500 sm:left-4 sm:top-4 sm:text-xs">
          กรุงเทพมหานคร
        </div>

        {requests.map(request => {
          if (!request.coordinates) return null;
          return (
            <button
              key={request.id}
              onClick={() => onSelect(request)}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 transform transition-all hover:scale-125',
                selectedRequest?.id === request.id ? 'z-20 scale-125' : 'z-10'
              )}
              style={{
                left: `${request.coordinates.x}%`,
                top: `${request.coordinates.y}%`,
              }}
            >
              <div
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border-2 shadow-lg sm:h-6 sm:w-6',
                  markerColor(request.urgency)
                )}
              >
                <MapPin className="h-3 w-3 text-white sm:h-4 sm:w-4" />
              </div>
              {selectedRequest?.id === request.id && (
                <div className="absolute left-1/2 top-full hidden -translate-x-1/2 transform whitespace-nowrap sm:block">
                  <div className="mt-1 rounded border border-gray-200 bg-white px-2 py-1 text-[10px] text-gray-700 shadow-lg sm:text-xs">
                    {request.location}
                  </div>
                </div>
              )}
            </button>
          );
        })}

        <Legend count={requests.length} />
      </div>
    </div>
  );
}

function Legend({ count }: { count: number }) {
  return (
    <>
      <div className="absolute bottom-2 left-2 rounded-lg border border-gray-200 bg-white/95 p-2 shadow-lg backdrop-blur sm:bottom-4 sm:left-4 sm:p-3">
        <div className="mb-1 text-[10px] text-gray-600 sm:mb-2 sm:text-xs">
          ความเร่งด่วน
        </div>
        <div className="space-y-1 sm:space-y-1.5">
          {[
            { color: 'bg-red-500 border-red-600', label: 'เร่งด่วน' },
            { color: 'bg-orange-500 border-orange-600', label: 'ปานกลาง' },
            { color: 'bg-green-500 border-green-600', label: 'ไม่เร่งด่วน' },
          ].map(item => (
            <div
              key={item.label}
              className="flex items-center gap-1.5 sm:gap-2"
            >
              <div
                className={cn(
                  'h-2 w-2 rounded-full border sm:h-3 sm:w-3',
                  item.color
                )}
              />
              <span className="text-[10px] text-gray-700 sm:text-xs">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-2 top-2 rounded-lg border border-gray-200 bg-white/95 px-2 py-1.5 text-right shadow-lg backdrop-blur sm:right-4 sm:top-4 sm:px-3 sm:py-2">
        <div className="text-[10px] text-gray-600 sm:text-xs">จำนวนคำขอ</div>
        <div className="text-base text-primary sm:text-xl">{count}</div>
      </div>
    </>
  );
}

function RequestDetails({
  request,
  onClose,
}: {
  request: RequestWithCoord;
  onClose: () => void;
}) {
  const status = getStatusBadge(request.status);
  const urgency = getUrgencyBadge(request.urgency);

  return (
    <div className="rounded-lg border border-primary bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-start justify-between sm:mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
          <h3 className="text-sm text-gray-900 sm:text-base">รายละเอียดคำขอ</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 transition-colors hover:text-gray-600"
        >
          <span className="text-lg sm:text-xl">×</span>
        </button>
      </div>

      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-gray-600 sm:h-4 sm:w-4" />
            <span className="text-xs text-gray-900 sm:text-sm">
              {request.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <BadgePill
              text={status.text}
              className={cn(
                status.bgClass,
                status.textClass,
                status.borderClass
              )}
            />
            <BadgePill
              text={urgency.text}
              className={cn(
                urgency.bgClass,
                urgency.textClass,
                urgency.borderClass
              )}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3">
          <div className="mb-1 text-[10px] text-gray-600 sm:text-xs">
            ที่อยู่
          </div>
          <div className="text-xs text-gray-900 sm:text-sm">
            {request.location}
          </div>
          {request.address && (
            <div className="mt-1 text-[10px] text-gray-600 sm:text-xs">
              {request.address}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 sm:gap-2">
            <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>{CATEGORY_LABELS[request.category] || request.category}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 sm:gap-2">
            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-[10px] sm:text-xs">
              {formatDate(request.createdAt)}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-2 sm:pt-3">
          <a
            href={`tel:${request.phone}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs text-white transition-colors hover:bg-[#e14a21] sm:py-2.5 sm:text-sm"
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span>โทร {request.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function BadgePill({ text, className }: { text: string; className: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] sm:text-xs',
        className
      )}
    >
      {text}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-8 text-center sm:p-12">
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-gray-300 sm:h-12 sm:w-12" />
      <p className="text-sm text-gray-500 sm:text-base">
        ไม่พบคำขอความช่วยเหลือ
      </p>
      <p className="mt-1 text-xs text-gray-400 sm:text-sm">
        ลองเปลี่ยนตัวกรองด้านบน
      </p>
    </div>
  );
}

function InfoNotice() {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
      <div className="flex gap-2 sm:gap-3">
        <AlertCircle className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
        <div className="text-xs text-gray-700 sm:text-sm">
          <p className="mb-1 text-gray-900">วิธีใช้งาน</p>
          <p className="text-[10px] text-gray-600 sm:text-xs">
            คลิกที่จุดบนแผนที่เพื่อดูรายละเอียด • ใช้ตัวกรองด้านบนเพื่อค้นหาคำขอ
            • สีของจุดแสดงระดับความเร่งด่วน
          </p>
        </div>
      </div>
    </div>
  );
}
