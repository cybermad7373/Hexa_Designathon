"use client";

import { useEffect, useState } from "react";

/**
 * Progress bar rendered on the very first line of the page so build progress
 * is visible at a glance. Supports a compact terminal-style form
 * (`[========>....] 60%`) and a visual bar.
 */
export interface ProgressBarProps {
  /** Progress percentage (0-100). */
  value: number;
  /** Human-readable label shown alongside the bar. */
  label?: string;
  /** Compact terminal-style rendering: `[=====>.....] 60%`. */
  compact?: boolean;
  /** Width of the bar track (compact mode ignores this). */
  width?: string;
}

const filledChars = "██████████████████████████████████████████████████";
const emptyChars = "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░";
const BAR_LENGTH = 40;

function renderCompact(value: number): string {
  const pct = Math.max(0, Math.min(100, value));
  const filled = Math.round((pct / 100) * BAR_LENGTH);
  const bar = filledChars.slice(0, filled) + emptyChars.slice(0, BAR_LENGTH - filled);
  return `[${bar}] ${pct}%`;
}

export function ProgressBar({ value, label, compact = false, width = "w-full" }: ProgressBarProps) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from = pct;
    const to = Math.max(0, Math.min(100, value));
    const duration = 400;
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      setPct(from + (to - from) * t);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, pct]);

  const display = compact ? (
    renderCompact(pct)
  ) : (
    <div className={`flex items-center gap-3 ${width}`}>
      <div className="flex-1 h-1.5 rounded-full bg-line/60 overflow-hidden">
        <div className="h-full bg-brand transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
      <span className="font-mono text-xs text-fg">{Math.round(pct)}%</span>
      {label && <span className="font-mono text-xs text-muted">{label}</span>}
    </div>
  );

  return (
    <div className="font-mono text-[11px]">
      {compact ? (
        <span className="text-fg">{display}</span>
      ) : (
        <>
          {display}
          {label && (
            <p className="mt-0.5 text-[10px] text-muted uppercase tracking-[0.16em]">{label}</p>
          )}
        </>
      )}
    </div>
  );
}
