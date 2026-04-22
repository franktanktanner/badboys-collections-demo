import type { Office } from '../types';

export const LOCATIONS: ('All Locations' | Office)[] = [
  'All Locations',
  'San Jose',
  'Oakland',
  'Redwood City',
  'Los Angeles',
  'Santa Ana',
  'San Diego',
];

export type LocationFilter = (typeof LOCATIONS)[number];

export const TOTAL_OUTSTANDING = 135_000_000;
export const TOTAL_ACCOUNTS = 4247;
export const DAILY_AI_ACTIONS = 1847;
export const MONTHLY_RECOVERED = 847_200;
export const LAST_MONTH_RECOVERED = 612_000;
export const COLLECTION_RATE_AI = 8.7;
export const COLLECTION_RATE_PRE_AI = 1.2;

export interface OfficeStat {
  office: Office;
  totalOwed: number;
  accountsCount: number;
  collectionRate: number;
  trend: number;
}

export const OFFICE_STATS: Record<Office, OfficeStat> = {
  'Los Angeles':    { office: 'Los Angeles',    totalOwed: 34_000_000, accountsCount: 1070, collectionRate: 7.4,  trend: 2.6 },
  'San Jose':       { office: 'San Jose',       totalOwed: 28_500_000, accountsCount: 900,  collectionRate: 10.2, trend: 3.2 },
  'Oakland':        { office: 'Oakland',        totalOwed: 23_000_000, accountsCount: 730,  collectionRate: 9.0,  trend: 1.9 },
  'San Diego':      { office: 'San Diego',      totalOwed: 19_500_000, accountsCount: 630,  collectionRate: 8.3,  trend: 2.1 },
  'Santa Ana':      { office: 'Santa Ana',      totalOwed: 17_500_000, accountsCount: 560,  collectionRate: 8.6,  trend: 1.5 },
  'Redwood City':   { office: 'Redwood City',   totalOwed: 12_500_000, accountsCount: 357,  collectionRate: 11.1, trend: 3.5 },
};

export const officeStatsList: OfficeStat[] = Object.values(OFFICE_STATS);

export function isFiltered(loc: LocationFilter): loc is Office {
  return loc !== 'All Locations';
}

export function shareOf(loc: LocationFilter): number {
  if (!isFiltered(loc)) return 1;
  return OFFICE_STATS[loc].totalOwed / TOTAL_OUTSTANDING;
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
  if (!isFiltered(loc)) {
    return {
      outstanding: TOTAL_OUTSTANDING,
      accounts: TOTAL_ACCOUNTS,
      rate: COLLECTION_RATE_AI,
      ratePrev: COLLECTION_RATE_PRE_AI,
      aiActions: DAILY_AI_ACTIONS,
      paymentsTriggered: 94,
      recovered: MONTHLY_RECOVERED,
      recoveredPrev: LAST_MONTH_RECOVERED,
      recoveredTrend: 38.4,
      outstandingTrend: 2.1,
      rateTrend: 625.0,
      aiActionsTrend: 18.2,
    };
  }
  const s = OFFICE_STATS[loc];
  const share = s.totalOwed / TOTAL_OUTSTANDING;
  const recovered = Math.round(MONTHLY_RECOVERED * share);
  const recoveredPrev = Math.round(LAST_MONTH_RECOVERED * share);
  return {
    outstanding: s.totalOwed,
    accounts: s.accountsCount,
    rate: s.collectionRate,
    ratePrev: COLLECTION_RATE_PRE_AI,
    aiActions: Math.max(20, Math.round(DAILY_AI_ACTIONS * share)),
    paymentsTriggered: Math.max(3, Math.round(94 * share)),
    recovered,
    recoveredPrev,
    recoveredTrend: s.trend >= 0 ? 32 + Math.abs(s.trend) * 2 : 18 + s.trend * 4,
    outstandingTrend: Math.abs(s.trend),
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
const BASE_COUNTS = [1847, 1562, 548, 214, 76];
const BASE_AMOUNTS = [42_300_000, 51_800_000, 27_400_000, 11_900_000, 1_600_000];

export function getPipeline(loc: LocationFilter): PipelineStage[] {
  if (!isFiltered(loc)) {
    return PIPELINE_BASE_SHAPE.map((s, i) => ({ ...s, count: BASE_COUNTS[i], amount: BASE_AMOUNTS[i] }));
  }
  const s = OFFICE_STATS[loc];
  const countShare = s.accountsCount / TOTAL_ACCOUNTS;
  const amountShare = s.totalOwed / TOTAL_OUTSTANDING;
  return PIPELINE_BASE_SHAPE.map((stage, i) => ({
    ...stage,
    count: Math.max(1, Math.round(BASE_COUNTS[i] * countShare)),
    amount: Math.max(0, Math.round(BASE_AMOUNTS[i] * amountShare)),
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
  const share = shareOf(loc);
  return {
    calls:    Math.max(80, Math.round(28_412 * share)),
    sms:      Math.max(250, Math.round(94_281 * share)),
    emails:   Math.max(120, Math.round(42_109 * share)),
    payments: Math.max(35_000, Math.round(3_847_200 * share)),
    plans:    Math.max(4, Math.round(734 * share)),
    skip:     Math.max(8, Math.round(1_287 * share)),
  };
}

const COUNTY_BY_OFFICE: Record<Office, string> = {
  'San Jose': 'Santa Clara',
  'Oakland': 'Alameda',
  'Redwood City': 'San Mateo',
  'Los Angeles': 'Los Angeles',
  'Santa Ana': 'Orange',
  'San Diego': 'San Diego',
};

export function countyFor(loc: LocationFilter): string | null {
  return isFiltered(loc) ? COUNTY_BY_OFFICE[loc] : null;
}
