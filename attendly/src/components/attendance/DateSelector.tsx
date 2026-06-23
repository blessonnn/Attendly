'use client';

import { useState, useEffect } from 'react';
import { cn, formatDate } from '@/lib/utils';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [centerDateStr, setCenterDateStr] = useState(selectedDate);

  useEffect(() => {
    const center = new Date(centerDateStr + 'T00:00:00');
    const selected = new Date(selectedDate + 'T00:00:00');
    const diffDays = Math.abs((selected.getTime() - center.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 3) {
      setCenterDateStr(selectedDate);
    }
  }, [selectedDate, centerDateStr]);

  const center = new Date(centerDateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate 7-day range around center date
  const days: Date[] = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(center);
    d.setDate(d.getDate() + i);
    days.push(d);
  }

  const goToPrevDay = () => {
    const selected = new Date(selectedDate + 'T00:00:00');
    selected.setDate(selected.getDate() - 1);
    onDateChange(formatDate(selected));
  };

  const goToNextDay = () => {
    const selected = new Date(selectedDate + 'T00:00:00');
    selected.setDate(selected.getDate() + 1);
    onDateChange(formatDate(selected));
  };

  const goToToday = () => {
    onDateChange(formatDate(today));
    setCenterDateStr(formatDate(today));
  };

  return (
    <div className="space-y-3 px-5">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPrevDay}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#007AFF] transition-colors active:bg-[#007AFF]/10"
          aria-label="Previous day"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={goToToday}
          className="rounded-full bg-[#007AFF]/10 px-4 py-1.5 text-[13px] font-semibold text-[#007AFF] transition-colors active:bg-[#007AFF]/20"
        >
          Today
        </button>

        <button
          onClick={goToNextDay}
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#007AFF] transition-colors active:bg-[#007AFF]/10"
          aria-label="Next day"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L13 10L7 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Day chips */}
      <div className="flex justify-between gap-1.5">
        {days.map((day) => {
          const dateStr = formatDate(day);
          const isSelected = dateStr === selectedDate;
          const isToday = formatDate(day) === formatDate(today);

          return (
            <button
              key={dateStr}
              onClick={() => onDateChange(dateStr)}
              className={cn(
                'flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 transition-all duration-200 active:scale-95',
                isSelected
                  ? 'bg-[#007AFF] shadow-md shadow-[#007AFF]/30'
                  : 'bg-white dark:bg-[#1C1C1E]'
              )}
            >
              <span
                className={cn(
                  'text-[11px] font-medium uppercase',
                  isSelected ? 'text-white/70' : 'text-[#8E8E93] dark:text-[#98989D]'
                )}
              >
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span
                className={cn(
                  'text-[17px] font-bold',
                  isSelected ? 'text-white' : 'text-[#1D1D1F] dark:text-white'
                )}
              >
                {day.getDate()}
              </span>
              {isToday && !isSelected && (
                <div className="h-1 w-1 rounded-full bg-[#007AFF]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
