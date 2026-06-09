import { AlertTriangle, ShieldCheck, TriangleAlert } from 'lucide-react';

export default function SafetyLegend() {
  const items = [
    { label: 'High danger', icon: AlertTriangle, color: 'text-red-200', bg: 'bg-red-500/15 border-red-400/30' },
    { label: 'Medium danger', icon: TriangleAlert, color: 'text-amber-200', bg: 'bg-amber-500/15 border-amber-400/30' },
    { label: 'Safe road', icon: ShieldCheck, color: 'text-emerald-200', bg: 'bg-emerald-500/15 border-emerald-400/30' }
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map(({ label, icon: Icon, color, bg }) => (
        <div key={label} className={`rounded-2xl border p-3 ${bg} ${color}`}>
          <Icon size={22} />
          <p className="mt-2 text-xs font-extrabold">{label}</p>
        </div>
      ))}
    </div>
  );
}
