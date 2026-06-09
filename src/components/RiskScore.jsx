import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

export const riskColor = (score) => score > 70 ? '#FF2D2D' : score >= 40 ? '#F59E0B' : '#10B981';

export default function RiskScore({ score, size = 112 }) {
  const color = riskColor(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const mv = useMotionValue(0);
  const dash = useTransform(mv, (v) => circumference - (v / 100) * circumference);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(mv, score, { duration: 1.5, ease: 'easeOut', onUpdate: (v) => setDisplay(Math.round(v)) });
    return () => controls.stop();
  }, [score]);
  return (
    <div className="grid place-items-center rounded-full" style={{ width: size, height: size, filter: `drop-shadow(0 0 16px ${color}55)` }}>
      <svg viewBox="0 0 112 112" className="h-full w-full">
        <circle cx="56" cy="56" r={radius} fill="transparent" stroke="#1E293B" strokeWidth="10" />
        <motion.circle cx="56" cy="56" r={radius} fill="transparent" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} style={{ strokeDashoffset: dash }} transform="rotate(-90 56 56)" />
      </svg>
      <div className="absolute text-center">
        <div className="font-mono text-[28px] font-extrabold text-white tabular-nums">{display}</div>
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-400">Risk</div>
      </div>
    </div>
  );
}
