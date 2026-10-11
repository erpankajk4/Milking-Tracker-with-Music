'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useMilkingSession } from '../hooks/useMilkingSession';
import { TimerDisplay } from './TimerDisplay';
import { MilkingControls } from './MilkingControls';
import { QuantityModal } from './QuantityModal';
import { DiscardConfirmModal } from './DiscardConfirmModal';
import { BottomNav } from '../../../components/navigation/BottomNav';
import { Header } from '../../../components/Header';
import { useI18n } from '../../i18n/i18n.context';

export function MilkingScreen() {
  const { t } = useI18n();
  const [isQuantitySheetOpen, setIsQuantitySheetOpen] = useState(false);

  const session = useMilkingSession(() => {
    setIsQuantitySheetOpen(false);
  });

  const isIdle = session.status === 'idle';
  const isRunning = session.status === 'running';
  const isPaused = session.status === 'paused';
  const isAwaitingQuantity = session.status === 'awaiting_quantity' || session.status === 'saving';

  // Determine header title based on active session state
  const getHeaderTitle = () => {
    if (isRunning) return t.runningTitle;
    if (isPaused) return t.pausedTitle;
    return t.appTitle;
  };

  const handleStop = () => {
    session.stopMilking();
    setIsQuantitySheetOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full pb-8 select-none">
      {/* Top Header with Contextual Title & Language Toggle */}
      <Header title={getHeaderTitle()} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-2">
        {/* IDLE STATE (UI-01) */}
        {isIdle && (
          <div className="w-full flex flex-col items-center text-center animate-in fade-in duration-300">
            {/* Centered Cow Illustration */}
            <div className="w-full max-w-[320px] mb-6 flex justify-center">
              <Image
                src="/images/cow-relaxing.png"
                alt="Calming Milking Illustration"
                width={320}
                height={180}
                priority
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Hero Heading & Subtitle */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18221D] tracking-tight mb-2">
              {t.heroTitle}
            </h2>
            <p className="text-sm sm:text-base font-medium text-[#5B6862] max-w-[280px] mb-8">
              {t.heroSubtitle}
            </p>

            {/* Start Milking Button */}
            <MilkingControls
              status={session.status}
              onStart={session.startMilking}
              onPause={session.pauseMilking}
              onResume={session.resumeMilking}
              onStop={handleStop}
            />
          </div>
        )}

        {/* RUNNING & PAUSED STATES (UI-02 & UI-03) */}
        {(isRunning || isPaused || isAwaitingQuantity) && (
          <div className="w-full flex-1 flex flex-col justify-between items-center py-2 animate-in fade-in duration-300">
            <TimerDisplay
              durationSeconds={session.durationSeconds}
              status={session.status}
              audioStatus={session.audioStatus}
              onRetryAudio={session.retryAudio}
            />

            {/* Action Controls Dock (Replaces bottom navigation during active session) */}
            <div className="w-full mt-auto pt-4 pb-2">
              <MilkingControls
                status={session.status}
                onStart={session.startMilking}
                onPause={session.pauseMilking}
                onResume={session.resumeMilking}
                onStop={handleStop}
              />
            </div>
          </div>
        )}
      </div>

      {/* Quantity Entry Bottom Sheet (UI-05) */}
      <QuantityModal
        isOpen={isQuantitySheetOpen || isAwaitingQuantity}
        status={session.status}
        durationSeconds={session.durationSeconds}
        startTime={session.startTime}
        endTime={session.endTime}
        milkQuantity={session.milkQuantity}
        onQuantityChange={session.setMilkQuantity}
        quantityError={session.quantityError}
        saveError={session.saveError}
        onSubmit={session.submitQuantity}
        onDiscard={() => session.setIsDiscardModalOpen(true)}
        onClose={() => setIsQuantitySheetOpen(false)}
      />

      {/* Discard Confirmation Modal */}
      <DiscardConfirmModal
        isOpen={session.isDiscardModalOpen}
        onConfirm={() => {
          session.discardSession();
          setIsQuantitySheetOpen(false);
        }}
        onCancel={() => session.setIsDiscardModalOpen(false)}
      />

      {/* Floating Bottom Navigation Bar (Hidden during active session per UI-02) */}
      <BottomNav isVisible={isIdle} />
    </div>
  );
}
