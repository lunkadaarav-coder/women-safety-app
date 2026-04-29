// Calculates distance between two GPS coordinates (in meters)
// Uses the Haversine formula — standard for GPS distance calculation
export function getDistanceInMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in meters
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Checks if user is inside any danger zone
// Returns the matched zone object or null
export function checkIfInDangerZone(userLat, userLng, dangerZones, radiusMeters = 500) {
  for (const zone of dangerZones) {
    const distance = getDistanceInMeters(userLat, userLng, zone.lat, zone.lng);
    if (distance <= radiusMeters) {
      return { ...zone, distance: Math.round(distance) };
    }
  }
  return null;
}

// Returns a risk color based on risk level
export function getRiskColor(riskLevel) {
  switch (riskLevel) {
    case "high":   return "#e53e3e"; // red
    case "medium": return "#dd6b20"; // orange
    case "low":    return "#38a169"; // green
    default:       return "#718096"; // gray
  }
}

// Returns a human-readable risk message
export function getRiskMessage(zone) {
  if (!zone) return null;
  return `⚠️ You are ${zone.distance}m from "${zone.label}" — Risk Level: ${zone.riskLevel.toUpperCase()}`;
}