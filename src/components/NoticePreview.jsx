import { Download, Mail, MessageCircle } from 'lucide-react';

export default function NoticePreview({ text, ready, onDownload }) {
  return (
    <section className="glass-card flex min-h-[610px] flex-col overflow-hidden">
      <div className="border-b border-white/10 bg-white/[0.03] p-5 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.08em] text-white">Government of India</p>
        <p className="text-xs text-slate-400">Ministry of Road Transport & Highways</p>
        <p className="mt-1 text-xs font-semibold text-danger">PUBLIC WORKS DEPARTMENT - REPAIR NOTICE</p>
      </div>
      <pre className="flex-1 whitespace-pre-wrap p-5 font-sans text-sm leading-7 text-slate-200">
        {text || 'Official letterhead ready. AI legal notice stream will appear here.'}
        {text && !ready ? <span className="ml-1 inline-block h-4 w-2 animate-blink bg-danger align-middle" /> : null}
      </pre>
      <div className="grid gap-3 border-t border-white/10 p-4 md:grid-cols-3">
        <button onClick={onDownload} disabled={!ready} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-danger px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-slate-500"><Download size={17} />Download PDF</button>
        <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold hover:border-danger/40"><MessageCircle size={17} />WhatsApp</button>
        <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold hover:border-danger/40"><Mail size={17} />Email DC</button>
      </div>
    </section>
  );
}
