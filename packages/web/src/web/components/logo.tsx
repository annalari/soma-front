export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return <img src="/logo-mark.png" alt="" className={className} />;
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-2xl font-normal tracking-tight text-teal-900 ${className}`}>
      soma
    </span>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-900">
        <LogoMark className="h-6 w-6 object-contain" />
      </span>
      {!compact && <Wordmark />}
    </span>
  );
}
