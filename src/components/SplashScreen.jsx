import { motion } from 'framer-motion';

export default function SplashScreen() {
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-[#0A0F1E]" initial={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.04 }} transition={{ duration: 0.45 }}>
      <div className="relative flex flex-col items-center">
        <div className="absolute top-3 h-28 w-28 rounded-full border border-danger/40 bg-danger/10 animate-radar" />
        <div className="absolute top-3 h-28 w-28 rounded-full border border-danger/25 bg-danger/5 animate-radar [animation-delay:0.45s]" />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.65 }} className="relative h-32 w-32 rounded-full border border-danger/40 bg-danger/10 shadow-[0_0_70px_rgba(255,45,45,0.35)]" />
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-8 text-center text-4xl font-black text-white md:text-5xl">RoadSense AI</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }} className="mt-3 text-center text-sm font-semibold text-slate-400 md:text-base">India&apos;s First Accident Pre-Crime System</motion.p>
        <div className="mt-8 h-2 w-72 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-danger" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.35, ease: 'easeInOut' }} />
        </div>
      </div>
    </motion.div>
  );
}
