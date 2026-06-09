import { accessibilityModes } from '../../data/safetyZones.js';

export default function AccessibilityModeSelector({ mode, setMode }) {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {accessibilityModes.map((item) => (
        <button key={item.id} onClick={() => setMode(item.id)} title={item.focus} className={`min-h-12 rounded-xl border px-3 py-2 text-left text-xs font-bold transition ${mode === item.id ? 'border-danger/70 bg-danger/15 text-white shadow-[0_0_18px_rgba(255,45,45,0.22)]' : 'border-white/10 bg-white/5 text-slate-300 hover:border-danger/40'}`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
