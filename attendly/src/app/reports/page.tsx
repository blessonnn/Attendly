'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { getMonthName, getMonthDays } from '@/lib/utils';
import { DEFAULT_WORKING_DAYS, calculateWorkingDays } from '@/lib/calendar';
import { generatePDFReport } from '@/lib/pdf';
import { exportCSV } from '@/lib/csv';
import type { AttendanceRecord } from '@/types';
import PageHeader from '@/components/layout/PageHeader';

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const students = useLiveQuery(() => db.students.orderBy('name').toArray(), []);
  const holidaysData = useLiveQuery(() => db.holidays.toArray(), []) || [];
  const workingDaysSetting = useLiveQuery(() => db.settings.get('workingDays'));
  const workingDaysData = workingDaysSetting?.value ?? DEFAULT_WORKING_DAYS;

  // Fetch records when student/month changes
  useEffect(() => {
    if (selectedStudentId === null) {
      setRecords([]);
      return;
    }

    const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
    const endDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-31`;

    db.attendance
      .where('studentId')
      .equals(selectedStudentId)
      .and((r) => r.date >= startDate && r.date <= endDate)
      .sortBy('date')
      .then(setRecords);
  }, [selectedStudentId, selectedMonth, selectedYear]);

  const monthHolidays = useMemo(() => {
    return holidaysData.filter((h) => {
      const d = new Date(h.date + 'T00:00:00');
      return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
    });
  }, [holidaysData, selectedMonth, selectedYear]);

  const stats = useMemo(() => {
    const calendarDaysCount = getMonthDays(selectedYear, selectedMonth);
    const workingDaysCount = calculateWorkingDays(selectedYear, selectedMonth, workingDaysData, holidaysData);

    const present = records.filter((r) => r.status === 'present').length;
    const absent = records.filter((r) => r.status === 'absent').length;
    const percentage = workingDaysCount > 0 ? ((present / workingDaysCount) * 100).toFixed(1) : '0.0';
    return { present, absent, total: calendarDaysCount, workingDays: workingDaysCount, percentage };
  }, [records, selectedYear, selectedMonth, workingDaysData, holidaysData]);

  const selectedStudent = students?.find((s) => s.id === selectedStudentId);

  const handleDownloadPDF = () => {
    if (!selectedStudent) return;
    generatePDFReport(selectedStudent, records, selectedMonth, selectedYear, stats, monthHolidays);
  };

  const handleExportCSV = () => {
    if (!selectedStudent) return;
    exportCSV(selectedStudent, records, getMonthName(selectedMonth), selectedYear, stats);
  };

  // Generate month options
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: getMonthName(i),
  }));

  // Generate year options (current year ± 2)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#007AFF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="Reports" subtitle="Generate attendance reports" />

      <div className="space-y-4 px-5 pt-4">
        {/* Student Selector */}
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
            Select Student
          </label>
          <select
            value={selectedStudentId ?? ''}
            onChange={(e) => setSelectedStudentId(e.target.value ? Number(e.target.value) : null)}
            className="w-full appearance-none rounded-xl bg-[#F5F5F7] px-4 py-3.5 text-[15px] text-[#1D1D1F] outline-none transition-all focus:ring-2 focus:ring-[#007AFF] dark:bg-[#1C1C1E] dark:text-white"
          >
            <option value="">Choose a student...</option>
            {students?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNumber})
              </option>
            ))}
          </select>
        </div>

        {/* Month/Year Selectors */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="mb-1.5 block text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full appearance-none rounded-xl bg-[#F5F5F7] px-4 py-3.5 text-[15px] text-[#1D1D1F] outline-none transition-all focus:ring-2 focus:ring-[#007AFF] dark:bg-[#1C1C1E] dark:text-white"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-28">
            <label className="mb-1.5 block text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full appearance-none rounded-xl bg-[#F5F5F7] px-4 py-3.5 text-[15px] text-[#1D1D1F] outline-none transition-all focus:ring-2 focus:ring-[#007AFF] dark:bg-[#1C1C1E] dark:text-white"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Report Summary */}
        {selectedStudentId && (
          <div className="mt-2 rounded-[20px] bg-white p-5 shadow-sm dark:bg-[#1C1C1E]">
            <h3 className="text-[17px] font-bold text-[#1D1D1F] dark:text-white">
              {getMonthName(selectedMonth)} {selectedYear}
            </h3>
            {selectedStudent && (
              <p className="mt-0.5 text-[13px] text-[#8E8E93]">{selectedStudent.name}</p>
            )}

            {/* Stats Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-[#F5F5F7] p-4 dark:bg-[#2C2C2E]">
                <p className="text-[28px] font-bold text-[#007AFF]">{stats.total}</p>
                <p className="text-[13px] text-[#8E8E93]">Total Days</p>
              </div>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 dark:bg-[#2C2C2E]">
                <p className="text-[28px] font-bold text-[#34C759]">{stats.present}</p>
                <p className="text-[13px] text-[#8E8E93]">Present</p>
              </div>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 dark:bg-[#2C2C2E]">
                <p className="text-[28px] font-bold text-[#FF3B30]">{stats.absent}</p>
                <p className="text-[13px] text-[#8E8E93]">Absent</p>
              </div>
              <div className="rounded-2xl bg-[#F5F5F7] p-4 dark:bg-[#2C2C2E]">
                <p className="text-[28px] font-bold text-[#1D1D1F] dark:text-white">
                  {stats.percentage}%
                </p>
                <p className="text-[13px] text-[#8E8E93]">Attendance</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="h-2 overflow-hidden rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#007AFF] to-[#34C759] transition-all duration-500"
                  style={{ width: `${stats.percentage}%` }}
                />
              </div>
            </div>

            {/* Export Buttons */}
            <div className="mt-5 flex gap-3">
              <button
                onClick={handleDownloadPDF}
                disabled={records.length === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#007AFF] px-4 py-3.5 text-[15px] font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2V12M9 12L5 8M9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 13V14C2 15.1046 2.89543 16 4 16H14C15.1046 16 16 15.1046 16 14V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                PDF
              </button>
              <button
                onClick={handleExportCSV}
                disabled={records.length === 0}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#34C759] px-4 py-3.5 text-[15px] font-semibold text-white transition-all active:scale-[0.97] disabled:opacity-40"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2V12M9 12L5 8M9 12L13 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 13V14C2 15.1046 2.89543 16 4 16H14C15.1046 16 16 15.1046 16 14V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                CSV
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!selectedStudentId && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F5F7] dark:bg-[#1C1C1E]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-[#C7C7CC]">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 16V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 16V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[17px] font-semibold text-[#1D1D1F] dark:text-white">
              Select a student
            </p>
            <p className="mt-1 text-[15px] text-[#8E8E93]">
              Choose a student to view their report
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
