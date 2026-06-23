import Dexie, { type Table } from 'dexie';
import type { Student, AttendanceRecord, Holiday, Setting } from '@/types';

export class AttendlyDB extends Dexie {
  students!: Table<Student, number>;
  attendance!: Table<AttendanceRecord, number>;
  holidays!: Table<Holiday, number>;
  settings!: Table<Setting, string>;

  constructor() {
    super('AttendlyDB');
    this.version(1).stores({
      students: '++id, name, rollNumber, class',
      attendance: '++id, studentId, [studentId+date]',
    });
    this.version(2).stores({
      students: '++id, name, rollNumber, class',
      attendance: '++id, studentId, date, [studentId+date]',
    });
    this.version(3).stores({
      students: '++id, name, rollNumber, class',
      attendance: '++id, studentId, date, [studentId+date]',
      holidays: '++id, date',
      settings: 'id',
    });
  }
}

export const db = new AttendlyDB();
