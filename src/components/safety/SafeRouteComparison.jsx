import { Route, ShieldCheck, Zap } from 'lucide-react';

export default function SafeRouteComparison({ mode }) {
  const modeText = mode === 'night' ? 'night travel' : mode === 'rain' ? 'rain conditions' : mode === 'twoWheeler' ? 'two-wheelers' : 'this trip';
  return (
    <section className="glass-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-extrabold text-white">Safe Route</p>
          <p className="mt-1 text-xs text-slate-400">Compares time against hazard exposure.</p>
        </div>
        <Route className="text-emerald-300" />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-danger/30 bg-danger/10 p-4">
          <div className="flex items-center gap-2 text-danger"><Zap size={18} /><span className="font-bold">Fastest Route</span></div>
          <p className="mt-3 font-mono text-4xl font-black text-white">18 min</p>
          <p className="mt-2 text-sm font-bold text-danger">Risk: High</p>
          <p className="mt-1 text-sm text-slate-300">Reason: potholes + accident-prone turn</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4">
          <div className="flex items-center gap-2 text-emerald-300"><ShieldCheck size={18} /><span className="font-bold">Safest Route</span></div>
          <p className="mt-3 font-mono text-4xl font-black text-white">23 min</p>
          <p className="mt-2 text-sm font-bold text-emerald-300">Risk: Low</p>
          <p className="mt-1 text-sm text-slate-300">Reason: better lighting + fewer reported hazards</p>
        </div>
      </div>
      <p className="mt-4 rounded-2xl bg-white/5 p-3 text-sm font-bold text-white">Recommendation: For {modeText}, take the safer route.</p>
    </section>
  );
}
