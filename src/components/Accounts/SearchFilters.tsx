import { Search, ChevronDown, Download, MessageSquare, Phone, Loader2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '../../lib/cn';
import type { Account, AccountStatus } from '../../types';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/toast-context';

const STATUSES: (AccountStatus | 'All')[] = ['All', 'Active', 'Delinquent', 'Escalated', 'Legal', 'Payment Plan'];
const SORTS = ['Amount Owed', 'Days Past Due', 'Risk Score', 'Last Contact'];

const DEFAULT_SMS_TEMPLATE =
  "Hi {first_name}, this is Bad Boys Bail Bonds. We have an outstanding balance on bond {bond_id}. To avoid further action, please call 1-800-BAIL-OUT or visit our payment portal: bbbb.com/pay. We have flexible options.";

type Priority = 'High' | 'Normal' | 'Low';
type Schedule = 'Immediate (next 30 min)' | 'Today, business hours' | 'Tomorrow morning';

interface Props {
  query: string;
  onQuery: (q: string) => void;
  status: AccountStatus | 'All';
  onStatus: (s: AccountStatus | 'All') => void;
  sort: string;
  onSort: (s: string) => void;
  rows: Account[];
}

export function SearchFilters({ query, onQuery, status, onStatus, sort, onSort, rows }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
  const [smsOpen, setSmsOpen] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [smsTemplate, setSmsTemplate] = useState(DEFAULT_SMS_TEMPLATE);
  const [priority, setPriority] = useState<Priority>('High');
  const [schedule, setSchedule] = useState<Schedule>('Immediate (next 30 min)');
  const [submitting, setSubmitting] = useState<'sms' | 'call' | null>(null);
  const { showToast } = useToast();

  const recipientCount = rows.length;
  const estimatedMinutes = useMemo(() => recipientCount * 3, [recipientCount]);

  const filterLabel = status === 'All' ? 'all' : status;

  function handleExport() {
    if (rows.length === 0) {
      showToast('No accounts to export with current filters', 'error');
      return;
    }

    const headers = [
      'Bond ID', 'Defendant', 'Indemnitor', 'Phone', 'Email',
      'Bond Amount', 'Amount Owed', 'Days Past Due', 'Risk Score',
      'Status', 'Office', 'Last Contact', 'Next Action',
    ];

    const escape = (val: string | number): string => {
      const s = String(val ?? '');
      return `"${s.replace(/"/g, '""')}"`;
    };

    const lines = [
      headers.map(escape).join(','),
      ...rows.map((a) => [
        a.bondId,
        a.defendant.name,
        a.indemnitor.name,
        a.indemnitor.phone,
        a.indemnitor.email,
        a.bondAmount,
        a.amountOwed,
        a.daysPastDue,
        a.riskScore,
        a.status,
        a.office,
        new Date(a.lastContact).toLocaleDateString('en-US'),
        a.nextAction,
      ].map(escape).join(',')),
    ];

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const today = new Date().toISOString().split('T')[0];
    const link = document.createElement('a');
    link.href = url;
    link.download = `bad-boys-accounts-export-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Exported ${rows.length} accounts to CSV`, 'success');
  }

  function handleConfirmSms() {
    setSubmitting('sms');
    window.setTimeout(() => {
      setSubmitting(null);
      setSmsOpen(false);
      showToast(
        `SMS sequence queued for ${recipientCount} accounts. Delivery in progress.`,
        'success',
      );
    }, 1500);
  }

  function handleConfirmCall() {
    setSubmitting('call');
    window.setTimeout(() => {
      setSubmitting(null);
      setCallOpen(false);
      showToast(
        `Queued ${recipientCount} AI voice calls for ${priority} priority. First call starting in 2 minutes.`,
        'success',
      );
    }, 1500);
  }

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            className="input pl-9"
            placeholder="Search defendant, indemnitor, bond ID…"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-bg-elevated/60 p-1">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => onStatus(s)}
                className={cn(
                  'cursor-pointer whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  status === s ? 'bg-brand-gold/15 text-brand-goldlight' : 'text-slate-400 hover:text-slate-200',
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative">
            <button onClick={() => setSortOpen(!sortOpen)} className="btn-secondary !py-1.5 text-xs">
              Sort: {sort}
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', sortOpen && 'rotate-180')} />
            </button>
            {sortOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setSortOpen(false)} />
                <div className="absolute right-0 top-full z-30 mt-1.5 w-48 rounded-lg border border-border bg-bg-surface/95 p-1 shadow-card backdrop-blur-xl">
                  {SORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => { onSort(s); setSortOpen(false); }}
                      className={cn(
                        'flex w-full cursor-pointer items-center rounded-md px-3 py-1.5 text-left text-xs transition-colors',
                        sort === s ? 'bg-brand-gold/10 text-brand-goldlight' : 'text-slate-300 hover:bg-bg-elevated hover:text-white',
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="hidden h-6 w-px bg-border md:block" />
          <button onClick={() => setSmsOpen(true)} className="btn-secondary text-xs">
            <MessageSquare className="h-3.5 w-3.5" /> Send SMS
          </button>
          <button onClick={() => setCallOpen(true)} className="btn-secondary text-xs">
            <Phone className="h-3.5 w-3.5" /> Queue Call
          </button>
          <button onClick={handleExport} className="btn-primary text-xs">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <Modal
        isOpen={smsOpen}
        onClose={() => !submitting && setSmsOpen(false)}
        title="Send SMS Sequence"
        subtitle={`Send to currently filtered accounts (${recipientCount} recipient${recipientCount === 1 ? '' : 's'})`}
        footer={
          <>
            <button
              onClick={() => setSmsOpen(false)}
              disabled={submitting === 'sms'}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSms}
              disabled={submitting === 'sms' || recipientCount === 0}
              className="btn-primary text-xs"
            >
              {submitting === 'sms' ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Sending…</>
              ) : (
                <>Send to {recipientCount} account{recipientCount === 1 ? '' : 's'}</>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <label className="label block">Message template</label>
          <textarea
            value={smsTemplate}
            onChange={(e) => setSmsTemplate(e.target.value)}
            rows={6}
            className="input resize-none font-mono text-xs leading-relaxed"
          />
          <p className="text-[11px] text-slate-500">
            Placeholders like <code className="text-brand-gold">{'{first_name}'}</code> and{' '}
            <code className="text-brand-gold">{'{bond_id}'}</code> are replaced per-recipient.
          </p>
        </div>
      </Modal>

      <Modal
        isOpen={callOpen}
        onClose={() => !submitting && setCallOpen(false)}
        title="Queue AI Voice Calls"
        subtitle={`Queue Ava to call ${recipientCount} account${recipientCount === 1 ? '' : 's'}`}
        footer={
          <>
            <button
              onClick={() => setCallOpen(false)}
              disabled={submitting === 'call'}
              className="btn-secondary text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmCall}
              disabled={submitting === 'call' || recipientCount === 0}
              className="btn-primary text-xs"
            >
              {submitting === 'call' ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Queueing…</>
              ) : (
                <>Queue {recipientCount} call{recipientCount === 1 ? '' : 's'}</>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Accounts" value={String(recipientCount)} />
            <Stat label="Est. call time" value={`~${estimatedMinutes} min total`} />
          </div>
          <div className="space-y-1.5">
            <label className="label block">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="input text-xs"
            >
              <option>High</option>
              <option>Normal</option>
              <option>Low</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="label block">Schedule</label>
            <select
              value={schedule}
              onChange={(e) => setSchedule(e.target.value as Schedule)}
              className="input text-xs"
            >
              <option>Immediate (next 30 min)</option>
              <option>Today, business hours</option>
              <option>Tomorrow morning</option>
            </select>
          </div>
          <p className="text-[11px] text-slate-500">
            Targeting <span className="text-slate-300">{filterLabel}</span> tier accounts.
          </p>
        </div>
      </Modal>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated/40 px-3 py-2">
      <div className="label">{label}</div>
      <div className="mt-0.5 text-sm font-medium text-white">{value}</div>
    </div>
  );
}
