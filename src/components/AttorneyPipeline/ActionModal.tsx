import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, Flame, Send, MessageSquare, Loader2, Lock, CheckCircle, Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/cn';

export type ActionModalKind = 'thread' | 'hot' | 'follow_up' | null;

interface BaseProps {
  attorneyName: string;
  attorneyFirm: string;
  attorneyCounty: string;
  onClose: () => void;
}

function BaseModal({
  isOpen,
  onClose,
  eyebrow,
  heading,
  icon: Icon,
  iconTone,
  children,
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  eyebrow: string;
  heading: string;
  icon: typeof MessageSquare;
  iconTone: 'gold' | 'red' | 'green';
  children: ReactNode;
  footer: ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  const iconStyle = {
    gold:  'border-brand-gold/30 bg-brand-gold/10 text-brand-gold',
    red:   'border-brand-red/40 bg-brand-red/10 text-brand-redlight',
    green: 'border-status-active/30 bg-status-active/10 text-status-active',
  }[iconTone];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="pointer-events-none fixed inset-0 z-[101] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-[560px] overflow-hidden rounded-xl border border-border bg-bg-surface shadow-card"
              role="dialog"
              aria-modal="true"
              aria-label={heading}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 border-b border-border bg-bg-surface px-5 py-4">
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border', iconStyle)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="label text-brand-goldlight/80">{eyebrow}</div>
                    <h2 className="mt-1 h-display text-base">{heading}</h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="cursor-pointer text-slate-500 transition-colors hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto bg-bg-surface px-5 py-5">{children}</div>
              <div className="flex items-center justify-end gap-3 border-t border-border bg-bg-elevated px-5 py-3">
                {footer}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export function ViewThreadModal({
  isOpen,
  attorneyName,
  attorneyFirm,
  attorneyCounty,
  onClose,
  onReply,
}: BaseProps & { isOpen: boolean; onReply: () => void }) {
  const firstName = attorneyName.split(' ')[0];
  const lastName = attorneyName.split(' ').slice(-1)[0];

  const messages = [
    {
      direction: 'out' as const,
      sender: 'Compass on behalf of Jeff Stanley',
      meta: 'Q2 Partnership Outreach',
      time: '3 days ago · 9:14 AM',
      body: `Hi ${firstName} — I'm reaching out from Bad Boys Bail Bonds about a partnership that's been working well for ${attorneyCounty} criminal defense attorneys. We handle bond posting and indemnitor recovery so your clients stay focused on their case, not collections. Open to a 15-minute call this week?`,
    },
    {
      direction: 'in' as const,
      sender: `${attorneyName} · ${attorneyFirm}`,
      meta: 'Replied',
      time: '2 days ago · 4:42 PM',
      body: `Jeff — appreciate the note. We've had three indemnitor situations go sideways this quarter and your recovery numbers caught my eye. Thursday afternoon works.`,
    },
    {
      direction: 'out' as const,
      sender: 'Compass on behalf of Jeff Stanley',
      meta: 'Meeting confirmed',
      time: 'yesterday · 11:08 AM',
      body: `Locked in Thursday 2:30 PM. Calendar invite sent. I'll bring the partnership terms and a few ${attorneyCounty} reference attorneys.`,
    },
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Compass Thread · Encrypted"
      heading={`${attorneyName} · Outreach History`}
      icon={MessageSquare}
      iconTone="gold"
      footer={
        <>
          <button onClick={onClose} className="cursor-pointer text-xs text-slate-400 hover:text-white">
            Close
          </button>
          <button onClick={onReply} className="btn-primary text-xs">
            <Sparkles className="h-3.5 w-3.5" />
            REPLY VIA COMPASS
          </button>
        </>
      }
    >
      <div className="space-y-3">
        {messages.map((msg, i) => {
          const isOut = msg.direction === 'out';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.06 }}
              className={cn(
                'rounded-lg border bg-bg-elevated/40 p-4 border-l-2',
                isOut
                  ? 'border-border border-l-brand-gold'
                  : 'border-border border-l-amber-100/60',
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="min-w-0">
                  <div className={cn(
                    'truncate text-xs font-semibold',
                    isOut ? 'text-brand-goldlight' : 'text-amber-100',
                  )}>
                    {msg.sender}
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{msg.meta}</div>
                </div>
                <span className="shrink-0 font-mono text-[10px] text-slate-500">{msg.time}</span>
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-slate-200">{msg.body}</p>
            </motion.div>
          );
        })}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-[10px] text-slate-500">
          <Lock className="h-3 w-3" />
          <span className="font-mono uppercase tracking-wider">end-to-end encrypted · stored in Compass vault</span>
        </div>
        <p className="text-center text-[10px] text-slate-600">{lastName} thread · {attorneyCounty}</p>
      </div>
    </BaseModal>
  );
}

const HOT_OPTIONS = [
  { id: 'call',     label: 'Schedule call within 24 hours',  hint: 'Compass books a 15-min slot on your calendar' },
  { id: 'followup', label: 'Send personalized follow-up today', hint: 'Compass drafts a hand-tuned message in Jeff\u2019s voice' },
  { id: 'review',   label: 'Add to next quarterly review',   hint: 'Surface in your Q3 principal briefing' },
] as const;

type HotOptionId = typeof HOT_OPTIONS[number]['id'];

export function MarkHotModal({
  isOpen,
  attorneyName,
  attorneyFirm,
  attorneyCounty,
  onClose,
  onConfirm,
}: BaseProps & { isOpen: boolean; onConfirm: () => void }) {
  const [selected, setSelected] = useState<HotOptionId>('call');
  const [context, setContext] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSelected('call');
      setContext('');
    }
  }, [isOpen]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      eyebrow="Priority Upgrade"
      heading={`Mark ${attorneyName} as Hot Lead`}
      icon={Flame}
      iconTone="red"
      footer={
        <>
          <button onClick={onClose} className="cursor-pointer text-xs text-slate-400 hover:text-white">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-primary text-xs">
            <Flame className="h-3.5 w-3.5" />
            CONFIRM HOT MARKER
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm leading-relaxed text-slate-300">
          Marking an attorney as Hot signals <span className="text-brand-goldlight">Compass</span> to prioritize follow-up
          cadence and surface them in your daily principal briefing.
        </p>

        <div className="space-y-2">
          {HOT_OPTIONS.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className={cn(
                  'w-full cursor-pointer rounded-lg border bg-bg-elevated/40 p-3.5 text-left transition-all',
                  active
                    ? 'border-brand-gold/50 bg-brand-gold/5 ring-1 ring-brand-gold/30'
                    : 'border-border hover:border-border-strong hover:bg-bg-elevated/70',
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn(
                    'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                    active ? 'border-brand-gold bg-brand-gold' : 'border-slate-500 bg-transparent',
                  )}>
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-slate-950" />}
                  </span>
                  <div>
                    <div className={cn('text-sm font-medium', active ? 'text-brand-goldlight' : 'text-slate-200')}>
                      {opt.label}
                    </div>
                    <div className="mt-0.5 text-[11px] text-slate-500">{opt.hint}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div>
          <label className="label" htmlFor="hot-context">Add context for Compass (optional)</label>
          <textarea
            id="hot-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            placeholder={`Met at SCBA event in Q1, focuses on white collar in ${attorneyCounty}...`}
            className="mt-1.5 input min-h-[84px] resize-none"
          />
        </div>

        <div className="rounded-lg border border-border-subtle bg-bg-elevated/30 px-3 py-2 text-[11px] text-slate-500">
          Flagging <span className="text-slate-300">{attorneyName}</span> · {attorneyFirm}
        </div>
      </div>
    </BaseModal>
  );
}

type SendStage = 'idle' | 'sending' | 'encrypting' | 'sent';

export function SendFollowUpModal({
  isOpen,
  attorneyName,
  attorneyFirm,
  attorneyCounty,
  onClose,
  onSent,
}: BaseProps & { isOpen: boolean; onSent: () => void }) {
  const [stage, setStage] = useState<SendStage>('idle');
  const [subject, setSubject] = useState('Following up · Bad Boys partnership');

  const firstName = attorneyName.split(' ')[0];
  const lastName = attorneyName.split(' ').slice(-1)[0].toLowerCase();
  const firmSlug = attorneyFirm
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/\b(llp|llc|pc|group|firm|associates|law|defense|trial|criminal|office)\b/g, '')
    .replace(/[^a-z]/g, '')
    .slice(0, 14) || 'firm';
  const email = `${firstName.toLowerCase()}.${lastName}@${firmSlug}.law`;

  const [body, setBody] = useState(
    `Hi ${firstName},\n\nWanted to circle back on the Bad Boys partnership conversation. Since we last spoke, we've cleared two more ${attorneyCounty} indemnitor situations end-to-end with zero touch from the attorney side — exactly the value-add we discussed.\n\nIf the timing is better now, I'd love to walk ${attorneyFirm} through the referral structure and the Q2 numbers. Happy to share the case studies first if that's easier.\n\nLet me know what works.\n\nJeff`,
  );

  useEffect(() => {
    if (isOpen) {
      setStage('idle');
      setSubject('Following up · Bad Boys partnership');
      setBody(
        `Hi ${firstName},\n\nWanted to circle back on the Bad Boys partnership conversation. Since we last spoke, we've cleared two more ${attorneyCounty} indemnitor situations end-to-end with zero touch from the attorney side — exactly the value-add we discussed.\n\nIf the timing is better now, I'd love to walk ${attorneyFirm} through the referral structure and the Q2 numbers. Happy to share the case studies first if that's easier.\n\nLet me know what works.\n\nJeff`,
      );
    }
  }, [isOpen, firstName, attorneyCounty, attorneyFirm]);

  const handleSend = () => {
    if (stage !== 'idle') return;
    setStage('sending');
    window.setTimeout(() => setStage('encrypting'), 900);
    window.setTimeout(() => setStage('sent'), 1800);
    window.setTimeout(() => {
      onSent();
    }, 2500);
  };

  const sending = stage !== 'idle';

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={sending ? () => {} : onClose}
      eyebrow="Compass Follow-Up · AI Draft"
      heading={`Follow-up to ${attorneyName}`}
      icon={Send}
      iconTone="gold"
      footer={
        <>
          <button
            onClick={onClose}
            disabled={sending}
            className="cursor-pointer text-xs text-slate-400 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="btn-primary text-xs disabled:cursor-not-allowed disabled:opacity-90"
          >
            <SendButtonContent stage={stage} />
          </button>
        </>
      }
    >
      <div className="relative space-y-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-bg-elevated/40 px-3.5 py-2.5">
          <span className="label">To</span>
          <span className="font-mono text-xs text-slate-200">{email}</span>
        </div>

        <div>
          <label className="label" htmlFor="follow-subject">Subject</label>
          <input
            id="follow-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={sending}
            className="input mt-1.5"
          />
        </div>

        <div>
          <label className="label" htmlFor="follow-body">Message</label>
          <textarea
            id="follow-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={sending}
            rows={11}
            className="input mt-1.5 min-h-[260px] resize-none font-sans text-sm leading-relaxed"
          />
          <div className="mt-1.5 flex items-center justify-between text-[10px]">
            <span className="font-mono uppercase tracking-wider text-brand-goldlight/80">
              Drafted by Compass · 2 seconds ago
            </span>
            <span className="font-mono text-slate-500">{body.length} chars</span>
          </div>
        </div>

        <AnimatePresence>
          {sending && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex items-center justify-center rounded-lg bg-bg-surface/85 backdrop-blur-sm"
            >
              <SendOverlay stage={stage} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BaseModal>
  );
}

function SendButtonContent({ stage }: { stage: SendStage }) {
  if (stage === 'idle') {
    return (
      <>
        <Send className="h-3.5 w-3.5" />
        SEND FOLLOW-UP
      </>
    );
  }
  if (stage === 'sent') {
    return (
      <>
        <CheckCircle className="h-3.5 w-3.5" />
        SENT
      </>
    );
  }
  return (
    <>
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      {stage === 'sending' ? 'SENDING…' : 'ENCRYPTING…'}
    </>
  );
}

function SendOverlay({ stage }: { stage: SendStage }) {
  const steps: { id: SendStage; label: string; Icon: typeof Send }[] = [
    { id: 'sending',    label: 'Sending',    Icon: Send },
    { id: 'encrypting', label: 'Encrypting', Icon: Lock },
    { id: 'sent',       label: 'Delivered',  Icon: CheckCircle },
  ];
  const order: SendStage[] = ['sending', 'encrypting', 'sent'];
  const currentIdx = order.indexOf(stage);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-3">
        {steps.map((step, i) => {
          const reached = i <= currentIdx;
          const active = i === currentIdx && stage !== 'sent';
          const done = i < currentIdx || stage === 'sent';
          const Icon = step.Icon;
          return (
            <div key={step.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{ scale: active ? 1.05 : 1 }}
                  transition={{ duration: 0.3, repeat: active ? Infinity : 0, repeatType: 'reverse' }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border transition-colors',
                    done
                      ? 'border-status-active/40 bg-status-active/10 text-status-active'
                      : active
                        ? 'border-brand-gold/40 bg-brand-gold/10 text-brand-gold'
                        : 'border-border bg-bg-elevated/40 text-slate-600',
                  )}
                >
                  {done && step.id !== 'sent' ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : active ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </motion.div>
                <span className={cn(
                  'font-mono text-[10px] uppercase tracking-wider',
                  reached ? 'text-slate-200' : 'text-slate-600',
                )}>
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="h-px w-8 bg-border" />
              )}
            </div>
          );
        })}
      </div>
      <div className="font-mono text-[11px] uppercase tracking-wider text-brand-goldlight/80">
        {stage === 'sent' ? 'Logged to Compass thread' : 'Routing via Compass relay…'}
      </div>
    </div>
  );
}
