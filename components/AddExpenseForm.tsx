import React, { useState } from 'react';
import { Receipt, Check, ArrowRightLeft } from 'lucide-react';
import { Expense } from '../types';

interface AddExpenseFormProps {
  friends: string[];
  rate: number;
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onToast: (msg: string) => void;
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ friends, rate, onAddExpense, onToast }) => {
  const [payer, setPayer] = useState('');
  const [amount, setAmount] = useState('');
  const [item, setItem] = useState('');
  const [currency, setCurrency] = useState<'KRW' | 'TWD'>('KRW');

  const handleSubmit = () => {
    if (!payer) {
      onToast('請選擇是誰先付錢的');
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      onToast('請輸入正確的金額');
      return;
    }
    if (!item.trim()) {
      onToast('請輸入項目名稱 (例如: 晚餐)');
      return;
    }

    // Calculate standardized KRW amount
    // If TWD, convert to KRW using current rate. If KRW, keep as is.
    const finalKrwAmount = currency === 'TWD' ? numAmount * rate : numAmount;

    onAddExpense({
      payer,
      amount: Math.round(finalKrwAmount), // Standardized for calculation
      originalAmount: numAmount,          // User input
      currency: currency,
      item: item.trim(),
    });

    setAmount('');
    setItem('');
    onToast(`已儲存消費 (${currency})`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="bg-white border-b border-gray-100 p-4 font-bold text-gray-700 flex items-center gap-2">
        <Receipt className="w-5 h-5 text-green-600" />
        步驟二：記下一筆消費
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5">誰先付錢？</label>
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 appearance-none"
          >
            <option value="" disabled>請選擇付款人</option>
            {friends.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-7">
            <label className="flex justify-between items-center text-xs font-medium text-gray-500 mb-1.5">
              金額
              <div className="flex bg-gray-100 rounded p-0.5">
                <button 
                  onClick={() => setCurrency('KRW')}
                  className={`px-1.5 py-0.5 rounded text-[10px] transition-all ${currency === 'KRW' ? 'bg-white shadow text-blue-600 font-bold' : 'text-gray-400'}`}
                >
                  KRW
                </button>
                <button 
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={currency === 'KRW' ? "₩ 0" : "$ 0"}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                {currency}
              </div>
            </div>
          </div>
          <div className="col-span-5">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">項目</label>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              placeholder="例: 烤肉"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
            />
          </div>
        </div>

        {/* Currency Conversion Preview */}
        {amount && (
           <div className="text-xs text-gray-400 text-right flex items-center justify-end gap-1">
             <ArrowRightLeft className="w-3 h-3" />
             {currency === 'TWD' ? (
                <span>約 {Math.round(parseFloat(amount) * rate).toLocaleString()} KRW (以匯率 {rate} 計算)</span>
             ) : (
                <span>約 {Math.round(parseFloat(amount) / rate).toLocaleString()} TWD</span>
             )}
           </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-kr-blue hover:bg-blue-800 text-white rounded-lg font-medium shadow-md shadow-blue-200 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> 儲存這筆消費
        </button>
      </div>
    </div>
  );
};