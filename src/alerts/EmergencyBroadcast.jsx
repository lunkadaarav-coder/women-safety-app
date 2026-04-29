import { useState, useEffect } from "react";

const POLICE_STATIONS = [
  { name: "Shivajinagar Police Station", distance: "1.2 km", phone: "020-25536000" },
  { name: "Deccan Police Station",       distance: "2.1 km", phone: "020-25654321" },
  { name: "Kothrud Police Station",      distance: "3.4 km", phone: "020-25388000" },
];

const HOSPITALS = [
  { name: "Ruby Hall Clinic",       distance: "1.8 km", phone: "020-26163391" },
  { name: "KEM Hospital",           distance: "2.3 km", phone: "020-26125600" },
  { name: "Jehangir Hospital",      distance: "2.9 km", phone: "020-66810000" },
];

export default function EmergencyBroadcast() {
  const [phase, setPhase]           = useState("idle"); // idle | confirm | broadcasting | live | done
  const [countdown, setCountdown]   = useState(5);
  const [log, setLog]               = useState([]);
  const [broadcastId]               = useState("EC-" + Math.random().toString(36).substr(2,6).toUpperCase());
  const [elapsed, setElapsed]       = useState(0);
  const [elapsedTimer, setElapsedTimer] = useState(null);
  const [targets, setTargets]       = useState({
    contacts: "pending",
    police:   "pending",
    hospital: "pending",
  });

  const userLocation = { lat: 18.5204, lng: 73.8567 };
  const now = new Date();
  const timeStr = now.toLocaleTimeString();
  const dateStr = now.toLocaleDateString();

  const emergencyBrief = `EMERGENCY ALERT — ${dateStr} ${timeStr}
ID: ${broadcastId}
User needs immediate assistance.
Last known location: ${userLocation.lat}, ${userLocation.lng}
Nearest landmark: Shivajinagar, Pune
Status: SOS TRIGGERED`;

  function addLog(msg, type = "info") {
    setLog((prev) => [
      { time: new Date().toLocaleTimeString(), msg, type },
      ...prev,
    ]);
  }

  // Phase: confirm → start countdown
  function triggerSOS() {
    setPhase("confirm");
    setCountdown(5);
  }

  // Cancel during countdown
  function cancelSOS() {
    setPhase("idle");
    setCountdown(5);
    setLog([]);
  }

  // Countdown effect
  useEffect(() => {
    if (phase !== "confirm") return;
    if (countdown === 0) {
      startBroadcast();
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  // Start broadcast sequence
  function startBroadcast() {
    setPhase("broadcasting");
    addLog("🔴 SOS triggered — starting emergency broadcast...", "danger");

    // Step 1: notify contacts
    setTimeout(() => {
      addLog("📱 Notifying trusted contacts (Mom, Rahul)...", "info");
    }, 800);
    setTimeout(() => {
      setTargets((t) => ({ ...t, contacts: "sent" }));
      addLog("✅ Contacts notified — live location link sent", "success");
    }, 2000);

    // Step 2: notify police
    setTimeout(() => {
      addLog("🚔 Locating nearest police station...", "info");
    }, 2800);
    setTimeout(() => {
      addLog(`🚔 Broadcasting to ${POLICE_STATIONS[0].name}...`, "info");
    }, 3800);
    setTimeout(() => {
      setTargets((t) => ({ ...t, police: "sent" }));
      addLog("✅ Police station alerted — emergency brief sent", "success");
    }, 5000);

    // Step 3: notify hospital
    setTimeout(() => {
      addLog("🏥 Locating nearest hospital...", "info");
    }, 5500);
    setTimeout(() => {
      setTargets((t) => ({ ...t, hospital: "sent" }));
      addLog(`✅ ${HOSPITALS[0].name} notified as backup`, "success");
    }, 7000);

    // Step 4: go live
    setTimeout(() => {
      addLog("📡 Evidence log activated — recording timeline...", "info");
      setPhase("live");
      const id = setInterval(() => setElapsed((e) => e + 1), 1000);
      setElapsedTimer(id);
    }, 8000);
  }

  function resolveEmergency() {
    clearInterval(elapsedTimer);
    addLog("🟢 Emergency resolved by user — broadcast ended", "success");
    setPhase("done");
  }

  function resetAll() {
    setPhase("idle");
    setCountdown(5);
    setLog([]);
    setElapsed(0);
    setTargets({ contacts:"pending", police:"pending", hospital:"pending" });
  }

  function formatTime(s) {
    const m = Math.floor(s / 60).toString().padStart(2,"0");
    const sec = (s % 60).toString().padStart(2,"0");
    return `${m}:${sec}`;
  }

  const targetConfig = [
    { key:"contacts", icon:"📱", label:"Trusted Contacts",         sub:"Mom, Rahul"                    },
    { key:"police",   icon:"🚔", label:POLICE_STATIONS[0].name,    sub:POLICE_STATIONS[0].distance      },
    { key:"hospital", icon:"🏥", label:HOSPITALS[0].name,          sub:HOSPITALS[0].distance            },
  ];

  return (
    <div style={s.container}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Emergency Broadcast</h2>
          <p style={s.subtitle}>Alerts contacts, police & hospital simultaneously</p>
        </div>
        <span style={{ fontSize:"28px" }}>🆘</span>
      </div>

      {/* IDLE */}
      {phase === "idle" && (
        <div>
          {/* How it works */}
          <div style={s.infoCard}>
            <p style={s.infoTitle}>What happens when you broadcast</p>
            {[
              "Your exact location is shared instantly",
              "Trusted contacts get a live tracking link",
              "Nearest police station receives emergency brief",
              "Nearest hospital is notified as backup",
              "A timestamped evidence log is created",
            ].map((step, i) => (
              <div key={i} style={s.stepRow}>
                <div style={s.stepNum}>{i + 1}</div>
                <p style={s.stepText}>{step}</p>
              </div>
            ))}
          </div>

          {/* Nearest responders */}
          <p style={s.label}>Nearest responders detected</p>
          <div style={s.responderCard}>
            {[...POLICE_STATIONS.slice(0,2), ...HOSPITALS.slice(0,1)].map((r, i) => (
              <div key={i} style={{
                ...s.responderRow,
                borderBottom: i < 2 ? `0.5px solid #EDE9FF` : "none",
                paddingBottom: i < 2 ? "10px" : "0",
                marginBottom: i < 2 ? "10px" : "0",
              }}>
                <div style={s.responderIcon}>{i < 2 ? "🚔" : "🏥"}</div>
                <div style={{ flex:1 }}>
                  <p style={s.responderName}>{r.name}</p>
                  <p style={s.responderSub}>{r.distance} · {r.phone}</p>
                </div>
              </div>
            ))}
          </div>

          {/* SOS Button */}
          <button style={s.sosBtn} onClick={triggerSOS}>
            <span style={{ fontSize:"32px" }}>🆘</span>
            <span style={s.sosBtnText}>Trigger Emergency Broadcast</span>
            <span style={s.sosBtnSub}>Alerts police, hospital & contacts</span>
          </button>
        </div>
      )}

      {/* CONFIRM — countdown */}
      {phase === "confirm" && (
        <div style={s.confirmBox}>
          <p style={s.confirmTitle}>Broadcasting in...</p>
          <div style={s.countdownCircle}>
            <span style={s.countdownNum}>{countdown}</span>
          </div>
          <p style={s.confirmSub}>
            All 3 targets will be alerted simultaneously
          </p>
          <button style={s.cancelBtn} onClick={cancelSOS}>
            ✕ Cancel — I am safe
          </button>
        </div>
      )}

      {/* BROADCASTING + LIVE */}
      {(phase === "broadcasting" || phase === "live" || phase === "done") && (
        <div>

          {/* Status banner */}
          <div style={{
            ...s.statusBanner,
            background: phase === "done" ? "#EDFDF4" : "#FFF1F2",
            border: `1px solid ${phase === "done" ? "#BBF7D0" : "#FECDD3"}`,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{
                width:"12px", height:"12px", borderRadius:"50%",
                background: phase === "done" ? "#16A34A" : "#E53E3E",
                flexShrink:0,
              }}/>
              <div>
                <p style={{ ...s.statusTitle, color: phase === "done" ? "#16A34A" : "#E53E3E" }}>
                  {phase === "done" ? "Emergency Resolved" :
                   phase === "live" ? "LIVE — Broadcasting Active" :
                   "Sending alerts..."}
                </p>
                <p style={{ ...s.statusSub, color: phase === "done" ? "#16A34A" : "#E53E3E" }}>
                  ID: {broadcastId}
                  {phase === "live" && ` · Active for ${formatTime(elapsed)}`}
                </p>
              </div>
            </div>
            {phase === "live" && (
              <span style={s.livePill}>● LIVE</span>
            )}
          </div>

          {/* Broadcast targets */}
          <p style={s.label}>Broadcast targets</p>
          <div style={s.responderCard}>
            {targetConfig.map((t, i) => (
              <div key={t.key} style={{
                ...s.responderRow,
                borderBottom: i < 2 ? "0.5px solid #EDE9FF" : "none",
                paddingBottom: i < 2 ? "10px" : "0",
                marginBottom: i < 2 ? "10px" : "0",
              }}>
                <div style={s.responderIcon}>{t.icon}</div>
                <div style={{ flex:1 }}>
                  <p style={s.responderName}>{t.label}</p>
                  <p style={s.responderSub}>{t.sub}</p>
                </div>
                <span style={{
                  fontSize:"11px", fontWeight:"700", padding:"3px 9px",
                  borderRadius:"999px", whiteSpace:"nowrap",
                  background: targets[t.key] === "sent" ? "#EDFDF4" : "#FFF7ED",
                  color:      targets[t.key] === "sent" ? "#16A34A" : "#D97706",
                  border:     targets[t.key] === "sent"
                    ? "1px solid #BBF7D0" : "1px solid #FDE68A",
                }}>
                  {targets[t.key] === "sent" ? "✅ Alerted" : "⏳ Sending"}
                </span>
              </div>
            ))}
          </div>

          {/* Emergency brief */}
          <p style={s.label}>Emergency brief sent</p>
          <div style={s.briefBox}>
            <pre style={s.briefText}>{emergencyBrief}</pre>
          </div>

          {/* Evidence log */}
          <p style={s.label}>Evidence log</p>
          <div style={s.logBox}>
            {log.length === 0 && (
              <p style={{ color:"#9CA3AF", fontSize:"12px", margin:0 }}>Waiting...</p>
            )}
            {log.map((entry, i) => (
              <div key={i} style={{
                ...s.logRow,
                borderBottom: i < log.length - 1 ? "0.5px solid #EDE9FF" : "none",
                paddingBottom: i < log.length - 1 ? "8px" : "0",
                marginBottom:  i < log.length - 1 ? "8px" : "0",
              }}>
                <span style={s.logTime}>{entry.time}</span>
                <span style={{
                  ...s.logMsg,
                  color: entry.type === "success" ? "#16A34A" :
                         entry.type === "danger"  ? "#E53E3E" : "#4B5563",
                }}>
                  {entry.msg}
                </span>
              </div>
            ))}
          </div>

          {/* Resolve button */}
          {phase === "live" && (
            <button style={s.resolveBtn} onClick={resolveEmergency}>
              🟢 I am safe — Resolve Emergency
            </button>
          )}

          {/* Reset after done */}
          {phase === "done" && (
            <button style={s.resetBtn} onClick={resetAll}>
              🔄 Back to safety
            </button>
          )}

        </div>
      )}

    </div>
  );
}

const s = {
  container: { padding:"20px 16px", fontFamily:"system-ui, sans-serif" },
  header: {
    display:"flex", justifyContent:"space-between",
    alignItems:"flex-start", marginBottom:"20px",
  },
  title:    { fontSize:"20px", fontWeight:"800", color:"#1A1A2E", margin:0 },
  subtitle: { fontSize:"12px", color:"#9CA3AF", margin:"4px 0 0 0" },
  label: {
    fontSize:"11px", fontWeight:"700", color:"#9CA3AF",
    letterSpacing:"0.5px", textTransform:"uppercase", margin:"0 0 8px 0",
  },
  infoCard: {
    background:"#F3F0FF", border:"1px solid #DDD6FE",
    borderRadius:"16px", padding:"16px", marginBottom:"20px",
  },
  infoTitle: { fontSize:"14px", fontWeight:"700", color:"#6C47FF", margin:"0 0 12px 0" },
  stepRow:  { display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" },
  stepNum:  {
    width:"22px", height:"22px", borderRadius:"50%",
    background:"#6C47FF", color:"#fff", display:"flex",
    alignItems:"center", justifyContent:"center",
    fontSize:"11px", fontWeight:"700", flexShrink:0,
  },
  stepText: { fontSize:"12px", color:"#6C47FF", margin:0 },
  responderCard: {
    background:"#FAF9FF", border:"1px solid #EDE9FF",
    borderRadius:"16px", padding:"14px", marginBottom:"20px",
  },
  responderRow: { display:"flex", alignItems:"center", gap:"10px" },
  responderIcon: {
    width:"36px", height:"36px", borderRadius:"10px",
    background:"#F3F0FF", display:"flex",
    alignItems:"center", justifyContent:"center", fontSize:"18px", flexShrink:0,
  },
  responderName: { fontSize:"13px", fontWeight:"600", color:"#1A1A2E", margin:0 },
  responderSub:  { fontSize:"11px", color:"#9CA3AF", margin:"2px 0 0 0" },
  sosBtn: {
    width:"100%", background:"#E53E3E", border:"none",
    borderRadius:"20px", padding:"24px 16px", display:"flex",
    flexDirection:"column", alignItems:"center", gap:"6px", cursor:"pointer",
    marginBottom:"8px",
  },
  sosBtnText: { fontSize:"16px", fontWeight:"800", color:"#fff" },
  sosBtnSub:  { fontSize:"12px", color:"#fff", opacity:0.85 },
  confirmBox: {
    display:"flex", flexDirection:"column", alignItems:"center",
    padding:"40px 20px", gap:"20px",
  },
  confirmTitle: { fontSize:"18px", fontWeight:"700", color:"#E53E3E", margin:0 },
  countdownCircle: {
    width:"100px", height:"100px", borderRadius:"50%",
    background:"#FFF1F2", border:"4px solid #E53E3E",
    display:"flex", alignItems:"center", justifyContent:"center",
  },
  countdownNum: { fontSize:"48px", fontWeight:"800", color:"#E53E3E" },
  confirmSub:   { fontSize:"13px", color:"#6B7280", textAlign:"center", margin:0 },
  cancelBtn: {
    width:"100%", padding:"14px", background:"#F3F4F6",
    color:"#374151", border:"1px solid #E5E7EB",
    borderRadius:"14px", fontSize:"14px", fontWeight:"700", cursor:"pointer",
  },
  statusBanner: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    borderRadius:"16px", padding:"14px 16px", marginBottom:"20px",
  },
  statusTitle: { fontSize:"14px", fontWeight:"700", margin:0 },
  statusSub:   { fontSize:"11px", margin:"2px 0 0 0" },
  livePill: {
    background:"#E53E3E", color:"#fff", fontSize:"11px",
    fontWeight:"700", padding:"4px 10px", borderRadius:"999px",
  },
  briefBox: {
    background:"#1A1A2E", borderRadius:"12px",
    padding:"14px", marginBottom:"20px", overflowX:"auto",
  },
  briefText: {
    fontSize:"11px", color:"#A5F3FC", margin:0,
    fontFamily:"monospace", lineHeight:"1.7", whiteSpace:"pre-wrap",
  },
  logBox: {
    background:"#FAF9FF", border:"1px solid #EDE9FF",
    borderRadius:"12px", padding:"14px", marginBottom:"20px",
    maxHeight:"200px", overflowY:"auto",
  },
  logRow:  { display:"flex", gap:"10px", alignItems:"flex-start" },
  logTime: { fontSize:"10px", color:"#9CA3AF", whiteSpace:"nowrap", paddingTop:"2px", minWidth:"60px" },
  logMsg:  { fontSize:"12px", lineHeight:"1.5" },
  resolveBtn: {
    width:"100%", padding:"15px", background:"#16A34A",
    color:"#fff", border:"none", borderRadius:"14px",
    fontSize:"14px", fontWeight:"700", cursor:"pointer", marginBottom:"8px",
  },
  resetBtn: {
    width:"100%", padding:"15px", background:"#F3F0FF",
    color:"#6C47FF", border:"1px solid #DDD6FE",
    borderRadius:"14px", fontSize:"14px", fontWeight:"700", cursor:"pointer",
  },
};