import { useState } from "react";
import { colors, font } from "../theme";

const cardStyle = {
  background:   "#FAF9FF",
  border:       "1px solid #EDE9FF",
  borderRadius: "16px",
  padding:      "14px",
  marginBottom: "12px",
};

const greenPill = {
  background:   "#EDFDF4",
  color:        "#16A34A",
  border:       "1px solid #BBF7D0",
  fontSize:     "11px",
  fontWeight:   "700",
  padding:      "3px 9px",
  borderRadius: "999px",
  whiteSpace:   "nowrap",
};

export default function JourneyMode() {
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [destination, setDestination]       = useState("");
  const [elapsed, setElapsed]               = useState(0);
  const [intervalId, setIntervalId]         = useState(null);

  const contacts = [
    { id: 1, name: "Mom",   initials: "M" },
    { id: 2, name: "Rahul", initials: "R" },
  ];

  function startJourney() {
    if (!destination.trim()) return;
    setJourneyStarted(true);
    const id = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    setIntervalId(id);
  }

  function endJourney() {
    clearInterval(intervalId);
    setJourneyStarted(false);
    setDestination("");
    setElapsed(0);
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Journey Mode</h2>
          <p style={styles.subtitle}>Share your live trip with trusted contacts</p>
        </div>
        <span style={{ fontSize: "28px" }}>📍</span>
      </div>

      {!journeyStarted ? (

        /* PRE-JOURNEY SCREEN */
        <div>
          <div style={styles.infoCard}>
            <p style={styles.infoTitle}>How it works</p>
            {[
              "Enter your destination",
              "Your contacts are notified instantly",
              "They can see you are on a trip",
              "End journey when you arrive safely",
            ].map((step, i) => (
              <div key={i} style={styles.stepRow}>
                <div style={styles.stepNum}>{i + 1}</div>
                <p style={styles.stepText}>{step}</p>
              </div>
            ))}
          </div>

          <p style={styles.label}>Where are you headed?</p>
          <input
            style={styles.input}
            type="text"
            placeholder="e.g. College, Mall, Home..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />

          <p style={styles.label}>Contacts who will be notified</p>
          <div style={cardStyle}>
            {contacts.map((c, i) => (
              <div
                key={c.id}
                style={{
                  ...styles.contactRow,
                  borderBottom: i < contacts.length - 1
                    ? "0.5px solid #EDE9FF"
                    : "none",
                  marginBottom: i < contacts.length - 1 ? "10px" : "0",
                  paddingBottom: i < contacts.length - 1 ? "10px" : "0",
                }}
              >
                <div style={styles.avatar}>{c.initials}</div>
                <p style={styles.contactName}>{c.name}</p>
                <span style={greenPill}>Will be notified</span>
              </div>
            ))}
          </div>

          <button
            style={{
              ...styles.mainBtn,
              background: destination.trim() ? colors.primary : "#D1D5DB",
              cursor:     destination.trim() ? "pointer"        : "not-allowed",
            }}
            onClick={startJourney}
            disabled={!destination.trim()}
          >
            🚀 Start Journey
          </button>
        </div>

      ) : (

        /* ACTIVE JOURNEY SCREEN */
        <div>
          {/* Live status */}
          <div style={styles.liveCard}>
            <div style={styles.liveTop}>
              <div style={styles.liveDot} />
              <span style={styles.liveText}>Journey in progress</span>
              <span style={styles.timer}>{formatTime(elapsed)}</span>
            </div>
            <p style={styles.destText}>
              📍 Heading to: <strong>{destination}</strong>
            </p>
          </div>

          {/* Contacts watching */}
          <p style={styles.label}>Contacts watching your trip</p>
          <div style={cardStyle}>
            {contacts.map((c, i) => (
              <div
                key={c.id}
                style={{
                  ...styles.contactRow,
                  borderBottom: i < contacts.length - 1
                    ? "0.5px solid #EDE9FF"
                    : "none",
                  marginBottom: i < contacts.length - 1 ? "10px" : "0",
                  paddingBottom: i < contacts.length - 1 ? "10px" : "0",
                }}
              >
                <div style={{
                  ...styles.avatar,
                  background: "#EDFDF4",
                  color:      "#16A34A",
                }}>
                  {c.initials}
                </div>
                <p style={styles.contactName}>{c.name}</p>
                <span style={greenPill}>Watching 👀</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <p style={styles.label}>Trip summary</p>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <p style={styles.statValue}>{formatTime(elapsed)}</p>
              <p style={styles.statLabel}>Time elapsed</p>
            </div>
            <div style={styles.statCard}>
              <p style={styles.statValue}>{contacts.length}</p>
              <p style={styles.statLabel}>Watching</p>
            </div>
            <div style={styles.statCard}>
              <p style={{ ...styles.statValue, color: "#16A34A" }}>Safe</p>
              <p style={styles.statLabel}>Status</p>
            </div>
          </div>

          {/* Tip */}
          <div style={styles.tipBox}>
            <span style={{ fontSize: "14px" }}>💡</span>
            <p style={styles.tipText}>
              Your contacts have been notified. End the journey once you arrive safely.
            </p>
          </div>

          {/* End button */}
          <button
            style={{ ...styles.mainBtn, background: colors.danger }}
            onClick={endJourney}
          >
            ✅ I Arrived Safely — End Journey
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px 16px" },
  header: {
    display:        "flex",
    justifyContent: "space-between",
    alignItems:     "flex-start",
    marginBottom:   "20px",
  },
  title:    { fontSize: "20px", fontWeight: "800", color: "#1A1A2E", margin: 0 },
  subtitle: { fontSize: "12px", color: "#9CA3AF", margin: "4px 0 0 0" },
  label: {
    fontSize:      "11px",
    fontWeight:    "700",
    color:         "#9CA3AF",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    margin:        "0 0 8px 0",
  },
  infoCard: {
    background:   "#F3F0FF",
    border:       "1px solid #DDD6FE",
    borderRadius: "16px",
    padding:      "16px",
    marginBottom: "20px",
  },
  infoTitle: {
    fontSize:     "14px",
    fontWeight:   "700",
    color:        "#6C47FF",
    margin:       "0 0 12px 0",
  },
  stepRow:  { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  stepNum:  {
    width:          "22px",
    height:         "22px",
    borderRadius:   "50%",
    background:     "#6C47FF",
    color:          "#fff",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontSize:       "11px",
    fontWeight:     "700",
    flexShrink:     0,
  },
  stepText: { fontSize: "12px", color: "#6C47FF", margin: 0 },
  input: {
    width:        "100%",
    padding:      "13px 16px",
    fontSize:     "14px",
    border:       "1.5px solid #EDE9FF",
    borderRadius: "12px",
    outline:      "none",
    background:   "#fff",
    marginBottom: "20px",
    boxSizing:    "border-box",
    color:        "#1A1A2E",
  },
  contactRow: {
    display:     "flex",
    alignItems:  "center",
    gap:         "10px",
  },
  avatar: {
    width:          "34px",
    height:         "34px",
    borderRadius:   "50%",
    background:     "#F3F0FF",
    color:          "#6C47FF",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    fontWeight:     "700",
    fontSize:       "12px",
    flexShrink:     0,
  },
  contactName: {
    flex:       1,
    fontSize:   "14px",
    fontWeight: "600",
    color:      "#1A1A2E",
    margin:     0,
  },
  mainBtn: {
    width:        "100%",
    padding:      "15px",
    color:        "#fff",
    border:       "none",
    borderRadius: "14px",
    fontSize:     "14px",
    fontWeight:   "700",
    marginTop:    "8px",
    cursor:       "pointer",
  },
  liveCard: {
    background:   "#EDFDF4",
    border:       "1px solid #BBF7D0",
    borderRadius: "16px",
    padding:      "16px",
    marginBottom: "20px",
  },
  liveTop: {
    display:      "flex",
    alignItems:   "center",
    gap:          "8px",
    marginBottom: "8px",
  },
  liveDot: {
    width:        "10px",
    height:       "10px",
    borderRadius: "50%",
    background:   "#16A34A",
    flexShrink:   0,
  },
  liveText:  { flex: 1, fontSize: "14px", fontWeight: "700", color: "#16A34A" },
  timer:     { fontSize: "16px", fontWeight: "800", color: "#16A34A" },
  destText:  { fontSize: "12px", color: "#16A34A", margin: 0 },
  statsGrid: {
    display:             "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap:                 "10px",
    marginBottom:        "16px",
  },
  statCard: {
    background:   "#fff",
    border:       "1px solid #EDE9FF",
    borderRadius: "12px",
    padding:      "14px 10px",
    textAlign:    "center",
  },
  statValue: { fontSize: "20px", fontWeight: "800", color: "#6C47FF", margin: "0 0 4px 0" },
  statLabel: { fontSize: "11px", color: "#9CA3AF", margin: 0 },
  tipBox: {
    display:      "flex",
    gap:          "8px",
    background:   "#F3F0FF",
    border:       "1px solid #DDD6FE",
    borderRadius: "12px",
    padding:      "12px",
    marginBottom: "16px",
  },
  tipText: { fontSize: "12px", color: "#6C47FF", margin: 0, lineHeight: "1.5" },
};