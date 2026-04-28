// ─── Incident Types ─────────────────────────────────────────────────────────
export const INCIDENT_TYPES = {
  harassment:   { label: "Harassment",           weight: 0.70, icon: "⚠️",  color: "#FF6B35", bg: "#FF6B3518" },
  assault:      { label: "Physical Assault",      weight: 1.00, icon: "🚨",  color: "#FF1744", bg: "#FF174418" },
  theft:        { label: "Theft / Snatching",     weight: 0.65, icon: "👜",  color: "#FF9100", bg: "#FF910018" },
  stalking:     { label: "Stalking",              weight: 0.85, icon: "👁️",  color: "#E91E63", bg: "#E91E6318" },
  unsafe_area:  { label: "Unsafe / Dark Area",    weight: 0.40, icon: "🌑",  color: "#7C4DFF", bg: "#7C4DFF18" },
  suspicious:   { label: "Suspicious Activity",   weight: 0.50, icon: "❓",  color: "#FF6F00", bg: "#FF6F0018" },
  eve_teasing:  { label: "Eve Teasing",           weight: 0.75, icon: "🔊",  color: "#F50057", bg: "#F5005718" },
  acid_attack:  { label: "Acid Attack / Threat",  weight: 1.00, icon: "☣️",  color: "#D50000", bg: "#D5000018" },
  indecent_exp: { label: "Indecent Exposure",     weight: 0.80, icon: "🔞",  color: "#C51162", bg: "#C5116218" },
  vehicle:      { label: "Unsafe Vehicle / Cab",  weight: 0.60, icon: "🚗",  color: "#FF3D00", bg: "#FF3D0018" },
};

// ─── Risk Level Thresholds ──────────────────────────────────────────────────
export const RISK_LEVELS = {
  low:      { label: "Safe",       min: 0.00, max: 0.25, color: "#00E676", pulse: "#00E67640", gradient: ["#00E67600","#00E67680"] },
  guarded:  { label: "Guarded",    min: 0.25, max: 0.50, color: "#FFD600", pulse: "#FFD60040", gradient: ["#FFD60000","#FFD60080"] },
  high:     { label: "High Risk",  min: 0.50, max: 0.75, color: "#FF6D00", pulse: "#FF6D0040", gradient: ["#FF6D0000","#FF6D0080"] },
  critical: { label: "Critical",   min: 0.75, max: 1.00, color: "#FF1744", pulse: "#FF174440", gradient: ["#FF174400","#FF174480"] },
};

// ─── Pune Neighbourhoods ────────────────────────────────────────────────────
export const NEIGHBOURHOODS = [
  { name: "Koregaon Park",  lat: 18.5362, lng: 73.8942, safetyScore: 42, population: "80k" },
  { name: "Shivajinagar",   lat: 18.5308, lng: 73.8474, safetyScore: 28, population: "120k" },
  { name: "Camp",           lat: 18.5185, lng: 73.8760, safetyScore: 55, population: "95k" },
  { name: "Kothrud",        lat: 18.5074, lng: 73.8077, safetyScore: 72, population: "200k" },
  { name: "Hadapsar",       lat: 18.5020, lng: 73.9250, safetyScore: 22, population: "150k" },
  { name: "Viman Nagar",    lat: 18.5679, lng: 73.9143, safetyScore: 60, population: "60k" },
  { name: "Wakad",          lat: 18.5987, lng: 73.7601, safetyScore: 68, population: "70k" },
  { name: "Yerawada",       lat: 18.5548, lng: 73.9132, safetyScore: 38, population: "85k" },
  { name: "Baner",          lat: 18.5590, lng: 73.7868, safetyScore: 65, population: "90k" },
  { name: "Pimpri",         lat: 18.6279, lng: 73.7994, safetyScore: 35, population: "180k" },
  { name: "Aundh",          lat: 18.5590, lng: 73.8077, safetyScore: 70, population: "110k" },
  { name: "Hinjewadi",      lat: 18.5914, lng: 73.7367, safetyScore: 58, population: "50k" },
];

// ─── Seed Incidents ─────────────────────────────────────────────────────────
const now = Date.now();
const h = (n) => now - n * 3_600_000;
const d = (n) => now - n * 86_400_000;

export const SEED_INCIDENTS = [
  // Koregaon Park
  { id:  1, lat: 18.5362, lng: 73.8942, type: "harassment",   timestamp: h(2),   upvotes: 18, downvotes: 2,  description: "Man persistently following women near North Main Road at night.",                   verified: true,  responders: 2 },
  { id:  2, lat: 18.5375, lng: 73.8955, type: "unsafe_area",  timestamp: h(8),   upvotes: 14, downvotes: 1,  description: "3 streetlights broken behind Osho Park. Completely dark after 9pm.",               verified: true,  responders: 0 },
  { id:  3, lat: 18.5348, lng: 73.8930, type: "suspicious",   timestamp: h(14),  upvotes:  9, downvotes: 0,  description: "Group loitering near parked cars, approached solo women.",                         verified: false, responders: 1 },
  { id:  4, lat: 18.5340, lng: 73.8965, type: "eve_teasing",  timestamp: h(1),   upvotes: 22, downvotes: 1,  description: "Obscene remarks from moving vehicles after midnight. Repeated pattern.",            verified: true,  responders: 3 },
  { id:  5, lat: 18.5382, lng: 73.8920, type: "stalking",     timestamp: h(3),   upvotes: 16, downvotes: 0,  description: "Victim followed from café to auto stand for 25+ minutes. CCTV footage exists.",     verified: true,  responders: 4 },

  // Shivajinagar — HIGH RISK
  { id:  6, lat: 18.5308, lng: 73.8474, type: "harassment",   timestamp: h(0.5), upvotes: 30, downvotes: 3,  description: "Multiple women harassed at main bus depot. Conductor did not intervene.",           verified: true,  responders: 5 },
  { id:  7, lat: 18.5295, lng: 73.8488, type: "theft",        timestamp: h(2),   upvotes: 24, downvotes: 2,  description: "Phone snatched by motorcyclist on FC Road. Victim fell and sustained injuries.",     verified: true,  responders: 6 },
  { id:  8, lat: 18.5320, lng: 73.8460, type: "stalking",     timestamp: h(1),   upvotes: 28, downvotes: 1,  description: "Woman followed from Shivajinagar station to Deccan Gymkhana on foot.",              verified: true,  responders: 3 },
  { id:  9, lat: 18.5285, lng: 73.8470, type: "assault",      timestamp: h(0.3), upvotes: 40, downvotes: 0,  description: "Bag forcibly taken, minor injuries sustained. FIR lodged at Shivajinagar PS.",      verified: true,  responders: 8 },
  { id: 10, lat: 18.5330, lng: 73.8500, type: "suspicious",   timestamp: h(4),   upvotes: 12, downvotes: 2,  description: "Men filming women without consent near ATM, turned aggressive when confronted.",    verified: false, responders: 0 },
  { id: 11, lat: 18.5310, lng: 73.8455, type: "indecent_exp", timestamp: h(6),   upvotes: 20, downvotes: 1,  description: "Indecent exposure near underpass early morning. Known recurring offender.",         verified: true,  responders: 2 },

  // Camp / MG Road
  { id: 12, lat: 18.5185, lng: 73.8760, type: "eve_teasing",  timestamp: h(10),  upvotes: 11, downvotes: 4,  description: "Catcalling near MG Road during evening rush hour.",                               verified: false, responders: 0 },
  { id: 13, lat: 18.5160, lng: 73.8780, type: "unsafe_area",  timestamp: d(1),   upvotes:  8, downvotes: 2,  description: "Broken streetlights on Moledina Road. Dangerous stretch after 10pm.",              verified: true,  responders: 1 },
  { id: 14, lat: 18.5200, lng: 73.8740, type: "vehicle",      timestamp: h(16),  upvotes: 13, downvotes: 1,  description: "Shared cab took unknown detour at night. Door and window lock controls disabled.",   verified: true,  responders: 2 },

  // Hadapsar — CRITICAL
  { id: 15, lat: 18.5020, lng: 73.9250, type: "assault",      timestamp: h(0.2), upvotes: 45, downvotes: 1,  description: "Serious assault near MIDC zone. Victim hospitalised. Police deployed in area.",     verified: true,  responders: 12 },
  { id: 16, lat: 18.5035, lng: 73.9265, type: "stalking",     timestamp: h(0.8), upvotes: 32, downvotes: 0,  description: "Woman stalked for 8 blocks from bus stop. Attacker attempted to physically detain.",verified: true,  responders: 7 },
  { id: 17, lat: 18.5008, lng: 73.9240, type: "harassment",   timestamp: h(2),   upvotes: 27, downvotes: 2,  description: "Night shift IT workers harassed outside compound gate. Recurring nightly issue.",    verified: true,  responders: 4 },
  { id: 18, lat: 18.5042, lng: 73.9278, type: "theft",        timestamp: h(5),   upvotes: 20, downvotes: 1,  description: "Chain snatching on Hadapsar main road by attacker on bicycle.",                    verified: true,  responders: 3 },
  { id: 19, lat: 18.4998, lng: 73.9232, type: "acid_attack",  timestamp: h(3),   upvotes: 55, downvotes: 0,  description: "Acid attack threat made. Suspect arrested. Area under heightened police watch.",    verified: true,  responders: 15 },
  { id: 20, lat: 18.5055, lng: 73.9285, type: "unsafe_area",  timestamp: d(2),   upvotes: 18, downvotes: 3,  description: "No CCTV in industrial zone. Repeated eve-teasing of workers leaving night shifts.",  verified: true,  responders: 0 },

  // Viman Nagar
  { id: 21, lat: 18.5679, lng: 73.9143, type: "unsafe_area",  timestamp: d(1),   upvotes: 10, downvotes: 3,  description: "Dark underpass near Viman Nagar Road. CCTV camera vandalized, not repaired.",       verified: true,  responders: 1 },
  { id: 22, lat: 18.5692, lng: 73.9160, type: "suspicious",   timestamp: h(12),  upvotes:  8, downvotes: 2,  description: "Men approaching parked cars with women inside in unlit parking area.",              verified: false, responders: 0 },
  { id: 23, lat: 18.5665, lng: 73.9130, type: "vehicle",      timestamp: h(6),   upvotes: 14, downvotes: 1,  description: "Auto driver locked doors and demanded extra fare at night. Passenger escaped safely.",verified: true,  responders: 2 },

  // Yerawada
  { id: 24, lat: 18.5548, lng: 73.9132, type: "unsafe_area",  timestamp: d(3),   upvotes:  9, downvotes: 1,  description: "Isolated stretch between Yerawada and Mundhwa. Frequent incidents at dusk.",        verified: true,  responders: 0 },
  { id: 25, lat: 18.5560, lng: 73.9145, type: "suspicious",   timestamp: d(1),   upvotes: 11, downvotes: 0,  description: "Known loitering spot. Men drinking in public harassing passers-by.",               verified: true,  responders: 1 },
  { id: 26, lat: 18.5535, lng: 73.9115, type: "harassment",   timestamp: h(7),   upvotes: 15, downvotes: 2,  description: "Woman leaving hospital at night confronted and asked for phone number forcibly.",    verified: true,  responders: 2 },

  // Pimpri
  { id: 27, lat: 18.6279, lng: 73.7994, type: "eve_teasing",  timestamp: h(4),   upvotes: 16, downvotes: 3,  description: "Consistent eve-teasing near Pimpri Chowk in late evenings.",                      verified: true,  responders: 1 },
  { id: 28, lat: 18.6260, lng: 73.8010, type: "theft",        timestamp: h(9),   upvotes: 12, downvotes: 2,  description: "Earring snatched near Pimpri station during morning rush.",                        verified: true,  responders: 2 },
  { id: 29, lat: 18.6295, lng: 73.7975, type: "stalking",     timestamp: h(2),   upvotes: 20, downvotes: 0,  description: "Stalker followed woman on two-wheeler through 3 different localities.",            verified: true,  responders: 3 },

  // Kothrud (safer)
  { id: 30, lat: 18.5074, lng: 73.8077, type: "suspicious",   timestamp: d(5),   upvotes:  4, downvotes: 3,  description: "Suspicious vehicle parked overnight near school. Tinted windows, engine running.",  verified: false, responders: 0 },
  { id: 31, lat: 18.5090, lng: 73.8095, type: "unsafe_area",  timestamp: d(4),   upvotes:  5, downvotes: 1,  description: "Alley near Karve Statue poorly lit. Community fix requested.",                     verified: true,  responders: 0 },

  // Aundh
  { id: 32, lat: 18.5590, lng: 73.8077, type: "vehicle",      timestamp: h(3),   upvotes: 13, downvotes: 1,  description: "App cab took incorrect route, ignored passenger protests and refused to stop.",    verified: true,  responders: 1 },
  { id: 33, lat: 18.5575, lng: 73.8060, type: "suspicious",   timestamp: h(8),   upvotes:  7, downvotes: 0,  description: "Bikes circling women at bus stop repeatedly before driving off.",                  verified: false, responders: 0 },

  // Baner
  { id: 34, lat: 18.5590, lng: 73.7868, type: "unsafe_area",  timestamp: d(2),   upvotes:  6, downvotes: 2,  description: "Construction zone creates blind spots and dark pockets after 9pm. Avoid.",          verified: true,  responders: 0 },

  // Wakad
  { id: 35, lat: 18.5987, lng: 73.7601, type: "harassment",   timestamp: d(7),   upvotes:  5, downvotes: 4,  description: "Minor incident near mall parking. Unverified by community.",                       verified: false, responders: 0 },
];

// ─── Utility Exports ────────────────────────────────────────────────────────
export const getRiskLevel = (score) => {
  if (score >= 0.75) return "critical";
  if (score >= 0.50) return "high";
  if (score >= 0.25) return "guarded";
  return "low";
};

export const getRiskLabel = (score) => RISK_LEVELS[getRiskLevel(score)]?.label ?? "Safe";
export const getRiskColor = (score) => RISK_LEVELS[getRiskLevel(score)]?.color ?? "#00E676";
