import React, { useState } from 'react';
import { Plane, Users, ArrowRight } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <Plane className="w-10 h-10 text-kr-blue" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">韓國旅遊分帳趣 🇰🇷</h1>
        <p className="text-gray-500 text-sm mb-8">
          輸入一個專屬代碼，和旅伴們一起即時記帳！
        </p>

        <div className="space-y-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-gray-500 mb-1 ml-1">旅遊群組代碼 (Room ID)</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="例如: SEOUL2024"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kr-blue focus:border-transparent font-medium uppercase tracking-wider"
                onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
              />
            </div>
          </div>

          <button
            onClick={handleJoin}
            disabled={!roomId.trim()}
            className="w-full py-3 bg-kr-blue hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 group"
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
    </div>
  );
};