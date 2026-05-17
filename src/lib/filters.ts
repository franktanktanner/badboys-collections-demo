import type { Office } from '../types';
import { agencyConfig } from '../config/agencyConfig';
import { accountFixtures } from '../data/accountFixtures';
import {
  getCollectionRate,
  getDollarsRecovered,
  getRecoverySnapshot,
  getScopedAccounts,
  getStatusSummary,
  getTotalReceivables,
} from './recoverySelectors';

export const LOCATIONS: ('All Locations' | Office)[] = ['All Locations', ...agencyConfig.offices.map((office) => office.name)];

export type LocationFilter = (typeof LOCATIONS)[number];

export const TOTAL_OUTSTANDING = getTotalReceivables(accountFixtures);
export const TOTAL_ACCOUNTS = accountFixtures.length;
export const DAILY_AI_ACTIONS = accountFixtures.reduce((total, account) => total + (account.outreachEvents?.length ?? 0), 0);
export const MONTHLY_RECOVERED = getDollarsRecovered(accountFixtures);
export const LAST_MONTH_RECOVERED = Math.round(MONTHLY_RECOVERED * 0.72);
export const COLLECTION_RATE_AI = getCollectionRate(accountFixtures);
export const COLLECTION_RATE_PRE_AI = 1.2;

export interface OfficeStat {
  office: Office;
  totalOwed: number;
  accountsCount: number;
  collectionRate: number;
  trend: number;
}

export const OFFICE_STATS: Record<Office, OfficeStat> = agencyConfig.offices.reduce((stats, office, index) => {
  const accounts = accountFixtures.filter((account) => account.office === office.name);
  const receivables = getTotalReceivables(accounts);
  stats[office.name] = {
    office: office.name,
    totalOwed: receivables,
    accountsCount: accounts.length,
    collectionRate: getCollectionRate(accounts),
    trend: 1.4 + index * 0.35,
  };
  return stats;
}, {} as Record<Office, OfficeStat>);

export const officeStatsList: OfficeStat[] = Object.values(OFFICE_STATS);

export function isFiltered(loc: LocationFilter): loc is Office {
  return loc !== 'All Locations';
}

export function shareOf(loc: LocationFilter): number {
  if (!isFiltered(loc)) return 1;
  return TOTAL_OUTSTANDING > 0 ? OFFICE_STATS[loc].totalOwed / TOTAL_OUTSTANDING : 0;
}

export interface KPIValues {
  outstanding: number;
  accounts: number;
  rate: number;
  ratePrev: number;
  aiActions: number;
  paymentsTriggered: number;
  recovered: number;
  recoveredPrev: number;
  recoveredTrend: number;
  outstandingTrend: number;
  rateTrend: number;
  aiActionsTrend: number;
}

export function getKPIs(loc: LocationFilter): KPIValues {
  const scopedAccounts = getScopedAccounts(accountFixtures, loc);
  const snapshot = getRecoverySnapshot(scopedAccounts);
  if (!isFiltered(loc)) {
    return {
      outstanding: snapshot.totalReceivables,
      accounts: snapshot.totalAccounts,
      rate: snapshot.collectionRate,
      ratePrev: COLLECTION_RATE_PRE_AI,
      aiActions: DAILY_AI_ACTIONS,
      paymentsTriggered: snapshot.promisesCreated + snapshot.dollarsRecovered > 0 ? snapshot.promisesCreated : 0,
      recovered: snapshot.dollarsRecovered,
      recoveredPrev: LAST_MONTH_RECOVERED,
      recoveredTrend: 28.4,
      outstandingTrend: -4.2,
      rateTrend: snapshot.collectionRate - COLLECTION_RATE_PRE_AI,
      aiActionsTrend: 12.8,
    };
  }
  const s = OFFICE_STATS[loc];
  const share = shareOf(loc);
  const recovered = snapshot.dollarsRecovered;
  const recoveredPrev = Math.round(recovered * 0.72);
  return {
    outstanding: s.totalOwed,
    accounts: s.accountsCount,
    rate: s.collectionRate,
    ratePrev: COLLECTION_RATE_PRE_AI,
    aiActions: Math.max(0, Math.round(DAILY_AI_ACTIONS * share)),
    paymentsTriggered: snapshot.promisesCreated,
    recovered,
    recoveredPrev,
    recoveredTrend: s.trend >= 0 ? 32 + Math.abs(s.trend) * 2 : 18 + s.trend * 4,
    outstandingTrend: -Math.abs(s.trend),
    rateTrend: ((s.collectionRate - COLLECTION_RATE_PRE_AI) / COLLECTION_RATE_PRE_AI) * 100,
    aiActionsTrend: 12 + s.trend * 3,
  };
}

export interface PipelineStage {
  label: string;
  count: number;
  amount: number;
  color: string;
  gradient: string;
}

const PIPELINE_BASE_SHAPE = [
  { label: 'Active',     color: 'text-status-active',     gradient: 'from-emerald-500 to-green-400' },
  { label: 'Delinquent', color: 'text-status-delinquent', gradient: 'from-amber-500 to-yellow-400' },
  { label: 'Escalated',  color: 'text-status-escalated',  gradient: 'from-orange-500 to-red-500' },
  { label: 'Legal',      color: 'text-status-legal',      gradient: 'from-purple-500 to-fuchsia-500' },
  { label: 'Write-off',  color: 'text-slate-500',         gradient: 'from-slate-600 to-slate-500' },
];
const STATUS_TO_PIPELINE: Record<string, string> = {
  Active: 'Active',
  Delinquent: 'Delinquent',
  Escalated: 'Escalated',
  Legal: 'Legal',
  'Payment Plan': 'Active',
};

export function getPipeline(loc: LocationFilter): PipelineStage[] {
  const summary = getStatusSummary(getScopedAccounts(accountFixtures, loc));
  return PIPELINE_BASE_SHAPE.map((stage) => ({
    ...stage,
    count: Object.entries(summary)
      .filter(([status]) => STATUS_TO_PIPELINE[status] === stage.label)
      .reduce((total, [, value]) => total + value.count, 0),
    amount: stage.label === 'Write-off'
      ? 0
      : Object.entries(summary)
        .filter(([status]) => STATUS_TO_PIPELINE[status] === stage.label)
        .reduce((total, [, value]) => total + value.amount, 0),
  }));
}

export interface AutomationTotals {
  calls: number;
  sms: number;
  emails: number;
  payments: number;
  plans: number;
  skip: number;
}

export function getAutomationStats(loc: LocationFilter): AutomationTotals {
  const accounts = getScopedAccounts(accountFixtures, loc);
  return {
    calls: accounts.reduce((total, account) => total + (account.outreachEvents?.filter((event) => event.channel === 'ai_call').length ?? 0), 0),
    sms: accounts.reduce((total, account) => total + (account.outreachEvents?.filter((event) => event.channel === 'sms').length ?? 0), 0),
    emails: accounts.reduce((total, account) => total + (account.outreachEvents?.filter((event) => event.channel === 'email').length ?? 0), 0),
    payments: getDollarsRecovered(accounts),
    plans: accounts.reduce((total, account) => total + (account.paymentPlans?.length ?? 0), 0),
    skip: accounts.reduce((total, account) => total + (account.outreachEvents?.filter((event) => event.channel === 'skip_trace').length ?? 0), 0),
  };
}

const COUNTY_BY_OFFICE: Record<Office, string> = agencyConfig.offices.reduce((counties, office) => {
  counties[office.name] = office.county;
  return counties;
}, {} as Record<Office, string>);

export function countyFor(loc: LocationFilter): string | null {
  return isFiltered(loc) ? COUNTY_BY_OFFICE[loc] : null;
}
