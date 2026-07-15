import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  return (
    <div className="w-full">
      {label && <p className="text-xs text-slate-500 mb-2">{label}</p>}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-500 shadow-sm"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-amber-600 mt-1 font-bold">{progress}% Complete</p>
    </div>
  );
};
