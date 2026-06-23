'use client';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/db';
import type { Student } from '@/types';
import { useCallback } from 'react';

export function useStudents(searchQuery?: string) {
  const students = useLiveQuery(async () => {
    let collection = db.students.orderBy('name');
    const all = await collection.toArray();

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return all.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.rollNumber.toLowerCase().includes(q) ||
          (s.class && s.class.toLowerCase().includes(q))
      );
    }

    return all;
  }, [searchQuery]);

  const addStudent = useCallback(async (student: Omit<Student, 'id'>) => {
    return await db.students.add(student);
  }, []);

  const updateStudent = useCallback(async (id: number, changes: Partial<Student>) => {
    return await db.students.update(id, changes);
  }, []);

  const deleteStudent = useCallback(async (id: number) => {
    await db.transaction('rw', db.students, db.attendance, async () => {
      await db.students.delete(id);
      await db.attendance.where('studentId').equals(id).delete();
    });
  }, []);

  const getStudent = useCallback(async (id: number) => {
    return await db.students.get(id);
  }, []);

  return {
    students: students ?? [],
    addStudent,
    updateStudent,
    deleteStudent,
    getStudent,
    isLoading: students === undefined,
  };
}
