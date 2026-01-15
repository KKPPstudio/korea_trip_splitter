import React, { useState } from 'react';
import { List, Trash2, X, Pencil, ArrowUpDown } from 'lucide-react';
import { Expense } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  rate: number;
  onDelete: (id: number) => void;
  onEdit: (expense: Expense) => void;
  onClear: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, rate, onDelete, onEdit, onClear }) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const sortedExpenses = [...expenses].sort((a, b) => {
    // 按字串比較日期 (格式為 MM/DD HH:mm，字串比較在同年份內有效)
    return sortOrder === 'desc' 
      ? b.date.localeCompare(a.date) 
      : a.date.localeCompare(b.date);
  });

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="bg-white border-b border-gray-100 p-4 flex justify-between items-center">
        <div className="font-bold text-gray-700 flex items-center gap-2">
          <List className="w-5 h-5 text-gray-500" />
          消費明細
          <button
            onClick={toggleSort}
            className="ml-1 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title={sortOrder === 'desc' ? "目前：新到舊 (點擊切換)" : "目前：舊到新 (點擊切換)"}
          >
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
        <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium text-right">
          <div>總計: {total.toLocaleString()} ₩</div>
          <div className="text-[10px] text-gray-400">≈ {Math.round(total / rate).toLocaleString()} TWD</div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {sortedExpenses.length === 0 ? (
          <div className="text-center text-gray-400 py-8 text-sm">
            還沒有消費紀錄
          </div>
        ) : (
          <div className="space-y-2">
            {sortedExpenses.map((ex) => {
              // Fallback for old data that might not have currency set
              const currency = ex.currency || 'KRW';
              const originalAmount = ex.originalAmount || ex.amount;
              
              return (
                <div key={ex.id} className="bg-white p-3 rounded-lg border-l-4 border-kr-blue shadow-sm hover:translate-x-0.5 transition-transform flex justify-between items-center group relative overflow-hidden">
                  <div className="flex-1">
                    <div className="font-bold text-gray-800 text-sm">{ex.item}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      <span className="text-kr-blue font-medium">{ex.payer}</span> 先付 • {ex.date}
                    </div>
                  </div>
                  <div className="text-right mr-8 group-hover:mr-16 transition-all duration-300">
                    {currency === 'TWD' ? (
                      <>
                         <div className="text-gray-800 font-bold text-sm">{originalAmount.toLocaleString()} TWD</div>
                         <div className="text-[10px] text-gray-400">換算: {ex.amount.toLocaleString()} KRW</div>
                      </>
                    ) : (
                      <>
                        <div className="text-kr-red font-bold text-sm">{ex.amount.toLocaleString()} ₩</div>
                        <div className="text-[10px] text-gray-400">≈ {Math.round(ex.amount / rate).toLocaleString()} TWD</div>
                      </>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="absolute right-0 top-0 bottom-0 flex transform translate-x-full group-hover:translate-x-0 transition-transform duration-200">
                    <button 
                      onClick={() => onEdit(ex)}
                      className="w-10 bg-blue-50 text-blue-500 flex items-center justify-center border-l border-blue-100 hover:bg-blue-100"
                      aria-label="編輯"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(ex.id)}
                      className="w-10 bg-red-50 text-red-500 flex items-center justify-center border-l border-red-100 hover:bg-red-100"
                      aria-label="刪除"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {expenses.length > 0 && (
        <div className="px-4 py-3 bg-white border-t border-gray-100 text-right">
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-700 flex items-center justify-end gap-1 ml-auto transition-colors"
          >
            <Trash2 className="w-3 h-3" /> 清空消費紀錄
          </button>
        </div>
      )}
    </div>
  );
};