import { Heart, Phone, Shield, Users, FileText } from 'lucide-react';
import { cn } from '@/app/lib/utils';

type HeroSectionProps = {
  darkMode: boolean;
  onRequest: () => void;
};

export function HeroSection({ darkMode, onRequest }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden border-b-2 border-gray-100 bg-linear-to-br from-gray-50 via-white to-orange-50">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #f9572b 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6 text-center lg:text-left">
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-green-200 bg-green-100 px-4 py-2">
                <div className="relative">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                  <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-green-400" />
                </div>
                <span className="text-sm text-green-700">
                  พร้อมให้บริการตลอด 24 ชั่วโมง
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h1
                className={cn(
                  'text-3xl sm:text-4xl lg:text-5xl leading-tight',
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                )}
              >
                ศูนย์ช่วยเหลือ
                <br />
                ผู้ประสบภัย
              </h1>
              <p
                className={cn(
                  'text-lg sm:text-xl',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                พร้อมดูแลคุณทุกขณะ ไม่ว่าจะเกิดอะไรขึ้น
              </p>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-3 gap-3 sm:gap-4 lg:mx-0">
              <StatCard value="24/7" label="เปิดบริการ" />
              <StatCard value="ฟรี" label="ไม่มีค่าใช้จ่าย" />
              <StatCard value="<5" label="นาที ตอบรับ" />
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                onClick={onRequest}
                className="group relative overflow-hidden rounded-xl bg-primary px-8 py-4 text-white shadow-lg transition-all hover:bg-[#e14a21] hover:shadow-xl"
              >
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  ขอความช่วยเหลือเลย
                </span>
              </button>
              <a
                href="tel:191"
                className="rounded-xl border-2 border-gray-200 px-8 py-4 text-gray-900 shadow-sm transition-all hover:border-primary hover:bg-gray-50 hover:shadow-md"
              >
                <span className="flex items-center justify-center gap-2 text-lg">
                  <Phone className="h-5 w-5" />
                  โทร 191 ฉุกเฉิน
                </span>
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 pt-2 text-sm text-gray-500 lg:justify-start">
              <div className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                <span>ปลอดภัย</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Heart className="h-4 w-4" />
                <span>เชื่อถือได้</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>ช่วยเหลือแล้ว 1,000+ คน</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="space-y-4 rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-xl">
              <div className="border-b border-gray-100 pb-4 text-center">
                <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-orange-600 shadow-lg">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-1 text-xl text-gray-900">หมายเลขฉุกเฉิน</h3>
                <p className="text-sm text-gray-600">
                  โทรออกได้ทันทีตลอด 24 ชั่วโมง
                </p>
              </div>

              <EmergencyNumber
                number="191"
                title="แจ้งเหตุฉุกเฉิน"
                description="ตำรวจ เหตุร้าย อัคคีภัย"
                tone="red"
              />
              <EmergencyNumber
                number="1669"
                title="รถฉุกเฉินการแพทย์"
                description="เจ็บป่วย บาดเจ็บ"
                tone="blue"
              />
              <EmergencyNumber
                number="1784"
                title="ศูนย์ช่วยเหลือภัย"
                description="น้ำท่วม แผ่นดินไหว"
                tone="orange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border-2 border-gray-100 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-1 text-2xl text-primary sm:text-3xl">{value}</div>
      <div className="text-xs text-gray-600 sm:text-sm">{label}</div>
    </div>
  );
}

function EmergencyNumber({
  number,
  title,
  description,
  tone,
}: {
  number: string;
  title: string;
  description: string;
  tone: 'red' | 'blue' | 'orange';
}) {
  const styles: Record<
    'red' | 'blue' | 'orange',
    { cardBg: string; border: string; number: string; badge: string }
  > = {
    red: {
      cardBg: 'bg-red-50 hover:bg-red-100',
      border: 'border-red-200',
      number: 'text-red-600',
      badge: 'bg-red-500',
    },
    blue: {
      cardBg: 'bg-blue-50 hover:bg-blue-100',
      border: 'border-blue-200',
      number: 'text-blue-600',
      badge: 'bg-blue-500',
    },
    orange: {
      cardBg: 'bg-orange-50 hover:bg-orange-100',
      border: 'border-orange-200',
      number: 'text-orange-600',
      badge: 'bg-orange-500',
    },
  };

  const style = styles[tone];

  return (
    <a
      href={`tel:${number}`}
      className={`group flex items-center justify-between rounded-xl border-2 ${style.border} ${style.cardBg} p-4 transition-colors`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-transform ${style.badge} group-hover:scale-110`}
        >
          <Phone className="h-5 w-5 text-white" />
        </div>
        <div className="text-left">
          <div className="text-gray-900">{title}</div>
          <div className="text-xs text-gray-600">{description}</div>
        </div>
      </div>
      <div className={`text-2xl ${style.number}`}>{number}</div>
    </a>
  );
}
