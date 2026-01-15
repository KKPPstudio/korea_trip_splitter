import React, { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Header } from './components/Header';
import { ExchangeRateCard } from './components/ExchangeRateCard';
import { FriendManager } from './components/FriendManager';
import { AddExpenseForm } from './components/AddExpenseForm';
import { ExpenseList } from './components/ExpenseList';
import { SettlementCard } from './components/SettlementCard';
import { PayerSummaryCard } from './components/PayerSummaryCard';
import { MyExpensesCard } from './components/MyExpensesCard';
import { BottomNav } from './components/BottomNav';
import { EditExpenseModal } from './components/EditExpenseModal';
import { LoginScreen } from './components/LoginScreen';
import { Expense, ToastMessage } from './types';
import { XCircle, Loader2, Copy, Check } from 'lucide-react';

// Define the structure of our Firestore document
interface RoomData {
  friends: string[];
  expenses: Expense[];
  rate: number;
}

const App: React.FC = () => {
  // App Flow State
  const [roomId, setRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // Data State (synced with Firebase)
  const [activeTab, setActiveTab] = useState<'record' | 'settlement' | 'mine'>('record');
  const [friends, setFriends] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [rate, setRate] = useState<number>(40);
  
  // UI State
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ show: false, title: '', message: '', action: () => {} });
  const [copied, setCopied] = useState(false);

  // 1. Initial Load: Check for saved Room ID
  useEffect(() => {
    const savedRoomId = localStorage.getItem('kr_room_id');
    if (savedRoomId) {
      setRoomId(savedRoomId);
    }
  }, []);

  // 2. Firebase Sync Listener
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    const roomRef = doc(db, "rooms", roomId);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      setLoading(false);
      if (docSnap.exists()) {
        // Data exists, update state
        const data = docSnap.data() as RoomData;
        setFriends(data.friends || []);
        setExpenses(data.expenses || []);
        setRate(data.rate || 40);
      } else {
        // New room, initialize it
        setDoc(roomRef, {
          friends: [],
          expenses: [],
          rate: 40
        }, { merge: true });
      }
    }, (error) => {
      console.error("Firebase Sync Error:", error);
      setLoading(false);
      setDbError("無法連線到資料庫。請檢查您的網路，或確認 Firebase 設定檔 (firebaseConfig.ts) 是否正確。");
    });

    return () => unsubscribe();
  }, [roomId]);

  // Helper to update Firestore
  const updateFirestore = async (newData: Partial<RoomData>) => {
    if (!roomId) return;
    const roomRef = doc(db, "rooms", roomId);
    try {
      // Changed from updateDoc to setDoc with merge: true to avoid "No document to update" error
      await setDoc(roomRef, newData, { merge: true });
    } catch (e) {
      console.error("Error updating document: ", e);
      showToast('資料同步失敗，請檢查網路', 'error');
    }
  };

  // Handlers
  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    localStorage.setItem('kr_room_id', id);
  };

  const handleLogout = () => {
    setRoomId(null);
    localStorage.removeItem('kr_room_id');
    setFriends([]);
    setExpenses([]);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleConfirm = (title: string, message: string, action: () => void) => {
    setShowConfirmModal({ show: true, title, message, action });
  };

  const executeConfirm = () => {
    showConfirmModal.action();
    setShowConfirmModal({ ...showConfirmModal, show: false });
  };

  const handleCopyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      showToast('已複製群組代碼！');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // --- Logic modified to sync with Firebase ---

  const handleRateChange = (newRate: number) => {
    setRate(newRate);
    updateFirestore({ rate: newRate });
  };

  const addFriend = (name: string) => {
    if (friends.includes(name)) {
      showToast('這個名字已經加過了喔！', 'error');
      return;
    }
    const newFriends = [...friends, name];
    setFriends(newFriends); // Optimistic update
    updateFirestore({ friends: newFriends });
    showToast('新增旅伴成功！');
  };

  const removeFriend = (name: string) => {
    const hasExpenses = expenses.some(e => e.payer === name);
    if (hasExpenses) {
      showToast('無法刪除：該成員已有付款紀錄，請先刪除相關消費。', 'error');
      return;
    }

    handleConfirm('刪除成員', `確定要將 ${name} 從名單中移除嗎？`, () => {
      const newFriends = friends.filter(f => f !== name);
      setFriends(newFriends);
      updateFirestore({ friends: newFriends });
      showToast('已移除成員', 'info');
    });
  };

  const clearFriends = () => {
    handleConfirm('重設名單', '確定要清空所有朋友名單嗎？', () => {
      setFriends([]);
      updateFirestore({ friends: [] });
      showToast('旅伴名單已重設', 'info');
    });
  };

  const addExpense = (data: Omit<Expense, 'id' | 'date'>) => {
    const now = new Date();
    const dateStr = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const newExpense: Expense = {
      ...data,
      id: Date.now(),
      date: dateStr
    };
    const newExpenses = [...expenses, newExpense];
    setExpenses(newExpenses);
    updateFirestore({ expenses: newExpenses });
  };

  const updateExpense = (updatedExpense: Expense) => {
    const newExpenses = expenses.map(ex => ex.id === updatedExpense.id ? updatedExpense : ex);
    setExpenses(newExpenses);
    setEditingExpense(null);
    updateFirestore({ expenses: newExpenses });
    showToast('消費紀錄已更新');
  };

  const deleteExpense = (id: number) => {
    handleConfirm('刪除紀錄', '確定要刪除這筆消費嗎？', () => {
      const newExpenses = expenses.filter(e => e.id !== id);
      setExpenses(newExpenses);
      updateFirestore({ expenses: newExpenses });
      showToast('已刪除該筆消費', 'info');
    });
  };

  const clearExpenses = () => {
    handleConfirm('清空消費紀錄', '確定要清空所有記帳資料嗎？(朋友名單會保留)', () => {
      setExpenses([]);
      updateFirestore({ expenses: [] });
      showToast('所有消費紀錄已清空', 'info');
    });
  };

  // Render Login Screen if no Room ID
  if (!roomId) {
    return <LoginScreen onJoin={handleJoinRoom} />;
  }

  // Render Error if Firebase config is missing or invalid
  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-red-50 text-center">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-red-100 max-w-sm">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">資料庫連線錯誤</h3>
          <p className="text-gray-600 text-sm mb-6">{dbError}</p>
          <button 
            onClick={handleLogout}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
          >
            返回登入頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header />
      
      {/* Room Indicator / Logout */}
      <div className="container mx-auto px-4 max-w-lg mb-4 -mt-4 relative z-10">
        <div className="bg-white/90 backdrop-blur rounded-lg px-4 py-2 shadow-sm border border-gray-100 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">當前群組:</span>
            <button 
              onClick={handleCopyRoomId}
              className="flex items-center gap-1 font-bold text-kr-blue bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors active:scale-95"
              title="點擊複製代碼"
            >
              {roomId}
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 opacity-50" />}
            </button>
          </div>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 underline">
            登出
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-lg pb-24 animate-fade-in">
        
        {loading && expenses.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <Loader2 className="w-8 h-8 animate-spin mb-2" />
             <span className="text-sm">正在同步雲端資料...</span>
           </div>
        ) : activeTab === 'record' ? (
          <>
            <ExchangeRateCard 
              rate={rate} 
              onRateChange={handleRateChange} 
              onToast={showToast} 
            />
            
            <FriendManager 
              friends={friends} 
              onAddFriend={addFriend} 
              onRemoveFriend={removeFriend}
              onClearFriends={clearFriends} 
            />
            
            <AddExpenseForm 
              friends={friends} 
              rate={rate}
              onAddExpense={addExpense} 
              onToast={showToast} 
            />
            
            <ExpenseList 
              expenses={expenses} 
              rate={rate} 
              onDelete={deleteExpense} 
              onEdit={setEditingExpense}
              onClear={clearExpenses} 
            />
          </>
        ) : activeTab === 'settlement' ? (
          <div className="animate-fade-in">
             <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm text-blue-800 border border-blue-100 flex items-center gap-2">
                <span className="font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-blue-100">TIP</span>
                點擊成員名字可展開明細進行編輯
             </div>

             <PayerSummaryCard 
              expenses={expenses}
              rate={rate}
              onEdit={setEditingExpense}
              onDelete={deleteExpense}
            />
            
            <SettlementCard 
              friends={friends} 
              expenses={expenses} 
              rate={rate} 
            />
          </div>
        ) : (
          <MyExpensesCard 
            friends={friends}
            expenses={expenses}
            rate={rate}
          />
        )}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Edit Expense Modal */}
      {editingExpense && (
        <EditExpenseModal 
          expense={editingExpense}
          friends={friends}
          rate={rate}
          onSave={updateExpense}
          onCancel={() => setEditingExpense(null)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50 animate-fade-in-up">
          {toast.type === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal.show && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-scale-in">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{showConfirmModal.title}</h3>
            <p className="text-gray-600 mb-6">{showConfirmModal.message}</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirmModal({ ...showConfirmModal, show: false })}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button 
                onClick={executeConfirm}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-red-500/30"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;