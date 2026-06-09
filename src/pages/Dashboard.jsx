import { motion } from 'framer-motion';
import { ArrowRight, CloudRain, FileWarning, MapPin, Radio, ShieldCheck, Siren, Users, Wand2 } from 'lucide-react';
import MapView from '../components/MapView.jsx';
import RiskScore from '../components/RiskScore.jsx';

const flow = [
  { title: 'Predict', text: '48-hour black spot risk', icon: Radio, color: '#FF2D2D' },
  { title: 'Warn', text: 'voice + vibration driver alerts', icon: Siren, color: '#F59E0B' },
  { title: 'Verify', text: 'AI community hazard reports', icon: Users, color: '#3B82F6' },
  { title: 'Act', text: 'PWD notice + accountability', icon: Wand2, color: '#10B981' }
];

function Stat({ value, label, color, detail }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="modern-card p-4">
      <div className="font-mono text-3xl font-black tabular-nums md:text-4xl" style={{ color }}>{value}</div>
      <p className="mt-2 text-sm font-bold text-white">{label}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </motion.div>
  );
}

export default function Dashboard({ selectedSpot, setSelectedSpot, setActive, demoStep }) {
  return (
    <div className="app-container space-y-5 pb-8">
      <section className="modern-card overflow-hidden p-5 sm:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-danger/25 bg-danger/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-danger">
              <span className="h-2 w-2 animate-pulse rounded-full bg-danger" /> India road safety OS
            </div>
            <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
              Predict road danger. Warn drivers. Verify hazards. Force repairs.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
              RoadSense AI is an accident pre-crime and accountability layer for India: built for riders, citizens, fleets, and public works teams.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setActive('Safety Map')} className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-black text-[#0A0F1E] transition hover:scale-[1.01]">
                Open Safety Map <ArrowRight size={17} />
              </button>
              <button onClick={() => setActive('Community')} className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-white transition hover:border-danger/40">
                Verify pothole report
              </button>
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-[#071222] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Live case</p>
                <p className="mt-1 text-lg font-black text-white">{selectedSpot.name}</p>
                <p className="text-sm text-slate-400">{selectedSpot.district}, {selectedSpot.state}</p>
              </div>
              <RiskScore score={selectedSpot.risk} size={108} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
              <span className="rounded-2xl bg-white/5 p-3"><CloudRain size={16} className="text-amber-300" /> {selectedSpot.weather}</span>
              <span className="rounded-2xl bg-white/5 p-3"><FileWarning size={16} className="text-danger" /> {selectedSpot.deaths} deaths</span>
              <span className="rounded-2xl bg-white/5 p-3"><MapPin size={16} className="text-danger" /> {selectedSpot.id}</span>
              <span className="rounded-2xl bg-white/5 p-3"><ShieldCheck size={16} className="text-emerald-300" /> Notice ready</span>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {flow.map(({ title, text, icon: Icon, color }, index) => (
          <motion.article key={title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="modern-card p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ background: `${color}1F`, color }}><Icon size={20} /></span>
              <div>
                <p className="text-base font-black text-white">{title}</p>
                <p className="text-sm text-slate-400">{text}</p>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_300px]">
        <MapView selectedSpot={selectedSpot} onSelect={setSelectedSpot} demoStep={demoStep} />
        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-1">
          <Stat value="1,60,049" label="deaths in 2025" detail="national urgency signal" color="#FF2D2D" />
          <Stat value="8,759" label="black spots unfixed" detail="repair accountability gap" color="#F59E0B" />
          <Stat value="48h" label="prediction window" detail="risk before crash" color="#10B981" />
          <div className="modern-card p-4 sm:col-span-2 lg:col-span-1 2xl:col-span-1">
            <p className="text-sm font-black text-white">Parliament signal</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">“MoRTH response was a governance failure” - Parliamentary Standing Committee, 2025</p>
            <button onClick={() => setActive('Notice Gen')} className="mt-4 h-11 w-full rounded-2xl bg-danger text-sm font-black text-white">Generate legal notice</button>
          </div>
        </aside>
      </section>
    </div>
  );
}
