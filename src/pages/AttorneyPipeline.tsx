import { motion } from 'framer-motion';
import { Scale, Mail, MessageSquareReply, Handshake, MapPin } from 'lucide-react';
import { CountUp } from '../components/shared/CountUp';
import { AttorneyTable } from '../components/Attorneys/AttorneyTable';
import { ScraperStatus } from '../components/Attorneys/ScraperStatus';
import { mockAttorneys } from '../data/mockAttorneys';
import { isFiltered, shareOf, type LocationFilter } from '../lib/filters';

export function AttorneyPipeline({ location }: { location: LocationFilter }) {
  const scoped = isFiltered(location)
    ? mockAttorneys.filter((a) => a.office === location)
    : mockAttorneys;
  const partners = scoped.filter((a) => a.status === 'Partner');
  const partnerRevenue = partners.reduce((s, a) => s + a.revenue, 0);

  const share = shareOf(location);
  const scrapedBase = 14_382;
  const emailsBase = 9_147;
  const responsesBase = 1_012;
  const scraped = isFiltered(location) ? Math.round(scrapedBase * share * 1.6) : scrapedBase;
  const emails = isFiltered(location) ? Math.round(emailsBase * share * 1.4) : emailsBase;
  const responses = isFiltered(location) ? Math.round(responsesBase * share * 1.4) : responsesBase;

  const kpis = [
    { label: 'Attorneys Scraped', value: scraped,            sub: isFiltered(location) ? `${location} region` : 'Criminal Defense, California',             Icon: Scale,              accent: 'text-brand-gold',    bg: 'bg-brand-gold/10' },
    { label: 'Emails Sent',        value: emails,            sub: '34% open · 11% reply',                                                                    Icon: Mail,               accent: 'text-status-plan',   bg: 'bg-status-plan/10' },
    { label: 'Responses',          value: responses,         sub: '11.1% reply rate',                                                                         Icon: MessageSquareReply, accent: 'text-fuchsia-400',    bg: 'bg-fuchsia-500/10' },
    { label: 'Active Partners',    value: partners.length,   sub: partnerRevenue > 0 ? `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 0 }).format(partnerRevenue)} referral revenue` : 'No partners yet', Icon: Handshake, accent: 'text-status-active', bg: 'bg-status-active/10' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      {isFiltered(location) && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-lg border border-brand-gold/30 bg-brand-gold/10 px-4 py-2.5 text-sm"
        >
          <MapPin className="h-4 w-4 text-brand-gold" />
          <span className="text-slate-200">Attorney pipeline scoped to</span>
          <span className="font-semibold text-brand-goldlight">{location}</span>
          <span className="text-slate-500">· {scoped.length} attorneys</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(({ label, value, sub, Icon, accent, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="glass-card glass-card-hover p-5"
          >
            <div className="flex items-start justify-between">
              <div className="label">{label}</div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
                <Icon className={`h-4 w-4 ${accent}`} />
              </div>
            </div>
            <div className="mt-3 font-display text-3xl font-semibold text-white">
              <CountUp value={value} compact={value > 10000} />
            </div>
            <div className="mt-1 text-xs text-slate-400">{sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AttorneyTable location={location} />
        </div>
        <div>
          <ScraperStatus location={location} />
        </div>
      </div>
    </motion.div>
  );
}
