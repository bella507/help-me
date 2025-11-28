import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  X,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Trash2,
} from 'lucide-react';
import type { Notification } from '@/app/types';
import { cn, formatDate, notificationStorage } from '@/app/lib/utils';

const defaultNotifications: Notification[] = [
  {
    id: '1',
    type: 'success',
    title: 'ได้รับคำขอของคุณแล้ว',
    message: 'ทีมงานกำลังตรวจสอบและจะติดต่อกลับโดยเร็ว',
    time: new Date(Date.now() - 3600000).toISOString(),
    read: false,
  },
  {
    id: '2',
    type: 'warning',
    title: 'เตือนฝนตกหนัก',
    message: 'พื้นที่กรุงเทพฯ คาดว่าจะมีฝนตกหนักในช่วง 18:00-22:00 น.',
    time: new Date(Date.now() - 7200000).toISOString(),
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'ศูนย์พักพิงใหม่เปิดให้บริการ',
    message: 'ศูนย์กีฬาเขตคลองสาน เปิดให้บริการแล้ว รองรับได้ 250 คน',
    time: new Date(Date.now() - 86400000).toISOString(),
    read: true,
  },
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const stored = notificationStorage.getAll();
      if (stored.length === 0) {
        notificationStorage.save(defaultNotifications);
        setNotifications(defaultNotifications);
      } else {
        setNotifications(stored);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  const updateAndPersist = (next: Notification[]) => {
    setNotifications(next);
    notificationStorage.save(next);
  };

  const markAsRead = (id: string) => {
    updateAndPersist(
      notifications.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    updateAndPersist(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    updateAndPersist(notifications.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    notificationStorage.save([]);
  };

  const getStyle = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="h-5 w-5 text-green-600" />,
          bg: 'bg-green-50 border-green-200',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
          bg: 'bg-orange-50 border-orange-200',
        };
      case 'error':
        return {
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
          bg: 'bg-red-50 border-red-200',
        };
      default:
        return {
          icon: <Info className="h-5 w-5 text-blue-600" />,
          bg: 'bg-blue-50 border-blue-200',
        };
    }
  };

  return (
    <>
      <button
        onClick={() => setShowNotifications(prev => !prev)}
        className="relative rounded-lg bg-gray-100 p-2 transition-colors hover:bg-gray-200 sm:p-2.5"
      >
        <Bell className="h-4 w-4 text-gray-700 sm:h-5 sm:w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div
            className="fixed inset-0 z-60 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed right-4 top-16 z-70 max-h-[70vh] w-[calc(100%-2rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl sm:right-6 sm:top-20 sm:w-96 lg:right-8">
            <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-700" />
                  <h3 className="text-base text-gray-900">การแจ้งเตือน</h3>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="rounded-lg p-1 transition-colors hover:bg-gray-100"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 transition-colors hover:text-blue-700"
                    >
                      อ่านทั้งหมด
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-600 transition-colors hover:text-red-700"
                  >
                    ลบทั้งหมด
                  </button>
                </div>
              )}
            </div>

            <div className="max-h-[calc(70vh-80px)] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                  <p className="text-sm text-gray-500">ไม่มีการแจ้งเตือน</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map(notification => {
                    const style = getStyle(notification.type);
                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          'relative mb-2 rounded-lg border p-3 transition-all',
                          notification.read
                            ? 'border-gray-200 bg-white'
                            : style.bg
                        )}
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5 shrink-0">{style.icon}</div>
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-start justify-between gap-2">
                              <h4 className="text-sm text-gray-900">
                                {notification.title}
                              </h4>
                              <button
                                onClick={() =>
                                  deleteNotification(notification.id)
                                }
                                className="rounded p-1 transition-colors hover:bg-white/50"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                              </button>
                            </div>
                            <p className="mb-2 text-xs text-gray-600">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(notification.time)}</span>
                              </div>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-[10px] text-blue-600 transition-colors hover:text-blue-700"
                                >
                                  ทำเครื่องหมายว่าอ่านแล้ว
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
