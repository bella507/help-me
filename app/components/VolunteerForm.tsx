import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Users, CheckCircle2, ChevronRight, ChevronLeft, Car, Ship, Plane } from 'lucide-react';
import { toast } from 'sonner';
import { cn, generateId, volunteerStorage } from '@/app/lib/utils';
import type { Volunteer } from '@/app/types';

type VolunteerFormData = {
  name: string;
  phone: string;
  email: string;
  age: string;
  area: string;
  availability: string[];
  skills: string[];
  experience: string;
  transports: string[];
  emergencyContact: string;
  emergencyPhone: string;
};

const availabilityOptions = [
  'weekday-morning',
  'weekday-afternoon',
  'weekday-evening',
  'weekend-morning',
  'weekend-afternoon',
  'weekend-evening',
  'emergency',
] as const;

const skillOptions = [
  { id: 'first-aid', icon: '🏥' },
  { id: 'cooking', icon: '🍳' },
  { id: 'driving', icon: '🚗' },
  { id: 'boating', icon: '⛵' },
  { id: 'drone', icon: '🚁' },
  { id: 'construction', icon: '🔧' },
  { id: 'counseling', icon: '💬' },
  { id: 'teaching', icon: '📚' },
  { id: 'translation', icon: '🌐' },
  { id: 'it', icon: '💻' },
  { id: 'photography', icon: '📸' },
  { id: 'swimming', icon: '🏊' },
  { id: 'general', icon: '🤝' },
] as const;

const transportOptions = {
  land: [
    { id: 'car', icon: Car },
    { id: 'suv', icon: Car },
    { id: 'motorcycle', icon: Car },
    { id: 'truck', icon: Car },
    { id: 'van', icon: Car },
    { id: 'bicycle', icon: Car },
  ],
  water: [
    { id: 'boat', icon: Ship },
    { id: 'speedboat', icon: Ship },
    { id: 'longtail', icon: Ship },
    { id: 'raft', icon: Ship },
    { id: 'jet-ski', icon: Ship },
  ],
  air: [
    { id: 'drone', icon: Plane },
    { id: 'large-drone', icon: Plane },
    { id: 'helicopter', icon: Plane },
    { id: 'ultralight', icon: Plane },
  ],
} as const;

const areas = [
  'พระนคร',
  'ดุสิต',
  'หนองจอก',
  'บางรัก',
  'บางเขน',
  'บางกะปิ',
  'ปทุมวัน',
  'ป้อมปราบศัตรูพ่าย',
  'พระโขนง',
  'มีนบุรี',
  'ลาดกระบัง',
  'ยานนาวา',
  'สัมพันธวงศ์',
  'พญาไท',
  'ธนบุรี',
  'บางกอกใหญ่',
  'ห้วยขวาง',
  'คลองสาน',
  'ตลิ่งชัน',
  'บางกอกน้อย',
  'บางขุนเทียน',
  'ภาษีเจริญ',
  'หนองแขม',
  'ราษฎร์บูรณะ',
  'บางพลัด',
  'ดินแดง',
  'บึงกุ่ม',
  'สาทร',
  'บางซื่อ',
  'จตุจักร',
  'บางคอแหลม',
  'ประเวศ',
  'คลองเตย',
  'สวนหลวง',
  'จอมทอง',
  'ดอนเมือง',
  'ราชเทวี',
  'ลาดพร้าว',
  'วัฒนา',
  'บางแค',
  'หลักสี่',
  'สายไหม',
  'คันนายาว',
  'สะพานสูง',
  'วังทองหลาง',
  'คลองสามวา',
  'บางนา',
  'ทวีวัฒนา',
  'ทุ่งครุ',
  'บางบอน',
];

const EMPTY_FORM: VolunteerFormData = {
  name: '',
  phone: '',
  email: '',
  age: '',
  area: '',
  availability: [],
  skills: [],
  experience: 'none',
  transports: [],
  emergencyContact: '',
  emergencyPhone: '',
};

export function VolunteerForm() {
  const t = useTranslations('home.volunteerForm');
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<VolunteerFormData>(EMPTY_FORM);

  const progress = useMemo(() => Math.round((step / 4) * 100), [step]);

  const toggleSelection = (key: 'availability' | 'skills' | 'transports', id: string) =>
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].includes(id) ? prev[key].filter((i) => i !== id) : [...prev[key], id],
    }));

  const handleSubmit = () => {
    const newVolunteer: Volunteer = {
      id: generateId(),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      skills: formData.skills,
      availability: formData.availability.join(', '),
      status: 'pending',
      assignedTasks: 0,
      verified: false,
      createdAt: new Date().toISOString(),
    };
    volunteerStorage.add(newVolunteer);
    toast.success(t('toastSuccess'));
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData(EMPTY_FORM);
    setStep(1);
    setSubmitted(false);
  };

  const canNext = useMemo(() => {
    if (step === 1) return formData.name && formData.phone;
    if (step === 2) return formData.area && formData.availability.length > 0;
    if (step === 3) return formData.skills.length > 0;
    if (step === 4) return true;
    return true;
  }, [step, formData]);

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg border border-green-200 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="mb-2 text-gray-900">{t('success.title')}</h2>
          <p className="mb-6 text-sm text-gray-600">{t('success.subtitle')}</p>
          <button
            onClick={resetForm}
            className="rounded-lg bg-primary px-6 py-2.5 text-white transition-colors hover:bg-[#e14a21]"
          >
            {t('success.again')}
          </button>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="text-sm text-gray-700">
            <p className="mb-1 text-gray-900">{t('success.nextTitle')}</p>
            <p className="text-xs text-gray-600">{t('success.nextSubtitle')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">{t('title')}</h2>
            <p className="text-sm text-gray-500">{t('subtitle')}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1 rounded-full">
              <div
                className={cn(
                  'h-2 rounded-full',
                  step >= s ? 'bg-primary' : 'bg-gray-200',
                  step === s && 'shadow-[0_0_0_2px_rgba(249,87,43,0.15)]'
                )}
              />
            </div>
          ))}
          <span className="text-xs text-gray-500">{progress}%</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {step === 1 && (
          <div className="space-y-4">
            <LabeledInput
              label={t('fields.name')}
              value={formData.name}
              onChange={(v) => setFormData((p) => ({ ...p, name: v }))}
              placeholder={t('fields.namePlaceholder')}
              required
            />
            <LabeledInput
              label={t('fields.phone')}
              value={formData.phone}
              onChange={(v) => setFormData((p) => ({ ...p, phone: v }))}
              placeholder={t('fields.phonePlaceholder')}
              required
            />
            <LabeledInput
              label={t('fields.email')}
              value={formData.email}
              onChange={(v) => setFormData((p) => ({ ...p, email: v }))}
              placeholder={t('fields.emailPlaceholder')}
            />
            <LabeledInput
              label={t('fields.age')}
              value={formData.age}
              onChange={(v) => setFormData((p) => ({ ...p, age: v }))}
              placeholder={t('fields.agePlaceholder')}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-700">
                {t('fields.area')}
              </label>
              <select
                value={formData.area}
                onChange={(e) => setFormData((p) => ({ ...p, area: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{t('fields.areaPlaceholder')}</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">
                {t('fields.availability')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availabilityOptions.map((option) => {
                  const active = formData.availability.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleSelection('availability', option)}
                      className={cn(
                        'rounded-lg border-2 px-3 py-2 text-left text-xs transition-all sm:text-sm',
                        active ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {t(`availability.${option}`)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-700">
                {t('fields.skills')}
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {skillOptions.map((skill) => {
                  const active = formData.skills.includes(skill.id);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => toggleSelection('skills', skill.id)}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left text-sm transition-all',
                        active ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <span>{skill.icon}</span>
                      <span>{t(`skills.${skill.id}`)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">
                {t('fields.experience')}
              </label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder={t('fields.experiencePlaceholder')}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-700">
                {t('fields.transport')}
              </label>
              <div className="space-y-3">
                {Object.entries(transportOptions).map(([group, options]) => (
                  <div key={group}>
                    <div className="mb-2 text-xs text-gray-500">
                      {t(`transportGroups.${group as 'land' | 'water' | 'air'}`)}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {options.map((option) => {
                        const Icon = option.icon;
                        const active = formData.transports.includes(option.id);
                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleSelection('transports', option.id)}
                            className={cn(
                              'flex items-center gap-2 rounded-lg border-2 px-3 py-2 text-left text-sm transition-all',
                              active ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{t(`transport.${option.id}`)}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <LabeledInput
                label={t('fields.emergencyContact')}
                value={formData.emergencyContact}
                onChange={(v) => setFormData((p) => ({ ...p, emergencyContact: v }))}
                placeholder={t('fields.emergencyContactPlaceholder')}
              />
              <LabeledInput
                label={t('fields.emergencyPhone')}
                value={formData.emergencyPhone}
                onChange={(v) => setFormData((p) => ({ ...p, emergencyPhone: v }))}
                placeholder={t('fields.emergencyPhonePlaceholder')}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>{t('buttons.back')}</span>
          </button>
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={!canNext}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-lg px-6 py-3 transition-colors',
              canNext ? 'bg-primary text-white hover:bg-[#e14a21]' : 'cursor-not-allowed bg-gray-200 text-gray-400'
            )}
          >
            <span>{t('buttons.next')}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white shadow-sm transition-colors hover:bg-[#e14a21]"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>{t('buttons.submit')}</span>
          </button>
        )}
      </div>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-700">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
