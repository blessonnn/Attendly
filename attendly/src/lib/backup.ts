import { db } from '@/db';
import type { BackupData } from '@/types';

export async function exportBackup(): Promise<void> {
  const students = await db.students.toArray();
  const attendance = await db.attendance.toArray();

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    students,
    attendance,
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `attendly-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<{ students: number; attendance: number }> {
  const text = await file.text();
  const data: BackupData = JSON.parse(text);

  if (!data.version || !data.students || !data.attendance) {
    throw new Error('Invalid backup file format');
  }

  await db.transaction('rw', db.students, db.attendance, async () => {
    await db.students.clear();
    await db.attendance.clear();

    // Remove IDs so Dexie auto-generates new ones
    const studentsWithoutIds = data.students.map(({ id, ...rest }) => rest);
    const attendanceWithoutIds = data.attendance.map(({ id, ...rest }) => rest);

    await db.students.bulkAdd(studentsWithoutIds as never[]);
    await db.attendance.bulkAdd(attendanceWithoutIds as never[]);
  });

  return {
    students: data.students.length,
    attendance: data.attendance.length,
  };
}

export async function deleteAllData(): Promise<void> {
  await db.transaction('rw', db.students, db.attendance, async () => {
    await db.students.clear();
    await db.attendance.clear();
  });
}
