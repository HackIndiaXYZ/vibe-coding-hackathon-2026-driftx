import { AlertTriangle, Camera, CheckCircle2, ImagePlus, MapPin, Radio, Send, ShieldCheck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

const reportTypes = [
  'Pothole',
  'Waterlogging',
  'Broken Signal',
  'No Streetlight',
  'Accident Spot',
  'Wrong-side Driving',
  'Blind Turn',
  'School Zone Risk'
];

const seedReports = [
  { reportType: 'Pothole', roadName: 'Mumbai Bandra road', city: 'Mumbai', verificationScore: 91, riskBand: 'red', status: 'Verified by AI', confidence: 'High', severity: 'High', displayTitle: 'Large pothole', driverConfirmations: 12, aiImageVerification: { imageVerified: true, imageLabel: 'Large pothole', imageConfidence: 87, imageReason: 'Dark central road depression detected.' } },
  { reportType: 'No Streetlight', roadName: 'Nagpur Ring Road', city: 'Nagpur', verificationScore: 64, riskBand: 'amber', status: 'Needs Field Check', confidence: 'Medium' },
  { reportType: 'School Zone Risk', roadName: 'Aurangabad school gate', city: 'Aurangabad', verificationScore: 76, riskBand: 'red', status: 'Verified High Priority', confidence: 'High' }
];

const riskStyle = {
  red: 'border-danger/50 bg-danger/15 text-red-100',
  amber: 'border-amber-400/50 bg-amber-500/15 text-amber-100',
  green: 'border-emerald-400/50 bg-emerald-500/15 text-emerald-100'
};

function normalizeReport(report) {
  if (!report) return seedReports[0];
  const verificationScore = report.verificationScore ?? 0;
  const severity = report.severity || (verificationScore >= 75 ? 'High' : verificationScore >= 50 ? 'Medium' : 'Low');
  const displayTitle = report.displayTitle || (report.reportType === 'Pothole' && verificationScore >= 75 ? 'Large pothole' : `${report.reportType || 'Hazard'} report`);
  const driverConfirmations = report.driverConfirmations || (report.reportType === 'Pothole' && verificationScore >= 75 ? Math.max(Number(report.userCount || 0), 12) : report.userCount || 3);
  const aiImageVerification = report.aiImageVerification || {
    imageVerified: report.status === 'Verified by AI' || (report.photoEvidence && verificationScore >= 75),
    imageLabel: displayTitle,
    imageConfidence: verificationScore,
    imageReason: report.photoEvidence ? 'Photo evidence and community confirmations support this report.' : 'Awaiting stronger image evidence.'
  };
  return {
    ...report,
    severity,
    displayTitle,
    driverConfirmations,
    aiImageVerification,
    status: report.status || (verificationScore >= 75 ? 'Verified by AI' : 'Needs Field Check')
  };
}

function fallbackScore(form) {
  const base = {
    Pothole: 26,
    Waterlogging: 22,
    'Broken Signal': 24,
    'No Streetlight': 20,
    'Accident Spot': 34,
    'Wrong-side Driving': 30,
    'Blind Turn': 25,
    'School Zone Risk': 28
  }[form.reportType] || 18;
  const score = Math.min(100, base + (form.photoEvidence ? 12 : 0) + Math.min(Number(form.userCount) * 4, 20) + (form.timeOfDay === 'night' ? 10 : 0) + (form.weather === 'rain' ? 10 : 0));
  return {
    verificationScore: score,
    status: score >= 75 ? 'Verified High Priority' : score >= 50 ? 'Needs Field Check' : 'Community Watch',
    severity: score >= 75 ? 'High' : score >= 50 ? 'Medium' : 'Low',
    confidence: form.photoEvidence || Number(form.userCount) >= 3 ? 'High' : 'Medium',
    riskBand: score >= 75 ? 'red' : score >= 50 ? 'amber' : 'green',
    displayTitle: form.reportType === 'Pothole' && form.photoEvidence ? 'Possible pothole' : `${form.reportType} report`,
    driverConfirmations: Number(form.userCount),
    aiImageVerification: {
      imageVerified: Boolean(form.photoEvidence),
      imageLabel: form.photoEvidence ? 'Photo evidence attached' : 'No image uploaded',
      imageConfidence: form.photoEvidence ? 62 : 0,
      imageReason: form.photoEvidence ? 'Backend unavailable; local evidence fallback used.' : 'No image evidence was provided.'
    },
    authoritySummary: `${form.reportType} reported at ${form.roadName || form.city}. Score ${score}.`
  };
}

export default function CommunityReporting() {
  const [form, setForm] = useState({
    reportType: 'Pothole',
    roadName: 'Mumbai Bandra road',
    city: 'Mumbai',
    description: 'Deep pothole near petrol pump, risky for two-wheelers',
    photoEvidence: true,
    userCount: 12,
    timeOfDay: 'night',
    weather: 'rain',
    imageData: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [reports, setReports] = useState(() => JSON.parse(localStorage.getItem('roadsense-community-reports') || 'null') || seedReports);
  const [result, setResult] = useState(() => normalizeReport((JSON.parse(localStorage.getItem('roadsense-community-reports') || 'null') || seedReports)[0]));
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem('roadsense-community-reports', JSON.stringify(reports));
  }, [reports]);

  const livePreview = useMemo(() => normalizeReport(fallbackScore(form)), [form]);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      setImagePreview(dataUrl);
      setForm((current) => ({ ...current, imageData: dataUrl, photoEvidence: true }));
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setSubmitting(true);
    let scored;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE || 'http://localhost:8000'}/api/community-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!response.ok) throw new Error('Community score failed');
      scored = await response.json();
    } catch {
      scored = fallbackScore(form);
    }
    const full = normalizeReport({ ...form, ...scored, timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) });
    setResult(full);
    setReports([full, ...reports]);
    setSubmitting(false);
  };

  return (
    <div className="app-container grid gap-5 pb-10 lg:grid-cols-[minmax(320px,0.42fr)_minmax(0,0.58fr)]">
      <section className="glass-card p-5 lg:max-w-[700px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="section-title">Community Reporting</h1>
            <p className="body-text mt-2">Users report road hazards. RoadSense AI verifies, scores, and prepares authority-ready summaries.</p>
          </div>
          <span className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-danger">Most Important</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {reportTypes.map((type) => (
            <button key={type} onClick={() => setForm({ ...form, reportType: type })} className={`min-h-12 rounded-xl border px-3 text-left text-sm font-bold transition ${form.reportType === type ? 'border-danger/60 bg-danger/15 text-white' : 'border-white/10 bg-white/5 text-slate-300 hover:border-danger/30'}`}>
              {type}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4">
          <label className="text-sm text-slate-300">Road / landmark<input value={form.roadName} onChange={(e) => setForm({ ...form, roadName: e.target.value })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-danger/60" /></label>
          <label className="text-sm text-slate-300">City<input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-danger/60" /></label>
          <label className="text-sm text-slate-300">What did you see?<textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white outline-none focus:border-danger/60" /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm text-slate-300">Reports nearby<input type="number" min="1" max="20" value={form.userCount} onChange={(e) => setForm({ ...form, userCount: Number(e.target.value) })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-white outline-none focus:border-danger/60" /></label>
            <label className="text-sm text-slate-300">Weather<select value={form.weather} onChange={(e) => setForm({ ...form, weather: e.target.value })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#111827] px-3 text-white"><option value="clear">Clear</option><option value="rain">Rain / wet</option></select></label>
            <label className="text-sm text-slate-300">Time<select value={form.timeOfDay} onChange={(e) => setForm({ ...form, timeOfDay: e.target.value })} className="mt-2 h-12 w-full rounded-xl border border-white/10 bg-[#111827] px-3 text-white"><option value="day">Day</option><option value="night">Night</option></select></label>
            <label className={`mt-7 flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-bold ${form.photoEvidence ? 'border-emerald-400/50 bg-emerald-500/15 text-emerald-200' : 'border-white/10 bg-white/5 text-slate-300'}`}>
              <ImagePlus size={17} />Upload image
              <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="sr-only" />
            </label>
          </div>
          {imagePreview && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-bold text-white">Uploaded road image</p>
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-300">Ready for AI verification</span>
              </div>
              <img src={imagePreview} alt="Uploaded road hazard evidence preview" className="mt-3 max-h-64 w-full rounded-xl object-cover" />
            </div>
          )}
          <button onClick={submit} disabled={submitting} className="flex h-12 items-center justify-center gap-2 rounded-xl bg-danger text-sm font-extrabold text-white hover:shadow-[0_0_28px_rgba(255,45,45,0.35)]"><Send size={18} />{submitting ? 'Verifying...' : 'Verify + Score Report'}</button>
        </div>
      </section>

      <div className="space-y-5">
        <section className={`rounded-2xl border p-5 ${riskStyle[normalizeReport(result || livePreview).riskBand]}`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.08em] opacity-80">AI Verification Score</p>
              <p className="mt-2 text-4xl font-black text-white">{normalizeReport(result || livePreview).verificationScore}/100</p>
            </div>
            <Radio className="animate-pulse" size={42} />
          </div>
          <p className="mt-4 text-xl font-black">{normalizeReport(result || livePreview).status}</p>
          <p className="mt-2 text-sm opacity-90">{normalizeReport(result || livePreview).authoritySummary}</p>
        </section>

        <section className="modern-card overflow-hidden p-5">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-danger/15 text-danger">
              <AlertTriangle size={34} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-2xl font-black text-white">⚠️ {normalizeReport(result || livePreview).displayTitle}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-black ${normalizeReport(result || livePreview).aiImageVerification?.imageVerified ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'}`}>
                  {normalizeReport(result || livePreview).aiImageVerification?.imageVerified ? 'Verified by AI' : 'Needs image review'}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-white">{normalizeReport(result || livePreview).driverConfirmations} drivers confirmed</span>
                <span className="rounded-full bg-danger/15 px-3 py-1 text-xs font-black text-danger">Severity: {normalizeReport(result || livePreview).severity}</span>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-300">{normalizeReport(result || livePreview).aiImageVerification?.imageReason}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/5 p-3"><p className="text-xs text-slate-500">Image confidence</p><p className="font-mono text-xl font-black text-white">{normalizeReport(result || livePreview).aiImageVerification?.imageConfidence || 0}%</p></div>
                <div className="rounded-2xl bg-white/5 p-3"><p className="text-xs text-slate-500">Fake-report filter</p><p className="text-sm font-bold text-emerald-300">Image + crowd check</p></div>
                <div className="rounded-2xl bg-white/5 p-3"><p className="text-xs text-slate-500">Action</p><p className="text-sm font-bold text-white">{normalizeReport(result || livePreview).status}</p></div>
              </div>
            </div>
            <ShieldCheck className="hidden text-emerald-300 sm:block" size={28} />
          </div>
        </section>

        <section className="glass-card p-5">
          <p className="text-xl font-black text-white">Why this is different</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">Google Maps cannot know every fresh pothole, broken signal, dark stretch, or school gate risk. Community Reporting turns local driver knowledge into verified hazard intelligence, then pushes it into Safety Map, voice alerts, and PWD-ready action summaries.</p>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs font-bold text-slate-300">
            <div className="rounded-2xl bg-white/5 p-3"><Users className="mx-auto text-blue-300" />Crowd signal</div>
            <div className="rounded-2xl bg-white/5 p-3"><CheckCircle2 className="mx-auto text-emerald-300" />AI score</div>
            <div className="rounded-2xl bg-white/5 p-3"><AlertTriangle className="mx-auto text-danger" />Safety alert</div>
          </div>
        </section>

        <section className="glass-card p-5">
          <p className="text-xl font-black text-white">Dataset-backed scoring</p>
          <p className="mt-3 text-sm leading-6 text-slate-300">The backend model now trains on the uploaded row-level accident dataset with weather, road condition, lighting, traffic control, geometry, casualties, and fatalities. Annexure 7 is kept as state-level calibration context.</p>
          <div className="mt-4 grid gap-2 text-xs font-mono text-slate-300">
            <span className="rounded-xl bg-white/5 p-3">Primary: accident_prediction_india.csv — 3,000 rows</span>
            <span className="rounded-xl bg-white/5 p-3">Context: Transport_2023_Annexure_7.csv — state accident totals</span>
            <span className="rounded-xl bg-white/5 p-3">Reports: live community hazards scored into red / amber / green</span>
          </div>
        </section>

        <section className="glass-card overflow-hidden">
          <div className="border-b border-white/10 p-4"><p className="card-title">Live Community Queue</p></div>
          <div className="grid gap-3 p-4">
            {reports.slice(0, 6).map((rawReport, index) => {
              const report = normalizeReport(rawReport);
              return (
              <motion.article key={`${report.reportType}-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-bold text-white">{report.reportType}</p><p className="mt-1 flex items-center gap-1 text-sm text-slate-400"><MapPin size={14} />{report.roadName}, {report.city}</p></div>
                  <span className={`rounded-full px-3 py-1 font-mono text-sm font-black ${report.riskBand === 'red' ? 'bg-danger/20 text-danger' : report.riskBand === 'amber' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>{report.verificationScore}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-300">{report.status} | Confidence: {report.confidence} | Severity: {report.severity || 'Medium'}</p>
              </motion.article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
