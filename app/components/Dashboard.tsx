import { useState, useEffect } from 'react';
import { BarChart3, Users, AlertCircle, CheckCircle2, Clock, TrendingUp, MapPin, Package } from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    volunteers: 0,
    shelters: 0,
    urgentRequests: 0
  });

  const [categoryStats, setCategoryStats] = useState<Record<string, number>>({});
  const [areaStats, setAreaStats] = useState<Array<{ area: string; count: number }>>([]);

  useEffect(() => {
    const loadStats = () => {
      // Load requests
      const requests = JSON.parse(localStorage.getItem('helpRequests') || '[]');
      const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
      
      // Calculate stats
      const pending = requests.filter((r: any) => r.status === 'pending').length;
      const processing = requests.filter((r: any) => r.status === 'in-progress').length;
      const completed = requests.filter((r: any) => r.status === 'completed').length;
      const urgent = requests.filter((r: any) => r.urgency === 'high').length;

      setStats({
        totalRequests: requests.length,
        pending,
        processing,
        completed,
        volunteers: volunteers.length,
        shelters: 5, // From mock data
        urgentRequests: urgent
      });

      // Category breakdown
      const categories: Record<string, number> = {};
      requests.forEach((req: any) => {
        categories[req.category] = (categories[req.category] || 0) + 1;
      });
      setCategoryStats(categories);

      // Area breakdown
      const areas: Record<string, number> = {};
      requests.forEach((req: any) => {
        areas[req.location] = (areas[req.location] || 0) + 1;
      });
      const sortedAreas = Object.entries(areas)
        .map(([area, count]) => ({ area, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setAreaStats(sortedAreas);
    };

    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const categoryLabels: Record<string, string> = {
    'food': 'อาหารและน้ำดื่ม',
    'shelter': 'ที่พักพิง',
    'medical': 'การรักษาพยาบาล',
    'clothing': 'เสื้อผ้า',
    'evacuation': 'ขอการอพยพ',
    'other': 'อื่นๆ'
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg">
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">แดชบอร์ดภาพรวม</h2>
            <p className="text-xs sm:text-sm text-gray-500">สถิติและข้อมูลสรุป</p>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="bg-blue-50 p-2 rounded-lg">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="text-xs sm:text-sm text-gray-600">คำขอทั้งหมด</div>
          </div>
          <div className="text-2xl sm:text-3xl text-gray-900">{stats.totalRequests}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">รายการ</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="bg-orange-50 p-2 rounded-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div className="text-xs sm:text-sm text-gray-600">รอดำเนินการ</div>
          </div>
          <div className="text-2xl sm:text-3xl text-orange-600">{stats.pending}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">รายการ</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="bg-green-50 p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="text-xs sm:text-sm text-gray-600">สำเร็จแล้ว</div>
          </div>
          <div className="text-2xl sm:text-3xl text-green-600">{stats.completed}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">รายการ</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <div className="text-xs sm:text-sm text-gray-600">เร่งด่วน</div>
          </div>
          <div className="text-2xl sm:text-3xl text-red-600">{stats.urgentRequests}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">รายการ</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div className="text-xs sm:text-sm text-gray-600">อาสาสมัคร</div>
          </div>
          <div className="text-xl sm:text-2xl text-gray-900">{stats.volunteers}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">คน</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <div className="text-xs sm:text-sm text-gray-600">ศูนย์พักพิง</div>
          </div>
          <div className="text-xl sm:text-2xl text-gray-900">{stats.shelters}</div>
          <div className="text-[10px] sm:text-xs text-gray-500 mt-1">แห่ง</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
        <h3 className="text-gray-900 mb-3 sm:mb-4">สถานะคำขอ</h3>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-xs sm:text-sm text-gray-700">รอดำเนินการ</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-900">{stats.pending}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: stats.totalRequests > 0 ? `${(stats.pending / stats.totalRequests) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs sm:text-sm text-gray-700">กำลังดำเนินการ</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-900">{stats.processing}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: stats.totalRequests > 0 ? `${(stats.processing / stats.totalRequests) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs sm:text-sm text-gray-700">สำเร็จแล้ว</span>
              </div>
              <span className="text-xs sm:text-sm text-gray-900">{stats.completed}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: stats.totalRequests > 0 ? `${(stats.completed / stats.totalRequests) * 100}%` : '0%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
        <h3 className="text-gray-900 mb-3 sm:mb-4">ประเภทความช่วยเหลือ</h3>
        <div className="space-y-2 sm:space-y-3">
          {Object.entries(categoryStats).map(([category, count]) => (
            <div
              key={category}
              className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-600" />
                <span className="text-xs sm:text-sm text-gray-700">
                  {categoryLabels[category] || category}
                </span>
              </div>
              <span className="text-sm sm:text-base text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Areas */}
      {areaStats.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
          <h3 className="text-gray-900 mb-3 sm:mb-4">พื้นที่ที่ต้องการความช่วยเหลือมากสุด</h3>
          <div className="space-y-2 sm:space-y-3">
            {areaStats.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary/10 flex items-center justify-center text-xs sm:text-sm text-primary">
                    {idx + 1}
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700">{item.area}</span>
                </div>
                <span className="text-sm sm:text-base text-gray-900">{item.count} รายการ</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-blue-700">
            <p className="text-blue-900 mb-1">ข้อมูลอัพเดทแบบเรียลไทม์</p>
            <p className="text-[10px] sm:text-xs text-blue-600">
              ข้อมูลอัพเดทอัตโนมัติทุก 5 วินาที จากระบบ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}