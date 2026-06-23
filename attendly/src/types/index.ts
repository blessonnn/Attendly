export interface Student {
  id?: number;
  name: string;
  rollNumber: string;
  class?: string;
  phone?: string;
  photo?: string; // base64 data URL
}

export interface AttendanceRecord {
  id?: number;
  studentId: number;
  date: string; // YYYY-MM-DD format
  status: 'present' | 'absent';
}

export interface Holiday {
  id?: number;
  date: string; // YYYY-MM-DD
  title: string;
}

export interface Setting {
  id: string;
  value: any;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface BackupData {
  version: number;
  exportedAt: string;
  students: Student[];
  attendance: AttendanceRecord[];
  holidays?: Holiday[];
  settings?: Setting[];
}
