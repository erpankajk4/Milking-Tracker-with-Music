'use client';

import React from 'react';
import { Milk, AlertCircle, Loader2 } from 'lucide-react';
import { useI18n } from '../../i18n/i18n.context';
import { SessionStatus } from '../milking.types';

interface QuantityModalProps {
  isOpen: boolean;
  status: SessionStatus;
  durationSeconds: number;
  startTime: string | null;
  endTime: string | null;
  milkQuantity: string;
  onQuantityChange: (val: string) => void;
  quantityError: string | null;
  saveError: string | null;
  onSubmit: () => void;
  onDiscard: () => void;
  onClose: () => void;
}

export function QuantityModal({
  isOpen,
  status,
  milkQuantity,
  onQuantityChange,
  quantityError,
  saveError,
  onSubmit,
  onDiscard,
  onClose
}: QuantityModalProps) {
  const { t } = useI18n();

  if (!isOpen) return null;

  const isSaving = status === 'saving';

  const getValidationErrorText = () => {
    if (quantityError === 'quantityRequired') return t.quantityRequired;
    if (quantityError === 'quantityInvalid') return t.quantityInvalid;
    return null;
  };

  const validationMsg = getValidationErrorText();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs transition-opacity p-0"
    >
      <div className="w-full max-w-[430px] bg-[#FAF7F2] rounded-t-[32px] border-t border-stone-200/80 shadow-2xl p-6 pb-8 animate-in slide-in-from-bottom duration-250 select-none">
        {/* Top Sheet Drag Handle */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-4" />

        {/* Circular Milk Bottle Icon */}
        <div className="w-16 h-16 rounded-full bg-[#E2EFE9] flex items-center justify-center text-[#1A533E] mb-3">
          <Milk className="w-8 h-8 stroke-[2.2]" />
        </div>

        {/* Title and Subtitle */}
        <h2 id="modal-title" className="text-2xl font-black text-[#18221D] tracking-tight">
          {t.quantityModalTitle}
        </h2>
        <p className="text-sm font-medium text-[#5B6862] mt-0.5 mb-5">
          {t.quantityModalSubtitle}
        </p>

        {/* Error Alert if Save Failed */}
        {saveError && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Milk Quantity Field */}
        <div className="mb-6">
          <label
            htmlFor="milk-quantity-input"
            className="block text-sm font-bold text-[#18221D] mb-1.5"
          >
            {t.quantityLabel}
          </label>
          <div className="flex rounded-2xl border border-stone-300 overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#1A533E] focus-within:border-transparent transition-all">
            <input
              id="milk-quantity-input"
              type="number"
              step="any"
              min="0.1"
              disabled={isSaving}
              autoFocus
              placeholder={t.quantityPlaceholder}
              value={milkQuantity}
              onChange={(e) => onQuantityChange(e.target.value)}
              className="flex-1 px-4 py-3.5 text-2xl font-bold text-[#18221D] bg-transparent outline-hidden"
            />
            <div className="bg-[#F0EDE6] px-5 py-3.5 flex items-center justify-center border-l border-stone-200 text-sm font-bold text-[#18221D]">
              {t.litresUnit}
            </div>
          </div>

          {validationMsg ? (
            <p className="mt-1.5 text-xs font-semibold text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {validationMsg}
            </p>
          ) : (
            <p className="mt-1.5 text-xs font-medium text-[#5B6862]">
              {t.quantityHelp}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            disabled={isSaving}
            onClick={onSubmit}
            className="w-full min-h-[52px] flex items-center justify-center gap-2 py-3.5 px-6 text-lg font-bold text-white bg-[#1A533E] hover:bg-[#154432] active:scale-[0.99] disabled:opacity-50 rounded-2xl shadow-md transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t.saving}</span>
              </>
            ) : (
              <span>{t.saveSession}</span>
            )}
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={onClose}
            className="w-full min-h-[48px] flex items-center justify-center py-3 px-6 text-base font-bold text-[#18221D] bg-white border border-stone-200 hover:bg-stone-50 active:scale-[0.99] rounded-2xl transition-all cursor-pointer"
          >
            <span>{t.notNow}</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={onDiscard}
            className="w-full py-2 text-sm font-bold text-[#9E2A2B] hover:underline transition-all cursor-pointer text-center mt-0.5"
          >
            <span>{t.discardSession}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
