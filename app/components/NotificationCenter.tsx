import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Clock, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    // Load notifications
    const stored = localStorage.getItem('notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      // Initial notifications
      const initialNotifications: Notification[] = [
        {
          id: '1',
          type: 'success',
          title: 'ได้รับคำขอของคุณแล้ว',
          message: 'ทีมงานกำลังตรวจสอบและจะติดต่อกลับโดยเร็ว',
          time: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: '2',
          type: 'warning',
          title: 'เตือนฝนตกหนัก',
          message: 'พื้นที่กรุงเทพฯ คาดว่า���ะมีฝนตกหนักในช่วง 18:00-22:00 น.',
          time: new Date(Date.now() - 7200000).toISOString(),
          read: false
        },
        {
          id: '3',
          type: 'info',
          title: 'ศูนย์พักพิงใหม่เปิดให้บริการ',
          message: 'ศูนย์กีฬาเขตคลองสาน เปิดให้บริการแล้ว รองรับได้ 250 คน',
          time: new Date(Date.now() - 86400000).toISOString(),
          read: true
        }
      ];
      setNotifications(initialNotifications);
      localStorage.setItem('notifications', JSON.stringify(initialNotifications));
    }

    // Simulate new notifications
    const interval = setInterval(() => {
      const randomChance = Math.random();
      if (randomChance < 0.1) { // 10% chance every 30 seconds
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: randomChance < 0.03 ? 'warning' : randomChance < 0.06 ? 'success' : 'info',
          title: randomChance < 0.03 
            ? 'อัพเดทสถานการณ์' 
            : randomChance < 0.06 
            ? 'สถานะคำขอเปลี่ยนแปลง'
            : 'ข้อมูลใหม่',
          message: randomChance < 0.03
            ? 'มีพื้นที่เสี่ยงเพิ่มขึ้น กรุณาติดตามสถานการณ์'
            : randomChance < 0.06
            ? 'คำขอของคุณกำลังดำเนินการ'
            : 'มีข่าวสารและประกาศใหม่',
          time: new Date().toISOString(),
          read: false
        };

        setNotifications(prev => {
          const updated = [newNotification, ...prev];
          localStorage.setItem('notifications', JSON.stringify(updated));
          return updated;
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-orange-50 border-orange-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (timeString: string) => {
    const now = new Date();
    const time = new Date(timeString);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'เมื่อสักครู่';
    if (diffMins < 60) return `${diffMins} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return time.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 sm:p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed top-16 sm:top-20 right-4 sm:right-6 lg:right-8 z-[70] w-[calc(100%-2rem)] sm:w-96 max-h-[70vh] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-700" />
                  <h3 className="text-base text-gray-900">การแจ้งเตือน</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {notifications.length > 0 && (
                <div className="flex gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      อ่านทั้งหมด
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-600 hover:text-red-700 transition-colors"
                  >
                    ลบทั้งหมด
                  </button>
                </div>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[calc(70vh-80px)]">
              {notifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">ไม่มีการแจ้งเตือน</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`relative p-3 mb-2 rounded-lg border transition-all ${
                        notification.read 
                          ? 'bg-white border-gray-200' 
                          : `${getBgColor(notification.type)}`
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className="text-sm text-gray-900">
                              {notification.title}
                            </h4>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-white/50 rounded transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{formatTime(notification.time)}</span>
                            </div>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-[10px] text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                ทำเครื่องหมายว่าอ่านแล้ว
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
