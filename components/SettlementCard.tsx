import React, { useMemo } from 'react';
import { Calculator, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Expense, BalanceDetail } from '../types';

interface SettlementCardProps {
  friends: string[];
  expenses: Expense[];
  rate: number;
}

export const SettlementCard: React.FC<SettlementCardProps> = ({ friends, expenses, rate }) => {
  const result = useMemo(() => {
    if (friends.length < 2) return { status: 'need_friends' };
    if (expenses.length === 0) return { status: 'no_expenses' };

    let balance: Record<string, number> = {};
    friends.forEach(f => balance[f] = 0);
    let total = 0;

    expenses.forEach(ex => {
      // Initialize if needed (defense against data inconsistency)
      if (balance[ex.payer] === undefined) balance[ex.payer] = 0;

      // Calculate split
      const splitTargets = ex.splitBy && ex.splitBy.length > 0 ? ex.splitBy : friends;
      const splitCount = splitTargets.length;

      if (splitCount > 0) {
        const splitAmount = ex.amount / splitCount;

        // Add debt to splitters
        splitTargets.forEach(target => {
          if (balance[target] === undefined) balance[target] = 0;
          balance[target] -= splitAmount; // They owe this amount
        });

        // Add credit to payer
        balance[ex.payer] += ex.amount; // They paid the full amount
      }

      total += ex.amount;
    });

    const average = total / friends.length; // Kept for display purposes ("Average spending per person")

    const details: BalanceDetail[] = friends.map(f => ({
      name: f,
      val: balance[f] // Net balance for settlement
    }));

    const debtors = details.filter(d => d.val < -1).sort((a, b) => a.val - b.val);
    const creditors = details.filter(d => d.val > 1).sort((a, b) => b.val - a.val);

    const transfers = [];
    let i = 0;
    let j = 0;

    // Clone to avoid mutating original details for display if needed elsewhere
    const dClone = debtors.map(d => ({ ...d }));
    const cClone = creditors.map(c => ({ ...c }));

    while (i < dClone.length && j < cClone.length) {
      const debtor = dClone[i];
      const creditor = cClone[j];

      const amount = Math.min(Math.abs(debtor.val), creditor.val);

      if (amount > 0) {
        transfers.push({
          from: debtor.name,
          to: creditor.name,
          amount: amount
        });
      }

      debtor.val += amount;
      creditor.val -= amount;

      if (Math.abs(debtor.val) < 1) i++;
      if (creditor.val < 1) j++;
    }

    return {
      status: 'calculated',
      total,
      average,
      transfers
    };
  }, [friends, expenses]);

  if (result.status === 'need_friends') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-kr-blue to-blue-500 text-white p-4 font-bold flex items-center gap-2">
          <Calculator className="w-5 h-5" /> 最終結帳
        </div>
        <div className="p-8 text-center text-gray-500 text-sm">
          請至少新增 2 位朋友<br />系統將自動開始計算分帳
        </div>
      </div>
    );
  }

  if (result.status === 'no_expenses') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-kr-blue to-blue-500 text-white p-4 font-bold flex items-center gap-2">
          <Calculator className="w-5 h-5" /> 最終結帳
        </div>
        <div className="p-8 text-center text-gray-500 text-sm">
          尚無消費紀錄<br />新增消費後將自動計算
        </div>
      </div>
    );
  }

  const { total, average, transfers } = result as any;
  const twdTotal = Math.round(total / rate);
  const twdAvg = Math.round(average / rate);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-blue-200 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-kr-blue to-blue-500 text-white p-4 font-bold flex items-center gap-2">
        <Calculator className="w-5 h-5" /> 最終結帳 (自動更新)
      </div>

      <div className="p-4 bg-blue-50">
        <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden p-4 text-center">
          <div className="text-xs text-gray-500 mb-1">總花費</div>
          <div className="font-bold text-gray-800 text-xl">{Math.round(total).toLocaleString()} ₩</div>
          <div className="text-xs text-gray-400">≈ {twdTotal.toLocaleString()} TWD</div>
        </div>
      </div>

      <div className="p-4">
        <h6 className="text-sm font-bold text-kr-blue mb-3 pb-2 border-b border-gray-100">
          最佳轉帳路徑：
        </h6>

        {transfers.length === 0 ? (
          <div className="text-center text-green-600 font-bold py-4 flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8" />
            完美！大家的帳已經平了，不用轉帳。
          </div>
        ) : (
          <div className="space-y-3">
            {transfers.map((t: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm border-l-[5px] border-l-kr-red hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600 text-lg">{t.from}</span>
                  <ArrowRight className="text-gray-300 w-4 h-4" />
                  <span className="font-bold text-green-600 text-lg">{t.to}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800">{Math.round(t.amount).toLocaleString()} ₩</div>
                  <div className="text-xs text-gray-500">≈ {Math.round(t.amount / rate).toLocaleString()} TWD</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};