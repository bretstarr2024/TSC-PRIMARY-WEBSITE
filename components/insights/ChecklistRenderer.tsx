'use client';

import { useState } from 'react';
import { ChecklistItem } from '@/lib/resources-db';

interface ChecklistRendererProps {
  items: ChecklistItem[];
}

export function ChecklistRenderer({ items }: ChecklistRendererProps) {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const sortedItems = [...items].sort((a, b) => a.order - b.order);

  const hasCategories = items.some((item) => item.category);
  const itemsByCategory = hasCategories
    ? sortedItems.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
        const category = item.category || 'General';
        if (!acc[category]) acc[category] = [];
        acc[category].push(item);
        return acc;
      }, {})
    : { All: sortedItems };

  const categories = Object.keys(itemsByCategory);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const completedCount = checkedItems.size;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div>
      {/* Progress Bar */}
      <div className="glass rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold text-white">Progress</span>
          <span className="text-sm text-greige">
            {completedCount} of {totalCount} completed
          </span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-3">
          <div
            className="bg-atomic-tangerine h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {progressPercent === 100 && (
          <div className="mt-4 text-center">
            <span className="inline-flex items-center gap-2 text-emerald-400 font-medium">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Checklist Complete!
            </span>
          </div>
        )}
      </div>

      {/* Checklist Items */}
      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            {hasCategories && (
              <h3 className="text-lg font-semibold text-white mb-4">{category}</h3>
            )}
            <div className="space-y-3">
              {itemsByCategory[category].map((item) => {
                const isChecked = checkedItems.has(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-900/20 border-emerald-700/50'
                        : 'glass border-white/10 hover:border-atomic-tangerine/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleItem(item.id)}
                      className="mt-1 w-5 h-5 rounded border-white/30 text-atomic-tangerine focus:ring-atomic-tangerine cursor-pointer"
                    />
                    <div className="flex-1">
                      <span
                        className={`font-medium ${
                          isChecked ? 'text-emerald-400 line-through' : 'text-white'
                        }`}
                      >
                        {item.text}
                      </span>
                      {item.description && (
                        <p className={`text-sm mt-1 ${isChecked ? 'text-emerald-600' : 'text-greige'}`}>
                          {item.description}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Reset Button */}
      {checkedItems.size > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setCheckedItems(new Set())}
            className="text-sm text-greige hover:text-white transition-colors"
          >
            Reset checklist
          </button>
        </div>
      )}
    </div>
  );
}
