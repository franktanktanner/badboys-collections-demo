import { cn } from '../../lib/cn';
import type { AccountStatus, AttorneyStatus } from '../../types';

const ACCOUNT_STYLES: Record<AccountStatus, { dot: string; bg: string; text: string; border: string }> = {
  Active:          { dot: 'bg-status-active',     bg: 'bg-status-active/10',     text: 'text-status-active',     border: 'border-status-active/25' },
  Delinquent:      { dot: 'bg-status-delinquent', bg: 'bg-status-delinquent/10', text: 'text-status-delinquent', border: 'border-status-delinquent/25' },
  Escalated:       { dot: 'bg-status-escalated',  bg: 'bg-status-escalated/10',  text: 'text-status-escalated',  border: 'border-status-escalated/25' },
  Legal:           { dot: 'bg-status-legal',      bg: 'bg-status-legal/10',      text: 'text-status-legal',      border: 'border-status-legal/25' },
  'Payment Plan':  { dot: 'bg-status-plan',       bg: 'bg-status-plan/10',       text: 'text-status-plan',       border: 'border-status-plan/25' },
};

const ATTORNEY_STYLES: Record<AttorneyStatus, { dot: string; bg: string; text: string; border: string }> = {
  New:        { dot: 'bg-slate-400',  bg: 'bg-slate-400/10',  text: 'text-slate-300',  border: 'border-slate-400/25' },
  Contacted:  { dot: 'bg-status-plan',       bg: 'bg-status-plan/10',       text: 'text-status-plan',       border: 'border-status-plan/25' },
  Warm:       { dot: 'bg-status-delinquent', bg: 'bg-status-delinquent/10', text: 'text-status-delinquent', border: 'border-status-delinquent/25' },
  Partner:    { dot: 'bg-status-active',     bg: 'bg-status-active/10',     text: 'text-status-active',     border: 'border-status-active/25' },
  Inactive:   { dot: 'bg-slate-600', bg: 'bg-slate-600/10', text: 'text-slate-500',  border: 'border-slate-600/25' },
};

export function StatusBadge({ status, type = 'account', className }: {
  status: AccountStatus | AttorneyStatus;
  type?: 'account' | 'attorney';
  className?: string;
}) {
  const style = type === 'account'
    ? ACCOUNT_STYLES[status as AccountStatus]
    : ATTORNEY_STYLES[status as AttorneyStatus];
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', style.bg, style.text, style.border, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
      {status}
    </span>
  );
}
