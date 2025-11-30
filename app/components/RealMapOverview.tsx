'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
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

// Import Map dynamically to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false,
});
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
});
const MarkerClusterGroup = dynamic(
  () => import('react-leaflet-cluster'),
  { ssr: false }
);

type StatusFilter = 'all' | HelpRequest['status'];
type UrgencyFilter = 'all' | HelpRequest['urgency'];

export function RealMapOverview() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(
    null
  );
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterUrgency, setFilterUrgency] = useState<UrgencyFilter>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sync = () => {
      const data = requestStorage.getAll();

      setRequests(data);
    };
    const t = window.setTimeout(sync, 0);
    const interval = window.setInterval(sync, 3000);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(interval);
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const filtered = requests.filter(req => {
      const statusMatch = filterStatus === 'all' || req.status === filterStatus;
      const urgencyMatch =
        filterUrgency === 'all' || req.urgency === filterUrgency;
      const hasCoords = req.latitude && req.longitude;
      return statusMatch && urgencyMatch && hasCoords;
    });

    return filtered;
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

  // Center of Bangkok
  const center: [number, number] = [13.7563, 100.5018];

  return (
    <div className="space-y-4 sm:space-y-6">
      <Header
        stats={stats}
        filterStatus={filterStatus}
        filterUrgency={filterUrgency}
        onFilterStatus={setFilterStatus}
        onFilterUrgency={setFilterUrgency}
      />

      <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-6">
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg border-2 border-gray-200 sm:h-[500px] lg:h-[600px]">
          {isMounted && typeof window !== 'undefined' && (
            <MapContainer
              center={center}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-grayscale"
              />

              <MarkerClusterGroup
                chunkedLoading
                showCoverageOnHover={false}
                spiderfyOnMaxZoom={true}
                maxClusterRadius={60}
              >
                {filteredRequests.map(request => (
                  <MapMarker
                    key={request.id}
                    request={request}
                    onClick={() => setSelectedRequest(request)}
                  />
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}
          {!isMounted && (
            <div className="flex h-full items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary mx-auto" />
                <p className="text-sm text-gray-500">กำลังโหลดแผนที่...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {filteredRequests.length === 0 && <EmptyState />}

      {/* Modal for Request Details */}
      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}

      <InfoNotice />
    </div>
  );
}

function MapMarker({
  request,
  onClick,
}: {
  request: HelpRequest;
  onClick: () => void;
}) {
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then(leaflet => {
      setL(leaflet.default);
    });
  }, []);

  if (!L || !request.latitude || !request.longitude) return null;

  // Create custom icon based on urgency
  const getIconColor = (urgency: HelpRequest['urgency']) => {
    if (urgency === 'high') return 'red';
    if (urgency === 'medium') return 'orange';
    return 'green';
  };

  const iconColor = getIconColor(request.urgency);

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${iconColor};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      ">
        <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

  const urgency = getUrgencyBadge(request.urgency);
  const status = getStatusBadge(request.status);

  return (
    <Marker position={[request.latitude, request.longitude]} icon={customIcon}>
      <Popup closeButton={false} className="custom-popup">
        <div className="min-w-[250px] p-2">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-semibold text-gray-900">{request.name}</div>
            <div className="flex gap-1">
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px]',
                  urgency.bgClass,
                  urgency.textClass
                )}
              >
                {urgency.text}
              </span>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-[10px]',
                  status.bgClass,
                  status.textClass
                )}
              >
                {status.text}
              </span>
            </div>
          </div>
          <div className="mb-2 text-xs text-gray-600">{request.location}</div>
          <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-700">
            <Package className="h-3 w-3" />
            <span>{CATEGORY_LABELS[request.category] || request.category}</span>
          </div>
          <div className="text-xs text-gray-500 mb-2">
            {formatDate(request.createdAt)}
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              onClick();
            }}
            className="mt-2 w-full rounded bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-[#e14a21] transition-colors"
          >
            ดูรายละเอียด
          </button>
        </div>
      </Popup>
    </Marker>
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

function RequestDetailsModal({
  request,
  onClose,
}: {
  request: HelpRequest;
  onClose: () => void;
}) {
  const status = getStatusBadge(request.status);
  const urgency = getUrgencyBadge(request.urgency);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;

    // Prevent scrolling
    document.body.style.overflow = 'hidden';

    // Cleanup function
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm mb-0"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-xl sm:p-6">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
              <h3 className="text-base text-gray-900 sm:text-lg font-semibold">
                รายละเอียดคำขอ
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600 sm:h-5 sm:w-5" />
                <span className="text-sm text-gray-900 sm:text-base font-medium">
                  {request.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
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

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <div className="mb-2 text-xs text-gray-600 sm:text-sm font-medium">
                ที่อยู่
              </div>
              <div className="text-sm text-gray-900 sm:text-base mb-3">
                {request.location}
              </div>
              {request.latitude && request.longitude && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:text-[#e14a21] transition-colors sm:text-sm"
                >
                  <Navigation className="h-4 w-4" />
                  <span className="font-medium">ดูตำแหน่งใน Google Maps</span>
                  <span className="text-gray-400">
                    ({request.latitude.toFixed(4)},{' '}
                    {request.longitude.toFixed(4)})
                  </span>
                </a>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <div className="mb-2 text-xs text-gray-600 sm:text-sm font-medium">
                คำอธิบาย
              </div>
              <div className="text-sm text-gray-900 sm:text-base">
                {request.description}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm sm:text-base">
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>
                  {CATEGORY_LABELS[request.category] || request.category}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">
                  {formatDate(request.createdAt)}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <a
                href={`tel:${request.phone}`}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm text-white transition-colors hover:bg-[#e14a21] sm:text-base font-medium"
              >
                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>โทร {request.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
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
        ไม่พบคำขอความช่วยเหลือที่มีพิกัด
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
            คลิกที่หมุดบนแผนที่เพื่อดูรายละเอียด •
            ใช้ตัวกรองด้านบนเพื่อค้นหาคำขอ • สีของหมุดแสดงระดับความเร่งด่วน
            (แดง=เร่งด่วน, ส้ม=ปานกลาง, เขียว=ไม่เร่งด่วน)
          </p>
        </div>
      </div>
    </div>
  );
}
