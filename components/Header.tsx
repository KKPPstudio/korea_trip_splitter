import React from 'react';
import { Plane } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <div className="relative w-full bg-gradient-to-br from-kr-blue to-[#B91C1C] text-white pt-10 pb-16 rounded-b-[2.5rem] shadow-xl shadow-blue-900/10 mb-[-2rem] overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div className="container mx-auto text-center px-4 relative z-10">
        <h2 className="text-3xl font-extrabold mb-2 flex items-center justify-center gap-3 tracking-tight">
          <Plane className="w-7 h-7 -rotate-12 transform" />
          韓國旅遊分帳
        </h2>
        <p className="text-blue-50 font-medium text-sm tracking-wide opacity-90">輕鬆計算．開心吃喝 🇰🇷</p>
      </div>
    </div>
  );
};