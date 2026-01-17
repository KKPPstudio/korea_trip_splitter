import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRightLeft } from 'lucide-react';
import { Expense } from '../types';
import { SplitSelector } from './SplitSelector';

interface EditExpenseModalProps {
  expense: Expense;
  friends: string[];
  rate: number;
  onSave: (updatedExpense: Expense) => void;
  onCancel: () => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, friends, rate, onSave, onCancel }) => {
  const [payer, setPayer] = useState(expense.payer);
  const [item, setItem] = useState(expense.item);
  const [date, setDate] = useState(expense.date);

  const [currency, setCurrency] = useState<'KRW' | 'TWD'>(expense.currency || 'KRW');
  const [inputAmount, setInputAmount] = useState((expense.originalAmount || expense.amount).toString());
  const [splitBy, setSplitBy] = useState<string[]>([]);

  useEffect(() => {
    setPayer(expense.payer);
    setItem(expense.item);
    setDate(expense.date);
    setCurrency(expense.currency || 'KRW');
    setInputAmount((expense.originalAmount || expense.amount).toString());

    if (expense.splitBy && expense.splitBy.length > 0) {
      setSplitBy(expense.splitBy);
    } else {
      setSplitBy(friends);
    }
  }, [expense, friends]);

  const handleSubmit = () => {
    const numAmount = parseFloat(inputAmount);
    if (!payer || isNaN(numAmount) || numAmount <= 0 || !item.trim() || !date.trim()) {
      return;
    }
    if (splitBy.length === 0) {
      alert('至少要有一人分攤消費');
      return;
    }

    const finalKrwAmount = currency === 'TWD' ? numAmount * rate : numAmount;

    onSave({
      ...expense,
      payer,
      amount: Math.round(finalKrwAmount),
      originalAmount: numAmount,
      currency: currency,
      item: item.trim(),
      date: date.trim(),
      ...(splitBy.length < friends.length && splitBy.length > 0 ? { splitBy } : {}), // Only include if not all selected
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-10">
          <h3 className="font-bold text-gray-700">編輯消費紀錄</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">付款人</label>
            <select
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 appearance-none"
            >
              {friends.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Shared Split Selector Component */}
          <SplitSelector
            friends={friends}
            selectedSplitters={splitBy}
            onChange={setSplitBy}
          />

          <div>
            <label className="flex justify-between items-center text-xs font-medium text-gray-500 mb-1.5">
              金額
              <div className="flex bg-gray-100 rounded p-0.5">
                <button
                  type="button"
                  onClick={() => setCurrency('KRW')}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${currency === 'KRW' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-400'}`}
                >
                  KRW
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('TWD')}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${currency === 'TWD' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-400'}`}
                >
                  TWD
                </button>
              </div>
            </label>
            <div className="relative">
              <input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                {currency}
              </div>
            </div>
            {inputAmount && (
              <div className="text-xs text-gray-400 text-right mt-1 flex items-center justify-end gap-1">
                <ArrowRightLeft className="w-3 h-3" />
                {currency === 'TWD' ? (
                  <span>更新為: {Math.round(parseFloat(inputAmount) * rate).toLocaleString()} KRW</span>
                ) : (
                  <span>約: {Math.round(parseFloat(inputAmount) / rate).toLocaleString()} TWD</span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">項目</label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">日期時間</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="例如: 05/20 14:30"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-2.5 bg-kr-blue text-white rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> 儲存變更
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};