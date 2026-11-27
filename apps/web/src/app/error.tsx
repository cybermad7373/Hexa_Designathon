"use client";

import { ArrowClockwise } from "@phosphor-icons/react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-[100dvh] w-full max-w-[720px] flex-col justify-center px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand">500</p>
      <h1 className="mt-4 text-4xl font-medium tracking-[-0.03em] sm:text-5xl">
        The run hit an error.
      </h1>
      <p className="mt-4 max-w-[46ch] text-muted">
        The failure was logged with a request id. Retry the step; if it repeats, check the server
        logs before changing code.
      </p>
      {error.digest ? (
        <p className="mt-4 font-mono text-xs text-muted">digest: {error.digest}</p>
      ) : null}
      <div className="mt-8">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-sm font-medium text-brand-ink transition-colors hover:bg-brand-hover active:translate-y-px"
        >
          <ArrowClockwise size={16} weight="bold" aria-hidden="true" />
          Try again
        </button>
      </div>
    </main>
  );
}
