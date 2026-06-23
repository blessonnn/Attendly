'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import type { AttendanceRecord } from '@/types';
import { useCallback } from 'react';
import { formatDate } from '@/lib/utils';

export function useAttendance(date?: string) {
  const records = useLiveQuery(async () => {
    if (!date) return [];
    return await db.attendance.where('date').equals(date).toArray();
  }, [date]);

  const markAttendance = useCallback(
    async (studentId: number, dateStr: string, status: 'present' | 'absent') => {
      // Use compound index to find existing record
      const existing = await db.attendance
        .where('[studentId+date]')
        .equals([studentId, dateStr])
        .first();

      if (existing) {
        await db.attendance.update(existing.id!, { status });
      } else {
        await db.attendance.add({ studentId, date: dateStr, status });
      }
    },
    []
  );

  const getStudentMonthRecords = useCallback(
    async (studentId: number, year: number, month: number): Promise<AttendanceRecord[]> => {
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-31`;

      return await db.attendance
        .where('studentId')
        .equals(studentId)
        .and((r) => r.date >= startDate && r.date <= endDate)
        .sortBy('date');
    },
    []
  );

  const getTodayStats = useCallback(async () => {
    const today = formatDate(new Date());
    const todayRecords = await db.attendance.where('date').equals(today).toArray();
    const totalStudents = await db.students.count();

    const present = todayRecords.filter((r) => r.status === 'present').length;
    const absent = todayRecords.filter((r) => r.status === 'absent').length;
    const percentage = totalStudents > 0 ? Math.round((present / totalStudents) * 100) : 0;

    return { totalStudents, present, absent, percentage };
  }, []);

  return {
    records: records ?? [],
    markAttendance,
    getStudentMonthRecords,
    getTodayStats,
    isLoading: records === undefined,
  };
}
