import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Volume2 } from 'lucide-react';

const tone = {
  red: 'border-red-300/50 bg-danger text-white shadow-[0_0_44px_rgba(255,45,45,0.5)]',
  amber: 'border-amber-300/50 bg-amber-500 text-[#211300] shadow-[0_0_36px_rgba(245,158,11,0.38)]',
  green: 'border-emerald-300/40 bg-emerald-500 text-[#062016] shadow-[0_0_32px_rgba(16,185,129,0.28)]'
};

export default function DangerAlertBanner({ zone, explanation, distance, onSpeak }) {
  return (
    <AnimatePresence>
      {zone && (
        <motion.div initial={{ y: 130, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 130, opacity: 0 }} className={`fixed inset-x-3 bottom-3 z-50 rounded-3xl border p-4 ${tone[zone.severity] || tone.amber}`}>
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-black/15">
              <AlertTriangle size={32} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-black leading-tight md:text-2xl">{explanation.warning}</p>
              <p className="mt-1 font-mono text-sm font-bold opacity-85">{distance.toFixed(1)} km ahead | {zone.recommendedSpeed} km/h</p>
            </div>
            <button onClick={onSpeak} aria-label="Replay voice alert" className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-black/15">
              <Volume2 size={24} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
