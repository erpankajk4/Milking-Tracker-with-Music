'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useI18n } from '../../i18n/i18n.context';

interface DiscardConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DiscardConfirmModal({
  isOpen,
  onConfirm,
  onCancel
}: DiscardConfirmModalProps) {
  const { language } = useI18n();

  if (!isOpen) return null;

  const isHindi = language === 'hi';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="discard-title"
      className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity"
    >
      <div className="w-full max-w-[340px] bg-white rounded-[28px] shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 select-none">
        {/* Warning Icon Badge */}
        <div className="w-20 h-20 rounded-full bg-[#FCE8E8] text-[#E02424] flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
        </div>

        {/* Title & Message */}
        <h3 id="discard-title" className="text-2xl font-black text-[#18221D] mb-1.5">
          {isHindi ? 'सत्र छोड़ें?' : 'Discard Session?'}
        </h3>
        <p className="text-sm font-medium text-[#5B6862] mb-6">
          {isHindi ? 'यह विवरण दर्ज नहीं किया जाएगा।' : 'This session will not be saved.'}
        </p>

        {/* Action Buttons: Side by Side */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="py-3 px-4 text-base font-bold text-[#18221D] bg-white border border-stone-300 hover:bg-stone-50 active:scale-[0.98] rounded-2xl transition-all cursor-pointer"
          >
            {isHindi ? 'वापस जाएँ' : 'Go Back'}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="py-3 px-4 text-base font-bold text-white bg-[#E02424] hover:bg-[#C81E1E] active:scale-[0.98] rounded-2xl shadow-sm transition-all cursor-pointer"
          >
            {isHindi ? 'सत्र छोड़ें' : 'Discard'}
          </button>
        </div>
      </div>
    </div>
  );
}
