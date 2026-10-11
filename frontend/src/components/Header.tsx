'use client';

import React from 'react';
import { useI18n } from '../features/i18n/i18n.context';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { language, setLanguage, t } = useI18n();

  const displayTitle = title || t.appTitle;

  return (
    <header className="w-full pt-6 pb-2 px-6 flex items-start justify-between bg-transparent select-none">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#18221D] tracking-tight leading-tight">
          {displayTitle}
        </h1>
        {subtitle && (
          <p className="text-sm font-medium text-[#5B6862] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {/* Segmented [ हिंदी | EN ] Toggle */}
      <div
        role="group"
        aria-label="Language selection"
        className="flex items-center bg-[#ECE7DE] border border-stone-300/60 rounded-full p-1 text-xs shadow-2xs shrink-0 mt-1"
      >
        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
            language === 'hi'
              ? 'bg-[#1A533E] text-white shadow-xs'
              : 'text-[#5B6862] hover:text-[#18221D]'
          }`}
        >
          हिंदी
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${
            language === 'en'
              ? 'bg-[#1A533E] text-white shadow-xs'
              : 'text-[#5B6862] hover:text-[#18221D]'
          }`}
        >
          EN
        </button>
      </div>
    </header>
  );
}
