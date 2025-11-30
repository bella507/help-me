'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

type ShareLocationOptions = {
  title?: string;
  text?: string;
  includeMap?: boolean;
};

type UseShareLocationReturn = {
  isLoading: boolean;
  error: string | null;
  locationData: LocationData | null;
  shareLocation: (options?: ShareLocationOptions) => Promise<void>;
  getCurrentLocation: () => Promise<LocationData>;
  copyLocationToClipboard: () => Promise<void>;
};

const DEFAULT_OPTIONS: ShareLocationOptions = {
  title: 'ตำแหน่งของฉัน',
  text: 'ตำแหน่งที่ฉันอยู่ตอนนี้',
  includeMap: true,
};

/**
 * Custom hook สำหรับแชร์ตำแหน่งปัจจุบัน
 *
 * @example
 * ```tsx
 * const { shareLocation, isLoading, error, locationData } = useShareLocation();
 *
 * // แชร์ตำแหน่ง
 * await shareLocation({ title: 'ฉันอยู่ที่นี่!' });
 *
 * // คัดลอกลิงก์
 * await copyLocationToClipboard();
 *
 * // ดึงตำแหน่งอย่างเดียว
 * const location = await getCurrentLocation();
 * ```
 */
export function useShareLocation(): UseShareLocationReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  /**
   * ดึงตำแหน่งปัจจุบันจาก Geolocation API
   */
  const getCurrentLocation = useCallback(async (): Promise<LocationData> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const errorMsg = 'เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง';
        setError(errorMsg);
        setIsLoading(false);
        toast.error(errorMsg);
        reject(new Error(errorMsg));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const data: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };

          setLocationData(data);
          setIsLoading(false);
          resolve(data);
        },
        error => {
          let errorMsg = 'ไม่สามารถดึงตำแหน่งได้';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'คุณปิดการอนุญาตให้เข้าถึงตำแหน่ง กรุณาเปิดใน Settings';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'ไม่พบข้อมูลตำแหน่ง';
              break;
            case error.TIMEOUT:
              errorMsg = 'หมดเวลาในการดึงตำแหน่ง';
              break;
          }

          setError(errorMsg);
          setIsLoading(false);
          toast.error(errorMsg);
          reject(new Error(errorMsg));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  /**
   * สร้าง Google Maps URL จากพิกัด
   */
  const getMapUrl = useCallback((lat: number, lng: number): string => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }, []);

  /**
   * สร้างข้อความตำแหน่งแบบละเอียด
   */
  const formatLocationText = useCallback(
    (location: LocationData, options: ShareLocationOptions): string => {
      const { latitude, longitude, accuracy } = location;
      const { text, includeMap } = options;

      let message = text || DEFAULT_OPTIONS.text || '';
      message += `\n\n📍 พิกัด:\nLat: ${latitude.toFixed(6)}\nLng: ${longitude.toFixed(6)}`;
      message += `\n🎯 ความแม่นยำ: ${Math.round(accuracy)} เมตร`;

      if (includeMap) {
        message += `\n\n🗺️ ดูบน Google Maps:\n${getMapUrl(latitude, longitude)}`;
      }

      return message;
    },
    [getMapUrl]
  );

  /**
   * แชร์ตำแหน่งผ่าน Web Share API หรือคัดลอกลง Clipboard
   */
  const shareLocation = useCallback(
    async (options: ShareLocationOptions = {}): Promise<void> => {
      try {
        const location = await getCurrentLocation();
        const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
        const shareText = formatLocationText(location, mergedOptions);

        // ถ้ารองรับ Web Share API
        if (navigator.share) {
          await navigator.share({
            title: mergedOptions.title,
            text: shareText,
          });
          toast.success('แชร์ตำแหน่งสำเร็จ!');
        } else {
          // Fallback: คัดลอกไปยัง clipboard
          await navigator.clipboard.writeText(shareText);
          toast.success('คัดลอกตำแหน่งไปยังคลิปบอร์ดแล้ว!');
        }
      } catch (err) {
        // ไม่แสดง error ถ้าผู้ใช้ยกเลิกการแชร์
        if (err instanceof Error && err.name !== 'AbortError') {
          const errorMsg = err.message || 'เกิดข้อผิดพลาดในการแชร์ตำแหน่ง';
          setError(errorMsg);
          toast.error(errorMsg);
        }
      }
    },
    [getCurrentLocation, formatLocationText]
  );

  /**
   * คัดลอก Google Maps URL ไปยัง Clipboard
   */
  const copyLocationToClipboard = useCallback(async (): Promise<void> => {
    try {
      const location = await getCurrentLocation();
      const mapUrl = getMapUrl(location.latitude, location.longitude);

      await navigator.clipboard.writeText(mapUrl);
      toast.success('คัดลอกลิงก์แผนที่แล้ว!');
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'ไม่สามารถคัดลอกได้';
      setError(errorMsg);
      toast.error(errorMsg);
    }
  }, [getCurrentLocation, getMapUrl]);

  return {
    isLoading,
    error,
    locationData,
    shareLocation,
    getCurrentLocation,
    copyLocationToClipboard,
  };
}
