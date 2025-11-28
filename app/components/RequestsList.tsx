import { useEffect, useMemo, useState } from 'react';
import {
  Clock,
  Search,
  Package,
  MapPin,
  Phone as PhoneIcon,
  ChevronDown,
  ChevronUp,
  Star,
  AlertTriangle,
  Baby,
  Accessibility,
  Heart,
  PawPrint,
  Pill,
  Users,
} from 'lucide-react';
import { RatingSystem } from './RatingSystem';
import { CATEGORY_LABELS } from '@/app/lib/constants';
import {
  cn,
  formatDate,
  getStatusBadge,
  getUrgencyBadge,
  requestStorage,
} from '@/app/lib/utils';
import type { HelpRequest } from '@/app/types';

type StatusFilter = 'all' | HelpRequest['status'];

const URGENCY_ORDER: Record<HelpRequest['urgency'], number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function RequestsList() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [showRating, setShowRating] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<StatusFilter>('all');
  const [sortByUrgency, setSortByUrgency] = useState(true);

  useEffect(() => {
    const sync = () => setRequests(requestStorage.getAll());
    const t = window.setTimeout(sync, 0);
    const interval = window.setInterval(sync, 5000);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(interval);
    };
  }, []);

  const stats = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      inProgress: requests.filter(r => r.status === 'in-progress').length,
      completed: requests.filter(r => r.status === 'completed').length,
    }),
    [requests]
  );

  const filteredRequests = useMemo(() => {
    return requests
      .filter(req => !searchPhone || req.phone.includes(searchPhone))
      .filter(req => filterStatus === 'all' || req.status === filterStatus)
      .sort((a, b) => {
        if (sortByUrgency) {
          const diff = URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency];
          if (diff !== 0) return diff;
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
  }, [requests, searchPhone, filterStatus, sortByUrgency]);

  return (
    <div className="space-y-4">
      {stats.total > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatusCard
            active={filterStatus === 'all'}
            label="ทั้งหมด"
            count={stats.total}
            tone="gray"
            onClick={() => setFilterStatus('all')}
            icon={<Package className="h-4 w-4" />}
          />
          <StatusCard
            active={filterStatus === 'pending'}
            label="รอดำเนินการ"
            count={stats.pending}
            tone="orange"
            onClick={() => setFilterStatus('pending')}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <StatusCard
            active={filterStatus === 'in-progress'}
            label="กำลังดำเนินการ"
            count={stats.inProgress}
            tone="blue"
            onClick={() => setFilterStatus('in-progress')}
            icon={<Clock className="h-4 w-4" />}
          />
          <StatusCard
            active={filterStatus === 'completed'}
            label="เสร็จสิ้น"
            count={stats.completed}
            tone="green"
            onClick={() => setFilterStatus('completed')}
            icon={<Clock className="h-4 w-4" />}
          />
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-gray-900">ติดตามสถานะคำขอ</h2>
        <p className="mb-4 text-sm text-gray-600">ค้นหาด้วยเบอร์โทรศัพท์</p>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            placeholder="0xx-xxx-xxxx"
            value={searchPhone}
            onChange={e => setSearchPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 pl-12 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState searchPhone={searchPhone} filterStatus={filterStatus} />
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-gray-600">
              แสดง{' '}
              <span className="text-gray-900">{filteredRequests.length}</span>{' '}
              รายการ
              {filterStatus !== 'all' && (
                <span className="text-gray-500"> (กรองตามสถานะ)</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">เรียงด่วนก่อน</span>
              <Toggle
                on={sortByUrgency}
                onToggle={() => setSortByUrgency(v => !v)}
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                expanded={expandedId === request.id}
                onToggle={() =>
                  setExpandedId(expandedId === request.id ? null : request.id)
                }
                onShowRating={() => setShowRating(request.id)}
              />
            ))}
          </div>
        </>
      )}

      {showRating && (
        <RatingSystem
          requestId={showRating}
          onClose={() => setShowRating(null)}
        />
      )}
    </div>
  );
}

function StatusCard({
  active,
  label,
  count,
  tone,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  count: number;
  tone: 'gray' | 'orange' | 'blue' | 'green';
  onClick: () => void;
  icon: React.ReactNode;
}) {
  const tones: Record<
    typeof tone,
    { bg: string; border: string; text: string }
  > = {
    gray: { bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900' },
    orange: {
      bg: 'bg-white',
      border: 'border-orange-200',
      text: 'text-orange-600',
    },
    blue: { bg: 'bg-white', border: 'border-blue-200', text: 'text-blue-600' },
    green: {
      bg: 'bg-white',
      border: 'border-green-200',
      text: 'text-green-600',
    },
  };
  const activeTone: Record<typeof tone, string> = {
    gray: 'bg-gray-900 border-gray-900 text-white',
    orange: 'bg-orange-500 border-orange-500 text-white',
    blue: 'bg-blue-500 border-blue-500 text-white',
    green: 'bg-green-500 border-green-500 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-lg border p-4 text-left transition-all',
        active ? activeTone[tone] : `${tones[tone].bg} ${tones[tone].border}`
      )}
    >
      <div
        className={cn(
          'mb-1 flex items-center gap-2',
          active ? 'text-white' : tones[tone].text
        )}
      >
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <div className={cn('text-2xl', active ? 'text-white' : tones[tone].text)}>
        {count}
      </div>
    </button>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative h-6 w-10 rounded-full transition-colors',
        on ? 'bg-primary' : 'bg-gray-300'
      )}
    >
      <div
        className={cn(
          'absolute top-1 h-4 w-4 rounded-full bg-white transition-transform',
          on ? 'translate-x-[18px]' : 'translate-x-1'
        )}
      />
    </button>
  );
}

function RequestCard({
  request,
  expanded,
  onToggle,
  onShowRating,
}: {
  request: HelpRequest;
  expanded: boolean;
  onToggle: () => void;
  onShowRating: () => void;
}) {
  const status = getStatusBadge(request.status);
  const urgency = getUrgencyBadge(request.urgency);
  const hasSpecialNeeds =
    request.specialNeeds && Object.values(request.specialNeeds).some(v => v);

  return (
    <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white transition-all hover:border-gray-300">
      <div
        className={cn(
          'h-1.5',
          request.status === 'completed'
            ? 'bg-green-500'
            : request.status === 'in-progress'
            ? 'bg-blue-500'
            : 'bg-orange-500'
        )}
      />
      <div className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="truncate text-gray-900">{request.name}</h3>
              <span
                className={cn(
                  'flex items-center gap-1 rounded px-2 py-0.5 text-xs',
                  urgency.bgClass,
                  urgency.textClass,
                  urgency.borderClass
                )}
              >
                {urgency.text}
              </span>
            </div>

            <div className="mb-2 flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                <span>{request.phone}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="truncate">
                {CATEGORY_LABELS[request.category] || request.category}
              </span>
            </div>

            <div className="mb-2 flex items-center gap-1.5 text-sm text-gray-600">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
              <span className="truncate">{request.location}</span>
            </div>

            {hasSpecialNeeds && (
              <div className="flex items-center gap-1.5">
                {request.specialNeeds?.elderly && (
                  <IconChip
                    icon={<Users className="h-3.5 w-3.5 text-gray-600" />}
                    title={`ผู้สูงอายุ ${request.elderlyCount || ''} คน`}
                  />
                )}
                {request.specialNeeds?.children && (
                  <IconChip
                    icon={<Baby className="h-3.5 w-3.5 text-gray-600" />}
                    title={`เด็ก ${request.childrenCount || ''} คน`}
                  />
                )}
                {request.specialNeeds?.disabled && (
                  <IconChip
                    icon={
                      <Accessibility className="h-3.5 w-3.5 text-gray-600" />
                    }
                    title="ผู้พิการ"
                  />
                )}
                {request.specialNeeds?.pregnant && (
                  <IconChip
                    icon={<Heart className="h-3.5 w-3.5 text-gray-600" />}
                    title={`หญิงมีครรภ์ ${request.pregnantCount || ''} คน`}
                  />
                )}
                {request.specialNeeds?.pets && (
                  <IconChip
                    icon={<PawPrint className="h-3.5 w-3.5 text-gray-600" />}
                    title={
                      request.petsType ||
                      `สัตว์เลี้ยง ${request.petsCount || 1} ตัว`
                    }
                  />
                )}
                {request.specialNeeds?.medical && (
                  <IconChip
                    icon={<Pill className="h-3.5 w-3.5 text-gray-600" />}
                    title={
                      request.medicalNeeds || 'ต้องการยา/อุปกรณ์ทางการแพทย์'
                    }
                  />
                )}
              </div>
            )}
          </div>

          <button
            onClick={onToggle}
            className="shrink-0 rounded p-1.5 transition-colors hover:bg-gray-100"
            title={expanded ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 space-y-3 border-t border-gray-200 pt-3">
            {request.description && (
              <div>
                <div className="mb-1 text-xs text-gray-500">รายละเอียด</div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {request.description}
                </p>
              </div>
            )}

            {hasSpecialNeeds && (
              <div>
                <div className="mb-2 text-xs text-gray-500">
                  กลุ่มเสี่ยงพิเศษ
                </div>
                <div className="space-y-1.5 text-sm text-gray-700">
                  {request.specialNeeds?.elderly && request.elderlyCount && (
                    <DetailRow
                      icon={<Users className="h-4 w-4 text-gray-400" />}
                      text={`ผู้สูงอายุ ${request.elderlyCount} คน`}
                    />
                  )}
                  {request.specialNeeds?.children && request.childrenCount && (
                    <DetailRow
                      icon={<Baby className="h-4 w-4 text-gray-400" />}
                      text={`เด็ก ${request.childrenCount} คน`}
                    />
                  )}
                  {request.specialNeeds?.disabled && (
                    <DetailRow
                      icon={<Accessibility className="h-4 w-4 text-gray-400" />}
                      text={`ผู้พิการ ${request.disabledCount || 1} คน`}
                    />
                  )}
                  {request.specialNeeds?.pregnant && request.pregnantCount && (
                    <DetailRow
                      icon={<Heart className="h-4 w-4 text-gray-400" />}
                      text={`หญิงมีครรภ์ ${request.pregnantCount} คน`}
                    />
                  )}
                  {request.specialNeeds?.pets && (
                    <DetailRow
                      icon={<PawPrint className="h-4 w-4 text-gray-400" />}
                      text={
                        request.petsType ||
                        `สัตว์เลี้ยง ${request.petsCount || 1} ตัว`
                      }
                    />
                  )}
                  {request.specialNeeds?.medical && (
                    <DetailRow
                      icon={<Pill className="h-4 w-4 text-gray-400" />}
                      text={
                        request.medicalNeeds || 'ต้องการยา/อุปกรณ์ทางการแพทย์'
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {request.notes && (
              <NoteBlock tone="yellow" title="หมายเหตุ" text={request.notes} />
            )}
            {request.volunteerNotes && (
              <NoteBlock
                tone="green"
                title="ความคืบหน้า"
                text={request.volunteerNotes}
              />
            )}

            {request.status === 'completed' && (
              <button
                onClick={onShowRating}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/5"
              >
                <Star className="h-4 w-4" />
                <span>ให้คะแนนความพึงพอใจ</span>
              </button>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs',
              status.bgClass,
              status.textClass,
              status.borderClass
            )}
          >
            {status.text}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>{formatDate(request.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconChip({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="rounded bg-gray-100 p-1.5" title={title}>
      {icon}
    </div>
  );
}

function DetailRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function NoteBlock({
  tone,
  title,
  text,
}: {
  tone: 'yellow' | 'green';
  title: string;
  text: string;
}) {
  const styles =
    tone === 'yellow'
      ? 'border-l-2 border-yellow-400 bg-yellow-50 text-yellow-800'
      : 'border-l-2 border-green-400 bg-green-50 text-green-800';
  const titleColor = tone === 'yellow' ? 'text-yellow-700' : 'text-green-700';

  return (
    <div className={cn('rounded-r p-2.5', styles)}>
      <div className={cn('mb-0.5 text-xs', titleColor)}>{title}</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function EmptyState({
  searchPhone,
  filterStatus,
}: {
  searchPhone: string;
  filterStatus: StatusFilter;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
        <Package className="h-8 w-8 text-gray-400" />
      </div>
      <p className="mb-1 text-gray-900">
        {searchPhone
          ? 'ไม่พบคำขอที่ตรงกับเบอร์โทรศัพท์'
          : filterStatus !== 'all'
          ? 'ไม่มีคำขอในสถานะนี้'
          : 'ยังไม่มีคำขอความช่วยเหลือ'}
      </p>
      <p className="text-sm text-gray-500">
        {searchPhone
          ? 'ลองค้นหาด้วยเบอร์อื่น'
          : filterStatus !== 'all'
          ? 'ลองเลือกดูสถานะอื่น'
          : 'กรอกเบอร์โทรศัพท์เพื่อค้นหา'}
      </p>
    </div>
  );
}
