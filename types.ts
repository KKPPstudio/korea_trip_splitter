export interface Expense {
  id: number;
  payer: string;
  amount: number;         // 統一轉換後的韓幣金額 (用於計算)
  originalAmount: number; // 原始輸入金額
  currency: 'KRW' | 'TWD'; // 原始幣別
  item: string;
  date: string;
}

export interface Transfer {
  from: string;
  to: string;
  amount: number;
}

export interface BalanceDetail {
  name: string;
  val: number;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}