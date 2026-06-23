'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  href: string;
  color?: string;
}

export default function QuickAction({ icon, label, description, href, color = '#007AFF' }: QuickActionProps) {
  return (
    <Link href={href} className="block">
      <div className="flex items-center gap-4 rounded-[20px] bg-white p-4 shadow-sm transition-all duration-200 active:scale-[0.97] dark:bg-[#1C1C1E]">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <span className="h-6 w-6" style={{ color }}>
            {icon}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[#1D1D1F] dark:text-white">{label}</p>
          <p className="text-[13px] text-[#8E8E93] dark:text-[#98989D]">{description}</p>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          className="shrink-0 text-[#C7C7CC] dark:text-[#48484A]"
        >
          <path
            d="M7 4L13 10L7 16"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Link>
  );
}
