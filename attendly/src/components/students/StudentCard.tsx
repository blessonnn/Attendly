'use client';

import { getInitials } from '@/lib/utils';
import type { Student } from '@/types';

interface StudentCardProps {
  student: Student;
  onClick: (student: Student) => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
}

export default function StudentCard({ student, onClick, onEdit, onDelete }: StudentCardProps) {
  return (
    <div 
      onClick={() => onClick(student)}
      className="flex cursor-pointer items-center gap-3 rounded-[16px] bg-white p-3 shadow-sm transition-all duration-200 active:scale-[0.98] dark:bg-[#1C1C1E]"
    >
      {/* Avatar */}
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6] text-[15px] font-semibold text-white">
        {getInitials(student.name)}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-[#1D1D1F] dark:text-white">
          {student.name}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">
            Roll: {student.rollNumber}
          </span>
          {student.class && (
            <>
              <span className="text-[13px] text-[#D1D1D6] dark:text-[#3A3A3C]">·</span>
              <span className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">
                {student.class}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(student);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#007AFF] transition-colors hover:bg-[#007AFF]/10 active:bg-[#007AFF]/20"
          aria-label={`Edit ${student.name}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M12.75 2.25L15.75 5.25M1.5 16.5H4.5L14.25 6.75L11.25 3.75L1.5 13.5V16.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(student);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#FF3B30] transition-colors hover:bg-[#FF3B30]/10 active:bg-[#FF3B30]/20"
          aria-label={`Delete ${student.name}`}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M2.25 4.5H15.75M6 4.5V3C6 2.17157 6.67157 1.5 7.5 1.5H10.5C11.3284 1.5 12 2.17157 12 3V4.5M7.5 8.25V13.5M10.5 8.25V13.5M3.75 4.5L4.5 15C4.5 15.8284 5.17157 16.5 6 16.5H12C12.8284 16.5 13.5 15.8284 13.5 15L14.25 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
