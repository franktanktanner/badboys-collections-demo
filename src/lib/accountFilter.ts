import { mockAccounts } from '../data/mockAccounts';
import type { Account, AccountStatus } from '../types';
import { isFiltered, type LocationFilter } from './filters';

export interface AccountFilterArgs {
  query: string;
  status: AccountStatus | 'All';
  sort: string;
  location: LocationFilter;
}

const SORTERS: Record<string, (a: Account, b: Account) => number> = {
  'Amount Owed':   (a, b) => b.amountOwed - a.amountOwed,
  'Days Past Due': (a, b) => b.daysPastDue - a.daysPastDue,
  'Risk Score':    (a, b) => b.riskScore - a.riskScore,
  'Last Contact':  (a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime(),
};

export function filterAndSortAccounts({ query, status, sort, location }: AccountFilterArgs): Account[] {
  let r = mockAccounts;
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
  const sorter = SORTERS[sort] ?? SORTERS['Amount Owed'];
  return [...r].sort(sorter);
}
