import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, Mail, DollarSign, Search, AlertTriangle, CalendarClock, Gavel } from 'lucide-react';
import { mockActivity } from '../../data/mockActivity';
import type { ActivityType } from '../../types';
import { formatCurrency, relativeTime } from '../../lib/format';
import { isFiltered, type LocationFilter } from '../../lib/filters';

const ICONS: Record<ActivityType, { Icon: typeof Phone; bg: string; text: string }> = {
  ai_call:      { Icon: Phone,         bg: 'bg-status-plan/10',       text: 'text-status-plan' },
  sms:          { Icon: MessageSquare, bg: 'bg-brand-gold/10',        text: 'text-brand-gold' },
  email:        { Icon: Mail,          bg: 'bg-fuchsia-500/10',       text: 'text-fuchsia-400' },
  payment:      { Icon: DollarSign,    bg: 'bg-status-active/10',     text: 'text-status-active' },
  skip_trace:   { Icon: Search,        bg: 'bg-cyan-500/10',          text: 'text-cyan-400' },
  escalation:   { Icon: AlertTriangle, bg: 'bg-status-escalated/10',  text: 'text-status-escalated' },
  payment_plan: { Icon: CalendarClock, bg: 'bg-indigo-500/10',        text: 'text-indigo-400' },
  legal:        { Icon: Gavel,         bg: 'bg-status-legal/10',      text: 'text-status-legal' },
};

export function ActivityFeed({ location }: { location: LocationFilter }) {
  const events = isFiltered(location)
    ? mockActivity.filter((a) => a.office === location)
    : mockActivity;

  return (
    <div className="glass-card flex h-full max-h-[560px] flex-col p-6 xl:max-h-[560px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Live Activity</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {isFiltered(location) ? `${location} events` : 'System events across all offices'}
          </p>
        </div>
        <span className="chip text-slate-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-status-active opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-status-active" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-5 -mr-2 flex-1 overflow-y-auto pr-2">
        <AnimatePresence initial>
          <div className="relative">
            <div className="absolute bottom-0 left-[15px] top-2 w-px bg-gradient-to-b from-border via-border to-transparent" />
            {events.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-xs text-slate-500">
                No recent activity for this office
              </div>
            ) : (
              <ul className="space-y-3">
                {events.map((a, i) => {
                  const { Icon, bg, text } = ICONS[a.type];
                  return (
                    <motion.li
                      key={a.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.4) }}
                      className="relative flex gap-3"
                    >
                      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border ${bg}`}>
                        <Icon className={`h-3.5 w-3.5 ${text}`} />
                      </div>
                      <div className="min-w-0 flex-1 pb-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="truncate text-sm font-medium text-white">{a.title}</p>
                          <span className="shrink-0 font-mono text-[11px] text-slate-500">{relativeTime(a.timestamp)}</span>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{a.description}</p>
                        <div className="mt-1 flex items-center gap-2 text-[11px]">
                          {a.amount && <span className="font-mono font-medium text-status-active">{formatCurrency(a.amount)}</span>}
                          {a.outcome && <span className="text-slate-500">· {a.outcome}</span>}
                          {a.office && <span className="text-slate-600">· {a.office}</span>}
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            )}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
