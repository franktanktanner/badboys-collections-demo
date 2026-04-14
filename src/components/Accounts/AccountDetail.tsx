import { motion } from 'framer-motion';
import { Phone, MessageSquare, Mail, CalendarClock, AlertTriangle, Search, User, Shield, ChevronRight } from 'lucide-react';
import type { Account } from '../../types';
import { formatCurrency, formatDate, relativeTime } from '../../lib/format';

export function AccountDetail({ account }: { account: Account }) {
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
            <div className="h-full rounded-lg border border-border bg-bg-elevated/40 p-4">
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
              <ActionBtn Icon={Phone} label="AI Call" />
              <ActionBtn Icon={MessageSquare} label="Send SMS" />
              <ActionBtn Icon={Mail} label="Send Email" />
              <ActionBtn Icon={CalendarClock} label="Payment Plan" />
              <ActionBtn Icon={AlertTriangle} label="Escalate" danger />
              <ActionBtn Icon={Search} label="Skip Trace" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Row({ k, v, mono, danger }: { k: string; v: string; mono?: boolean; danger?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-500">{k}</span>
      <span className={`text-right ${mono ? 'font-mono' : ''} ${danger ? 'text-red-400' : 'text-slate-200'}`}>{v}</span>
    </div>
  );
}

function ActionBtn({ Icon, label, danger }: { Icon: typeof Phone; label: string; danger?: boolean }) {
  return (
    <button className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-bg-surface/60 px-3 py-2 text-xs font-medium transition-colors hover:border-brand-gold/40 hover:bg-bg-elevated ${
      danger ? 'hover:border-red-500/40 hover:text-red-300' : 'text-slate-200 hover:text-white'
    }`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
