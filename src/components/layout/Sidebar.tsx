'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const nav = [
  {
    href: '/agent',
    label: 'Copiloto',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
        <path d="M10 2a6 6 0 0 1 6 6v3.586l.707.707A1 1 0 0 1 16 14h-1v1a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-1H4a1 1 0 0 1-.707-1.707L4 11.586V8a6 6 0 0 1 6-6Z" />
      </svg>
    ),
  },
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
        <path d="M2 11a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-5Zm6-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7Zm6-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V4Z" />
      </svg>
    ),
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-14 flex-col items-center gap-1 border-r border-white/[0.06] bg-[#0a0a0f] px-2 py-4">
      {/* Logo */}
      <div className="mb-6 flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4">
          <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-2.08-1.287V9.394c0-.244.116-.463.315-.6a32.839 32.839 0 0 1 1.611-.904A.75.75 0 0 0 9.5 8a.75.75 0 0 0-.498.89 33.076 33.076 0 0 0-4.971 3.07.75.75 0 0 1-.84 0 41.898 41.898 0 0 1-4.869-4.04.75.75 0 0 1 0-1.04l.001-.001A41.06 41.06 0 0 1 9.664 1.32Zm.836 4.44a.75.75 0 0 0-.5-.19.75.75 0 0 0-.5.19L7.596 7.373a1.25 1.25 0 0 0 0 1.754l1.904 1.904a.75.75 0 0 0 1.06 0l1.904-1.904a1.25 1.25 0 0 0 0-1.754L10.5 5.759Z" clipRule="evenodd" />
        </svg>
      </div>

      {nav.map(item => (
        <Link
          key={item.href}
          href={item.href}
          title={item.label}
          className={cn(
            'group relative flex size-9 items-center justify-center rounded-lg transition-all duration-150',
            pathname.startsWith(item.href)
              ? 'bg-indigo-600/20 text-indigo-400'
              : 'text-slate-500 hover:bg-white/5 hover:text-slate-300',
          )}
        >
          {item.icon}
          <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
            {item.label}
          </span>
        </Link>
      ))}

      <div className="mt-auto">
        <div
          title="danielasanmart@gmail.com"
          className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white"
        >
          D
        </div>
      </div>
    </aside>
  );
}
