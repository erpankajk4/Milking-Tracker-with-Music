'use client';

import React from 'react';
import { SessionRecord } from '../../milking/milking.types';
import { useI18n } from '../../i18n/i18n.context';

interface HistoryTableProps {
  sessions: SessionRecord[];
}

export function HistoryTable({ sessions }: HistoryTableProps) {
  const { t, formatDateParts, formatTimeParts, formatDuration, formatNumber } = useI18n();

  return (
    <div className="w-full flex flex-col select-none">
      {/* Table Card Container - strictly fits 100% width, no horizontal scroll */}
      <div className="w-full bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <thead>
            <tr className="bg-[#F1F6F3] border-b border-stone-200/80 text-[#18221D] font-bold text-xs sm:text-sm">
              <th
                scope="col"
                className="w-[28%] py-3 px-2 sm:px-3 text-left border-r border-stone-200/60"
              >
                {t.tableDate}
              </th>
              <th
                scope="col"
                className="w-[18%] py-3 px-1 sm:px-2 text-center border-r border-stone-200/60"
              >
                {t.tableStartTime}
              </th>
              <th
                scope="col"
                className="w-[18%] py-3 px-1 sm:px-2 text-center border-r border-stone-200/60"
              >
                {t.tableEndTime}
              </th>
              <th
                scope="col"
                className="w-[16%] py-3 px-1 sm:px-2 text-center border-r border-stone-200/60"
              >
                {t.tableDuration}
              </th>
              <th
                scope="col"
                className="w-[20%] py-3 px-2 sm:px-3 text-right"
              >
                {t.tableMilkQuantity}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-[#18221D]">
            {sessions.map((session) => {
              const { datePrimary, dateSecondary } = formatDateParts(session.start_time);
              const start = formatTimeParts(session.start_time);
              const end = formatTimeParts(session.end_time);

              return (
                <tr
                  key={session.id}
                  className="hover:bg-stone-50/80 transition-colors"
                >
                  {/* Date Column */}
                  <td className="py-2.5 px-2 sm:px-3 text-left border-r border-stone-200/60">
                    <div className="font-semibold text-[#18221D] text-xs leading-snug truncate">
                      {datePrimary}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#5B6862] font-normal leading-tight">
                      {dateSecondary}
                    </div>
                  </td>

                  {/* Start Time Column */}
                  <td className="py-2.5 px-1 sm:px-2 text-center border-r border-stone-200/60">
                    <div className="font-mono font-medium text-[#18221D] text-xs sm:text-sm leading-snug">
                      {start.time}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#5B6862] font-normal leading-tight">
                      {start.period}
                    </div>
                  </td>

                  {/* End Time Column */}
                  <td className="py-2.5 px-1 sm:px-2 text-center border-r border-stone-200/60">
                    <div className="font-mono font-medium text-[#18221D] text-xs sm:text-sm leading-snug">
                      {end.time}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#5B6862] font-normal leading-tight">
                      {end.period}
                    </div>
                  </td>

                  {/* Duration Column */}
                  <td className="py-2.5 px-1 sm:px-2 text-center border-r border-stone-200/60 font-mono font-bold text-[#18221D] text-xs sm:text-sm">
                    {formatDuration(session.duration)}
                  </td>

                  {/* Milk Quantity Column */}
                  <td className="py-2.5 px-2 sm:px-3 text-right">
                    <div className="font-bold text-[#1A533E] text-xs sm:text-sm leading-snug">
                      {formatNumber(session.milk_quantity)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-[#5B6862] font-normal leading-tight">
                      {t.litresUnit}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
