import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface PageProps {
  children: ReactNode;
  className?: string;
}

export function Page({ children, className }: PageProps) {
  return (
    <div className={cn('mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:py-10', className)}>
      {children}
    </div>
  );
}
