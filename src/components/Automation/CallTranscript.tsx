import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Bot, User, CheckCircle2, Clock, DollarSign, CalendarClock, Play, Pause, RotateCcw } from 'lucide-react';
import { callTranscript, callSummary } from '../../data/mockTranscripts';
import { formatCurrency } from '../../lib/format';
import type { TranscriptTurn } from '../../types';
import { cn } from '../../lib/cn';

type PlaybackState = 'idle' | 'playing' | 'paused' | 'complete';

const TYPING_INDICATOR_MS = 1500;
const CHAR_INTERVAL_MS = 50;
const TURN_PAUSE_MS = 800;
const AUTOPLAY_DELAY_MS = 1200;
const SESSION_KEY = 'transcript-played';

export function CallTranscript() {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [displayedTurns, setDisplayedTurns] = useState<TranscriptTurn[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [currentTypingText, setCurrentTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const startFresh = useCallback(() => {
    setDisplayedTurns([]);
    setCurrentTurnIndex(0);
    setCurrentTypingText('');
    setIsTyping(false);
    setPlaybackState('playing');
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setPlaybackState('playing');
    }, AUTOPLAY_DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const turnIndexAtStart = useRef(currentTurnIndex);
  turnIndexAtStart.current = currentTurnIndex;

  useEffect(() => {
    if (playbackState !== 'playing') return;

    let cancelled = false;
    let timeoutHandle: number | undefined;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutHandle = window.setTimeout(resolve, ms);
      });

    const run = async () => {
      let idx = turnIndexAtStart.current;
      while (!cancelled && idx < callTranscript.length) {
        const turn = callTranscript[idx];

        setIsTyping(true);
        await sleep(TYPING_INDICATOR_MS);
        if (cancelled) return;
        setIsTyping(false);
        setCurrentTypingText('');

        for (let i = 1; i <= turn.text.length; i++) {
          if (cancelled) return;
          setCurrentTypingText(turn.text.slice(0, i));
          await sleep(CHAR_INTERVAL_MS);
        }
        if (cancelled) return;

        setDisplayedTurns((prev) => [...prev, turn]);
        setCurrentTypingText('');
        idx += 1;
        setCurrentTurnIndex(idx);

        if (idx >= callTranscript.length) {
          setPlaybackState('complete');
          return;
        }
        await sleep(TURN_PAUSE_MS);
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (timeoutHandle) window.clearTimeout(timeoutHandle);
    };
  }, [playbackState]);

  const handleButton = () => {
    if (playbackState === 'idle' || playbackState === 'complete') {
      startFresh();
    } else if (playbackState === 'playing') {
      setPlaybackState('paused');
      setIsTyping(false);
    } else if (playbackState === 'paused') {
      setPlaybackState('playing');
    }
  };

  const buttonLabel =
    playbackState === 'idle' ? { Icon: Play, text: 'Play Conversation' }
    : playbackState === 'playing' ? { Icon: Pause, text: 'Pause' }
    : playbackState === 'paused' ? { Icon: Play, text: 'Resume' }
    : { Icon: RotateCcw, text: 'Replay' };

  const ButtonIcon = buttonLabel.Icon;
  const upcomingSpeaker = currentTurnIndex < callTranscript.length ? callTranscript[currentTurnIndex].speaker : null;

  return (
    <div className="glass-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-status-plan/15">
            <Phone className="h-4 w-4 text-status-plan" />
          </div>
          <div>
            <h2 className="h-display text-lg">AI Call Transcript · Live Preview</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              {callSummary.agentName} · Bond {callSummary.bondId} · {callSummary.customerName} ({callSummary.contactRole})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="chip text-status-active">
            <CheckCircle2 className="h-3 w-3" />
            {callSummary.outcome}
          </span>
          <button onClick={handleButton} className="btn-primary text-xs">
            <ButtonIcon className="h-3.5 w-3.5" />
            {buttonLabel.text}
          </button>
        </div>
      </div>

      {/* Summary row — full opacity only after playback completes */}
      <motion.div
        initial={false}
        animate={{ opacity: playbackState === 'complete' || playbackState === 'idle' ? 1 : 0.3 }}
        transition={{ duration: 0.8 }}
        className="mt-5 grid grid-cols-2 gap-3 rounded-lg border border-border bg-bg-elevated/40 p-4 sm:grid-cols-4"
      >
        <SummaryItem Icon={Clock}         label="Duration"  value={callSummary.duration} />
        <SummaryItem Icon={DollarSign}    label="Recovered" value={formatCurrency(callSummary.recovered)} accent />
        <SummaryItem Icon={CalendarClock} label="Plan"      value={callSummary.planTerms} />
        <SummaryItem Icon={CheckCircle2}  label="Sentiment" value={callSummary.sentiment} />
      </motion.div>

      {/* Transcript */}
      <div className="mt-5 min-h-[200px] space-y-3">
        {playbackState === 'idle' && displayedTurns.length === 0 && (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-xs text-slate-500">
            Press Play to hear how {callSummary.agentName} negotiated this payment plan.
          </div>
        )}

        {displayedTurns.map((turn, i) => (
          <Bubble key={`done-${i}`} turn={turn} initialAnim={false} />
        ))}

        {currentTypingText && currentTurnIndex < callTranscript.length && !isTyping && (
          <Bubble
            key={`typing-${currentTurnIndex}`}
            turn={{ ...callTranscript[currentTurnIndex], text: currentTypingText }}
            initialAnim
            showCursor
          />
        )}

        {isTyping && upcomingSpeaker && (
          <TypingIndicator speaker={upcomingSpeaker} />
        )}
      </div>
    </div>
  );
}

function Bubble({
  turn,
  initialAnim,
  showCursor,
}: {
  turn: TranscriptTurn;
  initialAnim: boolean;
  showCursor?: boolean;
}) {
  const isAI = turn.speaker === 'AI';
  return (
    <motion.div
      initial={initialAnim ? { opacity: 0, y: 6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
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
            {isAI ? `${callSummary.agentName} (AI Agent)` : callSummary.customerName}
          </span>
          <span className="font-mono text-[10px] text-slate-500">{turn.timestamp}</span>
        </div>
        <p className="text-sm leading-relaxed text-slate-200">
          {turn.text}
          {showCursor && <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 bg-brand-gold align-middle animate-pulse" />}
        </p>
      </div>
    </motion.div>
  );
}

function TypingIndicator({ speaker }: { speaker: TranscriptTurn['speaker'] }) {
  const isAI = speaker === 'AI';
  return (
    <div className={`flex gap-3 ${isAI ? '' : 'flex-row-reverse'}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
        isAI ? 'border-brand-gold/30 bg-brand-gold/10 text-brand-gold' : 'border-border bg-bg-elevated text-slate-300'
      }`}>
        {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
      </div>
      <div className={cn(
        'flex items-center gap-1.5 rounded-2xl border px-4 py-3',
        isAI ? 'rounded-tl-md border-brand-gold/20 bg-brand-gold/[0.04]' : 'rounded-tr-md border-border bg-bg-elevated/60',
      )}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={cn(
              'h-2 w-2 rounded-full',
              isAI ? 'bg-brand-gold/70' : 'bg-slate-400',
            )}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
          />
        ))}
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
