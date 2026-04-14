import { motion } from 'framer-motion';
import { Mail, CalendarClock, History } from 'lucide-react';
import { mockAttorneys } from '../../data/mockAttorneys';
import { StatusBadge } from '../shared/StatusBadge';
import { formatCurrency } from '../../lib/format';
import { cn } from '../../lib/cn';

export function AttorneyTable() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between p-5">
        <div>
          <h2 className="h-display text-lg">Attorney Outreach Pipeline</h2>
          <p className="mt-0.5 text-xs text-slate-400">Criminal defense attorneys · California</p>
        </div>
        <span className="chip text-slate-300">{mockAttorneys.length} attorneys</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-y border-border bg-bg-surface/60">
            <tr>
              <Th>Name</Th>
              <Th>Firm</Th>
              <Th>Specialty</Th>
              <Th>Location</Th>
              <Th>Contact</Th>
              <Th>Status</Th>
              <Th right>Referrals</Th>
              <Th right>Revenue</Th>
              <Th right>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {mockAttorneys.map((a, i) => (
              <motion.tr
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.02, 0.3) }}
                className="border-b border-border-subtle hover:bg-bg-elevated/30"
              >
                <Td><span className="font-medium text-white">{a.name}</span></Td>
                <Td><span className="text-slate-300">{a.firm}</span></Td>
                <Td><span className="text-xs text-slate-400">{a.specialty}</span></Td>
                <Td><span className="text-slate-400">{a.location}</span></Td>
                <Td>
                  <div className="text-xs">
                    <div className="font-mono text-slate-300">{a.email}</div>
                    <div className="font-mono text-slate-500">{a.phone}</div>
                  </div>
                </Td>
                <Td><StatusBadge status={a.status} type="attorney" /></Td>
                <Td right>
                  <span className={cn(
                    'font-mono tabular-nums',
                    a.referrals > 0 ? 'text-white' : 'text-slate-600',
                  )}>
                    {a.referrals}
                  </span>
                </Td>
                <Td right>
                  <span className={cn(
                    'font-mono font-medium tabular-nums',
                    a.revenue > 0 ? 'text-status-active' : 'text-slate-600',
                  )}>
                    {a.revenue > 0 ? formatCurrency(a.revenue, { compact: true }) : '—'}
                  </span>
                </Td>
                <Td right>
                  <div className="flex justify-end gap-1">
                    <IconBtn title="Send email"><Mail className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn title="Schedule follow-up"><CalendarClock className="h-3.5 w-3.5" /></IconBtn>
                    <IconBtn title="View history"><History className="h-3.5 w-3.5" /></IconBtn>
                  </div>
                </Td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={cn('label whitespace-nowrap px-4 py-3', right ? 'text-right' : 'text-left')}>{children}</th>;
}
function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td className={cn('whitespace-nowrap px-4 py-3', right && 'text-right')}>{children}</td>;
}
function IconBtn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <button title={title} aria-label={title} className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-border text-slate-400 transition-colors hover:border-brand-gold/40 hover:bg-bg-elevated hover:text-brand-goldlight">
      {children}
    </button>
  );
}
