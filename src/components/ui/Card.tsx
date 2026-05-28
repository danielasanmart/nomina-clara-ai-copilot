import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' };
  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm',
        paddings[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex items-center justify-between', className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn('text-sm font-semibold text-slate-200', className)}>{children}</h3>;
}
