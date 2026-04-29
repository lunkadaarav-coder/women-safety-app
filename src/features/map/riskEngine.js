import { INCIDENT_TYPES, RISK_LEVELS, getRiskLevel, getRiskColor } from "./incidents";

// ─── Geo Math ───────────────────────────────────────────────────────────────
export const haversineKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── Time Decay ─────────────────────────────────────────────────────────────
// More recent = more weight. 48h half-life exponential decay.
export const timeDecay = (timestamp) => {
  const ageHours = (Date.now() - timestamp) / 3_600_000;
  return Math.exp(-ageHours / 48);
};

// ─── Validation Weight ───────────────────────────────────────────────────────
// Community upvotes/downvotes adjust credibility
export const validationWeight = (upvotes, downvotes, verified) => {
  const total = upvotes + downvotes;
  if (total === 0) return verified ? 0.7 : 0.4;
  const ratio = upvotes / total;
  const base = ratio * 0.8 + (verified ? 0.2 : 0.0);
  return Math.max(0.05, Math.min(1.0, base));
};

// ─── Point Risk Score ────────────────────────────────────────────────────────
// KDE (kernel density estimation) — weighted Gaussian kernel
export const computeRiskScore = (lat, lng, incidents, radiusKm = 0.6) => {
  let score = 0;

  for (const inc of incidents) {
    const dist = haversineKm(lat, lng, inc.lat, inc.lng);
    if (dist > radiusKm) continue;

    const type      = INCIDENT_TYPES[inc.type];
    const severity  = type?.weight ?? 0.5;
    const decay     = timeDecay(inc.timestamp);
    const valid     = validationWeight(inc.upvotes, inc.downvotes, inc.verified);
    const spatial   = Math.exp(-((dist / radiusKm) ** 2) * 3); // Gaussian kernel

    score += severity * decay * valid * spatial;
  }

  // Normalize — assumes max realistic density ~5 overlapping severe incidents
  return Math.min(score / 3.5, 1.0);
};

// ─── DBSCAN Clustering ───────────────────────────────────────────────────────
export const clusterIncidents = (incidents, epsKm = 0.8, minPts = 3) => {
  if (incidents.length === 0) return [];
  const visited = new Set();
  const noise   = new Set();
  const clusterMap = new Map(); // incident index → cluster id
  const clusters = [];

  const neighbors = (idx) =>
    incidents
      .map((inc, i) => ({ i, dist: haversineKm(incidents[idx].lat, incidents[idx].lng, inc.lat, inc.lng) }))
      .filter(({ i, dist }) => i !== idx && dist <= epsKm)
      .map(({ i }) => i);

  let clusterId = 0;

  incidents.forEach((_, idx) => {
    if (visited.has(idx)) return;
    visited.add(idx);

    const nb = neighbors(idx);
    if (nb.length < minPts - 1) { noise.add(idx); return; }

    const cluster = new Set([idx, ...nb]);
    const queue = [...nb];

    while (queue.length > 0) {
      const cur = queue.shift();
      if (!visited.has(cur)) {
        visited.add(cur);
        const curNb = neighbors(cur);
        if (curNb.length >= minPts - 1) {
          curNb.forEach((n) => { if (!cluster.has(n)) { cluster.add(n); queue.push(n); } });
        }
      }
      cluster.add(cur);
    }

    if (cluster.size >= minPts) {
      cluster.forEach((i) => clusterMap.set(i, clusterId));
      clusters.push([...cluster].map((i) => incidents[i]));
      clusterId++;
    }
  });

  return clusters.map((members) => {
    const centLat = members.reduce((s, m) => s + m.lat, 0) / members.length;
    const centLng = members.reduce((s, m) => s + m.lng, 0) / members.length;
    const score   = computeRiskScore(centLat, centLng, members, epsKm);
    const radii   = members.map((m) => haversineKm(centLat, centLng, m.lat, m.lng) * 1000);
    const radius  = Math.max(...radii, 200) + 200;

    const typeCounts = {};
    members.forEach((m) => { typeCounts[m.type] = (typeCounts[m.type] || 0) + 1; });
    const dominantType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    return { centLat, centLng, score, radius, size: members.length, dominantType, members };
  });
};

// ─── Heatmap Points ──────────────────────────────────────────────────────────
export const buildHeatmapData = (incidents) =>
  incidents.flatMap((inc) => {
    const type   = INCIDENT_TYPES[inc.type];
    const weight = type?.weight ?? 0.5;
    const decay  = timeDecay(inc.timestamp);
    const valid  = validationWeight(inc.upvotes, inc.downvotes, inc.verified);
    const points = Math.max(1, Math.round(weight * decay * valid * 8));
    return Array(points).fill({ lat: inc.lat, lng: inc.lng });
  });

// ─── Area Statistics ─────────────────────────────────────────────────────────
export const buildAreaStats = (incidents) => {
  const total = incidents.length;
  if (total === 0) return { total: 0, byType: {}, byHour: Array(24).fill(0), recentTrend: 0 };

  const byType = {};
  const byHour = Array(24).fill(0);

  incidents.forEach((inc) => {
    byType[inc.type] = (byType[inc.type] || 0) + 1;
    const hour = new Date(inc.timestamp).getHours();
    byHour[hour]++;
  });

  // Trend: compare last 12h vs previous 12h
  const cutoff12 = Date.now() - 12 * 3_600_000;
  const cutoff24 = Date.now() - 24 * 3_600_000;
  const recent   = incidents.filter((i) => i.timestamp >= cutoff12).length;
  const older    = incidents.filter((i) => i.timestamp >= cutoff24 && i.timestamp < cutoff12).length;
  const recentTrend = older === 0 ? 0 : ((recent - older) / older) * 100;

  // Peak hour
  const peakHour = byHour.indexOf(Math.max(...byHour));

  return { total, byType, byHour, recentTrend, peakHour };
};

// ─── Safe Score for Neighbourhood ───────────────────────────────────────────
export const neighbourhoodRiskScore = (neighbourhood, incidents) =>
  computeRiskScore(neighbourhood.lat, neighbourhood.lng, incidents, 1.2);

// ─── Relative Time ───────────────────────────────────────────────────────────
export const formatRelativeTime = (timestamp) => {
  const diff = Date.now() - timestamp;
  const m = Math.floor(diff / 60_000);
  if (m < 1)  return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ─── Re-export helpers ───────────────────────────────────────────────────────
export { getRiskLevel, getRiskColor };
