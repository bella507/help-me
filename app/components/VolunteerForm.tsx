import { useState } from 'react';
import { Users, CheckCircle2, ChevronRight, ChevronLeft, Car, Ship, Plane } from 'lucide-react';

interface VolunteerData {
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
}

const availabilityOptions = [
  { id: 'weekday-morning', label: 'วันธรรมดา เช้า' },
  { id: 'weekday-afternoon', label: 'วันธรรมดา บ่าย' },
  { id: 'weekday-evening', label: 'วันธรรมดา เย็น' },
  { id: 'weekend-morning', label: 'วันหยุด เช้า' },
  { id: 'weekend-afternoon', label: 'วันหยุด บ่าย' },
  { id: 'weekend-evening', label: 'วันหยุด เย็น' },
  { id: 'emergency', label: 'ตลอดเวลา (กรณีฉุกเฉิน)' }
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
  { id: 'general', label: 'งานทั่วไป', icon: '🤝' }
];

const transportOptions = {
  land: [
    { id: 'car', label: 'รถยนต์', icon: Car },
    { id: 'suv', label: 'รถ SUV/กระบะ', icon: Car },
    { id: 'motorcycle', label: 'มอเตอร์ไซค์', icon: Car },
    { id: 'truck', label: 'รถบรรทุก', icon: Car },
    { id: 'van', label: 'รถตู้', icon: Car },
    { id: 'bicycle', label: 'จักรยาน', icon: Car }
  ],
  water: [
    { id: 'boat', label: 'เรือยนต์', icon: Ship },
    { id: 'speedboat', label: 'เรือเร็ว', icon: Ship },
    { id: 'longtail', label: 'เรือหางยาว', icon: Ship },
    { id: 'raft', label: 'แพ/เรือพ���ย', icon: Ship },
    { id: 'jet-ski', label: 'เจ็ทสกี', icon: Ship }
  ],
  air: [
    { id: 'drone', label: 'โดรน (ขนาดเล็ก)', icon: Plane },
    { id: 'large-drone', label: 'โดรนขนาดใหญ่', icon: Plane },
    { id: 'helicopter', label: 'เฮลิคอปเตอร์', icon: Plane },
    { id: 'ultralight', label: 'เครื่องบินเล็ก', icon: Plane }
  ]
};

const areas = [
  'พระนคร', 'ดุสิต', 'หนองจอก', 'บางรัก', 'บางเขน', 'บางกะปิ', 'ปทุมวัน',
  'ป้อมปราบศัตรูพ่าย', 'พระโขนง', 'มีนบุรี', 'ลาดกระบัง', 'ยานนาวา', 'สัมพันธวงศ์',
  'พญาไท', 'ธนบุรี', 'บางกอกใหญ่', 'ห้วยขวาง', 'คลองสาน', 'ตลิ่งชัน', 'บางกอกน้อย',
  'บางขุนเทียน', 'ภาษีเจริญ', 'หนองแขม', 'ราษฎร์บูรณะ', 'บางพลัด', 'ดินแดง',
  'บึงกุ่ม', 'สาทร', 'บางซื่อ', 'จตุจักร', 'บางคอแหลม', 'ประเวศ', 'คลองเตย',
  'สวนหลวง', 'จอมทอง', 'ดอนเมือง', 'ราชเทวี', 'ลาดพร้าว', 'วัฒนา', 'บางแค',
  'หลักสี่', 'สายไหม', 'คันนายาว', 'สะพานสูง', 'วังทองหลาง', 'คลองสามวา',
  'บางนา', 'ทวีวัฒนา', 'ทุ่งครุ', 'บางบอน'
];

export function VolunteerForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<VolunteerData>({
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
    emergencyPhone: ''
  });

  const handleSubmit = () => {
    const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
    volunteers.push({
      ...formData,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString(),
      status: 'active'
    });
    localStorage.setItem('volunteers', JSON.stringify(volunteers));
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
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
      emergencyPhone: ''
    });
    setStep(1);
    setSubmitted(false);
  };

  const toggleAvailability = (id: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(id)
        ? prev.availability.filter(a => a !== id)
        : [...prev.availability, id]
    }));
  };

  const toggleSkill = (id: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(id)
        ? prev.skills.filter(s => s !== id)
        : [...prev.skills, id]
    }));
  };

  const toggleTransport = (id: string) => {
    setFormData(prev => ({
      ...prev,
      transports: prev.transports.includes(id)
        ? prev.transports.filter(t => t !== id)
        : [...prev.transports, id]
    }));
  };

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="bg-white border border-green-200 rounded-lg p-8 text-center">
          <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-gray-900 mb-2">ลงทะเบียนสำเร็จ</h2>
          <p className="text-sm text-gray-600 mb-6">
            ขอบคุณที่ร่วมเป็นอาสาสมัคร เราจะติดต่อกลับเมื่อมีกิจกรรมที่เหมาะสม
          </p>
          <button
            onClick={resetForm}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors"
          >
            ลงทะเบียนอีกครั้ง
          </button>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <div className="text-sm text-gray-700">
            <p className="text-gray-900 mb-1">ขั้นตอนต่อไป</p>
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
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2.5 rounded-lg">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-gray-900">ลงทะเบียนอาสาสมัคร</h2>
            <p className="text-sm text-gray-500">ร่วมเป็นส่วนหนึ่งในการช่วยเหลือผู้ประสบภัย</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full ${step >= s ? 'bg-primary' : 'bg-gray-200'}`} />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">ข้อมูลส่วนตัว</span>
          <span className="text-xs text-gray-500">ทักษะ</span>
          <span className="text-xs text-gray-500">เวลา</span>
          <span className="text-xs text-gray-500">ยืนยัน</span>
        </div>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-gray-900">ข้อมูลส่วนตัว</h3>

          <div>
            <label className="block text-sm text-gray-700 mb-2">ชื่อ-นามสกุล</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
              placeholder="กรอกชื่อ-นามสกุล"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-700 mb-2">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                placeholder="0XX-XXX-XXXX"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">อายุ</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                placeholder="25"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">อีเมล (ถ้ามี)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">เขต/พื้นที่</label>
            <select
              value={formData.area}
              onChange={(e) => setFormData({...formData, area: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
            >
              <option value="">เลือกเขต</option>
              {areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">พาหนะที่มี (เลือกได้หลายตัวเลือก)</label>
            
            {/* Land Transport */}
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                <span>ทางบก</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {transportOptions.land.map(transport => {
                  const Icon = transport.icon;
                  return (
                    <button
                      key={transport.id}
                      onClick={() => toggleTransport(transport.id)}
                      className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg border-2 transition-all ${
                        formData.transports.includes(transport.id)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs text-center">{transport.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Water Transport */}
            <div className="mb-3">
              <div className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5" />
                <span>ทางน้ำ</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {transportOptions.water.map(transport => {
                  const Icon = transport.icon;
                  return (
                    <button
                      key={transport.id}
                      onClick={() => toggleTransport(transport.id)}
                      className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg border-2 transition-all ${
                        formData.transports.includes(transport.id)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs text-center">{transport.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Air Transport */}
            <div>
              <div className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5" />
                <span>ทางอากาศ</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {transportOptions.air.map(transport => {
                  const Icon = transport.icon;
                  return (
                    <button
                      key={transport.id}
                      onClick={() => toggleTransport(transport.id)}
                      className={`flex flex-col items-center gap-1.5 px-3 py-2.5 rounded-lg border-2 transition-all ${
                        formData.transports.includes(transport.id)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs text-center">{transport.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                หากไม่มีพาหนะส่วนตัว ข้ามขั้นตอนนี้ได้เลย
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Skills */}
      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-gray-900">ทักษะและความสามารถ</h3>
          <p className="text-sm text-gray-600">เลือกได้มากกว่า 1 ข้อ</p>

          <div className="grid grid-cols-2 gap-2">
            {skillOptions.map(skill => (
              <button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  formData.skills.includes(skill.id)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <span className="text-xl">{skill.icon}</span>
                <span className="text-sm">{skill.label}</span>
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">ประสบการณ์อาสาสมัคร</label>
            <div className="space-y-2">
              {[
                { id: 'none', label: 'ไม่เคยเป็นอาสาสมัคร' },
                { id: 'some', label: 'เคยเป็นอาสาสมัคร 1-2 ครั้ง' },
                { id: 'experienced', label: 'มีประสบการณ์อาสาสมัครมากกว่า 3 ครั้ง' },
                { id: 'professional', label: 'เป็นอาสาสมัครประจำ' }
              ].map(exp => (
                <button
                  key={exp.id}
                  onClick={() => setFormData({...formData, experience: exp.id})}
                  className={`w-full px-4 py-2.5 rounded-lg border-2 transition-all text-left ${
                    formData.experience === exp.id
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  <span className="text-sm">{exp.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Availability */}
      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-gray-900">ช่วงเวลาที่สะดวก</h3>
          <p className="text-sm text-gray-600">เลือกได้มากกว่า 1 ช่วงเวลา</p>

          <div className="space-y-2">
            {availabilityOptions.map(option => (
              <button
                key={option.id}
                onClick={() => toggleAvailability(option.id)}
                className={`w-full px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  formData.availability.includes(option.id)
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <span className="text-sm">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm text-gray-900 mb-3">ผู้ติดต่อฉุกเฉิน</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-2">ชื่อผู้ติดต่อฉุกเฉิน</label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  placeholder="กรอกชื่อ"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">เบอร์โทรผู้ติดต่อฉุกเฉิน</label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none"
                  placeholder="0XX-XXX-XXXX"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h3 className="text-gray-900 mb-4">ตรวจสอบข้อมูล</h3>

          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">ข้อมูลส่วนตัว</div>
              <div className="text-sm text-gray-900">{formData.name}</div>
              <div className="text-sm text-gray-600">{formData.phone} • อายุ {formData.age} ปี</div>
              <div className="text-sm text-gray-600">{formData.area}</div>
              {formData.email && <div className="text-sm text-gray-600">{formData.email}</div>}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">ทักษะ</div>
              <div className="flex flex-wrap gap-1.5">
                {formData.skills.map(skillId => {
                  const skill = skillOptions.find(s => s.id === skillId);
                  return skill ? (
                    <span key={skillId} className="px-2 py-1 bg-white rounded text-xs text-gray-700 border border-gray-200">
                      {skill.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">พาหนะ</div>
              <div className="flex flex-wrap gap-1.5">
                {formData.transports.length > 0 ? (
                  formData.transports.map(transportId => {
                    const allTransports = [...transportOptions.land, ...transportOptions.water, ...transportOptions.air];
                    const transport = allTransports.find(t => t.id === transportId);
                    return transport ? (
                      <span key={transportId} className="px-2 py-1 bg-white rounded text-xs text-gray-700 border border-gray-200">
                        {transport.label}
                      </span>
                    ) : null;
                  })
                ) : (
                  <span className="text-xs text-gray-500">ไม่มีพาหนะส่วนตัว</span>
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-2">ช่วงเวลาที่สะดวก</div>
              <div className="flex flex-wrap gap-1.5">
                {formData.availability.map(availId => {
                  const avail = availabilityOptions.find(a => a.id === availId);
                  return avail ? (
                    <span key={availId} className="px-2 py-1 bg-white rounded text-xs text-gray-700 border border-gray-200">
                      {avail.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-xs text-gray-600 mb-1">ผู้ติดต่อฉุกเฉิน</div>
              <div className="text-sm text-gray-900">{formData.emergencyContact}</div>
              <div className="text-sm text-gray-600">{formData.emergencyPhone}</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors"
          >
            <span>ถัดไป</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-[#e14a21] text-white transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ลงทะเบียน</span>
          </button>
        )}
      </div>
    </div>
  );
}