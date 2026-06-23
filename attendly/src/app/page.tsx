'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { formatDate, formatDisplayDate } from '@/lib/utils';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/dashboard/StatCard';
import QuickAction from '@/components/dashboard/QuickAction';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const today = formatDate(new Date());

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalStudents = useLiveQuery(() => db.students.count(), []);
  const todayRecords = useLiveQuery(
    () => db.attendance.where('date').equals(today).toArray(),
    [today]
  );

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#007AFF] border-t-transparent" />
      </div>
    );
  }

  const present = todayRecords?.filter((r) => r.status === 'present').length ?? 0;
  const absent = todayRecords?.filter((r) => r.status === 'absent').length ?? 0;
  const total = totalStudents ?? 0;
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div className="pb-24">
      <PageHeader
        title="Dashboard"
        subtitle={formatDisplayDate(new Date())}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 px-5 pt-4">
        <StatCard
          variant="primary"
          label="Total Students"
          value={total}
          icon={
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M4 17C4 13.686 6.686 11 10 11C13.314 11 16 13.686 16 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          variant="success"
          label="Present Today"
          value={present}
          icon={
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="M5 10L8.5 13.5L15 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
        <StatCard
          variant="danger"
          label="Absent Today"
          value={absent}
          icon={
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          }
        />
        <StatCard
          variant="default"
          label="Attendance %"
          value={`${percentage}%`}
          icon={
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 px-5">
        <h2 className="mb-3 text-[17px] font-bold text-[#1D1D1F] dark:text-white">
          Quick Actions
        </h2>
        <div className="space-y-3">
          <QuickAction
            href="/attendance"
            label="Mark Attendance"
            description="Record today's attendance"
            color="#007AFF"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M3 9H21" stroke="currentColor" strokeWidth="1.8" />
                <path d="M9 14L11 16L15 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
          />
          <QuickAction
            href="/students"
            label="Manage Students"
            description="Add, edit, or remove students"
            color="#34C759"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 20C5 16.134 8.134 13 12 13C15.866 13 19 16.134 19 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            }
          />
          <QuickAction
            href="/reports"
            label="View Reports"
            description="Generate attendance reports"
            color="#FF9500"
            icon={
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M8 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 16V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M16 16V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
          />
        </div>
      </div>
    </div>
  );
}
