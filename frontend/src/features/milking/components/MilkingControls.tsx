'use client';

import React from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { SessionStatus } from '../milking.types';
import { useI18n } from '../../i18n/i18n.context';

interface MilkingControlsProps {
  status: SessionStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function MilkingControls({
  status,
  onStart,
  onPause,
  onResume,
  onStop
}: MilkingControlsProps) {
  const { t } = useI18n();

  if (status === 'idle') {
    return (
      <div className="w-full flex justify-center py-2 px-6">
        <button
          type="button"
          onClick={onStart}
          className="w-full max-w-[340px] flex items-center justify-center gap-3 py-4 px-6 text-xl font-extrabold text-white bg-[#1A533E] hover:bg-[#154432] active:scale-[0.98] rounded-full shadow-lg shadow-[#1A533E]/25 transition-all cursor-pointer select-none"
        >
          <Play className="w-6 h-6 fill-white text-white" />
          <span>{t.startMilking}</span>
        </button>
      </div>
    );
  }

  if (status === 'running') {
    return (
      <div className="w-full max-w-[360px] mx-auto grid grid-cols-2 gap-3 px-4 py-2 select-none">
        {/* Pause Button: White pill with amber border */}
        <button
          type="button"
          onClick={onPause}
          className="min-h-[52px] flex items-center justify-center gap-2 px-4 py-3 text-lg font-bold text-[#D97706] bg-white border-2 border-[#D97706] hover:bg-amber-50 active:scale-[0.98] rounded-full shadow-xs transition-all cursor-pointer"
        >
          <Pause className="w-5 h-5 fill-[#D97706] text-[#D97706]" />
          <span>{t.pause}</span>
        </button>

        {/* Stop Button: Crimson red button */}
        <button
          type="button"
          onClick={onStop}
          className="min-h-[52px] flex items-center justify-center gap-2 px-4 py-3 text-lg font-bold text-white bg-[#9E2A2B] hover:bg-[#852223] active:scale-[0.98] rounded-full shadow-xs transition-all cursor-pointer"
        >
          <Square className="w-4 h-4 fill-white text-white" />
          <span>{t.stop}</span>
        </button>
      </div>
    );
  }

  if (status === 'paused') {
    return (
      <div className="w-full max-w-[360px] mx-auto grid grid-cols-2 gap-3 px-4 py-2 select-none">
        {/* Resume Button: Dark green button */}
        <button
          type="button"
          onClick={onResume}
          className="min-h-[52px] flex items-center justify-center gap-2 px-4 py-3 text-lg font-bold text-white bg-[#1A533E] hover:bg-[#154432] active:scale-[0.98] rounded-full shadow-xs transition-all cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white text-white" />
          <span>{t.resume}</span>
        </button>

        {/* Stop Button: Crimson red button */}
        <button
          type="button"
          onClick={onStop}
          className="min-h-[52px] flex items-center justify-center gap-2 px-4 py-3 text-lg font-bold text-white bg-[#9E2A2B] hover:bg-[#852223] active:scale-[0.98] rounded-full shadow-xs transition-all cursor-pointer"
        >
          <Square className="w-4 h-4 fill-white text-white" />
          <span>{t.stop}</span>
        </button>
      </div>
    );
  }

  return null;
}
