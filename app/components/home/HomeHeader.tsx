'use client';

import { Globe, Heart, Moon, Sun } from 'lucide-react';
import type { Language } from '@/app/types';
import { cn } from '@/app/lib/utils';
import { NotificationCenter } from '../NotificationCenter';

type HomeHeaderProps = {
  darkMode: boolean;
  language: Language;
  title: string;
  onToggleDarkMode: () => void;
  onToggleLanguage: () => void;
};

export function HomeHeader({
  darkMode,
  language,
  title,
  onToggleDarkMode,
  onToggleLanguage,
}: HomeHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b',
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary p-2">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <span className={cn('text-sm', darkMode ? 'text-gray-100' : 'text-gray-900')}>
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </div>
    </header>
  );
}
