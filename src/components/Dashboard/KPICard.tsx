import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/cn';
import { CountUp } from '../shared/CountUp';
import { MiniSparkline } from '../shared/MiniChart';

interface Props {
  label: string;
  value: number;
  format: 'currency' | 'currency-compact' | 'number' | 'percent';
  sub: string;
  trendValue?: number;
  trendDirection?: 'up' | 'down';
  trendGood?: 'up' | 'down';
  chartData: { value: number; [key: string]: number }[];
  chartColor?: string;
  accent?: 'gold' | 'green' | 'blue' | 'red';
  delay?: number;
}

const ACCENT_GRADIENTS: Record<NonNullable<Props['accent']>, string> = {
  gold: 'from-brand-gold/10 via-transparent to-transparent',
  green: 'from-emerald-500/10 via-transparent to-transparent',
  blue: 'from-blue-500/10 via-transparent to-transparent',
  red: 'from-red-500/10 via-transparent to-transparent',
};

const ACCENT_COLORS: Record<NonNullable<Props['accent']>, string> = {
  gold: '#EAB308',
  green: '#22C55E',
  blue: '#3B82F6',
  red: '#EF4444',
};

export function KPICard({
  label, value, format, sub, trendValue, trendDirection, trendGood = 'up',
  chartData, chartColor, accent = 'gold', delay = 0,
}: Props) {
  const isGood = trendDirection === trendGood;
  const trendClass = isGood ? 'text-status-active' : 'text-red-400';
  const TrendIcon = trendDirection === 'up' ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card glass-card-hover overflow-hidden p-5"
    >
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br', ACCENT_GRADIENTS[accent])} />

      <div className="relative flex items-start justify-between">
        <div className="label">{label}</div>
        {trendValue !== undefined && trendDirection && (
          <div className={cn('flex items-center gap-0.5 rounded-full border border-current/20 px-2 py-0.5 text-[11px] font-medium', trendClass)}>
            <TrendIcon className="h-3 w-3" />
            {Math.abs(trendValue).toFixed(1)}%
          </div>
        )}
      </div>

      <div className="relative mt-3 font-display text-3xl font-semibold tracking-tight text-white lg:text-[32px]">
        {format === 'currency' && <CountUp value={value} currency />}
        {format === 'currency-compact' && <CountUp value={value} currency compact />}
        {format === 'number' && <CountUp value={value} compact={value > 10000} />}
        {format === 'percent' && <CountUp value={value} decimals={1} suffix="%" />}
      </div>

      <div className="relative mt-1 text-xs text-slate-400">{sub}</div>

      <div className="relative -mx-2 mt-3">
        <MiniSparkline data={chartData} color={chartColor ?? ACCENT_COLORS[accent]} height={48} />
      </div>
    </motion.div>
  );
}
