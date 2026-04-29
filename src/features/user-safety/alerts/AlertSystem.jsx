import { useState, useEffect } from "react";
import { mockDangerZones } from "../mock/mockReports";
import { checkIfInDangerZone, getRiskColor, getRiskMessage } from "./riskDetection";

export default function AlertSystem() {
  const [userLocation, setUserLocation] = useState(null);
  const [dangerZone, setDangerZone] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [log, setLog] = useState([]);

  // Start live location tracking
  function startTracking() {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setIsTracking(true);
    setLocationError("");

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Check against all danger zones
        const matched = checkIfInDangerZone(latitude, longitude, mockDangerZones);
        setDangerZone(matched);

        // Add to log
        const msg = matched
          ? getRiskMessage(matched)
          : `✅ Safe location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

        setLog((prev) => [
          { time: new Date().toLocaleTimeString(), msg },
          ...prev.slice(0, 9), // keep last 10 entries
        ]);
      },
      (err) => {
        setLocationError("Could not get location: " + err.message);
        setIsTracking(false);
      },
      { enableHighAccuracy: true }
    );
  }

  // Simulate entering a danger zone (for demo/testing)
  function simulateDanger() {
    const zone = mockDangerZones[0];
    setUserLocation({ lat: zone.lat, lng: zone.lng });
    const matched = checkIfInDangerZone(zone.lat, zone.lng, mockDangerZones);
    setDangerZone(matched);
    setLog((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        msg: getRiskMessage(matched),
      },
      ...prev.slice(0, 9),
    ]);
  }

  // Simulate safe location
  function simulateSafe() {
    setUserLocation({ lat: 18.5900, lng: 73.9200 });
    setDangerZone(null);
    setLog((prev) => [
      {
        time: new Date().toLocaleTimeString(),
        msg: "✅ Safe location detected (18.5900, 73.9200)",
      },
      ...prev.slice(0, 9),
    ]);
  }

  const alertColor = dangerZone ? getRiskColor(dangerZone.riskLevel) : "#38a169";
  const alertBg    = dangerZone ? "#FFF5F5" : "#F0FFF4";

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🚨 Alert System</h2>
      <p style={styles.subtext}>Monitors your location against known danger zones.</p>

      {/* Status Banner */}
      <div style={{ ...styles.banner, background: alertBg, borderColor: alertColor }}>
        <span style={{ ...styles.dot, background: alertColor }} />
        <span style={{ color: alertColor, fontWeight: "600", fontSize: "15px" }}>
          {dangerZone
            ? `DANGER — ${dangerZone.label} (${dangerZone.riskLevel.toUpperCase()})`
            : "All Clear — No danger zones nearby"}
        </span>
      </div>

      {/* Location Info */}
      {userLocation && (
        <div style={styles.locationBox}>
          <p style={styles.locationText}>
            📍 Your location: {userLocation.lat.toFixed(5)}, {userLocation.lng.toFixed(5)}
          </p>
          {dangerZone && (
            <p style={{ ...styles.locationText, color: "#e53e3e" }}>
              {getRiskMessage(dangerZone)}
            </p>
          )}
        </div>
      )}

      {locationError && <p style={styles.error}>{locationError}</p>}

      {/* Buttons */}
      <div style={styles.btnRow}>
        <button
          style={{ ...styles.btn, background: "#4F46E5" }}
          onClick={startTracking}
          disabled={isTracking}
        >
          {isTracking ? "📡 Tracking..." : "📡 Start Tracking"}
        </button>
        <button
          style={{ ...styles.btn, background: "#e53e3e" }}
          onClick={simulateDanger}
        >
          ⚠️ Simulate Danger
        </button>
        <button
          style={{ ...styles.btn, background: "#38a169" }}
          onClick={simulateSafe}
        >
          ✅ Simulate Safe
        </button>
      </div>

      {/* Activity Log */}
      {log.length > 0 && (
        <div style={styles.logBox}>
          <p style={styles.logTitle}>Activity Log</p>
          {log.map((entry, i) => (
            <div key={i} style={styles.logEntry}>
              <span style={styles.logTime}>{entry.time}</span>
              <span style={styles.logMsg}>{entry.msg}</span>
            </div>
          ))}
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
  banner: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1.5px solid",
    marginBottom: "16px",
  },
  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  locationBox: {
    background: "#F7F8FF",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "16px",
  },
  locationText: { fontSize: "13px", color: "#444", margin: "0 0 4px 0" },
  error: { color: "#e53e3e", fontSize: "13px", marginBottom: "12px" },
  btnRow: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" },
  btn: {
    flex: 1,
    padding: "11px 10px",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    minWidth: "120px",
  },
  logBox: {
    background: "#F7F8FF",
    borderRadius: "12px",
    padding: "14px",
  },
  logTitle: { fontWeight: "600", fontSize: "14px", color: "#333", margin: "0 0 10px 0" },
  logEntry: {
    display: "flex",
    gap: "10px",
    marginBottom: "8px",
    alignItems: "flex-start",
  },
  logTime: { fontSize: "11px", color: "#999", whiteSpace: "nowrap", paddingTop: "2px" },
  logMsg:  { fontSize: "13px", color: "#444" },
};