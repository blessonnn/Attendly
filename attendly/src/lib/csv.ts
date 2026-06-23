import Papa from 'papaparse';
import type { Student, AttendanceRecord } from '@/types';

export function exportCSV(
  student: Student,
  records: AttendanceRecord[],
  monthName: string,
  year: number
): void {
  const data = records.map((record) => {
    const date = new Date(record.date + 'T00:00:00');
    return {
      Date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      Day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      Status: record.status === 'present' ? 'Present' : 'Absent',
    };
  });

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${student.name}-attendance-${monthName}-${year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
