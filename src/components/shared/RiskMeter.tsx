import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export function RiskMeter({ score, className }: { score: number; className?: string }) {
  const color =
    score >= 75 ? 'from-rose-500 to-red-500'
    : score >= 50 ? 'from-amber-500 to-orange-500'
    : score >= 25 ? 'from-yellow-500 to-amber-400'
    : 'from-emerald-500 to-green-400';

  const textColor =
    score >= 75 ? 'text-red-400'
    : score >= 50 ? 'text-amber-400'
    : score >= 25 ? 'text-yellow-400'
    : 'text-emerald-400';

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-bg-elevated/80">
        <motion.div
          className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r', color)}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className={cn('font-mono text-xs font-medium tabular-nums', textColor)}>{score}</span>
    </div>
  );
}
