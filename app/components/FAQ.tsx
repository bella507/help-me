import { useMemo, useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import type { FAQItem } from '@/app/types';
import { faqStorage } from '@/app/lib/utils/storage';

const categories = [
  'ทั้งหมด',
  'สิทธิ์การขอความช่วยเหลือ',
  'กระบวนการขอความช่วยเหลือ',
  'ประเภทความช่วยเหลือ',
  'ศูนย์พักพิง',
  'อาสาสมัคร',
  'การบริจาค',
  'กรณีพบเห็นเหตุ',
];

const defaultFaqs: FAQItem[] = [
  {
    id: '1',
    question: 'ใครมีสิทธิ์ขอความช่วยเหลือได้บ้าง?',
    answer:
      'ผู้ที่ประสบภัยพิบัติทุกประเภท ไม่ว่าจะเป็นอุทกภัย อัคคีภัย แผ่นดินไหว หรือภัยอื่นๆ โดยไม่จำกัดสัญชาติ อายุ หรือสถานะทางสังคม สามารถขอความช่วยเหลือได้ทันที',
    category: 'สิทธิ์การขอความช่วยเหลือ',
  },
  {
    id: '2',
    question: 'ต้องเตรียมเอกสารอะไรบ้างเมื่อขอความช่วยเหลือ?',
    answer:
      'กรณีฉุกเฉิน ไม่จำเป็นต้องมีเอกสาร สามารถแจ้งข้อมูลพื้นฐานได้ก่อน แต่หากสะดวก ควรมี: บัตรประชาชน, ทะเบียนบ้าน, เอกสารแสดงสถานที่อยู่ปัจจุบัน และหลักฐานการประสบภัย (ถ้ามี)',
    category: 'สิทธิ์การขอความช่วยเหลือ',
  },
  {
    id: '3',
    question: 'ระยะเวลาการตอบกลับโดยเฉลี่ยเท่าไหร่?',
    answer:
      'กรณีเร่งด่วนจะได้รับการติดต่อกลับภายใน 30 นาที - 2 ชั่วโมง, กรณีปานกลางภายใน 4-8 ชั่วโมง, และกรณีไม่เร่งด่วนภายใน 24 ชั่วโมง ทั้งนี้ขึ้นอยู่กับสถานการณ์และจำนวนผู้ประสบภัยในขณะนั้น',
    category: 'กระบวนการขอความช่วยเหลือ',
  },
  {
    id: '4',
    question: 'ตรวจสอบสถานะคำขอได้อย่างไร?',
    answer:
      'สามารถตรวจสอบได้ 3 วิธี: 1) ผ่านเว็บไซต์ในแท็บ "ติดตามสถานะ" 2) โทรสอบถามที่หมายเลข 191 หรือ 1784 3) เจ้าหน้าที่จะติดต่อกลับตามเบอร์โทรที่แจ้งไว้',
    category: 'กระบวนการขอความช่วยเหลือ',
  },
  {
    id: '5',
    question: 'สามารถขอความช่วยเหลือแทนผู้อื่นได้หรือไม่?',
    answer:
      'ได้ แต่ต้องระบุข้อมูลผู้ประสบภัยให้ครบถ้วน รวมถึงเหตุผลที่ไม่สามารถติดต่อเองได้ เช่น หมดสติ, ผู้สูงอายุ, เด็ก หรืออยู่ในสถานการณ์ที่ไม่สามารถใช้โทรศัพท์ได้',
    category: 'กระบวนการขอความช่วยเหลือ',
  },
  {
    id: '6',
    question: 'ความช่วยเหลือมีอะไรบ้าง?',
    answer:
      'ความช่วยเหลือรวมถึง: อาหารและน้ำดื่ม, ที่พักพิง, การรักษาพยาบาล, เสื้อผ้าและผ้าห่ม, การอพยพ, การซ่อมแซมที่พักอาศัย, ความช่วยเหลือทางการเงิน และการฟื้นฟูจิตใจ',
    category: 'ประเภทความช่วยเหลือ',
  },
];

export function FAQ() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const faqs = useMemo(() => {
    const stored = faqStorage.getAll();
    if (stored.length === 0) {
      faqStorage.save(defaultFaqs);
      return defaultFaqs;
    }
    return stored;
  }, []);

  const filteredFAQs = useMemo(
    () =>
      activeCategory === 'ทั้งหมด'
        ? faqs
        : faqs.filter(faq => faq.category === activeCategory),
    [faqs, activeCategory]
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <HelpCircle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">คำถามที่พบบ่อย</h2>
            <p className="text-sm text-gray-500">
              FAQ - คำถามและคำตอบที่ควรรู้
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="mb-3 text-xs text-gray-600">หมวดหมู่</div>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setExpandedId(null);
              }}
              className={cn(
                'rounded border-2 px-3 py-1.5 text-xs transition-all',
                activeCategory === category
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filteredFAQs.map(faq => (
          <div
            key={faq.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === faq.id ? null : faq.id)
              }
              className="flex w-full items-start justify-between gap-3 p-5 text-left transition-colors hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="mb-1 text-xs text-primary">{faq.category}</div>
                <h3 className="text-gray-900">{faq.question}</h3>
              </div>
              <div className="mt-1 shrink-0">
                {expandedId === faq.id ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </button>
            {expandedId === faq.id && (
              <div className="px-5 pb-5">
                <div className="border-t border-gray-200 pt-3">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <div className="flex gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-gray-700">
            <p className="mb-1 text-gray-900">ไม่พบคำตอบที่ต้องการ?</p>
            <p className="text-xs text-gray-600">
              ติดต่อสอบถามเพิ่มเติมได้ที่ 191 หรือ 1784 ทุกวันตลอด 24 ชั่วโมง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
