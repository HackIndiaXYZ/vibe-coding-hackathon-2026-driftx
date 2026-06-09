import { Play, Square } from 'lucide-react';

export default function DemoDriveSimulator({ running, startDemo, stopDemo, activeStep }) {
  return (
    <section className="glass-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-white">Demo Drive</p>
          <p className="mt-1 text-xs text-slate-400">Simulates Green → Amber → Red for judges.</p>
        </div>
        <button onClick={running ? stopDemo : startDemo} className={`flex h-12 items-center gap-2 rounded-xl px-4 text-sm font-extrabold ${running ? 'bg-white/10 text-white' : 'bg-danger text-white'}`}>
          {running ? <Square size={17} /> : <Play size={17} />}{running ? 'Stop' : 'Start Demo Drive'}
        </button>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-red-500 transition-all duration-700" style={{ width: `${activeStep?.progress || 8}%` }} />
      </div>
      <p className="mt-3 text-sm font-bold text-slate-300">{activeStep?.label || 'Ready at safe starting point'}</p>
    </section>
  );
}
