import { useState } from 'react';
import { 
  User, 
  Phone as PhoneIcon, 
  MapPin, 
  Home,
  Utensils,
  Building2,
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
  Camera,
  X,
  Share2
} from 'lucide-react';
import { toast } from 'sonner';

interface FormData {
  name: string;
  phone: string;
  location: string;
  address: string;
  urgency: string;
  category: string;
  description: string;
  riskGroups: string[];
  riskGroupDetails: {
    elderly?: string;
    children?: string;
    disabled?: string;
    pregnant?: string;
    pets?: string;
    medical?: string;
  };
  specialNeeds: string;
  images: string[];
}

export function HelpRequestForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
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
    images: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requests = JSON.parse(localStorage.getItem('helpRequests') || '[]');
    const newRequest = {
      id: Date.now().toString(),
      ...formData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    requests.push(newRequest);
    localStorage.setItem('helpRequests', JSON.stringify(requests));
    
    toast.success('ส่งคำขอความช่วยเหลือเรียบร้อยแล้ว');
    
    setFormData({
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
      images: []
    });
    setStep(1);
  };

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const canProceed = () => {
    if (step === 1) return formData.name.trim() !== '' && formData.phone.trim() !== '';
    if (step === 2) return formData.location.trim() !== '';
    if (step === 3) return formData.category !== '' && formData.urgency !== '';
    if (step === 4) return true;
    if (step === 5) return true;
    return true;
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const toggleRiskGroup = (group: string) => {
    if (formData.riskGroups.includes(group)) {
      // Remove group
      const newGroups = formData.riskGroups.filter(g => g !== group);
      const newDetails = { ...formData.riskGroupDetails };
      delete newDetails[group as keyof typeof newDetails];
      setFormData({ ...formData, riskGroups: newGroups, riskGroupDetails: newDetails });
    } else {
      // Add group
      setFormData({ ...formData, riskGroups: [...formData.riskGroups, group] });
    }
  };

  const updateRiskGroupDetail = (group: string, value: string) => {
    setFormData({
      ...formData,
      riskGroupDetails: {
        ...formData.riskGroupDetails,
        [group]: value
      }
    });
  };

  const categories = [
    { value: 'food', label: 'อาหาร/น้ำ', icon: Utensils },
    { value: 'shelter', label: 'ที่พักพิง', icon: Home },
    { value: 'medical', label: 'พยาบาล', icon: Stethoscope },
    { value: 'clothing', label: 'เสื้อผ้า', icon: Shirt },
    { value: 'evacuation', label: 'อพยพ', icon: Car },
    { value: 'other', label: 'อื่นๆ', icon: Package }
  ];

  const riskGroupsOptions = [
    { value: 'elderly', label: 'ผู้สูงอายุ (60 ปีขึ้นไป)', icon: Users },
    { value: 'children', label: 'เด็กเล็ก (ต่ำกว่า 5 ปี)', icon: Baby },
    { value: 'disabled', label: 'ผู้พิการ/ผู้ป่วยติดเตียง', icon: Accessibility },
    { value: 'pregnant', label: 'หญิงมีครรภ์', icon: HeartPulse },
    { value: 'pets', label: 'สัตว์เลี้ยง', icon: PawPrint },
    { value: 'medical', label: 'ต้องการยาหรืออุปกรณ์ทางการแพทย์', icon: Pill }
  ];

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">ขั้นตอนที่ {step} จาก {totalSteps}</span>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 p-2.5 rounded-lg">
                <User className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-gray-900">ข้อมูลผู้ขอความช่วยเหลือ</h3>
                <p className="text-sm text-gray-500">ชื่อและเบอร์ติดต่อของคุณ</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  ชื่อ-นามสกุล <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  เบอร์โทรศัพท์ <span className="text-primary">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                  placeholder="0xx-xxx-xxxx"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 p-2.5 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-gray-900">ที่อยู่ของคุณ</h3>
                <p className="text-sm text-gray-500">เพื่อให้เราไปช่วยเหลือคุณได้</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  จังหวัด/อำเภอ <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                  placeholder="เช่น กรุงเทพมหานคร, เขตบางกอกน้อย"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  ที่อยู่โดยละเอียด (ถ้ามี)
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-gray-400"
                  placeholder="บ้านเลขที่ ถนน ตำบล"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Help Type */}
        {step === 3 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 p-2.5 rounded-lg">
                <Package className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-gray-900">ต้องการความช่วยเหลืออะไร</h3>
                <p className="text-sm text-gray-500">เลือกได้ 1 อย่าง</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.category === cat.value
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className={`w-6 h-6 mx-auto mb-2 ${
                      formData.category === cat.value ? 'text-primary' : 'text-gray-600'
                    }`} />
                    <div className={`text-sm ${
                      formData.category === cat.value ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {cat.label}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mb-6">
              <label className="block text-sm text-gray-700 mb-3">
                ระดับความเร่งด่วน <span className="text-primary">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: 'low' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.urgency === 'low'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Circle className={`w-5 h-5 mx-auto mb-1 ${
                    formData.urgency === 'low' ? 'text-green-500 fill-green-500' : 'text-gray-400'
                  }`} />
                  <div className="text-xs text-gray-900">ไม่เร่งด่วน</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: 'medium' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.urgency === 'medium'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <AlertCircle className={`w-5 h-5 mx-auto mb-1 ${
                    formData.urgency === 'medium' ? 'text-primary' : 'text-gray-400'
                  }`} />
                  <div className="text-xs text-gray-900">ปานกลาง</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: 'high' })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.urgency === 'high'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 mx-auto mb-1 ${
                    formData.urgency === 'high' ? 'text-red-500' : 'text-gray-400'
                  }`} />
                  <div className="text-xs text-gray-900">เร่งด่วน</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                อธิบายสถานการณ์ (ถ้ามี)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all placeholder:text-gray-400"
                placeholder="เช่น บ้านท่วมน้ำสูง 1 เมตร ต้องการอาหารและน้ำดื่ม"
              />
            </div>
          </div>
        )}

        {/* Step 4: Risk Groups */}
        {step === 4 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gray-100 p-2.5 rounded-lg">
                <Users className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-gray-900">กลุ่มเสี่ยงพิเศษ</h3>
                <p className="text-sm text-gray-500">เลือกได้หลายอย่าง (ถ้ามี)</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {riskGroupsOptions.map((group) => {
                const IconComponent = group.icon;
                const isSelected = formData.riskGroups.includes(group.value);
                
                return (
                  <div key={group.value}>
                    <button
                      type="button"
                      onClick={() => toggleRiskGroup(group.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className={`w-5 h-5 flex-shrink-0 ${
                          isSelected ? 'text-primary' : 'text-gray-600'
                        }`} />
                        <span className={`text-sm ${
                          isSelected ? 'text-gray-900' : 'text-gray-600'
                        }`}>
                          {group.label}
                        </span>
                        <div className="ml-auto">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-primary border-primary' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    {isSelected && (
                      <div className="mt-2 ml-11 mr-2">
                        <textarea
                          value={formData.riskGroupDetails[group.value as keyof typeof formData.riskGroupDetails] || ''}
                          onChange={(e) => updateRiskGroupDetail(group.value, e.target.value)}
                          rows={2}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all placeholder:text-gray-400 text-sm"
                          placeholder={
                            group.value === 'elderly' ? 'เช่น 2 คน, เคลื่อนไหวได้บ้าง, มีโรคเบาหวาน' :
                            group.value === 'children' ? 'เช่น 1 คน, อายุ 3 ขวบ' :
                            group.value === 'disabled' ? 'เช่น 1 คน, ใช้รถเข็น, ต้องการอุปกรณ์ช่วยเหลือ' :
                            group.value === 'pregnant' ? 'เช่น ตั้งครรภ์ 7 เดือน' :
                            group.value === 'pets' ? 'เช่น สุนัข 2 ตัว (ขนาดใหญ่) แมว 1 ตัว' :
                            'เช่น ยาความดันโลหิตสูง, เครื่องวัดน้ำตาล, ออกซิเจน'
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {formData.riskGroups.length === 0 && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                  หากไม่มีกลุ่มเสี่ยงพิเศษ กดถัดไปได้เลย
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2.5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-gray-900">ตรวจสอบข้อมูลก่อนส่ง</h3>
                <p className="text-sm text-gray-500">กรุณาตรวจสอบความถูกต้อง</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {/* Personal Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-gray-600" />
                  <div className="text-xs text-gray-600">ข้อมูลผู้ขอความช่วยเหลือ</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-900">{formData.name}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <PhoneIcon className="w-3.5 h-3.5" />
                    <span>{formData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <div className="text-xs text-gray-600">ที่อยู่</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-900">{formData.location}</div>
                  {formData.address && (
                    <div className="text-sm text-gray-600">{formData.address}</div>
                  )}
                </div>
              </div>

              {/* Help Type */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-gray-600" />
                  <div className="text-xs text-gray-600">ความช่วยเหลือที่ต้องการ</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">
                      {categories.find(c => c.value === formData.category)?.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs ${
                      formData.urgency === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : formData.urgency === 'medium' 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {formData.urgency === 'high' ? 'เร่งด่วน' : formData.urgency === 'medium' ? 'ปานกลาง' : 'ไม่เร่งด่วน'}
                    </span>
                  </div>
                  {formData.description && (
                    <div className="text-sm text-gray-600 pt-2 border-t border-gray-200">
                      {formData.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Risk Groups */}
              {formData.riskGroups.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-3">กลุ่มเสี่ยงพิเศษ</div>
                  <div className="space-y-3">
                    {formData.riskGroups.map((groupValue) => {
                      const group = riskGroupsOptions.find(g => g.value === groupValue);
                      const IconComponent = group?.icon || Users;
                      const detail = formData.riskGroupDetails[groupValue as keyof typeof formData.riskGroupDetails];
                      
                      return (
                        <div key={groupValue} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <IconComponent className="w-4 h-4 text-gray-700" />
                            <span className="text-sm text-gray-900">{group?.label}</span>
                          </div>
                          {detail && (
                            <div className="text-xs text-gray-600 ml-6 mt-1">
                              {detail}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Special Needs - Show if exists */}
              {formData.specialNeeds && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-2">ความต้องการพิเศษ</div>
                  <div className="text-sm text-gray-900">{formData.specialNeeds}</div>
                </div>
              )}
            </div>

            {/* Edit Special Needs */}
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                เพิ่มความต้องการพิเศษ (ถ้ามี)
              </label>
              <textarea
                value={formData.specialNeeds}
                onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all placeholder:text-gray-400 text-sm"
                placeholder="เช่น ไม่สามารถขึ้นบันไดได้, ต้องการอาหารอ่อน, แพ้อาหารทะเล"
              />
            </div>

            {/* Confirmation Notice */}
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-700">
                  <p className="text-gray-900 mb-1">ก่อนส่งคำขอ กรุณาตรวจสอบข้อมูล</p>
                  <p className="text-xs text-gray-600">
                    เราจะติดต่อกลับโดยเร็วที่สุด กรณีเร่งด่วนกรุณาโทร 191 หรือ 1669
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ย้อนกลับ</span>
            </button>
          )}
          
          {step < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                canProceed()
                  ? 'bg-primary hover:bg-[#e14a21] text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>ถัดไป</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-[#e14a21] text-white px-6 py-3 rounded-lg transition-colors shadow-sm"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>ส่งคำขอความช่วยเหลือ</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
}