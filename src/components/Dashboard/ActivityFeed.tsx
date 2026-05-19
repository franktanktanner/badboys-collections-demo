import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageSquare, Mail, DollarSign, Search, AlertTriangle,
  CalendarClock, Gavel, Handshake,
} from 'lucide-react';
import { liveActivityPool, mockActivity } from '../../data/mockActivity';
import type { Activity, ActivityType } from '../../types';
import { formatCurrency } from '../../lib/format';
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
  compass:      { Icon: Handshake,     bg: 'bg-brand-gold/10',        text: 'text-brand-goldlight' },
};

const MAX_VISIBLE = 10;
const MIN_DELAY_MS = 2000;
const MAX_DELAY_MS = 3000;

type LiveActivity = Activity & { receivedAt: number };

function nextDelay() {
  return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
}

function liveRelative(receivedAt: number, now: number): string {
  const secs = Math.max(0, Math.floor((now - receivedAt) / 1000));
  if (secs < 1) return 'just now';
  if (secs < 60) return `${secs}s ago`;
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  return `${hours}h ago`;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ActivityFeed({ location }: { location: LocationFilter }) {
  const reduced = useMemo(prefersReducedMotion, []);

  const initialItems = useMemo<LiveActivity[]>(() => {
    const now = Date.now();
    const source = isFiltered(location)
      ? mockActivity.filter((a) => a.office === location)
      : mockActivity;
    return source.slice(0, MAX_VISIBLE).map((a, i) => ({
      ...a,
      receivedAt: now - (i + 1) * 8000,
    }));
  }, [location]);

  const [items, setItems] = useState<LiveActivity[]>(initialItems);
  const [paused, setPaused] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const counterRef = useRef(0);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;

    let cancelled = false;
    let timer: number;

    const tick = () => {
      if (cancelled) return;
      const pool = isFiltered(location)
        ? liveActivityPool.filter((a) => a.office === location)
        : liveActivityPool;
      if (pool.length === 0) {
        timer = window.setTimeout(tick, nextDelay());
        return;
      }
      const template = pool[Math.floor(Math.random() * pool.length)];
      counterRef.current += 1;
      const fresh: LiveActivity = {
        ...template,
        id: `live-${Date.now()}-${counterRef.current}`,
        timestamp: new Date().toISOString(),
        receivedAt: Date.now(),
      };
      setItems((prev) => [fresh, ...prev].slice(0, MAX_VISIBLE));
      timer = window.setTimeout(tick, nextDelay());
    };

    timer = window.setTimeout(tick, nextDelay());
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [paused, reduced, location]);

  return (
    <div
      className="glass-card flex h-full max-h-[560px] flex-col p-6 xl:max-h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Live Activity</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {isFiltered(location) ? `${location} events` : 'System events across all offices'}
            {paused && <span className="ml-2 text-brand-gold">· paused</span>}
          </p>
        </div>
        <LivePill reduced={reduced} />
      </div>

      <div className="mt-5 -mr-2 flex-1 overflow-y-auto pr-2">
        <div className="relative">
          <div className="absolute bottom-0 left-[15px] top-2 w-px bg-gradient-to-b from-border via-border to-transparent" />
          {items.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-xs text-slate-500">
              No recent activity for this office
            </div>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial mode="popLayout">
                {items.map((a) => (
                  <ActivityRow key={a.id} item={a} now={now} reduced={reduced} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivityRow({
  item,
  now,
  reduced,
}: {
  item: LiveActivity;
  now: number;
  reduced: boolean;
}) {
  const { Icon, bg, text } = ICONS[item.type];

  return (
    <motion.li
      layout
      initial={
        reduced
          ? { opacity: 0 }
          : { opacity: 0, y: -20, backgroundColor: 'rgba(34,197,94,0.15)' }
      }
      animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(34,197,94,0)' }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      transition={{
        opacity: { duration: 0.4, ease: 'easeOut' },
        y: { duration: 0.4, ease: 'easeOut' },
        backgroundColor: { duration: 1.5, ease: 'easeOut' },
        layout: { duration: 0.3, ease: 'easeOut' },
      }}
      className="relative flex gap-3 rounded-md"
    >
      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border ${bg}`}>
        <Icon className={`h-3.5 w-3.5 ${text}`} />
      </div>
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="truncate text-sm font-medium text-white">{item.title}</p>
          <span className="shrink-0 font-mono text-[11px] text-slate-500">
            {liveRelative(item.receivedAt, now)}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{item.description}</p>
        <div className="mt-1 flex items-center gap-2 text-[11px]">
          {item.amount && <span className="font-mono font-medium text-status-active">{formatCurrency(item.amount)}</span>}
          {item.outcome && <span className="text-slate-500">· {item.outcome}</span>}
          {item.office && <span className="text-slate-600">· {item.office}</span>}
        </div>
      </div>
    </motion.li>
  );
}

function LivePill({ reduced }: { reduced: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/40 px-3 py-1">
      <span className="relative inline-flex h-2 w-2 items-center justify-center">
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-status-active"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className="relative h-2 w-2 rounded-full bg-status-active shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-status-active blur-[2px]"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.95, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.75 }}
          />
        )}
      </span>
      <span className="text-sm font-semibold tracking-wide text-white">Live</span>
    </span>
  );
}
