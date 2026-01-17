import React from 'react';
import { PenLine, Calculator, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'record' | 'settlement' | 'mine';
  onTabChange: (tab: 'record' | 'settlement' | 'mine') => void;
}

const tabs = [
  { id: 'record' as const, label: '消費記帳', icon: PenLine },
  { id: 'settlement' as const, label: '結算統計', icon: Calculator },
  { id: 'mine' as const, label: '我的消費', icon: User },
];

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const activeIndex = tabs.findIndex(t => t.id === activeTab);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.08)] z-40 pb-safe">
      <div className="relative flex justify-around items-center h-16 max-w-lg mx-auto">
        {/* Sliding Indicator */}
        <div
          className="absolute bottom-0 h-0.5 bg-kr-blue rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${100 / tabs.length}%`,
            left: `${(activeIndex * 100) / tabs.length}%`,
          }}
        />

        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative ${isActive
                  ? 'text-kr-blue scale-105'
                  : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className={`text-xs transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};