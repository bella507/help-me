'use client';

import { Heart, Phone, Shield, Users, FileText } from 'lucide-react';
import { useSession, signIn } from 'next-auth/react';
import { cn } from '@/app/lib/utils';

type HeroSectionProps = {
  darkMode: boolean;
  onRequest: () => void;
};

export function HeroSection({ darkMode, onRequest }: HeroSectionProps) {
  const { data: session } = useSession();

  const handleRequestClick = () => {
    if (!session) {
      signIn('google');
      return;
    }
    onRequest();
  };
  const stats = [
    { value: '24/7', label: 'ให้บริการ' },
    { value: 'ฟรี', label: 'ไม่มีค่าใช้จ่าย' },
    { value: 'รวดเร็ว', label: 'ไม่ต้องรอนาน' },
  ];
  const numbers: Array<{
    number: string;
    title: string;
    description: string;
    tone: 'red' | 'blue' | 'orange';
  }> = [
    {
      number: '191',
      title: 'แจ้งเหตุฉุกเฉิน',
      description: 'ตำรวจ เหตุร้าย อัคคีภัย',
      tone: 'red',
    },
    {
      number: '1669',
      title: 'รถฉุกเฉินการแพทย์',
      description: 'เจ็บป่วย บาดเจ็บ',
      tone: 'blue',
    },
    {
      number: '1784',
      title: 'ศูนย์ช่วยเหลือภัย',
      description: 'น้ำท่วม แผ่นดินไหว',
      tone: 'orange',
    },
  ];

  return (
    <div className="relative overflow-hidden border-b-2 bg-linear-to-br from-orange-50 via-white to-orange-100">
      {/* Animated Ocean Waves */}
      <div className="absolute inset-0 opacity-50">
        <svg
          className="absolute bottom-0 w-full h-24 sm:h-32 md:h-40 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#fb923c"
            fillOpacity="0.8"
            d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,154.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,154.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,133.3C672,117,768,107,864,122.7C960,139,1056,181,1152,186.7C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,122.7C960,128,1056,160,1152,154.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
            />
          </path>
          <path
            fill="#f97316"
            fillOpacity="0.7"
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          >
            <animate
              attributeName="d"
              dur="8s"
              repeatCount="indefinite"
              values="
                M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,192L48,181.3C96,171,192,149,288,144C384,139,480,149,576,165.3C672,181,768,203,864,202.7C960,203,1056,181,1152,160C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z
              "
            />
          </path>
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-20 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6 text-center lg:text-left">
            <div className="space-y-3">
              <h1
                className={cn(
                  'text-2xl sm:text-4xl lg:text-5xl leading-tight',
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                )}
              >
                ศูนย์ช่วยเหลือผู้ประสบภัย
              </h1>
              <p
                className={cn(
                  'text-md md:text-lg',
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                )}
              >
                พร้อมดูแลคุณทุกขณะ ไม่ว่าจะเกิดอะไรขึ้น
              </p>
            </div>

            <div className="mx-auto grid max-w-md grid-cols-3 gap-3 sm:gap-4 lg:mx-0">
              {stats.map(stat => (
                <StatCard
                  key={stat.label}
                  value={stat.value}
                  label={stat.label}
                />
              ))}
            </div>

            <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                onClick={handleRequestClick}
                className="group relative overflow-hidden rounded-xl bg-primary px-8 py-4 text-white shadow-lg transition-all hover:bg-[#e14a21] hover:shadow-xl"
              >
                <div className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative flex items-center justify-center gap-2 text-lg">
                  <div className="relative">
                    <Heart className="h-5 w-5" />
                    <div className="absolute w-5 h-5 inset-0 animate-ping rounded-full bg-red-600" />
                  </div>
                  ขอความช่วยเหลือ คลิก!!!
                </span>
              </button>
            </div>

            {/* <div className="flex items-center justify-center gap-4 pt-2 text-sm text-gray-500 lg:justify-start">
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
            </div> */}
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

              {numbers.map(num => (
                <EmergencyNumber
                  key={num.number}
                  number={num.number}
                  title={num.title}
                  description={num.description}
                  tone={num.tone}
                />
              ))}
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
