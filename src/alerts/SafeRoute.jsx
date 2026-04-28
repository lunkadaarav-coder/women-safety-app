import { useState } from "react";
import { mockDangerZones } from "../mock/mockReports";
import { getDistanceInMeters, getRiskColor } from "./riskDetection";

// Simulated safe waypoints (avoids danger zones)
const safeWaypoints = [
  { id: 1, lat: 18.5350, lng: 73.8300, label: "Waypoint A — Market Road" },
  { id: 2, lat: 18.5280, lng: 73.8150, label: "Waypoint B — Main Street" },
  { id: 3, lat: 18.5150, lng: 73.8050, label: "Waypoint C — Park Lane" },
];

export default function SafeRoute() {
  const [destination, setDestination] = useState("");
  const [routeGenerated, setRouteGenerated] = useState(false);
  const [dangerWarnings, setDangerWarnings] = useState([]);
  const [loading, setLoading] = useState(false);

  function generateRoute() {
    if (!destination.trim()) return;

    setLoading(true);

    // Simulate a small delay (like an API call)
    setTimeout(() => {
      // Check each waypoint against danger zones
      const warnings = [];
      safeWaypoints.forEach((wp) => {
        mockDangerZones.forEach((zone) => {
          const dist = getDistanceInMeters(wp.lat, wp.lng, zone.lat, zone.lng);
          if (dist < 800) {
            warnings.push({
              waypoint: wp.label,
              zone: zone.label,
              risk: zone.riskLevel,
              distance: Math.round(dist),
            });
          }
        });
      });

      setDangerWarnings(warnings);
      setRouteGenerated(true);
      setLoading(false);
    }, 1200);
  }

  function resetRoute() {
    setDestination("");
    setRouteGenerated(false);
    setDangerWarnings([]);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🗺️ Safe Route</h2>
      <p style={styles.subtext}>
        Get a route that avoids high-risk areas near your destination.
      </p>

      {/* Input */}
      {!routeGenerated && (
        <div style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter your destination (e.g. College, Home)"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <button
            style={{
              ...styles.btn,
              background: destination.trim() ? "#4F46E5" : "#ccc",
              cursor: destination.trim() ? "pointer" : "not-allowed",
            }}
            onClick={generateRoute}
            disabled={!destination.trim() || loading}
          >
            {loading ? "⏳ Calculating..." : "🔍 Find Safe Route"}
          </button>
        </div>
      )}

      {/* Route Result */}
      {routeGenerated && (
        <div>
          {/* Destination badge */}
          <div style={styles.destinationBadge}>
            <span>📍 Destination:</span>
            <strong style={{ marginLeft: "6px" }}>{destination}</strong>
          </div>

          {/* Danger warnings */}
          {dangerWarnings.length > 0 && (
            <div style={styles.warningBox}>
              <p style={styles.warningTitle}>
                ⚠️ {dangerWarnings.length} risk zone(s) near this route
              </p>
              {dangerWarnings.map((w, i) => (
                <div key={i} style={styles.warningItem}>
                  <span
                    style={{
                      ...styles.riskBadge,
                      background: getRiskColor(w.risk) + "22",
                      color: getRiskColor(w.risk),
                      border: `1px solid ${getRiskColor(w.risk)}44`,
                    }}
                  >
                    {w.risk.toUpperCase()}
                  </span>
                  <span style={styles.warningText}>
                    {w.zone} is {w.distance}m from {w.waypoint}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Safe waypoints */}
          <p style={styles.sectionLabel}>✅ Recommended Safe Waypoints</p>
          <div style={styles.waypointList}>
            {safeWaypoints.map((wp, index) => (
              <div key={wp.id} style={styles.waypointCard}>
                <div style={styles.waypointNumber}>{index + 1}</div>
                <div>
                  <p style={styles.waypointLabel}>{wp.label}</p>
                  <p style={styles.waypointCoords}>
                    {wp.lat.toFixed(4)}, {wp.lng.toFixed(4)}
                  </p>
                </div>
              </div>
            ))}

            {/* Final destination */}
            <div style={{ ...styles.waypointCard, background: "#EEF2FF", borderColor: "#C7D2FE" }}>
              <div style={{ ...styles.waypointNumber, background: "#4F46E5" }}>
                🏁
              </div>
              <div>
                <p style={styles.waypointLabel}>{destination}</p>
                <p style={styles.waypointCoords}>Your destination</p>
              </div>
            </div>
          </div>

          {/* Safety summary */}
          <div style={styles.summaryBox}>
            {dangerWarnings.length === 0 ? (
              <p style={{ color: "#38a169", margin: 0, fontWeight: "600" }}>
                ✅ This route looks safe! No danger zones on the way.
              </p>
            ) : (
              <p style={{ color: "#dd6b20", margin: 0, fontWeight: "600" }}>
                ⚠️ Proceed with caution — some risk zones are near this route.
              </p>
            )}
          </div>

          {/* Reset button */}
          <button style={styles.resetBtn} onClick={resetRoute}>
            🔄 Plan Another Route
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "480px",
    margin: "40px auto",
    padding: "24px",
    fontFamily: "sans-serif",
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  heading: { fontSize: "22px", fontWeight: "600", marginBottom: "4px", color: "#1a1a1a" },
  subtext:  { fontSize: "14px", color: "#666", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" },
  input: {
    padding: "12px 14px",
    fontSize: "15px",
    border: "1.5px solid #ddd",
    borderRadius: "10px",
    outline: "none",
  },
  btn: {
    padding: "13px",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
  },
  destinationBadge: {
    background: "#F7F8FF",
    border: "1px solid #E0E0FF",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#444",
    marginBottom: "14px",
  },
  warningBox: {
    background: "#FFF5F5",
    border: "1px solid #FFCDD2",
    borderRadius: "12px",
    padding: "14px",
    marginBottom: "16px",
  },
  warningTitle: { fontWeight: "600", fontSize: "14px", color: "#e53e3e", margin: "0 0 10px 0" },
  warningItem:  { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" },
  riskBadge: {
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "6px",
    whiteSpace: "nowrap",
  },
  warningText: { fontSize: "13px", color: "#555" },
  sectionLabel: { fontWeight: "600", fontSize: "14px", color: "#333", margin: "0 0 10px 0" },
  waypointList: { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" },
  waypointCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 14px",
    background: "#F7FFF7",
    border: "1px solid #C6F6D5",
    borderRadius: "12px",
  },
  waypointNumber: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#38a169",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "13px",
    flexShrink: 0,
  },
  waypointLabel:  { fontWeight: "600", fontSize: "14px", color: "#1a1a1a", margin: "0 0 2px 0" },
  waypointCoords: { fontSize: "12px", color: "#888", margin: 0 },
  summaryBox: {
    padding: "14px 16px",
    background: "#F7F8FF",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  resetBtn: {
    width: "100%",
    padding: "12px",
    background: "#F7F8FF",
    color: "#4F46E5",
    border: "1.5px solid #C7D2FE",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};