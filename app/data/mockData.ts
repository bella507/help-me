// Mock Data for Disaster Relief Center
// ข้อมูลตัวอย่างสำหรับศูนย์ช่วยเหลือผู้ประสบภัย

export const mockHelpRequests = [
  {
    id: 'req001',
    name: 'สมชาย ใจดี',
    phone: '081-234-5678',
    location: 'หมู่ 3 ตำบลบางกรวย อำเภอบางกรวย จังหวัดนนทบุรี',
    category: 'food',
    urgency: 'high',
    description: 'ครอบครัว 5 คน ไม่มีอาหารและน้ำดื่ม น้ำท่วมสูงไม่สามารถออกจากบ้านได้',
    status: 'pending' as const,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    specialNeeds: {
      elderly: true,
      children: false,
      disabled: false,
      pregnant: false,
      pets: false,
      medical: false
    },
    elderlyCount: 2,
    childrenCount: 0
  },
  {
    id: 'req002',
    name: 'วิไล สุขสวัสดิ์',
    phone: '089-876-5432',
    location: 'หมู่ 7 ตำบลท่าทราย อำเภอเมือง จังหวัดนนทบุรี',
    category: 'medical',
    urgency: 'high',
    description: 'มีผู้ป่วยเบาหวานต้องการยาอินซูลิน และแม่ท้องแก่กำลังจะคลอด',
    status: 'in-progress' as const,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'v1',
    specialNeeds: {
      elderly: false,
      children: true,
      disabled: true,
      pregnant: true,
      pets: false,
      medical: true
    },
    pregnantCount: 1,
    childrenCount: 1,
    medicalNeeds: 'ยาอินซูลิน, อุปกรณ์วัดน้ำตาล',
    notes: 'รีบด่วนมาก แม่ท้องกำลังจะคลอด'
  },
  {
    id: 'req003',
    name: 'ประเสริฐ มั่นคง',
    phone: '062-345-6789',
    location: 'ซอยรามอินทรา 21 แขวงท่าแร้ง เขตบางเขน กรุงเทพฯ',
    category: 'evacuation',
    urgency: 'high',
    description: 'น้ำท่วมบ้านสูง 1.5 เมตร มีผู้สูงอายุติดเตียง 1 คน ต้องการความช่วยเหลือด่วน',
    status: 'pending' as const,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    specialNeeds: {
      elderly: true,
      children: false,
      disabled: true,
      pregnant: false,
      pets: true,
      medical: false
    },
    elderlyCount: 1,
    petsCount: 2,
    petsType: 'สุนัข 2 ตัว (ขนาดกลาง)'
  },
  {
    id: 'req004',
    name: 'สมหญิง รักษา',
    phone: '098-765-4321',
    location: 'หมู่ 5 ตำบลบางใหญ่ อำเภอบางใหญ่ จังหวัดนนทบุรี',
    category: 'shelter',
    urgency: 'medium',
    description: 'บ้านพังจากน้ำท่วม ต้องการที่พักชั่วคราวสำหรับครอบครัว 8 คน',
    status: 'completed' as const,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'v2',
    specialNeeds: {
      elderly: true,
      children: true,
      disabled: false,
      pregnant: false,
      pets: true,
      medical: false
    },
    elderlyCount: 2,
    childrenCount: 3,
    petsCount: 1,
    petsType: 'แมว 1 ตัว'
  },
  {
    id: 'req005',
    name: 'อนุชา ดีมาก',
    phone: '091-234-5678',
    location: 'หมู่ 12 ตำบลบางกระสอ อำเภอเมือง จังหวัดนนทบุรี',
    category: 'clothing',
    urgency: 'low',
    description: 'เสื้อผ้าเปียกหมด ต้องการเสื้อผ้าเปลี่ยนสำหรับครอบครัว มีเด็กเล็ก 2 คน',
    status: 'pending' as const,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    specialNeeds: {
      elderly: false,
      children: true,
      disabled: false,
      pregnant: false,
      pets: false,
      medical: false
    },
    childrenCount: 2
  },
  {
    id: 'req006',
    name: 'มานิตา สว่างจิต',
    phone: '085-678-9012',
    location: 'หมู่ 9 ตำบลบางเลน อำเภอบางใหญ่ จังหวัดนนทบุรี',
    category: 'food',
    urgency: 'medium',
    description: 'ครอบครัวใหญ่ 12 คน ต้องการอาหารและน้ำดื่ม มีเด็กทารก 3 คน ต้องการนมผง',
    status: 'in-progress' as const,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    assignedTo: 'v1',
    specialNeeds: {
      elderly: true,
      children: true,
      disabled: false,
      pregnant: false,
      pets: false,
      medical: false
    },
    elderlyCount: 2,
    childrenCount: 5,
    volunteerNotes: 'กำลังจัดเตรียมนมผงและอาหารเด็ก'
  },
  {
    id: 'req007',
    name: 'วีระ กล้าหาญ',
    phone: '092-345-6789',
    location: 'หมู่ 4 ตำบลบางกร่าง อำเภอเมือง จังหวัดนนทบุรี',
    category: 'medical',
    urgency: 'medium',
    description: 'ผู้สูงอายุป่วยโรคหัวใจ ยาหมด ต้องการยาหัวใจ',
    status: 'pending' as const,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    specialNeeds: {
      elderly: true,
      children: false,
      disabled: false,
      pregnant: false,
      pets: false,
      medical: true
    },
    elderlyCount: 1,
    medicalNeeds: 'ยาหัวใจ Atenolol 50mg, ยาลดความดันโลหิต'
  }
];

export const mockNews = [
  {
    id: 'news001',
    title: 'ประกาศเตือนพื้นที่เสี่ยงน้ำท่วม 5 จังหวัด',
    content: 'กรมอุตุนิยมวิทยาเตือน 5 จังหวัดภาคกลางเสี่ยงน้ำท่วมฉับพลัน ได้แก่ นนทบุรี ปทุมธานี พระนครศรีอยุธยา สิงห์บุรี และอ่างทอง เนื่องจากฝนตกหนักต่อเนื่อง ขอให้ประชาชนเตรียมพร้อมรับสถานการณ์ และติดตามข่าวสารอย่างใกล้ชิด',
    type: 'warning',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    urgent: true
  },
  {
    id: 'news002',
    title: 'เปิดศูนย์พักพิงเพิ่มเติม 3 แห่ง',
    content: 'จังหวัดนนทบุรีเปิดศูนย์พักพิงผู้ประสบอุทกภัยเพิ่มเติม 3 แห่ง ได้แก่ โรงเรียนวัดบางกระสอ โรงเรียนบ้านบางเลน และหอประชุมอำเภอบางกรวย พร้อมรองรับผู้ประสบภัยได้รวมกว่า 500 คน มีอาหาร น้ำดื่ม และเครื่องนอนเพียงพอ',
    type: 'update',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    urgent: false
  },
  {
    id: 'news003',
    title: 'กำหนดการแจกถุงยังชีพ วันที่ 25 พ.ย. 2567',
    content: 'ศูนย์ช่วยเหลือผู้ประสบภัยจะทำการแจกถุงยังชีพให้แก่ผู้ประสบภัยในวันที่ 25 พฤศจิกายน 2567 เวลา 09:00-16:00 น. ณ โรงเรียนวัดบางกระสอ และศาลาอเนกประสงค์อำเภอบางกรวย โดยผู้ที่ได้รับความเดือดร้อนสามารถนำบัตรประชาชนมาขึ้นทะเบียนรับถุงยังชีพได้',
    type: 'info',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    urgent: false
  },
  {
    id: 'news004',
    title: 'ระดับน้ำในเขื่อนเริ่มลดลง',
    content: 'กรมชลประทานรายงานว่าระดับน้ำในเขื่อนเจ้าพระยาและป่าสักชลสิทธิ์เริ่มลดลงแล้ว คาดว่าสถานการณ์น้ำท่วมจะคลี่คลายภายใน 3-5 วัน แต่ยังคงต้องติดตามสถานการณ์อย่างใกล้ชิด เนื่องจากยังมีพื้นที่ลุ่มที่ระบายน้ำไม่ทัน',
    type: 'update',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    urgent: false
  },
  {
    id: 'news005',
    title: 'เปิดรับบริจาคเสื้อผ้าและผ้าห่ม',
    content: 'ศูนย์ช่วยเหลือผู้ประสบภัยเปิดรับบริจาคเสื้อผ้าและผ้าห่มสำหรับผู้ประสบภัย โดยสามารถนำมาส่งได้ที่ศาลาว่าการจังหวัดนนทบุรี หรือที่ศูนย์พักพิงทั้ง 3 แห่ง ในเวลา 08:00-18:00 น. ทุกวัน',
    type: 'info',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    urgent: false
  },
  {
    id: 'news006',
    title: 'แจ้งเตือน! ระวังโรคระบาดหลังน้ำท่วม',
    content: 'กรมควบคุมโรคแจ้งเตือนให้ผู้ประสบภัยระวังโรคติดต่อหลังน้ำท่วม เช่น โรคท้องร่วง โรคผิวหนัง และโรคไข้เลือดออก แนะนำให้ดื่มน้ำสุก กินอาหารปรุงสุก และรักษาความสะอาดร่างกาย หากมีอาการป่วยให้รีบไปพบแพทย์ทันที',
    type: 'warning',
    createdAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(),
    urgent: true
  }
];

export const mockShelters = [
  {
    id: 'shelter001',
    name: 'โรงเรียนวัดบางกระสอ',
    location: 'หมู่ 4 ตำบลบางกระสอ อำเภอเมือง จังหวัดนนทบุรี',
    capacity: 200,
    currentOccupancy: 145,
    contact: '02-123-4567',
    facilities: ['น้ำดื่ม', 'อาหาร', 'เครื่องนอน', 'ห้องน้ำ', 'ไฟฟ้า'],
    status: 'available' as const
  },
  {
    id: 'shelter002',
    name: 'โรงเรียนบ้านบางเลน',
    location: 'หมู่ 9 ตำบลบางเลน อำเภอบางใหญ่ จังหวัดนนทบุรี',
    capacity: 150,
    currentOccupancy: 88,
    contact: '02-234-5678',
    facilities: ['น้ำดื่ม', 'อาหาร', 'เครื่องนอน', 'ห้องน้ำ', 'แพทย์ประจำ'],
    status: 'available' as const
  },
  {
    id: 'shelter003',
    name: 'หอประชุมอำเภอบางกรวย',
    location: 'หมู่ 3 ตำบลบางกรวย อำเภอบางกรวย จังหวัดนนทบุรี',
    capacity: 180,
    currentOccupancy: 180,
    contact: '02-345-6789',
    facilities: ['น้ำดื่ม', 'อาหาร', 'เครื่องนอน', 'ห้องน้ำ', 'เครื่องปรับอากาศ'],
    status: 'full' as const
  },
  {
    id: 'shelter004',
    name: 'ศาลาอเนกประสงค์วัดบางพลี',
    location: 'หมู่ 7 ตำบลบางพลี อำเภอบางพลี จังหวัดสมุทรปราการ',
    capacity: 120,
    currentOccupancy: 45,
    contact: '02-456-7890',
    facilities: ['น้ำดื่ม', 'อาหาร', 'เครื่องนอน', 'ห้องน้ำ'],
    status: 'available' as const
  },
  {
    id: 'shelter005',
    name: 'โรงเรียนบ้านบางใหญ่',
    location: 'หมู่ 5 ตำบลบางใหญ่ อำเภอบางใหญ่ จังหวัดนนทบุรี',
    capacity: 160,
    currentOccupancy: 122,
    contact: '02-567-8901',
    facilities: ['น้ำดื่ม', 'อาหาร', 'เครื่องนอน', 'ห้องน้ำ', 'พัดลม', 'แพทย์ประจำ'],
    status: 'available' as const
  }
];

export const mockRiskAreas = [
  {
    id: 'risk001',
    name: 'พื้นที่ริมแม่น้ำเจ้าพระยา',
    location: 'ตำบลบางกระสอ อำเภอเมือง จังหวัดนนทบุรี',
    level: 'high' as const,
    description: 'พื้นที่ลุ่มติดริมแม่น้ำเจ้าพระยา น้ำท่วมสูงกว่า 1 เมตร',
    estimatedAffected: 500,
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'risk002',
    name: 'ชุมชนบางพลัด',
    location: 'แขวงบางพลัด เขตบางพลัด กรุงเทพฯ',
    level: 'high' as const,
    description: 'พื้นที่ต่ำกว่าระดับน้ำทะเล น้ำระบายไม่ทัน',
    estimatedAffected: 800,
    lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'risk003',
    name: 'ตลาดบางเลน',
    location: 'ตำบลบางเลน อำเภอบางใหญ่ จังหวัดนนทบุรี',
    level: 'medium' as const,
    description: 'พื้นที่ชุมชนหนาแน่น น้ำท่วมขังประมาณ 30-50 ซม.',
    estimatedAffected: 300,
    lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'risk004',
    name: 'หมู่บ้านริมคลอง',
    location: 'ตำบลบางกรวย อำเภอบางกรวย จังหวัดนนทบุรี',
    level: 'medium' as const,
    description: 'คลองล้นตลิ่ง น้ำไหลแรง อาจเกิดดินสไลด์',
    estimatedAffected: 250,
    lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'risk005',
    name: 'พื้นที่การเกษตรบางใหญ่',
    location: 'ตำบลบางใหญ่ อำเภอบางใหญ่ จังหวัดนนทบุรี',
    level: 'low' as const,
    description: 'พื้นที่เกษตรกรรมน้ำท่วมสูง แต่ไม่มีชุมชนอยู่อาศัย',
    estimatedAffected: 50,
    lastUpdated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  }
];

export const mockDonations = [
  {
    id: 'donation001',
    category: 'food',
    item: 'ข้าวสาร',
    needed: 500,
    received: 320,
    unit: 'กก.'
  },
  {
    id: 'donation002',
    category: 'food',
    item: 'น้ำดื่ม',
    needed: 1000,
    received: 850,
    unit: 'ขวด'
  },
  {
    id: 'donation003',
    category: 'food',
    item: 'อาหารกระป๋อง',
    needed: 300,
    received: 180,
    unit: 'กระป๋อง'
  },
  {
    id: 'donation004',
    category: 'food',
    item: 'นมผง',
    needed: 100,
    received: 45,
    unit: 'กล่อง'
  },
  {
    id: 'donation005',
    category: 'clothing',
    item: 'เสื้อผ้าเด็ก',
    needed: 200,
    received: 95,
    unit: 'ชุด'
  },
  {
    id: 'donation006',
    category: 'clothing',
    item: 'เสื้อผ้าผู้ใหญ่',
    needed: 300,
    received: 220,
    unit: 'ชุด'
  },
  {
    id: 'donation007',
    category: 'medical',
    item: 'ผ้าพันแผล',
    needed: 100,
    received: 75,
    unit: 'ม้วน'
  },
  {
    id: 'donation008',
    category: 'medical',
    item: 'แอลกอฮอล์',
    needed: 50,
    received: 42,
    unit: 'ขวด'
  },
  {
    id: 'donation009',
    category: 'supplies',
    item: 'ผ้าห่ม',
    needed: 200,
    received: 145,
    unit: 'ผืน'
  },
  {
    id: 'donation010',
    category: 'supplies',
    item: 'หมอนหนุน',
    needed: 150,
    received: 88,
    unit: 'ใบ'
  },
  {
    id: 'donation011',
    category: 'hygiene',
    item: 'สบู่',
    needed: 200,
    received: 165,
    unit: 'ก้อน'
  },
  {
    id: 'donation012',
    category: 'hygiene',
    item: 'ยาสีฟัน',
    needed: 150,
    received: 92,
    unit: 'หลอด'
  }
];

export const mockFAQs = [
  {
    id: 'faq001',
    question: 'ขอความช่วยเหลืออย่างไร?',
    answer: 'สามารถขอความช่วยเหลือได้ผ่านแบบฟอร์มในหน้า "ขอความช่วยเหลือ" หรือโทร 1784 (24 ชม.) เจ้าหน้าที่จะติดต่อกลับภายใน 30 นาที',
    category: 'general'
  },
  {
    id: 'faq002',
    question: 'ศูนย์พักพิงมีอะไรบ้าง?',
    answer: 'ศูนย์พักพิงมีน้ำดื่ม อาหาร เครื่องนอน ห้องน้ำ ไฟฟ้า และแพทย์ประจำ สามารถพาสัตว์เลี้ยงได้ในบางศูนย์',
    category: 'shelter'
  },
  {
    id: 'faq003',
    question: 'ต้องเอาอะไรไปศูนย์พักพิงบ้าง?',
    answer: 'ควรนำบัตรประชาชน เอกสารสำคัญ ยา และเสื้อผ้าเปลี่ยน ศูนย์มีอุปกรณ์พื้นฐานให้แล้ว',
    category: 'shelter'
  },
  {
    id: 'faq004',
    question: 'บริจาคของได้ที่ไหน?',
    answer: 'สามารถบริจาคได้ที่ศาลาว่าการจังหวัด ศูนย์พักพิง หรืออำเภอ เวลา 08:00-18:00 น. ทุกวัน',
    category: 'donation'
  },
  {
    id: 'faq005',
    question: 'ต้องการยาและอุปกรณ์ทางการแพทย์ ติดต่อที่ไหน?',
    answer: 'โทร 1669 หรือแจ้งผ่านแบบฟอร์มขอความช่วยเหลือ เลือกประเภท "การรักษาพยาบาล" เจ้าหน้าที่จะจัดส่งให้โดยเร็ว',
    category: 'medical'
  },
  {
    id: 'faq006',
    question: 'สัตว์เลี้ยงเข้าศูนย์พักพิงได้ไหม?',
    answer: 'ได้ครับ ศูนย์พักพิงส่วนใหญ่รองรับสัตว์เลี้ยง แต่ต้องอยู่ในกรง/สายจูง และมีใบรับรองวัคซีน',
    category: 'pets'
  },
  {
    id: 'faq007',
    question: 'จะทราบสถานะคำขอความช่วยเหลือได้อย่างไร?',
    answer: 'ไปที่เมนู "ติดตามสถานะ" แล้วใส่เบอร์โทรศัพท์ที่ใช้ขอความช่วยเหลือ ระบบจะแสดงสถานะปัจจุบัน',
    category: 'general'
  },
  {
    id: 'faq008',
    question: 'มีรถรับส่งไปศูนย์พักพิงไหม?',
    answer: 'มีครับ โทร 1784 แจ้งความประสงค์ เจ้าหน้าที่จะส่งรถไปรับตามจุดนัดหมาย',
    category: 'transport'
  },
  {
    id: 'faq009',
    question: 'ต้องการเป็นอาสาสมัคร ต้องทำอย่างไร?',
    answer: 'กรอกแบบฟอร์มในหน้า "อาสาสมัคร" เจ้าหน้าที่จะติดต่อกลับภายใน 24 ชม. เพื่อยืนยันและนัดปฐมนิเทศ',
    category: 'volunteer'
  },
  {
    id: 'faq010',
    question: 'น้ำท่วมจะลดลงเมื่อไหร่?',
    answer: 'ตามการคาดการณ์ของกรมชลประทาน สถานการณ์จะดีขึ้นภายใน 3-5 วัน แต่ต้องติดตามข่าวสารอย่างใกล้ชิด',
    category: 'general'
  }
];

export const mockVolunteers = [
  {
    id: 'v1',
    name: 'สมศักดิ์ จิตอาสา',
    phone: '081-111-2222',
    email: 'somsak@email.com',
    skills: ['ขับรถ', 'ปฐมพยาบาล'],
    availability: 'ทุกวัน 08:00-18:00',
    status: 'approved' as const,
    assignedTasks: 3,
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'v2',
    name: 'สมใจ ช่วยเหลือ',
    phone: '089-222-3333',
    email: 'somjai@email.com',
    skills: ['ปรุงอาหาร', 'จัดการคลังสินค้า'],
    availability: 'จันทร์-ศุกร์ 09:00-17:00',
    status: 'approved' as const,
    assignedTasks: 2,
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'v3',
    name: 'วรรณา ดีงาม',
    phone: '092-333-4444',
    email: 'wanna@email.com',
    skills: ['พยาบาล', 'ดูแลเด็กและผู้สูงอายุ'],
    availability: 'เสาร์-อาทิตย์',
    status: 'approved' as const,
    assignedTasks: 1,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'v4',
    name: 'ประยุทธ มานะ',
    phone: '085-444-5555',
    email: 'prayut@email.com',
    skills: ['ช่างไฟฟ้า', 'ซ่อมแซมทั่วไป'],
    availability: 'ทุกวัน',
    status: 'pending' as const,
    assignedTasks: 0,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'v5',
    name: 'อรุณี สว่างใจ',
    phone: '098-555-6666',
    email: 'arunee@email.com',
    skills: ['ล่าม (อังกฤษ-พม่า)', 'ประสานงาน'],
    availability: 'จันทร์-ศุกร์ 13:00-20:00',
    status: 'pending' as const,
    assignedTasks: 0,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
];

export const mockNotifications = [
  {
    id: 'notif001',
    type: 'warning',
    title: 'เตือนพื้นที่เสี่ยง',
    message: 'พื้นที่ริมแม่น้ำเจ้าพระยา ระดับน้ำสูงขึ้น กรุณาเตรียมพร้อมอพยพ',
    time: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'notif002',
    type: 'success',
    title: 'ถุงยังชีพพร้อมแจก',
    message: 'ถุงยังชีพพร้อมแจกวันที่ 25 พ.ย. ที่โรงเรียนวัดบางกระสอ',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false
  },
  {
    id: 'notif003',
    type: 'info',
    title: 'อัปเดตสถานการณ์',
    message: 'ระดับน้ำในเขื่อนเริ่มลดลงแล้ว คาดสถานการณ์ดีขึ้นใน 3-5 วัน',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: 'notif004',
    type: 'success',
    title: 'เปิดศูนย์พักพิงใหม่',
    message: 'เปิดศูนย์พักพิงใหม่ที่โรงเรียนบ้านบางใหญ่ รองรับ 160 คน',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    read: true
  },
  {
    id: 'notif005',
    type: 'warning',
    title: 'ระวังโรคระบาด',
    message: 'ระวังโรคท้องร่วงและโรคผิวหนังหลังน้ำท่วม รักษาความสะอาด',
    time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: true
  }
];

// Function to initialize mock data in localStorage
export function initializeMockData() {
  // Check if data already exists
  const existingRequests = localStorage.getItem('helpRequests');
  
  // Force reinitialize if data structure is old (skills as string instead of array)
  const needsUpdate = () => {
    try {
      const volunteers = localStorage.getItem('volunteers');
      if (volunteers) {
        const parsed = JSON.parse(volunteers);
        if (parsed.length > 0 && typeof parsed[0].skills === 'string') {
          return true; // Old data structure
        }
      }
    } catch {
      return true;
    }
    return false;
  };
  
  // Only initialize if no data exists or data structure is outdated
  if (!existingRequests || JSON.parse(existingRequests).length === 0 || needsUpdate()) {
    localStorage.setItem('helpRequests', JSON.stringify(mockHelpRequests));
    localStorage.setItem('newsItems', JSON.stringify(mockNews));
    localStorage.setItem('shelters', JSON.stringify(mockShelters));
    localStorage.setItem('riskAreas', JSON.stringify(mockRiskAreas));
    localStorage.setItem('donationNeeds', JSON.stringify(mockDonations));
    localStorage.setItem('faqs', JSON.stringify(mockFAQs));
    localStorage.setItem('volunteers', JSON.stringify(mockVolunteers));
    localStorage.setItem('notifications', JSON.stringify(mockNotifications));
    
    console.log('✅ Mock data initialized successfully!');
    return true;
  }
  
  console.log('ℹ️ Data already exists in localStorage');
  return false;
}
