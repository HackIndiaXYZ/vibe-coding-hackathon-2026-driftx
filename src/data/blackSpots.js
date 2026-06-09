export const blackSpots = [
  { id: 'BS-NH48-001', name: 'NH-48 Gurgaon-Manesar', nhNumber: 'NH-48', lat: 28.3574, lng: 76.9182, deaths: 47, risk: 91, baseRisk: 67, district: 'Gurugram', state: 'Haryana', division: 'Gurugram PWD Division', contractor: 'KRR Infra Projects', lastAccident: '7h ago', weather: 'Rain detected', quote: 'This corridor reflects delayed black spot remediation despite repeated fatality reporting.' },
  { id: 'BS-NH44-012', name: 'NH-44 Agra Bypass', nhNumber: 'NH-44', lat: 27.1767, lng: 78.0081, deaths: 38, risk: 84, baseRisk: 62, district: 'Agra', state: 'Uttar Pradesh', division: 'Agra NH Division', contractor: 'Bharat Roadworks', lastAccident: '13h ago', weather: 'Low visibility', quote: 'Unsafe median openings and missing crash barriers remain unresolved.' },
  { id: 'BS-NH8-023', name: 'NH-8 Jaipur-Ajmer', nhNumber: 'NH-8', lat: 26.4499, lng: 74.6399, deaths: 33, risk: 79, baseRisk: 58, district: 'Ajmer', state: 'Rajasthan', division: 'Ajmer PWD Circle', contractor: 'DesertLine Infra', lastAccident: '1d ago', weather: 'Crosswinds', quote: 'The stretch has been flagged for geometric correction since 2023.' },
  { id: 'BS-NH7-034', name: 'NH-7 Nagpur-Hyderabad', nhNumber: 'NH-7', lat: 19.9975, lng: 79.0011, deaths: 29, risk: 76, baseRisk: 55, district: 'Nagpur', state: 'Maharashtra', division: 'Nagpur Road Safety Cell', contractor: 'Dakshin EPC', lastAccident: '18h ago', weather: 'Wet surface', quote: 'Repeated night crashes show enforcement cannot substitute engineering repair.' },
  { id: 'BS-NH2-045', name: 'NH-2 Allahabad-Varanasi', nhNumber: 'NH-2', lat: 25.4358, lng: 81.8463, deaths: 41, risk: 88, baseRisk: 64, district: 'Prayagraj', state: 'Uttar Pradesh', division: 'Prayagraj PWD Division', contractor: 'Ganga Express Infra', lastAccident: '9h ago', weather: 'Fog pockets', quote: 'Black spot closure claims do not match field-level crash recurrence.' },
  { id: 'BS-NH6-056', name: 'NH-6 Surat-Vadodara', nhNumber: 'NH-6', lat: 21.8974, lng: 73.2156, deaths: 22, risk: 71, baseRisk: 52, district: 'Surat', state: 'Gujarat', division: 'Surat PWD Division', contractor: 'Western Buildcon', lastAccident: '2d ago', weather: 'Clear', quote: 'Industrial freight conflict remains unmanaged at access roads.' },
  { id: 'BS-NH1-067', name: 'NH-1 Ambala-Ludhiana', nhNumber: 'NH-1', lat: 30.3782, lng: 76.7767, deaths: 31, risk: 82, baseRisk: 61, district: 'Ambala', state: 'Haryana', division: 'Ambala PWD Division', contractor: 'NorthStar Highways', lastAccident: '11h ago', weather: 'Rain detected', quote: 'The committee noted preventable loss from delayed lane discipline works.' },
  { id: 'BS-NH4-078', name: 'NH-4 Pune-Kolhapur', nhNumber: 'NH-4', lat: 16.705, lng: 74.2433, deaths: 26, risk: 73, baseRisk: 53, district: 'Kolhapur', state: 'Maharashtra', division: 'Kolhapur PWD Circle', contractor: 'Sahyadri Roads', lastAccident: '31h ago', weather: 'Wet surface', quote: 'Slope and merge conflicts continue to amplify heavy-vehicle crashes.' },
  { id: 'BS-NH31-089', name: 'NH-31 Siliguri Corridor', nhNumber: 'NH-31', lat: 26.7271, lng: 88.3953, deaths: 35, risk: 85, baseRisk: 63, district: 'Jalpaiguri', state: 'West Bengal', division: 'Jalpaiguri PWD Division', contractor: 'Eastern Corridors Ltd', lastAccident: '6h ago', weather: 'Fog pockets', quote: 'Strategic corridor risk has direct public safety and supply chain impact.' },
  { id: 'BS-NH17-090', name: 'NH-17 Goa-Mumbai Coastal', nhNumber: 'NH-17', lat: 15.4909, lng: 73.8278, deaths: 19, risk: 68, baseRisk: 50, district: 'North Goa', state: 'Goa', division: 'Panaji PWD Division', contractor: 'Konkan Mobility', lastAccident: '3d ago', weather: 'Clear', quote: 'Tourism traffic and blind coastal bends require urgent calming measures.' }
];

export const stateData = {
  'Uttar Pradesh': { total: 1247, fixed: 89, deaths: 22669, color: 'crisis', notices: 1158 },
  'Tamil Nadu': { total: 843, fixed: 234, deaths: 17884, color: 'critical', notices: 609 },
  Maharashtra: { total: 731, fixed: 145, deaths: 13846, color: 'crisis', notices: 586 },
  'Madhya Pradesh': { total: 689, fixed: 67, deaths: 13405, color: 'crisis', notices: 622 },
  Karnataka: { total: 521, fixed: 178, deaths: 11512, color: 'critical', notices: 343 },
  Rajasthan: { total: 498, fixed: 56, deaths: 10850, color: 'crisis', notices: 442 },
  'Andhra Pradesh': { total: 445, fixed: 134, deaths: 10104, color: 'critical', notices: 311 },
  Gujarat: { total: 412, fixed: 198, deaths: 8988, color: 'poor', notices: 214 },
  Telangana: { total: 334, fixed: 89, deaths: 7521, color: 'critical', notices: 245 },
  'West Bengal': { total: 298, fixed: 45, deaths: 6954, color: 'crisis', notices: 253 }
};

export const noticeSeed = [
  ['09 Jun 2026 09:08', 'NH-44 Agra Bypass', 84, 'Acknowledged'],
  ['09 Jun 2026 08:41', 'NH-2 Allahabad-Varanasi', 88, 'Sent'],
  ['08 Jun 2026 21:20', 'NH-31 Siliguri Corridor', 85, 'Generated'],
  ['08 Jun 2026 17:32', 'NH-1 Ambala-Ludhiana', 82, 'Road Fixed'],
  ['08 Jun 2026 14:12', 'NH-48 Gurgaon-Manesar', 91, 'Sent']
];

export const mediumRiskZones = [
  { id: 'MR-DLI-001', name: 'Delhi-Gurugram Toll Merge', lat: 28.4949, lng: 77.0887, risk: 58 },
  { id: 'MR-JPR-002', name: 'Jaipur Ring Road Connector', lat: 26.9124, lng: 75.7873, risk: 54 },
  { id: 'MR-PUN-003', name: 'Pune Katraj Bypass', lat: 18.4575, lng: 73.8671, risk: 56 },
  { id: 'MR-HYD-004', name: 'Hyderabad ORR Service Lane', lat: 17.385, lng: 78.4867, risk: 52 },
  { id: 'MR-LKO-005', name: 'Lucknow Faizabad Cut', lat: 26.8467, lng: 80.9462, risk: 59 }
];

export const safeStretches = [
  { id: 'SAFE-DEL-001', name: 'Dwarka Expressway audited stretch', lat: 28.522, lng: 77.034, verified: 'Crash barrier verified' },
  { id: 'SAFE-GUJ-002', name: 'Vadodara NE corridor', lat: 22.3072, lng: 73.1812, verified: 'Lighting and markings verified' },
  { id: 'SAFE-KAR-003', name: 'Bengaluru NICE Road zone', lat: 12.872, lng: 77.578, verified: 'Median protection verified' },
  { id: 'SAFE-TN-004', name: 'Chennai OMR safety patch', lat: 12.9165, lng: 80.229, verified: 'Speed calming verified' },
  { id: 'SAFE-MH-005', name: 'Mumbai-Pune safety bay', lat: 18.7597, lng: 73.4091, verified: 'Emergency bay verified' }
];
