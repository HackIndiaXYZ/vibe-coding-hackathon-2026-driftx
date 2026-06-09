import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import DeathTicker from './components/DeathTicker.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import DemoMode from './components/DemoMode.jsx';
import DemoProgressOverlay from './components/DemoProgressOverlay.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RiskPulse from './pages/RiskPulse.jsx';
import NoticeGen from './pages/NoticeGen.jsx';
import ParliamentTracker from './pages/ParliamentTracker.jsx';
import Simulator from './pages/Simulator.jsx';
import SafetyMap from './pages/SafetyMap.jsx';
import CommunityReporting from './pages/CommunityReporting.jsx';
import { blackSpots } from './data/blackSpots.js';

const tabs = ['Dashboard', 'Safety Map', 'Community', 'Risk Pulse', 'Notice Gen', 'Parliament', 'Simulator'];

export default function App() {
  const [active, setActive] = useState('Dashboard');
  const [selectedSpot, setSelectedSpot] = useState(blackSpots[0]);
  const [noticeText, setNoticeText] = useState('');
  const [demoStep, setDemoStep] = useState('');
  const [splash, setSplash] = useState(() => sessionStorage.getItem('roadsense-splash') !== 'done');

  useEffect(() => {
    if (!splash) return;
    const timer = setTimeout(() => {
      sessionStorage.setItem('roadsense-splash', 'done');
      setSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [splash]);

  const pageProps = useMemo(() => ({ selectedSpot, setSelectedSpot, setActive, noticeText, setNoticeText, demoStep }), [selectedSpot, noticeText, demoStep]);
  const pages = {
    Dashboard: <Dashboard {...pageProps} />,
    'Safety Map': <SafetyMap />,
    Community: <CommunityReporting />,
    'Risk Pulse': <RiskPulse {...pageProps} />,
    'Notice Gen': <NoticeGen {...pageProps} />,
    Parliament: <ParliamentTracker demoStep={demoStep} />,
    Simulator: <Simulator selectedSpot={selectedSpot} setSelectedSpot={setSelectedSpot} setActive={setActive} />
  };

  return (
    <div className="min-h-screen bg-navy text-slate-100 selection:bg-danger/40">
      <AnimatePresence>{splash && <SplashScreen />}</AnimatePresence>
      <Navbar tabs={tabs} active={active} setActive={setActive} />
      <DeathTicker />
      <main className="min-h-screen px-3 pb-24 pt-[120px] sm:px-5 lg:pl-[17rem] lg:pr-6 xl:pr-8">
        <div className="mx-auto grid w-full max-w-[1440px] gap-6 2xl:grid-cols-[minmax(0,1fr)_300px]">
          <section className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
                {pages[active]}
              </motion.div>
            </AnimatePresence>
          </section>
          <aside className="sticky top-[120px] hidden h-fit space-y-4 2xl:block">
            <div className="modern-card p-4">
              <p className="text-sm font-black text-white">AI Insights</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">NH-48 remains the strongest demo path: 91% risk, rain spike, notice generation, and safety-route intervention.</p>
            </div>
            <div className="modern-card p-4">
              <p className="text-sm font-black text-white">Recent Alerts</p>
              <div className="mt-3 space-y-3 text-sm">
                <div className="rounded-2xl bg-danger/10 p-3 text-red-100">Pothole verified: Mumbai Bandra road</div>
                <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-100">No streetlight: Nagpur Ring Road</div>
                <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-100">Safe route available for two-wheelers</div>
              </div>
            </div>
            <div className="modern-card p-4">
              <p className="text-sm font-black text-white">Quick Actions</p>
              <button onClick={() => setActive('Community')} className="mt-3 h-11 w-full rounded-2xl bg-white text-sm font-black text-[#0A0F1E]">Report hazard</button>
              <button onClick={() => setActive('Notice Gen')} className="mt-2 h-11 w-full rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white">Generate notice</button>
            </div>
          </aside>
        </div>
      </main>
      <DemoMode setActive={setActive} setSelectedSpot={setSelectedSpot} setDemoStep={setDemoStep} setNoticeText={setNoticeText} />
      <DemoProgressOverlay demoStep={demoStep} />
    </div>
  );
}
