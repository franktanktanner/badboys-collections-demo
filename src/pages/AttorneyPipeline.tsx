import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, Scale, Mail, MailCheck, Sparkles, Flame, Building2,
  Database, Gavel, FileSearch, Loader2, ChevronRight, Handshake,
} from 'lucide-react';
import { CountUp } from '../components/shared/CountUp';
import { MiniSparkline } from '../components/shared/MiniChart';
import { cn } from '../lib/cn';

type PipelineStage = 'New Lead' | 'Outreach Sent' | 'Engaged' | 'Warm Response' | 'Active Partner';

interface AttorneyRow {
  id: string;
  name: string;
  firm: string;
  county: string;
  stage: PipelineStage;
  lastTouch: string;
  action: 'Send Follow-Up' | 'View Thread' | 'Mark Hot' | 'Open Brief';
}

interface CompassEvent {
  id: string;
  title: string;
  scope: string;
  time: string;
  kind: 'response' | 'draft' | 'warm' | 'sync' | 'partner' | 'engaged';
}

interface PartnershipWin {
  attorney: string;
  firm: string;
  bonds: number;
  volume: number;
  county: string;
}

type FilterKey = 'all' | 'new' | 'engaged' | 'warm' | 'converted';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'new',       label: 'New leads' },
  { key: 'engaged',   label: 'In conversation' },
  { key: 'warm',      label: 'Warm responses' },
  { key: 'converted', label: 'Converted' },
];

const STAGE_TO_FILTER: Record<PipelineStage, FilterKey> = {
  'New Lead':       'new',
  'Outreach Sent':  'engaged',
  'Engaged':        'engaged',
  'Warm Response':  'warm',
  'Active Partner': 'converted',
};

const STAGE_STYLES: Record<PipelineStage, { dot: string; bg: string; text: string; border: string }> = {
  'New Lead':       { dot: 'bg-slate-400',         bg: 'bg-slate-400/10',         text: 'text-slate-300',         border: 'border-slate-400/25' },
  'Outreach Sent':  { dot: 'bg-status-plan',       bg: 'bg-status-plan/10',       text: 'text-status-plan',       border: 'border-status-plan/25' },
  'Engaged':        { dot: 'bg-fuchsia-400',       bg: 'bg-fuchsia-500/10',       text: 'text-fuchsia-300',       border: 'border-fuchsia-500/25' },
  'Warm Response':  { dot: 'bg-brand-gold',        bg: 'bg-brand-gold/10',        text: 'text-brand-goldlight',   border: 'border-brand-gold/30' },
  'Active Partner': { dot: 'bg-status-active',     bg: 'bg-status-active/10',     text: 'text-status-active',     border: 'border-status-active/25' },
};

const ATTORNEYS: AttorneyRow[] = [
  { id: 'att-01', name: 'Daniel Cho',           firm: 'Cho & Associates',                   county: 'Los Angeles',     stage: 'Active Partner', lastTouch: '2h ago',     action: 'View Thread'    },
  { id: 'att-02', name: 'Priya Ramanathan',     firm: 'Ramanathan Defense LLP',             county: 'Santa Clara',     stage: 'Active Partner', lastTouch: 'yesterday',  action: 'View Thread'    },
  { id: 'att-03', name: 'Sarah Chen',           firm: 'Chen Criminal Defense',              county: 'Orange',          stage: 'Warm Response',  lastTouch: '15m ago',    action: 'Mark Hot'       },
  { id: 'att-04', name: 'Marcus Williams',      firm: 'Williams Trial Group',               county: 'San Diego',       stage: 'Active Partner', lastTouch: '3 days ago', action: 'View Thread'    },
  { id: 'att-05', name: 'Aisha Patel',          firm: 'Patel Law Office',                   county: 'Alameda',         stage: 'Engaged',        lastTouch: '3h ago',     action: 'Send Follow-Up' },
  { id: 'att-06', name: 'James Rodriguez',      firm: 'Rodriguez & Sons',                   county: 'Riverside',       stage: 'Engaged',        lastTouch: '6h ago',     action: 'Send Follow-Up' },
  { id: 'att-07', name: 'Rachel Goldstein',     firm: 'Goldstein Criminal Law',             county: 'San Mateo',       stage: 'Warm Response',  lastTouch: '4h ago',     action: 'Mark Hot'       },
  { id: 'att-08', name: 'Michael O\u2019Brien', firm: 'O\u2019Brien Defense',               county: 'San Francisco',   stage: 'Outreach Sent',  lastTouch: 'yesterday',  action: 'Send Follow-Up' },
  { id: 'att-09', name: 'Sophia Nakamura',      firm: 'Nakamura Law Group',                 county: 'Los Angeles',     stage: 'Outreach Sent',  lastTouch: '2 days ago', action: 'Send Follow-Up' },
  { id: 'att-10', name: 'Carlos Vasquez',       firm: 'Vasquez & Partners',                 county: 'Los Angeles',     stage: 'Outreach Sent',  lastTouch: '2 days ago', action: 'Send Follow-Up' },
  { id: 'att-11', name: 'Mei-Lin Wong',         firm: 'Wong Criminal Defense',              county: 'Santa Clara',     stage: 'Engaged',        lastTouch: '5h ago',     action: 'Send Follow-Up' },
  { id: 'att-12', name: 'Ahmed Khalil',         firm: 'Khalil Law',                         county: 'San Bernardino',  stage: 'Outreach Sent',  lastTouch: '3 days ago', action: 'Send Follow-Up' },
  { id: 'att-13', name: 'Vivian Park',          firm: 'Park Defense Firm',                  county: 'Orange',          stage: 'Outreach Sent',  lastTouch: '4 days ago', action: 'Send Follow-Up' },
  { id: 'att-14', name: 'Tyrone Jackson',       firm: 'Jackson Legal Group',                county: 'Alameda',         stage: 'New Lead',       lastTouch: '1h ago',     action: 'Open Brief'     },
  { id: 'att-15', name: 'David Hernandez',      firm: 'Hernandez Bail Defense',             county: 'Riverside',       stage: 'New Lead',       lastTouch: '40m ago',    action: 'Open Brief'     },
];

const COMPASS_EVENTS: CompassEvent[] = [
  { id: 'c1', title: 'Daniel Cho responded to Q2 outreach',     scope: 'Los Angeles',    time: '2m ago',  kind: 'response' },
  { id: 'c2', title: 'Drafted 14 new outreach emails',          scope: 'All counties',   time: '8m ago',  kind: 'draft'    },
  { id: 'c3', title: 'Sarah Chen marked as Warm',               scope: 'Orange County',  time: '15m ago', kind: 'warm'     },
  { id: 'c4', title: '847 attorneys synced from State Bar',     scope: 'Statewide',      time: '1h ago',  kind: 'sync'     },
  { id: 'c5', title: 'Marcus Williams · partnership confirmed', scope: 'San Diego',      time: '2h ago',  kind: 'partner'  },
  { id: 'c6', title: 'Aisha Patel · email opened 3x',           scope: 'Alameda County', time: '3h ago',  kind: 'engaged'  },
];

const COMPASS_ICONS: Record<CompassEvent['kind'], { Icon: typeof Mail; bg: string; text: string }> = {
  response: { Icon: MailCheck,  bg: 'bg-status-active/10', text: 'text-status-active'   },
  draft:    { Icon: Sparkles,   bg: 'bg-brand-gold/10',    text: 'text-brand-goldlight' },
  warm:     { Icon: Flame,      bg: 'bg-brand-gold/10',    text: 'text-brand-gold'      },
  sync:     { Icon: Database,   bg: 'bg-cyan-500/10',      text: 'text-cyan-400'        },
  partner:  { Icon: Handshake,  bg: 'bg-status-active/10', text: 'text-status-active'   },
  engaged:  { Icon: Mail,       bg: 'bg-fuchsia-500/10',   text: 'text-fuchsia-400'     },
};

const PARTNERSHIP_WINS: PartnershipWin[] = [
  { attorney: 'Daniel Cho',       firm: 'Cho & Associates',         bonds: 12, volume: 380_000, county: 'Los Angeles' },
  { attorney: 'Priya Ramanathan', firm: 'Ramanathan Defense LLP',   bonds: 8,  volume: 245_000, county: 'Santa Clara' },
  { attorney: 'Marcus Williams',  firm: 'Williams Trial Group',     bonds: 5,  volume: 128_000, county: 'San Diego'   },
];

const KPI_TREND_INDEXED   = [{ value: 13420 }, { value: 13680 }, { value: 13910 }, { value: 14180 }, { value: 14410 }, { value: 14600 }, { value: 14847 }];
const KPI_TREND_OUTREACH  = [{ value: 6400 },  { value: 7100 },  { value: 7620 },  { value: 8050 },  { value: 8530 },  { value: 8840 },  { value: 9147 }];
const KPI_TREND_ACTIVE    = [{ value: 17 },    { value: 18 },    { value: 19 },    { value: 20 },    { value: 21 },    { value: 22 },    { value: 23 }];
const KPI_TREND_HIGHVALUE = [{ value: 54 },    { value: 61 },    { value: 66 },    { value: 70 },    { value: 75 },    { value: 79 },    { value: 84 }];

export function AttorneyPipeline() {
  const [filter, setFilter] = useState<FilterKey>('all');

  const filtered = useMemo(
    () => filter === 'all' ? ATTORNEYS : ATTORNEYS.filter((a) => STAGE_TO_FILTER[a.stage] === filter),
    [filter],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="h-display text-xl">Attorney Pipeline</h1>
          <p className="mt-0.5 text-xs text-slate-400">
            Statewide attorney acquisition · powered by <span className="font-medium text-brand-goldlight">Compass</span> agent
          </p>
        </div>
        <span className="chip text-brand-goldlight">
          <Scale className="h-3 w-3 text-brand-gold" />
          58 CA counties · live
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <PipelineKpiCard
          label="Attorneys Indexed"
          value={14847}
          sub="across 58 CA counties"
          trendText="+247 this week"
          trendTone="green"
          accent="gold"
          chartData={KPI_TREND_INDEXED}
          delay={0}
        />
        <PipelineKpiCard
          label="Outreach Sent"
          value={9147}
          sub="Compass-drafted last 30 days"
          trendText="42.3% reply rate"
          trendTone="green"
          accent="blue"
          chartData={KPI_TREND_OUTREACH}
          delay={0.08}
        />
        <PipelineKpiCard
          label="Active Partnerships"
          value={23}
          sub="$245K in referral volume / Q2"
          trendText="+6 this quarter"
          trendTone="green"
          accent="green"
          chartData={KPI_TREND_ACTIVE}
          delay={0.16}
        />
        <PipelineKpiCard
          label="High-Value Prospects"
          value={84}
          sub="flagged for principal review"
          trendText="+12 this week"
          trendTone="gold"
          accent="gold"
          chartData={KPI_TREND_HIGHVALUE}
          delay={0.24}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <PipelineTable rows={filtered} filter={filter} onFilter={setFilter} />
        </div>
        <div className="space-y-4 xl:col-span-2">
          <CompassActivityCard />
          <ScraperStatusCard />
        </div>
      </div>

      <PartnershipWinsCard wins={PARTNERSHIP_WINS} />
    </motion.div>
  );
}

interface PipelineKpiProps {
  label: string;
  value: number;
  sub: string;
  trendText: string;
  trendTone: 'green' | 'gold';
  accent: 'gold' | 'green' | 'blue';
  chartData: { value: number }[];
  delay: number;
}

const KPI_ACCENT_GRADIENTS: Record<PipelineKpiProps['accent'], string> = {
  gold:  'from-brand-gold/10 via-transparent to-transparent',
  green: 'from-emerald-500/10 via-transparent to-transparent',
  blue:  'from-blue-500/10 via-transparent to-transparent',
};

const KPI_ACCENT_COLORS: Record<PipelineKpiProps['accent'], string> = {
  gold:  '#EAB308',
  green: '#22C55E',
  blue:  '#3B82F6',
};

const TREND_TONE_CLASS: Record<PipelineKpiProps['trendTone'], string> = {
  green: 'text-status-active border-status-active/30 bg-status-active/5',
  gold:  'text-brand-goldlight border-brand-gold/30 bg-brand-gold/5',
};

function PipelineKpiCard({ label, value, sub, trendText, trendTone, accent, chartData, delay }: PipelineKpiProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card glass-card-hover overflow-hidden p-5"
    >
      <div className={cn('pointer-events-none absolute inset-0 bg-gradient-to-br', KPI_ACCENT_GRADIENTS[accent])} />

      <div className="relative flex items-start justify-between gap-2">
        <div className="label">{label}</div>
        <div className={cn(
          'flex items-center gap-0.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium',
          TREND_TONE_CLASS[trendTone],
        )}>
          <ArrowUpRight className="h-3 w-3" />
          {trendText}
        </div>
      </div>

      <div className="relative mt-3 font-display text-3xl font-semibold tracking-tight text-white lg:text-[32px]">
        <CountUp value={value} compact={value > 10000} />
      </div>

      <div className="relative mt-1 text-xs text-slate-400">{sub}</div>

      <div className="relative -mx-2 mt-3">
        <MiniSparkline data={chartData} color={KPI_ACCENT_COLORS[accent]} height={48} />
      </div>
    </motion.div>
  );
}

function PipelineTable({
  rows,
  filter,
  onFilter,
}: {
  rows: AttorneyRow[];
  filter: FilterKey;
  onFilter: (k: FilterKey) => void;
}) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
        <div>
          <h2 className="h-display text-lg">Pipeline · 14,847 attorneys</h2>
          <p className="mt-0.5 text-xs text-slate-400">Compass-tracked outreach across criminal defense bar</p>
        </div>
        <span className="chip text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
          {rows.length} shown
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 border-b border-border px-6 py-3">
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <button
              key={f.key}
              onClick={() => onFilter(f.key)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition-all',
                active
                  ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-goldlight'
                  : 'border-border bg-bg-elevated/40 text-slate-400 hover:border-border-strong hover:text-white',
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-surface/90">
            <tr className="border-b border-border">
              <Th>Attorney</Th>
              <Th>Firm</Th>
              <Th>County</Th>
              <Th>Stage</Th>
              <Th>Last touch</Th>
              <Th right>Compass action</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const stage = STAGE_STYLES[row.stage];
              return (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(i * 0.015, 0.25) }}
                  className="border-b border-border-subtle hover:bg-bg-elevated/40"
                >
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-bg-elevated/60 text-[11px] font-semibold text-slate-300">
                        {initials(row.name)}
                      </div>
                      <span className="font-medium text-white">{row.name}</span>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building2 className="h-3.5 w-3.5 text-slate-500" />
                      {row.firm}
                    </div>
                  </Td>
                  <Td><span className="text-slate-400">{row.county}</span></Td>
                  <Td>
                    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium', stage.bg, stage.text, stage.border)}>
                      <span className={cn('h-1.5 w-1.5 rounded-full', stage.dot)} />
                      {row.stage}
                    </span>
                  </Td>
                  <Td><span className="font-mono text-xs text-slate-400">{row.lastTouch}</span></Td>
                  <Td right>
                    <button className="group inline-flex items-center gap-1 text-xs font-medium text-brand-goldlight transition-colors hover:text-brand-gold">
                      {row.action}
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </Td>
                </motion.tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-sm text-slate-500">
                  No attorneys match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompassActivityCard() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Compass Activity</h2>
          <p className="mt-0.5 text-xs text-slate-400">AI Attorney Outreach Agent</p>
        </div>
        <LivePill />
      </div>

      <ul className="mt-5 space-y-3">
        {COMPASS_EVENTS.map((ev, i) => {
          const style = COMPASS_ICONS[ev.kind];
          const Icon = style.Icon;
          return (
            <motion.li
              key={ev.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border', style.bg)}>
                <Icon className={cn('h-3.5 w-3.5', style.text)} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-sm font-medium text-white">{ev.title}</p>
                  <span className="shrink-0 font-mono text-[11px] text-slate-500">{ev.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{ev.scope}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

function ScraperStatusCard() {
  const sources = [
    { Icon: Gavel,      label: 'California State Bar', detail: 'synced 14m ago',           status: 'ACTIVE' as const  },
    { Icon: FileSearch, label: 'PACER Court Records',  detail: 'synced 1h ago',            status: 'ACTIVE' as const  },
    { Icon: Database,   label: 'County Dockets',       detail: 'syncing 3 counties...',    status: 'RUNNING' as const },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Scraper Status</h2>
          <p className="mt-0.5 text-xs text-slate-400">Data sources feeding the pipeline</p>
        </div>
        <span className="chip text-slate-300">
          <span className="h-1.5 w-1.5 rounded-full bg-status-active" />
          3 sources
        </span>
      </div>

      <ul className="mt-5 space-y-2.5">
        {sources.map((src, i) => {
          const Icon = src.Icon;
          const isRunning = src.status === 'RUNNING';
          return (
            <motion.li
              key={src.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-lg border border-border bg-bg-elevated/40 px-3.5 py-3"
            >
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border',
                isRunning ? 'bg-brand-gold/10' : 'bg-status-active/10',
              )}>
                {isRunning
                  ? <Loader2 className="h-4 w-4 animate-spin text-brand-gold" />
                  : <Icon className="h-4 w-4 text-status-active" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white">{src.label}</div>
                <div className="mt-0.5 text-[11px] text-slate-500">{src.detail}</div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="relative inline-flex h-2 w-2 items-center justify-center">
                  {isRunning && (
                    <motion.span
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-brand-gold"
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 2.5, opacity: 0 }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <span className={cn(
                    'relative h-2 w-2 rounded-full',
                    isRunning
                      ? 'bg-brand-gold shadow-[0_0_8px_rgba(234,179,8,0.7)]'
                      : 'bg-status-active shadow-[0_0_8px_rgba(34,197,94,0.6)]',
                  )} />
                </span>
                <span className={cn(
                  'font-mono text-[10px] font-semibold tracking-wider',
                  isRunning ? 'text-brand-goldlight' : 'text-status-active',
                )}>
                  {src.status}
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-[11px] text-slate-500">
        <span>Next full sweep</span>
        <span className="font-mono text-slate-300">in 47 minutes</span>
      </div>
    </div>
  );
}

function PartnershipWinsCard({ wins }: { wins: PartnershipWin[] }) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="h-display text-lg">Recent Partnership Wins</h2>
          <p className="mt-0.5 text-xs text-slate-400">Attorneys driving Q2 referral volume</p>
        </div>
        <span className="chip text-brand-goldlight">
          <Handshake className="h-3 w-3 text-brand-gold" />
          $753K combined
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {wins.map((win, i) => (
          <motion.div
            key={win.attorney}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="relative overflow-hidden rounded-xl border border-border bg-bg-elevated/40 p-5 transition-all hover:border-brand-gold/30 hover:bg-bg-elevated/70"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-gold/8 via-transparent to-transparent" />

            <div className="relative flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-gold/30 bg-brand-gold/10 text-sm font-semibold text-brand-goldlight">
                  {initials(win.attorney)}
                </div>
                <div className="min-w-0">
                  <div className="font-display text-lg font-semibold leading-tight text-white">{win.attorney}</div>
                  <div className="mt-0.5 text-xs text-slate-400">{win.firm}</div>
                </div>
              </div>
            </div>

            <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-border-subtle pt-4">
              <div>
                <div className="label">Bonds · 30d</div>
                <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-white">
                  <CountUp value={win.bonds} />
                </div>
              </div>
              <div>
                <div className="label">Volume</div>
                <div className="mt-1 font-display text-2xl font-semibold tabular-nums text-status-active">
                  <CountUp value={win.volume} currency compact />
                </div>
              </div>
            </div>

            <div className="relative mt-4 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">{win.county}</span>
              <span className="font-mono text-brand-goldlight/80">Sourced via Compass · Q1 2026</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function LivePill() {
  const reduced = usePrefersReducedMotion();
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated/40 px-3 py-1">
      <span className="relative inline-flex h-2 w-2 items-center justify-center">
        {!reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-0 rounded-full bg-status-active"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
        )}
        <span className="relative h-2 w-2 rounded-full bg-status-active shadow-[0_0_12px_rgba(34,197,94,0.7)]" />
      </span>
      <span className="text-xs font-semibold tracking-wide text-white">Live</span>
    </span>
  );
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={cn('label whitespace-nowrap px-4 py-3', right ? 'text-right' : 'text-left')}>{children}</th>;
}

function Td({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <td className={cn('whitespace-nowrap px-4 py-3', right && 'text-right')}>{children}</td>;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
