import React from 'react';
import { Home, History, PieChart, Settings, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { TranslationType } from '../lib/translations';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  t: TranslationType;
  onAddClick: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, t, onAddClick }) => {
  const tabs = [
    { id: 'dashboard', icon: Home, label: t.dashboard },
    { id: 'history', icon: History, label: t.history },
    { id: 'add', icon: Plus, label: '', isAction: true },
    { id: 'reports', icon: PieChart, label: t.reports },
    { id: 'settings', icon: Settings, label: t.settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 px-2 pb-safe-area-inset-bottom z-50">
      <div className="flex justify-between items-center h-16 max-w-lg mx-auto relative">
        {tabs.map((tab) => {
          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={onAddClick}
                className="flex items-center justify-center w-14 h-14 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-lg transform -translate-y-5 transition-transform active:scale-90"
              >
                <Plus size={32} />
              </button>
            );
          }
          
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex flex-col items-center justify-center flex-1 transition-colors relative",
                isActive ? "text-brand-600" : "text-slate-400"
              )}
            >
              <tab.icon size={24} className={cn("mb-1", isActive && "motion-preset-bounce motion-duration-300")} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.label}</span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-brand-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
