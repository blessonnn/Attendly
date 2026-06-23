'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import type { Student, AttendanceRecord, Holiday } from '@/types';
import { DEFAULT_WORKING_DAYS, isWorkingDay, getHoliday } from '@/lib/calendar';
import { getInitials } from '@/lib/utils';

interface StudentProfileProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentProfile({ student, isOpen, onClose }: StudentProfileProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const records = useLiveQuery(
    () => db.attendance.where('studentId').equals(student.id!).sortBy('date'),
    [student.id]
  );
  
  const holidaysData = useLiveQuery(() => db.holidays.toArray(), []) || [];
  const workingDaysSetting = useLiveQuery(() => db.settings.get('workingDays'));
  const workingDaysData = workingDaysSetting?.value ?? DEFAULT_WORKING_DAYS;

  const stats = useMemo(() => {
    if (!records) return { present: 0, absent: 0, streak: 0, emoji: '😴' };

    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;

    // Calculate Streak
    let streak = 0;
    
    // Sort records descending
    const sortedRecords = [...records].sort((a, b) => b.date.localeCompare(a.date));
    
    // Start from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = new Date(today);
    
    // Safety limit to avoid infinite loops (e.g. check up to 365 days back)
    for (let i = 0; i < 365; i++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
      
      const holiday = getHoliday(dateStr, holidaysData);
      const isWorkDay = isWorkingDay(dateStr, workingDaysData);

      if (!holiday && isWorkDay) {
        const record = sortedRecords.find(r => r.date === dateStr);
        if (record) {
          if (record.status === 'present') {
            streak++;
          } else {
            // Absent breaks the streak
            break;
          }
        } else {
          // No record. If it's today, we might just have not taken attendance yet.
          if (dateStr !== `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`) {
            break;
          }
        }
      }

      // Go to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }

    let emoji = '😴';
    if (streak >= 10) emoji = '👑';
    else if (streak >= 5) emoji = '🚀';
    else if (streak >= 3) emoji = '🔥';
    else if (streak >= 1) emoji = '👍';

    return { present, absent, streak, emoji };
  }, [records, holidaysData, workingDaysData]);

  if (!isOpen || !mounted) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-lg animate-slide-up rounded-t-[20px] bg-white px-5 pb-8 pt-3 shadow-xl dark:bg-[#1C1C1E] sm:rounded-[20px] sm:m-4">
        {/* Handle */}
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-[#D1D1D6] dark:bg-[#48484A]" />

        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 h-24 w-24 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6] shadow-md">
            {student.photo ? (
              <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[28px] font-semibold text-white">
                {getInitials(student.name)}
              </div>
            )}
          </div>
          <h2 className="text-[22px] font-bold text-[#1D1D1F] dark:text-white">
            {student.name}
          </h2>
          <p className="mt-1 flex items-center justify-center gap-2 text-[15px] text-[#8E8E93]">
            <span>Roll: {student.rollNumber}</span>
            {student.class && (
              <>
                <span className="text-[13px] text-[#D1D1D6] dark:text-[#3A3A3C]">·</span>
                <span>{student.class}</span>
              </>
            )}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#34C759]/10 py-5">
            <span className="text-[24px] font-bold text-[#34C759]">{stats.present}</span>
            <span className="mt-1 text-[13px] font-medium text-[#34C759]/80">Days Attended</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-[#FF3B30]/10 py-5">
            <span className="text-[24px] font-bold text-[#FF3B30]">{stats.absent}</span>
            <span className="mt-1 text-[13px] font-medium text-[#FF3B30]/80">Days Absent</span>
          </div>
        </div>

        {/* Streak */}
        <div className="mt-3 flex flex-col items-center justify-center rounded-2xl bg-[#F5F5F7] py-6 dark:bg-[#2C2C2E]">
          <div className="text-[40px] leading-none mb-2">{stats.emoji}</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-bold text-[#1D1D1F] dark:text-white">{stats.streak}</span>
            <span className="text-[15px] font-medium text-[#8E8E93]">Day Streak</span>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-8">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-[#F5F5F7] py-3.5 text-[15px] font-semibold text-[#1D1D1F] transition-all active:scale-[0.98] dark:bg-[#2C2C2E] dark:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
