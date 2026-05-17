import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, MessageSquare, Mail, CalendarClock, AlertTriangle, Search, User, Shield,
  ChevronRight, ClipboardCheck, UserCheck, type LucideIcon,
} from 'lucide-react';
import type { Account, RecoveryAction, RecoveryActionType } from '../../types';
import { formatCurrency, formatDate, relativeTime } from '../../lib/format';
import { buildRecoveryAction, validateRecoveryAction } from '../../lib/recoveryActions';

const ACTIONS: { type: RecoveryActionType; Icon: LucideIcon; danger?: boolean }[] = [
  { type: 'ai_call', Icon: Phone },
  { type: 'sms', Icon: MessageSquare },
  { type: 'email', Icon: Mail },
  { type: 'payment_plan', Icon: CalendarClock },
  { type: 'promise_to_pay', Icon: ClipboardCheck },
  { type: 'escalate', Icon: AlertTriangle, danger: true },
  { type: 'skip_trace', Icon: Search },
  { type: 'human_review', Icon: UserCheck },
];

export function AccountDetail({ account }: { account: Account }) {
  const [localEvents, setLocalEvents] = useState<RecoveryAction[]>([]);
  const [actionMessage, setActionMessage] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);
  const actionStates = useMemo(
    () => ACTIONS.map((action) => ({ ...action, validation: validateRecoveryAction(account, action.type) })),
    [account],
  );

  function runAction(actionType: RecoveryActionType) {
    const action = buildRecoveryAction(account, actionType);
    if (action.status === 'blocked') {
      setActionMessage({ tone: 'error', text: action.blockedReason ?? 'Action blocked by account compliance settings.' });
      setLocalEvents((events) => [action, ...events].slice(0, 4));
      return;
    }

    const completed: RecoveryAction = { ...action, status: 'completed' };
    setLocalEvents((events) => [completed, ...events].slice(0, 4));
    setActionMessage({ tone: 'success', text: `${action.label} logged locally. No real outreach was sent.` });
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="border-b border-border bg-bg-base/60 p-5 lg:p-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Defendant + Indemnitor */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-lg border border-border bg-bg-elevated/40 p-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-brand-gold" />
                <span className="label">Defendant</span>
              </div>
              <div className="mt-2 font-medium text-white">{account.defendant.name}</div>
              <div className="mt-3 space-y-1 text-xs">
                <Row k="DOB" v={account.defendant.dob} />
                <Row k="Charges" v={account.defendant.charges} />
                <Row k="Bond Date" v={formatDate(account.defendant.bondDate)} />
                <Row k="Court Date" v={account.defendant.courtDate === 'Forfeited' ? 'Forfeited' : formatDate(account.defendant.courtDate)} danger={account.defendant.courtDate === 'Forfeited'} />
              </div>
            </div>
            <div className="rounded-lg border border-border bg-bg-elevated/40 p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand-gold" />
                <span className="label">Indemnitor</span>
              </div>
              <div className="mt-2 font-medium text-white">{account.indemnitor.name}</div>
              <div className="mt-3 space-y-1 text-xs">
                <Row k="Phone" v={account.indemnitor.phone} mono />
                <Row k="Email" v={account.indemnitor.email} mono />
                <Row k="Address" v={account.indemnitor.address} />
                <Row k="Employer" v={account.indemnitor.employer} />
              </div>
            </div>
          </div>

          {/* Payments */}
          <div className="lg:col-span-4">
            <div className="rounded-lg border border-border bg-bg-elevated/40 p-4">
              <div className="flex items-center justify-between">
                <span className="label">Payment History</span>
                <span className="font-mono text-[11px] text-slate-500">Last {account.payments.length}</span>
              </div>
              <div className="mt-3 space-y-1.5">
                {account.payments.map((p, i) => (
                  <div key={i} className="flex items-center justify-between rounded-md bg-bg-surface/60 px-3 py-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        p.status === 'Cleared' ? 'bg-status-active' : p.status === 'Pending' ? 'bg-status-delinquent' : 'bg-status-escalated'
                      }`} />
                      <span className="text-slate-300">{formatDate(p.date)}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-500">{p.method}</span>
                    </div>
                    <span className={`font-mono font-medium ${p.status === 'Failed' ? 'text-red-400 line-through' : 'text-white'}`}>
                      {formatCurrency(p.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-border bg-bg-elevated/40 p-4">
              <div className="flex items-center justify-between">
                <span className="label">Compliance</span>
                <span className="font-mono text-[11px] text-slate-500">
                  Updated {account.compliance ? relativeTime(account.compliance.lastConsentUpdatedAt) : 'unknown'}
                </span>
              </div>
              {account.compliance ? (
                <div className="mt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Flag label="DNC" active={account.compliance.doNotContact} />
                    <Flag label="Legal Hold" active={account.compliance.legalHold} />
                    <Flag label="Dispute" active={account.compliance.disputeFlag} />
                    <Flag label="C&D" active={account.compliance.ceaseAndDesist} />
                    <Flag label="Bankruptcy" active={account.compliance.bankruptcyFlag} />
                    <Flag label="Deceased" active={account.compliance.deceasedFlag} />
                    <Flag label="Wrong Party" active={account.compliance.wrongPartyFlag} />
                    <Flag label="Attorney" active={account.compliance.representedByAttorney} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <Row k="Preferred" v={account.compliance.preferredContactMethod} />
                    <Row k="Contact Window" v={`${account.compliance.contactWindowStart ?? 'Any'} - ${account.compliance.contactWindowEnd ?? 'Any'}`} mono />
                    <Row k="SMS Consent" v={account.compliance.consentSms ? 'Yes' : 'No'} danger={!account.compliance.consentSms} />
                    <Row k="Email Consent" v={account.compliance.consentEmail ? 'Yes' : 'No'} danger={!account.compliance.consentEmail} />
                    <Row k="Voice Consent" v={account.compliance.consentVoice ? 'Yes' : 'No'} danger={!account.compliance.consentVoice} />
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs text-slate-500">No compliance flags on this fixture.</div>
              )}
            </div>
          </div>

          {/* Comms timeline + Actions */}
          <div className="space-y-4 lg:col-span-4">
            <div className="rounded-lg border border-border bg-bg-elevated/40 p-4">
              <span className="label">Communication Log</span>
              <div className="mt-3 relative">
                <div className="absolute left-[11px] top-1 bottom-1 w-px bg-border" />
                <ul className="space-y-3">
                  {account.communications.slice(0, 5).map((c, i) => (
                    <li key={i} className="relative flex gap-3">
                      <div className="relative z-10 h-6 w-6 shrink-0 rounded-full border border-border bg-bg-surface flex items-center justify-center">
                        <ChevronRight className="h-3 w-3 text-brand-gold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-xs font-medium text-slate-200">{c.channel}</span>
                          <span className="font-mono text-[10px] text-slate-500">{relativeTime(c.date)}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">{c.outcome}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {actionStates.map(({ type, Icon, danger, validation }) => (
                <ActionBtn
                  key={type}
                  Icon={Icon}
                  label={labelFor(type)}
                  danger={danger}
                  disabled={!validation.allowed}
                  reason={validation.reason}
                  onClick={() => runAction(type)}
                />
              ))}
            </div>
            {actionMessage && (
              <div className={`rounded-lg border px-3 py-2 text-xs ${
                actionMessage.tone === 'success'
                  ? 'border-status-active/25 bg-status-active/10 text-status-active'
                  : 'border-red-500/25 bg-red-500/10 text-red-300'
              }`}>
                {actionMessage.text}
              </div>
            )}
            {localEvents.length > 0 && (
              <div className="rounded-lg border border-border bg-bg-elevated/40 p-4">
                <span className="label">Local Action Log</span>
                <div className="mt-3 space-y-2">
                  {localEvents.map((event) => (
                    <div key={event.id} className="rounded-md bg-bg-surface/60 px-3 py-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className={event.status === 'blocked' ? 'text-red-300' : 'text-status-active'}>
                          {event.label} · {event.status}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{relativeTime(event.createdAt)}</span>
                      </div>
                      {event.blockedReason && <p className="mt-1 text-[11px] text-slate-500">{event.blockedReason}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function labelFor(type: RecoveryActionType) {
  const labels: Record<RecoveryActionType, string> = {
    ai_call: 'AI Call',
    sms: 'SMS',
    email: 'Email',
    payment_plan: 'Payment Plan',
    promise_to_pay: 'Promise-to-Pay',
    escalate: 'Escalate',
    skip_trace: 'Skip Trace',
    human_review: 'Human Review',
  };
  return labels[type];
}

function Row({ k, v, mono, danger }: { k: string; v: string; mono?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-500">{k}</span>
      <span className={`text-right ${mono ? 'font-mono' : ''} ${danger ? 'text-red-400' : 'text-slate-200'}`}>{v}</span>
    </div>
  );
}

function Flag({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`rounded-md border px-2 py-1 text-[11px] font-medium ${
      active
        ? 'border-red-500/30 bg-red-500/10 text-red-300'
        : 'border-border bg-bg-surface/60 text-slate-500'
    }`}>
      {label}: {active ? 'Yes' : 'No'}
    </span>
  );
}

function ActionBtn({
  Icon,
  label,
  danger,
  disabled,
  reason,
  onClick,
}: {
  Icon: LucideIcon;
  label: string;
  danger?: boolean;
  disabled?: boolean;
  reason?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={reason}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-bg-surface/60 px-3 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        danger ? 'hover:border-red-500/40 hover:text-red-300' : 'text-slate-200 hover:text-white hover:border-brand-gold/40 hover:bg-bg-elevated'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
