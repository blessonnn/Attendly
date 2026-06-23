import Papa from 'papaparse';
import type { Student, AttendanceRecord } from '@/types';

export function exportCSV(
  student: Student,
  records: AttendanceRecord[],
  monthName: string,
  year: number,
  stats: { total: number; workingDays: number; present: number; absent: number; percentage: string }
): void {
  // Instead of row per day, user requested a single summary with these exact columns
  const data = [
    {
      'Student Name': student.name,
      'Month': `${monthName} ${year}`,
      'Calendar Days': stats.total,
      'Working Days': stats.workingDays,
      'Present Days': stats.present,
      'Absent Days': stats.absent,
      'Attendance Percentage': `${stats.percentage}%`
    }
  ];

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${student.name}-attendance-${monthName}-${year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
