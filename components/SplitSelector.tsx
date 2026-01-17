import React from 'react';
import { Check, Users } from 'lucide-react';

interface SplitSelectorProps {
    friends: string[];
    selectedSplitters: string[];
    onChange: (selected: string[]) => void;
}

export const SplitSelector: React.FC<SplitSelectorProps> = ({
    friends,
    selectedSplitters,
    onChange
}) => {
    const toggleFriend = (name: string) => {
        if (selectedSplitters.includes(name)) {
            onChange(selectedSplitters.filter(f => f !== name));
        } else {
            onChange([...selectedSplitters, name]);
        }
    };

    const toggleAll = () => {
        if (selectedSplitters.length === friends.length) {
            onChange([]);
        } else {
            onChange(friends);
        }
    };

    const allSelected = selectedSplitters.length === friends.length;
    const noneSelected = selectedSplitters.length === 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                    <Users className="w-3.5 h-3.5" />
                    誰要分攤？
                </label>
                <button
                    type="button"
                    onClick={toggleAll}
                    className="text-xs text-kr-blue hover:text-blue-700 font-medium px-1 transition-colors"
                >
                    {allSelected ? '取消全選' : '全選'}
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {friends.map(f => {
                    const isSelected = selectedSplitters.includes(f);
                    return (
                        <button
                            key={f}
                            type="button"
                            onClick={() => toggleFriend(f)}
                            className={`px-3 py-1.5 rounded-lg text-sm border transition-all flex items-center gap-1 active:scale-95 ${isSelected
                                    ? 'bg-green-50 border-green-300 text-green-700 font-medium shadow-sm'
                                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            {f} {isSelected && <Check className="w-3 h-3" />}
                        </button>
                    );
                })}
            </div>
            {noneSelected && (
                <p className="text-xs text-red-400 mt-1.5">⚠ 至少要有一人分攤</p>
            )}
        </div>
    );
};
