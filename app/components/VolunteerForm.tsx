import { useMemo, useState } from 'react';
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
  { id: 'weekday-morning', label: 'วันธรรมดา เช้า' },
  { id: 'weekday-afternoon', label: 'วันธรรมดา บ่าย' },
  { id: 'weekday-evening', label: 'วันธรรมดา เย็น' },
  { id: 'weekend-morning', label: 'วันหยุด เช้า' },
  { id: 'weekend-afternoon', label: 'วันหยุด บ่าย' },
  { id: 'weekend-evening', label: 'วันหยุด เย็น' },
  { id: 'emergency', label: 'ตลอดเวลา (กรณีฉุกเฉิน)' },
];

const skillOptions = [
  { id: 'first-aid', label: 'ปฐมพยาบาล', icon: '🏥' },
  { id: 'cooking', label: 'ทำอาหาร', icon: '🍳' },
  { id: 'driving', label: 'ขับรถ', icon: '🚗' },
  { id: 'boating', label: 'ขับเรือ', icon: '⛵' },
  { id: 'drone', label: 'บังคับโดรน', icon: '🚁' },
  { id: 'construction', label: 'ช่างซ่อมบำรุง', icon: '🔧' },
  { id: 'counseling', label: 'ให้คำปรึกษา', icon: '💬' },
  { id: 'teaching', label: 'สอน/ดูแลเด็ก', icon: '📚' },
  { id: 'translation', label: 'แปลภาษา', icon: '🌐' },
  { id: 'it', label: 'คอมพิวเตอร์/IT', icon: '💻' },
  { id: 'photography', label: 'ถ่ายภาพ/บันทึกข้อมูล', icon: '📸' },
  { id: 'swimming', label: 'ว่ายน้ำ/ช่วยชีวิตทางน้ำ', icon: '🏊' },
  { id: 'general', label: 'งานทั่วไป', icon: '🤝' },
];

const transportOptions = {
  land: [
    { id: 'car', label: 'รถยนต์', icon: Car },
    { id: 'suv', label: 'รถ SUV/กระบะ', icon: Car },
    { id: 'motorcycle', label: 'มอเตอร์ไซค์', icon: Car },
    { id: 'truck', label: 'รถบรรทุก', icon: Car },
    { id: 'van', label: 'รถตู้', icon: Car },
    { id: 'bicycle', label: 'จักรยาน', icon: Car },
  ],
  water: [
    { id: 'boat', label: 'เรือยนต์', icon: Ship },
    { id: 'speedboat', label: 'เรือเร็ว', icon: Ship },
    { id: 'longtail', label: 'เรือหางยาว', icon: Ship },
    { id: 'raft', label: 'แพ/เรือพยาบาล', icon: Ship },
    { id: 'jet-ski', label: 'เจ็ทสกี', icon: Ship },
  ],
  air: [
    { id: 'drone', label: 'โดรน (ขนาดเล็ก)', icon: Plane },
    { id: 'large-drone', label: 'โดรนขนาดใหญ่', icon: Plane },
    { id: 'helicopter', label: 'เฮลิคอปเตอร์', icon: Plane },
    { id: 'ultralight', label: 'เครื่องบินเล็ก', icon: Plane },
  ],
};

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
    toast.success('ลงทะเบียนสำเร็จ');
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
          <h2 className="mb-2 text-gray-900">ลงทะเบียนสำเร็จ</h2>
          <p className="mb-6 text-sm text-gray-600">
            ขอบคุณที่ร่วมเป็นอาสาสมัคร เราจะติดต่อกลับเมื่อมีกิจกรรมที่เหมาะสม
          </p>
          <button
            onClick={resetForm}
            className="rounded-lg bg-primary px-6 py-2.5 text-white transition-colors hover:bg-[#e14a21]"
          >
            ลงทะเบียนอีกครั้ง
          </button>
        </div>

        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
          <div className="text-sm text-gray-700">
            <p className="mb-1 text-gray-900">ขั้นตอนต่อไป</p>
            <p className="text-xs text-gray-600">
              ท่านจะได้รับการติดต่อกลับภายใน 3-5 วันทำการ เพื่อยืนยันการเป็นอาสาสมัครและรับข้อมูลการปฐมนิเทศ
            </p>
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
            <h2 className="text-gray-900">ลงทะเบียนอาสาสมัคร</h2>
            <p className="text-sm text-gray-500">ร่วมเป็นส่วนหนึ่งในการช่วยเหลือผู้ประสบภัย</p>
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
              label="ชื่อ-นามสกุล"
              value={formData.name}
              onChange={(v) => setFormData((p) => ({ ...p, name: v }))}
              placeholder="กรอกชื่อ-นามสกุล"
              required
            />
            <LabeledInput
              label="เบอร์โทรศัพท์"
              value={formData.phone}
              onChange={(v) => setFormData((p) => ({ ...p, phone: v }))}
              placeholder="0xx-xxx-xxxx"
              required
            />
            <LabeledInput
              label="อีเมล"
              value={formData.email}
              onChange={(v) => setFormData((p) => ({ ...p, email: v }))}
              placeholder="example@email.com"
            />
            <LabeledInput
              label="อายุ"
              value={formData.age}
              onChange={(v) => setFormData((p) => ({ ...p, age: v }))}
              placeholder="เช่น 30"
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-700">พื้นที่ที่สะดวก</label>
              <select
                value={formData.area}
                onChange={(e) => setFormData((p) => ({ ...p, area: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">เลือกพื้นที่</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">ช่วงเวลาที่สะดวก</label>
              <div className="grid grid-cols-2 gap-2">
                {availabilityOptions.map((option) => {
                  const active = formData.availability.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleSelection('availability', option.id)}
                      className={cn(
                        'rounded-lg border-2 px-3 py-2 text-left text-xs transition-all sm:text-sm',
                        active ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      {option.label}
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
              <label className="mb-2 block text-sm text-gray-700">ทักษะที่มี</label>
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
                      <span>{skill.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-gray-700">ประสบการณ์</label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData((p) => ({ ...p, experience: e.target.value }))}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="เช่น เคยช่วยงานอาสา/กู้ภัยที่ไหน ประสบการณ์ด้านใด"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm text-gray-700">พาหนะ/อุปกรณ์ที่มี</label>
              <div className="space-y-3">
                {Object.entries(transportOptions).map(([group, options]) => (
                  <div key={group}>
                    <div className="mb-2 text-xs text-gray-500">
                      {group === 'land' ? 'ทางบก' : group === 'water' ? 'ทางน้ำ' : 'ทางอากาศ'}
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
                            <span>{option.label}</span>
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
                label="ชื่อผู้ติดต่อกรณีฉุกเฉิน"
                value={formData.emergencyContact}
                onChange={(v) => setFormData((p) => ({ ...p, emergencyContact: v }))}
                placeholder="ชื่อ-นามสกุล"
              />
              <LabeledInput
                label="เบอร์ติดต่อฉุกเฉิน"
                value={formData.emergencyPhone}
                onChange={(v) => setFormData((p) => ({ ...p, emergencyPhone: v }))}
                placeholder="0xx-xxx-xxxx"
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
            <span>ย้อนกลับ</span>
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
            <span>ถัดไป</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-white shadow-sm transition-colors hover:bg-[#e14a21]"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span>ส่งข้อมูลอาสาสมัคร</span>
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
