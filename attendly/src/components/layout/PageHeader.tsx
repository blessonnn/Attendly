interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex items-end justify-between px-5 pb-2 pt-14">
      <div>
        <h1 className="text-[28px] font-bold tracking-tight text-[#1D1D1F] dark:text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-[15px] text-[#8E8E93] dark:text-[#98989D]">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
