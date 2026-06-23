'use client';

import { cn, getInitials } from '@/lib/utils';
import type { Student, AttendanceRecord } from '@/types';

interface AttendanceRowProps {
  student: Student;
  record?: AttendanceRecord;
  onToggle: (studentId: number, status: 'present' | 'absent') => void;
}

export default function AttendanceRow({ student, record, onToggle }: AttendanceRowProps) {
  const status = record?.status;

  const handleToggle = (newStatus: 'present' | 'absent') => {
    onToggle(student.id!, newStatus);
  };

  return (
    <div className={cn(
      'flex items-center gap-3 rounded-[16px] p-3 transition-all duration-300',
      status === 'present' && 'bg-[#34C759]/8 dark:bg-[#34C759]/10',
      status === 'absent' && 'bg-[#FF3B30]/8 dark:bg-[#FF3B30]/10',
      !status && 'bg-white dark:bg-[#1C1C1E]'
    )}>
      {/* Avatar */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#007AFF] to-[#5856D6]">
        {student.photo ? (
          <img src={student.photo} alt={student.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-white">
            {getInitials(student.name)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-[#1D1D1F] dark:text-white">
          {student.name}
        </p>
        <p className="text-[12px] text-[#8E8E93] dark:text-[#98989D]">
          Roll: {student.rollNumber}
        </p>
      </div>

      {/* Toggle buttons */}
      <div className="flex shrink-0 gap-2">
        <button
          onClick={() => handleToggle('present')}
          className={cn(
            'flex h-10 w-[72px] items-center justify-center rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-95',
            status === 'present'
              ? 'bg-[#34C759] text-white shadow-md shadow-[#34C759]/30'
              : 'bg-[#F5F5F7] text-[#8E8E93] dark:bg-[#2C2C2E] dark:text-[#98989D]'
          )}
        >
          Present
        </button>
        <button
          onClick={() => handleToggle('absent')}
          className={cn(
            'flex h-10 w-[72px] items-center justify-center rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-95',
            status === 'absent'
              ? 'bg-[#FF3B30] text-white shadow-md shadow-[#FF3B30]/30'
              : 'bg-[#F5F5F7] text-[#8E8E93] dark:bg-[#2C2C2E] dark:text-[#98989D]'
          )}
        >
          Absent
        </button>
      </div>
    </div>
  );
}
