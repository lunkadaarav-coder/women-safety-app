import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import { mockDangerZones } from "../mock/mockReports";
import { getDistanceInMeters } from "./riskDetection";

// Fix default marker icons broken by webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom colored markers
const makeIcon = (color) => L.divIcon({
  className: "",
  html: `<div style="
    width:16px;height:16px;border-radius:50%;
    background:${color};border:3px solid #fff;
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
  "></div>`,
  iconSize:   [16, 16],
  iconAnchor: [8, 8],
});

const userIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:20px;height:20px;border-radius:50%;
    background:#6C47FF;border:3px solid #fff;
    box-shadow:0 2px 8px rgba(108,71,255,0.5);
  "></div>`,
  iconSize:   [20, 20],
  iconAnchor: [10, 10],
});

const safeWaypoints = [
  { id: 1, lat: 18.5350, lng: 73.8300, label: "Waypoint A — Market Road"  },
  { id: 2, lat: 18.5280, lng: 73.8150, label: "Waypoint B — Main Street"  },
  { id: 3, lat: 18.5150, lng: 73.8050, label: "Waypoint C — Park Lane"    },
];

const userPosition  = [18.5204, 73.8567];
const destinations  = ["College", "Home", "Mall", "Hospital", "Railway Station"];

export default function SafeRoute() {
  const [destination, setDestination] = useState("");
  const [routeGenerated, setRouteGenerated] = useState(false);
  const [dangerWarnings, setDangerWarnings] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [customDest, setCustomDest]   = useState("");

  function generateRoute(dest) {
    const d = dest || destination;
    if (!d.trim()) return;
    setDestination(d);
    setLoading(true);

    setTimeout(() => {
      const warnings = [];
      safeWaypoints.forEach((wp) => {
        mockDangerZones.forEach((zone) => {
          const dist = getDistanceInMeters(wp.lat, wp.lng, zone.lat, zone.lng);
          if (dist < 800) {
            warnings.push({
              waypoint: wp.label,
              zone:     zone.label,
              risk:     zone.riskLevel,
              distance: Math.round(dist),
            });
          }
        });
      });
      setDangerWarnings(warnings);
      setRouteGenerated(true);
      setLoading(false);
    }, 1000);
  }

  function resetRoute() {
    setDestination("");
    setCustomDest("");
    setRouteGenerated(false);
    setDangerWarnings([]);
  }

  // Route line: user → waypoints → destination area
  const routeLine = [
    userPosition,
    ...safeWaypoints.map((w) => [w.lat, w.lng]),
    [18.5100, 73.7950],
  ];

  return (
    <div style={{ padding: "20px 16px", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px" }}>
        <div>
          <h2 style={{ fontSize:"20px", fontWeight:"800", color:"#1A1A2E", margin:0 }}>Safe Route</h2>
          <p style={{ fontSize:"12px", color:"#9CA3AF", margin:"4px 0 0 0" }}>
            Routes that avoid danger zones
          </p>
        </div>
        <span style={{ fontSize:"28px" }}>🗺️</span>
      </div>

      {!routeGenerated ? (
        <div>
          {/* Quick destination picks */}
          <p style={labelStyle}>Quick destinations</p>
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", marginBottom:"16px" }}>
            {destinations.map((d) => (
              <button
                key={d}
                style={chipStyle}
                onClick={() => generateRoute(d)}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Custom input */}
          <p style={labelStyle}>Or type your destination</p>
          <div style={{ display:"flex", gap:"8px", marginBottom:"20px" }}>
            <input
              style={inputStyle}
              type="text"
              placeholder="e.g. Shivajinagar Station..."
              value={customDest}
              onChange={(e) => setCustomDest(e.target.value)}
            />
            <button
              style={{
                padding:      "0 18px",
                background:   customDest.trim() ? "#6C47FF" : "#D1D5DB",
                color:        "#fff",
                border:       "none",
                borderRadius: "12px",
                fontWeight:   "700",
                fontSize:     "13px",
                cursor:       customDest.trim() ? "pointer" : "not-allowed",
                whiteSpace:   "nowrap",
              }}
              onClick={() => generateRoute(customDest)}
              disabled={!customDest.trim()}
            >
              Find
            </button>
          </div>

          {/* Static map preview */}
          <p style={labelStyle}>Your area</p>
          <div style={{ borderRadius:"16px", overflow:"hidden", border:"1px solid #EDE9FF", marginBottom:"16px" }}>
            <MapContainer
              center={userPosition}
              zoom={14}
              style={{ height:"240px", width:"100%" }}
              zoomControl={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />
              {/* User location */}
              <Marker position={userPosition} icon={userIcon}>
                <Popup>📍 You are here</Popup>
              </Marker>
              {/* Danger zones */}
              {mockDangerZones.map((zone) => (
                <Circle
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={300}
                  pathOptions={{
                    color:       zone.riskLevel === "high" ? "#E53E3E" : "#D97706",
                    fillColor:   zone.riskLevel === "high" ? "#E53E3E" : "#D97706",
                    fillOpacity: 0.2,
                    weight:      2,
                  }}
                >
                  <Popup>{zone.label} — {zone.riskLevel} risk</Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>

          {/* Legend */}
          <div style={{ display:"flex", gap:"16px", flexWrap:"wrap" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:"#6C47FF" }}/>
              <span style={{ fontSize:"11px", color:"#6B7280" }}>You</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:"#E53E3E", opacity:0.6 }}/>
              <span style={{ fontSize:"11px", color:"#6B7280" }}>High risk zone</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
              <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:"#D97706", opacity:0.6 }}/>
              <span style={{ fontSize:"11px", color:"#6B7280" }}>Medium risk zone</span>
            </div>
          </div>
        </div>

      ) : loading ? (
        <div style={{ textAlign:"center", padding:"60px 20px" }}>
          <p style={{ fontSize:"32px", marginBottom:"12px" }}>⏳</p>
          <p style={{ fontSize:"14px", fontWeight:"600", color:"#6C47FF" }}>
            Calculating safest route...
          </p>
          <p style={{ fontSize:"12px", color:"#9CA3AF" }}>
            Checking {mockDangerZones.length} danger zones
          </p>
        </div>

      ) : (
        <div>
          {/* Destination badge */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
            <div style={{ background:"#F3F0FF", border:"1px solid #DDD6FE", borderRadius:"12px", padding:"10px 14px", flex:1, marginRight:"10px" }}>
              <p style={{ fontSize:"11px", color:"#9CA3AF", margin:"0 0 2px 0" }}>Destination</p>
              <p style={{ fontSize:"14px", fontWeight:"700", color:"#6C47FF", margin:0 }}>📍 {destination}</p>
            </div>
            <button onClick={resetRoute} style={{ background:"#F3F4F6", border:"1px solid #E5E7EB", borderRadius:"12px", padding:"10px 14px", fontSize:"12px", fontWeight:"600", color:"#6B7280", cursor:"pointer" }}>
              ✕ Reset
            </button>
          </div>

          {/* THE MAP */}
          <div style={{ borderRadius:"16px", overflow:"hidden", border:"1px solid #EDE9FF", marginBottom:"16px" }}>
            <MapContainer
              center={userPosition}
              zoom={14}
              style={{ height:"300px", width:"100%" }}
              zoomControl={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap"
              />

              {/* User location */}
              <Marker position={userPosition} icon={userIcon}>
                <Popup>📍 You are here</Popup>
              </Marker>

              {/* Safe route line */}
              <Polyline
                positions={routeLine}
                pathOptions={{ color:"#6C47FF", weight:4, opacity:0.8, dashArray:"8 4" }}
              />

              {/* Safe waypoints */}
              {safeWaypoints.map((wp) => (
                <Marker key={wp.id} position={[wp.lat, wp.lng]} icon={makeIcon("#16A34A")}>
                  <Popup>✅ {wp.label}</Popup>
                </Marker>
              ))}

              {/* Danger zones as red circles */}
              {mockDangerZones.map((zone) => (
                <Circle
                  key={zone.id}
                  center={[zone.lat, zone.lng]}
                  radius={300}
                  pathOptions={{
                    color:       zone.riskLevel === "high" ? "#E53E3E" : "#D97706",
                    fillColor:   zone.riskLevel === "high" ? "#E53E3E" : "#D97706",
                    fillOpacity: 0.2,
                    weight:      2,
                  }}
                >
                  <Popup>⚠️ {zone.label} — {zone.riskLevel} risk</Popup>
                </Circle>
              ))}
            </MapContainer>
          </div>

          {/* Danger warnings */}
          {dangerWarnings.length > 0 && (
            <div style={{ background:"#FFF1F2", border:"1px solid #FECDD3", borderRadius:"14px", padding:"14px", marginBottom:"16px" }}>
              <p style={{ fontSize:"13px", fontWeight:"700", color:"#E53E3E", margin:"0 0 10px 0" }}>
                ⚠️ {dangerWarnings.length} risk zone(s) near this route
              </p>
              {dangerWarnings.map((w, i) => (
                <div key={i} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                  <span style={{
                    fontSize:"10px", fontWeight:"700", padding:"2px 8px", borderRadius:"999px",
                    background: w.risk === "high" ? "#FFF1F2" : "#FFFBEB",
                    color:      w.risk === "high" ? "#BE123C" : "#D97706",
                    border:     w.risk === "high" ? "1px solid #FECDD3" : "1px solid #FDE68A",
                  }}>
                    {w.risk.toUpperCase()}
                  </span>
                  <span style={{ fontSize:"12px", color:"#4B5563" }}>
                    {w.zone} is {w.distance}m away
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Waypoints list */}
          <p style={labelStyle}>Safe waypoints on your route</p>
          {safeWaypoints.map((wp, i) => (
            <div key={wp.id} style={{ display:"flex", alignItems:"center", gap:"12px", background:"#FAF9FF", border:"1px solid #EDE9FF", borderRadius:"12px", padding:"12px 14px", marginBottom:"8px" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"#16A34A", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"700", fontSize:"12px", flexShrink:0 }}>
                {i + 1}
              </div>
              <p style={{ fontSize:"13px", fontWeight:"600", color:"#1A1A2E", margin:0, flex:1 }}>
                {wp.label}
              </p>
              <span style={{ fontSize:"11px", color:"#9CA3AF" }}>
                {wp.lat.toFixed(3)}, {wp.lng.toFixed(3)}
              </span>
            </div>
          ))}

          {/* Summary */}
          <div style={{ background: dangerWarnings.length === 0 ? "#EDFDF4" : "#FFFBEB", border:`1px solid ${dangerWarnings.length === 0 ? "#BBF7D0" : "#FDE68A"}`, borderRadius:"14px", padding:"14px", marginTop:"8px" }}>
            <p style={{ fontWeight:"700", fontSize:"14px", color: dangerWarnings.length === 0 ? "#16A34A" : "#D97706", margin:0 }}>
              {dangerWarnings.length === 0
                ? "✅ Route looks safe — no danger zones on the way"
                : "⚠️ Proceed with caution — stay on the marked waypoints"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = {
  fontSize:"11px", fontWeight:"700", color:"#9CA3AF",
  letterSpacing:"0.5px", textTransform:"uppercase", margin:"0 0 8px 0",
};
const inputStyle = {
  flex:1, padding:"12px 14px", fontSize:"14px",
  border:"1.5px solid #EDE9FF", borderRadius:"12px",
  outline:"none", background:"#fff", color:"#1A1A2E",
};
const chipStyle = {
  padding:"8px 14px", background:"#F3F0FF",
  color:"#6C47FF", border:"1px solid #DDD6FE",
  borderRadius:"999px", fontSize:"12px",
  fontWeight:"600", cursor:"pointer",
};