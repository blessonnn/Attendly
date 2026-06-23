'use client';

import { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { exportBackup, importBackup, deleteAllData } from '@/lib/backup';
import PageHeader from '@/components/layout/PageHeader';
import { db } from '@/db';
import { DEFAULT_WORKING_DAYS } from '@/lib/calendar';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const workingDaysSetting = useLiveQuery(() => db.settings.get('workingDays'));
  const workingDays = workingDaysSetting?.value ?? DEFAULT_WORKING_DAYS;

  const toggleWorkingDay = async (dayIndex: number) => {
    const newWorkingDays = workingDays.includes(dayIndex)
      ? workingDays.filter((d: number) => d !== dayIndex)
      : [...workingDays, dayIndex].sort((a: number, b: number) => a - b);
    
    await db.settings.put({ id: 'workingDays', value: newWorkingDays });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleExport = async () => {
    try {
      await exportBackup();
    } catch {
      alert('Failed to export data');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importBackup(file);
      setImportStatus(`Imported ${result.students} students and ${result.attendance} records`);
      setTimeout(() => setImportStatus(null), 3000);
    } catch {
      alert('Failed to import backup. Please check the file format.');
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllData();
      setShowDeleteConfirm(false);
    } catch {
      alert('Failed to delete data');
    }
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#007AFF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHeader title="Settings" />

      <div className="space-y-6 px-5 pt-4">
        {/* Academic Calendar */}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93] dark:text-[#98989D]">
            Academic Calendar
          </h3>
          <div className="overflow-hidden rounded-[16px] bg-white shadow-sm dark:bg-[#1C1C1E]">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, index) => (
              <div key={dayName}>
                <div className="flex w-full items-center justify-between px-4 py-3.5">
                  <span className="text-[15px] text-[#1D1D1F] dark:text-white">{dayName}</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={workingDays.includes(index)}
                      onChange={() => toggleWorkingDay(index)}
                    />
                    <div className="peer h-7 w-12 rounded-full bg-[#E5E5EA] after:absolute after:left-[2px] after:top-[2px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#34C759] peer-checked:after:translate-x-[20px] peer-checked:after:border-white dark:bg-[#38383A] dark:peer-checked:bg-[#34C759]"></div>
                  </label>
                </div>
                {index < 6 && <div className="mx-4 h-px bg-[#E5E5EA] dark:bg-[#38383A]" />}
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-[16px] bg-white shadow-sm dark:bg-[#1C1C1E]">
            <Link
              href="/settings/holidays"
              className="flex w-full items-center justify-between px-4 py-3.5 transition-colors active:bg-[#F5F5F7] dark:active:bg-[#2C2C2E]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF3B30]/15">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M12 2V4M6 2V4M3 7H15M4 2H14C14.5523 2 15 2.44772 15 3V15C15 15.5523 14.5523 16 14 16H4C3.44772 16 3 15.5523 3 15V3C3 2.44772 3.44772 2 4 2Z" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-[15px] text-[#1D1D1F] dark:text-white">Manage Holidays</span>
              </div>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#C7C7CC]">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93] dark:text-[#98989D]">
            Appearance
          </h3>
          <div className="overflow-hidden rounded-[16px] bg-white shadow-sm dark:bg-[#1C1C1E]">
            <button
              onClick={() => setTheme('light')}
              className="flex w-full items-center justify-between px-4 py-3.5 transition-colors active:bg-[#F5F5F7] dark:active:bg-[#2C2C2E]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF9500]/15">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="4" fill="#FF9500" />
                    <path d="M9 1V3M9 15V17M1 9H3M15 9H17M3.93 3.93L5.34 5.34M12.66 12.66L14.07 14.07M3.93 14.07L5.34 12.66M12.66 5.34L14.07 3.93" stroke="#FF9500" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[15px] text-[#1D1D1F] dark:text-white">Light Mode</span>
              </div>
              {theme === 'light' && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#007AFF]">
                  <path d="M5 10L8.5 13.5L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <div className="mx-4 h-px bg-[#E5E5EA] dark:bg-[#38383A]" />

            <button
              onClick={() => setTheme('dark')}
              className="flex w-full items-center justify-between px-4 py-3.5 transition-colors active:bg-[#F5F5F7] dark:active:bg-[#2C2C2E]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5856D6]/15">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M15.5 10.5C14.8 13.5 12.1 15.5 9 15.5C5.41 15.5 2.5 12.59 2.5 9C2.5 5.9 4.5 3.2 7.5 2.5C6.5 4 6.5 6 7.5 8C8.5 10 10.5 11.5 13 11.5C14 11.5 14.8 11.1 15.5 10.5Z" fill="#5856D6" stroke="#5856D6" strokeWidth="1" />
                  </svg>
                </div>
                <span className="text-[15px] text-[#1D1D1F] dark:text-white">Dark Mode</span>
              </div>
              {theme === 'dark' && (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-[#007AFF]">
                  <path d="M5 10L8.5 13.5L15 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Data Management */}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93] dark:text-[#98989D]">
            Data Management
          </h3>
          <div className="overflow-hidden rounded-[16px] bg-white shadow-sm dark:bg-[#1C1C1E]">
            <button
              onClick={handleExport}
              className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors active:bg-[#F5F5F7] dark:active:bg-[#2C2C2E]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007AFF]/15">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 12V2M9 2L5 6M9 2L13 6" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 13V14C2 15.1046 2.89543 16 4 16H14C15.1046 16 16 15.1046 16 14V13" stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[15px] text-[#1D1D1F] dark:text-white">Export Backup (JSON)</span>
            </button>

            <div className="mx-4 h-px bg-[#E5E5EA] dark:bg-[#38383A]" />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors active:bg-[#F5F5F7] dark:active:bg-[#2C2C2E]"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#34C759]/15">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 2V12M9 12L5 8M9 12L13 8" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M2 13V14C2 15.1046 2.89543 16 4 16H14C15.1046 16 16 15.1046 16 14V13" stroke="#34C759" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[15px] text-[#1D1D1F] dark:text-white">Import Backup (JSON)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          {importStatus && (
            <div className="mt-2 rounded-xl bg-[#34C759]/10 p-3 text-center text-[13px] font-medium text-[#34C759]">
              {importStatus}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div>
          <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-[#8E8E93] dark:text-[#98989D]">
            Danger Zone
          </h3>
          <div className="overflow-hidden rounded-[16px] bg-white shadow-sm dark:bg-[#1C1C1E]">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex w-full items-center gap-3 px-4 py-3.5 transition-colors active:bg-[#FF3B30]/5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF3B30]/15">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2.25 4.5H15.75M6 4.5V3C6 2.17 6.67 1.5 7.5 1.5H10.5C11.33 1.5 12 2.17 12 3V4.5M7.5 8.25V13.5M10.5 8.25V13.5M3.75 4.5L4.5 15C4.5 15.83 5.17 16.5 6 16.5H12C12.83 16.5 13.5 15.83 13.5 15L14.25 4.5" stroke="#FF3B30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-[15px] text-[#FF3B30]">Delete All Data</span>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="pb-8 pt-4 text-center">
          <p className="text-[13px] font-medium text-[#8E8E93]">Attendly v1.0.0</p>
          <p className="mt-0.5 text-[11px] text-[#C7C7CC]">Built with ❤️ for educators</p>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative mx-5 w-full max-w-sm rounded-[20px] bg-white p-6 shadow-xl dark:bg-[#1C1C1E]">
            <h3 className="text-[17px] font-bold text-[#1D1D1F] dark:text-white">
              Delete All Data?
            </h3>
            <p className="mt-2 text-[15px] text-[#8E8E93]">
              This will permanently delete all students and attendance records. This action cannot be undone. Consider exporting a backup first.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 rounded-xl bg-[#F5F5F7] px-4 py-3 text-[15px] font-semibold text-[#1D1D1F] transition-all active:scale-[0.97] dark:bg-[#2C2C2E] dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="flex-1 rounded-xl bg-[#FF3B30] px-4 py-3 text-[15px] font-semibold text-white transition-all active:scale-[0.97]"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
