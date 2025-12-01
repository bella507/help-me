'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { LatLngBounds, Map as LeafletMap } from 'leaflet';
import dynamic from 'next/dynamic';
import { MapPin, AlertCircle, Phone, Navigation, Package } from 'lucide-react';
import type { HelpRequest } from '@/app/types';
import { CATEGORY_LABELS, REQUEST_STATUS } from '@/app/lib/constants';
import {
  cn,
  formatDate,
  getStatusBadge,
  getUrgencyBadge,
  requestStorage,
} from '@/app/lib/utils';
import { initializeMockData } from '../data/mockData';
import Link from 'next/link';

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
  () => import('react-leaflet-cluster').then(mod => mod.default),
  {
    ssr: false,
  }
);

type StatusFilter = 'all' | HelpRequest['status'];
type UrgencyFilter = 'all' | HelpRequest['urgency'];

export function RealMapOverview() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [leafletLib, setLeafletLib] = useState<typeof import('leaflet') | null>(
    null
  );
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [filterUrgency, setFilterUrgency] = useState<UrgencyFilter>('all');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load Leaflet on client only to avoid SSR "window is not defined"
    void import('leaflet').then(mod => setLeafletLib(mod));
    setIsMounted(true);
  }, []);

  useEffect(() => {
    initializeMockData();

    const sync = () => {
      const data = requestStorage.getAll();
      setRequests(prev => {
        if (prev.length === data.length) {
          const same = prev.every(
            (item, idx) =>
              item.id === data[idx].id &&
              item.status === data[idx].status &&
              item.urgency === data[idx].urgency &&
              item.latitude === data[idx].latitude &&
              item.longitude === data[idx].longitude &&
              item.createdAt === data[idx].createdAt
          );
          if (same) return prev;
        }
        return data;
      });
    };

    const t = window.setTimeout(sync, 0);
    const interval = window.setInterval(sync, 3000);
    window.addEventListener('storage', sync);

    return () => {
      window.clearTimeout(t);
      window.clearInterval(interval);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const filteredRequests = useMemo(() => {
    const filtered = requests.filter(req => {
      const statusMatch = filterStatus === 'all' || req.status === filterStatus;
      const urgencyMatch =
        filterUrgency === 'all' || req.urgency === filterUrgency;
      const hasCoords = req.latitude != null && req.longitude != null;
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
          {isMounted && (
            <MapContainer
              center={center}
              zoom={11}
              ref={mapRef}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="map-grayscale"
              />

              <MarkerClusterGroup
                key={`${filteredRequests.length}-${filterStatus}-${filterUrgency}`}
                chunkedLoading
                showCoverageOnHover={false}
                spiderfyOnMaxZoom={true}
                zoomToBoundsOnClick
                maxClusterRadius={60}
                onClick={cluster => {
                  if (!leafletLib || !mapRef.current) return;

                  const leafletCluster = cluster?.layer;
                  const markers =
                    (leafletCluster?.getAllChildMarkers?.() as {
                      getLatLng: () => { lat: number; lng: number };
                    }[]) || [];
                  if (!markers.length) return;

                  const { latLngBounds } = leafletLib;
                  const map = mapRef.current;
                  const latLngs = markers.map(m => m.getLatLng());
                  const initialBounds = map.getBounds();
                  const baseBounds: LatLngBounds = initialBounds
                    ? initialBounds.pad(-1)
                    : latLngBounds(latLngs[0], latLngs[0]);
                  const bounds = latLngs.reduce(
                    (b, latLng) => b.extend(latLng),
                    baseBounds
                  );

                  if (bounds) {
                    map.fitBounds(bounds, { padding: [40, 40] });
                    // Keep current zoom if bounds didn't expand (cluster at same point)
                    if (initialBounds && initialBounds.equals(bounds)) {
                      map.setView(latLngs[0], Math.max(14, map.getZoom()));
                    }
                  }
                }}
              >
                {filteredRequests.map(request => (
                  <MapMarker key={request.id} request={request} />
                ))}
              </MarkerClusterGroup>
            </MapContainer>
          )}
        </div>
      </div>

      {filteredRequests.length === 0 && <EmptyState />}

      <InfoNotice />
    </div>
  );
}

function MapMarker({ request }: { request: HelpRequest }) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

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
        <div className="min-w-[260px] space-y-2 p-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {request.name}
              </div>
              <div className="text-xs text-gray-500">
                {formatDate(request.createdAt)}
              </div>
            </div>
            <div className="flex gap-1">
              <BadgePill
                text={urgency.text}
                className={cn(
                  urgency.bgClass,
                  urgency.textClass,
                  urgency.borderClass
                )}
              />
              <BadgePill
                text={status.text}
                className={cn(
                  status.bgClass,
                  status.textClass,
                  status.borderClass
                )}
              />
            </div>
          </div>

          <div className="space-y-1 rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs text-gray-700">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="line-clamp-2">{request.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="h-3.5 w-3.5 shrink-0 text-gray-500" />
              <span>
                {CATEGORY_LABELS[request.category] || request.category}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 shrink-0 text-gray-500" />
              <a
                href={`tel:${request.phone}`}
                className="text-primary hover:underline"
              >
                {request.phone}
              </a>
            </div>
          </div>

          {request.description && (
            <p className="line-clamp-2 text-xs text-gray-600">
              {request.description}
            </p>
          )}
          <Link
            href={`https://www.google.com/maps/search/?api=1&query=${request.latitude},${request.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center  justify-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium text-white! transition-colors hover:bg-[#e14a21]"
          >
            <Navigation className="h-4 w-4" />
            <span>ดูใน Google Maps</span>
          </Link>
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
