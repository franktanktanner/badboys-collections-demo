import { motion } from 'framer-motion';
import { formatCurrency, formatNumber } from '../../lib/format';
import { getPipeline, isFiltered, OFFICE_STATS, TOTAL_ACCOUNTS, type LocationFilter } from '../../lib/filters';

export function RecoveryPipeline({ location }: { location: LocationFilter }) {
  const stages = getPipeline(location);
  const max = Math.max(...stages.map((s) => s.amount));
  const totalAccounts = isFiltered(location)
    ? OFFICE_STATS[location].accountsCount
    : TOTAL_ACCOUNTS;

  return (
    <div className="glass-card flex h-full flex-col p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Recovery Pipeline</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Accounts by collection stage · {isFiltered(location) ? location : 'all offices'}
          </p>
        </div>
        <span className="chip text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          {formatNumber(totalAccounts)} accounts
        </span>
      </div>

      <div className="mt-6 flex flex-1 flex-col justify-around gap-4">
        {stages.map((s, i) => {
          const widthPct = max > 0 ? (s.amount / max) * 100 : 0;
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
                  key={`${location}-${s.label}`}
                  className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
