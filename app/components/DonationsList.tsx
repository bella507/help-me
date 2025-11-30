import { useMemo, useState } from 'react';
import {
  Package,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
} from 'lucide-react';
import type { DonationNeed } from '@/app/types';
import { cn } from '@/app/lib/utils';

type DonationCenter = {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  acceptedItems: string[];
};

const donationNeeds: DonationNeed[] = [
  {
    id: '1',
    item: 'อาหารและเครื่องดื่ม',
    category: 'อาหารและเครื่องดื่ม',
    items: [
      'น้ำดื่ม',
      'อาหารกระป๋อง',
      'มาม่า บะหมี่กึ่งสำเร็จรูป',
      'ขนมโปรตีน',
      'นมกล่อง',
    ],
    urgency: 'high',
    status: 'urgent',
  },
  {
    id: '2',
    item: 'เสื้อผ้าและผ้าห่ม',
    category: 'เสื้อผ้าและผ้าห่ม',
    items: ['เสื้อผ้าสะอาด', 'ผ้าห่ม', 'หมอน', 'ผ้าเช็ดตัว', 'รองเท้า'],
    urgency: 'high',
    status: 'urgent',
  },
  {
    id: '3',
    item: 'ยาและเวชภัณฑ์',
    category: 'ยาและเวชภัณฑ์',
    items: [
      'ยาพื้นฐาน',
      'พลาสเตอร์',
      'แอลกอฮอล์',
      'หน้ากากอนามัย',
      'ผ���าก๊อซ',
    ],
    urgency: 'high',
    status: 'urgent',
  },
  {
    id: '4',
    item: 'อุปกรณ์ทำความสะอาด',
    category: 'อุปกรณ์ทำความสะอาด',
    items: ['สบู่', 'ยาสีฟัน', 'แปรงสีฟัน', 'แชมพู', 'ผงซักฟอก'],
    urgency: 'medium',
    status: 'needed',
  },
  {
    id: '5',
    item: 'อุปกรณ์สำหรับเด็ก',
    category: 'อุปกรณ์สำหรับเด็ก',
    items: ['นมผง', 'ผ้าอ้อม', 'ขวดนม', 'อาหารเด็ก', 'ของเล่น'],
    urgency: 'medium',
    status: 'needed',
  },
  {
    id: '6',
    item: 'อุปกรณ์ไฟฟ้า',
    category: 'อุปกรณ์ไฟฟ้า',
    items: ['ไฟฉาย', 'ถ่าน', 'เพาเวอร์แบงค์', 'สายชาร์จ', 'พัดลมพกพา'],
    urgency: 'medium',
    status: 'needed',
  },
  {
    id: '7',
    item: 'เครื่องใช้ในบ้าน',
    category: 'เครื่องใช้ในบ้าน',
    items: ['แก้วน้ำ', 'จานชาม', 'ช้อนส้อม', 'กระติกน้ำ', 'ถังน้ำ'],
    urgency: 'low',
    status: 'sufficient',
  },
  {
    id: '8',
    item: 'อุปกรณ์การเรียน',
    category: 'อุปกรณ์การเรียน',
    items: ['สมุด', 'ปากกา', 'ดินสอ', 'สีเขียน', 'กระเป๋านักเรียน'],
    urgency: 'low',
    status: 'sufficient',
  },
];

const donationCenters: DonationCenter[] = [
  {
    id: '1',
    name: 'ศูนย์รับบริจาคกรุงเทพฯ 1',
    address: 'ศาลาว่าการกรุงเทพมหานคร ถนนดินสอ เขตพระนคร',
    phone: '02-224-1234',
    hours: 'ทุกวัน 08:00 - 20:00 น.',
    acceptedItems: ['ทุกประเภท'],
  },
  {
    id: '2',
    name: 'ศูนย์รับบริจาคกรุงเทพฯ 2',
    address: 'สำนักงานเขตบางรัก ถนนสีลม',
    phone: '02-234-5678',
    hours: 'ทุกวัน 08:00 - 18:00 น.',
    acceptedItems: ['อาหาร', 'เสื้อผ้า', 'ยา'],
  },
  {
    id: '3',
    name: 'ศูนย์รับบริจาคกรุงเทพฯ 3',
    address: 'สนามกีฬาแห่งชาติ ถนนพระราม 1',
    phone: '02-214-0111',
    hours: 'ทุกวัน 24 ชั่วโมง',
    acceptedItems: ['ทุกประเภท'],
  },
  {
    id: '4',
    name: 'ศูนย์รับบริจาคกรุงเทพฯ 4',
    address: 'ศูนย์การค้าเซ็นทรัลเวิลด์ ถนนราชดำริ',
    phone: '02-613-1111',
    hours: 'ทุกวัน 10:00 - 22:00 น.',
    acceptedItems: ['อาหาร', 'อุปกรณ์ไฟฟ้า'],
  },
];

export function DonationsList() {
  const [filter, setFilter] = useState<'all' | DonationNeed['status']>('all');

  const filteredItems = useMemo(
    () =>
      filter === 'all'
        ? donationNeeds
        : donationNeeds.filter(item => item.status === filter),
    [filter]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <Header filter={filter} onFilterChange={setFilter} />

      <DonationNeedsList items={filteredItems} />

      <DonationCenters centers={donationCenters} />

      <Guidelines />
    </div>
  );
}

function StatusBadge({ status }: { status: DonationNeed['status'] }) {
  const map = {
    urgent: {
      icon: TrendingUp,
      text: 'ขาดมาก',
      bg: 'bg-red-50',
      border: 'border-red-200',
      color: 'text-red-700',
      iconColor: 'text-red-600',
    },
    needed: {
      icon: Minus,
      text: 'ต้องการ',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      color: 'text-orange-700',
      iconColor: 'text-orange-600',
    },
    sufficient: {
      icon: TrendingDown,
      text: 'เพียงพอ',
      bg: 'bg-green-50',
      border: 'border-green-200',
      color: 'text-green-700',
      iconColor: 'text-green-600',
    },
  } as const;

  const config = map[status];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded px-2 py-1 border',
        config.bg,
        config.border
      )}
    >
      <Icon className={cn('h-3 w-3 sm:h-3.5 sm:w-3.5', config.iconColor)} />
      <span className={cn('text-[10px] sm:text-xs', config.color)}>
        {config.text}
      </span>
    </div>
  );
}

function FilterButton({
  active,
  label,
  activeClasses,
  onClick,
}: {
  active: boolean;
  label: string;
  activeClasses: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded border-2 px-2.5 py-1.5 text-[10px] transition-all sm:px-3 sm:text-xs',
        active
          ? activeClasses
          : 'border-gray-200 text-gray-600 hover:border-gray-300'
      )}
    >
      {label}
    </button>
  );
}

function Header({
  filter,
  onFilterChange,
}: {
  filter: 'all' | DonationNeed['status'];
  onFilterChange: (value: 'all' | DonationNeed['status']) => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-3 flex items-center gap-2 sm:gap-3 sm:mb-4">
        <div className="rounded-lg bg-primary/10 p-2 sm:p-2.5">
          <Package className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
        </div>
        <div>
          <h2 className="text-gray-900">รายการของบริจาค</h2>
          <p className="text-xs text-gray-500 sm:text-sm">
            สิ่งของที่ต้องการและจุดรับบริจาค
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={filter === 'all'}
          label="ทั้งหมด"
          activeClasses="border-primary bg-primary/5 text-primary"
          onClick={() => onFilterChange('all')}
        />
        <FilterButton
          active={filter === 'urgent'}
          label="ขาดมาก"
          activeClasses="border-red-500 bg-red-50 text-red-700"
          onClick={() => onFilterChange('urgent')}
        />
        <FilterButton
          active={filter === 'needed'}
          label="ต้องการ"
          activeClasses="border-orange-500 bg-orange-50 text-orange-700"
          onClick={() => onFilterChange('needed')}
        />
        <FilterButton
          active={filter === 'sufficient'}
          label="เพียงพอ"
          activeClasses="border-green-500 bg-green-50 text-green-700"
          onClick={() => onFilterChange('sufficient')}
        />
      </div>
    </div>
  );
}

function DonationNeedsList({ items }: { items: DonationNeed[] }) {
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map(item => (
        <div
          key={item.id}
          className="rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm sm:p-5"
        >
          <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3 sm:gap-3">
            <h3 className="text-sm text-gray-900 sm:text-base">
              {item.category}
            </h3>
            <StatusBadge status={item.status} />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(item.items ?? [item.item]).map((subItem, idx) => (
              <span
                key={idx}
                className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-700 sm:px-2.5 sm:text-xs sm:py-1"
              >
                {subItem}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DonationCenters({ centers }: { centers: DonationCenter[] }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
      <div className="mb-3 flex items-center gap-2 sm:mb-4">
        <MapPin className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
        <h3 className="text-sm text-gray-900 sm:text-base">จุดรับบริจาค</h3>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {centers.map(center => (
          <div
            key={center.id}
            className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4"
          >
            <h4 className="mb-2 text-sm text-gray-900 sm:text-base">
              {center.name}
            </h4>
            <div className="space-y-1.5 text-xs text-gray-600 sm:text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>{center.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>รับบริจาค: {center.acceptedItems.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 sm:text-xs">
                <span>⏰ {center.hours}</span>
              </div>
            </div>
            <a
              href={`tel:${center.phone}`}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs text-white transition-colors hover:bg-[#e14a21] sm:text-sm"
            >
              <span>โทร {center.phone}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

function Guidelines() {
  const guidelines = [
    'บริจาคเฉพาะของที่อยู่ในสภาพดี สะอาด ใช้งานได้',
    'อาหารและยาต้องไม่หมดอายุ ระบุวันหมดอายุชัดเจน',
    'เสื้อผ้าควรซักสะอาดก่อนบริจาค',
    'ติดต่อศูนย์รับบริจาคก่อนหากมีของจำนวนมาก',
  ];
  return (
    <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 sm:p-4">
      <div className="flex gap-2 sm:gap-3">
        <AlertCircle className="h-4 w-4 shrink-0 text-primary sm:h-5 sm:w-5" />
        <div className="text-xs text-gray-700 sm:text-sm">
          <p className="mb-1 text-gray-900">แนวทางการบริจาค</p>
          <ul className="list-inside list-disc space-y-1 text-[10px] text-gray-600 sm:text-xs">
            {guidelines.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
