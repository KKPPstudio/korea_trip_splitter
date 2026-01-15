import React from 'react';
import { PenLine, Calculator, User } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'record' | 'settlement' | 'mine';
  onTabChange: (tab: 'record' | 'settlement' | 'mine') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        <button
          onClick={() => onTabChange('record')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === 'record' 
              ? 'text-kr-blue font-bold' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <PenLine className={`w-6 h-6 mb-1 ${activeTab === 'record' ? 'fill-blue-50' : ''}`} />
          <span className="text-xs">消費記帳</span>
        </button>
        
        <div className="w-px h-8 bg-gray-200"></div>

        <button
          onClick={() => onTabChange('settlement')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === 'settlement' 
              ? 'text-kr-blue font-bold' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calculator className={`w-6 h-6 mb-1 ${activeTab === 'settlement' ? 'fill-blue-50' : ''}`} />
          <span className="text-xs">結算統計</span>
        </button>

        <div className="w-px h-8 bg-gray-200"></div>

        <button
          onClick={() => onTabChange('mine')}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            activeTab === 'mine' 
              ? 'text-kr-blue font-bold' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className={`w-6 h-6 mb-1 ${activeTab === 'mine' ? 'fill-blue-50' : ''}`} />
          <span className="text-xs">我的消費</span>
        </button>
      </div>
    </div>
  );
};