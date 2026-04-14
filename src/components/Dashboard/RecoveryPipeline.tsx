import { motion } from 'framer-motion';
import { formatCurrency, formatNumber } from '../../lib/format';

interface Stage {
  label: string;
  count: number;
  amount: number;
  color: string;
  gradient: string;
}

const stages: Stage[] = [
  { label: 'Active',     count: 1847, amount: 42_300_000, color: 'text-status-active',     gradient: 'from-emerald-500 to-green-400' },
  { label: 'Delinquent', count: 1562, amount: 51_800_000, color: 'text-status-delinquent', gradient: 'from-amber-500 to-yellow-400' },
  { label: 'Escalated',  count: 548,  amount: 27_400_000, color: 'text-status-escalated',  gradient: 'from-orange-500 to-red-500' },
  { label: 'Legal',      count: 214,  amount: 11_900_000, color: 'text-status-legal',      gradient: 'from-purple-500 to-fuchsia-500' },
  { label: 'Write-off',  count: 76,   amount: 1_600_000,  color: 'text-slate-500',         gradient: 'from-slate-600 to-slate-500' },
];

export function RecoveryPipeline() {
  const max = Math.max(...stages.map((s) => s.amount));
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Recovery Pipeline</h2>
          <p className="mt-0.5 text-xs text-slate-400">Accounts by collection stage · live</p>
        </div>
        <span className="chip text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          4,247 accounts
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {stages.map((s, i) => {
          const widthPct = (s.amount / max) * 100;
          return (
            <div key={s.label} className="group">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className={`text-sm font-medium ${s.color}`}>{s.label}</span>
                  <span className="font-mono text-xs text-slate-500">{formatNumber(s.count)}</span>
                </div>
                <span className="font-mono text-sm font-medium text-white">{formatCurrency(s.amount, { compact: true })}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-elevated/80">
                <motion.div
                  className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
