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
                <div key={ex.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group">
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-bold text-gray-800 text-sm truncate">{ex.item}</div>
                    <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-kr-blue shrink-0"></span>
                      <span className="text-kr-blue font-medium">{ex.payer}</span>
                      <span className="text-gray-300">|</span>
                      {ex.date}
                      {ex.splitBy && (
                        <>
                          <span className="text-gray-300">|</span>
                          <span className="text-gray-400" title={`分攤: ${ex.splitBy.join(', ')}`}>
                            {ex.splitBy.length} 人分攤
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      {currency === 'TWD' ? (
                        <>
                          <div className="text-gray-800 font-bold text-sm tracking-tight">{originalAmount.toLocaleString()} <span className="text-xs font-normal text-gray-400">TWD</span></div>
                          <div className="text-[10px] text-gray-400">≈ {ex.amount.toLocaleString()} ₩</div>
                        </>
                      ) : (
                        <>
                          <div className="text-kr-red font-bold text-sm tracking-tight">{ex.amount.toLocaleString()} <span className="text-xs font-normal text-gray-400">₩</span></div>
                          <div className="text-[10px] text-gray-400">≈ {Math.round(ex.amount / rate).toLocaleString()} TWD</div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 border-l border-gray-100 pl-2">
                      <button
                        onClick={() => onEdit(ex)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="編輯"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(ex.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="刪除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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