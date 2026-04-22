import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, MapPin, Check } from 'lucide-react';
import { officeStatsList, type LocationFilter } from '../../lib/filters';
import { formatCurrency, formatNumber, formatPercent } from '../../lib/format';
import { cn } from '../../lib/cn';

type SortKey = 'amount' | 'rate';

export function OfficeGrid({ location }: { location: LocationFilter }) {
  const [sort, setSort] = useState<SortKey>('amount');
  const sorted = [...officeStatsList].sort((a, b) =>
    sort === 'amount' ? b.totalOwed - a.totalOwed : b.collectionRate - a.collectionRate,
  );

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="h-display text-lg">Collections by Office</h2>
          <p className="mt-0.5 text-xs text-slate-400">6 California locations</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-bg-elevated/60 p-1">
          {(['amount', 'rate'] as const).map((k) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={cn(
                'cursor-pointer rounded-md px-3 py-1 text-xs font-medium transition-colors',
                sort === k ? 'bg-brand-gold/15 text-brand-goldlight' : 'text-slate-400 hover:text-slate-200',
              )}
            >
              Sort: {k === 'amount' ? 'Outstanding' : 'Collection Rate'}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((o, i) => {
          const trendUp = o.trend >= 0;
          const isSelected = location === o.office;
          return (
            <motion.div
              key={o.office}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.025 }}
              className={cn(
                'group relative cursor-pointer rounded-lg border p-4 transition-all',
                isSelected
                  ? 'border-brand-gold/60 bg-brand-gold/[0.08] shadow-glow'
                  : 'border-border bg-bg-elevated/40 hover:border-brand-gold/30 hover:bg-bg-elevated/80',
              )}
            >
              {isSelected && (
                <span className="absolute right-2 top-2 flex h-5 items-center gap-1 rounded-full bg-brand-gold/20 px-1.5 text-[10px] font-medium text-brand-goldlight">
                  <Check className="h-3 w-3" />
                </span>
              )}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className={cn('h-3.5 w-3.5', isSelected ? 'text-brand-goldlight' : 'text-brand-gold')} />
                  <span className={cn('text-sm font-medium', isSelected ? 'text-white' : 'text-white')}>{o.office}</span>
                </div>
                <span className={cn(
                  'flex items-center gap-0.5 text-[11px] font-medium tabular-nums',
                  trendUp ? 'text-status-active' : 'text-red-400',
                )}>
                  {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(o.trend).toFixed(1)}%
                </span>
              </div>
              <div className="mt-3 font-display text-xl font-semibold tabular-nums text-white">
                {formatCurrency(o.totalOwed, { compact: true })}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span>{formatNumber(o.accountsCount)} accounts</span>
                <span className="font-mono text-brand-gold">{formatPercent(o.collectionRate)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
