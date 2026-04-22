import { motion } from 'framer-motion';
import { LayoutDashboard, Users, Bot, BarChart3 } from 'lucide-react';
import { cn } from '../../lib/cn';

export type TabKey = 'command' | 'accounts' | 'automation' | 'reports';

const TABS: { key: TabKey; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'command', label: 'Command Center', icon: LayoutDashboard },
  { key: 'accounts', label: 'Accounts', icon: Users },
  { key: 'automation', label: 'AI Automation', icon: Bot },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
];

export function TabNav({ active, onChange }: { active: TabKey; onChange: (k: TabKey) => void }) {
  return (
    <div className="sticky top-16 z-30 border-b border-border bg-bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1600px] items-center gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => onChange(tab.key)}
              className={cn(
                'group relative flex cursor-pointer items-center gap-2 whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors',
                isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200',
              )}
            >
              <Icon className={cn('h-4 w-4 transition-colors', isActive ? 'text-brand-gold' : 'text-slate-500 group-hover:text-slate-300')} />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute -bottom-px left-0 right-0 h-0.5 bg-gradient-to-r from-brand-golddark via-brand-gold to-brand-goldlight"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
