import { motion } from 'framer-motion';
import { Crosshair, Layers, LocateFixed, Minus, Plus } from 'lucide-react';
import { DivIcon } from 'leaflet';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import { blackSpots } from '../data/blackSpots.js';
import { riskColor } from './RiskScore.jsx';

const INDIA_CENTER = [22.5937, 78.9629];
const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

function markerDuration(score) {
  if (score > 80) return 0.8;
  if (score >= 60) return 1.5;
  return 2.5;
}

function createPulseIcon(spot) {
  const color = riskColor(spot.risk);
  const duration = markerDuration(spot.risk);
  return new DivIcon({
    className: 'leaflet-pulse-marker',
    iconSize: [54, 54],
    iconAnchor: [27, 27],
    html: `
      <button class="marker" style="--risk:${color};--pulse:${duration}s" aria-label="${spot.name}">
        <span class="marker-pulse outer"></span>
        <span class="marker-pulse inner"></span>
        <span class="marker-core"></span>
      </button>
    `
  });
}

function FlyToSpot({ spot }) {
  const map = useMap();
  useEffect(() => {
    if (!spot) return;
    map.flyTo([spot.lat, spot.lng], 7, { duration: 0.9 });
  }, [map, spot]);
  return null;
}

function MapControls({ selectedSpot }) {
  const map = useMap();
  const actions = [
    { icon: Plus, label: 'Zoom in', onClick: () => map.zoomIn() },
    { icon: Minus, label: 'Zoom out', onClick: () => map.zoomOut() },
    { icon: Layers, label: 'Show all black spots', onClick: () => map.flyTo(INDIA_CENTER, 4.2, { duration: 0.8 }) },
    { icon: Crosshair, label: 'Show NH only', onClick: () => selectedSpot && map.flyTo([selectedSpot.lat, selectedSpot.lng], 7, { duration: 0.8 }) },
    { icon: LocateFixed, label: 'India view', onClick: () => map.flyTo(INDIA_CENTER, 4.2, { duration: 0.8 }) }
  ];
  return (
    <div className="absolute right-4 top-4 z-[500] flex flex-col gap-2">
      {actions.map(({ icon: Icon, label, onClick }) => (
        <button key={label} onClick={onClick} aria-label={label} title={label} className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#0A0F1E]/75 text-white backdrop-blur-xl hover:border-danger/50">
          <Icon size={18} />
        </button>
      ))}
    </div>
  );
}

function SelectedPanel({ spot }) {
  if (!spot) return null;
  return (
    <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="absolute bottom-4 left-4 right-4 z-[500] max-w-[calc(100%-2rem)] rounded-2xl border border-danger/30 bg-[#0A0F1E]/90 p-4 backdrop-blur-xl sm:left-auto sm:w-[430px]">
      <div className="flex min-w-0 items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-white">{spot.name}</p>
          <p className="mt-1 truncate text-xs text-slate-400">{spot.id} | {spot.district}, {spot.state}</p>
        </div>
        <span className="shrink-0 font-mono text-3xl font-black text-danger">{spot.risk}%</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
        <span className="truncate">{spot.weather}</span>
        <span className="truncate">{spot.deaths} deaths / 3 yrs</span>
        <span className="truncate">{spot.division}</span>
        <span className="truncate">{spot.contractor}</span>
      </div>
    </motion.div>
  );
}

export default function MapView({ selectedSpot, onSelect, demoStep }) {
  return (
    <div className="relative h-[520px] overflow-hidden rounded-[24px] border border-white/10 bg-panel shadow-glass sm:h-[600px] lg:h-[680px]">
      <MapContainer center={INDIA_CENTER} zoom={4.2} minZoom={4} maxZoom={12} zoomControl={false} attributionControl={false} className="h-full w-full bg-[#071222]">
        <TileLayer url={CARTO_DARK_TILES} subdomains="abcd" maxZoom={19} />
        <FlyToSpot spot={selectedSpot} />
        <MapControls selectedSpot={selectedSpot} />
        {blackSpots.map((spot, index) => (
          <Marker
            key={spot.id}
            position={[spot.lat, spot.lng]}
            icon={createPulseIcon(spot)}
            eventHandlers={{ click: () => onSelect(spot) }}
            zIndexOffset={spot.risk * 10 + index}
          />
        ))}
      </MapContainer>
      <div className="absolute left-4 top-4 z-[500] rounded-full border border-white/10 bg-[#0A0F1E]/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-slate-300 backdrop-blur-xl">10 live black spots</div>
      <SelectedPanel spot={selectedSpot} />
    </div>
  );
}
