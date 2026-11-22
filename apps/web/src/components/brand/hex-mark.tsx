export function HexMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className}>
      <path
        d="M16 3.5 27 9.75v12.5L16 28.5 5 22.25V9.75L16 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M16 10.5 21.5 13.75v6.5L16 23.5l-5.5-3.25v-6.5L16 10.5Z" fill="currentColor" />
    </svg>
  );
}
