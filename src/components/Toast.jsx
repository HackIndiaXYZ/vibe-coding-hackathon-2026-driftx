import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ show, children }) {
  return (
    <AnimatePresence>
      {show && <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-5 py-3 text-sm font-bold text-emerald-300 backdrop-blur-xl"><CheckCircle2 size={18} />{children}</motion.div>}
    </AnimatePresence>
  );
}
