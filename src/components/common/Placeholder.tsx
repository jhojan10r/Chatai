import type { ReactNode } from 'react';

interface PlaceholderProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function Placeholder({ icon, title, description }: PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800 text-neutral-400">
        {icon}
      </div>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="max-w-sm text-sm leading-relaxed text-neutral-400">
        {description}
      </p>
    </div>
  );
}
