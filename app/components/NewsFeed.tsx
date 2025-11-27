import { useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  MapPin,
  X,
} from 'lucide-react';

interface NewsItem {
  id: string;
  type: 'alert' | 'info' | 'success';
  title: string;
  content: string;
  fullContent: string;
  date: string;
  location?: string;
  imageUrl: string;
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    type: 'alert',
    title: 'เตือนภัยน้ำท่วม พื้นที่จังหวัดภาคเหนือ',
    content:
      'กรมอุตุนิยมวิทยาเตือนประชาชนในพื้นที่ภาคเหนือตอนบนระวังฝนตกหนักและน้ำท่วมฉับพลัน...',
    fullContent:
      'กรมอุตุนิยมวิทยาเตือนประชาชนในพื้นที่ภาคเหนือตอนบนระวังฝนตกหนักและน้ำท่วมฉับพลันในวันที่ 24-26 พฤศจิกายน โดยเฉพาะพื้นที่ใกล้แม่น้ำและภูเขา\n\nสาเหตุมาจากพายุดีเปรสชันกำลังอ่อน���นทะเลจีนใต้เคลื่อนตัวเข้ามายังภาคเหนือของประเทศไทย คาดว่าจะมีฝนตกหนักถึงหนักมากในหลายพื้นที่\n\nขอให้ประชาชนในพื้นที่เสี่ยงเตรียมความพร้อมรับมือกับสถานการณ์ น้ำท่วมฉับพลัน และน้ำป่าไหลbred โดยเฉพาะบริเวณพื้นที่ลุ่มและใกล้ภูเขา\n\nหากพบเห็นสถานการณ์น้ำเริ่มสูงขึ้นให้รีบอพยพไปยังที่สูงทันที และติดต่อหน่วยงานที่เกี่ยวข้องโทร. 1784',
    date: '24 พ.ย. 2568',
    location: 'จังหวัดภาคเหนือ',
    imageUrl:
      'https://images.unsplash.com/photo-1653058221377-96690fa50146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwY2xvdWRzJTIwd2VhdGhlcnxlbnwxfHx8fDE3NjQxMzkxMTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    type: 'info',
    title: 'จุดแจกน้ำและอาหารฟรี',
    content:
      'ศูย์ช่วยเหลือฯ เปิดจุดแจกน้ำดื่มและอาหารสำหรับผู้ประสบภัย ที่หอประชุมเทศบาล...',
    fullContent:
      'ศูนย์ช่วยเหลือผู้ประสบภัยพิบัติเปิดจุดแจกน้ำดื่มและอาหารสำหรับผู้ประสบภัย ที่หอประชุมเทศบาล เปิดบริการทุกวัน เวลา 08:00-20:00 น.\n\nสิ่งที่แจกจ่าย:\n• น้ำดื่มสะอาด\n• อาหารกล่อง 3 มื้อต่อวัน\n• ข้าวสาร และอาหารแห้ง\n• นมสำหรับเด็กและผู้สูงอายุ\n• อุปกรณ์ทำความสะอาด\n\nผู้ประสบภัยสามารถมารับได้เองโดยนำบัตรประชาชนมาแสดง หรือหากไม่สะดวกสามารถโทรขอรับบริการส่งถึงบ้านได้ที่ โทร. 02-123-4567\n\nศูนย์ยังเปิดรับบริจาคสิ่งของจากผู้มีจิตศรัทธาด้วยครับ',
    date: '24 พ.ย. 2568',
    location: 'หอประชุมเทศบาล',
    imageUrl:
      'https://images.unsplash.com/photo-1593113630400-ea4288922497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZG9uYXRpb24lMjB2b2x1bnRlZXJzfGVufDF8fHx8MTc2NDEzOTExOXww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    type: 'success',
    title: 'พื้นที่น้ำลดแล้ว สามารถเดินทางกลับได้',
    content:
      'ประกาศให้ผู้อพยพในพื้นที่ตำบลบ้านใหม่สามารถเดินทางกลับบ้านได้แล้ว หลังจากระดับน้ำลดลง...',
    fullContent:
      'ประกาศให้ผู้อพยพในพื้นที่ตำบลบ้านใหม่สามารถเดินทางกลับบ้านได้แล้ว หลังจากระดับน้ำลดลงสู่ภาวะปกติ\n\nข้อแนะนำสำหรับการกลับบ้าน:\n\n1. ตรวจสอบโครงสร้างบ้านก่อนเข้าอยู่อาศัย\n2. ทำความสะอาดและฆ่าเชื้อโรค\n3. ระวังสัตว์มีพิษที่อาจเข้ามาหลบภัย\n4. ตรวจสอบระบบไฟฟ้าก่อนเปิดใช้งาน\n5. ทิ้งอาหารที่เสียหายแล้ว\n\nหากพบความเสียหายของบ้านเรือนสามารถแจ้งความประสงค์ขอรับเงินช่วยเหลือได้ที่สำนักงานเทศบาล หรือโทร. 02-345-6789\n\nทางเทศบาลจัดทีมอาสาสมัครช่วยทำความสะอาดบ้านให้กับผู้สูงอายุและผู้พิการ สามารถลงทะเบียนได้ที่เทศบาล',
    date: '23 พ.ย. 2568',
    location: 'ตำบลบ้านใหม่',
    imageUrl:
      'https://images.unsplash.com/photo-1758273705601-50b1b61f7e6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGhvbWUlMjByZWNvdmVyeXxlbnwxfHx8fDE3NjQxMzkxMTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    type: 'info',
    title: 'บริการตรวจสุขภาพฟรี',
    content:
      'โรงพยาบาลส่งเสริมสุขภาพตำบลจัดบริการตรวจสุขภาพและแจกยาฟรีสำหรับผู้ประสบภัย...',
    fullContent:
      'โรงพยาบาลส่งเสริมสุขภาพตำบลจัดบริการตรวจสุขภาพและแจกยาฟรีสำหรับผู้ประสบภัย พร้อมฉีดวัคซีนป้องกันโรคติดต่อ เปิดบริการทุกวัน\n\nบริการที่ให้:\n• ตรวจสุขภาพทั่วไป\n• วัดความดันโลหิต\n• ตรวจเบาหวาน\n• แจกยาพื้นฐาน\n• ฉีดวัคซีนป้องกันโรคติดต่อ (บาดทะยัก, ไข้หวัดใหญ่)\n• ให้คำปรึกษาด้านสุขภาพจิต\n\nเวลาให้บริการ: 08:00-16:00 น. (วันจันทร์-ศุกร์)\n\nกรณีฉุกเฉินหรือนอกเวลาทำการ โทร. 1669\n\nโปรดนำบัตรประชาชนมาแสดงเพื่อลงทะเบียน และหากมีประวัติการรักษาหรือใบสั่งยาเดิมกรุณานำมาด้วยครับ',
    date: '23 พ.ย. 2568',
    location: 'โรงพยาบาลส่งเสริมสุขภาพตำบล',
    imageUrl:
      'https://images.unsplash.com/photo-1665315469403-fde8e923f719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N0b3IlMjBudXJzZSUyMG1lZGljYWx8ZW58MXx8fHwxNzY0MTM5MTE5fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '5',
    type: 'alert',
    title: 'คำเตือนลมแรงและคลื่นสูง',
    content:
      'กรมอุตุนิยมวิทยาเตือนประชาชนในพื้นที่ชายฝั่งทะเลหลีกเลี่ยงการออกเรือ...',
    fullContent:
      'กรมอุตุนิยมวิทยาเตือนประชาชนในพื้นที่ชายฝั่งทะเลหลีกเลี่ยงการออกเรือในช่วงวันที่ 24-25 พฤศจิกายน เนื่องจากมีลมแรงและคลื่นสูง 2-3 เมตร\n\nประกาศสำคัญ:\n\nชาวประมงและเจ้าของเรือควร:\n• งดออกเรือในช่วงเวลาดังกล่าว\n• จอดเรือในที่ปลอดภัย ผูกเรือให้แน่นหนา\n• ติดตามข่าวสารพยากรณ์อากาศอย่างใกล้ชิด\n\nสำหรับประชาชนทั่วไป:\n• หลีกเลี่ยงการเล่นน้ำทะเล\n• ระวังคลื่นซัดฝั่ง\n• ย้ายสิ่งของบริเวณชายหาดไปยังที่สูง\n\nหากพบเห็นเหตุฉุกเฉิน โทร. 191 หรือศูนย์ประสานงานภัยพิบัติ โทร. 1784',
    date: '24 พ.ย. 2568',
    location: 'พื้นที่ชายฝั่งทะเล',
    imageUrl:
      'https://images.unsplash.com/photo-1721396921574-22cfad8f4819?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYmVhY2h8ZW58MXx8fHwxNzY0MDc5NzY2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '6',
    type: 'info',
    title: 'เปิดศูนย์พักพิงเพิ่มเติม 3 แห่ง',
    content:
      'เนื่องจากมีผู้ประสบภัยเพิ่มขึ้น จึงเปิดศูนย์พักพิงเพิ่มเติมเพื่อรองรับผู้อพยพ...',
    fullContent:
      'เนื่องจากมีผู้ประสบภัยเพิ่มขึ้นจากสถานการณ์น้ำท่วม จึงเปิดศูนย์พักพิงเพิ่มเติม 3 แห่ง เพื่อรองรับผู้อพยพ\n\nศูนย์พักพิงที่เปิดใหม่:\n\n1. โรงเรียนบ้านกลาง\n   - รองรับ: 150 คน\n   - สิ่งอำนวยความสะดวก: ห้องน้ำ, ไฟฟ้า, พัดลม\n   \n2. วัดใหม่พัฒนาราม\n   - รองรับ: 200 คน\n   - สิ่งอำนวยความสะดวก: ห้องน้ำ, ไฟฟ้า, เครื่องทำน้ำเย็น\n   \n3. ศาลาอเนกประสงค์ชุมชน\n   - รองรับ: 100 คน\n   - สิ่งอำนวยความสะดวก: ห้องน้ำ, ไฟฟ้า\n\nทุกศูนย์มีอาหารและน้ำดื่มเพียงพอ พร้อมเครื่องนอนและผ้าห่ม สามารถเข้าพักได้ตลอด 24 ชั่วโมง\n\nสอบถามข้อมูลเพิ่มเติม โทร. 02-456-7890',
    date: '24 พ.ย. 2568',
    location: 'หลายพื้นที่',
    imageUrl:
      'https://images.unsplash.com/photo-1760153560402-6e51ab6d26c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBzaGVsdGVyJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzY0MTM5MTIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function NewsFeed() {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const getIconAndColor = (type: NewsItem['type']) => {
    switch (type) {
      case 'alert':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          badgeBg: 'bg-red-100',
          badgeText: 'text-red-700',
          label: 'เตือนภัย',
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          badgeBg: 'bg-green-100',
          badgeText: 'text-green-700',
          label: 'อัพเดท',
        };
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          badgeBg: 'bg-blue-100',
          badgeText: 'text-blue-700',
          label: 'ข่าวสาร',
        };
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {mockNews.map(news => {
        const style = getIconAndColor(news.type);
        return (
          <div
            key={news.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all cursor-pointer flex flex-col"
            onClick={() => setSelectedNews(news)}
          >
            {/* Square Image */}
            <div className="relative aspect-square bg-gray-100">
              {/* <ImageWithFallback
                src={news.imageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
              /> */}
              <div className="absolute top-3 left-3">
                <span
                  className={`${style.badgeBg} ${style.badgeText} px-3 py-1 rounded-full text-xs shadow-sm`}
                >
                  {style.label}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-gray-900 mb-2 line-clamp-2">{news.title}</h3>

              <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-2 flex-1">
                {news.content}
              </p>

              {/* Meta Info */}
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{news.date}</span>
                </div>
                {news.location && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate text-xs">{news.location}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Modal for Full Content */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedNews(null)}
        >
          <div
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Square Image */}
            <div className="relative aspect-square bg-gray-100">
              {/* <ImageWithFallback
                src={selectedNews.imageUrl}
                alt={selectedNews.title}
                className="w-full h-full object-cover"
              /> */}
              <button
                onClick={() => setSelectedNews(null)}
                className="absolute top-3 right-3 bg-white rounded-full p-2.5 shadow-lg hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute bottom-3 left-3">
                <span
                  className={`${getIconAndColor(selectedNews.type).badgeBg} ${
                    getIconAndColor(selectedNews.type).badgeText
                  } px-3 py-1.5 rounded-full text-xs shadow-sm`}
                >
                  {getIconAndColor(selectedNews.type).label}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              {/* Title */}
              <h2 className="text-gray-900 mb-3">{selectedNews.title}</h2>

              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-gray-500 pb-4 mb-4 border-b border-gray-200">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{selectedNews.date}</span>
                </div>
                {selectedNews.location && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{selectedNews.location}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Full Content */}
              <div className="text-sm text-gray-700 leading-relaxed space-y-3 whitespace-pre-line">
                {selectedNews.fullContent}
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedNews(null)}
                className="mt-6 w-full px-4 py-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
