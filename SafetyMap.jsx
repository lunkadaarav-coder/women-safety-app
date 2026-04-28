import React, { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  GoogleMap, useJsApiLoader, HeatmapLayer,
  Marker, Circle, InfoWindow,
} from "@react-google-maps/api";
import { INCIDENT_TYPES, RISK_LEVELS } from "../data/incidents";
import { computeRiskScore, getRiskColor, getRiskLevel, formatRelativeTime } from "../utils/riskEngine";
import { useIncidents } from "../hooks/useIncidents";
import RiskLegend from "./RiskLegend";
import IncidentPanel from "./IncidentPanel";
import ReportForm from "./ReportForm";
import FilterControls from "./FilterControls";
import AnalyticsPanel from "./AnalyticsPanel";

// ─── Constants ───────────────────────────────────────────────────────────────
const LIBRARIES  = ["visualization"];
const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 };

const MAP_STYLES = [
  { elementType: "geometry",                        stylers: [{ color: "#0a0e17" }] },
  { elementType: "labels.text.fill",                stylers: [{ color: "#6e7681" }] },
  { elementType: "labels.text.stroke",              stylers: [{ color: "#0a0e17" }] },
  { featureType: "administrative",                  elementType: "geometry.stroke",     stylers: [{ color: "#1c2230" }] },
  { featureType: "administrative.locality",         elementType: "labels.text.fill",    stylers: [{ color: "#8b949e" }] },
  { featureType: "road",                            elementType: "geometry",            stylers: [{ color: "#161d2e" }] },
  { featureType: "road",                            elementType: "geometry.stroke",     stylers: [{ color: "#1c2230" }] },
  { featureType: "road",                            elementType: "labels.text.fill",    stylers: [{ color: "#4a5568" }] },
  { featureType: "road.highway",                    elementType: "geometry",            stylers: [{ color: "#1e2d42" }] },
  { featureType: "road.highway",                    elementType: "labels.text.fill",    stylers: [{ color: "#586e8a" }] },
  { featureType: "poi",                             elementType: "geometry",            stylers: [{ color: "#0d1420" }] },
  { featureType: "poi.park",                        elementType: "geometry",            stylers: [{ color: "#0d1a22" }] },
  { featureType: "poi.park",                        elementType: "labels.text.fill",    stylers: [{ color: "#2d4a35" }] },
  { featureType: "water",                           elementType: "geometry",            stylers: [{ color: "#060c18" }] },
  { featureType: "water",                           elementType: "labels.text.fill",    stylers: [{ color: "#1a2840" }] },
  { featureType: "transit",                         elementType: "geometry",            stylers: [{ color: "#121824" }] },
  { featureType: "landscape",                       elementType: "geometry",            stylers: [{ color: "#0d1320" }] },
];

const HEATMAP_GRADIENT = [
  "rgba(0,230,118,0)",
  "rgba(0,230,118,0.3)",
  "rgba(255,214,0,0.5)",
  "rgba(255,109,0,0.75)",
  "rgba(255,23,68,1)",
];

const VIEW_MODES = [
  { id: "heatmap",    label: "Heatmap",   icon: "🌡️" },
  { id: "markers",    label: "Incidents", icon: "📍" },
  { id: "prediction", label: "AI Zones",  icon: "🤖" },
];

const SIDEBAR_TABS = [
  { id: "legend",    label: "Zones",     icon: "🗺️" },
  { id: "filter",    label: "Filter",    icon: "⚙️" },
  { id: "analytics", label: "Analytics", icon: "📊" },
];

// ─── Marker SVG builder ──────────────────────────────────────────────────────
const buildMarkerSVG = (icon, ringColor, size = 36) => {
  const s = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${ringColor}" opacity="0.18"/>
      <circle cx="${size/2}" cy="${size/2}" r="${size/2-7}" fill="${ringColor}" opacity="0.6"/>
      <text x="${size/2}" y="${size/2+5}" text-anchor="middle" font-size="${size/2.5}">${icon}</text>
    </svg>`);
  return `data:image/svg+xml;charset=UTF-8,${s}`;
};

// ─── Main Component ──────────────────────────────────────────────────────────
const SafetyMap = ({ googleMapsApiKey }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleMapsApiKey || "",
    libraries: LIBRARIES,
  });

  const mapRef        = useRef(null);
  const [viewMode, setViewMode]             = useState("heatmap");
  const [sidebarTab, setSidebarTab]         = useState("legend");
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [reportMode, setReportMode]         = useState(false);
  const [reportPos, setReportPos]           = useState(null);
  const [selectedIncident, setSelectedInc] = useState(null);
  const [userLocation, setUserLocation]     = useState(null);
  const [userRisk, setUserRisk]             = useState(null);
  const [mapLoaded, setMapLoaded]           = useState(false);
  const [sosPulse, setSosPulse]             = useState(false);

  const {
    incidents, filteredIncidents, heatmapData, predictedZones,
    areaStats, neighbourhoodRanking, filters, setFilters,
    addIncident, voteOnIncident, markResponding,
  } = useIncidents();

  // ── Geolocation ────────────────────────────────────────────────────────────
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(loc);
        const s = computeRiskScore(loc.lat, loc.lng, incidents, 0.5);
        setUserRisk(s);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, [incidents]);

  // ── Heatmap points (Google Maps LatLng objects) ────────────────────────────
  const heatmapPoints = useMemo(() => {
    if (!isLoaded || !window.google) return [];
    return heatmapData.map((p) => new window.google.maps.LatLng(p.lat, p.lng));
  }, [heatmapData, isLoaded]);

  // ── Map click ──────────────────────────────────────────────────────────────
  const handleMapClick = useCallback((e) => {
    if (reportMode) {
      setReportPos({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    } else {
      setSelectedInc(null);
    }
  }, [reportMode]);

  // ── Submit report ──────────────────────────────────────────────────────────
  const handleReportSubmit = useCallback((data) => {
    addIncident(data);
    setReportMode(false);
    setReportPos(null);
  }, [addIncident]);

  // ── SOS pulse ─────────────────────────────────────────────────────────────
  const triggerSOS = () => {
    setSosPulse(true);
    setTimeout(() => setSosPulse(false), 3000);
  };

  const riskColor  = userRisk !== null ? getRiskColor(userRisk) : "#00E676";
  const riskLevel  = userRisk !== null ? getRiskLevel(userRisk) : "low";
  const riskPct    = userRisk !== null ? Math.round(userRisk * 100) : 0;

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (!isLoaded) {
    return (
      <div className="sm-loading">
        <div className="sm-loading-ring" />
        <div className="sm-loading-text">Initialising SafeMap</div>
        <div className="sm-loading-sub">Loading geospatial layers...</div>
      </div>
    );
  }

  return (
    <div className="sm-wrapper">
      {/* ── Top Bar ────────────────────────────────────────────────────────── */}
      <header className="sm-topbar">
        <div className="sm-brand">
          <div className="sm-brand-shield">🛡️</div>
          <div className="sm-brand-text">
            <span className="sm-brand-name">SafeMap</span>
            <span className="sm-brand-tag">Women Safety Platform · Pune</span>
          </div>
        </div>

        <nav className="sm-viewnav">
          {VIEW_MODES.map((vm) => (
            <button
              key={vm.id}
              className={`sm-viewnav-btn ${viewMode === vm.id ? "active" : ""}`}
              onClick={() => setViewMode(vm.id)}
            >
              {vm.icon} {vm.label}
            </button>
          ))}
        </nav>

        <div className="sm-topbar-actions">
          <button
            className={`sm-report-btn ${reportMode ? "cancel" : ""}`}
            onClick={() => { setReportMode(!reportMode); setReportPos(null); }}
          >
            {reportMode ? "✕ Cancel" : "⚠️ Report"}
          </button>
          <button className={`sm-sos-btn ${sosPulse ? "pulsing" : ""}`} onClick={triggerSOS}>
            🆘 SOS
          </button>
          <button className="sm-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
      </header>

      {/* ── User Risk Banner ───────────────────────────────────────────────── */}
      {userRisk !== null && userRisk >= 0.5 && (
        <div className="sm-risk-banner" style={{ "--rc": riskColor }}>
          <div className="sm-banner-pulse" style={{ background: riskColor }} />
          <span className="sm-banner-icon">⚠️</span>
          <div className="sm-banner-text">
            <strong style={{ color: riskColor }}>
              {RISK_LEVELS[riskLevel]?.label?.toUpperCase()} RISK AREA
            </strong>
            <span> · Your current location has a risk score of {riskPct}%. Stay alert.</span>
          </div>
          <div className="sm-banner-actions">
            <button className="sm-banner-btn">Share Location</button>
          </div>
        </div>
      )}

      {/* ── Report Click Prompt ────────────────────────────────────────────── */}
      {reportMode && !reportPos && (
        <div className="sm-click-prompt">
          <span className="sm-prompt-dot" />
          Click the map to pinpoint the incident location
        </div>
      )}

      {/* ── SOS Overlay ───────────────────────────────────────────────────── */}
      {sosPulse && (
        <div className="sm-sos-overlay">
          <div className="sm-sos-ring" />
          <div className="sm-sos-text">🆘 SOS ALERT SENT</div>
          <div className="sm-sos-sub">Your live location has been shared with trusted contacts</div>
        </div>
      )}

      {/* ── Main Layout ────────────────────────────────────────────────────── */}
      <div className="sm-main">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="sm-sidebar">
            {/* User Location Risk Card */}
            <div className="sm-location-card" style={{ "--rc": riskColor }}>
              <div className="sm-lc-header">
                <div className="sm-lc-dot" style={{ background: riskColor, boxShadow: `0 0 8px ${riskColor}` }} />
                <div className="sm-lc-info">
                  <div className="sm-lc-title">Your Location</div>
                  {userLocation ? (
                    <div className="sm-lc-coords">{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</div>
                  ) : (
                    <div className="sm-lc-coords">Location unavailable</div>
                  )}
                </div>
                <div className="sm-lc-pct" style={{ color: riskColor }}>{riskPct}%</div>
              </div>
              <div className="sm-lc-bar">
                <div className="sm-lc-fill" style={{ width: `${riskPct}%`, background: riskColor }} />
              </div>
              <div className="sm-lc-level" style={{ color: riskColor }}>
                {RISK_LEVELS[riskLevel]?.label?.toUpperCase()}
              </div>
            </div>

            {/* Tabs */}
            <div className="sm-tabs">
              {SIDEBAR_TABS.map((t) => (
                <button
                  key={t.id}
                  className={`sm-tab ${sidebarTab === t.id ? "active" : ""}`}
                  onClick={() => setSidebarTab(t.id)}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="sm-tab-content">
              {sidebarTab === "legend" && (
                <RiskLegend
                  showPrediction={viewMode === "prediction"}
                  neighbourhoodRanking={neighbourhoodRanking}
                />
              )}
              {sidebarTab === "filter" && (
                <FilterControls
                  filters={filters}
                  onChange={setFilters}
                  counts={{ filtered: filteredIncidents.length, total: incidents.length }}
                  areaStats={areaStats}
                />
              )}
              {sidebarTab === "analytics" && (
                <AnalyticsPanel areaStats={areaStats} filteredCount={filteredIncidents.length} />
              )}
            </div>

            {/* Recent Incidents Feed */}
            <div className="sm-feed">
              <div className="sm-feed-heading">LIVE FEED</div>
              <div className="sm-feed-list">
                {filteredIncidents.slice(0, 6).map((inc) => {
                  const type = INCIDENT_TYPES[inc.type];
                  return (
                    <div
                      key={inc.id}
                      className="sm-feed-item"
                      style={{ borderLeft: `3px solid ${type?.color}` }}
                      onClick={() => { setSelectedInc(inc); setSidebarTab("legend"); }}
                    >
                      <span className="sm-feed-icon">{type?.icon}</span>
                      <div className="sm-feed-body">
                        <div className="sm-feed-type" style={{ color: type?.color }}>{type?.label}</div>
                        <div className="sm-feed-desc">{inc.description?.slice(0, 55)}...</div>
                      </div>
                      <span className="sm-feed-time">{formatRelativeTime(inc.timestamp)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        {/* Map Area */}
        <div className="sm-map-area">
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={PUNE_CENTER}
            zoom={13}
            onLoad={(m) => { mapRef.current = m; setMapLoaded(true); }}
            onClick={handleMapClick}
            options={{
              styles: MAP_STYLES,
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              clickableIcons: false,
              gestureHandling: "greedy",
            }}
          >
            {/* Heatmap */}
            {viewMode === "heatmap" && heatmapPoints.length > 0 && (
              <HeatmapLayer
                data={heatmapPoints}
                options={{ radius: 40, opacity: 0.85, gradient: HEATMAP_GRADIENT, maxIntensity: 10 }}
              />
            )}

            {/* Incident Markers */}
            {(viewMode === "markers" || viewMode === "prediction") &&
              filteredIncidents.map((inc) => {
                const type  = INCIDENT_TYPES[inc.type];
                const score = computeRiskScore(inc.lat, inc.lng, filteredIncidents, 0.5);
                const color = getRiskColor(score);
                return (
                  <Marker
                    key={inc.id}
                    position={{ lat: inc.lat, lng: inc.lng }}
                    onClick={() => setSelectedInc(inc)}
                    icon={{
                      url: buildMarkerSVG(type?.icon, color, 38),
                      scaledSize: new window.google.maps.Size(38, 38),
                      anchor: new window.google.maps.Point(19, 19),
                    }}
                  />
                );
              })}

            {/* AI Prediction Zones */}
            {viewMode === "prediction" && predictedZones.map((zone, i) => {
              const color = getRiskColor(zone.score);
              return (
                <React.Fragment key={i}>
                  {/* Outer glow */}
                  <Circle
                    center={{ lat: zone.centLat, lng: zone.centLng }}
                    radius={zone.radius * 1.4}
                    options={{ fillColor: color, fillOpacity: 0.05, strokeOpacity: 0, clickable: false }}
                  />
                  {/* Main zone */}
                  <Circle
                    center={{ lat: zone.centLat, lng: zone.centLng }}
                    radius={zone.radius}
                    options={{
                      fillColor: color, fillOpacity: 0.18,
                      strokeColor: color, strokeOpacity: 0.9,
                      strokeWeight: 2, clickable: false,
                    }}
                  />
                  {/* Center marker */}
                  <Marker
                    position={{ lat: zone.centLat, lng: zone.centLng }}
                    icon={{
                      url: buildMarkerSVG("🤖", color, 28),
                      scaledSize: new window.google.maps.Size(28, 28),
                      anchor: new window.google.maps.Point(14, 14),
                    }}
                  />
                </React.Fragment>
              );
            })}

            {/* User Location */}
            {userLocation && (
              <Marker
                position={userLocation}
                zIndex={1000}
                icon={{
                  url: buildMarkerSVG("👤", "#58a6ff", 32),
                  scaledSize: new window.google.maps.Size(32, 32),
                  anchor: new window.google.maps.Point(16, 16),
                }}
              />
            )}

            {/* Report Drop Pin */}
            {reportPos && (
              <Marker
                position={reportPos}
                icon={{
                  url: buildMarkerSVG("📌", "#FF1744", 44),
                  scaledSize: new window.google.maps.Size(44, 44),
                  anchor: new window.google.maps.Point(22, 22),
                }}
              />
            )}

            {/* Incident InfoWindow (marker mode) */}
            {selectedIncident && viewMode === "markers" && (
              <InfoWindow
                position={{ lat: selectedIncident.lat, lng: selectedIncident.lng }}
                onCloseClick={() => setSelectedInc(null)}
              >
                <div style={{ fontFamily: "system-ui", maxWidth: 200, color: "#111" }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>
                    {INCIDENT_TYPES[selectedIncident.type]?.icon} {INCIDENT_TYPES[selectedIncident.type]?.label}
                  </div>
                  <div style={{ fontSize: 12, color: "#444", marginBottom: 6 }}>
                    {selectedIncident.description}
                  </div>
                  <div style={{ fontSize: 11, color: "#888" }}>
                    👍 {selectedIncident.upvotes} · {formatRelativeTime(selectedIncident.timestamp)}
                    {selectedIncident.verified && " · ✓ Verified"}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>

          {/* Floating Map Legend Chips (top-right) */}
          <div className="sm-map-chips">
            <div className="sm-chip">
              <div className="sm-chip-dot" style={{ background: "#00E676" }} /> Safe
            </div>
            <div className="sm-chip">
              <div className="sm-chip-dot" style={{ background: "#FFD600" }} /> Guarded
            </div>
            <div className="sm-chip">
              <div className="sm-chip-dot" style={{ background: "#FF6D00" }} /> High
            </div>
            <div className="sm-chip">
              <div className="sm-chip-dot" style={{ background: "#FF1744" }} /> Critical
            </div>
          </div>

          {/* Report Form Overlay */}
          {reportMode && reportPos && (
            <div className="sm-overlay-anchor">
              <ReportForm
                position={reportPos}
                onSubmit={handleReportSubmit}
                onCancel={() => { setReportMode(false); setReportPos(null); }}
              />
            </div>
          )}

          {/* Incident Detail Overlay */}
          {selectedIncident && viewMode !== "markers" && (
            <div className="sm-overlay-anchor">
              <IncidentPanel
                incident={selectedIncident}
                allIncidents={filteredIncidents}
                onVote={voteOnIncident}
                onClose={() => setSelectedInc(null)}
                onRespond={markResponding}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyMap;