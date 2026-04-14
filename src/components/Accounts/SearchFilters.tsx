import { Search, ChevronDown, Download, MessageSquare, Phone } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/cn';
import type { AccountStatus } from '../../types';

const STATUSES: (AccountStatus | 'All')[] = ['All', 'Active', 'Delinquent', 'Escalated', 'Legal', 'Payment Plan'];
const SORTS = ['Amount Owed', 'Days Past Due', 'Risk Score', 'Last Contact'];

interface Props {
  query: string;
  onQuery: (q: string) => void;
  status: AccountStatus | 'All';
  onStatus: (s: AccountStatus | 'All') => void;
  sort: string;
  onSort: (s: string) => void;
}

export function SearchFilters({ query, onQuery, status, onStatus, sort, onSort }: Props) {
  const [sortOpen, setSortOpen] = useState(false);
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
          <button className="btn-secondary text-xs"><MessageSquare className="h-3.5 w-3.5" /> Send SMS</button>
          <button className="btn-secondary text-xs"><Phone className="h-3.5 w-3.5" /> Queue Call</button>
          <button className="btn-primary text-xs"><Download className="h-3.5 w-3.5" /> Export</button>
        </div>
      </div>
    </div>
  );
}
