'use client';

import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  variant?: 'default' | 'success' | 'danger' | 'primary';
}

const variantStyles = {
  default: 'bg-white dark:bg-[#1C1C1E]',
  primary: 'bg-gradient-to-br from-[#007AFF] to-[#0055D4]',
  success: 'bg-gradient-to-br from-[#34C759] to-[#248A3D]',
  danger: 'bg-gradient-to-br from-[#FF3B30] to-[#D70015]',
};

const textStyles = {
  default: 'text-[#1D1D1F] dark:text-white',
  primary: 'text-white',
  success: 'text-white',
  danger: 'text-white',
};

const labelStyles = {
  default: 'text-[#8E8E93] dark:text-[#98989D]',
  primary: 'text-white/70',
  success: 'text-white/70',
  danger: 'text-white/70',
};

const iconBgStyles = {
  default: 'bg-[#F5F5F7] dark:bg-[#2C2C2E]',
  primary: 'bg-white/20',
  success: 'bg-white/20',
  danger: 'bg-white/20',
};

export default function StatCard({ icon, label, value, variant = 'default' }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between rounded-[20px] p-4 shadow-sm transition-transform duration-200 active:scale-[0.97]',
        'min-h-[120px]',
        variantStyles[variant]
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          iconBgStyles[variant]
        )}
      >
        <span className={cn('h-5 w-5', textStyles[variant])}>{icon}</span>
      </div>
      <div className="mt-3">
        <p className={cn('text-[28px] font-bold leading-tight tracking-tight', textStyles[variant])}>
          {value}
        </p>
        <p className={cn('text-[13px] font-medium', labelStyles[variant])}>{label}</p>
      </div>
    </div>
  );
}
