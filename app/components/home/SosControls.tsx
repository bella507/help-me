'use client';

import { useState } from 'react';
import { AlertOctagon, Phone, Share2 } from 'lucide-react';
import { cn } from '@/app/lib/utils';

type SosControlsProps = {
  onRequest: () => void;
};

export function SosControls({ onRequest }: SosControlsProps) {
  const [open, setOpen] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'ต้องการความช่วยเหลือฉุกเฉิน!',
        text: 'ฉันอยู่ในสถานการณ์ฉุกเฉิน กรุณาช่วยเหลือ!',
      });
    }
    setOpen(false);
    onRequest();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'fixed bottom-20 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-2xl transition-all hover:bg-red-700 hover:animate-none sm:bottom-28 sm:right-6 sm:h-16 sm:w-16 animate-pulse'
        )}
      >
        <AlertOctagon className="h-7 w-7 text-white sm:h-8 sm:w-8" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-100 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-100 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2">
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="bg-red-600 p-6 text-center">
                <AlertOctagon className="mx-auto mb-3 h-16 w-16 text-white" />
                <h2 className="text-xl text-white">SOS ฉุกเฉิน</h2>
                <p className="mt-1 text-sm text-red-100">
                  โทรออกทันทีในสถานการณ์อันตราย
                </p>
              </div>

              <div className="space-y-3 p-6">
                <a
                  href="tel:191"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-white shadow-lg transition-colors hover:bg-red-700"
                >
                  <Phone className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-lg">โทร 191</div>
                    <div className="text-xs text-red-100">
                      ศูนย์รับแจ้งเหตุฉุกเฉิน
                    </div>
                  </div>
                </a>

                <a
                  href="tel:1669"
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-4 text-white shadow-lg transition-colors hover:bg-red-700"
                >
                  <Phone className="h-6 w-6" />
                  <div className="text-left">
                    <div className="text-lg">โทร 1669</div>
                    <div className="text-xs text-red-100">
                      รถฉุกเฉินการแพทย์
                    </div>
                  </div>
                </a>

                <button
                  onClick={handleShare}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-orange-600 px-6 py-4 text-white transition-colors hover:bg-orange-700"
                >
                  <Share2 className="h-5 w-5" />
                  <span>แชร์ตำแหน่งฉุกเฉิน</span>
                </button>

                <button
                  onClick={() => setOpen(false)}
                  className="w-full rounded-xl border-2 border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:border-gray-400"
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
