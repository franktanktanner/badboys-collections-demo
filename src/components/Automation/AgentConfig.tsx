import { motion } from 'framer-motion';
import { useState } from 'react';
import { Phone, MessageSquare, Mail, Search, Gavel, CalendarClock, Building2, Check } from 'lucide-react';
import { cn } from '../../lib/cn';

const features = [
  { key: 'calls',  agent: 'AVA',      Icon: Phone,         title: 'AI Voice Calls',     desc: 'AI agent calls indemnitors with payment reminders, negotiates payment plans, confirms contact info, and logs call outcomes automatically.', stat: '4,284 calls / 30d' },
  { key: 'sms',    agent: 'ECHO',     Icon: MessageSquare, title: 'SMS Sequences',      desc: 'Multi-step text campaigns with payment portal links. Urgency escalates based on days past due. Auto-sends at optimal times.',                stat: '94,281 SMS / 30d' },
  { key: 'email',  agent: 'NOVA',     Icon: Mail,          title: 'Email Nurture',      desc: 'Automated email sequences with balance summaries, payment links, legal notices. Tracks opens and clicks.',                                     stat: '41% open rate' },
  { key: 'skip',   agent: 'SCOUT',    Icon: Search,        title: 'Skip Tracing',       desc: 'Auto-triggers skip trace when contact info goes stale or calls/texts bounce. Pulls new phone, address, and employment data.',                stat: '68% restore rate' },
  { key: 'legal',  agent: 'SENTINEL', Icon: Gavel,         title: 'Legal Escalation',   desc: 'Auto-generates demand letters when accounts exceed configurable thresholds. Queues for legal review before sending.',                        stat: '214 letters queued' },
  { key: 'plan',   agent: 'COMPASS',  Icon: CalendarClock, title: 'Payment Plan AI',    desc: 'Analyzes indemnitor payment history and estimates capacity. Proposes optimized payment plans with highest likelihood of completion.',        stat: '83% completion' },
  { key: 'court',  agent: 'SCRIBE',   Icon: Building2,     title: 'Courthouse Data Sync', desc: 'Pulls public court records to track case status, sentencing, and warrant information automatically.',                                      stat: '6 counties synced' },
];

export function AgentConfig() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(features.map((f) => [f.key, true])),
  );

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="h-display text-lg">Your AI Agent Workforce</h2>
          <p className="mt-0.5 text-xs text-slate-400">Seven AI agents working 24/7 across collections operations</p>
        </div>
        <span className="chip text-status-active">
          <Check className="h-3 w-3" />
          {Object.values(enabled).filter(Boolean).length} of {features.length} active
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        {features.map((f, i) => {
          const on = enabled[f.key];
          return (
            <motion.div
              key={f.key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className={cn(
                'group rounded-lg border p-4 transition-all',
                on ? 'border-brand-gold/25 bg-brand-gold/[0.04]' : 'border-border bg-bg-elevated/40',
              )}
            >
              <div className="mb-2 flex items-center" style={{ gap: '8px' }}>
                <div
                  className="shrink-0"
                  style={{ width: '24px', height: '2px', backgroundColor: '#7A1F1F' }}
                />
                <span
                  className="font-mono font-medium"
                  style={{ color: '#A8A296', fontSize: '11px', letterSpacing: '2px' }}
                >
                  {f.agent}
                </span>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                    on ? 'bg-brand-gold/15 text-brand-goldlight' : 'bg-bg-surface text-slate-500',
                  )}>
                    <f.Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{f.title}</div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{f.desc}</p>
                    <div className="mt-2 font-mono text-[11px] text-brand-gold">{f.stat}</div>
                  </div>
                </div>
                <button
                  role="switch"
                  aria-checked={on}
                  onClick={() => setEnabled({ ...enabled, [f.key]: !on })}
                  className={cn(
                    'relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors',
                    on ? 'bg-brand-gold' : 'bg-bg-raised',
                  )}
                >
                  <motion.span
                    layout
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                    className={cn(
                      'absolute top-0.5 h-4 w-4 rounded-full shadow-sm',
                      on ? 'right-0.5 bg-slate-950' : 'left-0.5 bg-slate-400',
                    )}
                  />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
