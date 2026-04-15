import { motion } from 'framer-motion';
import { MapPin, X } from 'lucide-react';
import { KPICard } from '../components/Dashboard/KPICard';
import { RecoveryPipeline } from '../components/Dashboard/RecoveryPipeline';
import { OfficeGrid } from '../components/Dashboard/OfficeGrid';
import { ActivityFeed } from '../components/Dashboard/ActivityFeed';
import { AutomationStats } from '../components/Dashboard/AutomationStats';
import {
  outstandingTrend, kpiTrend, aiActionsTrend, recoveredTrend,
} from '../data/mockActivity';
import { getKPIs, isFiltered, type LocationFilter } from '../lib/filters';

export function CommandCenter({ location }: { location: LocationFilter }) {
  const kpis = getKPIs(location);
  const filtered = isFiltered(location);

  return (
    <div className="space-y-6">
      {filtered && <LocationBanner location={location} />}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Total Outstanding"
          value={kpis.outstanding}
          format="currency-compact"
          sub={`across ${kpis.accounts.toLocaleString()} accounts`}
          trendValue={kpis.outstandingTrend}
          trendDirection={filtered ? (kpis.outstandingTrend > 0 ? 'up' : 'down') : 'up'}
          trendGood="down"
          chartData={outstandingTrend}
          accent="gold"
          delay={0}
        />
        <KPICard
          label="Collection Rate"
          value={kpis.rate}
          format="percent"
          sub={`${kpis.rate.toFixed(1)}% vs ${kpis.ratePrev}% before AI`}
          trendValue={kpis.rateTrend}
          trendDirection="up"
          trendGood="up"
          chartData={kpiTrend}
          accent="green"
          delay={0.08}
        />
        <KPICard
          label="AI Actions Today"
          value={kpis.aiActions}
          format="number"
          sub={`${kpis.paymentsTriggered} payments triggered`}
          trendValue={kpis.aiActionsTrend}
          trendDirection="up"
          trendGood="up"
          chartData={aiActionsTrend}
          accent="blue"
          delay={0.16}
        />
        <KPICard
          label="Recovered This Month"
          value={kpis.recovered}
          format="currency-compact"
          sub={`vs ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 0 }).format(kpis.recoveredPrev)} last month`}
          trendValue={kpis.recoveredTrend}
          trendDirection="up"
          trendGood="up"
          chartData={recoveredTrend}
          accent="gold"
          delay={0.24}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecoveryPipeline location={location} />
        </div>
        <div>
          <ActivityFeed location={location} />
        </div>
        <div className="xl:col-span-3">
          <OfficeGrid location={location} />
        </div>
      </div>

      <AutomationStats location={location} />
    </div>
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
      <span className="text-slate-200">Viewing data for</span>
      <span className="font-semibold text-brand-goldlight">{location}</span>
      <span className="text-slate-500">office only</span>
      <X className="ml-auto h-3.5 w-3.5 text-slate-500" />
    </motion.div>
  );
}
