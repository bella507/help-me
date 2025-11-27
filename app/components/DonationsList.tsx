import { useState, useEffect } from 'react';
import { Package, MapPin, TrendingUp, TrendingDown, Minus, AlertCircle } from 'lucide-react';

interface DonationItem {
  id: string;
  category: string;
  items: string[];
  urgency: 'high' | 'medium' | 'low';
  status: 'urgent' | 'needed' | 'sufficient';
}

interface DonationCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  acceptedItems: string[];
}

const donationNeeds: DonationItem[] = [
  {
    id: '1',
    category: 'อาหารและเครื่องดื่ม',
    items: ['น้ำดื่ม', 'อาหารกระป๋อง', 'มาม่า บะหมี่กึ่งสำเร็จรูป', 'ขนมโปรตีน', 'นมกล่อง'],
    urgency: 'high',
    status: 'urgent'
  },
  {
    id: '2',
    category: 'เสื้อผ้าและผ้าห่ม',
    items: ['เสื้อผ้าสะอาด', 'ผ้าห่ม', 'หมอน', 'ผ้าเช็ดตัว', 'รองเท้า'],
    urgency: 'high',
    status: 'urgent'
  },
  {
    id: '3',
    category: 'ยาและเวชภัณฑ์',
    items: ['ยาพื้นฐาน', 'พลาสเตอร์', 'แอลกอฮอล์', 'หน้ากากอนามัย', 'ผ���าก๊อซ'],
    urgency: 'high',
    status: 'urgent'
  },
  {
    id: '4',
    category: 'อุปกรณ์ทำความสะอาด',
    items: ['สบู่', 'ยาสีฟัน', 'แปรงสีฟัน', 'แชมพู', 'ผงซักฟอก'],
    urgency: 'medium',
    status: 'needed'
  },
  {
    id: '5',
    category: 'อุปกรณ์สำหรับเด็ก',
    items: ['นมผง', 'ผ้าอ้อม', 'ขวดนม', 'อาหารเด็ก', 'ของเล่น'],
    urgency: 'medium',
    status: 'needed'
  },
  {
    id: '6',
    category: 'อุปกรณ์ไฟฟ้า',
    items: ['ไฟฉาย', 'ถ่าน', 'เพาเวอร์แบงค์', 'สายชาร์จ', 'พัดลมพกพา'],
    urgency: 'medium',
    status: 'needed'
  },
  {
    id: '7',
    category: 'เครื่องใช้ในบ้าน',
    items: ['แก้วน้ำ', 'จานชาม', 'ช้อนส้อม', 'กระติกน้ำ', 'ถังน้ำ'],
    urgency: 'low',
    status: 'sufficient'
  },
  {
    id: '8',
    category: 'อุปกรณ์การเรียน',
    items: ['สมุด', 'ปากกา', 'ดินสอ', 'สีเขียน', 'กระเป๋านักเรียน'],
    urgency: 'low',
    status: 'sufficient'
  }
];

const donationCenters: DonationCenter[] = [
  {
    id: '1',
    name: 'ศูนย์รับบริจาคกรุงเทพฯ 1',
    address: 'ศาลาว่าการกรุงเทพมหานคร ถนนดินสอ เขตพระนคร',
    phone: '02-224-1234',
    hours: 'ทุกวัน 08:00 - 20:00 น.',
    acceptedItems: ['ทุกประเภท']
  },
  {
    id: '2',
    name: 'ศูนย์รับบริจาคกรุงเทพฯ 2',
    address: 'สำนักงานเขตบางรัก ถนนสีลม',
    phone: '02-234-5678',
    hours: 'ทุกวัน 08:00 - 18:00 น.',
    acceptedItems: ['อาหาร', 'เสื้อผ้า', 'ยา']
  },
  {
    id: '3',
    name: 'ศูนย์รับบริจาคกรุงเทพฯ 3',
    address: 'สนามกีฬาแห่งชาติ ถนนพระราม 1',
    phone: '02-214-0111',
    hours: 'ทุกวัน 24 ชั่วโมง',
    acceptedItems: ['ทุกประเภท']
  },
  {
    id: '4',
    name: 'ศูนย์รับบริจาคกรุงเทพฯ 4',
    address: 'ศูนย์การค้าเซ็นทรัลเวิลด์ ถนนราชดำริ',
    phone: '02-613-1111',
    hours: 'ทุกวัน 10:00 - 22:00 น.',
    acceptedItems: ['อาหาร', 'อุปกรณ์ไฟฟ้า']
  }
];

export function DonationsList() {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'needed' | 'sufficient'>('all');

  const getStatusBadge = (status: string) => {
    if (status === 'urgent') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-50 border border-red-200">
          <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />
          <span className="text-[10px] sm:text-xs text-red-700">ขาดมาก</span>
        </div>
      );
    } else if (status === 'needed') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-orange-50 border border-orange-200">
          <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-600" />
          <span className="text-[10px] sm:text-xs text-orange-700">ต้องการ</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-50 border border-green-200">
        <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
        <span className="text-[10px] sm:text-xs text-green-700">เพียงพอ</span>
      </div>
    );
  };

  const filteredItems = filter === 'all' 
    ? donationNeeds 
    : donationNeeds.filter(item => item.status === filter);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg">
            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">รายการของบริจาค</h2>
            <p className="text-xs sm:text-sm text-gray-500">สิ่งของที่ต้องการและจุดรับบริจาค</p>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
              filter === 'all'
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ทั้งหมด
          </button>
          <button
            onClick={() => setFilter('urgent')}
            className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
              filter === 'urgent'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ขาดมาก
          </button>
          <button
            onClick={() => setFilter('needed')}
            className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
              filter === 'needed'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            ต้องการ
          </button>
          <button
            onClick={() => setFilter('sufficient')}
            className={`px-2.5 sm:px-3 py-1.5 rounded text-[10px] sm:text-xs border-2 transition-all ${
              filter === 'sufficient'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            เพียงพอ
          </button>
        </div>
      </div>

      {/* Donation Needs */}
      <div className="space-y-2 sm:space-y-3">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
              <h3 className="text-sm sm:text-base text-gray-900">{item.category}</h3>
              {getStatusBadge(item.status)}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {item.items.map((subItem, idx) => (
                <span
                  key={idx}
                  className="px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-50 rounded text-[10px] sm:text-xs text-gray-700 border border-gray-200"
                >
                  {subItem}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Donation Centers */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h3 className="text-sm sm:text-base text-gray-900">จุดรับบริจาค</h3>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {donationCenters.map((center) => (
            <div
              key={center.id}
              className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4"
            >
              <h4 className="text-sm sm:text-base text-gray-900 mb-2">{center.name}</h4>
              <div className="space-y-1.5 text-xs sm:text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                  <span>{center.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>รับบริจาค: {center.acceptedItems.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
                  <span>⏰ {center.hours}</span>
                </div>
              </div>
              <a
                href={`tel:${center.phone}`}
                className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors text-xs sm:text-sm"
              >
                <span>โทร {center.phone}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-gray-700">
            <p className="text-gray-900 mb-1">แนวทางการบริจาค</p>
            <ul className="text-[10px] sm:text-xs text-gray-600 space-y-1 list-disc list-inside">
              <li>บริจาคเฉพาะของที่อยู่ในสภาพดี สะอาด ใช้งานได้</li>
              <li>อาหารและยาต้องไม่หมดอายุ ระบุวันหมดอายุชัดเจน</li>
              <li>เสื้อผ้าควรซักสะอาดก่อนบริจาค</li>
              <li>ติดต่อศูนย์รับบริจาคก่อนหากมีของจำนวนมาก</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}