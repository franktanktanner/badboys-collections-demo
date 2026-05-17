import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { accountFixtures } from '../../data/accountFixtures';
import { generatedAccounts } from '../../data/mockAccounts';
import type { AccountStatus } from '../../types';
import { formatCurrency, formatDate, relativeTime } from '../../lib/format';
import { StatusBadge } from '../shared/StatusBadge';
import { RiskMeter } from '../shared/RiskMeter';
import { AccountDetail } from './AccountDetail';
import { cn } from '../../lib/cn';
import { isFiltered, type LocationFilter } from '../../lib/filters';

const PAGE_SIZE = 25;
const ALL_ACCOUNTS = [...accountFixtures, ...generatedAccounts];

interface Props {
  query: string;
  status: AccountStatus | 'All';
  sort: string;
  location: LocationFilter;
}

export function AccountsTable({ query, status, sort, location }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    let r = ALL_ACCOUNTS;
    if (isFiltered(location)) r = r.filter((a) => a.office === location);
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
  }, [query, status, sort, location]);

  useEffect(() => {
    setPage(1);
    setExpanded(null);
  }, [query, status, sort, location]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE);
  const showingFrom = rows.length === 0 ? 0 : pageStart + 1;
  const showingTo = pageStart + pageRows.length;

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
            {pageRows.map((a, i) => {
              const isOpen = expanded === a.id;
              return (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.012, 0.3) }}
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
            {pageRows.length === 0 && (
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
              const acct = pageRows.find((r) => r.id === expanded);
              return acct ? <AccountDetail account={acct} /> : null;
            })()}
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-slate-500">
        <span>
          Showing <span className="text-slate-300">{showingFrom}-{showingTo}</span> of {rows.length} accounts
          {rows.length !== ALL_ACCOUNTS.length && (
            <span className="text-slate-600"> · filtered from {ALL_ACCOUNTS.length}</span>
          )}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="flex items-center gap-1 rounded-md border border-border bg-bg-elevated/60 px-2.5 py-1 text-slate-300 transition-colors hover:border-border-strong hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3 w-3" />
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={cn(
                'min-w-[28px] rounded-md border px-2 py-1 font-mono transition-colors',
                p === safePage
                  ? 'border-brand-gold/50 bg-brand-gold/10 text-brand-goldlight'
                  : 'border-border bg-bg-elevated/60 text-slate-400 hover:border-border-strong hover:text-white',
              )}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="flex items-center gap-1 rounded-md border border-border bg-bg-elevated/60 px-2.5 py-1 text-slate-300 transition-colors hover:border-border-strong hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
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
