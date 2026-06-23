'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useStudents } from '@/hooks/useStudents';
import type { Student } from '@/types';
import PageHeader from '@/components/layout/PageHeader';
import StudentCard from '@/components/students/StudentCard';
import StudentForm from '@/components/students/StudentForm';

export default function StudentsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Student | null>(null);
  const { students, addStudent, updateStudent, deleteStudent, isLoading } = useStudents(searchQuery);

  // Lazy rendering
  const [visibleCount, setVisibleCount] = useState(20);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      { threshold: 0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(20);
  }, [searchQuery]);

  const handleAdd = useCallback(
    async (data: Omit<Student, 'id'>) => {
      await addStudent(data);
    },
    [addStudent]
  );

  const handleEdit = useCallback(
    async (data: Omit<Student, 'id'>) => {
      if (editingStudent?.id) {
        await updateStudent(editingStudent.id, data);
      }
      setEditingStudent(null);
    },
    [editingStudent, updateStudent]
  );

  const handleDelete = useCallback(
    async (student: Student) => {
      if (student.id) {
        await deleteStudent(student.id);
      }
      setDeleteConfirm(null);
    },
    [deleteStudent]
  );

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#007AFF] border-t-transparent" />
      </div>
    );
  }

  const visibleStudents = students.slice(0, visibleCount);

  return (
    <div className="pb-24">
      <PageHeader title="Students" subtitle={`${students.length} student${students.length !== 1 ? 's' : ''}`} />

      {/* Search */}
      <div className="px-5 pb-3 pt-3">
        <div className="relative">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]"
          >
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full rounded-xl bg-[#F5F5F7] py-3 pl-10 pr-4 text-[15px] text-[#1D1D1F] outline-none transition-all placeholder:text-[#C7C7CC] focus:ring-2 focus:ring-[#007AFF] dark:bg-[#1C1C1E] dark:text-white dark:placeholder:text-[#636366]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#C7C7CC] text-white"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 2L8 8M8 2L2 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-2 px-5">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#007AFF] border-t-transparent" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F5F7] dark:bg-[#1C1C1E]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-[#C7C7CC]">
                <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5 20C5 16.134 8.134 13 12 13C15.866 13 19 16.134 19 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[17px] font-semibold text-[#1D1D1F] dark:text-white">
              {searchQuery ? 'No students found' : 'No students yet'}
            </p>
            <p className="mt-1 text-[15px] text-[#8E8E93]">
              {searchQuery ? 'Try a different search term' : 'Tap + to add your first student'}
            </p>
          </div>
        ) : (
          <>
            {visibleStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={(s) => {
                  setEditingStudent(s);
                  setIsFormOpen(true);
                }}
                onDelete={(s) => setDeleteConfirm(s)}
              />
            ))}
            {visibleCount < students.length && (
              <div ref={loadMoreRef} className="flex justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#007AFF] border-t-transparent" />
              </div>
            )}
          </>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => {
          setEditingStudent(null);
          setIsFormOpen(true);
        }}
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/30 transition-all duration-200 active:scale-90 hover:bg-[#0066DD]"
        aria-label="Add student"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* Student Form Modal */}
      <StudentForm
        isOpen={isFormOpen}
        student={editingStudent}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={editingStudent ? handleEdit : handleAdd}
      />

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative mx-5 w-full max-w-sm rounded-[20px] bg-white p-6 shadow-xl dark:bg-[#1C1C1E]">
            <h3 className="text-[17px] font-bold text-[#1D1D1F] dark:text-white">
              Delete Student?
            </h3>
            <p className="mt-2 text-[15px] text-[#8E8E93]">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This will also remove all their attendance records. This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 rounded-xl bg-[#F5F5F7] px-4 py-3 text-[15px] font-semibold text-[#1D1D1F] transition-all active:scale-[0.97] dark:bg-[#2C2C2E] dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 rounded-xl bg-[#FF3B30] px-4 py-3 text-[15px] font-semibold text-white transition-all active:scale-[0.97]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
