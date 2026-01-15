import React, { useState } from 'react';
import { Wallet, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { Expense } from '../types';

interface PayerSummaryCardProps {
  expenses: Expense[];
  rate: number;
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

export const PayerSummaryCard: React.FC<PayerSummaryCardProps> = ({ expenses, rate, onEdit, onDelete }) => {
  const [expandedPayer, setExpandedPayer] = useState<string | null>(null);

  const summary = expenses.reduce((acc, curr) => {
    acc[curr.payer] = (acc[curr.payer] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedPayers = Object.entries(summary).sort(([, a], [, b]) => b - a);

  if (expenses.length === 0) return null;

  const toggleExpand = (name: string) => {
    setExpandedPayer(expandedPayer === name ? null : name);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="bg-white border-b border-gray-100 p-4 font-bold text-gray-700 flex items-center gap-2">
        <Wallet className="w-5 h-5 text-orange-500" />
        代墊金額統計
      </div>
      <div className="p-2 bg-orange-50/30">
        <div className="space-y-2">
          {sortedPayers.map(([name, amount], idx) => {
            const isExpanded = expandedPayer === name;
            // Get expenses for this payer
            const payerExpenses = expenses.filter(e => e.payer === name);

            return (
              <div key={idx} className="bg-white border border-gray-100 rounded-lg shadow-sm overflow-hidden transition-all">
                {/* Summary Row */}
                <div 
                  onClick={() => toggleExpand(name)}
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                    <span className="font-medium text-gray-800">{name}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                  <div className="text-right">
                    <div className="text-gray-800 font-bold text-sm">
                      已墊 {amount.toLocaleString()} ₩
                    </div>
                    <div className="text-[10px] text-gray-400">
                      ≈ {Math.round(amount / rate).toLocaleString()} TWD
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-gray-50 border-t border-gray-100 px-3 py-2 space-y-2 animate-fade-in">
                    
                    {/* Prominent Total Display */}
                    <div className="mb-3 bg-orange-100/50 p-3 rounded-lg border border-orange-100 flex justify-between items-center">
                      <span className="text-sm text-orange-800 font-bold">總代墊金額</span>
                      <div className="text-right">
                        <div className="text-xl font-bold text-orange-600">{amount.toLocaleString()} ₩</div>
                        <div className="text-xs text-orange-400">≈ {Math.round(amount / rate).toLocaleString()} TWD</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 pl-1 mb-1">該成員的消費明細 (可點擊編輯):</div>
                    {payerExpenses.map(ex => (
                      <div key={ex.id} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 text-sm">
                        <div className="flex-1">
                          <div className="font-medium text-gray-700">{ex.item}</div>
                          <div className="text-[10px] text-gray-400">{ex.date}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-orange-600">{ex.amount.toLocaleString()} ₩</span>
                          <div className="flex gap-1 border-l pl-2 border-gray-100">
                            <button 
                              onClick={(e) => { e.stopPropagation(); onEdit(ex); }}
                              className="p-1.5 text-blue-400 hover:bg-blue-50 rounded"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onDelete(ex.id); }}
                              className="p-1.5 text-red-400 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};