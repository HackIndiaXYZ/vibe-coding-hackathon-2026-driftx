import { DivIcon } from 'leaflet';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPinned, Route, Volume2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Circle, MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import AccessibilityModeSelector from '../components/safety/AccessibilityModeSelector.jsx';
import DangerAlertBanner from '../components/safety/DangerAlertBanner.jsx';
import DangerZoneCard from '../components/safety/DangerZoneCard.jsx';
import DemoDriveSimulator from '../components/safety/DemoDriveSimulator.jsx';
import DriverModePage from '../components/safety/DriverModePage.jsx';
import LanguageToggle from '../components/safety/LanguageToggle.jsx';
import SafeRouteComparison from '../components/safety/SafeRouteComparison.jsx';
import SafetyLegend from '../components/safety/SafetyLegend.jsx';
import SafetyStory from '../components/safety/SafetyStory.jsx';
import VoiceAlertController, { speakSafety, vibrateForSeverity } from '../components/safety/VoiceAlertController.jsx';
import { demoDrivePath, hazardTypeIcon, safetyZones } from '../data/safetyZones.js';
import { fallbackSafetyExplanation, fetchSafetyExplanation } from '../utils/safetyExplain.js';

const CARTO_DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const MAP_CENTER = [19.65, 74.35];

const severityColor = {
  red: '#EF4444',
  amber: '#F59E0B',
  green: '#10B981'
};

const severityOpacity = {
  red: 0.25,
  amber: 0.2,
  green: 0.15
};

function distanceKm(a, b) {
  const earthRadius = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadius * Math.asin(Math.sqrt(h));
}

function prioritizedZones(mode) {
  return [...safetyZones].sort((a, b) => {
    const aBoost = a.modePriority?.includes(mode) ? 30 : 0;
    const bBoost = b.modePriority?.includes(mode) ? 30 : 0;
    return b.risk + bBoost - (a.risk + aBoost);
  });
}

function makeDriverIcon() {
  return new DivIcon({
    className: 'safety-driver-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    html: '<div class="grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-blue-500 text-white shadow-[0_0_28px_rgba(59,130,246,0.6)]">●</div>'
  });
}

function makeZoneIcon(zone, active) {
  const color = severityColor[zone.severity];
  return new DivIcon({
    className: 'safety-zone-marker',
    iconSize: [58, 58],
    iconAnchor: [29, 29],
    html: `
      <button class="relative grid h-14 w-14 place-items-center rounded-full border-2 text-2xl font-black text-white ${active ? 'scale-125' : ''}" style="background:${color};border-color:rgba(255,255,255,0.75);box-shadow:0 0 24px ${color}66">
        <span class="absolute h-16 w-16 animate-radar rounded-full border" style="border-color:${color};background:${color}22"></span>
        <span class="relative">${hazardTypeIcon[zone.type] || '!'}</span>
      </button>
    `
  });
}

function PanToZone({ zone }) {
  const map = useMap();
  useEffect(() => {
    if (zone) map.flyTo([zone.lat, zone.lng], zone.severity === 'green' ? 12 : 13, { duration: 0.75 });
  }, [map, zone]);
  return null;
}

export default function SafetyMapPage() {
  const watchRef = useRef(null);
  const demoTimerRef = useRef(null);
  const alertedRef = useRef(new Set());
  const [language, setLanguage] = useState('hi');
  const [mode, setMode] = useState('twoWheeler');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [supportMessage, setSupportMessage] = useState('Token-free CartoDB map active.');
  const [activeZone, setActiveZone] = useState(() => prioritizedZones('twoWheeler')[0]);
  const [explanation, setExplanation] = useState(() => fallbackSafetyExplanation(prioritizedZones('twoWheeler')[0], 'hi'));
  const [driverLocation, setDriverLocation] = useState(null);
  const [alertZone, setAlertZone] = useState(null);
  const [driverMode, setDriverMode] = useState(true);
  const [demoRunning, setDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(null);
  const [routeStatus, setRouteStatus] = useState('Token-free safe route comparison ready.');
  const [safeRouteActive, setSafeRouteActive] = useState(false);

  const zones = useMemo(() => prioritizedZones(mode), [mode]);
  const distance = driverLocation ? distanceKm(driverLocation, activeZone) : activeZone.distance;
  const safeRouteLine = useMemo(() => {
    const green = safetyZones.filter((zone) => zone.severity === 'green');
    const amber = safetyZones.filter((zone) => zone.severity === 'amber').slice(0, 2);
    return [...green, ...amber, green[0]].filter(Boolean).map((zone) => [zone.lat, zone.lng]);
  }, []);
  const demoDriverPosition = useMemo(() => {
    const zone = safetyZones.find((item) => item.id === demoStep?.zoneId);
    if (zone) return [zone.lat + 0.01, zone.lng + 0.01];
    if (driverLocation) return [driverLocation.lat, driverLocation.lng];
    return [19.0544, 72.8295];
  }, [demoStep, driverLocation]);

  useEffect(() => {
    let alive = true;
    fetchSafetyExplanation(activeZone, mode, language).then((result) => {
      if (alive) setExplanation(result);
    });
    return () => { alive = false; };
  }, [activeZone, mode, language]);

  const alertForZone = useCallback((zone, nextExplanation = explanation) => {
    setAlertZone(zone);
    if (voiceEnabled) {
      const speechOk = speakSafety(nextExplanation.voiceAlert || nextExplanation.warning, language);
      const vibrationOk = vibrateForSeverity(zone.severity);
      if (!speechOk && !vibrationOk) setSupportMessage('Voice and vibration are not supported in this browser.');
      else if (!speechOk) setSupportMessage('Speech is unavailable. Visual warning is active.');
      else if (!vibrationOk) setSupportMessage('Vibration is unavailable. Voice warning is active.');
      else setSupportMessage('Voice and vibration alert sent.');
    }
    setTimeout(() => setAlertZone(null), zone.severity === 'red' ? 7600 : 5200);
  }, [explanation, language, voiceEnabled]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setSupportMessage('Location unavailable. Demo Drive still works.');
      return;
    }
    watchRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = { lat: position.coords.latitude, lng: position.coords.longitude };
        setDriverLocation(location);
        const nearest = safetyZones
          .filter((zone) => zone.severity !== 'green')
          .map((zone) => ({ zone, distance: distanceKm(location, zone) }))
          .sort((a, b) => a.distance - b.distance)[0];
        if (nearest && nearest.distance <= 3 && !alertedRef.current.has(nearest.zone.id)) {
          alertedRef.current.add(nearest.zone.id);
          setActiveZone(nearest.zone);
          alertForZone(nearest.zone);
        }
      },
      () => setSupportMessage('Location permission denied. Demo Drive still works.'),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchRef.current);
  }, [alertForZone]);

  const selectZone = async (zone) => {
    setActiveZone(zone);
    const result = await fetchSafetyExplanation(zone, mode, language);
    setExplanation(result);
    if (zone.severity !== 'green') alertForZone(zone, result);
  };

  const startDemo = () => {
    setDemoRunning(true);
    let index = 0;
    const run = async () => {
      const step = demoDrivePath[index];
      const zone = safetyZones.find((item) => item.id === step.zoneId) || safetyZones[0];
      setDemoStep(step);
      setActiveZone(zone);
      const result = await fetchSafetyExplanation(zone, mode, language);
      setExplanation(result);
      if (zone.severity !== 'green') alertForZone(zone, result);
      index += 1;
      if (index >= demoDrivePath.length) {
        setDemoRunning(false);
        return;
      }
      demoTimerRef.current = setTimeout(run, 3600);
    };
    run();
  };

  const stopDemo = () => {
    setDemoRunning(false);
    clearTimeout(demoTimerRef.current);
  };

  const safeRoute = () => {
    setSafeRouteActive(true);
    setRouteStatus('Safe route active locally: avoids red zones and prefers green/amber stretches.');
  };

  return (
    <section className="app-container pb-10">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_390px] 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative h-[580px] overflow-hidden rounded-[28px] border border-white/10 bg-[#071222] shadow-glass sm:h-[660px] lg:h-[760px]">
          <MapContainer center={MAP_CENTER} zoom={7} minZoom={5} maxZoom={15} zoomControl={false} attributionControl={false} className="absolute inset-0 h-full w-full">
            <TileLayer url={CARTO_DARK_TILES} subdomains="abcd" maxZoom={19} />
            <PanToZone zone={activeZone} />
            {safetyZones.map((zone) => (
              <Circle
                key={`${zone.id}-circle`}
                center={[zone.lat, zone.lng]}
                radius={zone.severity === 'red' ? 800 : zone.severity === 'amber' ? 650 : 700}
                pathOptions={{ color: severityColor[zone.severity], fillColor: severityColor[zone.severity], fillOpacity: severityOpacity[zone.severity], weight: zone.severity === 'red' ? 2 : 1.5 }}
                eventHandlers={{ click: () => selectZone(zone) }}
              />
            ))}
            {safetyZones.map((zone) => (
              <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={makeZoneIcon(zone, activeZone.id === zone.id)} eventHandlers={{ click: () => selectZone(zone) }} />
            ))}
            {safeRouteActive && <Polyline positions={safeRouteLine} pathOptions={{ color: '#10B981', weight: 6, opacity: 0.92, dashArray: '10 12' }} />}
            <Marker position={demoDriverPosition} icon={makeDriverIcon()} />
          </MapContainer>

          <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex flex-wrap items-center justify-between gap-2">
            <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#0A0F1E]/85 px-4 py-3 backdrop-blur-xl">
              <p className="text-lg font-black text-white">Safety Map + Voice Driver Mode</p>
              <p className="text-xs font-semibold text-slate-400">Token-free CartoDB map + emergency alert system + Indian road safety assistant</p>
            </div>
            <button onClick={() => setDriverMode(!driverMode)} className="pointer-events-auto h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-sm font-extrabold text-white backdrop-blur-xl">
              {driverMode ? 'Map + Cards' : 'Driver Mode'}
            </button>
          </div>
          {!driverMode && (
            <div className="absolute inset-x-3 bottom-3 z-[500]">
              <DriverModePage zone={activeZone} explanation={explanation} distance={distance} />
            </div>
          )}
          <button onClick={safeRoute} className="absolute bottom-5 left-5 z-[510] flex h-12 items-center gap-2 rounded-full bg-emerald-500 px-5 text-sm font-extrabold text-[#062016] shadow-[0_0_28px_rgba(16,185,129,0.32)]">
            <Route size={18} /> Safe Route
          </button>
          <button onClick={() => alertForZone(activeZone)} className="absolute bottom-5 right-5 z-[510] flex h-12 items-center gap-2 rounded-full bg-danger px-5 text-sm font-extrabold text-white shadow-[0_0_28px_rgba(255,45,45,0.36)]">
            <Volume2 size={18} /> Test Voice
          </button>
        </div>

        <aside className="space-y-4">
          <SafetyLegend />
          <LanguageToggle language={language} setLanguage={setLanguage} />
          <AccessibilityModeSelector mode={mode} setMode={setMode} />
          <VoiceAlertController enabled={voiceEnabled} setEnabled={setVoiceEnabled} lastSupportMessage={supportMessage} />
          <DemoDriveSimulator running={demoRunning} startDemo={startDemo} stopDemo={stopDemo} activeStep={demoStep} />
          <DangerZoneCard zone={activeZone} explanation={explanation} />
          <SafeRouteComparison mode={mode} />
          <SafetyStory />
          <section className="glass-card p-4">
            <p className="text-sm font-extrabold text-white">Priority hazards for this mode</p>
            <div className="mt-3 grid gap-2">
              {zones.slice(0, 5).map((zone) => (
                <button key={zone.id} onClick={() => selectZone(zone)} className={`flex items-center justify-between rounded-2xl border p-3 text-left transition ${activeZone.id === zone.id ? 'border-danger/50 bg-danger/10' : 'border-white/10 bg-white/5 hover:border-danger/30'}`}>
                  <span className="flex items-center gap-2 text-sm font-bold text-white"><span className="text-xl">{hazardTypeIcon[zone.type]}</span>{zone.road}</span>
                  <span className="font-mono text-sm font-black" style={{ color: severityColor[zone.severity] }}>{zone.risk}</span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>
      <DangerAlertBanner zone={alertZone} explanation={explanation} distance={distance} onSpeak={() => speakSafety(explanation.voiceAlert || explanation.warning, language)} />
      <div className="sr-only" aria-live="assertive">{alertZone ? explanation.warning : ''}</div>
      <div className="hidden"><AlertTriangle /><MapPinned /></div>
    </section>
  );
}
