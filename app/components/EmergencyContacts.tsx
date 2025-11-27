import { Phone, Ambulance, Flame, Shield, Hospital, Heart, AlertTriangle, ChevronDown, ChevronUp, Mail, Globe, MessageCircle } from 'lucide-react';
import { useState } from 'react';

interface Contact {
  name: string;
  numbers: { number: string; label: string; isPrimary?: boolean }[];
  channels?: { type: 'line' | 'email' | 'website'; value: string; label: string }[];
  description: string;
  icon: any;
  color: string;
}

const emergencyContacts: Contact[] = [
  {
    name: 'ตำรวจ',
    numbers: [
      { number: '191', label: 'สายฉุกเฉิน', isPrimary: true },
      { number: '1599', label: 'สายด่วนตำรวจท่องเที่ยว' },
      { number: '1137', label: 'ศูนย์รับเรื่องร้องเรียน' }
    ],
    channels: [
      { type: 'line', value: '@191police', label: 'LINE ตำรวจ' },
      { type: 'website', value: 'https://www.royalthaipolice.go.th', label: 'เว็บไซต์' }
    ],
    description: 'อาชญากรรม เหตุร้าย อุบัติเหตุ',
    icon: Shield,
    color: 'bg-gray-700'
  },
  {
    name: 'กู้ชีพ กู้ภัย',
    numbers: [
      { number: '1669', label: 'รถพยาบาลฉุกเฉิน', isPrimary: true },
      { number: '1646', label: 'ศูนย์ประสานงานโรงพยาบาล' },
      { number: '1554', label: 'สายด่วนสาธารณสุข' }
    ],
    channels: [
      { type: 'website', value: 'https://niems.go.th', label: 'ศูนย์รับแจ้งเหตุ' }
    ],
    description: 'เจ็บป่วย บาดเจ็บ ปฐมพยาบาล',
    icon: Ambulance,
    color: 'bg-primary'
  },
  {
    name: 'ดับเพลิง',
    numbers: [
      { number: '199', label: 'สายฉุกเฉิน', isPrimary: true },
      { number: '02-246-0199', label: 'กรุงเทพมหานคร' },
      { number: '1784', label: 'ศูนย์ป้องกันภัย' }
    ],
    channels: [
      { type: 'line', value: '@199fire', label: 'LINE ดับเพลิง' }
    ],
    description: 'ไฟไหม้ อัคคีภัย ภัยพิบัติ',
    icon: Flame,
    color: 'bg-primary'
  },
  {
    name: 'ศูนย์ช่วยเหลือภัย',
    numbers: [
      { number: '1784', label: 'ศูนย์ประสานงาน', isPrimary: true },
      { number: '02-141-9611', label: 'สำนักงานป้องกันฯ' }
    ],
    channels: [
      { type: 'line', value: '@disaster1784', label: 'LINE ศูนย์ภัย' },
      { type: 'website', value: 'https://www.disaster.go.th', label: 'เว็บไซต์' },
      { type: 'email', value: 'disaster@disaster.go.th', label: 'อีเมล' }
    ],
    description: 'น้ำท่วม แผ่นดินไหว ภัยธรรมชาติ',
    icon: AlertTriangle,
    color: 'bg-primary'
  },
  {
    name: 'สายด่วนสาธารณสุข',
    numbers: [
      { number: '1422', label: 'สายด่วนสาธารณสุข', isPrimary: true },
      { number: '1330', label: 'โรคติดต่ออุบัติใหม่' }
    ],
    description: 'ปรึกษาสุขภาพ โรคติดต่อ',
    icon: Heart,
    color: 'bg-gray-700'
  },
  {
    name: 'การไฟฟ้า',
    numbers: [
      { number: '1130', label: 'กฟน. กรุงเทพฯ', isPrimary: true },
      { number: '1129', label: 'กฟผ. ต่างจังหวัด' }
    ],
    channels: [
      { type: 'line', value: '@mea1130', label: 'LINE กฟน.' },
      { type: 'website', value: 'https://www.mea.or.th', label: 'เว็บไซต์' }
    ],
    description: 'ไฟฟ้าขัดข้อง ไฟดับ ไฟตก',
    icon: AlertTriangle,
    color: 'bg-gray-700'
  },
  {
    name: 'การประปา',
    numbers: [
      { number: '1125', label: 'กปน. กรุงเทพฯ', isPrimary: true },
      { number: '1662', label: 'กปภ. ต่างจังหวัด' }
    ],
    channels: [
      { type: 'line', value: '@mwa1125', label: 'LINE กปน.' }
    ],
    description: 'น้ำประปาขัดข้อง ท่อแตก',
    icon: Hospital,
    color: 'bg-gray-700'
  }
];

export function EmergencyContacts() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'line':
        return <MessageCircle className="w-3.5 h-3.5" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5" />;
      case 'website':
        return <Globe className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center space-y-1 py-2">
        <h2 className="text-gray-900">เบอร์ฉุกเฉิน</h2>
        <p className="text-xs text-gray-500">แตะเพื่อโทรออกทันที พร้อมเบอร์หน่วยงานต่างๆ</p>
      </div>

      {/* Main Emergency Contacts */}
      <div className="space-y-2">
        {emergencyContacts.map((contact, index) => {
          const Icon = contact.icon;
          const isExpanded = expandedId === index;
          const primaryNumber = contact.numbers.find(n => n.isPrimary) || contact.numbers[0];
          const otherNumbers = contact.numbers.filter(n => !n.isPrimary);
          const hasMore = otherNumbers.length > 0 || (contact.channels && contact.channels.length > 0);

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Primary Contact */}
              <div className="flex items-center gap-3 p-4">
                {/* Icon */}
                <div className={`flex-shrink-0 ${contact.color} p-2.5 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>

                {/* Number + Name */}
                <a
                  href={`tel:${primaryNumber.number}`}
                  className="flex-1 min-w-0 group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-3xl text-gray-900 leading-none mb-1 group-active:text-primary transition-colors">
                    {primaryNumber.number}
                  </div>
                  <div className="text-sm text-gray-600">{contact.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{primaryNumber.label}</div>
                </a>

                {/* Expand/Call Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${primaryNumber.number}`}
                    className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Phone className="w-5 h-5 text-gray-600" />
                  </a>
                  
                  {hasMore && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : index)}
                      className="flex-shrink-0 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && hasMore && (
                <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-3">
                  {/* Other Numbers */}
                  {otherNumbers.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 mb-2">เบอร์เพิ่มเติม</div>
                      {otherNumbers.map((num, idx) => (
                        <a
                          key={idx}
                          href={`tel:${num.number}`}
                          className="flex items-center justify-between gap-2 p-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-all active:scale-[0.98]"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-base text-gray-900">{num.number}</div>
                            <div className="text-xs text-gray-500">{num.label}</div>
                          </div>
                          <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Other Channels */}
                  {contact.channels && contact.channels.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-xs text-gray-500 mb-2">ช่องทางติดต่ออื่นๆ</div>
                      {contact.channels.map((channel, idx) => (
                        <a
                          key={idx}
                          href={channel.type === 'website' ? channel.value : channel.type === 'email' ? `mailto:${channel.value}` : '#'}
                          target={channel.type === 'website' ? '_blank' : undefined}
                          rel={channel.type === 'website' ? 'noopener noreferrer' : undefined}
                          className="flex items-center gap-2 p-2.5 bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg transition-all active:scale-[0.98]"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            {getChannelIcon(channel.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900">{channel.label}</div>
                            <div className="text-xs text-gray-500 truncate">{channel.value}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex gap-2.5">
          <AlertTriangle className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed">
            บอกตำแหน่งที่ตั้งอย่างละเอียด บอกลักษณะเหตุการณ์ และอย่าวางสายจนกว่าเจ้าหน้าที่จะอนุญาต
          </p>
        </div>
      </div>
    </div>
  );
}