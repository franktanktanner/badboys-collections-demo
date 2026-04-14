import { motion } from 'framer-motion';
import { Scale, Mail, MessageSquareReply, Handshake } from 'lucide-react';
import { CountUp } from '../components/shared/CountUp';
import { AttorneyTable } from '../components/Attorneys/AttorneyTable';
import { ScraperStatus } from '../components/Attorneys/ScraperStatus';
import { mockAttorneys } from '../data/mockAttorneys';

export function AttorneyPipeline() {
  const partners = mockAttorneys.filter((a) => a.status === 'Partner');
  const partnerRevenue = partners.reduce((s, a) => s + a.revenue, 0);

  const kpis = [
    { label: 'Attorneys Scraped', value: 14_382, sub: 'Criminal Defense, California',    Icon: Scale,              accent: 'text-brand-gold',    bg: 'bg-brand-gold/10' },
    { label: 'Emails Sent',        value: 9_147, sub: '34% open · 11% reply',             Icon: Mail,               accent: 'text-status-plan',   bg: 'bg-status-plan/10' },
    { label: 'Responses',          value: 1_012, sub: '11.1% reply rate',                 Icon: MessageSquareReply, accent: 'text-fuchsia-400',    bg: 'bg-fuchsia-500/10' },
    { label: 'Active Partners',    value: partners.length, sub: `${(partnerRevenue/1000).toFixed(0)}K in referral revenue`, Icon: Handshake, accent: 'text-status-active', bg: 'bg-status-active/10', currency: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
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
          <AttorneyTable />
        </div>
        <div>
          <ScraperStatus />
        </div>
      </div>
    </motion.div>
  );
}
