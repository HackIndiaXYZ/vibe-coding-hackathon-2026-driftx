export const safetyLanguages = {
  en: { label: 'Simple English', speechLang: 'en-IN' },
  hi: { label: 'Hindi', speechLang: 'hi-IN' },
  mr: { label: 'Marathi', speechLang: 'mr-IN' }
};

export const accessibilityModes = [
  { id: 'twoWheeler', label: 'Two-wheeler Mode', focus: 'potholes, speed breakers, slippery patches' },
  { id: 'autoDriver', label: 'Auto Driver Mode', focus: 'turns, signals, wrong-side traffic' },
  { id: 'schoolRoute', label: 'School Route Mode', focus: 'school zones, crossings, speeding risk' },
  { id: 'senior', label: 'Senior Citizen Mode', focus: 'simple early warnings and slower decisions' },
  { id: 'night', label: 'Night Travel Mode', focus: 'no streetlight, blind turns, accident zones' },
  { id: 'rain', label: 'Rain Mode', focus: 'waterlogging, potholes, slippery roads' }
];

export const hazardTypeIcon = {
  pothole: '🕳',
  accidentTurn: '↪',
  waterlogging: '☔',
  noStreetlight: '◐',
  brokenSignal: '🚦',
  wrongSide: '⛔',
  speedBreaker: '▰',
  blindTurn: '⤴',
  schoolZone: '🎒',
  safe: '✓'
};

export const safetyZones = [
  {
    id: 'SAFE-MUM-001',
    city: 'Mumbai',
    road: 'Bandra Reclamation Link',
    lat: 19.0544,
    lng: 72.8295,
    type: 'safe',
    severity: 'green',
    risk: 18,
    distance: 0.8,
    recommendedSpeed: 45,
    modePriority: ['senior'],
    languageWarnings: {
      en: 'Safe road. Keep steady speed.',
      hi: 'सड़क सुरक्षित है। गति समान रखें।',
      mr: 'रस्ता सुरक्षित आहे. गती स्थिर ठेवा.'
    },
    riskReason: 'Verified lighting and smoother carriageway.',
    prevention: 'Keep lane discipline and continue carefully.'
  },
  {
    id: 'HZ-MUM-101',
    city: 'Mumbai',
    road: 'Mumbai Bandra road pothole',
    lat: 19.0596,
    lng: 72.8352,
    type: 'pothole',
    severity: 'red',
    risk: 92,
    distance: 2.4,
    recommendedSpeed: 20,
    modePriority: ['twoWheeler', 'rain', 'senior'],
    languageWarnings: {
      en: 'Pothole ahead. Please slow down.',
      hi: 'आगे गड्ढा है। गाड़ी धीरे करें।',
      mr: 'पुढे खड्डा आहे. गाडी हळू करा.'
    },
    riskReason: 'Deep pothole can throw two-wheelers off balance.',
    prevention: 'Slow down early and avoid sudden swerving.',
    authoritySummary: 'High-risk pothole on Mumbai Bandra road. Priority repair recommended.'
  },
  {
    id: 'HZ-NSK-201',
    city: 'Nashik',
    road: 'Nashik College Road accident turn',
    lat: 20.0059,
    lng: 73.7796,
    type: 'accidentTurn',
    severity: 'red',
    risk: 88,
    distance: 1.6,
    recommendedSpeed: 25,
    modePriority: ['twoWheeler', 'schoolRoute', 'night'],
    languageWarnings: {
      en: 'Dangerous turn ahead. Slow down.',
      hi: 'आगे खतरनाक मोड़ है। गाड़ी धीरे करें।',
      mr: 'पुढे धोकादायक वळण आहे. गाडी हळू करा.'
    },
    riskReason: 'Sharp turn with repeated crash reports near student traffic.',
    prevention: 'Reduce speed before the turn and keep left.',
    authoritySummary: 'Accident-prone turn near Nashik College Road. Signage and calming needed.'
  },
  {
    id: 'HZ-PUN-301',
    city: 'Pune',
    road: 'Pune waterlogging zone',
    lat: 18.5204,
    lng: 73.8567,
    type: 'waterlogging',
    severity: 'amber',
    risk: 63,
    distance: 3.1,
    recommendedSpeed: 25,
    modePriority: ['rain', 'twoWheeler'],
    languageWarnings: {
      en: 'Water ahead. Slow down.',
      hi: 'आगे पानी भरा है। धीरे चलें।',
      mr: 'पुढे पाणी साचले आहे. हळू चला.'
    },
    riskReason: 'Water hides potholes and reduces tyre grip.',
    prevention: 'Avoid sudden braking and keep extra distance.',
    authoritySummary: 'Waterlogging zone in Pune. Drainage inspection recommended.'
  },
  {
    id: 'HZ-NGP-401',
    city: 'Nagpur',
    road: 'Nagpur no streetlight zone',
    lat: 21.1458,
    lng: 79.0882,
    type: 'noStreetlight',
    severity: 'amber',
    risk: 66,
    distance: 2.7,
    recommendedSpeed: 30,
    modePriority: ['night', 'senior'],
    languageWarnings: {
      en: 'Dark road ahead. Slow down.',
      hi: 'आगे अंधेरी सड़क है। धीरे चलें।',
      mr: 'पुढे अंधारा रस्ता आहे. हळू चला.'
    },
    riskReason: 'Poor lighting makes pedestrians and road edges hard to see.',
    prevention: 'Use low speed and watch for people crossing.',
    authoritySummary: 'No-streetlight risk zone in Nagpur. Lighting repair recommended.'
  },
  {
    id: 'HZ-AWB-501',
    city: 'Aurangabad',
    road: 'Aurangabad broken signal',
    lat: 19.8762,
    lng: 75.3433,
    type: 'brokenSignal',
    severity: 'red',
    risk: 84,
    distance: 1.1,
    recommendedSpeed: 15,
    modePriority: ['autoDriver', 'schoolRoute', 'senior'],
    languageWarnings: {
      en: 'Signal not working. Go slow.',
      hi: 'सिग्नल खराब है। धीरे चलें।',
      mr: 'सिग्नल बंद आहे. हळू चला.'
    },
    riskReason: 'Drivers may cross from all sides without clear priority.',
    prevention: 'Stop, look both ways, and move slowly.',
    authoritySummary: 'Broken signal at Aurangabad junction. Immediate repair required.'
  },
  {
    id: 'HZ-PUN-601',
    city: 'Pune',
    road: 'Unsafe speed breaker',
    lat: 18.531,
    lng: 73.8446,
    type: 'speedBreaker',
    severity: 'amber',
    risk: 58,
    distance: 2.2,
    recommendedSpeed: 20,
    modePriority: ['twoWheeler', 'senior'],
    languageWarnings: {
      en: 'Speed breaker ahead. Slow down.',
      hi: 'आगे स्पीड ब्रेकर है। धीरे चलें।',
      mr: 'पुढे स्पीड ब्रेकर आहे. हळू चला.'
    },
    riskReason: 'Unmarked speed breaker can cause sudden braking.',
    prevention: 'Reduce speed before the bump.',
    authoritySummary: 'Unsafe unmarked speed breaker. Marking and warning sign recommended.'
  },
  {
    id: 'HZ-MUM-701',
    city: 'Mumbai',
    road: 'Wrong-side driving zone',
    lat: 19.076,
    lng: 72.8777,
    type: 'wrongSide',
    severity: 'red',
    risk: 86,
    distance: 2.9,
    recommendedSpeed: 25,
    modePriority: ['autoDriver', 'twoWheeler', 'night'],
    languageWarnings: {
      en: 'Wrong-side vehicles ahead. Stay alert.',
      hi: 'आगे उल्टी दिशा से गाड़ी आ सकती है। सावधान रहें।',
      mr: 'पुढे उलट दिशेने वाहने येऊ शकतात. सावध रहा.'
    },
    riskReason: 'Unexpected oncoming vehicles create head-on collision risk.',
    prevention: 'Keep left, slow down, and avoid overtaking.',
    authoritySummary: 'Wrong-side driving hotspot. Enforcement and divider control needed.'
  },
  {
    id: 'HZ-NSK-801',
    city: 'Nashik',
    road: 'Blind turn near flyover',
    lat: 19.9975,
    lng: 73.7898,
    type: 'blindTurn',
    severity: 'amber',
    risk: 61,
    distance: 3.4,
    recommendedSpeed: 25,
    modePriority: ['night', 'twoWheeler'],
    languageWarnings: {
      en: 'Blind turn ahead. Slow down.',
      hi: 'आगे अंधा मोड़ है। धीरे चलें।',
      mr: 'पुढे अंध वळण आहे. हळू चला.'
    },
    riskReason: 'Vehicles are visible late because of the flyover curve.',
    prevention: 'Slow before the curve and do not overtake.',
    authoritySummary: 'Blind turn risk near flyover. Mirror and warning sign recommended.'
  },
  {
    id: 'HZ-AWB-901',
    city: 'Aurangabad',
    road: 'School zone risk',
    lat: 19.889,
    lng: 75.321,
    type: 'schoolZone',
    severity: 'amber',
    risk: 69,
    distance: 1.9,
    recommendedSpeed: 15,
    modePriority: ['schoolRoute', 'senior'],
    languageWarnings: {
      en: 'School zone ahead. Drive very slow.',
      hi: 'आगे स्कूल है। बहुत धीरे चलें।',
      mr: 'पुढे शाळा आहे. खूप हळू चला.'
    },
    riskReason: 'Children may cross suddenly near the school gate.',
    prevention: 'Drive below 15 km/h and stop for crossings.',
    authoritySummary: 'School zone risk. Crossing guard, signs, and speed control recommended.'
  },
  {
    id: 'SAFE-NSK-002',
    city: 'Nashik',
    road: 'College Road verified safe stretch',
    lat: 20.0108,
    lng: 73.7679,
    type: 'safe',
    severity: 'green',
    risk: 22,
    distance: 4.1,
    recommendedSpeed: 40,
    modePriority: ['schoolRoute'],
    languageWarnings: {
      en: 'Safe stretch. Keep steady speed.',
      hi: 'सुरक्षित सड़क है। आराम से चलें।',
      mr: 'सुरक्षित रस्ता आहे. शांतपणे चला.'
    },
    riskReason: 'Marked crossing and visible road edges.',
    prevention: 'Maintain lane and watch for pedestrians.'
  }
];

export const demoDrivePath = [
  { id: 'demo-green', label: 'Green safe zone', zoneId: 'SAFE-MUM-001', progress: 12 },
  { id: 'demo-amber', label: 'Amber medium zone', zoneId: 'HZ-PUN-301', progress: 52 },
  { id: 'demo-red', label: 'Red danger zone', zoneId: 'HZ-MUM-101', progress: 82 }
];
