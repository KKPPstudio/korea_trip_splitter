import React, { useState, useEffect } from 'react';
import { Coins, RefreshCw } from 'lucide-react';

interface ExchangeRateCardProps {
  rate: number;
  onRateChange: (rate: number) => void;
  onToast: (msg: string) => void;
}

export const ExchangeRateCard: React.FC<ExchangeRateCardProps> = ({ rate, onRateChange, onToast }) => {
  const [loading, setLoading] = useState(false);

  const fetchLiveRate = async (isAuto = false) => {
    setLoading(true);
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/TWD');
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (data && data.rates && data.rates.KRW) {
        const newRate = parseFloat(data.rates.KRW.toFixed(2));
        onRateChange(newRate);
        if (!isAuto) {
          onToast(`更新成功！目前 1 台幣 ≈ ${newRate} 韓元`);
        }
      } else {
        throw new Error('No KRW data');
      }
    } catch (error) {
      console.error(error);
      if (!isAuto) {
        onToast('無法抓取即時匯率，請檢查網路');
      }
    } finally {
      setLoading(false);
    }
  };

  // Auto fetch on mount
  useEffect(() => {
    fetchLiveRate(true);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <Coins className="w-4 h-4" />
        <span>即時匯率 (自動更新)</span>
      </div>
      <div className="flex gap-2">
        <div className="flex items-center flex-1 bg-gray-50 rounded-lg px-3 border border-gray-200 py-2">
          <span className="text-gray-500 text-sm whitespace-nowrap mr-2">1 TWD ≈</span>
          <span className="flex-1 text-right font-bold text-gray-800 text-lg">
            {rate}
          </span>
          <span className="text-gray-500 text-sm ml-2">KRW</span>
        </div>
        <button
          onClick={() => fetchLiveRate(false)}
          disabled={loading}
          className="flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? '更新中' : '更新'}
        </button>
      </div>
    </div>
  );
};