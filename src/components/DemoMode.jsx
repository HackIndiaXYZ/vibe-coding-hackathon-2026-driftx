import { PlayCircle } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { blackSpots } from '../data/blackSpots.js';
import { mockNotice } from '../utils/notice.js';

export default function DemoMode({ setActive, setSelectedSpot, setDemoStep, setNoticeText }) {
  const runDemo = useCallback(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const nh48 = blackSpots[0];
    setActive('Dashboard'); setSelectedSpot(nh48); setDemoStep('Pan map to NH-48 Gurgaon stretch'); await wait(3000);
    setDemoStep('Risk at 91%'); await wait(3000);
    setDemoStep('Rain detected - risk spiked from 67% to 91%'); await wait(3000);
    setActive('Notice Gen'); setNoticeText(''); setDemoStep('Auto-filled legal notice'); await wait(1000);
    const notice = mockNotice(nh48);
    for (let i = 0; i <= notice.length; i += 12) { setNoticeText(notice.slice(0, i)); await wait(28); }
    setDemoStep('PDF Ready - print and place on judge table'); await wait(3000);
    setActive('Parliament'); setDemoStep('UP: 1,158 pending spots'); await wait(3000);
    setActive('Dashboard'); setDemoStep('One click. Government held accountable.');
  }, [setActive, setDemoStep, setNoticeText, setSelectedSpot]);

  useEffect(() => {
    window.addEventListener('roadsense-demo', runDemo);
    return () => window.removeEventListener('roadsense-demo', runDemo);
  }, [runDemo]);

  return (
    <button onClick={runDemo} aria-label="Start guided demo" className="fixed bottom-24 right-4 z-40 flex h-12 items-center gap-2 rounded-full bg-danger px-5 text-sm font-extrabold text-white shadow-[0_0_32px_rgba(255,45,45,0.45)] transition hover:scale-105 lg:bottom-5 lg:right-5">
      <PlayCircle size={19} />Guided Demo
    </button>
  );
}
