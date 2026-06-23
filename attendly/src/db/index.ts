import Dexie, { type Table } from 'dexie';
import type { Student, AttendanceRecord } from '@/types';

export class AttendlyDB extends Dexie {
  students!: Table<Student, number>;
  attendance!: Table<AttendanceRecord, number>;

  constructor() {
    super('AttendlyDB');
    this.version(1).stores({
      students: '++id, name, rollNumber, class',
      attendance: '++id, studentId, date, [studentId+date]',
    });
  }
}

export const db = new AttendlyDB();
