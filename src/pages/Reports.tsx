import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  Calendar, ChevronDown, Download, FileText, MapPin, Percent, DollarSign,
  Clock, CalendarClock,
} from 'lucide-react';
import { CountUp } from '../components/shared/CountUp';
import { cn } from '../lib/cn';
import { formatCurrency, formatNumber, formatPercent } from '../lib/format';
import {
  isFiltered, shareOf, OFFICE_STATS, officeStatsList,
  type LocationFilter,
} from '../lib/filters';
import type { Office } from '../types';

const DATE_RANGES = ['Last 30 days', 'Last Quarter', 'YTD', 'Custom'] as const;
type DateRange = (typeof DATE_RANGES)[number];

const RANGE_MULTIPLIERS: Record<DateRange, number> = {
  'Last 30 days': 0.18,
  'Last Quarter': 0.52,
  'YTD': 1,
  'Custom': 0.74,
};

const MONTH_LABELS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'];
const MONTH_BASE = [612, 648, 690, 712, 754, 798, 812, 836, 884, 902, 928, 847];

const TOP_RECOVERED_BASE: { bondId: string; name: string; original: number; recovered: number; days: number; office: Office }[] = [
  { bondId: 'BB-2024-0891', name: 'Marcus Washington',  original: 48_000, recovered: 48_000, days: 12, office: 'Los Angeles' },
  { bondId: 'BB-2024-0874', name: 'Elena Rodriguez',    original: 36_500, recovered: 36_500, days: 18, office: 'San Jose' },
  { bondId: 'BB-2024-0912', name: 'DeShawn Parker',     original: 42_000, recovered: 40_800, days: 24, office: 'Oakland' },
  { bondId: 'BB-2024-0803', name: 'Priya Nair',         original: 28_900, recovered: 28_900, days: 9,  office: 'San Jose' },
  { bondId: 'BB-2024-0858', name: 'Tomás Herrera',      original: 55_200, recovered: 52_400, days: 31, office: 'Santa Ana' },
  { bondId: 'BB-2024-0829', name: 'Kimberly Nguyen',    original: 19_800, recovered: 19_800, days: 6,  office: 'San Diego' },
  { bondId: 'BB-2024-0844', name: 'Jalen Brooks',       original: 33_750, recovered: 31_200, days: 27, office: 'Los Angeles' },
  { bondId: 'BB-2024-0887', name: 'Anastasia Volkov',   original: 62_000, recovered: 58_900, days: 38, office: 'Redwood City' },
  { bondId: 'BB-2024-0901', name: 'Rafael Castillo',    original: 24_400, recovered: 24_400, days: 14, office: 'Santa Ana' },
  { bondId: 'BB-2024-0862', name: 'Aisha Robinson',     original: 17_200, recovered: 17_200, days: 8,  office: 'Oakland' },
  { bondId: 'BB-2024-0809', name: 'Diego Fernández',    original: 71_500, recovered: 65_800, days: 44, office: 'Los Angeles' },
  { bondId: 'BB-2024-0920', name: 'Mei Tanaka',         original: 21_300, recovered: 21_300, days: 11, office: 'San Jose' },
  { bondId: 'BB-2024-0881', name: 'Cyrus Ahmadi',       original: 38_900, recovered: 36_100, days: 29, office: 'Oakland' },
  { bondId: 'BB-2024-0867', name: 'Rachel Goldberg',    original: 26_600, recovered: 26_600, days: 16, office: 'San Diego' },
  { bondId: 'BB-2024-0893', name: 'Oluwaseun Adeyemi',  original: 44_200, recovered: 42_100, days: 22, office: 'Redwood City' },
  { bondId: 'BB-2024-0812', name: 'Vanessa Kowalski',   original: 15_800, recovered: 15_800, days: 7,  office: 'San Jose' },
  { bondId: 'BB-2024-0876', name: 'Desmond Jackson',    original: 52_700, recovered: 48_300, days: 34, office: 'Los Angeles' },
  { bondId: 'BB-2024-0898', name: 'Isla Fitzgerald',    original: 29_400, recovered: 29_400, days: 13, office: 'Santa Ana' },
  { bondId: 'BB-2024-0834', name: 'Amir Hassan',        original: 31_100, recovered: 28_900, days: 26, office: 'San Diego' },
  { bondId: 'BB-2024-0904', name: 'Lucia Moretti',      original: 23_500, recovered: 23_500, days: 10, office: 'Oakland' },
];

const AGE_BUCKETS = [
  { label: '0 to 30 days',   key: '0-30',   share: 0.18, rate: 0.94 },
  { label: '31 to 60 days',  key: '31-60',  share: 0.23, rate: 0.72 },
  { label: '61 to 90 days',  key: '61-90',  share: 0.21, rate: 0.48 },
  { label: '91 to 180 days', key: '91-180', share: 0.22, rate: 0.26 },
  { label: '180+ days',      key: '180+',   share: 0.16, rate: 0.11 },
];

const TOTAL_OUTSTANDING_YTD = 135_000_000;

export function Reports({ location }: { location: LocationFilter }) {
  const [dateRange, setDateRange] = useState<DateRange>('YTD');

  const rangeShare = RANGE_MULTIPLIERS[dateRange];
  const locShare = shareOf(location);
  const scope = rangeShare * locShare;
  const scoped = isFiltered(location);

  const kpis = useMemo(() => {
    const baseRecovered = 9_420_000 * rangeShare * locShare;
    const baseRate = scoped ? OFFICE_STATS[location as Office].collectionRate : 8.7;
    const activePlans = Math.max(6, Math.round(734 * locShare));
    const avgDays = scoped
      ? 21 + Math.round((OFFICE_STATS[location as Office].trend - 2) * 2)
      : 23;
    return {
      recovered: Math.round(baseRecovered),
      rate: baseRate,
      avgDays: Math.max(12, avgDays),
      activePlans,
    };
  }, [rangeShare, locShare, scoped, location]);

  const monthlyRecovery = useMemo(
    () => MONTH_LABELS.map((m, i) => ({
      month: m,
      recovered: Math.round(MONTH_BASE[i] * 1000 * locShare),
    })),
    [locShare],
  );

  const officeCollections = useMemo(
    () => officeStatsList
      .map((o) => ({
        office: o.office,
        recovered: Math.round(o.totalOwed * (o.collectionRate / 100) * rangeShare),
        rate: o.collectionRate,
        isSelected: scoped && location === o.office,
      }))
      .sort((a, b) => b.recovered - a.recovered),
    [rangeShare, scoped, location],
  );

  const aiManualSplit = useMemo(() => {
    const total = kpis.recovered;
    const aiShare = 0.87;
    return [
      { name: 'AI Agent', value: Math.round(total * aiShare), color: '#EAB308' },
      { name: 'Manual', value: Math.round(total * (1 - aiShare)), color: '#475569' },
    ];
  }, [kpis.recovered]);

  const topRecovered = useMemo(() => {
    const filtered = scoped
      ? TOP_RECOVERED_BASE.filter((r) => r.office === location)
      : TOP_RECOVERED_BASE;
    return filtered.slice(0, 20);
  }, [scoped, location]);

  const ageBuckets = useMemo(() => {
    const total = TOTAL_OUTSTANDING_YTD * locShare;
    return AGE_BUCKETS.map((b) => {
      const outstanding = Math.round(total * b.share);
      const accounts = Math.max(4, Math.round(outstanding / 31_800));
      return {
        ...b,
        outstanding,
        accounts,
        rate: b.rate,
      };
    });
  }, [locShare]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      {scoped && <LocationBanner location={location} />}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h-display text-xl">Reports</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Performance analytics · {scoped ? `${location} office` : 'all offices'} · {dateRange}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RangeDropdown value={dateRange} onChange={setDateRange} />
          <button className="btn-secondary !py-1.5 text-xs" aria-label="Export as CSV">
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            <span>CSV</span>
          </button>
          <button className="btn-secondary !py-1.5 text-xs" aria-label="Export as PDF">
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiTile
          label="Collection Rate YTD"
          value={kpis.rate}
          format="percent"
          sub={scoped ? `${location} office` : 'blended across 6 offices'}
          Icon={Percent}
          accent="gold"
          delay={0}
        />
        <KpiTile
          label="Total Recovered YTD"
          value={kpis.recovered}
          format="currency-compact"
          sub={`${dateRange.toLowerCase()} window`}
          Icon={DollarSign}
          accent="green"
          delay={0.06}
        />
        <KpiTile
          label="Avg Days to Recovery"
          value={kpis.avgDays}
          format="days"
          sub="from first contact to cleared"
          Icon={Clock}
          accent="blue"
          delay={0.12}
        />
        <KpiTile
          label="Active Payment Plans"
          value={kpis.activePlans}
          format="number"
          sub="83% on-track completion"
          Icon={CalendarClock}
          accent="gold"
          delay={0.18}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MonthlyRecoveryCard data={monthlyRecovery} />
        </div>
        <div>
          <AiManualCard data={aiManualSplit} />
        </div>
        <div className="xl:col-span-3">
          <OfficeCollectionsCard data={officeCollections} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TopRecoveredTable rows={topRecovered} />
        </div>
        <div>
          <AgeBucketsCard buckets={ageBuckets} scope={scope} />
        </div>
      </div>
    </motion.div>
  );
}

function LocationBanner({ location }: { location: LocationFilter }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 rounded-lg border border-brand-gold/30 bg-brand-gold/10 px-4 py-2.5 text-sm"
    >
      <MapPin className="h-4 w-4 text-brand-gold" />
      <span className="text-slate-200">Reports scoped to</span>
      <span className="font-semibold text-brand-goldlight">{location}</span>
      <span className="text-slate-500">office</span>
    </motion.div>
  );
}

function RangeDropdown({ value, onChange }: { value: DateRange; onChange: (v: DateRange) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary !py-1.5 text-xs"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Calendar className="h-3.5 w-3.5 text-slate-400" />
        <span className="text-slate-200">{value}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 top-full z-30 mt-1.5 w-44 overflow-hidden rounded-lg border border-border bg-bg-surface/95 p-1 shadow-card backdrop-blur-xl"
          >
            {DATE_RANGES.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className={cn(
                  'flex w-full cursor-pointer items-center rounded-md px-3 py-1.5 text-left text-xs transition-colors',
                  value === opt ? 'bg-brand-gold/10 text-brand-goldlight' : 'text-slate-300 hover:bg-bg-elevated hover:text-white',
                )}
              >
                {opt}
              </button>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

interface KpiTileProps {
  label: string;
  value: number;
  format: 'percent' | 'currency-compact' | 'number' | 'days';
  sub: string;
  Icon: typeof Percent;
  accent: 'gold' | 'green' | 'blue';
  delay: number;
}

const ACCENT_MAP: Record<KpiTileProps['accent'], { bg: string; text: string; grad: string }> = {
  gold:  { bg: 'bg-brand-gold/10',    text: 'text-brand-gold',    grad: 'from-brand-gold/10 via-transparent to-transparent' },
  green: { bg: 'bg-status-active/10', text: 'text-status-active', grad: 'from-emerald-500/10 via-transparent to-transparent' },
  blue:  { bg: 'bg-status-plan/10',   text: 'text-status-plan',   grad: 'from-blue-500/10 via-transparent to-transparent' },
};

function KpiTile({ label, value, format, sub, Icon, accent, delay }: KpiTileProps) {
  const a = ACCENT_MAP[accent];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card glass-card-hover overflow-hidden p-5"
    >
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br', a.grad)} />
      <div className="relative flex items-start justify-between">
        <div className="label">{label}</div>
        <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', a.bg)}>
          <Icon className={cn('h-4 w-4', a.text)} />
        </div>
      </div>
      <div className="relative mt-3 font-display text-3xl font-semibold tracking-tight text-white lg:text-[32px]">
        {format === 'percent' && <CountUp value={value} decimals={1} suffix="%" />}
        {format === 'currency-compact' && <CountUp value={value} currency compact />}
        {format === 'number' && <CountUp value={value} compact={value > 10000} />}
        {format === 'days' && <CountUp value={value} suffix=" days" />}
      </div>
      <div className="relative mt-1 text-xs text-slate-400">{sub}</div>
    </motion.div>
  );
}

function MonthlyRecoveryCard({ data }: { data: { month: string; recovered: number }[] }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Recovery by Month</h2>
          <p className="mt-0.5 text-xs text-slate-400">Last 12 months · dollars cleared to book</p>
        </div>
        <span className="chip text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
          Trailing 12
        </span>
      </div>
      <div className="mt-5 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="recovery-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FACC15" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#CA8A04" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,0.08)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(v, { compact: true })}
              width={60}
            />
            <Tooltip
              cursor={{ fill: 'rgba(234,179,8,0.06)' }}
              formatter={(v) => [formatCurrency(Number(v)), 'Recovered']}
            />
            <Bar dataKey="recovered" fill="url(#recovery-bar)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OfficeCollectionsCard({
  data,
}: {
  data: { office: string; recovered: number; rate: number; isSelected: boolean }[];
}) {
  const max = Math.max(...data.map((d) => d.recovered), 1);
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Collections by Office</h2>
          <p className="mt-0.5 text-xs text-slate-400">Recovered dollars · 6 California locations</p>
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {data.map((row, i) => {
          const widthPct = (row.recovered / max) * 100;
          return (
            <motion.div
              key={row.office}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="group"
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <span className={cn('text-sm font-medium', row.isSelected ? 'text-brand-goldlight' : 'text-white')}>
                    {row.office}
                  </span>
                  <span className="font-mono text-xs text-slate-500">{formatPercent(row.rate)}</span>
                </div>
                <span className="font-mono text-sm font-medium tabular-nums text-white">
                  {formatCurrency(row.recovered, { compact: true })}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-bg-elevated/80">
                <motion.div
                  key={`${row.office}-${row.recovered}`}
                  className={cn(
                    'h-full rounded-full bg-gradient-to-r',
                    row.isSelected
                      ? 'from-brand-goldlight to-brand-gold'
                      : 'from-brand-golddark to-brand-gold',
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{ duration: 0.9, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function AiManualCard({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="glass-card flex h-full flex-col p-6">
      <div>
        <h2 className="h-display text-lg">AI vs Manual Recovery</h2>
        <p className="mt-0.5 text-xs text-slate-400">Where the dollars actually came from</p>
      </div>
      <div className="mt-2 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={58}
              outerRadius={88}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v, n) => [formatCurrency(Number(v)), String(n)]} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, color: '#cbd5e1' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        {data.map((d) => {
          const pct = total > 0 ? (d.value / total) * 100 : 0;
          return (
            <div key={d.name} className="rounded-lg border border-border bg-bg-elevated/40 p-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                <span className="text-slate-300">{d.name}</span>
              </div>
              <div className="mt-1 font-mono text-sm font-semibold tabular-nums text-white">
                {formatCurrency(d.value, { compact: true })}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">{pct.toFixed(1)}% of total</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TopRecoveredTable({
  rows,
}: {
  rows: { bondId: string; name: string; original: number; recovered: number; days: number; office: Office }[];
}) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h2 className="h-display text-lg">Top Recovered Accounts</h2>
          <p className="mt-0.5 text-xs text-slate-400">Current quarter · ranked by dollars cleared</p>
        </div>
        <span className="chip text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
          {rows.length} accounts
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-surface/90">
            <tr className="border-b border-border">
              <Th>Bond ID</Th>
              <Th>Account</Th>
              <Th>Office</Th>
              <Th right>Original</Th>
              <Th right>Recovered</Th>
              <Th right>% Recovered</Th>
              <Th right>Days</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const pct = r.original > 0 ? (r.recovered / r.original) * 100 : 0;
              return (
                <motion.tr
                  key={r.bondId}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(i * 0.015, 0.3) }}
                  className="border-b border-border-subtle hover:bg-bg-elevated/40"
                >
                  <Td><span className="font-mono text-xs text-brand-gold">{r.bondId}</span></Td>
                  <Td><span className="font-medium text-white">{r.name}</span></Td>
                  <Td><span className="text-slate-400">{r.office}</span></Td>
                  <Td right><span className="font-mono tabular-nums text-slate-300">{formatCurrency(r.original)}</span></Td>
                  <Td right><span className="font-mono font-medium tabular-nums text-white">{formatCurrency(r.recovered)}</span></Td>
                  <Td right>
                    <span className={cn(
                      'font-mono tabular-nums',
                      pct >= 98 ? 'text-status-active' : pct >= 90 ? 'text-brand-goldlight' : 'text-status-delinquent',
                    )}>
                      {pct.toFixed(1)}%
                    </span>
                  </Td>
                  <Td right><span className="font-mono tabular-nums text-slate-300">{r.days}d</span></Td>
                </motion.tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center text-sm text-slate-500">
                  No recovered accounts in this scope.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AgeBucketsCard({
  buckets,
  scope,
}: {
  buckets: { label: string; key: string; outstanding: number; accounts: number; rate: number }[];
  scope: number;
}) {
  const total = buckets.reduce((s, b) => s + b.outstanding, 0);
  return (
    <div className="glass-card flex h-full flex-col p-6">
      <div>
        <h2 className="h-display text-lg">Outstanding by Age</h2>
        <p className="mt-0.5 text-xs text-slate-400">
          {formatCurrency(total, { compact: true })} total · aging buckets
        </p>
      </div>
      <div className="mt-5 flex-1 space-y-3">
        {buckets.map((b, i) => {
          const sharePct = total > 0 ? (b.outstanding / total) * 100 : 0;
          return (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-lg border border-border bg-bg-elevated/40 p-3"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-white">{b.label}</span>
                <span className="font-mono text-sm font-semibold tabular-nums text-white">
                  {formatCurrency(b.outstanding, { compact: true })}
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                <span>{formatNumber(b.accounts)} accounts</span>
                <span className={cn(
                  'font-mono',
                  b.rate >= 0.7 ? 'text-status-active' : b.rate >= 0.4 ? 'text-brand-goldlight' : 'text-status-delinquent',
                )}>
                  {(b.rate * 100).toFixed(0)}% collect rate
                </span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-base/80">
                <motion.div
                  key={`${b.key}-${scope.toFixed(3)}`}
                  className="h-full rounded-full bg-gradient-to-r from-brand-golddark to-brand-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${sharePct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.div>
          );
        })}
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
