import { Loader2, Wand2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import NoticePreview from '../components/NoticePreview.jsx';
import Toast from '../components/Toast.jsx';
import { mockNotice, streamGroqNotice } from '../utils/notice.js';
import { noticeSeed } from '../data/blackSpots.js';

const contractors = ['KRR Infra Projects', 'Bharat Roadworks', 'DesertLine Infra', 'Dakshin EPC', 'Ganga Express Infra', 'Western Buildcon'];

export default function NoticeGen({ selectedSpot, noticeText, setNoticeText }) {
  const [form, setForm] = useState(selectedSpot);
  const [generating, setGenerating] = useState(false);
  const [ready, setReady] = useState(Boolean(noticeText));
  const [toast, setToast] = useState(false);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('roadsense-history') || 'null') || noticeSeed);

  useEffect(() => { setForm(selectedSpot); }, [selectedSpot]);
  useEffect(() => { setReady(Boolean(noticeText)); }, [noticeText]);
  useEffect(() => { localStorage.setItem('roadsense-history', JSON.stringify(history)); }, [history]);

  const generate = async () => {
    setGenerating(true); setReady(false); setNoticeText('');
    let produced = '';
    try {
      await streamGroqNotice(form, (chunk) => { produced += chunk; setNoticeText((v) => v + chunk); });
    } catch {
      const fallback = mockNotice(form);
      for (let i = 0; i <= fallback.length; i += 10) {
        await new Promise((r) => setTimeout(r, 18));
        setNoticeText(fallback.slice(0, i));
      }
      produced = fallback;
    }
    setGenerating(false); setReady(true); setToast(true);
    setHistory([[new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), form.name, form.risk, 'Generated'], ...history]);
    setTimeout(() => setToast(false), 2800);
  };

  const download = async () => {
    const payload = { road: form.name, nhNumber: form.nhNumber, blackSpotId: form.id, district: form.district, state: form.state, riskScore: form.risk, deaths: form.deaths, contractor: form.contractor, noticeText };
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/generate-pdf`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('PDF service failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `PWD-Notice-${form.id}.pdf`; a.click(); URL.revokeObjectURL(url);
    } catch {
      const blob = new Blob([noticeText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `PWD-Notice-${form.id}.txt`; a.click(); URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="app-container grid gap-5 pb-10 lg:grid-cols-[minmax(320px,0.42fr)_minmax(0,0.58fr)]">
      <Toast show={toast}>Notice ready - print and present to judges</Toast>
      <section className="glass-card p-5 lg:max-w-[700px]">
        <h1 className="section-title">Notice Generator</h1><p className="body-text mt-2">AI-drafted PWD notice with official legal framing and offline fallback.</p>
        <div className="mt-5 grid gap-4">
          {[['Road name', 'name'], ['Black spot ID', 'id'], ['District', 'district'], ['State', 'state']].map(([label, key]) => <label key={key} className="text-sm text-slate-300">{label}<input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-danger/60" /></label>)}
          <label className="text-sm text-slate-300">Risk score: <span className="font-mono text-danger">{form.risk}%</span><input type="range" min="0" max="100" value={form.risk} onChange={(e) => setForm({ ...form, risk: Number(e.target.value) })} className="mt-3 w-full accent-red-500" /></label>
          <label className="text-sm text-slate-300">Deaths last 3 years<input type="number" value={form.deaths} onChange={(e) => setForm({ ...form, deaths: Number(e.target.value) })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-danger/60" /></label>
          <label className="text-sm text-slate-300">PWD contractor<select value={form.contractor} onChange={(e) => setForm({ ...form, contractor: e.target.value })} className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#111827] px-3 text-white outline-none focus:border-danger/60">{contractors.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="text-sm text-slate-300">Additional notes<textarea rows="4" placeholder="Drainage overflow, missing crash barrier, school zone nearby..." className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-danger/60" /></label>
          <button onClick={generate} disabled={generating} className="flex h-13 min-h-12 items-center justify-center gap-2 rounded-xl bg-danger px-5 text-sm font-extrabold text-white hover:shadow-[0_0_28px_rgba(255,45,45,0.35)] disabled:opacity-80">{generating ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}{generating ? 'Generating...' : 'Generate Legal Notice via AI'}</button>
        </div>
      </section>
      <div>
        <NoticePreview text={noticeText} ready={ready && !generating} onDownload={download} />
        <section className="glass-card mt-5 overflow-hidden">
          <div className="border-b border-white/10 p-4"><p className="card-title">Notice History Log</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="text-slate-500"><tr><th className="p-3">Timestamp</th><th className="p-3">Road</th><th className="p-3">Risk</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{history.slice(0, 7).map((row, i) => <tr key={i} className="border-t border-white/5"><td className="p-3 font-mono text-xs text-slate-400">{row[0]}</td><td className="p-3 text-white">{row[1]}</td><td className="p-3 font-mono text-danger">{row[2]}%</td><td className="p-3"><span className="rounded-full bg-blue-500/15 px-2 py-1 text-xs font-bold text-blue-300">{row[3]}</span></td><td className="p-3 text-slate-400">View PDF</td></tr>)}</tbody></table></div>
        </section>
      </div>
    </div>
  );
}
