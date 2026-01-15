import React from 'react';
import { Plane } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-kr-blue to-kr-red text-white py-8 rounded-b-3xl shadow-lg mb-6">
      <div className="container mx-auto text-center px-4">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Plane className="w-6 h-6" />
          韓國旅遊分帳
        </h2>
        <p className="text-white/80 text-sm">輕鬆計算，開心吃喝 🇰🇷</p>
      </div>
    </div>
  );
};