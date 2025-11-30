'use client';

import { cn } from '@/app/lib/utils';
import Image from 'next/image';
import { UserProfile } from '../UserProfile';

type HomeHeaderProps = {
  title: string;
};

export function HomeHeader({ title }: HomeHeaderProps) {
  return (
    <header
      className={cn('sticky top-0 z-50 bg-white border-b border-gray-200')}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className=" relative w-[48px] h-[48px]">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={48}
                height={48}
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <span
                className={cn('text-lg md:text-2xl font-bold text-gray-900')}
              >
                {title}
              </span>
              <div className="flex items-center justify-start gap-2 lg:justify-start">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-green-200 bg-green-100 px-1 md:px-2 py-1 md:py-2">
                  <div className="relative">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                    <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs text-green-700">
                    พร้อมให้บริการตลอด 24 ชั่วโมง
                  </span>
                </div>
              </div>
            </div>
          </div>

          <UserProfile />
        </div>
      </div>
    </header>
  );
}
