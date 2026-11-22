export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="mx-auto flex min-h-[100dvh] w-full max-w-[1200px] items-center px-5 sm:px-8"
    >
      <div className="w-full">
        <div className="h-3 w-24 rounded-full bg-surface-2" />
        <div className="mt-6 h-14 w-full max-w-[560px] rounded-xl bg-surface" />
        <div className="mt-3 h-14 w-full max-w-[420px] rounded-xl bg-surface" />
        <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Loading the operating system
        </p>
      </div>
    </main>
  );
}
