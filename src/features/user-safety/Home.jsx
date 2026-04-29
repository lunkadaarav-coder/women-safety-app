import { colors, font } from "./theme";
import { mockDangerZones } from "./mock/mockReports";

export default function Home({ setActivePage }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={styles.container}>

      {/* Top bar */}
      <div style={styles.topBar}>
        <div>
          <p style={styles.greeting}>{greeting} 👋</p>
          <h1 style={styles.appName}>SafeCity</h1>
        </div>
        <div style={styles.avatarCircle}>A</div>
      </div>

      {/* Safety status banner */}
      <div style={styles.safeBanner}>
        <div style={styles.safeLeft}>
          <div style={styles.pulseDot} />
          <div>
            <p style={styles.safeTitle}>You are safe</p>
            <p style={styles.safeSub}>No danger zones within 500m</p>
          </div>
        </div>
        <span style={styles.clearPill}>All clear</span>
      </div>

      {/* Quick actions */}
      <p style={styles.sectionLabel}>Quick actions</p>
      <div style={styles.quickGrid}>
        {[
          { icon: "📍", label: "Start journey", page: "journey", color: colors.primary  },
          { icon: "👥", label: "Contacts",       page: "contacts", color: "#0EA5E9"     },
          { icon: "🚨", label: "Check alerts",   page: "alerts",   color: "#E53E3E"     },
          { icon: "🗺️", label: "Safe route",     page: "route",    color: "#16A34A"     },
        ].map((item) => (
          <button
            key={item.page}
            style={{ ...styles.quickCard, borderColor: item.color + "33" }}
            onClick={() => setActivePage(item.page)}
          >
            <span style={{ fontSize: "24px" }}>{item.icon}</span>
            <p style={{ ...styles.quickLabel, color: item.color }}>{item.label}</p>
          </button>
        ))}
      </div>

      {/* Nearby risk zones */}
      <p style={styles.sectionLabel}>Nearby risk zones</p>
      {mockDangerZones.map((zone) => (
        <div key={zone.id} style={styles.zoneCard}>
          <div>
            <p style={styles.zoneName}>{zone.label}</p>
            <p style={styles.zoneCoords}>
              {zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}
            </p>
          </div>
          <span style={{
            ...styles.pill,
            background: zone.riskLevel === "high" ? "#FFF1F2" : "#FFFBEB",
            color:      zone.riskLevel === "high" ? "#BE123C" : "#D97706",
            border:     zone.riskLevel === "high"
              ? "1px solid #FECDD3"
              : "1px solid #FDE68A",
          }}>
            {zone.riskLevel}
          </span>
        </div>
      ))}

      {/* Tip */}
      <div style={styles.tip}>
        <span style={{ fontSize: "16px" }}>💡</span>
        <p style={styles.tipText}>
          Tip: Start a journey before heading out so your contacts can track you in real time.
        </p>
      </div>

    </div>
  );
}

const styles = {
  container:    { padding: "20px 16px" },
  topBar: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    marginBottom:   "20px",
  },
  greeting:  { fontSize: "12px", color: "#9CA3AF", margin: 0 },
  appName:   { fontSize: "24px", fontWeight: "800", color: "#6C47FF", margin: 0 },
  avatarCircle: {
    width:          "42px",
    height:         "42px",
    borderRadius:   "50%",
    background:     "#F3F0FF",
    color:          "#6C47FF",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontWeight:     "700",
    fontSize:       "16px",
    border:         "1px solid #DDD6FE",
  },
  safeBanner: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    background:     "#EDFDF4",
    border:         "1px solid #BBF7D0",
    borderRadius:   "16px",
    padding:        "14px 16px",
    marginBottom:   "20px",
  },
  safeLeft:  { display: "flex", alignItems: "center", gap: "12px" },
  pulseDot:  {
    width:        "12px",
    height:       "12px",
    borderRadius: "50%",
    background:   "#16A34A",
    flexShrink:   0,
  },
  safeTitle:  { fontSize: "14px", fontWeight: "700", color: "#16A34A", margin: 0 },
  safeSub:    { fontSize: "12px", color: "#16A34A",  margin: 0, opacity: 0.8 },
  clearPill: {
    background:   "#EDFDF4",
    color:        "#16A34A",
    border:       "1px solid #BBF7D0",
    fontSize:     "11px",
    fontWeight:   "700",
    padding:      "4px 10px",
    borderRadius: "999px",
  },
  sectionLabel: {
    fontSize:      "11px",
    fontWeight:    "700",
    color:         "#9CA3AF",
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    margin:        "0 0 10px 0",
  },
  quickGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr",
    gap:                 "10px",
    marginBottom:        "20px",
  },
  quickCard: {
    background:    "#fff",
    border:        "1px solid",
    borderRadius:  "14px",
    padding:       "16px 12px",
    display:       "flex",
    flexDirection: "column",
    alignItems:    "flex-start",
    gap:           "8px",
    cursor:        "pointer",
  },
  quickLabel: { fontSize: "13px", fontWeight: "700", margin: 0 },
  zoneCard: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "center",
    background:     "#FAF9FF",
    border:         "1px solid #EDE9FF",
    borderRadius:   "16px",
    padding:        "14px",
    marginBottom:   "10px",
  },
  zoneName:   { fontSize: "14px", fontWeight: "600", color: "#1A1A2E", margin: 0 },
  zoneCoords: { fontSize: "12px", color: "#9CA3AF", margin: "2px 0 0 0" },
  pill: {
    fontSize:     "11px",
    fontWeight:   "700",
    padding:      "3px 9px",
    borderRadius: "999px",
    whiteSpace:   "nowrap",
  },
  tip: {
    display:      "flex",
    gap:          "10px",
    alignItems:   "flex-start",
    background:   "#F3F0FF",
    border:       "1px solid #DDD6FE",
    borderRadius: "14px",
    padding:      "14px",
    marginTop:    "8px",
  },
  tipText: { fontSize: "12px", color: "#6C47FF", margin: 0, lineHeight: "1.5" },
};