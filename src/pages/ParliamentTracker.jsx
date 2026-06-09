import { motion } from 'framer-motion';
import { useState } from 'react';
import { stateData } from '../data/blackSpots.js';

const colorMap = { crisis: '#FF2D2D', critical: '#F59E0B', poor: '#EAB308', acceptable: '#10B981' };

const stateShapes = [
  { name: 'Rajasthan', path: 'M143 213 184 166 253 178 287 233 257 292 178 302 128 266Z', label: [202, 244] },
  { name: 'Gujarat', path: 'M126 314 188 302 230 354 205 422 135 410 88 358Z', label: [168, 365] },
  { name: 'Maharashtra', path: 'M224 360 315 344 371 402 329 480 224 460 198 414Z', label: [291, 414] },
  { name: 'Karnataka', path: 'M250 470 322 494 336 586 284 635 229 579 220 512Z', label: [282, 550] },
  { name: 'Telangana', path: 'M332 382 392 390 411 461 356 493 322 452Z', label: [368, 435] },
  { name: 'Andhra Pradesh', path: 'M368 482 443 468 489 520 432 585 346 572 333 514Z', label: [413, 528] },
  { name: 'Madhya Pradesh', path: 'M270 246 383 238 436 303 398 374 298 354 248 298Z', label: [348, 306] },
  { name: 'Uttar Pradesh', path: 'M342 148 474 158 520 222 466 283 373 238 319 202Z', label: [426, 216] },
  { name: 'West Bengal', path: 'M492 298 543 326 534 408 491 455 462 376Z', label: [505, 374] },
  { name: 'Tamil Nadu', path: 'M302 592 365 582 389 666 342 728 291 681Z', label: [342, 646] }
];

function Tooltip({ hover }) {
  if (!hover?.data) return null;
  const pending = hover.data.total - hover.data.fixed;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute left-5 top-5 z-10 w-[280px] rounded-2xl border border-white/10 bg-[#0A0F1E]/90 p-4 backdrop-blur-xl">
      <p className="text-base font-bold text-white">{hover.name}</p>
      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-300">
        <span>Total black spots</span><span className="text-right font-mono text-white">{hover.data.total}</span>
        <span>Fixed vs pending</span><span className="text-right font-mono text-white">{hover.data.fixed} / {pending}</span>
        <span>Deaths in 2023</span><span className="text-right font-mono text-danger">{hover.data.deaths.toLocaleString('en-IN')}</span>
        <span>RoadSense notices</span><span className="text-right font-mono text-emerald-300">{hover.data.notices}</span>
      </div>
    </motion.div>
  );
}

export default function ParliamentTracker({ demoStep }) {
  const [hover, setHover] = useState(null);

  return (
    <div className="app-container pb-10">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div><h1 className="section-title">Parliament Tracker</h1><p className="body-text mt-2">Black spot repair accountability by state. Red means crisis-level pending work.</p></div>
        <div className="animate-pulse rounded-full border border-danger/30 bg-danger/10 px-4 py-2 text-sm font-extrabold text-danger">Every 4 minutes, one person dies</div>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.6fr_0.4fr]">
        <section className="glass-card relative min-h-[560px] overflow-hidden p-5">
          <Tooltip hover={hover} />
          <svg viewBox="0 0 620 760" className="h-full min-h-[520px] w-full" role="img" aria-label="India black spot repair choropleth">
            <defs>
              <filter id="stateGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <path d="M250 55 365 95 418 173 475 210 441 272 461 357 390 421 345 520 286 704 221 533 205 440 144 401 92 322 117 225 178 179Z" fill="#0E1C31" stroke="#31506f" strokeWidth="3" opacity="0.62" />
            {stateShapes.map((shape, index) => {
              const data = stateData[shape.name];
              const fixedPct = Math.round((data.fixed / data.total) * 100);
              const highlight = demoStep?.includes('UP') && shape.name === 'Uttar Pradesh';
              return (
                <motion.g key={shape.name} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: highlight ? 1.035 : 1 }} transition={{ delay: index * 0.05 }} onMouseEnter={() => setHover({ name: shape.name, data })} onMouseLeave={() => setHover(null)} className="cursor-pointer">
                  <path d={shape.path} fill={colorMap[data.color]} opacity={highlight ? 0.96 : 0.78} stroke="rgba(255,255,255,0.42)" strokeWidth={highlight ? 2.5 : 1.2} filter={highlight ? 'url(#stateGlow)' : undefined} />
                  <text x={shape.label[0]} y={shape.label[1]} textAnchor="middle" fill="#fff" fontSize="13" fontWeight="900">{fixedPct}%</text>
                  <text x={shape.label[0]} y={shape.label[1] + 17} textAnchor="middle" fill="#CBD5E1" fontSize="9" fontWeight="700">{shape.name.split(' ')[0]}</text>
                </motion.g>
              );
            })}
            <g transform="translate(26 668)">
              <rect width="246" height="54" rx="16" fill="rgba(10,15,30,0.78)" stroke="rgba(255,255,255,0.10)" />
              <circle cx="24" cy="20" r="6" fill="#FF2D2D" /><text x="40" y="24" fill="#CBD5E1" fontSize="11" fontWeight="700">0-15% fixed: crisis</text>
              <circle cx="24" cy="39" r="6" fill="#F59E0B" /><text x="40" y="43" fill="#CBD5E1" fontSize="11" fontWeight="700">15-35% fixed: critical</text>
            </g>
          </svg>
          {demoStep && <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-danger/30 bg-danger/15 p-4 text-center text-lg font-extrabold text-white backdrop-blur-xl">{demoStep}</div>}
        </section>
        <section className="space-y-4">
          {Object.entries(stateData).map(([state, data]) => {
            const fixedPct = Math.round((data.fixed / data.total) * 100);
            return <article key={state} className="glass-card p-4"><div className="flex items-center justify-between"><div><p className="card-title">{state}</p><p className="body-text">{data.total - data.fixed} pending | {data.deaths.toLocaleString('en-IN')} deaths in 2023</p></div><span className="badge rounded-full px-3 py-1" style={{ color: colorMap[data.color], background: `${colorMap[data.color]}22` }}>{fixedPct}% fixed</span></div><div className="mt-3 h-2 rounded-full bg-white/10"><div className="h-full rounded-full" style={{ width: `${fixedPct}%`, background: colorMap[data.color] }} /></div></article>;
          })}
        </section>
      </div>
      <div className="glass-card mt-5 p-5 text-center font-mono text-lg font-extrabold text-white">8,759 total black spots | 1,247 fixed (14.2%) | 7,512 pending</div>
    </div>
  );
}
