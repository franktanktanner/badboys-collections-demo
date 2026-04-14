import { motion } from 'framer-motion';
import { MessageSquare, Phone, Search, FileText, Gavel, Scale } from 'lucide-react';

const stages = [
  { range: 'Day 1–30',   title: 'Automated Reminders',        desc: 'SMS + Email reminders with payment portal link. AI prioritizes optimal send times.',                 Icon: MessageSquare, color: 'from-emerald-500/80 to-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  { range: 'Day 31–60',  title: 'AI Phone Outreach',          desc: 'AI calls begin 3x/week. Proposes payment plans based on indemnitor capacity model.',                 Icon: Phone,         color: 'from-yellow-500/80 to-yellow-500',   text: 'text-yellow-400',  border: 'border-yellow-500/30' },
  { range: 'Day 61–90',  title: 'Increased Urgency',          desc: 'Call frequency doubles. Skip trace auto-fires on stale contacts. Urgent messaging copy.',            Icon: Search,        color: 'from-amber-500/80 to-amber-500',     text: 'text-amber-400',   border: 'border-amber-500/30' },
  { range: 'Day 91–120', title: 'Formal Demand',              desc: 'Demand letter generated, queued for legal review. Collateral assessment begins.',                    Icon: FileText,      color: 'from-orange-500/80 to-orange-500',   text: 'text-orange-400',  border: 'border-orange-500/30' },
  { range: 'Day 121–180',title: 'Legal Escalation',           desc: 'Certified letters sent. Credit bureau reporting prep. Final settlement offers.',                   Icon: Gavel,         color: 'from-red-500/80 to-red-500',         text: 'text-red-400',     border: 'border-red-500/30' },
  { range: 'Day 180+',   title: 'Full Legal Action',          desc: 'Civil suit filed. Collections agency referral. Asset search and wage garnishment prep.',            Icon: Scale,         color: 'from-fuchsia-500/80 to-fuchsia-500', text: 'text-fuchsia-400', border: 'border-fuchsia-500/30' },
];

export function EscalationTimeline() {
  return (
    <div className="glass-card p-6">
      <div>
        <h2 className="h-display text-lg">Escalation Workflow</h2>
        <p className="mt-0.5 text-xs text-slate-400">What happens automatically at every stage of delinquency</p>
      </div>

      <div className="relative mt-6">
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-500/40 via-amber-500/40 via-orange-500/40 to-fuchsia-500/40" />
        <ol className="space-y-5">
          {stages.map((s, i) => (
            <motion.li
              key={s.range}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex gap-4"
            >
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${s.border} bg-bg-base`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${s.color}`}>
                  <s.Icon className="h-4 w-4 text-slate-950" />
                </div>
              </div>
              <div className="flex-1 rounded-lg border border-border bg-bg-elevated/40 p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <span className={`text-sm font-semibold ${s.text}`}>{s.title}</span>
                  <span className={`font-mono text-[11px] uppercase tracking-wider ${s.text}`}>{s.range}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </div>
  );
}
