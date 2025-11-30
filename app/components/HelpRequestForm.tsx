'use client';

import { useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  User,
  Phone as PhoneIcon,
  MapPin,
  Home,
  Utensils,
  Stethoscope,
  Shirt,
  Car,
  Package,
  AlertCircle,
  Users,
  Accessibility,
  PawPrint,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Baby,
  HeartPulse,
  Pill,
  Loader2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn, generateId, requestStorage } from '@/app/lib/utils';
import type { HelpRequest } from '@/app/types';
import { useShareLocation } from '@/app/hooks';

const TEXT = {
  stepLabel: (step: number, total: number) => `ขั้นตอนที่ ${step} จาก ${total}`,
  sections: {
    profile: { title: 'ข้อมูลผู้ขอความช่วยเหลือ', subtitle: 'ชื่อและเบอร์ติดต่อของคุณ' },
    location: { title: 'ที่อยู่ของคุณ', subtitle: 'เพื่อให้เราไปช่วยเหลือคุณได้' },
    needs: { title: 'ต้องการความช่วยเหลืออะไร', subtitle: 'เลือกได้ 1 อย่าง' },
    risk: { title: 'กลุ่มเสี่ยงพิเศษ', subtitle: 'เลือกได้หลายอย่าง (ถ้ามี)' },
    review: { title: 'ตรวจสอบข้อมูลก่อนส่ง', subtitle: 'กรุณาตรวจสอบความถูกต้อง' },
  },
  fields: {
    name: 'ชื่อ-นามสกุล',
    namePlaceholder: 'กรอกชื่อ-นามสกุล',
    phone: 'เบอร์โทรศัพท์',
    phonePlaceholder: '0xx-xxx-xxxx',
    location: 'จังหวัด/อำเภอ',
    locationPlaceholder: 'เช่น กรุงเทพมหานคร, เขตบางกอกน้อย',
    address: 'ที่อยู่โดยละเอียด (ถ้ามี)',
    addressPlaceholder: 'บ้านเลขที่ ถนน ตำบล',
    description: 'อธิบายสถานการณ์ (ถ้ามี)',
    descriptionPlaceholder: 'เช่น บ้านท่วมน้ำสูง 1 เมตร ต้องการอาหารและน้ำดื่ม',
    specialNeeds: 'เพิ่มความต้องการพิเศษ (ถ้ามี)',
    specialNeedsPlaceholder: 'เช่น ไม่สามารถขึ้นบันไดได้, ต้องการอาหารอ่อน, แพ้อาหารทะเล',
  },
  categories: {
    food: 'อาหาร/น้ำ',
    shelter: 'ที่พักพิง',
    medical: 'พยาบาล',
    clothing: 'เสื้อผ้า',
    evacuation: 'อพยพ',
    other: 'อื่นๆ',
  },
  urgency: {
    label: 'ระดับความเร่งด่วน',
    low: 'ไม่เร่งด่วน',
    medium: 'ปานกลาง',
    high: 'เร่งด่วน',
  },
  risk: {
    labels: {
      elderly: 'ผู้สูงอายุ (60 ปีขึ้นไป)',
      children: 'เด็กเล็ก (ต่ำกว่า 5 ปี)',
      disabled: 'ผู้พิการ/ผู้ป่วยติดเตียง',
      pregnant: 'หญิงมีครรภ์',
      pets: 'สัตว์เลี้ยง',
      medical: 'ต้องการยาหรืออุปกรณ์ทางการแพทย์',
    },
    placeholders: {
      elderly: 'เช่น 2 คน, เคลื่อนไหวได้บ้าง, มีโรคเบาหวาน',
      children: 'เช่น 1 คน, อายุ 3 ขวบ',
      disabled: 'เช่น 1 คน, ใช้รถเข็น, ต้องการอุปกรณ์ช่วยเหลือ',
      pregnant: 'เช่น ตั้งครรภ์ 7 เดือน',
      pets: 'เช่น สุนัข 2 ตัว (ขนาดใหญ่) แมว 1 ตัว',
      medical: 'เช่น ยาความดันโลหิตสูง, เครื่องวัดน้ำตาล, ออกซิเจน',
    },
    emptyHint: 'หากไม่มีกลุ่มเสี่ยงพิเศษ กดถัดไปได้เลย',
  },
  review: {
    profile: 'ข้อมูลผู้ขอความช่วยเหลือ',
    address: 'ที่อยู่',
    needs: 'ความช่วยเหลือที่ต้องการ',
    risks: 'กลุ่มเสี่ยงพิเศษ',
    specialNeeds: 'ความต้องการพิเศษ',
    alertTitle: 'ก่อนส่งคำขอ กรุณาตรวจสอบข้อมูล',
    alertSubtitle:
      'เราจะติดต่อกลับโดยเร็วที่สุด กรณีเร่งด่วนกรุณาโทร 191 หรือ 1669',
  },
  buttons: {
    back: 'ย้อนกลับ',
    next: 'ถัดไป',
    submit: 'ส่งคำขอความช่วยเหลือ',
  },
  toastSuccess: 'ส่งคำขอความช่วยเหลือเรียบร้อยแล้ว',
};

type FormData = {
  name: string;
  phone: string;
  location: string;
  address: string;
  urgency: HelpRequest['urgency'];
  category: string;
  description: string;
  riskGroups: string[];
  riskGroupDetails: Record<string, string>;
  specialNeeds: string;
};

type IconType = React.ComponentType<{ className?: string }>;
type CategoryOption = { value: string; icon: IconType };
type RiskOption = { value: string; icon: IconType };

const TOTAL_STEPS = 5;
const INPUT_CLASS =
  'w-full text-black rounded-lg border border-gray-200 px-4 py-3 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20';

const CATEGORY_OPTIONS: CategoryOption[] = [
  { value: 'food', icon: Utensils },
  { value: 'shelter', icon: Home },
  { value: 'medical', icon: Stethoscope },
  { value: 'clothing', icon: Shirt },
  { value: 'evacuation', icon: Car },
  { value: 'other', icon: Package },
];

const RISK_OPTIONS: RiskOption[] = [
  { value: 'elderly', icon: Users },
  { value: 'children', icon: Baby },
  { value: 'disabled', icon: Accessibility },
  { value: 'pregnant', icon: HeartPulse },
  { value: 'pets', icon: PawPrint },
  { value: 'medical', icon: Pill },
];

const EMPTY_FORM: FormData = {
  name: '',
  phone: '',
  location: '',
  address: '',
  urgency: 'medium',
  category: '',
  description: '',
  riskGroups: [],
  riskGroupDetails: {},
  specialNeeds: '',
};

type HelpRequestFormProps = {
  onSuccess?: () => void;
};

export function HelpRequestForm({ onSuccess }: HelpRequestFormProps = {}) {
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const { getCurrentLocation, isLoading: isLoadingLocation } =
    useShareLocation();

  const progress = useMemo(
    () => Math.round((step / TOTAL_STEPS) * 100),
    [step]
  );

  const canProceed = useMemo(() => {
    if (step === 1)
      return (
        formData.name.trim() &&
        formData.phone.trim() &&
        formData.phone.length === 10
      );
    if (step === 2) return formData.location.trim();
    if (step === 3) return formData.category && formData.urgency;
    return true;
  }, [formData, step]);

  const setField = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setFormData(prev => ({ ...prev, [key]: value }));

  const toggleRiskGroup = (group: string) =>
    setFormData(prev => {
      const exists = prev.riskGroups.includes(group);
      const riskGroupDetails = { ...prev.riskGroupDetails };
      if (exists) {
        delete riskGroupDetails[group];
      }
      return {
        ...prev,
        riskGroups: exists
          ? prev.riskGroups.filter(g => g !== group)
          : [...prev.riskGroups, group],
        riskGroupDetails,
      };
    });

  const updateRiskGroupDetail = (group: string, value: string) =>
    setFormData(prev => ({
      ...prev,
      riskGroupDetails: { ...prev.riskGroupDetails, [group]: value },
    }));

  const handleGetLocation = async () => {
    try {
      const location = await getCurrentLocation();
      const locationString = `${location.latitude.toFixed(
        6
      )}, ${location.longitude.toFixed(6)}`;
      setField('location', locationString);
    } catch {
      // Error already handled in hook
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: HelpRequest = {
      id: generateId(),
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
      category: formData.category || 'other',
      urgency: formData.urgency,
      description: formData.description,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: formData.specialNeeds,
      assignedTo: undefined,
      userEmail: session?.user?.email || undefined,
      userId: session?.user?.id || undefined,
    };

    requestStorage.add(newRequest);
    toast.success(TEXT.toastSuccess);
    setFormData(EMPTY_FORM);
    setStep(1);
    onSuccess?.();
  };

  const urgencyPill = (
    value: HelpRequest['urgency'],
    tone: 'green' | 'orange' | 'red'
  ) =>
    cn(
      'inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs',
      tone === 'green' && 'bg-green-100 text-green-700',
      tone === 'orange' && 'bg-orange-100 text-orange-700',
      tone === 'red' && 'bg-red-100 text-red-700',
      formData.urgency === value && 'ring-1 ring-offset-0 ring-current'
    );

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {TEXT.stepLabel(step, TOTAL_STEPS)}
          </span>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <Section
            icon={<User className="h-5 w-5 text-gray-700" />}
            title={TEXT.sections.profile.title}
            subtitle={TEXT.sections.profile.subtitle}
          >
            <div className="space-y-4">
              <Field label={TEXT.fields.name} required>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setField('name', e.target.value)}
                  className={INPUT_CLASS}
                  placeholder={TEXT.fields.namePlaceholder}
                />
              </Field>

              <Field label={TEXT.fields.phone} required>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={e => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setField('phone', value);
                    }
                  }}
                  className={INPUT_CLASS}
                  placeholder="0812345678"
                  maxLength={10}
                  pattern="[0-9]{10}"
                />
                {formData.phone && formData.phone.length < 10 && (
                  <p className="mt-1 text-xs text-orange-600">
                    ⚠️ กรุณากรอกเบอร์โทรให้ครบ 10 หลัก (ปัจจุบัน:{' '}
                    {formData.phone.length}/10)
                  </p>
                )}
              </Field>
            </div>
          </Section>
        )}

        {step === 2 && (
          <Section
            icon={<MapPin className="h-5 w-5 text-gray-700" />}
            title={TEXT.sections.location.title}
            subtitle={TEXT.sections.location.subtitle}
          >
            <div className="space-y-4">
              <Field label="ที่อยู่ของคุณ" required>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      disabled
                      type="text"
                      value={formData.location}
                      onChange={e => setField('location', e.target.value)}
                      className={cn(INPUT_CLASS, 'flex-1')}
                      placeholder="กรอกที่อยู่หรือกดปุ่มดึงตำแหน่ง GPS"
                    />
                    {formData.location && (
                      <button
                        type="button"
                        onClick={() => setField('location', '')}
                        className="flex items-center gap-2 rounded-lg border-2 border-red-200 bg-white px-4 py-3 text-red-600 transition-colors hover:border-red-300 hover:bg-red-50"
                        title="ลบที่อยู่"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isLoadingLocation}
                      className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-white transition-colors hover:bg-[#e14a21] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoadingLocation ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <MapPin className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    💡 กดปุ่มเพื่อดึงพิกัด GPS อัตโนมัติ
                  </p>

                  {/* Show map preview when location is filled */}
                  {formData.location && formData.location.includes(',') && (
                    <div className="mt-3 rounded-lg border-2 border-gray-200 bg-gray-50 p-3">
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          🗺️ ตัวอย่างตำแหน่ง
                        </span>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-gray-300">
                        <iframe
                          width="100%"
                          height="200"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${formData.location}&zoom=15&language=th&region=TH`}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-600">
                        📍 {formData.location}
                      </p>
                    </div>
                  )}
                </div>
              </Field>

              {/* <Field label={TEXT.fields.address}>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setField('address', e.target.value)}
                  className={INPUT_CLASS}
                  placeholder={TEXT.fields.addressPlaceholder}
                />
              </Field> */}
            </div>
          </Section>
        )}

        {step === 3 && (
          <Section
            icon={<Package className="h-5 w-5 text-gray-700" />}
            title={TEXT.sections.needs.title}
            subtitle={TEXT.sections.needs.subtitle}
          >
            <div className="mb-6 grid grid-cols-2 gap-3">
              {CATEGORY_OPTIONS.map(cat => {
                const Icon = cat.icon;
                const active = formData.category === cat.value;
                const label =
                  TEXT.categories[cat.value as keyof typeof TEXT.categories];
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setField('category', cat.value)}
                    className={cn(
                      'rounded-lg border-2 p-4 transition-all',
                      active
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <Icon
                      className={cn(
                        'mx-auto mb-2 h-6 w-6',
                        active ? 'text-primary' : 'text-gray-600'
                      )}
                    />
                    <div
                      className={cn(
                        'text-sm',
                        active ? 'text-gray-900' : 'text-gray-600'
                      )}
                    >
                      {label}
                    </div>
                  </button>
                );
              })}
            </div>

            <Field label={TEXT.urgency.label} required>
              <div className="grid grid-cols-3 gap-3">
                <UrgencyButton
                  active={formData.urgency === 'low'}
                  onClick={() => setField('urgency', 'low')}
                  icon={
                    <Circle
                      className={cn(
                        'h-5 w-5',
                        formData.urgency === 'low'
                          ? 'fill-green-500 text-green-500'
                          : 'text-gray-400'
                      )}
                    />
                  }
                  label={TEXT.urgency.low}
                  className={cn(
                    'rounded-lg border-2 p-4 transition-all',
                    formData.urgency === 'low'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                />
                <UrgencyButton
                  active={formData.urgency === 'medium'}
                  onClick={() => setField('urgency', 'medium')}
                  icon={
                    <AlertCircle
                      className={cn(
                        'h-5 w-5',
                        formData.urgency === 'medium'
                          ? 'text-primary'
                          : 'text-gray-400'
                      )}
                    />
                  }
                  label={TEXT.urgency.medium}
                  className={cn(
                    'rounded-lg border-2 p-4 transition-all',
                    formData.urgency === 'medium'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                />
                <UrgencyButton
                  active={formData.urgency === 'high'}
                  onClick={() => setField('urgency', 'high')}
                  icon={
                    <AlertTriangle
                      className={cn(
                        'h-5 w-5',
                        formData.urgency === 'high'
                          ? 'text-red-500'
                          : 'text-gray-400'
                      )}
                    />
                  }
                  label={TEXT.urgency.high}
                  className={cn(
                    'rounded-lg border-2 p-4 transition-all',
                    formData.urgency === 'high'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                />
              </div>
            </Field>

            <Field label={TEXT.fields.description}>
              <textarea
                value={formData.description}
                onChange={e => setField('description', e.target.value)}
                rows={3}
                className={cn(INPUT_CLASS, 'resize-none')}
                placeholder={TEXT.fields.descriptionPlaceholder}
              />
            </Field>
          </Section>
        )}

        {step === 4 && (
          <Section
            icon={<Users className="h-5 w-5 text-gray-700" />}
            title={TEXT.sections.risk.title}
            subtitle={TEXT.sections.risk.subtitle}
          >
            <div className="mb-4 space-y-3">
              {RISK_OPTIONS.map(group => {
                const Icon = group.icon;
                const isSelected = formData.riskGroups.includes(group.value);
                const placeholderMap: Record<string, string> = {
                  elderly: TEXT.risk.placeholders.elderly,
                  children: TEXT.risk.placeholders.children,
                  disabled: TEXT.risk.placeholders.disabled,
                  pregnant: TEXT.risk.placeholders.pregnant,
                  pets: TEXT.risk.placeholders.pets,
                  medical: TEXT.risk.placeholders.medical,
                };

                return (
                  <div key={group.value}>
                    <button
                      type="button"
                      onClick={() => toggleRiskGroup(group.value)}
                      className={cn(
                        'w-full rounded-lg border-2 p-4 text-left transition-all',
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isSelected ? 'text-primary' : 'text-gray-600'
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm',
                            isSelected ? 'text-gray-900' : 'text-gray-600'
                          )}
                        >
                          {TEXT.risk.labels[group.value as keyof typeof TEXT.risk.labels]}
                        </span>
                        <div
                          className={cn(
                            'ml-auto flex h-5 w-5 items-center justify-center rounded border-2',
                            isSelected
                              ? 'border-primary bg-primary'
                              : 'border-gray-300'
                          )}
                        >
                          {isSelected && (
                            <CheckCircle2 className="h-4 w-4 text-white" />
                          )}
                        </div>
                      </div>
                    </button>

                    {isSelected && (
                      <div className="ml-11 mr-2 mt-2">
                        <textarea
                          value={formData.riskGroupDetails[group.value] || ''}
                          onChange={e =>
                            updateRiskGroupDetail(group.value, e.target.value)
                          }
                          rows={2}
                          className={cn(INPUT_CLASS, 'resize-none text-sm')}
                          placeholder={placeholderMap[group.value] || ''}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {formData.riskGroups.length === 0 && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center">
                <p className="text-sm text-gray-600">{TEXT.risk.emptyHint}</p>
              </div>
            )}
          </Section>
        )}

        {step === 5 && (
          <Section
            icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
            title={TEXT.sections.review.title}
            subtitle={TEXT.sections.review.subtitle}
          >
            <div className="mb-6 space-y-3">
              <ReviewBlock
                title={TEXT.review.profile}
                icon={<User className="h-4 w-4 text-gray-600" />}
                items={[
                  { label: formData.name },
                  {
                    label: formData.phone,
                    icon: <PhoneIcon className="h-3.5 w-3.5" />,
                  },
                ]}
              />

              <ReviewBlock
                title={TEXT.review.address}
                icon={<MapPin className="h-4 w-4 text-gray-600" />}
                items={[
                  { label: formData.location },
                  ...(formData.address ? [{ label: formData.address }] : []),
                ]}
              />

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-600" />
                  <div className="text-xs text-gray-600">
                    {TEXT.review.needs}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      {CATEGORY_OPTIONS.find(c => c.value === formData.category)
                        ?.value
                        ? TEXT.categories[formData.category as keyof typeof TEXT.categories]
                        : ''}
                    </span>
                    <span
                      className={urgencyPill(
                        formData.urgency,
                        formData.urgency === 'high'
                          ? 'red'
                          : formData.urgency === 'medium'
                          ? 'orange'
                          : 'green'
                      )}
                    >
                      {TEXT.urgency[formData.urgency as keyof typeof TEXT.urgency]}
                    </span>
                  </div>
                  {formData.description && (
                    <div className="border-t border-gray-200 pt-2 text-sm text-gray-600">
                      {formData.description}
                    </div>
                  )}
                </div>
              </div>

              {formData.riskGroups.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-3 text-xs text-gray-600">
                    {TEXT.review.risks}
                  </div>
                  <div className="space-y-3">
                    {formData.riskGroups.map(value => {
                      const group = RISK_OPTIONS.find(g => g.value === value);
                      const Icon = group?.icon || Users;
                      const detail = formData.riskGroupDetails[value];
                      return (
                        <div
                          key={value}
                          className="rounded-lg border border-gray-200 bg-white p-3"
                        >
                          <div className="mb-1 flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-700" />
                            <span className="text-sm text-gray-900">
                              {group
                                ? TEXT.risk.labels[group.value as keyof typeof TEXT.risk.labels]
                                : value}
                            </span>
                          </div>
                          {detail && (
                            <div className="ml-6 mt-1 text-xs text-gray-600">
                              {detail}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {formData.specialNeeds && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-2 text-xs text-gray-600">
                    {TEXT.review.specialNeeds}
                  </div>
                  <div className="text-sm text-gray-900">
                    {formData.specialNeeds}
                  </div>
                </div>
              )}
            </div>

            <Field label={TEXT.fields.specialNeeds}>
              <textarea
                value={formData.specialNeeds}
                onChange={e => setField('specialNeeds', e.target.value)}
                rows={3}
                className={cn(INPUT_CLASS, 'resize-none text-sm')}
                placeholder={TEXT.fields.specialNeedsPlaceholder}
              />
            </Field>

            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="text-sm text-gray-700">
                  <p className="mb-1 text-gray-900">{TEXT.review.alertTitle}</p>
                  <p className="text-xs text-gray-600">
                    {TEXT.review.alertSubtitle}
                  </p>
                </div>
              </div>
            </div>
          </Section>
        )}

        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{TEXT.buttons.back}</span>
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={() => setStep(s => Math.min(TOTAL_STEPS, s + 1))}
              disabled={!canProceed}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 transition-colors',
                canProceed
                  ? 'bg-primary text-white hover:bg-[#e14a21]'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              )}
            >
              <span>{TEXT.buttons.next}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white shadow-sm transition-colors hover:bg-[#e14a21]"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>{TEXT.buttons.submit}</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

function Section({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-lg bg-gray-100 p-2.5">{icon}</div>
        <div>
          <h3 className="text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-700">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  );
}

function UrgencyButton({
  active,
  onClick,
  icon,
  label,
  className,
}: {
  active?: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-pressed={active}
    >
      <div className="mx-auto mb-1 flex w-max flex-col items-center">
        {icon}
        <div className="text-xs text-gray-900">{label}</div>
      </div>
    </button>
  );
}

type ReviewItem = { label: string; icon?: React.ReactNode };
function ReviewBlock({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: ReviewItem[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon}
        <div className="text-xs text-gray-600">{title}</div>
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            {item.icon}
            <span className="text-gray-900">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
