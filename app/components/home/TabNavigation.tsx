import type { LucideIcon } from 'lucide-react';
import type { TabType } from '@/app/types';
import { cn } from '@/app/lib/utils';

export type HomeTab = { id: TabType; icon: LucideIcon; label: string };

type TabNavigationProps = {
  tabs: HomeTab[];
  activeTab: TabType;
  menuLabel: string;
  showMenu: boolean;
  menuIcon: LucideIcon;
  onSelect: (tab: TabType) => void;
  onToggleMenu: () => void;
};

export function TabNavigation({
  tabs,
  activeTab,
  menuLabel,
  showMenu,
  menuIcon,
  onSelect,
  onToggleMenu,
}: TabNavigationProps) {
  return (
    <div className="sticky top-[57px] z-40 border-b border-gray-200 bg-white sm:top-[65px] lg:top-[73px]">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="flex gap-0.5 overflow-x-auto scrollbar-hide lg:hidden">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onSelect={() => onSelect(tab.id)}
            />
          ))}
          <TabButton
            tab={{ id: 'menu' as TabType, icon: menuIcon, label: menuLabel }}
            active={showMenu}
            onSelect={onToggleMenu}
          />
        </div>

        <div className="hidden gap-1 lg:flex">
          {tabs.map(tab => (
            <TabButton
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onSelect={() => onSelect(tab.id)}
              fullWidth
            />
          ))}
          <TabButton
            tab={{ id: 'menu' as TabType, icon: menuIcon, label: menuLabel }}
            active={showMenu}
            onSelect={onToggleMenu}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}

function TabButton({
  tab,
  active,
  onSelect,
  fullWidth,
}: {
  tab: HomeTab;
  active: boolean;
  onSelect: () => void;
  fullWidth?: boolean;
}) {
  const TabIcon = tab.icon;
  return (
    <button
      onClick={onSelect}
      className={cn(
        'flex flex-col items-center gap-1.5 px-3 py-3 sm:px-4 transition-colors border-b-2',
        fullWidth ? 'flex-1' : 'shrink-0',
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-500 hover:text-gray-900'
      )}
    >
      <TabIcon className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="whitespace-nowrap text-[10px] sm:text-xs">
        {tab.label}
      </span>
    </button>
  );
}
