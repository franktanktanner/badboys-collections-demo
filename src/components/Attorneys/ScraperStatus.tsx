import { motion } from 'framer-motion';
import { Database, RefreshCw, Shield } from 'lucide-react';
import { scraperCountiesAll } from '../../data/mockAttorneys';
import { formatNumber } from '../../lib/format';
import { countyFor, isFiltered, type LocationFilter } from '../../lib/filters';

export function ScraperStatus({ location }: { location: LocationFilter }) {
  const county = countyFor(location);
  const counties = isFiltered(location) && county
    ? scraperCountiesAll.filter((c) => c.name === county)
    : scraperCountiesAll;

  const total = counties.reduce((s, c) => s + c.records, 0);
  const added = counties.reduce((s, c) => s + c.added, 0);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-status-active/15">
          <Database className="h-4 w-4 text-status-active" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-surface bg-status-active" />
        </div>
        <div>
          <h2 className="h-display text-lg">Scraper Status</h2>
          <p className="mt-0.5 text-xs text-slate-400">
            {isFiltered(location) ? `Scoped to ${county} County` : 'Running continuously · last sync 3 minutes ago'}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatBox label="Total Records" value={formatNumber(total)} />
        <StatBox label="New Today" value={`+${formatNumber(added)}`} accent />
        <StatBox label="Counties" value={String(counties.length)} />
        <StatBox label="Data Quality" value="96%" accent />
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <span className="label">{isFiltered(location) ? 'County' : 'Counties'}</span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '4s' }} />
            Active
          </span>
        </div>
        <ul className="mt-3 space-y-1.5">
          {counties.map((c, i) => (
            <motion.li
              key={c.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
              className="flex items-center justify-between rounded-md border border-border bg-bg-elevated/40 px-3 py-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-3 w-3 text-brand-gold" />
                <span className="text-slate-200">{c.name} County</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-slate-400">{formatNumber(c.records)}</span>
                <span className="text-status-active">+{c.added}</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatBox({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-bg-elevated/40 p-3">
      <div className="label">{label}</div>
      <div className={`mt-1 font-display text-xl font-semibold tabular-nums ${accent ? 'text-status-active' : 'text-white'}`}>
        {value}
      </div>
    </div>
  );
}
