
import React from 'react';
import { ThemeColor, ThemeMode } from '../types';
import { Sun, Moon, Palette } from 'lucide-react';

interface Props {
  theme: ThemeColor;
  mode: ThemeMode;
  onThemeChange: (theme: ThemeColor) => void;
  onModeToggle: () => void;
}

export const ThemeSelector: React.FC<Props> = ({ theme, mode, onThemeChange, onModeToggle }) => {
  const colors: { value: ThemeColor; bg: string }[] = [
    { value: 'blue', bg: 'bg-blue-500' },
    { value: 'rose', bg: 'bg-rose-500' },
    { value: 'emerald', bg: 'bg-emerald-500' },
  ];

  return (
    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
      <div className="flex items-center gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
        {colors.map((c) => (
          <button
            key={c.value}
            onClick={() => onThemeChange(c.value)}
            className={`w-6 h-6 rounded-full transition-all border-2 ${
              theme === c.value ? 'border-white ring-2 ring-gray-400 dark:ring-gray-300 scale-110' : 'border-transparent scale-100 opacity-60 hover:opacity-100'
            } ${c.bg}`}
            title={c.value}
          />
        ))}
      </div>
      <button
        onClick={onModeToggle}
        className="p-1.5 rounded-xl transition-all text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-700 hover:shadow-sm"
      >
        {mode === 'light' ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
      </button>
    </div>
  );
};
