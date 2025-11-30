'use client';

import { MapPin, Share2, Copy, Loader2 } from 'lucide-react';
import { useShareLocation } from '@/app/hooks';
import { cn } from '@/app/lib/utils';

type ShareLocationButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showCopyButton?: boolean;
  className?: string;
  onLocationShared?: (lat: number, lng: number) => void;
};

/**
 * Component ปุ่มสำหรับแชร์ตำแหน่งปัจจุบัน
 *
 * @example
 * ```tsx
 * <ShareLocationButton
 *   variant="primary"
 *   size="lg"
 *   showCopyButton
 *   onLocationShared={(lat, lng) => console.log(lat, lng)}
 * />
 * ```
 */
export function ShareLocationButton({
  variant = 'primary',
  size = 'md',
  showCopyButton = false,
  className,
  onLocationShared,
}: ShareLocationButtonProps) {
  const { getCurrentLocation, isLoading } = useShareLocation();

  const handleShare = async () => {
    try {
      const location = await getCurrentLocation();

      // Open Google Maps in new tab
      const mapUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
      window.open(mapUrl, '_blank');

      if (onLocationShared) {
        onLocationShared(location.latitude, location.longitude);
      }
    } catch {
      // Error handling is already done in the hook
    }
  };

  const handleCopy = async () => {
    try {
      const location = await getCurrentLocation();
      const mapUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

      await navigator.clipboard.writeText(mapUrl);

      if (onLocationShared) {
        onLocationShared(location.latitude, location.longitude);
      }
    } catch {
      // Error handling is already done in the hook
    }
  };

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-[#e14a21]',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    outline:
      'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  return (
    <div className={cn('flex gap-2', className)}>
      <button
        onClick={handleShare}
        disabled={isLoading}
        className={cn(
          'flex items-center justify-center gap-2 rounded-lg shadow-sm transition-all',
          variantClasses[variant],
          sizeClasses[size],
          isLoading && 'cursor-not-allowed opacity-60',
          !showCopyButton && 'flex-1'
        )}
      >
        {isLoading ? (
          <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
        ) : (
          <>
            <MapPin className={iconSizes[size]} />
            <span>แชร์ตำแหน่ง</span>
            <Share2 className={iconSizes[size]} />
          </>
        )}
      </button>

      {showCopyButton && (
        <button
          onClick={handleCopy}
          disabled={isLoading}
          className={cn(
            'flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white text-gray-700 shadow-sm transition-all hover:border-gray-300 hover:bg-gray-50',
            sizeClasses[size],
            isLoading && 'cursor-not-allowed opacity-60'
          )}
          title="คัดลอกลิงก์แผนที่"
        >
          <Copy className={iconSizes[size]} />
        </button>
      )}
    </div>
  );
}
