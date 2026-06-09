import { Activity, Bell, Bot, ChartNoAxesCombined, FileText, Gauge, Home, Menu, Radio, Route, ShieldAlert, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const iconMap = {
  Dashboard: Home,
  'Safety Map': ShieldAlert,
  Community: Users,
  'Risk Pulse': Activity,
  'Notice Gen': FileText,
  Parliament: ChartNoAxesCombined,
  Simulator: Gauge
};

function Brand({ compact = false, setActive }) {
  return (
    <button className="flex h-11 min-w-0 items-center gap-3" onClick={() => setActive('Dashboard')} aria-label="RoadSense dashboard">
      <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-danger shadow-[0_0_24px_rgba(255,45,45,0.45)]">
        <span className="absolute h-9 w-9 animate-ping rounded-2xl bg-danger/35" />
        <Radio size={18} className="relative" />
      </span>
      {!compact && <span className="min-w-0 truncate whitespace-nowrap text-base font-black tracking-normal sm:text-lg">RoadSense <span className="text-danger">AI</span></span>}
    </button>
  );
}

function NavButton({ tab, active, setActive, mobile = false }) {
  const Icon = iconMap[tab] || Route;
  const selected = active === tab;
  return (
    <button
      onClick={() => setActive(tab)}
      className={`group relative flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-bold transition ${mobile ? 'h-14 flex-1 flex-col justify-center gap-1 px-1 text-[10px]' : 'w-full'} ${selected ? 'bg-white text-[#0A0F1E] shadow-[0_10px_30px_rgba(255,255,255,0.10)]' : 'text-slate-400 hover:bg-white/7 hover:text-white'}`}
      aria-current={selected ? 'page' : undefined}
    >
      <Icon size={mobile ? 18 : 19} />
      <span className={mobile ? 'leading-none' : ''}>{tab}</span>
      {selected && !mobile && <motion.span layoutId="side-active-dot" className="ml-auto h-2 w-2 rounded-full bg-danger" />}
    </button>
  );
}

export default function Navbar({ tabs, active, setActive }) {
  const [clock, setClock] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const tick = () => setClock(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-white/10 bg-[#0A0F1E]/96 px-4 py-5 shadow-[18px_0_60px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:block">
        <Brand setActive={setActive} />
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.035] p-3">
          <div className="flex items-center gap-2 px-2 pb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
            <Bot size={14} /> Mission Control
          </div>
          <nav className="space-y-1">
            {tabs.map((tab) => <NavButton key={tab} tab={tab} active={active} setActive={setActive} />)}
          </nav>
        </div>
        <div className="absolute inset-x-4 bottom-5 rounded-3xl border border-danger/20 bg-danger/10 p-4">
          <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.08em] text-danger"><span className="h-2 w-2 animate-pulse rounded-full bg-danger" /> Live system</div>
          <p className="mt-3 text-sm font-semibold leading-5 text-slate-200">AI alerts, citizen reports, and PWD notices are active.</p>
          <button onClick={() => window.dispatchEvent(new Event('roadsense-demo'))} className="mt-4 h-11 w-full rounded-2xl bg-white text-sm font-black text-[#0A0F1E] transition hover:scale-[1.01]">Run Demo</button>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/12 bg-[#0A0F1E]/96 shadow-[0_12px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:left-64">
        <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:hidden">
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-white/5" onClick={() => setOpen(!open)} aria-label="Toggle menu"><Menu size={20} /></button>
            <Brand compact={false} setActive={setActive} />
          </div>
          <div className="hidden min-w-0 lg:block">
            <p className="text-[11px] font-black uppercase tracking-[0.12em] text-danger">RoadSense AI Command Center</p>
            <h1 className="truncate text-2xl font-black leading-7 text-white drop-shadow-[0_1px_10px_rgba(255,255,255,0.12)]">{active}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-danger sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-danger" />LIVE</span>
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-slate-300 min-[520px]:inline-block sm:text-sm">{clock} IST</span>
            <button onClick={() => window.dispatchEvent(new Event('roadsense-demo'))} className="hidden h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-bold text-white transition hover:border-danger/50 hover:bg-danger/10 md:block">Demo Mode</button>
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300" aria-label="Notifications"><Bell size={18} /></button>
          </div>
        </div>
        {open && (
          <div className="border-t border-white/10 bg-[#0A0F1E] p-3 shadow-2xl lg:hidden">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {tabs.map((tab) => <NavButton key={tab} tab={tab} active={active} setActive={(next) => { setActive(next); setOpen(false); }} />)}
            </div>
          </div>
        )}
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex gap-1 border-t border-white/10 bg-[#0A0F1E]/92 px-2 py-2 backdrop-blur-xl lg:hidden">
        {tabs.slice(0, 5).map((tab) => <NavButton key={tab} tab={tab} active={active} setActive={setActive} mobile />)}
      </nav>
    </>
  );
}
