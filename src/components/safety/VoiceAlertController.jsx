import { Volume2, VolumeX } from 'lucide-react';

export function speakSafety(text, language) {
  if (!('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
  utterance.rate = language === 'en' ? 0.94 : 0.88;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function vibrateForSeverity(severity) {
  if (!('vibrate' in navigator)) return false;
  if (severity === 'red') navigator.vibrate([300, 100, 300, 100, 300]);
  else if (severity === 'amber') navigator.vibrate([160, 90, 160]);
  else navigator.vibrate(60);
  return true;
}

export default function VoiceAlertController({ enabled, setEnabled, lastSupportMessage }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
      <div>
        <p className="text-sm font-bold text-white">Voice + vibration alerts</p>
        <p className="mt-1 text-xs text-slate-400">{lastSupportMessage || 'Hindi, Marathi, and English supported when browser allows it.'}</p>
      </div>
      <button onClick={() => setEnabled(!enabled)} className={`grid h-12 w-12 place-items-center rounded-2xl ${enabled ? 'bg-emerald-500 text-[#062016]' : 'bg-white/10 text-slate-300'}`}>
        {enabled ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>
    </div>
  );
}
