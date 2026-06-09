import { safetyLanguages } from '../../data/safetyZones.js';

export default function LanguageToggle({ language, setLanguage }) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
      {Object.entries(safetyLanguages).map(([id, item]) => (
        <button key={id} onClick={() => setLanguage(id)} className={`h-11 rounded-xl text-xs font-extrabold transition ${language === id ? 'bg-white text-[#0A0F1E]' : 'text-slate-300 hover:bg-white/10'}`}>
          {item.label}
        </button>
      ))}
    </div>
  );
}
