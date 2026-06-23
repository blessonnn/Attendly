import { Holiday } from '@/types';
import { getMonthDays, formatDate } from './utils';

/**
 * Default working days: Monday (1) to Saturday (6).
 * Sunday is 0.
 */
export const DEFAULT_WORKING_DAYS = [1, 2, 3, 4, 5, 6];

/**
 * Check if a given date string (YYYY-MM-DD) is a holiday.
 */
export function isHoliday(dateStr: string, holidays: Holiday[]): boolean {
  return holidays.some((h) => h.date === dateStr);
}

/**
 * Check if a given date string (YYYY-MM-DD) is a working day.
 */
export function isWorkingDay(dateStr: string, workingDays: number[]): boolean {
  const date = new Date(dateStr + 'T00:00:00');
  const dayOfWeek = date.getDay();
  return workingDays.includes(dayOfWeek);
}

/**
 * Get the holiday object for a given date string.
 */
export function getHoliday(dateStr: string, holidays: Holiday[]): Holiday | undefined {
  return holidays.find((h) => h.date === dateStr);
}

/**
 * Calculate the number of valid working days in a given month.
 * It counts total days in the month, subtracts non-working days (e.g., Sundays),
 * and subtracts holidays that fall on a working day.
 */
export function calculateWorkingDays(year: number, month: number, workingDays: number[], holidays: Holiday[]): number {
  const totalDays = getMonthDays(year, month);
  let workingCount = 0;

  for (let i = 1; i <= totalDays; i++) {
    const d = new Date(year, month, i);
    const dateStr = formatDate(d);

    // If it's a designated working day of the week
    if (workingDays.includes(d.getDay())) {
      // And it's not a holiday
      if (!isHoliday(dateStr, holidays)) {
        workingCount++;
      }
    }
  }

  return workingCount;
}
