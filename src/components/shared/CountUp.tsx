import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface Props {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  compact?: boolean;
  currency?: boolean;
}

export function CountUp({ value, duration = 1400, decimals = 0, prefix = '', suffix = '', compact = false, currency = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  const formatter = currency
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: compact ? 'compact' : 'standard',
        maximumFractionDigits: compact ? 1 : decimals,
      })
    : new Intl.NumberFormat('en-US', {
        notation: compact ? 'compact' : 'standard',
        maximumFractionDigits: compact ? 1 : decimals,
        minimumFractionDigits: decimals,
      });

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{formatter.format(display)}{suffix}
    </span>
  );
}
