'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { formatDate, formatDisplayDate } from '@/lib/utils';
import PageHeader from '@/components/layout/PageHeader';
import DateSelector from '@/components/attendance/DateSelector';
import AttendanceRow from '@/components/attendance/AttendanceRow';

export default function AttendancePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  useEffect(() => {
    setMounted(true);
  }, []);

  const students = useLiveQuery(() => db.students.orderBy('name').toArray(), []);
  const records = useLiveQuery(
    () => db.attendance.where('date').equals(selectedDate).toArray(),
    [selectedDate]
  );

  const handleToggle = useCallback(
    async (studentId: number, status: 'present' | 'absent') => {
      const existing = await db.attendance
        .where('[studentId+date]')
        .equals([studentId, selectedDate])
        .first();

      if (existing) {
        await db.attendance.update(existing.id!, { status });
      } else {
        await db.attendance.add({ studentId, date: selectedDate, status });
      }
    },
    [selectedDate]
  );

  const markAllPresent = useCallback(async () => {
    if (!students) return;
    await db.transaction('rw', db.attendance, async () => {
      for (const student of students) {
        const existing = await db.attendance
          .where('[studentId+date]')
          .equals([student.id!, selectedDate])
          .first();

        if (existing) {
          await db.attendance.update(existing.id!, { status: 'present' });
        } else {
          await db.attendance.add({ studentId: student.id!, date: selectedDate, status: 'present' });
        }
      }
    });
  }, [students, selectedDate]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#007AFF] border-t-transparent" />
      </div>
    );
  }

  const present = records?.filter((r) => r.status === 'present').length ?? 0;
  const absent = records?.filter((r) => r.status === 'absent').length ?? 0;
  const total = students?.length ?? 0;
  const displayDate = new Date(selectedDate + 'T00:00:00');

  return (
    <div className="pb-24">
      <PageHeader
        title="Attendance"
        subtitle={formatDisplayDate(displayDate)}
      />

      {/* Date Selector */}
      <div className="pt-3">
        <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      {/* Summary strip */}
      <div className="mt-4 flex items-center gap-3 px-5">
        <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#34C759]/10 py-2">
          <span className="text-[15px] font-bold text-[#34C759]">{present}</span>
          <span className="text-[13px] text-[#34C759]/70">Present</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#FF3B30]/10 py-2">
          <span className="text-[15px] font-bold text-[#FF3B30]">{absent}</span>
          <span className="text-[13px] text-[#FF3B30]/70">Absent</span>
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#007AFF]/10 py-2">
          <span className="text-[15px] font-bold text-[#007AFF]">{total - present - absent}</span>
          <span className="text-[13px] text-[#007AFF]/70">Unmarked</span>
        </div>
      </div>

      {/* Mark All Present */}
      {total > 0 && (
        <div className="px-5 pt-4">
          <button
            onClick={markAllPresent}
            className="w-full rounded-xl bg-[#34C759]/10 py-3 text-[15px] font-semibold text-[#34C759] transition-all active:scale-[0.98]"
          >
            Mark All Present
          </button>
        </div>
      )}

      {/* Student List */}
      <div className="mt-4 space-y-2 px-5">
        {!students || students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F5F7] dark:bg-[#1C1C1E]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-[#C7C7CC]">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 20C5 16.134 8.134 13 12 13C15.866 13 19 16.134 19 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[17px] font-semibold text-[#1D1D1F] dark:text-white">
              No students yet
            </p>
            <p className="mt-1 text-[15px] text-[#8E8E93]">
              Add students first to mark attendance
            </p>
          </div>
        ) : (
          students.map((student) => (
            <AttendanceRow
              key={student.id}
              student={student}
              record={records?.find((r) => r.studentId === student.id)}
              onToggle={handleToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}
