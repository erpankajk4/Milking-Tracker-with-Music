'use client';

import React from 'react';
import { Volume2, VolumeX, AlertCircle, RefreshCw } from 'lucide-react';
import { AudioStatus, SessionStatus } from '../milking.types';
import { useI18n } from '../../i18n/i18n.context';

interface AudioStatusAlertProps {
  audioStatus: AudioStatus;
  sessionStatus: SessionStatus;
  onRetry: () => void;
}

export function AudioStatusAlert({
  audioStatus,
  sessionStatus,
  onRetry
}: AudioStatusAlertProps) {
  const { t } = useI18n();

  if (sessionStatus === 'idle') {
    return (
      <div className="flex items-center justify-center gap-2 py-2 px-3 text-xs text-stone-500 dark:text-stone-400 bg-stone-100/70 dark:bg-stone-800/50 rounded-xl">
        <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>{t.appSubtitle}</span>
      </div>
    );
  }

  if (audioStatus === 'error') {
    return (
      <div className="flex flex-col gap-2 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-rose-800 dark:text-rose-200 text-sm">
        <div className="flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{t.musicFailed}</p>
            <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">
              {t.musicRetryHint}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="self-end inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 active:scale-95 rounded-lg transition-transform"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {t.musicRetry}
        </button>
      </div>
    );
  }

  if (sessionStatus === 'running') {
    return (
      <div className="flex items-center justify-center gap-2.5 py-2 px-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 rounded-2xl text-emerald-800 dark:text-emerald-200 text-sm font-medium">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-bounce" />
        <span>{t.musicPlayingBadge}</span>
      </div>
    );
  }

  if (sessionStatus === 'paused') {
    return (
      <div className="flex items-center justify-center gap-2 py-2 px-4 bg-amber-50 rounded-2xl text-amber-800 text-sm font-medium">
        <VolumeX className="w-4 h-4 text-amber-600" />
        <span>{t.musicPausedBadge}</span>
      </div>
    );
  }

  return null;
}
