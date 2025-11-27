import { MapPin, Phone, Users, Bed, Utensils, Heart, Accessibility, Dog, Clock, CheckCircle, AlertCircle, Search, Filter, Share2 } from 'lucide-react';
import { useState } from 'react';

interface Shelter {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  capacity: number;
  currentOccupancy: number;
  status: 'available' | 'limited' | 'full';
  facilities: string[];
  hours: string;
}

const mockShelters: Shelter[] = [
  {
    id: '1',
    name: 'ศูนย์พักพิงวัดประยุรวงศาวาส',
    location: 'เขตบางกอกใหญ่',
    address: '24 ถนนประยูรวงศ์ แขวงวัดท่าพระ',
    phone: '02-412-7777',
    capacity: 200,
    currentOccupancy: 145,
    status: 'available',
    facilities: ['พื้นที่นอน', 'อาหาร-น้ำ', 'ห้องน้ำ', 'ที่จอดรถ', 'รองรับผู้พิการ', 'รองรับสัตว์เลี้ยง'],
    hours: 'เปิด 24 ชั่วโมง'
  },
  {
    id: '2',
    name: 'โรงเรียนวัดราชบพิธ',
    location: 'เขตพระนคร',
    address: '2 ถนนหมอชิต แขวงบางซื่อ',
    phone: '02-278-5555',
    capacity: 150,
    currentOccupancy: 128,
    status: 'limited',
    facilities: ['พื้นที่นอน', 'อาหาร-น้ำ', 'ห้องน้ำ', 'รองรับผู้พิการ'],
    hours: 'เปิด 24 ชั่วโมง'
  },
  {
    id: '3',
    name: 'หอประชุมเขตบางกอกน้อย',
    location: 'เขตบางกอกน้อย',
    address: '333 ถนนอรุณอมรินทร์ แขวงบางขุนนนท์',
    phone: '02-424-3333',
    capacity: 100,
    currentOccupancy: 100,
    status: 'full',
    facilities: ['พื้นที่นอน', 'อาหาร-น้ำ', 'ห้องน้ำ'],
    hours: 'เปิด 24 ชั่วโมง'
  },
  {
    id: '4',
    name: 'ศูนย์กีฬาเขตคลองสาน',
    location: 'เขตคลองสาน',
    address: '456 ถนนสมเด็จพระเจ้าตากสิน แขวงคลองต้นไทร',
    phone: '02-437-8888',
    capacity: 250,
    currentOccupancy: 89,
    status: 'available',
    facilities: ['พื้นที่นอน', 'อาหาร-น้ำ', 'ห้องน้ำ', 'ห้องอาบน้ำ', 'ที่จอดรถ', 'รองรับผู้พิการ', 'รองรับสัตว์เลี้ยง', 'ห้องพยาบาล'],
    hours: 'เปิด 24 ชั่วโมง'
  },
  {
    id: '5',
    name: 'วัดปากน้ำภาษีเจริญ',
    location: 'เขตภาษีเจริญ',
    address: '789 ถนนภาษีเจริญ แขวงปากคลองภาษีเจริญ',
    phone: '02-455-2222',
    capacity: 120,
    currentOccupancy: 67,
    status: 'available',
    facilities: ['พื้นที่นอน', 'อาหาร-น้ำ', 'ห้องน้ำ', 'รองรับผู้สูงอายุ'],
    hours: 'เปิด 24 ชั่วโมง'
  }
];

const facilityIcons: Record<string, any> = {
  'พื้นที่นอน': Bed,
  'อาหาร-น้ำ': Utensils,
  'รองรับผู้พิการ': Accessibility,
  'รองรับสัตว์เลี้ยง': Dog,
  'รองรับผู้สูงอายุ': Heart,
};

export function SheltersList() {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'available' | 'limited' | 'full'>('all');

  const filteredShelters = selectedStatus === 'all' 
    ? mockShelters 
    : mockShelters.filter(s => s.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    if (status === 'available') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-50 border border-green-200">
          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs text-green-700">ว่าง</span>
        </span>
      );
    } else if (status === 'limited') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-50 border border-orange-200">
          <AlertCircle className="w-3.5 h-3.5 text-orange-600" />
          <span className="text-xs text-orange-700">ใกล้เต็ม</span>
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-50 border border-red-200">
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          <span className="text-xs text-red-700">เต็ม</span>
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <Bed className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">ศูนย์พักพิง</h2>
            <p className="text-sm text-gray-500">รายการศูนย์พักพิงที่เปิดให้บริการ</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
              selectedStatus === 'all'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ทั้งหมด ({mockShelters.length})
          </button>
          <button
            onClick={() => setSelectedStatus('available')}
            className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
              selectedStatus === 'available'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ว่าง ({mockShelters.filter(s => s.status === 'available').length})
          </button>
          <button
            onClick={() => setSelectedStatus('limited')}
            className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
              selectedStatus === 'limited'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ใกล้เต็ม ({mockShelters.filter(s => s.status === 'limited').length})
          </button>
          <button
            onClick={() => setSelectedStatus('full')}
            className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
              selectedStatus === 'full'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            เต็ม ({mockShelters.filter(s => s.status === 'full').length})
          </button>
        </div>
      </div>

      {/* Shelters List */}
      <div className="space-y-4">
        {filteredShelters.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Bed className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">ไม่พบศูนย์พักพิง</p>
          </div>
        ) : (
          filteredShelters.map((shelter) => {
            const occupancyPercent = (shelter.currentOccupancy / shelter.capacity) * 100;

            return (
              <div key={shelter.id} className="bg-white border border-gray-200 rounded-lg p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-gray-900 mb-1">{shelter.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{shelter.location}</span>
                    </div>
                  </div>
                  {getStatusBadge(shelter.status)}
                </div>

                {/* Address */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1">ที่อยู่</div>
                  <div className="text-sm text-gray-900">{shelter.address}</div>
                </div>

                {/* Capacity */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Users className="w-4 h-4" />
                      <span>ความจุ</span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {shelter.currentOccupancy}/{shelter.capacity} คน
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        shelter.status === 'available' ? 'bg-green-500' :
                        shelter.status === 'limited' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${occupancyPercent}%` }}
                    />
                  </div>
                </div>

                {/* Facilities */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2">สิ่งอำนวยความสะดวก</div>
                  <div className="flex flex-wrap gap-2">
                    {shelter.facilities.map((facility) => {
                      const Icon = facilityIcons[facility];
                      return (
                        <span 
                          key={facility}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-50 border border-gray-200 text-xs text-gray-700"
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          {facility}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Hours & Contact */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{shelter.hours}</span>
                  </div>
                  <a 
                    href={`tel:${shelter.phone}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    <span>โทร</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Emergency Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="text-gray-900 mb-1">หมายเหตุ</p>
            <p className="text-xs text-gray-600">
              ข้อมูลอาจเปลี่ยนแปลงได้ กรุณาโทรสอบถามก่อนเดินทาง หรือในกรณีฉุกเฉินโทร 191 หรือ 1669
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}