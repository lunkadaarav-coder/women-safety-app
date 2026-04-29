import { mockDangerZones } from "./mock/mockReports";

export default function Home({ setActivePage }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div style={{ padding: "20px 16px" }}>

      {/* Top bar */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px" }}>
        <div>
          <p style={{ fontSize:"12px", color:"#9CA3AF", margin:0 }}>{greeting} 👋</p>
          <h1 style={{ fontSize:"24px", fontWeight:"800", color:"#6C47FF", margin:0 }}>SafeCity</h1>
        </div>
        <div style={{ width:"42px", height:"42px", borderRadius:"50%", background:"#F3F0FF", color:"#6C47FF", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:"700", fontSize:"16px", border:"1px solid #DDD6FE" }}>
          A
        </div>
      </div>

      {/* Safety banner */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#EDFDF4", border:"1px solid #BBF7D0", borderRadius:"16px", padding:"14px 16px", marginBottom:"20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:"#16A34A", flexShrink:0 }} />
          <div>
            <p style={{ fontSize:"14px", fontWeight:"700", color:"#16A34A", margin:0 }}>You are safe</p>
            <p style={{ fontSize:"12px", color:"#16A34A", margin:0, opacity:0.8 }}>No danger zones within 500m</p>
          </div>
        </div>
        <span style={{ background:"#EDFDF4", color:"#16A34A", border:"1px solid #BBF7D0", fontSize:"11px", fontWeight:"700", padding:"4px 10px", borderRadius:"999px" }}>
          All clear
        </span>
      </div>

      {/* Quick actions */}
      <p style={{ fontSize:"11px", fontWeight:"700", color:"#9CA3AF", letterSpacing:"0.6px", textTransform:"uppercase", margin:"0 0 10px 0" }}>
        Quick actions
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px" }}>
        {[
          { icon:"📍", label:"Start journey", page:"journey", color:"#6C47FF" },
          { icon:"👥", label:"Contacts",       page:"contacts", color:"#0EA5E9" },
          { icon:"🚨", label:"Check alerts",   page:"alerts",   color:"#E53E3E" },
          { icon:"🗺️", label:"Safe route",     page:"route",    color:"#16A34A" },
        ].map((item) => (
          <button
            key={item.page}
            onClick={() => setActivePage(item.page)}
            style={{ background:"#fff", border:`1px solid ${item.color}33`, borderRadius:"14px", padding:"16px 12px", display:"flex", flexDirection:"column", alignItems:"flex-start", gap:"8px", cursor:"pointer" }}
          >
            <span style={{ fontSize:"24px" }}>{item.icon}</span>
            <p style={{ fontSize:"13px", fontWeight:"700", margin:0, color:item.color }}>{item.label}</p>
          </button>
        ))}
      </div>

      {/* Risk zones */}
      <p style={{ fontSize:"11px", fontWeight:"700", color:"#9CA3AF", letterSpacing:"0.6px", textTransform:"uppercase", margin:"0 0 10px 0" }}>
        Nearby risk zones
      </p>
      {mockDangerZones.map((zone) => (
        <div key={zone.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"#FAF9FF", border:"1px solid #EDE9FF", borderRadius:"16px", padding:"14px", marginBottom:"10px" }}>
          <div>
            <p style={{ fontSize:"14px", fontWeight:"600", color:"#1A1A2E", margin:0 }}>{zone.label}</p>
            <p style={{ fontSize:"12px", color:"#9CA3AF", margin:"2px 0 0 0" }}>{zone.lat.toFixed(4)}, {zone.lng.toFixed(4)}</p>
          </div>
          <span style={{
            fontSize:"11px", fontWeight:"700", padding:"3px 9px", borderRadius:"999px", whiteSpace:"nowrap",
            background: zone.riskLevel === "high" ? "#FFF1F2" : "#FFFBEB",
            color:      zone.riskLevel === "high" ? "#BE123C" : "#D97706",
            border:     zone.riskLevel === "high" ? "1px solid #FECDD3" : "1px solid #FDE68A",
          }}>
            {zone.riskLevel}
          </span>
        </div>
      ))}

      {/* Tip */}
      <div style={{ display:"flex", gap:"10px", alignItems:"flex-start", background:"#F3F0FF", border:"1px solid #DDD6FE", borderRadius:"14px", padding:"14px", marginTop:"8px" }}>
        <span style={{ fontSize:"16px" }}>💡</span>
        <p style={{ fontSize:"12px", color:"#6C47FF", margin:0, lineHeight:"1.5" }}>
          Tip: Start a journey before heading out so your contacts can track you in real time.
        </p>
      </div>

    </div>
  );
}