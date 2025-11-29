import { useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  Users,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  MapPin,
  Phone,
  Navigation,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { CATEGORY_LABELS, REQUEST_STATUS } from '@/app/lib/constants';
import {
  cn,
  formatDate,
  generateId,
  getUrgencyBadge,
  notificationStorage,
  requestStorage,
  userStorage,
} from '@/app/lib/utils';
import type { HelpRequest } from '@/app/types';

type Tab = 'my-tasks' | 'available';

export function VolunteerDashboard() {
  const t = useTranslations('home.volunteerDashboard');
  const tCommon = useTranslations('home.common');
  const locale = useLocale();
  const [myTasks, setMyTasks] = useState<HelpRequest[]>([]);
  const [availableTasks, setAvailableTasks] = useState<HelpRequest[]>([]);
  const [selectedTask, setSelectedTask] = useState<HelpRequest | null>(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('my-tasks');
  const volunteerId = 'v1'; // TODO: derive from login/session

  const stats = useMemo(
    () => ({
      my: myTasks.length,
      available: availableTasks.length,
    }),
    [myTasks, availableTasks]
  );

  useEffect(() => {
    const sync = () => {
      const requests = requestStorage.getAll();
      setMyTasks(
        requests.filter(
          r =>
            r.assignedTo === volunteerId &&
            r.status !== REQUEST_STATUS.COMPLETED
        )
      );
      setAvailableTasks(
        requests.filter(
          r => !r.assignedTo && r.status === REQUEST_STATUS.PENDING
        )
      );
    };
    const t = window.setTimeout(sync, 0);
    const interval = window.setInterval(sync, 5000);
    return () => {
      window.clearTimeout(t);
      window.clearInterval(interval);
    };
  }, [volunteerId]);

  const handleLogout = () => {
    userStorage.clearRole();
    localStorage.removeItem('username');
    window.location.reload();
  };

  const acceptTask = (taskId: string) => {
    requestStorage.update(taskId, req => ({
      ...req,
      assignedTo: volunteerId,
      status: REQUEST_STATUS.IN_PROGRESS,
    }));
    toast.success(t('toast.accepted'));
    setActiveTab('my-tasks');
  };

  const completeTask = (taskId: string) => {
    const task = requestStorage.getById(taskId);
    requestStorage.update(taskId, req => ({
      ...req,
      status: REQUEST_STATUS.COMPLETED,
    }));

    if (task) {
      notificationStorage.add({
        id: generateId(),
        type: 'success',
        title: 'ทำงานเสร็จสิ้น',
        message: `คุณทำงานช่วยเหลือคุณ${task.name}เสร็จสิ้นแล้ว`,
        time: new Date().toISOString(),
        read: false,
      });
    }

    setSelectedTask(null);
    toast.success(t('toast.completed'));
  };

  const saveTaskNotes = (taskId: string) => {
    requestStorage.update(taskId, req => ({
      ...req,
      volunteerNotes: taskNotes,
    }));
    setTaskNotes('');
    setSelectedTask(null);
    toast.success(t('toast.notesSaved'));
  };

  const openNavigation = (location: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
    window.open(mapsUrl, '_blank');
  };

  const TaskCard = ({
    task,
    actionSlot,
    showNotes = false,
  }: {
    task: HelpRequest;
    actionSlot: React.ReactNode;
    showNotes?: boolean;
  }) => {
    const urgency = getUrgencyBadge(task.urgency);
    const createdText = formatDate(task.createdAt, locale);
    return (
      <div className="rounded-xl border-2 border-gray-200 bg-white p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base text-gray-900">{task.name}</h3>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs',
                    urgency.bgClass,
                    urgency.textClass,
                    urgency.borderClass
                  )}
                >
                  {urgency.text}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs text-gray-600">
                <Clock className="h-3.5 w-3.5" />
                <span>{createdText}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <DetailRow
              icon={<Package className="h-4 w-4 text-gray-400" />}
              label="ประเภท"
              value={
                tCommon(`categories.${task.category}`, {
                  fallback: CATEGORY_LABELS[task.category] || task.category,
                })
              }
            />
            <DetailRow
              icon={<MapPin className="h-4 w-4 text-gray-400" />}
              label={t('fields.location')}
              value={task.location}
            />
            <DetailRow
              icon={<Phone className="h-4 w-4 text-gray-400" />}
              label={t('fields.phone')}
              value={
                <a
                  href={`tel:${task.phone}`}
                  className="text-primary hover:underline"
                >
                  {task.phone}
                </a>
              }
            />
            <DetailRow
              icon={<MessageCircle className="h-4 w-4 text-gray-400" />}
              label={t('fields.description')}
              value={task.description}
            />
          </div>

          {task.notes && (
            <NoteBlock
              tone="yellow"
              title={t('notes.admin')}
              text={task.notes}
            />
          )}

          {showNotes && task.volunteerNotes && (
            <NoteBlock
              tone="blue"
              title={t('notes.mine')}
              text={task.volunteerNotes}
            />
          )}

          {selectedTask?.id === task.id && (
            <div className="border-t border-gray-200 pt-3">
              <textarea
                value={taskNotes}
                onChange={e => setTaskNotes(e.target.value)}
                placeholder={t('notes.placeholder')}
                className="w-full resize-none rounded-lg border-2 border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary"
                rows={3}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => saveTaskNotes(task.id)}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-[#e14a21]"
                >
                  {t('actions.save')}
                </button>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setTaskNotes('');
                  }}
                  className="rounded-lg border-2 border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300"
                >
                  {t('actions.cancel')}
                </button>
              </div>
            </div>
          )}

          {actionSlot}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2.5">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base text-gray-900 sm:text-lg">
                ระบบอาสาสมัคร
              </h1>
              <p className="text-xs text-gray-500 sm:text-sm">
                Volunteer Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 grid grid-cols-2 gap-4">
          <StatCard
            label={t('stats.myTasks')}
            value={stats.my}
            tone="blue"
            icon={<Package className="h-6 w-6 text-blue-600" />}
          />
          <StatCard
            label={t('stats.available')}
            value={stats.available}
            tone="green"
            icon={<AlertCircle className="h-6 w-6 text-green-600" />}
          />
        </div>

        <div className="mb-6 overflow-hidden rounded-xl border-2 border-gray-200 bg-white">
          <div className="flex">
            <TabButton
              active={activeTab === 'my-tasks'}
              onClick={() => setActiveTab('my-tasks')}
              label={t('tabs.myTasksWithCount', { count: stats.my })}
            />
            <TabButton
              active={activeTab === 'available'}
              onClick={() => setActiveTab('available')}
              label={t('tabs.availableWithCount', { count: stats.available })}
            />
          </div>
        </div>

        {activeTab === 'my-tasks' && (
          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <EmptyState
                icon={<Package className="h-16 w-16 text-gray-300" />}
                title={t('empty.myTasks')}
                actionLabel={t('empty.viewAvailable')}
                onAction={() => setActiveTab('available')}
              />
            ) : (
              myTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  showNotes
                  actionSlot={
                    <div className="flex flex-wrap gap-2 border-t border-gray-200 pt-3">
                      <button
                        onClick={() => openNavigation(task.location)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                      >
                        <Navigation className="h-4 w-4" />
                        <span>{t('actions.navigate')}</span>
                      </button>
                      <a
                        href={`tel:${task.phone}`}
                        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{t('actions.call')}</span>
                      </a>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setTaskNotes(task.volunteerNotes || '');
                        }}
                        className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors hover:border-gray-300"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{t('actions.addNotes')}</span>
                      </button>
                      <button
                        onClick={() => completeTask(task.id)}
                        className="ml-auto flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>{t('actions.complete')}</span>
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'available' && (
          <div className="space-y-3">
            {availableTasks.length === 0 ? (
              <EmptyState
                icon={<AlertCircle className="h-16 w-16 text-gray-300" />}
                title={t('empty.available')}
              />
            ) : (
              availableTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  actionSlot={
                    <div className="flex gap-2 border-t border-gray-200 pt-3">
                      <button
                        onClick={() => acceptTask(task.id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm text-white transition-colors hover:bg-[#e14a21]"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>{t('actions.accept')}</span>
                      </button>
                      <button
                        onClick={() => openNavigation(task.location)}
                        className="flex items-center gap-2 rounded-lg border-2 border-gray-200 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:border-gray-300"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>{t('actions.viewMap')}</span>
                      </button>
                    </div>
                  }
                />
              ))
            )}
          </div>
        )}
      </main>

      <Toaster position="top-center" richColors />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 px-6 py-3 text-sm transition-colors',
        active
          ? 'bg-primary text-white'
          : 'bg-white text-gray-700 hover:bg-gray-50'
      )}
    >
      {label}
    </button>
  );
}

function StatCard({
  label,
  value,
  tone,
  icon,
}: {
  label: string;
  value: number;
  tone: 'blue' | 'green';
  icon: React.ReactNode;
}) {
  const toneStyles =
    tone === 'blue'
      ? 'border-blue-200 text-blue-700 bg-white'
      : 'border-green-200 text-green-700 bg-white';
  const badgeStyles = tone === 'blue' ? 'bg-blue-100' : 'bg-green-100';

  return (
    <div className={cn('rounded-xl border-2 p-4', toneStyles)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">{label}</p>
          <p className="mt-1 text-3xl">{value}</p>
        </div>
        <div className={cn('rounded-lg p-3', badgeStyles)}>{icon}</div>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-sm">
      <div className="mt-0.5 shrink-0 text-gray-400">{icon}</div>
      <div>
        <span className="text-gray-600">{label}: </span>
        <span className="text-gray-900">{value}</span>
      </div>
    </div>
  );
}

function NoteBlock({
  tone,
  title,
  text,
}: {
  tone: 'yellow' | 'blue';
  title: string;
  text: string;
}) {
  const bg =
    tone === 'yellow'
      ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
      : 'bg-blue-50 border-blue-200 text-blue-800';
  const titleColor = tone === 'yellow' ? 'text-yellow-900' : 'text-blue-900';
  return (
    <div className={cn('rounded-lg border px-3 py-2 text-xs', bg)}>
      <span className={cn('font-medium', titleColor)}>{title}: </span>
      <span>{text}</span>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  actionLabel,
  onAction,
}: {
  icon: React.ReactNode;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-xl border-2 border-gray-200 bg-white p-12 text-center">
      <div className="mx-auto mb-4">{icon}</div>
      <p className="text-gray-500">{title}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg bg-primary px-6 py-2 text-sm text-white transition-colors hover:bg-[#e14a21]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
