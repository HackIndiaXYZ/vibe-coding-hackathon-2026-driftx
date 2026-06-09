import { motion } from 'framer-motion';
import { Gauge, MapPin, Wrench } from 'lucide-react';
import { hazardTypeIcon } from '../../data/safetyZones.js';

const border = { red: 'border-danger/50 shadow-[0_0_26px_rgba(255,45,45,0.22)]', amber: 'border-amber-400/40 shadow-[0_0_22px_rgba(245,158,11,0.18)]', green: 'border-emerald-400/40 shadow-[0_0_18px_rgba(16,185,129,0.16)]' };

export default function DangerZoneCard({ zone, explanation }) {
  if (!zone) return null;
  return (
    <motion.article key={zone.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`glass-card p-4 ${border[zone.severity] || ''}`}>
      <div className="flex items-start gap-3">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-3xl">{hazardTypeIcon[zone.type] || '!'}</div>
        <div className="min-w-0">
          <p className="text-lg font-black text-white">{zone.road}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-400"><MapPin size={14} />{zone.city}</p>
        </div>
        <span className="ml-auto rounded-full bg-white/10 px-3 py-1 font-mono text-sm font-black text-white">{zone.risk}</span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <span className="rounded-xl bg-white/5 p-3 text-slate-300"><Gauge size={16} /> {zone.recommendedSpeed} km/h</span>
        <span className="rounded-xl bg-white/5 p-3 text-slate-300"><Wrench size={16} /> {zone.severity.toUpperCase()}</span>
      </div>
      <p className="mt-4 text-xl font-extrabold leading-snug text-white">{explanation.warning}</p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{explanation.reason}</p>
      <p className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm font-semibold text-emerald-200">{explanation.prevention}</p>
    </motion.article>
  );
}
