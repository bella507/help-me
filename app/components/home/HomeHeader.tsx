'use client';

import { cn } from '@/app/lib/utils';
import Image from 'next/image';

type HomeHeaderProps = {
  title: string;
};

export function HomeHeader({ title }: HomeHeaderProps) {
  return (
    <header className={cn('sticky top-0 z-50 bg-white')}>
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <div className=" relative w-[48px] h-[48px]">
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={48}
                height={48}
              />
            </div>
            <span className={cn('text-2xl font-bold text-gray-900')}>
              {title}
            </span>
          </div>
          {/* <div className="flex items-center gap-2">
            <NotificationCenter />
            <button
              onClick={onToggleDarkMode}
              className={cn(
                'rounded-lg p-2 transition-colors',
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-gray-700" />
              )}
            </button>
            <button
              onClick={onToggleLanguage}
              className={cn(
                'rounded-lg p-2 transition-colors',
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              <Globe className={cn('h-4 w-4', darkMode ? 'text-gray-300' : 'text-gray-700')} />
            </button>
            <span className={cn('text-xs', darkMode ? 'text-gray-200' : 'text-gray-700')}>
              {language.toUpperCase()}
            </span>
          </div> */}
        </div>
      </div>
    </header>
  );
}
