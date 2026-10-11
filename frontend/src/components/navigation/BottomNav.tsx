'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Droplet, Clock } from 'lucide-react';
import { useI18n } from '../../features/i18n/i18n.context';

interface BottomNavProps {
  isVisible?: boolean;
}

export function BottomNav({ isVisible = true }: BottomNavProps) {
  const pathname = usePathname();
  const { t } = useI18n();

  if (!isVisible) {
    return null;
  }

  const isMilkingActive = pathname === '/';
  const isHistoryActive = pathname === '/history';

  return (
    <nav
      aria-label="Bottom Navigation"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-3rem)] max-w-[370px]"
    >
      <div className="flex items-center justify-between p-1.5 bg-white rounded-full shadow-xl shadow-stone-900/8 border border-stone-200/60 select-none">
        {/* Milking Tab */}
        <Link
          href="/"
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-base font-bold transition-all ${
            isMilkingActive
              ? 'bg-[#E2EFE9] text-[#1A533E]'
              : 'text-[#5B6862] hover:text-[#18221D]'
          }`}
        >
          <Droplet
            className={`w-5 h-5 ${
              isMilkingActive ? 'fill-[#1A533E] text-[#1A533E]' : 'text-[#5B6862]'
            }`}
          />
          <span>{t.navMilking}</span>
        </Link>

        {/* History Tab */}
        <Link
          href="/history"
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-base font-bold transition-all ${
            isHistoryActive
              ? 'bg-[#1A533E] text-white shadow-xs'
              : 'text-[#5B6862] hover:text-[#18221D]'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>{t.navHistory}</span>
        </Link>
      </div>
    </nav>
  );
}
