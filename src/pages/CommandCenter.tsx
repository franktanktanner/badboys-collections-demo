import { KPICard } from '../components/Dashboard/KPICard';
import { RecoveryPipeline } from '../components/Dashboard/RecoveryPipeline';
import { OfficeGrid } from '../components/Dashboard/OfficeGrid';
import { ActivityFeed } from '../components/Dashboard/ActivityFeed';
import { AutomationStats } from '../components/Dashboard/AutomationStats';
import {
  outstandingTrend, kpiTrend, aiActionsTrend, recoveredTrend,
} from '../data/mockActivity';

export function CommandCenter() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard
          label="Total Outstanding"
          value={135_000_000}
          format="currency-compact"
          sub="across 4,247 accounts"
          trendValue={2.1}
          trendDirection="up"
          trendGood="down"
          chartData={outstandingTrend}
          accent="gold"
          delay={0}
        />
        <KPICard
          label="Collection Rate"
          value={8.7}
          format="percent"
          sub="8.7% vs 1.2% before AI"
          trendValue={625.0}
          trendDirection="up"
          trendGood="up"
          chartData={kpiTrend}
          accent="green"
          delay={0.08}
        />
        <KPICard
          label="AI Actions Today"
          value={1847}
          format="number"
          sub="94 payments triggered"
          trendValue={18.2}
          trendDirection="up"
          trendGood="up"
          chartData={aiActionsTrend}
          accent="blue"
          delay={0.16}
        />
        <KPICard
          label="Recovered This Month"
          value={847_200}
          format="currency-compact"
          sub="vs $612K last month"
          trendValue={38.4}
          trendDirection="up"
          trendGood="up"
          chartData={recoveredTrend}
          accent="gold"
          delay={0.24}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecoveryPipeline />
        </div>
        <div className="xl:row-span-2">
          <ActivityFeed />
        </div>
        <div className="xl:col-span-2">
          <OfficeGrid />
        </div>
      </div>

      <AutomationStats />
    </div>
  );
}
