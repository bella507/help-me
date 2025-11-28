import { useMemo, useState } from 'react';
import { AlertTriangle, MapPin, Droplets, Flame, Wind, Zap } from 'lucide-react';
import type { RiskArea } from '@/app/types';
import { cn } from '@/app/lib/utils';
import { getRiskBadge } from '@/app/lib/utils/badges';

type RiskLevel = RiskArea['riskLevel'] | 'all';
type RiskType = 'flood' | 'fire' | 'storm' | 'electric' | 'infrastructure' | 'all';

const riskAreas: RiskArea[] = [
  {
    id: '1',
    name: 'บริเวณริมแม่น้ำเจ้าพระยา',
    location: 'พระนคร, บางกอกใหญ่, บางกอกน้อย, คลองสาน',
    riskLevel: 'high',
    type: 'flood',
    description: 'พื้นที่เสี่ยงน้ำท่วมสูงในช่วงฤดูฝน ระดับน้ำสูงขึ้นเร็วเมื่อฝนตกหนัก',
  },
  {
    id: '2',
    name: 'ชุมชนแออัด',
    location: 'คลองเตย, ดินแดง, ป้อมปราบศัตรูพ่าย',
    riskLevel: 'high',
    type: 'fire',
    description: 'เสี่ยงไฟไหม้สูง บ้านติดกันหนาแน่น ทางสัญจรแคบ สายไฟหนาแน่น',
  },
  {
    id: '3',
    name: 'พื้นที่ลุ่ม',
    location: 'มีนบุรี, หนองจอก, คลองสามวา, ลาดกระบัง',
    riskLevel: 'medium',
    type: 'flood',
    description: 'น้ำขังนานหลังฝนตก ระบบระบายน้ำไม่พอ พื้นที่ต่ำกว่าคลอง',
  },
  {
    id: '4',
    name: 'พื้นที่ใกล้ท่อประปาใหญ่',
    location: 'จตุจักร, ห้วยขวาง, ดินแดง',
    riskLevel: 'medium',
    type: 'infrastructure',
    description: 'เสี่ยงท่อแตก ถนนทรุด น้ำประปาขาดกะทันหัน',
  },
  {
    id: '5',
    name: 'พื้นที่ใกล้สายไฟฟ้าแรงสูง',
    location: 'บางซื่อ, ดอนเมือง, หลักสี่',
    riskLevel: 'medium',
    type: 'electric',
    description: 'อันตรายไฟฟ้าแรงสูง เสาไฟล้มช่วงพายุ ไฟรั่วน้ำท่วม',
  },
  {
    id: '6',
    name: 'พื้นที่เสี่ยงพายุ',
    location: 'ดอนเมือง, สายไหม, หลักสี่, บางเขน',
    riskLevel: 'low',
    type: 'storm',
    description: 'ลมแรงเปลี่ยนฤดู ป้ายหลุด ต้นไม้ล้มได้',
  },
];

const riskTypeInfo = {
  flood: { label: 'น้ำท่วม', icon: Droplets, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  fire: { label: 'ไฟไหม้', icon: Flame, color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  storm: { label: 'พายุ', icon: Wind, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200' },
  electric: { label: 'ไฟฟ้า', icon: Zap, color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  infrastructure: { label: 'โครงสร้าง', icon: AlertTriangle, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
};

export function RiskAreas() {
  const [filterLevel, setFilterLevel] = useState<RiskLevel>('all');
  const [filterType, setFilterType] = useState<RiskType>('all');

  const filteredAreas = useMemo(() => {
    return riskAreas.filter((area) => {
      const matchLevel = filterLevel === 'all' || area.riskLevel === filterLevel;
      const matchType = filterType === 'all' || area.type === filterType;
      return matchLevel && matchType;
    });
  }, [filterLevel, filterType]);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">พื้นที่เสี่ยง</h2>
            <p className="text-sm text-gray-500">ข้อมูลพื้นที่เสี่ยงภัยและคำแนะนำ</p>
          </div>
        </div>

        <div className="space-y-3">
          <FilterGroup
            label="ระดับความเสี่ยง"
            options={[
              { value: 'all', label: 'ทั้งหมด' },
              { value: 'high', label: 'เสี่ยงสูง' },
              { value: 'medium', label: 'เสี่ยงปานกลาง' },
              { value: 'low', label: 'เสี่ยงต่ำ' },
            ]}
            active={filterLevel}
            onChange={(v) => setFilterLevel(v as RiskLevel)}
          />

          <FilterGroup
            label="ประเภทความเสี่ยง"
            options={[
              { value: 'all', label: 'ทั้งหมด' },
              { value: 'flood', label: 'น้ำท่วม' },
              { value: 'fire', label: 'ไฟไหม้' },
              { value: 'storm', label: 'พายุ' },
              { value: 'electric', label: 'ไฟฟ้า' },
              { value: 'infrastructure', label: 'โครงสร้าง' },
            ]}
            active={filterType}
            onChange={(v) => setFilterType(v as RiskType)}
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredAreas.map((area) => (
          <RiskCard key={area.id} area={area} />
        ))}
        {filteredAreas.length === 0 && <EmptyState />}
      </div>
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
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-xs text-gray-600">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded border-2 px-3 py-1.5 text-xs transition-all',
              active === option.value ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RiskCard({ area }: { area: RiskArea }) {
  const badge = getRiskBadge(area.riskLevel);
  const typeInfo = riskTypeInfo[area.type as keyof typeof riskTypeInfo];
  const Icon = typeInfo.icon;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5">
      <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm text-gray-900 sm:text-base">{area.name}</h3>
            <span className={cn('rounded px-2.5 py-1 text-xs', badge.bgClass, badge.textClass, badge.borderClass)}>{badge.text}</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-600 sm:text-sm">
            <MapPin className="h-3.5 w-3.5 text-gray-400" />
            <span>{area.location}</span>
          </div>
        </div>
        <div className={cn('flex items-center gap-1.5 rounded border px-2 py-1 text-xs', typeInfo.bg, typeInfo.color)}>
          <Icon className="h-3.5 w-3.5" />
          <span>{typeInfo.label}</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed">{area.description}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-10 text-center">
      <AlertTriangle className="mx-auto mb-3 h-12 w-12 text-gray-300" />
      <p className="text-gray-500">ไม่พบพื้นที่เสี่ยงตามตัวกรอง</p>
    </div>
  );
}
