import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Circle, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const steps = [
  'Pan map to NH-48 Gurgaon stretch',
  'Risk at 91%',
  'Rain detected - risk spiked from 67% to 91%',
  'Auto-filled legal notice',
  'PDF Ready - print and place on judge table',
  'UP: 1,158 pending spots',
  'One click. Government held accountable.'
];

export default function DemoProgressOverlay({ demoStep }) {
  const [hidden, setHidden] = useState(false);
  const currentIndex = useMemo(() => {
    if (!demoStep) return -1;
    const index = steps.findIndex((step) => demoStep.includes(step) || step.includes(demoStep));
    return index === -1 ? Math.max(0, steps.findIndex((step) => step.split(' ')[0] === demoStep.split(' ')[0])) : index;
  }, [demoStep]);

  if (!demoStep || hidden) return null;

  return (
    <AnimatePresence>
      <motion.aside initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16 }} className="fixed bottom-24 left-3 right-3 z-50 mx-auto max-w-[760px] rounded-[28px] border border-white/12 bg-[#0A0F1E]/92 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.48)] backdrop-blur-2xl lg:bottom-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-danger">Guided Demo</p>
            <h2 className="mt-1 text-xl font-black text-white">{demoStep}</h2>
          </div>
          <button onClick={() => setHidden(true)} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300" aria-label="Hide demo progress">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-7">
          {steps.map((step, index) => {
            const done = index <= currentIndex;
            return (
              <div key={step} className={`rounded-2xl border p-2 ${done ? 'border-danger/40 bg-danger/12 text-white' : 'border-white/10 bg-white/5 text-slate-500'}`}>
                {done ? <CheckCircle2 size={16} className="text-danger" /> : <Circle size={16} />}
                <p className="mt-2 line-clamp-2 text-[10px] font-bold leading-tight">{step}</p>
              </div>
            );
          })}
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
