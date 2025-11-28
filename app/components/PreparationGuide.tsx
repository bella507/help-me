import { useState } from 'react';
import {
  BookOpen,
  Package,
  Heart,
  Home,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  items: {
    category: string;
    list: string[];
  }[];
}

const guideSections: GuideSection[] = [
  {
    id: 'emergency-kit',
    title: 'ชุดอุปกรณ์ฉุกเฉิน',
    icon: Package,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    items: [
      {
        category: 'อุปกรณ์พื้นฐาน',
        list: [
          'น้ำดื่มสำรอง 3 ลิตรต่อคนต่อวัน (อย่างน้อย 3 วัน)',
          'อาหารกระป๋อง อาหารแห้งที่เก็บได้นาน',
          'ไฟฉาย และถ่านสำรอง',
          'วิทยุพกพา แบบใช้ถ่านหรือชาร์จมือหมุน',
          'เพาเวอร์แบงค์ และสายชาร์จโทรศัพท์',
          'นหมือกรท้องถนนลำพงัสกและกรรไกร',
        ],
      },
      {
        category: 'เอกสารสำคัญ',
        list: [
          'สำเนาบัตรประชาชน ทะเบียนบ้าน',
          'เอกสารสิทธิ์ที่ดิน สัญญาเช่า',
          'กรมธรรม์ประกัน เอกสารทางการเงิน',
          'ใบรับรองแพทย์ ประวัติการรักษา',
          'เก็บในถุงกันน้ำหรือถ่ายรูปเก็บไว้ในมือถือ',
        ],
      },
      {
        category: 'เครื่องมือและอุปกรณ์',
        list: [
          'นกหวีดสำหรับขอความช่วยเหลือ',
          'ผ้าใบกันน้ำ เชือก',
          'ถุงมือยาง หน้ากากอนามัย',
          'ถุงขยะขนาดใหญ่',
          'แผนที่ท้องถิ่น',
        ],
      },
    ],
  },
  {
    id: 'first-aid',
    title: 'ปฐมพยาบาลเบื้องต้น',
    icon: Heart,
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    items: [
      {
        category: 'อุปกรณ์ปฐมพยาบาล',
        list: [
          'ผ้าพันแผล แผ่นก๊อซ พลาสเตอร์',
          'ผ้าสามเหลี่ยม ผ้ายืด',
          'ยาแก้ปวด ลดไข้ (พาราเซตามอล)',
          'ยาประจำตัว (โรคประจำตัว)',
          'น้ำยาฆ่าเชื้อ แอลกอฮอล์',
          'คีมปากแบน กรรไกร เข็มหมุด',
          'เทอร์โมมิเตอร์วัดไข้',
        ],
      },
      {
        category: 'การปฐมพยาบาลเบื้องต้น',
        list: [
          'แผลถลอก: ล้างน้ำสะอาด ป้ายยาฆ่าเชื้อ ปิดแผล',
          'เลือดกำเดาไหล: นั่งพิงหลัง ก้มหน้า กดปีกจมูก',
          'ไฟไหม้: ล้างน้ำเย็น ปิดแผลแบบชุ่มชื้น',
          'สำลัก: ตบหลัง 5 ครั้ง กดช่วยหายใจ (Heimlich)',
          'หมดสติ: นอนตะแคง เรียกความช่วยเหลือ ตรวจลมหายใจ',
          'กระดูกหัก: ห้ามขยับ ดามข้อที่หักก่อนเคลื่อนย้าย',
        ],
      },
      {
        category: 'ข้อควรระวัง',
        list: [
          'ไม่ให้น้ำหรืออาหารคนที่หมดสติ',
          'ไม่ถอนของแทงที่ตำหรือบาดลึก',
          'ไม่ทายาสีหรือสารต่างๆ กับแผลไหม้',
          'โทรเรียก 1669 ทันทีในกรณีฉุกเฉินรุนแรง',
        ],
      },
    ],
  },
  {
    id: 'evacuation',
    title: 'แนวทางการอพยพ',
    icon: Home,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    items: [
      {
        category: 'เตรียมตัวก่อนอพยพ',
        list: [
          'จัดเตรียมกระเป๋าฉุกเฉินไว้ล่วงหน้า',
          'วางแผนเส้นทางอพยพอย่างน้อย 2 เส้นทาง',
          'กำหนดจุดนัดพบครอบครัว',
          'จดเบอร์โทรฉุกเฉินและญาติติดตัวไว้',
          'เตรีย���รถยนต์ให้พร้อมใช้งาน เติมน้ำมันเต็มถัง',
        ],
      },
      {
        category: 'ขั้นตอนการอพยพ',
        list: [
          'รับฟังประกาศจากหน่วยงานราชการ',
          'ปิดก๊าซ ไฟฟ้า น้ำประปา',
          'ล็อกประตูหน้าต่างทั้งหมด',
          'นำเอกสารสำคัญและทรัพย์สินมีค่าติดตัว',
          'แจ้งเพื่อนบ้านและญาติว่ากำลังอพยพ',
          'ไปยังศูนย์พักพิงตามที่กำหนด',
        ],
      },
      {
        category: 'ข้อควรปฏิบัติ',
        list: [
          'ปฏิบัติตามคำแนะนำของเจ้าหน้าที่',
          'ไม่กลับเข้าบ้านจนกว่าจะปลอดภัย',
          'ช่วยเหลือผู้สูงอายุ เด็ก และผู้พิการ',
          'นำสัตว์เลี้ยงไปด้วยถ้าทำได้',
          'รักษาความสงบ ไม่ตื่นตระหนก',
        ],
      },
    ],
  },
  {
    id: 'shelter-living',
    title: 'การอยู่ศูนย์พักพิง',
    icon: AlertTriangle,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    items: [
      {
        category: 'สิ่งที่ควรนำติดตัว',
        list: [
          'เสื้อผ้าสำรอง ผ้าห่ม หมอน',
          'อุปกรณ์ส่วนตัว แปรงสีฟัน สบู่',
          'ยาประจำตัวพร้อมใบสั่งยา',
          'อุปกรณ์สำหรับทารกและเด็กเล็ก',
          'อาหารสำหรับผู้ที่มีข้อจำกัดด้านอาหาร',
        ],
      },
      {
        category: 'ข้อปฏิบัติในศูนย์พักพิง',
        list: [
          'ลงทะเบียนกับเจ้าหน้าที่ทันที',
          'ปฏิบัติตามกฎระเบียบของศูนย์',
          'รักษาความสะอาดส่วนรวม',
          'ร่วมมือช่วยเหลือผู้อื่นตามความสามารถ',
          'แจ้งเจ้าหน้าที่หากมีปัญหาสุขภาพ',
          'เก็บของมีค่าไว้กับตัว',
        ],
      },
      {
        category: 'การดูแลสุขภาพ',
        list: [
          'ล้างมือบ่อยๆ ก่อนรับประทานอาหาร',
          'สวมหน้ากากอนามัยเมื่ออยู่รวมกลุ่ม',
          'รับประทานอาหารที่สุกใหม่เท่านั้น',
          'ดื่มน้ำสะอาดเพียงพอ',
          'ออกกำลังกายเบาๆ ภายในศูนย์',
          'พักผ่อนให้เพียงพอ จัดการความเครียด',
        ],
      },
    ],
  },
];

export function PreparationGuide() {
  const [activeSection, setActiveSection] = useState<string>('emergency-kit');

  const currentSection = guideSections.find(s => s.id === activeSection);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="bg-primary/10 p-2 sm:p-2.5 rounded-lg">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">คู่มือเตรียมพร้อม</h2>
            <p className="text-xs sm:text-sm text-gray-500">
              แนวทางเตรียมตัวและรับมือภัยพิบัติ
            </p>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
        <div className="grid grid-cols-2 gap-2">
          {guideSections.map(section => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 p-2.5 sm:p-3 rounded-lg border-2 transition-all text-left ${
                  activeSection === section.id
                    ? `${section.borderColor} ${section.bgColor} ${section.color}`
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="text-xs sm:text-sm">{section.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {currentSection && (
        <div className="space-y-3 sm:space-y-4">
          {currentSection.items.map((item, idx) => (
            <div
              key={idx}
              className={`bg-white border ${currentSection.borderColor} rounded-lg p-4 sm:p-5`}
            >
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <CheckCircle2
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${currentSection.color}`}
                />
                <h3 className="text-gray-900 text-sm sm:text-base">
                  {item.category}
                </h3>
              </div>
              <ul className="space-y-1.5 sm:space-y-2">
                {item.list.map((listItem, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs sm:text-sm text-gray-600"
                  >
                    <span className="text-gray-400 mt-0.5 sm:mt-1">•</span>
                    <span>{listItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Important Notice */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 sm:p-4">
        <div className="flex gap-2 sm:gap-3">
          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-gray-700">
            <p className="text-gray-900 mb-1">ข้อควรจำ</p>
            <p className="text-[10px] sm:text-xs text-gray-600">
              ตรวจสอบและปรับปรุงอุปกรณ์ฉุกเฉินทุก 6 เดือน •
              เปลี่ยนน้ำดื่มและอาหารที่หมดอายุ • ทบทวนแผนอพยพกับคนในครอบครัว •
              เก็บชุดฉุกเฉินในที่หยิบง่าย
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
