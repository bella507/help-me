import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations, type TranslationValues } from 'next-intl';
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
  const t = useTranslations('home.requests');
  const tCommon = useTranslations('home.common');
  const locale = useLocale();
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

  const formatDateLocalized = (dateString: string) => {
    const date = new Date(dateString);
    const now = Date.now();
    const diffMs = now - date.getTime();
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const rtf = new Intl.RelativeTimeFormat(
      locale === 'th' ? 'th' : 'en',
      { numeric: 'auto' }
    );

    if (diffMs < hour) return rtf.format(-Math.round(diffMs / minute), 'minute');
    if (diffMs < day) return rtf.format(-Math.round(diffMs / hour), 'hour');
    if (diffMs < week) return rtf.format(-Math.round(diffMs / day), 'day');

    return new Intl.DateTimeFormat(locale === 'th' ? 'th-TH' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const translate = (key: string, values?: TranslationValues) =>
    t(key as Parameters<typeof t>[0], values);
  const translateCommon = (key: string, values?: TranslationValues) =>
    tCommon(key as Parameters<typeof tCommon>[0], values);

  return (
    <div className="space-y-4">
      {stats.total > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatusCard
            active={filterStatus === 'all'}
            label={tCommon('status.all')}
            count={stats.total}
            tone="gray"
            onClick={() => setFilterStatus('all')}
            icon={<Package className="h-4 w-4" />}
          />
          <StatusCard
            active={filterStatus === 'pending'}
            label={tCommon('status.pending')}
            count={stats.pending}
            tone="orange"
            onClick={() => setFilterStatus('pending')}
            icon={<AlertTriangle className="h-4 w-4" />}
          />
          <StatusCard
            active={filterStatus === 'in-progress'}
            label={tCommon('status.in-progress')}
            count={stats.inProgress}
            tone="blue"
            onClick={() => setFilterStatus('in-progress')}
            icon={<Clock className="h-4 w-4" />}
          />
          <StatusCard
            active={filterStatus === 'completed'}
            label={tCommon('status.completed')}
            count={stats.completed}
            tone="green"
            onClick={() => setFilterStatus('completed')}
            icon={<Clock className="h-4 w-4" />}
          />
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-1 text-gray-900">{t('heading')}</h2>
        <p className="mb-4 text-sm text-gray-600">{t('subheading')}</p>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="tel"
            placeholder={t('searchPlaceholder')}
            value={searchPhone}
            onChange={e => setSearchPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 pl-12 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          searchPhone={searchPhone}
          filterStatus={filterStatus}
          t={translate}
        />
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-gray-600">
              {t('showing', { count: filteredRequests.length })}{' '}
              {filterStatus !== 'all' && (
                <span className="text-gray-500">{t('filteredHint')}</span>
              )}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {t('urgencyToggle')}
              </span>
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
                t={translate}
                tCommon={translateCommon}
                formatDate={formatDateLocalized}
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
  t,
  tCommon,
  formatDate,
}: {
  request: HelpRequest;
  expanded: boolean;
  onToggle: () => void;
  onShowRating: () => void;
  t: (key: string, values?: TranslationValues) => string;
  tCommon: (key: string, values?: TranslationValues) => string;
  formatDate: (dateString: string) => string;
}) {
  const status = getStatusBadge(request.status);
  const urgency = getUrgencyBadge(request.urgency);
  const statusText = tCommon(`status.${request.status}`);
  const urgencyText = tCommon(`urgency.${request.urgency}`);
  const categoryLabel = tCommon(`categories.${request.category}`, {
    fallback: CATEGORY_LABELS[request.category] || request.category,
  });
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
                {urgencyText}
              </span>
            </div>

            <div className="mb-2 flex items-center gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <PhoneIcon className="h-3.5 w-3.5 text-gray-400" />
                <span>{request.phone}</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="truncate">
                {categoryLabel}
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
                    title={t('riskCounts.elderly', {
                      count: request.elderlyCount || 0,
                    })}
                  />
                )}
                {request.specialNeeds?.children && (
                  <IconChip
                    icon={<Baby className="h-3.5 w-3.5 text-gray-600" />}
                    title={t('riskCounts.children', {
                      count: request.childrenCount || 0,
                    })}
                  />
                )}
                {request.specialNeeds?.disabled && (
                  <IconChip
                    icon={
                      <Accessibility className="h-3.5 w-3.5 text-gray-600" />
                    }
                    title={t('riskCounts.disabled')}
                  />
                )}
                {request.specialNeeds?.pregnant && (
                  <IconChip
                    icon={<Heart className="h-3.5 w-3.5 text-gray-600" />}
                    title={t('riskCounts.pregnant', {
                      count: request.pregnantCount || 0,
                    })}
                  />
                )}
                {request.specialNeeds?.pets && (
                  <IconChip
                    icon={<PawPrint className="h-3.5 w-3.5 text-gray-600" />}
                    title={
                      request.petsType ||
                      t('riskCounts.pets', {
                        count: request.petsCount || 1,
                      })
                    }
                  />
                )}
                {request.specialNeeds?.medical && (
                  <IconChip
                    icon={<Pill className="h-3.5 w-3.5 text-gray-600" />}
                    title={
                      request.medicalNeeds || t('riskCounts.medical')
                    }
                  />
                )}
              </div>
            )}
          </div>

          <button
            onClick={onToggle}
            className="shrink-0 rounded p-1.5 transition-colors hover:bg-gray-100"
            title={expanded ? t('toggle.hide') : t('toggle.show')}
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
                <div className="mb-1 text-xs text-gray-500">
                  {t('noteTitle')}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {request.description}
                </p>
              </div>
            )}

            {hasSpecialNeeds && (
              <div>
                <div className="mb-2 text-xs text-gray-500">
                  {t('specialGroupTitle')}
                </div>
                <div className="space-y-1.5 text-sm text-gray-700">
                  {request.specialNeeds?.elderly && request.elderlyCount && (
                    <DetailRow
                      icon={<Users className="h-4 w-4 text-gray-400" />}
                      text={t('riskCounts.elderly', {
                        count: request.elderlyCount,
                      })}
                    />
                  )}
                  {request.specialNeeds?.children && request.childrenCount && (
                    <DetailRow
                      icon={<Baby className="h-4 w-4 text-gray-400" />}
                      text={t('riskCounts.children', {
                        count: request.childrenCount,
                      })}
                    />
                  )}
                  {request.specialNeeds?.disabled && (
                    <DetailRow
                      icon={<Accessibility className="h-4 w-4 text-gray-400" />}
                      text={t('riskCounts.disabled')}
                    />
                  )}
                  {request.specialNeeds?.pregnant && request.pregnantCount && (
                    <DetailRow
                      icon={<Heart className="h-4 w-4 text-gray-400" />}
                      text={t('riskCounts.pregnant', {
                        count: request.pregnantCount,
                      })}
                    />
                  )}
                  {request.specialNeeds?.pets && (
                    <DetailRow
                      icon={<PawPrint className="h-4 w-4 text-gray-400" />}
                      text={
                        request.petsType ||
                        t('riskCounts.pets', {
                          count: request.petsCount || 1,
                        })
                      }
                    />
                  )}
                  {request.specialNeeds?.medical && (
                    <DetailRow
                      icon={<Pill className="h-4 w-4 text-gray-400" />}
                      text={
                        request.medicalNeeds || t('riskCounts.medical')
                      }
                    />
                  )}
                </div>
              </div>
            )}

            {request.notes && (
              <NoteBlock
                tone="yellow"
                title={t('noteTitle')}
                text={request.notes}
              />
            )}
            {request.volunteerNotes && (
              <NoteBlock
                tone="green"
                title={t('progressTitle')}
                text={request.volunteerNotes}
              />
            )}

            {request.status === 'completed' && (
              <button
                onClick={onShowRating}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-primary px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/5"
              >
                <Star className="h-4 w-4" />
                <span>{t('ratingButton')}</span>
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
            {statusText}
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
  t,
}: {
  searchPhone: string;
  filterStatus: StatusFilter;
  t: (key: string) => string;
}) {
  const messageKey =
    searchPhone.length > 0
      ? 'phone'
      : filterStatus !== 'all'
      ? 'status'
      : 'default';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
        <Package className="h-8 w-8 text-gray-400" />
      </div>
      <p className="mb-1 text-gray-900">{t(`empty.${messageKey}Title`)}</p>
      <p className="text-sm text-gray-500">
        {t(`empty.${messageKey}Subtitle`)}
      </p>
    </div>
  );
}
