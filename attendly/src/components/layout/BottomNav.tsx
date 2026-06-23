'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15C15 14.4477 14.5523 14 14 14H10C9.44772 14 9 14.4477 9 15V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Attendance',
    href: '/attendance',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="3"
          y="4"
          width="18"
          height="18"
          rx="3"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M3 9H21" stroke={active ? '#fff' : 'currentColor'} strokeWidth="1.8" />
        <path d="M9 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M15 4V2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        {active ? (
          <path d="M9 14L11 16L15 12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M9 14L11 16L15 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    ),
  },
  {
    label: 'Students',
    href: '/students',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="12"
          cy="8"
          r="4"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M5 20C5 16.134 8.13401 13 12 13C15.866 13 19 16.134 19 20"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Reports',
    href: '/reports',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="3"
          fill={active ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path d="M8 16V12" stroke={active ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinecap="round" />
        <path d="M12 16V9" stroke={active ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinecap="round" />
        <path d="M16 16V7" stroke={active ? '#fff' : 'currentColor'} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="3" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200/80 bg-white/80 backdrop-blur-xl dark:border-gray-800/80 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-lg items-center justify-around pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex min-w-[64px] flex-col items-center justify-center px-3 py-4 transition-all duration-200 active:scale-90',
                isActive
                  ? 'text-[#007AFF]'
                  : 'text-[#8E8E93] dark:text-[#636366]'
              )}
            >
              <span className="pointer-events-none flex h-6 w-6 items-center justify-center">
                {item.icon(isActive)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
