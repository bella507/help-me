import { useState } from 'react';
import { AlertTriangle, MapPin, Droplets, Flame, Wind, Zap } from 'lucide-react';

interface RiskArea {
  id: string;
  area: string;
  district: string;
  riskType: string[];
  riskLevel: 'high' | 'medium' | 'low';
  warnings: string[];
  recommendations: string[];
}

const riskAreas: RiskArea[] = [
  {
    id: '1',
    area: 'บริเวณริมแม่น้ำเจ้าพระยา',
    district: 'พระนคร, บางกอกใหญ่, บางกอกน้อย, คลองสาน',
    riskType: ['flood'],
    riskLevel: 'high',
    warnings: [
      'พื้นที่เสี่ยงน้ำท่วมสูงในช่วงฤดูฝน',
      'ระดับน้ำสูงขึ้นอย่างรวดเร็วเมื่อฝนตกหนัก',
      'คลื่นลมแรงจากเรือขนาดใหญ่'
    ],
    recommendations: [
      'เตรียมถุงทรายและอุปกรณ์ป้องกันน้ำท่วม',
      'ติดตามข่าวสารพยากรณ์อากาศ',
      'เตรียมแผนอพยพฉุกเฉิน',
      'ยกของมีค่าไว้ที่สูง'
    ]
  },
  {
    id: '2',
    area: 'ชุมชนแออัด',
    district: 'คลองเตย, ดินแดง, ป้อมปราบศัตรูพ่าย',
    riskType: ['fire'],
    riskLevel: 'high',
    warnings: [
      'ความเสี่ยงไฟไหม้สูงเนื่องจากบ้านติดกันหนาแน่น',
      'ทางผ่านแคบ รถดับเพลิงเข้าถึงยาก',
      'สายไฟฟ้าพาดผ่านหนาแน่น'
    ],
    recommendations: [
      'ติดตั้งเครื่องดับเพลิงในบ้าน',
      'ตรวจสอบระบบไฟฟ้าเป็นประจำ',
      'จัดทำแผนการหนีไฟ',
      'ไม่จุดเทียน จุดธูปในที่อับอากาศ'
    ]
  },
  {
    id: '3',
    area: 'พื้นที่ลุ่ม',
    district: 'มีนบุรี, หนองจอก, คลองสามวา, ลาดกระบัง',
    riskType: ['flood'],
    riskLevel: 'medium',
    warnings: [
      'น้ำขังนานหลังฝนตกหนัก',
      'ระบบระบายน้ำไม่เพียงพอ',
      'ระดับพื้นที่ต่ำกว่าคลอง'
    ],
    recommendations: [
      'เตรียมเครื่องสูบน้ำ',
      'ทำระบบระบายน้ำรอบบ้าน',
      'หลีกเลี่ยงขับรถผ่านน้ำท่วมลึก',
      'เก็บรักษารองเท้าบู๊ทและเสื้อกันฝน'
    ]
  },
  {
    id: '4',
    area: 'พื้นที่ใกล้ท่อประปาใหญ่',
    district: 'จตุจักร, ห้วยขวาง, ดินแดง',
    riskType: ['infrastructure'],
    riskLevel: 'medium',
    warnings: [
      'ท่อประปาแตกทำให้ถนนทรุด',
      'น้ำประปาขาดโดยกะทันหัน',
      'การจราจรติดขัด'
    ],
    recommendations: [
      'สำรองน้ำดื่มและน้ำใช้',
      'ติดตามข่าวซ่อมบำรุง',
      'หลีกเลี่ยงเดินผ่านพื้นที่ทรุดตัว'
    ]
  },
  {
    id: '5',
    area: 'พื้นที่ใกล้สายไฟฟ้าแรงสูง',
    district: 'บางซื่อ, ดอนเมือง, หลักสี่',
    riskType: ['electric'],
    riskLevel: 'medium',
    warnings: [
      'อันตรายจากไฟฟ้าแรงสูง',
      'เสาไฟฟ้าล้มในช่วงพายุ',
      'ไฟฟ้ารั่วในพื้นที่น้ำท่วม'
    ],
    recommendations: [
      'ห้ามเข้าใกล้เสาไฟฟ้าแรงสูง',
      'แจ้งการไฟฟ้าทันทีหากเห็นสายไฟขาด',
      'ตัดไฟก่อนเข้าบ้านที่น้ำท่วม'
    ]
  },
  {
    id: '6',
    area: 'พื้นที่เสี่ยงพายุ',
    district: 'ดอนเมือง, สายไหม, หลักสี่, บางเขน',
    riskType: ['storm'],
    riskLevel: 'low',
    warnings: [
      'ลมแรงในช่วงเปลี่ยนฤดู',
      'ป้ายโฆษณาขนาดใหญ่อาจหลุดร่วง',
      'ต้นไม้ใหญ่อาจล้ม'
    ],
    recommendations: [
      'ตรึงของวางบนหลังคา',
      'หลีกเลี่ยงจอดรถใต้ป้ายหรือต้นไม้',
      'ติดตามพยากรณ์อากาศ',
      'เก็บของที่อาจปลิวได้เข้าบ้าน'
    ]
  }
];

const riskTypeInfo = {
  flood: { label: 'น้ำท่วม', icon: Droplets, color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  fire: { label: 'ไฟไหม้', icon: Flame, color: 'text-red-700', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  storm: { label: 'พายุ', icon: Wind, color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' },
  electric: { label: 'ไฟฟ้า', icon: Zap, color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  infrastructure: { label: 'โครงสร้าง', icon: AlertTriangle, color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
};

export function RiskAreas() {
  const [filterLevel, setFilterLevel] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const getRiskLevelBadge = (level: string) => {
    if (level === 'high') {
      return <span className="px-2 py-0.5 rounded text-xs bg-red-100 text-red-700 border border-red-200">เสี่ยงสูง</span>;
    } else if (level === 'medium') {
      return <span className="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700 border border-orange-200">เสี่ยงปานกลาง</span>;
    }
    return <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-700 border border-green-200">เสี่ยงต่ำ</span>;
  };

  const filteredAreas = riskAreas.filter(area => {
    if (filterLevel !== 'all' && area.riskLevel !== filterLevel) return false;
    if (filterType !== 'all' && !area.riskType.includes(filterType)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">พื้นที่เสี่ยง</h2>
            <p className="text-sm text-gray-500">ข้อมูลพื้นที่เสี่ยงภัยและคำแนะนำ</p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-600 mb-2">ระดับความเสี่ยง</div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterLevel('all')}
                className={`px-3 py-1.5 rounded text-xs border-2 transition-all ${
                  filterLevel === 'all'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setFilterLevel('high')}
                className={`px-3 py-1.5 rounded text-xs border-2 transition-all ${
                  filterLevel === 'high'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                เสี่ยงสูง
              </button>
              <button
                onClick={() => setFilterLevel('medium')}
                className={`px-3 py-1.5 rounded text-xs border-2 transition-all ${
                  filterLevel === 'medium'
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                เสี่ยงปานกลาง
              </button>
              <button
                onClick={() => setFilterLevel('low')}
                className={`px-3 py-1.5 rounded text-xs border-2 transition-all ${
                  filterLevel === 'low'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                เสี่ยงต่ำ
              </button>
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-600 mb-2">ประเภทภัย</div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded text-xs border-2 transition-all ${
                  filterType === 'all'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                ทั้งหมด
              </button>
              {Object.entries(riskTypeInfo).map(([key, info]) => (
                <button
                  key={key}
                  onClick={() => setFilterType(key)}
                  className={`px-3 py-1.5 rounded text-xs border-2 transition-all ${
                    filterType === key
                      ? `${info.borderColor} ${info.bgColor} ${info.color}`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {info.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Areas List */}
      <div className="space-y-3">
        {filteredAreas.map((area) => (
          <div
            key={area.id}
            className="bg-white border border-gray-200 rounded-lg p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
                <h3 className="text-gray-900">{area.area}</h3>
              </div>
              {getRiskLevelBadge(area.riskLevel)}
            </div>

            <div className="text-sm text-gray-600 mb-3">
              <span className="text-gray-500">เขต:</span> {area.district}
            </div>

            {/* Risk Types */}
            <div className="flex gap-2 mb-4">
              {area.riskType.map(type => {
                const info = riskTypeInfo[type as keyof typeof riskTypeInfo];
                const Icon = info.icon;
                return (
                  <div
                    key={type}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded ${info.bgColor} ${info.borderColor} border`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${info.color}`} />
                    <span className={`text-xs ${info.color}`}>{info.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Warnings */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-900">คำเตือน</span>
              </div>
              <ul className="space-y-1">
                {area.warnings.map((warning, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-red-700">
                    <span className="mt-1">•</span>
                    <span>{warning}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="text-sm text-green-900 mb-2">คำแนะนำ</div>
              <ul className="space-y-1">
                {area.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-green-700">
                    <span className="mt-1">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAreas.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">ไม่พบพื้นที่เสี่ยงตามเงื่อนไขที่เลือก</p>
        </div>
      )}

      {/* Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex gap-3">
          <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="text-gray-900 mb-1">ข้อควรระวัง</p>
            <p className="text-xs text-gray-600">
              ข้อมูลอัพเดทเป็นประจำ • ติดตามข่าวสารจากหน่วยงานท้องถิ่น • 
              เตรียมตัวล่วงหน้าก่อนฤดูฝน • โทร 1784 เพื่อสอบถามข้อมูลเพิ่มเติม
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
