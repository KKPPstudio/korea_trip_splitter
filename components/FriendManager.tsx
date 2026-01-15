import React, { useState } from 'react';
import { Users, Plus, UserX, User, X } from 'lucide-react';

interface FriendManagerProps {
  friends: string[];
  onAddFriend: (name: string) => void;
  onRemoveFriend: (name: string) => void;
  onClearFriends: () => void;
}

export const FriendManager: React.FC<FriendManagerProps> = ({ friends, onAddFriend, onRemoveFriend, onClearFriends }) => {
  const [newFriend, setNewFriend] = useState('');

  const handleAdd = () => {
    if (newFriend.trim()) {
      onAddFriend(newFriend.trim());
      setNewFriend('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="bg-white border-b border-gray-100 p-4 font-bold text-gray-700 flex items-center gap-2">
        <Users className="w-5 h-5 text-kr-blue" />
        步驟一：誰一起去？
      </div>
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newFriend}
            onChange={(e) => setNewFriend(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="輸入名字 (例如: 小明)"
            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kr-blue/20 focus:border-kr-blue transition-all"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-white border border-kr-blue text-kr-blue rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1 font-medium"
          >
            <Plus className="w-4 h-4" /> 新增
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-2">
          {friends.length === 0 ? (
            <div className="w-full text-center py-4 text-gray-400 text-sm bg-gray-50 rounded-lg border border-dashed border-gray-200">
              還沒有加入旅伴喔～
            </div>
          ) : (
            friends.map((friend, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 pl-3 pr-2 py-2 rounded-full text-sm bg-blue-50 text-kr-blue border border-blue-100 group"
              >
                <User className="w-3 h-3" />
                {friend}
                <button 
                  onClick={() => onRemoveFriend(friend)}
                  className="ml-1 p-0.5 rounded-full hover:bg-blue-200 text-blue-400 hover:text-blue-700 transition-colors"
                  aria-label={`移除 ${friend}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-right">
        <button
          onClick={onClearFriends}
          className="text-xs text-red-500 hover:text-red-700 flex items-center justify-end gap-1 ml-auto transition-colors"
        >
          <UserX className="w-3 h-3" /> 重設所有名單
        </button>
      </div>
    </div>
  );
};