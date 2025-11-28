import { Phone, Shield } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

type EmergencyFooterProps = {
  emergencyLabel: string;
  onLogin: () => void;
  actions?: ReactNode;
};

export function EmergencyFooter({ emergencyLabel, onLogin, actions }: EmergencyFooterProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#e14a21] bg-primary">
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-white sm:gap-3">
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">{emergencyLabel}</span>
            <a
              href="tel:191"
              className="rounded bg-white/20 px-2.5 py-0.5 text-xs transition-colors hover:bg-white/30 sm:px-3 sm:py-1 sm:text-sm"
            >
              191
            </a>
            <span className="text-xs text-white/80 sm:text-sm">หรือ</span>
            <a
              href="tel:1669"
              className="rounded bg-white/20 px-2.5 py-0.5 text-xs transition-colors hover:bg-white/30 sm:px-3 sm:py-1 sm:text-sm"
            >
              1669
            </a>
          </div>
          <div className="flex items-center gap-2">
            {actions}
            <button
              onClick={onLogin}
              className={cn(
                'flex items-center gap-1.5 rounded border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white transition-colors hover:bg-white/20'
              )}
            >
              <Shield className="h-3.5 w-3.5 text-white" />
              เข้าสู่ระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
