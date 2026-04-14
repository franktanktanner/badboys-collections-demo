import { ChevronDown, Calendar, Sparkles, Bell, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '../../lib/cn';
import { LOCATIONS, type LocationFilter } from '../../lib/filters';

const DATE_RANGES = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Last 90 days', 'Year to date'];

function Dropdown({
  options,
  value,
  onChange,
  icon,
  active,
}: {
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  active?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'btn-secondary !py-1.5 text-xs',
          active && 'border-brand-gold/40 bg-brand-gold/10 text-brand-goldlight hover:border-brand-gold/60 hover:bg-brand-gold/15',
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon}
        <span className={active ? 'text-brand-goldlight' : 'text-slate-200'}>{value}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', active ? 'text-brand-gold' : 'text-slate-400', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 top-full z-30 mt-1.5 max-h-80 w-56 overflow-auto rounded-lg border border-border bg-bg-surface/95 p-1 shadow-card backdrop-blur-xl"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={cn(
                  'flex w-full cursor-pointer items-center rounded-md px-3 py-1.5 text-left text-xs transition-colors',
                  value === opt ? 'bg-brand-gold/10 text-brand-goldlight' : 'text-slate-300 hover:bg-bg-elevated hover:text-white',
                )}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

export function TopNav({
  location,
  onLocationChange,
}: {
  location: LocationFilter;
  onLocationChange: (loc: LocationFilter) => void;
}) {
  const [dateRange, setDateRange] = useState(DATE_RANGES[2]);
  const filtered = location !== 'All Locations';
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-gold to-brand-golddark font-display text-base font-bold text-slate-950 shadow-glow">
                BB
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-base bg-status-active" />
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-sm font-semibold tracking-tight text-white">Bad Boys Bail Bonds</div>
              <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-brand-gold">Collections Command Center</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex">
            <Dropdown
              options={LOCATIONS}
              value={location}
              onChange={(v) => onLocationChange(v as LocationFilter)}
              icon={<MapPin className="h-3.5 w-3.5" />}
              active={filtered}
            />
          </div>
          <div className="hidden lg:flex">
            <Dropdown
              options={DATE_RANGES}
              value={dateRange}
              onChange={setDateRange}
              icon={<Calendar className="h-3.5 w-3.5 text-slate-400" />}
            />
          </div>

          <div className="flex items-center gap-2 rounded-full border border-status-active/25 bg-status-active/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-status-active opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status-active" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-status-active" />
            <span className="hidden text-xs font-medium text-status-active sm:inline">AI Agent Active</span>
          </div>

          <button className="btn-ghost !p-2" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-border bg-bg-elevated font-medium text-xs text-slate-200">CS</div>
        </div>
      </div>
    </header>
  );
}
