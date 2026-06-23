'use client';

import { useState, useRef, useEffect } from 'react';
import type { Student } from '@/types';

interface StudentFormProps {
  student?: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Student, 'id'>) => void;
}

export default function StudentForm({ student, isOpen, onClose, onSubmit }: StudentFormProps) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [phone, setPhone] = useState('');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setName(student.name);
        setRollNumber(student.rollNumber);
        setStudentClass(student.class || '');
        setPhone(student.phone || '');
      } else {
        setName('');
        setRollNumber('');
        setStudentClass('');
        setPhone('');
      }
      setTimeout(() => nameInputRef.current?.focus(), 300);
    }
  }, [isOpen, student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) return;

    onSubmit({
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      class: studentClass.trim() || undefined,
      phone: phone.trim() || undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

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
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[#D1D1D6] dark:bg-[#48484A]" />

        {/* Title */}
        <h2 className="mb-6 text-[20px] font-bold text-[#1D1D1F] dark:text-white">
          {student ? 'Edit Student' : 'Add Student'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">


          {/* Name */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
              Name *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student name"
              required
              className="w-full rounded-xl border-0 bg-[#F5F5F7] px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-all placeholder:text-[#C7C7CC] focus:ring-2 focus:ring-[#007AFF] dark:bg-[#2C2C2E] dark:text-white dark:placeholder:text-[#636366]"
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
              Roll Number *
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="e.g., 001"
              required
              className="w-full rounded-xl border-0 bg-[#F5F5F7] px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-all placeholder:text-[#C7C7CC] focus:ring-2 focus:ring-[#007AFF] dark:bg-[#2C2C2E] dark:text-white dark:placeholder:text-[#636366]"
            />
          </div>

          {/* Class */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
              Class
            </label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="e.g., 10th Grade"
              className="w-full rounded-xl border-0 bg-[#F5F5F7] px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-all placeholder:text-[#C7C7CC] focus:ring-2 focus:ring-[#007AFF] dark:bg-[#2C2C2E] dark:text-white dark:placeholder:text-[#636366]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-[#8E8E93] dark:text-[#98989D]">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl border-0 bg-[#F5F5F7] px-4 py-3 text-[15px] text-[#1D1D1F] outline-none transition-all placeholder:text-[#C7C7CC] focus:ring-2 focus:ring-[#007AFF] dark:bg-[#2C2C2E] dark:text-white dark:placeholder:text-[#636366]"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              onPointerDown={(e) => e.preventDefault()}
              className="flex-1 rounded-xl bg-[#F5F5F7] px-4 py-3.5 text-[15px] font-semibold text-[#1D1D1F] transition-all active:scale-[0.97] dark:bg-[#2C2C2E] dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              onPointerDown={(e) => e.preventDefault()}
              className="flex-1 rounded-xl bg-[#007AFF] px-4 py-3.5 text-[15px] font-semibold text-white transition-all active:scale-[0.97] hover:bg-[#0066DD]"
            >
              {student ? 'Save' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
