export default function DeathTicker() {
  const text = 'WARNING: Every 4 minutes, one person dies on an unfixed Indian road black spot - 1,60,049 deaths in 2025 - Parliament called it a governance failure';
  return (
    <div className="fixed inset-x-0 top-16 z-30 h-10 overflow-hidden bg-danger text-xs font-extrabold uppercase tracking-[0.08em] text-white shadow-[0_0_30px_rgba(255,45,45,0.35)] sm:text-sm lg:left-64">
      <div className="flex h-full w-max items-center whitespace-nowrap animate-ticker">
        <span className="shrink-0 px-8">{text}</span>
        <span className="shrink-0 px-8">{text}</span>
      </div>
    </div>
  );
}
