import { motion } from 'framer-motion';
import { Phone, Bot, User, CheckCircle2, Clock, DollarSign, CalendarClock } from 'lucide-react';
import { callTranscript, callSummary } from '../../data/mockTranscripts';
import { formatCurrency } from '../../lib/format';

export function CallTranscript() {
  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-plan/15">
            <Phone className="h-4 w-4 text-status-plan" />
          </div>
          <div>
            <h2 className="h-display text-lg">AI Call Transcript · Live Preview</h2>
            <p className="mt-0.5 text-xs text-slate-400">Ava · Bond BB-2024-1040 · Rosa Reyes (indemnitor)</p>
          </div>
        </div>
        <span className="chip text-status-active">
          <CheckCircle2 className="h-3 w-3" />
          {callSummary.outcome}
        </span>
      </div>

      {/* Summary row */}
      <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-border bg-bg-elevated/40 p-4 sm:grid-cols-4">
        <SummaryItem Icon={Clock}         label="Duration"  value={callSummary.duration} />
        <SummaryItem Icon={DollarSign}    label="Recovered" value={formatCurrency(callSummary.recovered)} accent />
        <SummaryItem Icon={CalendarClock} label="Plan"      value={callSummary.planTerms} />
        <SummaryItem Icon={CheckCircle2}  label="Sentiment" value={callSummary.sentiment} />
      </div>

      {/* Transcript */}
      <div className="mt-5 space-y-3">
        {callTranscript.map((turn, i) => {
          const isAI = turn.speaker === 'AI';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                isAI ? 'border-brand-gold/30 bg-brand-gold/10 text-brand-gold' : 'border-border bg-bg-elevated text-slate-300'
              }`}>
                {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </div>
              <div className={`max-w-[78%] rounded-2xl border px-4 py-3 ${
                isAI
                  ? 'rounded-tl-md border-brand-gold/20 bg-brand-gold/[0.04]'
                  : 'rounded-tr-md border-border bg-bg-elevated/60'
              }`}>
                <div className="mb-1 flex items-baseline gap-2">
                  <span className={`text-xs font-semibold ${isAI ? 'text-brand-goldlight' : 'text-slate-200'}`}>
                    {isAI ? 'Ava (AI Agent)' : 'Rosa Reyes'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{turn.timestamp}</span>
                </div>
                <p className="text-sm leading-relaxed text-slate-200">{turn.text}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryItem({ Icon, label, value, accent }: { Icon: typeof Phone; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-surface">
        <Icon className={`h-3.5 w-3.5 ${accent ? 'text-status-active' : 'text-brand-gold'}`} />
      </div>
      <div className="min-w-0">
        <div className="label">{label}</div>
        <div className={`truncate text-sm font-medium ${accent ? 'text-status-active' : 'text-white'}`}>{value}</div>
      </div>
    </div>
  );
}
