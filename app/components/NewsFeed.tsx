import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle,
  MapPin,
  X,
} from 'lucide-react';
import type { NewsItem } from '@/app/types';
import { cn, formatDate, newsStorage } from '@/app/lib/utils';

type NewsFeedItem = NewsItem & {
  fullContent?: string;
  imageUrl?: string;
  location?: string;
};

const defaultNews: NewsFeedItem[] = [
  {
    id: '1',
    type: 'warning',
    title: 'เตือนภัยน้ำท่วม พื้นที่จังหวัดภาคเหนือ',
    content:
      'กรมอุตุนิยมวิทยาเตือนประชาชนในพื้นที่ภาคเหนือตอนบนระวังฝนตกหนักและน้ำท่วมฉับพลัน...',
    fullContent:
      'กรมอุตุนิยมวิทยาเตือนประชาชนในพื้นที่ภาคเหนือตอนบนระวังฝนตกหนักและน้ำท่วมฉับพลันในวันที่ 24-26 พฤศจิกายน โดยเฉพาะพื้นที่ใกล้แม่น้ำและภูเขา\n\nสาเหตุมาจากพายุดีเปรสชันกำลังอ่อนในทะเลจีนใต้เคลื่อนตัวเข้ามายังภาคเหนือของประเทศไทย คาดว่าจะมีฝนตกหนักถึงหนักมากในหลายพื้นที่\n\nขอให้ประชาชนในพื้นที่เสี่ยงเตรียมความพร้อมรับมือกับสถานการณ์น้ำท่วมฉับพลัน และน้ำป่าไหลหลาก โดยเฉพาะบริเวณพื้นที่ลุ่มและใกล้ภูเขา\n\nหากพบเห็นสถานการณ์น้ำเริ่มสูงขึ้นให้รีบอพยพไปยังที่สูงทันที และติดต่อหน่วยงานที่เกี่ยวข้องโทร. 1784',
    createdAt: new Date().toISOString(),
    location: 'จังหวัดภาคเหนือ',
    imageUrl:
      'https://images.unsplash.com/photo-1653058221377-96690fa50146?auto=format&fit=crop&w=1080&q=80',
    urgent: true,
  },
  {
    id: '2',
    type: 'info',
    title: 'จุดแจกน้ำและอาหารฟรี',
    content:
      'ศูย์ช่วยเหลือฯ เปิดจุดแจกน้ำดื่มและอาหารสำหรับผู้ประสบภัย ที่หอประชุมเทศบาล...',
    fullContent:
      'ศูนย์ช่วยเหลือผู้ประสบภัยพิบัติเปิดจุดแจกน้ำดื่มและอาหารสำหรับผู้ประสบภัย ที่หอประชุมเทศบาล เปิดบริการทุกวัน เวลา 08:00-20:00 น.\n\nสิ่งที่แจกจ่าย:\n• น้ำดื่มสะอาด\n• อาหารกล่อง 3 มื้อต่อวัน\n• ข้าวสาร และอาหารแห้ง\n• นมสำหรับเด็กและผู้สูงอายุ\n• อุปกรณ์ทำความสะอาด\n\nผู้ประสบภัยสามารถมารับได้เองโดยนำบัตรประชาชนมาแสดง หรือหากไม่สะดวกสามารถโทรขอรับบริการส่งถึงบ้านได้ที่ โทร. 02-123-4567\n\nศูนย์ยังเปิดรับบริจาคสิ่งของจากผู้มีจิตศรัทธาด้วยครับ',
    createdAt: new Date().toISOString(),
    location: 'หอประชุมเทศบาล',
    imageUrl:
      'https://images.unsplash.com/photo-1593113630400-ea4288922497?auto=format&fit=crop&w=1080&q=80',
    urgent: false,
  },
  {
    id: '3',
    type: 'update',
    title: 'พื้นที่น้ำลดแล้ว สามารถเดินทางกลับได้',
    content:
      'ประกาศให้ผู้อพยพในพื้นที่ตำบลบ้านใหม่สามารถเดินทางกลับบ้านได้แล้ว หลังจากระดับน้ำลดลง...',
    fullContent:
      'ประกาศให้ผู้อพยพในพื้นที่ตำบลบ้านใหม่สามารถเดินทางกลับบ้านได้แล้ว หลังจากระดับน้ำลดลงสู่ภาวะปกติ\n\nข้อแนะนำสำหรับการกลับบ้าน:\n1. ตรวจสอบโครงสร้างบ้านก่อนเข้าอยู่อาศัย\n2. ทำความสะอาดและฆ่าเชื้อโรค\n3. ระวังสัตว์มีพิษที่อาจเข้ามาหลบภัย\n4. ตรวจสอบระบบไฟฟ้าก่อนเปิดใช้งาน\n5. ทิ้งอาหารที่เสียหายแล้ว\n\nหากพบความเสียหายของบ้านเรือนสามารถแจ้งความประสงค์ขอรับเงินช่วยเหลือได้ที่สำนักงานเทศบาล หรือโทร. 02-345-6789\n\nทางเทศบาลจัดทีมอาสาสมัครช่วยทำความสะอาดบ้านให้กับผู้สูงอายุและผู้พิการ สามารถลงทะเบียนได้ที่เทศบาล',
    createdAt: new Date().toISOString(),
    location: 'ตำบลบ้านใหม่',
    imageUrl:
      'https://images.unsplash.com/photo-1758273705601-50b1b61f7e6c?auto=format&fit=crop&w=1080&q=80',
    urgent: false,
  },
];

export function NewsFeed() {
  const [selectedNews, setSelectedNews] = useState<NewsFeedItem | null>(null);
  const [news, setNews] = useState<NewsFeedItem[]>([]);

  useEffect(() => {
    const stored = newsStorage.getAll() as NewsFeedItem[];
    const timeout = window.setTimeout(() => {
      if (stored.length === 0) {
        newsStorage.save(defaultNews);
        setNews(defaultNews);
      } else {
        setNews(stored);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const cards = useMemo(() => news, [news]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map(item => (
        <NewsCard
          key={item.id}
          news={item}
          onSelect={() => setSelectedNews(item)}
        />
      ))}

      {selectedNews && (
        <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </div>
  );
}

function NewsCard({
  news,
  onSelect,
}: {
  news: NewsFeedItem;
  onSelect: () => void;
}) {
  const style = getStyle(news.type);
  return (
    <button
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-md"
      onClick={onSelect}
    >
      <div className="relative aspect-square bg-gray-100">
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs shadow-sm',
              style.badgeBg,
              style.badgeText
            )}
          >
            {style.label}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 line-clamp-2 text-gray-900">{news.title}</h3>
        <p className="mb-3 flex-1 line-clamp-2 text-sm leading-relaxed text-gray-600">
          {news.content}
        </p>
        <div className="flex items-center gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(news.createdAt)}</span>
          </div>
          {news.location && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1 truncate">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="truncate text-xs">{news.location}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </button>
  );
}

function NewsModal({
  news,
  onClose,
}: {
  news: NewsFeedItem;
  onClose: () => void;
}) {
  const style = getStyle(news.type);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative aspect-square bg-gray-100">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full bg-white p-2.5 shadow-lg transition-colors hover:bg-gray-50"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
          <div className="absolute bottom-3 left-3">
            <span
              className={cn(
                'rounded-full px-3 py-1.5 text-xs shadow-sm',
                style.badgeBg,
                style.badgeText
              )}
            >
              {style.label}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="mb-3 text-gray-900">{news.title}</h2>
          <div className="mb-4 flex items-center gap-3 border-b border-gray-200 pb-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(news.createdAt)}</span>
            </div>
            {news.location && (
              <>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{news.location}</span>
                </div>
              </>
            )}
          </div>

          <div className="whitespace-pre-line text-sm leading-relaxed text-gray-700">
            {news.fullContent || news.content}
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full rounded-lg bg-gray-100 px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}

function getStyle(type: NewsItem['type']) {
  if (type === 'warning') {
    return {
      icon: <AlertTriangle className="h-5 w-5" />,
      badgeBg: 'bg-red-100',
      badgeText: 'text-red-700',
      label: 'เตือนภัย',
    };
  }
  if (type === 'update') {
    return {
      icon: <CheckCircle className="h-5 w-5" />,
      badgeBg: 'bg-green-100',
      badgeText: 'text-green-700',
      label: 'อัพเดท',
    };
  }
  return {
    icon: <Info className="h-5 w-5" />,
    badgeBg: 'bg-blue-100',
    badgeText: 'text-blue-700',
    label: 'ข่าวสาร',
  };
}
