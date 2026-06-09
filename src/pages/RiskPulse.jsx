import { ArrowRight, CloudFog, CloudRain, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import RiskScore from '../components/RiskScore.jsx';
import { blackSpots } from '../data/blackSpots.js';

const iconFor = (weather) => weather.includes('Rain') || weather.includes('Wet') ? CloudRain : weather.includes('Fog') || weather.includes('visibility') ? CloudFog : Sun;
const labelFor = (risk) => risk > 85 ? 'DANGER' : risk > 75 ? 'CRITICAL' : 'HIGH RISK';

export default function RiskPulse({ setSelectedSpot, setActive }) {
  return (
    <div className="app-container pb-10">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div><h1 className="section-title">Live Risk Monitor</h1><p className="body-text mt-2">Updates every 15 minutes. Weather uses cached readings if APIs are unavailable.</p></div>
        <div className="glass-card px-4 py-3 font-mono text-xs text-slate-300">risk = baseScore + (rain x 25) + (night x 20) + (fog x 15) + (weekend x 10)</div>
      </div>
      <div className="responsive-card-grid">
        {blackSpots.map((spot, index) => {
          const WeatherIcon = iconFor(spot.weather);
          return (
            <motion.article key={spot.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="glass-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div><p className="card-title">{spot.name}</p><p className="body-text mt-1">{spot.id} | {spot.district}</p><span className={`badge mt-3 inline-block rounded-full px-3 py-1 ${spot.risk > 85 ? 'bg-danger/15 text-danger' : 'bg-amber-500/15 text-amber-300'}`}>{labelFor(spot.risk)}</span></div>
                <RiskScore score={spot.risk} size={104} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
                <span className="flex items-center gap-2"><WeatherIcon size={16} className="text-amber-300" />{spot.weather}</span>
                <span className="font-mono">{spot.lastAccident}</span>
                <span>{spot.deaths} deaths / 3 yrs</span>
                <span className="font-mono text-slate-400">{spot.lat.toFixed(3)}, {spot.lng.toFixed(3)}</span>
              </div>
              <button onClick={() => { setSelectedSpot(spot); setActive('Notice Gen'); }} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-danger/40 bg-danger/10 text-sm font-bold text-danger hover:bg-danger hover:text-white">Generate Notice <ArrowRight size={17} /></button>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
