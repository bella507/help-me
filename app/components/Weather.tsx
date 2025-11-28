import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

const weatherData = {
  current: {
    temp: 32,
    condition: 'ฝนฟ้าคะนอง',
    humidity: 78,
    windSpeed: 15,
    rainChance: 60,
    icon: CloudRain,
  },
  forecast: [
    {
      day: 'วันนี้',
      temp: 32,
      tempMin: 26,
      condition: 'ฝนฟ้าคะนอง',
      rainChance: 60,
      icon: CloudRain,
    },
    {
      day: 'พรุ่งนี้',
      temp: 33,
      tempMin: 27,
      condition: 'เมงมาก',
      rainChance: 40,
      icon: Cloud,
    },
    {
      day: 'มะรืนนี้',
      temp: 34,
      tempMin: 27,
      condition: 'แดดร้อน',
      rainChance: 20,
      icon: Sun,
    },
    {
      day: 'อาทิตย์',
      temp: 33,
      tempMin: 26,
      condition: 'ฝนฟ้าคะนอง',
      rainChance: 70,
      icon: CloudRain,
    },
    {
      day: 'จันทร์',
      temp: 32,
      tempMin: 25,
      condition: 'ฝนตลอดวัน',
      rainChance: 80,
      icon: CloudRain,
    },
    {
      day: 'อังคาร',
      temp: 31,
      tempMin: 25,
      condition: 'เมงมาก',
      rainChance: 50,
      icon: Cloud,
    },
    {
      day: 'พุธ',
      temp: 32,
      tempMin: 26,
      condition: 'แดดร้อน',
      rainChance: 30,
      icon: Sun,
    },
  ],
  alerts: [
    {
      level: 'warning',
      title: 'เตือนฝนตกหนัก',
      description:
        'พื้นที่กรุงเทพฯ และปริมณฑล คาดว่าจะมีฝนตกหนักถึงหนักมาก ในช่วง 18:00-22:00 น.',
      areas: ['พระนคร', 'บางกอกน้อย', 'ธนบุรี', 'คลองสาน'],
      time: '2 ชั่วโมงข้างหน้า',
    },
    {
      level: 'advisory',
      title: 'คำแนะนำ: ระวังน้ำท่วมฉับพลัน',
      description:
        'พื้นที่ลุ่มควรเตรียมพร้อมรับมือน้ำท่วมฉับพลัน โดยเฉพาะบริเวณที่มีระบบระบายน้ำไม่ดี',
      areas: ['ดินแดง', 'ห้วยขวาง', 'ลาดพร้าว', 'บางกะปิ'],
      time: 'วันนี้ - พรุ่งนี้',
    },
  ],
};

export function Weather() {
  const CurrentIcon = weatherData.current.icon;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg">
            <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">สภาพอากาศ</h2>
            <p className="text-xs sm:text-sm text-gray-500">กรุงเทพมหานคร</p>
          </div>
        </div>
      </div>

      {/* Current Weather */}
      <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-lg p-6 sm:p-8 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="text-5xl sm:text-6xl mb-2">
              {weatherData.current.temp}°
            </div>
            <div className="text-lg sm:text-xl opacity-90">
              {weatherData.current.condition}
            </div>
            <div className="text-sm opacity-75 mt-1">กรุงเทพมหานคร</div>
          </div>
          <CurrentIcon className="w-16 h-16 sm:w-20 sm:h-20 opacity-90" />
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <Droplets className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 opacity-75" />
            <div className="text-xs opacity-75 mb-1">ความชื้น</div>
            <div className="text-base sm:text-lg">
              {weatherData.current.humidity}%
            </div>
          </div>
          <div className="text-center">
            <Wind className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 opacity-75" />
            <div className="text-xs opacity-75 mb-1">ลม</div>
            <div className="text-base sm:text-lg">
              {weatherData.current.windSpeed} km/h
            </div>
          </div>
          <div className="text-center">
            <CloudRain className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 opacity-75" />
            <div className="text-xs opacity-75 mb-1">โอกาสฝน</div>
            <div className="text-base sm:text-lg">
              {weatherData.current.rainChance}%
            </div>
          </div>
        </div>
      </div>

      {/* Weather Alerts */}
      {weatherData.alerts.length > 0 && (
        <div className="space-y-3">
          {weatherData.alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-4 sm:p-5 border-2 ${
                alert.level === 'warning'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-orange-50 border-orange-200'
              }`}
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertTriangle
                  className={`w-5 h-5 sm:w-6 sm:h-6 shrink-0 ${
                    alert.level === 'warning'
                      ? 'text-red-600'
                      : 'text-orange-600'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className={`text-sm sm:text-base ${
                        alert.level === 'warning'
                          ? 'text-red-900'
                          : 'text-orange-900'
                      }`}
                    >
                      {alert.title}
                    </h3>
                    <span
                      className={`text-[10px] sm:text-xs whitespace-nowrap ${
                        alert.level === 'warning'
                          ? 'text-red-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {alert.time}
                    </span>
                  </div>
                  <p
                    className={`text-xs sm:text-sm mb-2 ${
                      alert.level === 'warning'
                        ? 'text-red-700'
                        : 'text-orange-700'
                    }`}
                  >
                    {alert.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {alert.areas.map((area, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded text-[10px] sm:text-xs ${
                          alert.level === 'warning'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7-Day Forecast */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5">
        <h3 className="text-gray-900 mb-3 sm:mb-4">พยากรณ์อากาศ 7 วัน</h3>
        <div className="space-y-2 sm:space-y-3">
          {weatherData.forecast.map((day, idx) => {
            const Icon = day.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-16 sm:w-20 text-xs sm:text-sm text-gray-700">
                    {day.day}
                  </div>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs sm:text-sm text-gray-900">
                      {day.condition}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                      <CloudRain className="w-3 h-3" />
                      {day.rainChance}%
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="flex items-center gap-1 text-sm sm:text-base text-gray-900">
                    <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500" />
                    {day.temp}°
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                    <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-500" />
                    {day.tempMin}°
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <Cloud className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-blue-700">
            <p className="text-blue-900 mb-1">ข้อมูลจากกรมอุตุนิยมวิทยา</p>
            <p className="text-[10px] sm:text-xs text-blue-600">
              ข้อมูลอัพเดทล่าสุด: วันนี้ 14:00 น. • อัพเดททุก 3 ชั่วโมง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
