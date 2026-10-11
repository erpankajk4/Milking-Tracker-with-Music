'use client';

import React from 'react';
import Image from 'next/image';
import { formatTimerDigits } from '../milking.utils';
import { SessionStatus, AudioStatus } from '../milking.types';
import { useI18n } from '../../i18n/i18n.context';
import { Music, Pause, RefreshCw } from 'lucide-react';

interface TimerDisplayProps {
  durationSeconds: number;
  status: SessionStatus;
  audioStatus: AudioStatus;
  onRetryAudio: () => void;
}

export function TimerDisplay({
  durationSeconds,
  status,
  audioStatus,
  onRetryAudio
}: TimerDisplayProps) {
  const { t } = useI18n();
  const { hours, minutes, seconds } = formatTimerDigits(durationSeconds);
  const formattedTime = `${hours}:${minutes}:${seconds}`;

  const isRunning = status === 'running';
  const isPaused = status === 'paused';

  // Calculate a continuous visual progress arc based on duration (cycles every 60s or 600s)
  const strokeDashoffset = 754 - (754 * ((durationSeconds % 60) / 60));

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Top Music / Status Pill Badge */}
      <div className="mb-6">
        {audioStatus === 'error' ? (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
            <span>{t.musicFailed}</span>
            <button
              type="button"
              onClick={onRetryAudio}
              className="ml-1 inline-flex items-center gap-1 underline font-bold cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              {t.musicRetry}
            </button>
          </div>
        ) : isRunning ? (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#E2EFE9] text-[#1A533E] text-sm font-semibold shadow-2xs">
            <Music className="w-4 h-4 fill-[#1A533E]" />
            <span>{t.musicPlayingBadge}</span>
          </div>
        ) : isPaused ? (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FDF4E7] text-[#B45309] text-sm font-semibold shadow-2xs">
            <Pause className="w-4 h-4 fill-[#B45309]" />
            <span>{t.musicPausedBadge}</span>
          </div>
        ) : null}
      </div>

      {/* Circular Gauge Timer Card */}
      <div className="relative w-[270px] h-[270px] sm:w-[290px] sm:h-[290px] flex items-center justify-center">
        {/* SVG Circular Progress Track */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90"
          viewBox="0 0 260 260"
        >
          {/* Background Ring */}
          <circle
            cx="130"
            cy="130"
            r="120"
            fill="#FFFFFF"
            stroke="#E7EFEA"
            strokeWidth="10"
          />
          {/* Active Green Arc */}
          <circle
            cx="130"
            cy="130"
            r="120"
            fill="none"
            stroke="#1A533E"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray="754"
            strokeDashoffset={isRunning ? strokeDashoffset : 754 - (754 * 0.35)}
            className="transition-all duration-300 ease-linear"
          />
        </svg>

        {/* Center Digital Timer Display */}
        <div className="z-10 flex flex-col items-center justify-center text-center px-4">
          <div className="text-[44px] sm:text-[48px] font-black text-[#18221D] tracking-tight font-mono tabular-nums leading-none">
            {formattedTime}
          </div>

          {/* Subtext below digital timer */}
          {isRunning && (
            <p className="text-sm font-bold text-[#5B6862] mt-3 tracking-wide">
              {t.activeTimeLabel}
            </p>
          )}

          {isPaused && (
            <p className="text-xs font-semibold text-[#5B6862] mt-2.5 max-w-[190px] leading-tight">
              {t.pausedTimeNotice}
            </p>
          )}
        </div>
      </div>

      {/* Relaxing Cow Illustration beneath the gauge */}
      <div className="w-full max-w-[280px] mt-6 flex justify-center">
        <Image
          src="/images/cow-relaxing.png"
          alt="Relaxing Cow Illustration"
          width={280}
          height={160}
          priority
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
}
