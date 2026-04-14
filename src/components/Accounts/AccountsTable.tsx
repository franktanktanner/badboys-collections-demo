import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { mockAccounts } from '../../data/mockAccounts';
import type { AccountStatus } from '../../types';
import { formatCurrency, formatDate, relativeTime } from '../../lib/format';
import { StatusBadge } from '../shared/StatusBadge';
import { RiskMeter } from '../shared/RiskMeter';
import { AccountDetail } from './AccountDetail';
import { cn } from '../../lib/cn';

interface Props {
  query: string;
  status: AccountStatus | 'All';
  sort: string;
}

export function AccountsTable({ query, status, sort }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const rows = useMemo(() => {
    let r = mockAccounts;
    if (status !== 'All') r = r.filter((a) => a.status === status);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((a) =>
        a.defendant.name.toLowerCase().includes(q) ||
        a.indemnitor.name.toLowerCase().includes(q) ||
        a.bondId.toLowerCase().includes(q),
      );
    }
    const sorters: Record<string, (a: typeof r[number], b: typeof r[number]) => number> = {
      'Amount Owed': (a, b) => b.amountOwed - a.amountOwed,
      'Days Past Due': (a, b) => b.daysPastDue - a.daysPastDue,
      'Risk Score': (a, b) => b.riskScore - a.riskScore,
      'Last Contact': (a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime(),
    };
    return [...r].sort(sorters[sort] || sorters['Amount Owed']);
  }, [query, status, sort]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-bg-surface/90 backdrop-blur">
            <tr className="border-b border-border">
              <th className="w-8 p-3"></th>
              <Th>Bond ID</Th>
              <Th>Defendant</Th>
              <Th>Indemnitor</Th>
              <Th right>Bond</Th>
              <Th right>Owed</Th>
              <Th right>Past Due</Th>
              <Th>Risk</Th>
              <Th>Status</Th>
              <Th>Location</Th>
              <Th>Last Contact</Th>
              <Th>Next Action</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a, i) => {
              const isOpen = expanded === a.id;
              return (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.3) }}
                  className={cn(
                    'border-b border-border-subtle cursor-pointer transition-colors',
                    isOpen ? 'bg-bg-elevated/60' : 'hover:bg-bg-elevated/40',
                  )}
                  onClick={() => setExpanded(isOpen ? null : a.id)}
                >
                  <td className="px-3 py-3">
                    <ChevronDown className={cn('h-3.5 w-3.5 text-slate-500 transition-transform', isOpen && 'rotate-180 text-brand-gold')} />
                  </td>
                  <Td><span className="font-mono text-xs text-brand-gold">{a.bondId}</span></Td>
                  <Td><span className="font-medium text-white">{a.defendant.name}</span></Td>
                  <Td><span className="text-slate-300">{a.indemnitor.name}</span></Td>
                  <Td right><span className="font-mono tabular-nums text-slate-300">{formatCurrency(a.bondAmount, { compact: true })}</span></Td>
                  <Td right><span className="font-mono font-medium tabular-nums text-white">{formatCurrency(a.amountOwed)}</span></Td>
                  <Td right>
                    <span className={cn(
                      'font-mono tabular-nums',
                      a.daysPastDue >= 180 ? 'text-red-400' : a.daysPastDue >= 90 ? 'text-status-delinquent' : 'text-slate-300',
                    )}>
                      {a.daysPastDue}d
                    </span>
                  </Td>
                  <Td><RiskMeter score={a.riskScore} /></Td>
                  <Td><StatusBadge status={a.status} /></Td>
                  <Td><span className="text-slate-400">{a.office}</span></Td>
                  <Td><span className="text-slate-400">{relativeTime(a.lastContact)}</span></Td>
                  <Td><span className="text-xs text-slate-300">{a.nextAction}</span></Td>
                </motion.tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={12} className="p-12 text-center text-sm text-slate-500">
                  No accounts match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <div key={expanded}>
            {(() => {
              const acct = rows.find((r) => r.id === expanded);
              return acct ? <AccountDetail account={acct} /> : null;
            })()}
          </div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-slate-500">
        <span>Showing <span className="text-slate-300">{rows.length}</span> of {mockAccounts.length} accounts</span>
        <span className="font-mono">Bonded date: {formatDate(new Date())}</span>
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
