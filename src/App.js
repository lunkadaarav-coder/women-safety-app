import { useState } from "react";
import { colors, font } from "./theme";
import Home               from "./Home";
import Contacts           from "./contacts/Contacts";
import AlertSystem        from "./alerts/AlertSystem";
import SafeRoute          from "./alerts/SafeRoute";
import JourneyMode        from "./alerts/JourneyMode";
import EmergencyBroadcast from "./alerts/EmergencyBroadcast";

const tabs = [
  { id: "home",      icon: "🏠", label: "Home"     },
  { id: "contacts",  icon: "👥", label: "Contacts"  },
  { id: "journey",   icon: "📍", label: "Journey"   },
  { id: "route",     icon: "🗺️", label: "Route"     },
  { id: "emergency", icon: "🆘", label: "SOS"       },
];

export default function App() {
  const [activePage, setActivePage] = useState("home");

  function renderPage() {
    switch (activePage) {
      case "home":      return <Home setActivePage={setActivePage} />;
      case "contacts":  return <Contacts />;
      case "alerts":    return <AlertSystem />;
      case "journey":   return <JourneyMode />;
      case "route":     return <SafeRoute />;
      case "emergency": return <EmergencyBroadcast />;
      default:          return <Home setActivePage={setActivePage} />;
    }
  }

  return (
    <div style={styles.bg}>
      <div style={styles.content}>
        {renderPage()}
      </div>

      {/* Bottom navbar */}
      <div style={styles.navbar}>
        {tabs.map((tab) => {
          const active = activePage === tab.id;
          const isSOS  = tab.id === "emergency";
          return (
            <button
              key={tab.id}
              style={{
                ...styles.navBtn,
                color: isSOS
                  ? "#E53E3E"
                  : active ? colors.primary : colors.textMuted,
              }}
              onClick={() => setActivePage(tab.id)}
            >
              <div style={{
                ...styles.navIcon,
                background: isSOS
                  ? "#FFF1F2"
                  : active ? colors.primaryLight : "transparent",
                borderRadius:  isSOS ? "50%"  : "10px",
                width:         isSOS ? "42px" : "36px",
                height:        isSOS ? "42px" : "36px",
                marginTop:     isSOS ? "-14px": "0",
                border:        isSOS ? "2px solid #E53E3E" : "none",
              }}>
                <span style={{ fontSize: isSOS ? "20px" : "18px" }}>
                  {tab.icon}
                </span>
              </div>
              <span style={{
                fontSize:   font.xs,
                fontWeight: active || isSOS ? "700" : "400",
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    background:    colors.bg,
    minHeight:     "100vh",
    maxWidth:      "480px",
    margin:        "0 auto",
    display:       "flex",
    flexDirection: "column",
    fontFamily:    "system-ui, -apple-system, sans-serif",
  },
  content: {
    flex:          1,
    overflowY:     "auto",
    paddingBottom: "90px",
  },
  navbar: {
    position:   "fixed",
    bottom:     0,
    left:       "50%",
    transform:  "translateX(-50%)",
    width:      "100%",
    maxWidth:   "480px",
    display:    "flex",
    alignItems: "flex-end",
    background: colors.white,
    borderTop:  `1px solid ${colors.border}`,
    zIndex:     100,
    paddingBottom: "8px",
  },
  navBtn: {
    flex:          1,
    display:       "flex",
    flexDirection: "column",
    alignItems:    "center",
    gap:           "3px",
    padding:       "10px 4px 4px",
    border:        "none",
    background:    "transparent",
    cursor:        "pointer",
  },
  navIcon: {
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    transition:     "background 0.2s",
  },
};