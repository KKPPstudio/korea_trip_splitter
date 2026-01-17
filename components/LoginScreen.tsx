import React, { useState } from 'react';
import { Plane, Users, ArrowRight, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onJoin: (roomId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');

  const handleJoin = () => {
    if (roomId.trim()) {
      onJoin(roomId.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-red-500 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden animate-fade-in">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      <div className="absolute top-1/4 right-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-2xl animate-pulse"></div>

      {/* Floating decorative icons */}
      <div className="absolute top-20 left-10 text-white/20 animate-bounce" style={{ animationDuration: '3s' }}>
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute bottom-32 right-8 text-white/20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <Plane className="w-10 h-10 rotate-12" />
      </div>

      <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-sm w-full relative z-10 border border-white/50">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/30">
            <Plane className="w-10 h-10 text-white -rotate-12" />
          </div>
        </div>

        <h1 className="text-2xl font-extrabold text-gray-800 mb-2 tracking-tight">韓國旅遊分帳趣</h1>
        <p className="text-gray-500 text-sm mb-8">
          輸入一個專屬代碼，和旅伴們一起即時記帳！ 🇰🇷
        </p>

        <div className="space-y-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-gray-500 mb-1.5 ml-1">旅遊群組代碼 (Room ID)</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="例如: SEOUL2024"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kr-blue focus:border-transparent font-bold uppercase tracking-wider transition-all placeholder:font-normal placeholder:text-gray-300"
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={!roomId.trim()}
            className="w-full py-3.5 bg-gradient-to-r from-kr-blue to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            開始記帳 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            請確保所有旅伴輸入相同的代碼，才能看到彼此的資料喔！
          </p>
        </div>
      </div>

      {/* Footer Credit */}
      <div className="absolute bottom-4 text-center text-white/50 text-xs">
        Made with ❤️ for Korea Trips
      </div>
    </div>
  );
};