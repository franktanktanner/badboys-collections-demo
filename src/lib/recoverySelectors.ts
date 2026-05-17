import type { Account, Office } from '../types';

export type AccountScope = 'All Locations' | Office;

export function getScopedAccounts(accounts: Account[], scope: AccountScope): Account[] {
  if (scope === 'All Locations') return accounts;
  return accounts.filter((account) => account.office === scope);
}

export function getTotalReceivables(accounts: Account[]): number {
  return accounts.reduce((total, account) => total + (account.balance?.amountOwed ?? account.amountOwed), 0);
}

export function getTotalAccounts(accounts: Account[]): number {
  return accounts.length;
}

export function getActiveRecoveryAccounts(accounts: Account[]): number {
  return accounts.filter((account) => {
    const status = account.recoveryStatus;
    return account.amountOwed > 0 && status !== 'closed' && status !== 'write_off' && status !== 'do_not_contact';
  }).length;
}

export function getDollarsRecovered(accounts: Account[]): number {
  return accounts.reduce((total, account) => {
    const clearedPayments = account.payments
      .filter((payment) => payment.status === 'Cleared')
      .reduce((paymentTotal, payment) => paymentTotal + payment.amount, 0);
    return total + Math.max(account.balance?.recoveredAmount ?? 0, clearedPayments);
  }, 0);
}

export function getPromisesCreated(accounts: Account[]): number {
  return accounts.reduce((total, account) => total + (account.promisesToPay?.length ?? 0), 0);
}

export function getPromisesKept(accounts: Account[]): number {
  return accounts.reduce(
    (total, account) => total + (account.promisesToPay?.filter((promise) => promise.status === 'kept').length ?? 0),
    0,
  );
}

export function getPromisesBroken(accounts: Account[]): number {
  return accounts.reduce(
    (total, account) => total + (account.promisesToPay?.filter((promise) => promise.status === 'broken' || promise.status === 'escalated').length ?? 0),
    0,
  );
}

export function getHumanHandoffs(accounts: Account[]): number {
  return accounts.reduce(
    (total, account) => total + (account.handoffs?.filter((handoff) => handoff.status === 'open' || handoff.status === 'in_review').length ?? 0),
    0,
  );
}

export function getHighRiskAccounts(accounts: Account[]): number {
  return accounts.filter((account) => account.riskScore >= 75 || account.priority === 'high' || account.priority === 'critical').length;
}

export function getDoNotContactAccounts(accounts: Account[]): number {
  return accounts.filter((account) => account.compliance?.doNotContact).length;
}

export function getAverageDaysToRecovery(accounts: Account[]): number {
  const recoveredAccounts = accounts.filter((account) => getAccountRecoveredAmount(account) > 0);
  if (recoveredAccounts.length === 0) return 0;
  const totalDays = recoveredAccounts.reduce((total, account) => total + Math.max(1, Math.round(account.daysPastDue * 0.28)), 0);
  return Math.round(totalDays / recoveredAccounts.length);
}

export function getAccountRecoveredAmount(account: Account): number {
  const clearedPayments = account.payments
    .filter((payment) => payment.status === 'Cleared')
    .reduce((total, payment) => total + payment.amount, 0);
  return Math.max(account.balance?.recoveredAmount ?? 0, clearedPayments);
}

export function getCollectionRate(accounts: Account[]): number {
  const receivables = getTotalReceivables(accounts);
  const recovered = getDollarsRecovered(accounts);
  const denominator = receivables + recovered;
  if (denominator === 0) return 0;
  return (recovered / denominator) * 100;
}

export function getPromisesKeptRate(accounts: Account[]): number {
  const created = getPromisesCreated(accounts);
  if (created === 0) return 0;
  return (getPromisesKept(accounts) / created) * 100;
}

export function getStatusSummary(accounts: Account[]) {
  return accounts.reduce<Record<string, { count: number; amount: number }>>((summary, account) => {
    const key = account.status;
    const current = summary[key] ?? { count: 0, amount: 0 };
    summary[key] = {
      count: current.count + 1,
      amount: current.amount + (account.balance?.amountOwed ?? account.amountOwed),
    };
    return summary;
  }, {});
}

export function getOfficeRecoveryStats(accounts: Account[]) {
  return accounts.reduce<Record<Office, { accounts: number; receivables: number; recovered: number; rate: number }>>((stats, account) => {
    const current = stats[account.office] ?? { accounts: 0, receivables: 0, recovered: 0, rate: 0 };
    const receivables = account.balance?.amountOwed ?? account.amountOwed;
    const recovered = getAccountRecoveredAmount(account);
    const next = {
      accounts: current.accounts + 1,
      receivables: current.receivables + receivables,
      recovered: current.recovered + recovered,
      rate: 0,
    };
    next.rate = next.receivables + next.recovered > 0
      ? (next.recovered / (next.receivables + next.recovered)) * 100
      : 0;
    stats[account.office] = next;
    return stats;
  }, {} as Record<Office, { accounts: number; receivables: number; recovered: number; rate: number }>);
}

export function getRecoverySnapshot(accounts: Account[]) {
  return {
    totalReceivables: getTotalReceivables(accounts),
    totalAccounts: getTotalAccounts(accounts),
    activeRecoveryAccounts: getActiveRecoveryAccounts(accounts),
    dollarsRecovered: getDollarsRecovered(accounts),
    promisesCreated: getPromisesCreated(accounts),
    promisesKept: getPromisesKept(accounts),
    promisesBroken: getPromisesBroken(accounts),
    humanHandoffs: getHumanHandoffs(accounts),
    highRiskAccounts: getHighRiskAccounts(accounts),
    doNotContactAccounts: getDoNotContactAccounts(accounts),
    collectionRate: getCollectionRate(accounts),
    averageDaysToRecovery: getAverageDaysToRecovery(accounts),
    promisesKeptRate: getPromisesKeptRate(accounts),
  };
}
