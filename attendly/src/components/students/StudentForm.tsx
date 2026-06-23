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
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setName(student.name);
        setRollNumber(student.rollNumber);
        setStudentClass(student.class || '');
        setPhone(student.phone || '');
        setPhoto(student.photo);
      } else {
        setName('');
        setRollNumber('');
        setStudentClass('');
        setPhone('');
        setPhoto(undefined);
      }
      setTimeout(() => nameInputRef.current?.focus(), 300);
    }
  }, [isOpen, student]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Photo must be under 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNumber.trim()) return;

    onSubmit({
      name: name.trim(),
      rollNumber: rollNumber.trim(),
      class: studentClass.trim() || undefined,
      phone: phone.trim() || undefined,
      photo,
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
          {/* Photo */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[#F5F5F7] dark:bg-[#2C2C2E]">
              {photo ? (
                <img src={photo} alt="Student" className="h-full w-full object-cover" />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-[#8E8E93]">
                  <path
                    d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M3 16.8V9.2C3 8.08 3 7.52 3.218 7.092C3.41 6.716 3.716 6.41 4.092 6.218C4.52 6 5.08 6 6.2 6H6.608C7.118 6 7.373 6 7.607 5.945C7.813 5.897 8.008 5.815 8.184 5.703C8.382 5.577 8.546 5.399 8.876 5.044L9.124 4.776C9.454 4.421 9.618 4.243 9.816 4.117C9.993 4.005 10.187 3.923 10.393 3.875C10.627 3.82 10.882 3.82 11.392 3.82H12.608C13.118 3.82 13.373 3.82 13.607 3.875C13.813 3.923 14.008 4.005 14.184 4.117C14.382 4.243 14.546 4.421 14.876 4.776L15.124 5.044C15.454 5.399 15.618 5.577 15.816 5.703C15.993 5.815 16.187 5.897 16.393 5.945C16.627 6 16.882 6 17.392 6H17.8C18.92 6 19.48 6 19.908 6.218C20.284 6.41 20.59 6.716 20.782 7.092C21 7.52 21 8.08 21 9.2V16.8C21 17.92 21 18.48 20.782 18.908C20.59 19.284 20.284 19.59 19.908 19.782C19.48 20 18.92 20 17.8 20H6.2C5.08 20 4.52 20 4.092 19.782C3.716 19.59 3.41 19.284 3.218 18.908C3 18.48 3 17.92 3 16.8Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </div>
            
            <div className="flex gap-3">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setPhoto(`/avatars/avatar_${num}.png`)}
                  className={`relative h-12 w-12 overflow-hidden rounded-full transition-transform active:scale-95 ${
                    photo === `/avatars/avatar_${num}.png` ? 'ring-2 ring-[#007AFF] ring-offset-2 dark:ring-offset-[#1C1C1E]' : ''
                  }`}
                >
                  <img src={`/avatars/avatar_${num}.png`} alt={`Avatar ${num}`} className="h-full w-full object-cover" />
                </button>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F5F5F7] text-[#007AFF] transition-transform active:scale-95 dark:bg-[#2C2C2E]"
                aria-label="Upload custom photo"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>

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
