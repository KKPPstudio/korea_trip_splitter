import React, { useState, useEffect, useMemo } from 'react';
import { User, Wallet, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Expense } from '../types';

interface MyExpensesCardProps {
  friends: string[];
  expenses: Expense[];
  rate: number;
}

export const MyExpensesCard: React.FC<MyExpensesCardProps> = ({ friends, expenses, rate }) => {
  // Try to recover the last selected user from local storage
  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('kr_current_user') || '';
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('kr_current_user', currentUser);
    }
  }, [currentUser]);

  // Calculation Logic
  const stats = useMemo(() => {
    if (!currentUser || friends.length === 0) return null;

    // 1. Total expenses of the whole group
    const totalGroupExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // 2. My fair share (Average)
    const myShare = totalGroupExpense / friends.length;

    // 3. What I actually paid
    const myPaidExpenses = expenses.filter(e => e.payer === currentUser);
    const myTotalPaid = myPaidExpenses.reduce((acc, curr) => acc + curr.amount, 0);

    // 4. Balance (Positive = Receive, Negative = Pay)
    const balance = myTotalPaid - myShare;

    return {
      myTotalPaid,
      myShare,
      balance,
      myPaidExpenses
    };
  }, [currentUser, friends, expenses]);

  if (friends.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
        <User className="w-12 h-12 mx-auto mb-2 text-gray-200" />
        <p>請先在「消費記帳」分頁新增旅伴</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Identity Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <label className="block text-xs font-bold text-gray-500 mb-2">請問您是哪一位？</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-kr-blue" />
          <select
            value={currentUser}
            onChange={(e) => setCurrentUser(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-kr-blue focus:border-transparent appearance-none font-bold text-gray-700"
          >
            <option value="" disabled>點擊選擇您的名字</option>
            {friends.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
      </div>

      {stats ? (
        <>
          {/* Main Balance Card */}
          <div className={`rounded-xl shadow-sm border p-6 text-white text-center relative overflow-hidden ${
            stats.balance >= 0 
              ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-400' 
              : 'bg-gradient-to-br from-red-500 to-pink-600 border-red-400'
          }`}>
            <div className="relative z-10">
              <div className="text-sm font-medium opacity-90 mb-1">
                {stats.balance >= 0 ? '目前大家要給您' : '目前您需要支付'}
              </div>
              <div className="text-3xl font-bold mb-1">
                {Math.abs(Math.round(stats.balance)).toLocaleString()} ₩
              </div>
              <div className="text-xs opacity-75">
                ≈ {Math.abs(Math.round(stats.balance / rate)).toLocaleString()} TWD
              </div>
            </div>
            {/* Background Icon Decoration */}
            {stats.balance >= 0 ? (
              <TrendingUp className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10" />
            ) : (
              <TrendingDown className="absolute -bottom-4 -right-4 w-32 h-32 text-white opacity-10" />
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">您已墊付 (總計)</div>
              <div className="font-bold text-gray-800 text-lg">
                {stats.myTotalPaid.toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400">KRW (含台幣換算)</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">您的應付額</div>
              <div className="font-bold text-gray-800 text-lg">
                {Math.round(stats.myShare).toLocaleString()}
              </div>
              <div className="text-[10px] text-gray-400">KRW (平均分攤)</div>
            </div>
          </div>

          {/* Personal Expense List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-100 p-3 font-bold text-gray-700 text-sm flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              我支付的項目 ({stats.myPaidExpenses.length})
            </div>
            <div className="divide-y divide-gray-50">
              {stats.myPaidExpenses.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">
                  目前沒有您代墊的紀錄
                </div>
              ) : (
                stats.myPaidExpenses.map(ex => {
                   const currency = ex.currency || 'KRW';
                   const originalAmount = ex.originalAmount || ex.amount;
                   return (
                    <div key={ex.id} className="p-3 flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{ex.item}</div>
                        <div className="text-xs text-gray-400">{ex.date}</div>
                      </div>
                      <div className="text-right">
                        {currency === 'TWD' ? (
                          <>
                             <div className="font-bold text-kr-blue text-sm">{originalAmount.toLocaleString()} TWD</div>
                             <div className="text-[10px] text-gray-400">
                              (計: {ex.amount.toLocaleString()} ₩)
                             </div>
                          </>
                        ) : (
                          <>
                             <div className="font-bold text-kr-blue text-sm">{ex.amount.toLocaleString()} ₩</div>
                             <div className="text-[10px] text-gray-400">
                              ≈ {Math.round(ex.amount / rate).toLocaleString()} TWD
                             </div>
                          </>
                        )}
                      </div>
                    </div>
                   );
                })
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-gray-400 text-sm">
          請選擇您的名字以查看個人分析
        </div>
      )}
    </div>
  );
};