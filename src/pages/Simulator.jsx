import { AlertTriangle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { blackSpots } from '../data/blackSpots.js';

export default function Simulator({ selectedSpot, setSelectedSpot, setActive }) {
  const [year, setYear] = useState(2021);
  const saved = Math.max(4, Math.round(selectedSpot.deaths * (2025 - year) / 4));
  const loss = (saved * 1.2).toFixed(1);
  const chart = useMemo(() => [2021, 2022, 2023, 2024, 2025].map((y, i) => ({ year: y, actual: Math.round(selectedSpot.deaths * (0.35 + i * 0.17)), repaired: y >= year ? Math.round(selectedSpot.deaths * (0.22 + i * 0.05)) : Math.round(selectedSpot.deaths * (0.35 + i * 0.17)) })), [selectedSpot, year]);
  return (
    <div className="app-container pb-10">
      <div className="mb-5"><h1 className="section-title">Before / After Simulator</h1><p className="body-text mt-2">Show judges the human cost of delayed black spot repair.</p></div>
      <div className="grid gap-5 lg:grid-cols-[0.4fr_0.6fr]">
        <section className="glass-card p-5">
          <label className="text-sm text-slate-300">Select a black spot<select value={selectedSpot.id} onChange={(e) => setSelectedSpot(blackSpots.find((s) => s.id === e.target.value))} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#111827] px-3 text-white">{blackSpots.map((spot) => <option key={spot.id} value={spot.id}>{spot.name}</option>)}</select></label>
          <label className="mt-6 block text-sm text-slate-300">What if this was repaired in <span className="font-mono text-danger">{year}</span>?<input type="range" min="2021" max="2023" step="1" value={year} onChange={(e) => setYear(Number(e.target.value))} className="mt-4 w-full accent-red-500" /></label>
          <div className="mt-6 rounded-2xl border border-danger/30 bg-danger/10 p-5 text-center">
            <div className="font-mono text-6xl font-black text-danger tabular-nums">{saved}</div>
            <p className="mt-2 text-lg font-bold text-white">people would be alive today</p>
            <p className="mt-2 font-mono text-sm text-emerald-300">Rs {loss} crore economic loss prevented</p>
          </div>
          <blockquote className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">{selectedSpot.quote}</blockquote>
          <button onClick={() => setActive('Notice Gen')} className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-danger text-sm font-extrabold text-white hover:shadow-[0_0_28px_rgba(255,45,45,0.35)]"><AlertTriangle size={18} />Generate Emergency Notice Now</button>
        </section>
        <section className="glass-card min-h-[520px] p-5">
          <p className="card-title">Actual accidents vs projected if repaired</p>
          <div className="mt-6 h-[430px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chart}><XAxis dataKey="year" stroke="#64748B" /><YAxis stroke="#64748B" /><Tooltip contentStyle={{ background: '#0A0F1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }} /><Line type="monotone" dataKey="actual" stroke="#FF2D2D" strokeWidth={4} dot={{ r: 5 }} /><Line type="monotone" dataKey="repaired" stroke="#10B981" strokeWidth={4} dot={{ r: 5 }} /></LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
