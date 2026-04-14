import { motion } from 'framer-motion';
import { Phone, MessageSquare, Mail, DollarSign, CalendarClock, Search } from 'lucide-react';
import { CountUp } from '../shared/CountUp';

const stats = [
  { Icon: Phone,         label: 'AI Calls Made',        value: 28_412, sub: 'avg 4.2 min call duration',    format: 'num' as const,     color: 'text-status-plan', bg: 'bg-status-plan/10' },
  { Icon: MessageSquare, label: 'SMS Sent',             value: 94_281, sub: '22% response rate',            format: 'num' as const,     color: 'text-brand-gold', bg: 'bg-brand-gold/10' },
  { Icon: Mail,          label: 'Emails Sent',          value: 42_109, sub: '41% open · 14% click',         format: 'num' as const,     color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10' },
  { Icon: DollarSign,    label: 'Payments Collected',   value: 3_847_200, sub: 'across 1,842 transactions', format: 'currency' as const,color: 'text-status-active', bg: 'bg-status-active/10' },
  { Icon: CalendarClock, label: 'Payment Plans',        value: 734,    sub: '83% completion rate',          format: 'num' as const,     color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { Icon: Search,        label: 'Skip Traces Run',      value: 1_287,  sub: '68% contact restoration',      format: 'num' as const,     color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
];

export function AutomationStats() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">AI Automation · 30 Days</h2>
          <p className="mt-0.5 text-xs text-slate-400">Actions executed by the agent fleet</p>
        </div>
        <span className="chip text-brand-goldlight">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          All systems nominal
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ Icon, label, value, sub, format, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="rounded-lg border border-border bg-bg-elevated/40 p-4"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="mt-3 font-display text-xl font-semibold tabular-nums text-white">
              {format === 'currency' ? <CountUp value={value} currency compact /> : <CountUp value={value} compact={value > 10000} />}
            </div>
            <div className="mt-0.5 text-xs font-medium text-slate-300">{label}</div>
            <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
