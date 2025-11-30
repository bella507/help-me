import { useMemo, useState } from 'react';
import {
  MapPin,
  Phone,
  Users,
  Bed,
  Utensils,
  Heart,
  Accessibility,
  Dog,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/app/lib/utils';
import type { Shelter } from '@/app/types';
import { getShelterStatusBadge } from '@/app/lib/utils/badges';

type ShelterStatus = 'all' | Shelter['status'] | 'limited';

const mockShelters: Shelter[] = [
  {
    id: '1',
    name: 'ศูนย์พักพิงวัดประยุรวงศาวาส',
    location: 'เขตบางกอกใหญ่',
    address: '24 ถนนประยูรวงศ์ แขวงวัดท่าพระ',
    phone: '02-412-7777',
    contact: 'เจ้าหน้าที่ประสานงาน',
    capacity: 200,
    occupied: 145,
    status: 'available',
    facilities: [
      'พื้นที่นอน',
      'อาหาร-น้ำ',
      'ห้องน้ำ',
      'ที่จอดรถ',
      'รองรับผู้พิการ',
      'รองรับสัตว์เลี้ยง',
    ],
    hours: 'เปิด 24 ชั่วโมง',
  },
  {
    id: '2',
    name: 'โรงเรียนวัดราชบพิธ',
    location: 'เขตพระนคร',
    address: '2 ถนนหมอชิต แขวงบางซื่อ',
    phone: '02-278-5555',
    contact: 'เจ้าหน้าที่ประสานงาน',
    capacity: 150,
    occupied: 128,
    status: 'limited',
    facilities: ['พื้นที่นอน', 'อาหาร-น้ำ', 'ห้องน้ำ', 'รองรับผู้พิการ'],
    hours: 'เปิด 24 ชั่วโมง',
  },
  {
    id: '3',
    name: 'หอประชุมเขตบางกอกน้อย',
    location: 'เขตบางกอกน้อย',
    address: '333 ถนนอรุณอมรินทร์ แขวงบางขุนนนท์',
    phone: '02-424-3333',
    contact: 'เจ้าหน้าที่ประสานงาน',
    capacity: 100,
    occupied: 100,
    status: 'full',
    facilities: ['พื้นที่นอน', 'อาหาร-น้ำ', 'ห้องน้ำ'],
    hours: 'เปิด 24 ชั่วโมง',
  },
  {
    id: '4',
    name: 'ศูนย์กีฬาเขตคลองสาน',
    location: 'เขตคลองสาน',
    address: '456 ถนนสมเด็จพระเจ้าตากสิน แขวงคลองต้นไทร',
    phone: '02-437-8888',
    contact: 'เจ้าหน้าที่ประสานงาน',
    capacity: 250,
    occupied: 89,
    status: 'available',
    facilities: [
      'พื้นที่นอน',
      'อาหาร-น้ำ',
      'ห้องน้ำ',
      'ห้องอาบน้ำ',
      'ที่จอดรถ',
      'รองรับผู้พิการ',
      'รองรับสัตว์เลี้ยง',
      'ห้องพยาบาล',
    ],
    hours: 'เปิด 24 ชั่วโมง',
  },
  {
    id: '5',
    name: 'วัดปากน้ำภาษีเจริญ',
    location: 'เขตภาษีเจริญ',
    address: '789 ถนนภาษีเจริญ แขวงปากคลองภาษีเจริญ',
    phone: '02-455-2222',
    contact: 'เจ้าหน้าที่ประสานงาน',
    capacity: 120,
    occupied: 67,
    status: 'available',
    facilities: ['พื้นที่นอน', 'อาหาร-น้ำ', 'ห้องน้ำ', 'รองรับผู้สูงอายุ'],
    hours: 'เปิด 24 ชั่วโมง',
  },
];

const facilityIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  พื้นที่นอน: Bed,
  'อาหาร-น้ำ': Utensils,
  รองรับผู้พิการ: Accessibility,
  รองรับสัตว์เลี้ยง: Dog,
  รองรับผู้สูงอายุ: Heart,
};

export function SheltersList() {
  const [selectedStatus, setSelectedStatus] = useState<ShelterStatus>('all');

  const filteredShelters = useMemo(
    () =>
      selectedStatus === 'all'
        ? mockShelters
        : mockShelters.filter(s => s.status === selectedStatus),
    [selectedStatus]
  );

  const filterButton = (
    value: ShelterStatus,
    label: string,
    tone: 'primary' | 'green' | 'orange' | 'red'
  ) => {
    const toneClasses =
      tone === 'primary'
        ? 'border-primary bg-primary/5 text-primary'
        : tone === 'green'
        ? 'border-green-500 bg-green-50 text-green-700'
        : tone === 'orange'
        ? 'border-orange-500 bg-orange-50 text-orange-700'
        : 'border-red-500 bg-red-50 text-red-700';

    return (
      <button
        onClick={() => setSelectedStatus(value)}
        className={cn(
          'rounded-lg border-2 px-4 py-2 text-sm transition-all',
          selectedStatus === value
            ? toneClasses
            : 'border-gray-200 text-gray-600 hover:border-gray-300'
        )}
      >
        {label}
        <span className="text-xs text-gray-500">
          {' '}
          (
          {
            mockShelters.filter(s =>
              value === 'all' ? true : s.status === value
            ).length
          }
          )
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Bed className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">ศูนย์พักพิง</h2>
            <p className="text-sm text-gray-500">
              รายการศูนย์พักพิงที่เปิดให้บริการ
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterButton('all', 'ทั้งหมด', 'primary')}
          {filterButton('available', 'ว่าง', 'green')}
          {filterButton('limited', 'ใกล้เต็ม', 'orange')}
          {filterButton('full', 'เต็ม', 'red')}
        </div>
      </div>

      <div className="space-y-4">
        {filteredShelters.length === 0 ? (
          <EmptyState message="ยังไม่มีศูนย์พักพิง" />
        ) : (
          filteredShelters.map(shelter => (
            <ShelterCard key={shelter.id} shelter={shelter} />
          ))
        )}
      </div>

      <EmergencyNotice />
    </div>
  );
}

function ShelterCard({ shelter }: { shelter: Shelter }) {
  const occupancyPercent = Math.round(
    (shelter.occupied / shelter.capacity) * 100
  );
  const badge = getShelterStatusBadge(shelter.status);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <h3 className="mb-1 text-gray-900">{shelter.name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{shelter.location}</span>
          </div>
        </div>
        <span
          className={cn(
            'rounded px-2.5 py-1 text-xs',
            badge.bgClass,
            badge.textClass,
            badge.borderClass
          )}
        >
          {badge.text}
        </span>
      </div>

      <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="mb-1 text-xs text-gray-600">ที่อยู่</div>
        <div className="text-sm text-gray-900">{shelter.address}</div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="h-4 w-4" />
            <span>ความจุ</span>
          </div>
          <span className="text-sm text-gray-900">
            {shelter.occupied}/{shelter.capacity} คน
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              shelter.status === 'available'
                ? 'bg-green-500'
                : shelter.status === 'limited'
                ? 'bg-orange-500'
                : 'bg-red-500'
            )}
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-xs text-gray-600">สิ่งอำนวยความสะดวก</div>
        <div className="flex flex-wrap gap-2">
          {shelter.facilities.map(facility => {
            const Icon = facilityIcons[facility];
            return (
              <span
                key={facility}
                className="inline-flex items-center gap-1.5 rounded border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs text-gray-700"
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {facility}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{shelter.hours}</span>
        </div>
        <a
          href={`tel:${shelter.phone}`}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-[#e14a21]"
        >
          <Phone className="h-4 w-4" />
          <span>โทร</span>
        </a>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
      <Bed className="mx-auto mb-3 h-12 w-12 text-gray-300" />
      <p className="text-gray-500">{message}</p>
    </div>
  );
}

function EmergencyNotice() {
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="text-sm text-gray-700">
          <p className="mb-1 text-gray-900">หมายเหตุ</p>
          <p className="text-xs text-gray-600">
            ข้อมูลอาจเปลี่ยนแปลงได้ กรุณาโทรสอบถามก่อนเดินทาง หรือในกรณีฉุกเฉินโทร 191 หรือ 1669
          </p>
        </div>
      </div>
    </div>
  );
}
