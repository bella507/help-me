import type { HomeTab } from './TabNavigation';
import type { TabType } from '@/app/types';
import { cn } from '@/app/lib/utils';

type MenuOverlayProps = {
  open: boolean;
  menuLabel: string;
  items: (HomeTab & { description?: string })[];
  activeTab: TabType;
  onSelect: (tab: TabType) => void;
  onClose: () => void;
};

export function MenuOverlay({ open, menuLabel, items, activeTab, onSelect, onClose }: MenuOverlayProps) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed left-0 right-0 top-[120px] z-50 mx-auto max-w-7xl px-4 sm:top-[130px] sm:px-6 lg:top-[145px] lg:px-8">
        <div className="max-h-[70vh] overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-900 sm:text-base">{menuLabel}</h2>
              <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
                <span className="text-xl sm:text-2xl">×</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 p-2 sm:grid-cols-3 sm:p-3 lg:grid-cols-3">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelect(item.id);
                    onClose();
                  }}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-lg border-2 p-3 text-center transition-all sm:p-4',
                    isActive
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  <div>
                    <div className="text-xs sm:text-sm">{item.label}</div>
                    {item.description && (
                      <div className="mt-0.5 hidden text-[10px] text-gray-500 sm:block">{item.description}</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
