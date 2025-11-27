# 📋 คู่มือการ Refactor โปรเจกต์

## ✅ Phase 1: Foundation - เสร็จสมบูรณ์!

### สิ่งที่ทำไปแล้ว

#### 1. **โครงสร้างไดเรกทอรีใหม่**
```
app/
├── types/              # TypeScript types & interfaces
│   └── index.ts
├── lib/
│   ├── constants/      # Constants & configuration
│   │   ├── index.ts
│   │   └── areas.ts
│   └── utils/          # Utility functions
│       ├── index.ts
│       ├── storage.ts
│       ├── formatters.ts
│       └── badges.ts
└── components/         # (existing)
```

#### 2. **TypeScript Types** ([app/types/index.ts](app/types/index.ts))
ย้าย interfaces ทั้งหมดมาอยู่ที่เดียว:
- `HelpRequest`, `Volunteer`, `NewsItem`, `Shelter`
- `RiskArea`, `DonationNeed`, `FAQItem`, `Notification`
- `TabType`, `Language`, `UserRole`, `AdminTab`

#### 3. **Constants** ([app/lib/constants/index.ts](app/lib/constants/index.ts))
- `EMERGENCY_NUMBERS` - เบอร์ฉุกเฉิน (191, 1669, 1784)
- `REQUEST_STATUS`, `URGENCY_LEVELS`, `RISK_LEVELS`
- `HELP_CATEGORIES`, `STORAGE_KEYS`
- `CATEGORY_LABELS`, `STATUS_LABELS`, `URGENCY_LABELS`

#### 4. **Utility Functions**
- **Storage** ([app/lib/utils/storage.ts](app/lib/utils/storage.ts))
  - Generic storage operations
  - Specific helpers: `requestStorage`, `volunteerStorage`, `newsStorage`, etc.
- **Formatters** ([app/lib/utils/formatters.ts](app/lib/utils/formatters.ts))
  - Date formatting: `formatDate()`, `formatFullDate()`, `formatTime()`
  - Phone formatting: `formatPhoneNumber()`, `cleanPhoneNumber()`
  - ID generation: `generateId()`, `generateShortId()`
- **Badges** ([app/lib/utils/badges.ts](app/lib/utils/badges.ts))
  - `getStatusBadge()`, `getUrgencyBadge()`, `getRiskBadge()`
  - `getShelterStatusBadge()`, `getDonationStatusBadge()`

---

## 🚀 วิธีการใช้งาน

### 1. Import Types
```typescript
// Before
interface HelpRequest {
  id: string;
  name: string;
  // ...
}

// After
import type { HelpRequest } from '@/app/types';
```

### 2. ใช้ Constants
```typescript
// Before
if (status === 'pending') { ... }
const phone = '191';

// After
import { REQUEST_STATUS, EMERGENCY_NUMBERS } from '@/app/lib/constants';

if (status === REQUEST_STATUS.PENDING) { ... }
const phone = EMERGENCY_NUMBERS.POLICE;
```

### 3. ใช้ Storage Utilities
```typescript
// Before
const requests = JSON.parse(localStorage.getItem('helpRequests') || '[]');
localStorage.setItem('helpRequests', JSON.stringify(requests));

// After
import { requestStorage } from '@/app/lib/utils';

const requests = requestStorage.getAll();
requestStorage.save(requests);

// Or use specific methods
requestStorage.add(newRequest);
requestStorage.update(id, (req) => ({ ...req, status: 'completed' }));
requestStorage.remove(id);
```

### 4. ใช้ Formatters
```typescript
// Before
const date = new Date(dateString);
const formatted = date.toLocaleDateString('th-TH', { ... });

// After
import { formatDate, formatPhoneNumber } from '@/app/lib/utils';

const formatted = formatDate(dateString); // "2 ชั่วโมงที่แล้ว"
const phone = formatPhoneNumber('0812345678'); // "081-234-5678"
```

### 5. ใช้ Badge Helpers
```typescript
// Before
let bgClass, textClass;
switch (status) {
  case 'completed':
    bgClass = 'bg-green-100';
    textClass = 'text-green-700';
    break;
  // ...
}

// After
import { getStatusBadge } from '@/app/lib/utils';

const badge = getStatusBadge(status);
// badge = { text: 'เสร็จสิ้น', bgClass: 'bg-green-100', textClass: 'text-green-700', ... }
```

---

## 📝 ตัวอย่างการ Refactor Component

### ตัวอย่าง: RequestsList.tsx

**Before:**
```typescript
interface HelpRequest {
  id: string;
  name: string;
  // ...
}

export function RequestsList() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('helpRequests');
    setRequests(data ? JSON.parse(data) : []);
  }, []);

  const formatDate = (dateString: string) => {
    // ... complex date logic
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      // ... 20+ lines of switch case
    }
  };

  // ...
}
```

**After:**
```typescript
import type { HelpRequest } from '@/app/types';
import { requestStorage, formatDate, getStatusBadge } from '@/app/lib/utils';

export function RequestsList() {
  const [requests, setRequests] = useState<HelpRequest[]>([]);

  useEffect(() => {
    setRequests(requestStorage.getAll());
  }, []);

  // ... ที่เหลือเหมือนเดิม แต่เรียกใช้ formatDate() และ getStatusBadge()
}
```

**ประโยชน์:**
- ✅ ลดโค้ดลง 50+ บรรทัด
- ✅ Logic ใช้ร่วมกันได้
- ✅ Test ง่ายขึ้น
- ✅ Maintain ง่ายขึ้น

---

## 🎯 Next Steps (Phase 2 - Optional)

หากต้องการ refactor ต่อ ควรทำตามลำดับ:

### Phase 2: Shared Components
1. สร้าง `/app/components/shared/`
2. แยก reusable components:
   - `StatCard.tsx` - Card แสดงสถิติ
   - `SearchBar.tsx` - Search input
   - `StatusBadge.tsx` - Status badge component
   - `EmergencyButton.tsx` - ปุ่มโทรฉุกเฉิน

### Phase 3: Break Down Large Components
1. แยก `AdminDashboard.tsx` (1,989 บรรทัด)
2. แยก `page.tsx` (729 บรรทัด)
3. แยก `HelpRequestForm.tsx` (627 บรรทัด)

---

## ⚠️ สิ่งที่ต้องระวัง

1. **Import Paths**
   - ใช้ `@/app/types` สำหรับ types
   - ใช้ `@/app/lib/utils` สำหรับ utilities
   - ใช้ `@/app/lib/constants` สำหรับ constants

2. **ไม่ทำลายการทำงานเดิม**
   - ไฟล์เดิมยังทำงานได้ตามปกติ
   - ค่อยๆ refactor ทีละส่วน
   - Test หลัง refactor แต่ละไฟล์

3. **Type Safety**
   - ใช้ types จาก `/app/types/` แทนการประกาศซ้ำ
   - TypeScript จะช่วย catch errors

---

## 📊 ผลลัพธ์ที่ได้

### ก่อน Refactor
- ❌ Code duplication สูง (HelpRequest interface ซ้ำ 7 ไฟล์)
- ❌ Hardcoded values กระจายอยู่ทั่ว
- ❌ localStorage operations ซ้ำกัน 13 ไฟล์
- ❌ Badge logic ซ้ำกัน 5 ไฟล์

### หลัง Phase 1
- ✅ Types กำหนดไว้ที่เดียว
- ✅ Constants จัดการส่วนกลาง
- ✅ Storage operations มี helper functions
- ✅ Formatters และ Badge helpers ใช้ร่วมกันได้
- ✅ Build ผ่าน ไม่มี errors
- ✅ พร้อม refactor components ในขั้นตอนต่อไป

---

## 🛠 คำสั่งที่มีประโยชน์

```bash
# Build และ type check
npm run build

# Run dev server
npm run dev

# Check TypeScript errors
npx tsc --noEmit
```

---

## 📚 เอกสารเพิ่มเติม

- [app/types/index.ts](app/types/index.ts) - ทุก TypeScript types
- [app/lib/constants/index.ts](app/lib/constants/index.ts) - Constants
- [app/lib/utils/storage.ts](app/lib/utils/storage.ts) - Storage utilities
- [app/lib/utils/formatters.ts](app/lib/utils/formatters.ts) - Formatters
- [app/lib/utils/badges.ts](app/lib/utils/badges.ts) - Badge helpers

---

**สร้างเมื่อ:** 2025-01-27
**Phase:** 1 (Foundation) - ✅ Complete
**Build Status:** ✅ Passing
**Next Phase:** 2 (Shared Components) - Optional
