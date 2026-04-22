import { cn } from '../../lib/cn';
import type { AccountStatus } from '../../types';

const ACCOUNT_STYLES: Record<AccountStatus, { dot: string; bg: string; text: string; border: string }> = {
  Active:          { dot: 'bg-status-active',     bg: 'bg-status-active/10',     text: 'text-status-active',     border: 'border-status-active/25' },
  Delinquent:      { dot: 'bg-status-delinquent', bg: 'bg-status-delinquent/10', text: 'text-status-delinquent', border: 'border-status-delinquent/25' },
  Escalated:       { dot: 'bg-status-escalated',  bg: 'bg-status-escalated/10',  text: 'text-status-escalated',  border: 'border-status-escalated/25' },
  Legal:           { dot: 'bg-status-legal',      bg: 'bg-status-legal/10',      text: 'text-status-legal',      border: 'border-status-legal/25' },
  'Payment Plan':  { dot: 'bg-status-plan',       bg: 'bg-status-plan/10',       text: 'text-status-plan',       border: 'border-status-plan/25' },
};

export function StatusBadge({ status, className }: {
  status: AccountStatus;
  className?: string;
}) {
  const style = ACCOUNT_STYLES[status];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', style.bg, style.text, style.border, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      {status}
    </span>
  );
}
