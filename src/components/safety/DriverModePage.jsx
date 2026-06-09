import { Gauge, Navigation2 } from 'lucide-react';
import { hazardTypeIcon } from '../../data/safetyZones.js';

export default function DriverModePage({ zone, explanation, distance }) {
  if (!zone) return null;
  const color = zone.severity === 'red' ? '#FF2D2D' : zone.severity === 'amber' ? '#F59E0B' : '#10B981';
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#071222] p-5 shadow-glass">
      <div className="absolute inset-x-8 top-8 h-48 rounded-full opacity-20 blur-3xl" style={{ background: color }} />
      <div className="relative z-10 grid min-h-[420px] place-items-center text-center">
        <div>
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-[32px] border border-white/10 bg-white/10 text-6xl shadow-[0_0_36px_rgba(0,0,0,0.35)]">{hazardTypeIcon[zone.type] || '!'}</div>
          <p className="mt-8 text-5xl font-black text-white md:text-6xl">{distance.toFixed(1)} km</p>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.08em] text-slate-400">to next road risk</p>
          <p className="mx-auto mt-8 max-w-xl text-3xl font-black leading-tight text-white md:text-4xl">{explanation.warning}</p>
          <div className="mt-8 flex justify-center gap-3">
            <span className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-mono text-lg font-black text-white"><Gauge size={20} />{zone.recommendedSpeed} km/h</span>
            <span className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-lg font-black text-white"><Navigation2 size={20} />Keep left</span>
          </div>
        </div>
      </div>
    </section>
  );
}
