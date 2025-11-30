'use client';

import { useSession, signOut } from 'next-auth/react';
import { LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export function UserProfile() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
        <span className="text-sm text-gray-600">กำลังโหลด...</span>
      </div>
    );
  }

  if (!session) {
    return <></>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border-0 md:border border-gray-200 bg-white  px-0 md:px-3 py-0 md:py-2 hover:bg-gray-50 transition-colors"
      >
        <div className="flex md:flex-row flex-col items-center gap-1">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User profile'}
              width={24}
              height={24}
              className="h-6 w-6 rounded-full"
            />
          )}
          <span className="text-xs md:text-sm text-gray-900">
            {session.user?.name || session.user?.email}
          </span>
        </div>
        <ChevronDown
          className={cn(
            'md:block hidden',
            'h-4 w-4 text-gray-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg z-50">
          <button
            onClick={() => {
              signOut();
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      )}
    </div>
  );
}
