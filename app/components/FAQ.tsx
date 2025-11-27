import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: '1',
    question: 'ใครมีสิทธิ์ขอความช่วยเหลือได้บ้าง?',
    answer: 'ผู้ที่ประสบภัยพิบัติทุกประเภท ไม่ว่าจะเป็นอุทกภัย อัคคีภัย แผ่นดินไหว หรือภัยอื่นๆ โดยไม่จำกัดสัญชาติ อายุ หรือสถานะทางสังคม สามารถขอความช่วยเหลือได้ทันที',
    category: 'สิทธิ์การขอความช่วยเหลือ'
  },
  {
    id: '2',
    question: 'ต้องเตรียมเอกสารอะไรบ้างเมื่อขอความช่วยเหลือ?',
    answer: 'กรณีฉุกเฉิน ไม่จำเป็นต้องมีเอกสาร สามารถแจ้งข้อมูลพื้นฐานได้ก่อน แต่หากสะดวก ควรมี: บัตรประชาชน, ทะเบียนบ้าน, เอกสารแสดงสถานที่อยู่ปัจจุบัน และหลักฐานการประสบภัย (ถ้ามี)',
    category: 'สิทธิ์การขอความช่วยเหลือ'
  },
  {
    id: '3',
    question: 'ระยะเวลาการตอบกลับโดยเฉลี่ยเท่าไหร่?',
    answer: 'กรณีเร่งด่วนจะได้รับการติดต่อกลับภายใน 30 นาที - 2 ชั่วโมง, กรณีปานกลางภายใน 4-8 ชั่วโมง, และกรณีไม่เร่งด่วนภายใน 24 ชั่วโมง ทั้งนี้ขึ้นอยู่กับสถานการณ์และจำนวนผู้ประสบภัยในขณะนั้น',
    category: 'กระบวนการขอความช่วยเหลือ'
  },
  {
    id: '4',
    question: 'ตรวจสอบสถานะคำขอได้อย่างไร?',
    answer: 'สามารถตรวจสอบได้ 3 วิธี: 1) ผ่านเว็บไซต์ในแท็บ "ติดตามสถานะ" 2) โทรสอบถามที่หมายเลข 191 หรือ 1784 3) เจ้าหน้าที่จะติดต่อกลับตามเบอร์โทรที่แจ้งไว้',
    category: 'กระบวนการขอความช่วยเหลือ'
  },
  {
    id: '5',
    question: 'สามารถขอความช่วยเหลือแทนผู้อื่นได้หรือไม่?',
    answer: 'ได้ แต่ต้องระบุข้อมูลผู้ประสบภัยให้ครบถ้วน รวมถึงเหตุผลที่ไม่สามารถติดต่อเองได้ เช่น หมดสติ, ผู้สูงอายุ, เด็ก หรืออยู่ในสถานการณ์ที่ไม่สามารถใช้โทรศัพท์ได้',
    category: 'กระบวนการขอความช่วยเหลือ'
  },
  {
    id: '6',
    question: 'ความช่วยเหลือมีอะไรบ้าง?',
    answer: 'ความช่วยเหลือรวมถึง: อาหารและน้ำดื่ม, ที่พักพิง, การรักษาพยาบาล, เสื้อผ้าและผ้าห่ม, การอพยพ, การซ่อมแซมที่พักอาศัย, ความช่วยเหลือทางการเงิน และการฟื้นฟูจิตใจ',
    category: 'ประเภทความช่วยเหลือ'
  },
  {
    id: '7',
    question: 'มีค่าใช้จ่ายในการขอความช่วยเหลือหรือไม่?',
    answer: 'ไม่มีค่าใช้จ่ายใดๆ ทั้งสิ้น บริการทั้งหมดฟรี ไม่ต้องจ่ายเงิน หากมีเจ้าหน้าที่เรียกเก็บเงิน กรุณาแจ้งที่ 191 ทันที',
    category: 'ประเภทความช่วยเหลือ'
  },
  {
    id: '8',
    question: 'สามารถพาสัตว์เลี้ยงไปศูนย์พักพิงได้หรือไม่?',
    answer: 'ได้ แต่ต้องแจ้งเจ้าหน้าที่ล่วงหน้า และต้องดูแลสัตว์เลี้ยงของตนเอง รวมถึงเตรียมอาหาร อุปกรณ์ และกรงพักของสัตว์เลี้ยงมาเอง บางศูนย์อาจมีพื้นที่แยกสำหรับสัตว์เลี้ยง',
    category: 'ศูนย์พักพิง'
  },
  {
    id: '9',
    question: 'อยู่ศูนย์พักพิงได้นานแค่ไหน?',
    answer: 'ขึ้นอยู่กับสถานการณ์ โดยทั่วไปจนกว่าสถานการณ์จะปลอดภัยและสามารถกลับบ้านได้ หรือหาที่พักถาวรได้ หากมีปัญหาด้านที่พัก เจ้าหน้าที่จะช่วยประสานหาทางเลือกอื่น',
    category: 'ศูนย์พักพิง'
  },
  {
    id: '10',
    question: 'ศูนย์พักพิงมีสิ่งอำนวยความสะดวกอะไรบ้าง?',
    answer: 'มีห้องน้ำ, จุดอาบน้ำ, ที่นอน ผ้าห่ม, อาหารและน้ำดื่ม, ไฟฟ้า, มุมสำหรับเด็ก, จุดปฐมพยาบาล และเจ้าหน้าที่คอยดูแลความปลอดภัย บางศูนย์มี WiFi และจุดชาร์จโทรศัพท์',
    category: 'ศูนย์พักพิง'
  },
  {
    id: '11',
    question: 'จะเป็นอาสาสมัครได้อย่างไร?',
    answer: 'สามารถลงทะเบียนผ่านแท็บ "อาสาสมัคร" ในเว็บไซต์ กรอกข้อมูลส่วนตัว ทักษะที่มี และช่วงเวลาที่สะดวก เจ้าหน้าที่จะติดต่อกลับภายใน 3-5 วันทำการเพื่อให้ข้อมูลการปฐมนิเทศ',
    category: 'อาสาสมัคร'
  },
  {
    id: '12',
    question: 'อาสาสมัครต้องมีคุณสมบัติอะไร?',
    answer: 'ต้องมีอายุ 18 ปีขึ้นไป, มีสุขภาพแข็งแรง, มีความรับผิดชอบ และมีความตั้งใจจริง ไม่จำเป็นต้องมีประสบการณ์ เพราะจะมีการอบรมก่อนปฏิบัติงานจริง',
    category: 'อาสาสมัคร'
  },
  {
    id: '13',
    question: 'บริจาคของได้ที่ไหน?',
    answer: 'ดูรายละเอียดจุดรับบริจาคได้ในแท็บ "ของบริจาค" หรือโทรสอบถามที่ 1784 ก่อนนำของไปบริจาค เพื่อตรวจสอบว่ามีความต้องการสิ่งของนั้นหรือไม่',
    category: 'การบริจาค'
  },
  {
    id: '14',
    question: 'บริจาคเงินได้ที่ไหน?',
    answer: 'สามารถบริจาคผ่านบัญชี "กองทุนช่วยเหลือผู้ประสบภัย" ของกรุงเทพมหานคร หรือมูลนิธิต่างๆ ที่ได้รับการรับรอง โปรดตรวจสอบความถูกต้องของบัญชีก่อนโอนเสมอ',
    category: 'การบริจาค'
  },
  {
    id: '15',
    question: 'หากพบผู้ต้องการความช่วยเหลือควรทำอย่างไร?',
    answer: 'โทรแจ้ง 191 หรือ 1669 ทันที บอกตำแหน่งที่พบและลักษณะผู้ประสบภัย หากสถานการณ์ปลอดภัย ให้คอยอยู่กับผู้ประสบภัยจนเจ้าหน้าที่มาถึง อย่าเคลื่อนย้ายผู้บาดเจ็บเว้นแต่จำเป็น',
    category: 'กรณีพบเห็นเหตุ'
  }
];

const categories = [
  'ทั้งหมด',
  'สิทธิ์การขอความช่วยเหลือ',
  'กระบวนการขอความช่วยเหลือ',
  'ประเภทความช่วยเหลือ',
  'ศูนย์พักพิง',
  'อาสาสมัคร',
  'การบริจาค',
  'กรณีพบเห็นเหตุ'
];

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = activeCategory === 'ทั้งหมด'
    ? faqs
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <HelpCircle className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">คำถามที่พบบ่อย</h2>
            <p className="text-sm text-gray-500">FAQ - คำถามและคำตอบที่ควรรู้</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="text-xs text-gray-600 mb-3">หมวดหมู่</div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setExpandedId(null);
              }}
              className={`px-3 py-1.5 rounded text-xs border-2 transition-all ${
                activeCategory === category
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-2">
        {filteredFAQs.map((faq) => (
          <div
            key={faq.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              className="w-full flex items-start justify-between gap-3 p-5 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="text-xs text-primary mb-1">{faq.category}</div>
                <h3 className="text-gray-900">{faq.question}</h3>
              </div>
              <div className="flex-shrink-0 mt-1">
                {expandedId === faq.id ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>
            {expandedId === faq.id && (
              <div className="px-5 pb-5">
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex gap-3">
          <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-gray-700">
            <p className="text-gray-900 mb-1">ไม่พบคำตอบที่ต้องการ?</p>
            <p className="text-xs text-gray-600">
              ติดต่อสอบถามเพิ่มเติมได้ที่ 191 หรือ 1784 ทุกวันตลอด 24 ชั่วโมง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
