'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { fetchMilkingSessions, ApiError } from '@/features/milking/milking.api';
import { SessionRecord } from '@/features/milking/milking.types';
import { HistoryTable } from '@/features/history/components/HistoryTable';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Header } from '@/components/Header';
import { useI18n } from '@/features/i18n/i18n.context';
import { RefreshCw, Play, AlertCircle, Milk } from 'lucide-react';

export default function HistoryPage() {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMilkingSessions();
      setSessions(data);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load history records');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <div className="flex-1 flex flex-col justify-between w-full h-full pb-24 select-none">
      <div>
        {/* Top Header with UI-09 styling */}
        <Header title={t.historyTitle} subtitle={t.historySubtitle} />

        <div className="px-3 sm:px-4 pt-2">


          {/* Loading Skeleton */}
          {loading && (
            <div className="w-full bg-white rounded-2xl border border-stone-200/80 p-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-10 bg-stone-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-6 text-center bg-rose-50 border border-rose-200 rounded-2xl my-4">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-rose-900 mb-1">
                {t.historyErrorTitle}
              </h3>
              <p className="text-xs text-rose-700 mb-4 max-w-xs mx-auto">
                {error}
              </p>
              <button
                type="button"
                onClick={loadSessions}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t.retry}</span>
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && sessions.length === 0 && (
            <div className="p-8 text-center bg-white border border-stone-200/80 rounded-3xl my-6">
              <div className="w-14 h-14 rounded-full bg-[#E2EFE9] text-[#1A533E] flex items-center justify-center mx-auto mb-4">
                <Milk className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[#18221D] mb-1">
                {t.emptyHistoryTitle}
              </h3>
              <p className="text-xs text-[#5B6862] mb-6 max-w-xs mx-auto">
                {t.emptyHistorySubtitle}
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-[#1A533E] hover:bg-[#154432] rounded-full shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.startFirstSession}</span>
              </Link>
            </div>
          )}

          {/* Populated Sessions Table (UI-09) */}
          {!loading && !error && sessions.length > 0 && (
            <HistoryTable sessions={sessions} />
          )}
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <BottomNav isVisible={true} />
    </div>
  );
}
