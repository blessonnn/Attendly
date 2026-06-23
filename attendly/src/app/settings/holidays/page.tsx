'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import { Holiday } from '@/types';
import { formatDate } from '@/lib/utils';

export default function HolidaysPage() {
  const holidays = useLiveQuery(() => db.holidays.orderBy('date').toArray());
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDate(formatDate(new Date()));
    setShowModal(true);
  };

  const openEditModal = (holiday: Holiday) => {
    setEditingId(holiday.id!);
    setTitle(holiday.title);
    setDate(holiday.date);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      await db.holidays.delete(id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date) return;

    if (editingId) {
      await db.holidays.update(editingId, { title, date });
    } else {
      await db.holidays.add({ title, date });
    }

    setShowModal(false);
  };

  if (!mounted) return null;

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center justify-between bg-[#F5F5F7]/80 px-5 pb-3 pt-12 backdrop-blur-md dark:bg-[#000000]/80">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="flex h-10 w-10 items-center justify-center rounded-full text-[#007AFF] transition-colors active:bg-[#007AFF]/10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="text-[28px] font-bold text-[#1D1D1F] dark:text-white">Holidays</h1>
        </div>
        <button
          onClick={openAddModal}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#007AFF]/10 text-[#007AFF] transition-colors active:bg-[#007AFF]/20"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="px-5 pt-4">
        {holidays?.length === 0 ? (
          <div className="mt-12 text-center text-[#8E8E93]">
            <p>No holidays added yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {holidays?.map((holiday) => {
              const d = new Date(holiday.date + 'T00:00:00');
              const displayDate = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
              
              return (
                <div key={holiday.id} className="flex items-center justify-between rounded-[16px] bg-white p-4 shadow-sm dark:bg-[#1C1C1E]">
                  <div>
                    <h3 className="text-[17px] font-semibold text-[#1D1D1F] dark:text-white">{holiday.title}</h3>
                    <p className="mt-0.5 text-[13px] text-[#8E8E93]">{displayDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(holiday)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[#007AFF] transition-colors active:bg-[#007AFF]/10"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(holiday.id!)}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[#FF3B30] transition-colors active:bg-[#FF3B30]/10"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-sm rounded-[20px] bg-white p-6 shadow-xl dark:bg-[#1C1C1E]">
            <h3 className="mb-4 text-[20px] font-bold text-[#1D1D1F] dark:text-white">
              {editingId ? 'Edit Holiday' : 'Add Holiday'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#8E8E93]">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl bg-[#F5F5F7] px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#007AFF]/20 dark:bg-[#2C2C2E] dark:text-white dark:focus:bg-[#38383A]"
                  placeholder="e.g. Christmas"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#8E8E93]">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl bg-[#F5F5F7] px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-colors focus:bg-white focus:ring-2 focus:ring-[#007AFF]/20 dark:bg-[#2C2C2E] dark:text-white dark:focus:bg-[#38383A]"
                />
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl bg-[#F5F5F7] px-4 py-3 text-[15px] font-semibold text-[#1D1D1F] transition-all active:scale-[0.97] dark:bg-[#2C2C2E] dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-[#007AFF] px-4 py-3 text-[15px] font-semibold text-white transition-all active:scale-[0.97]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
