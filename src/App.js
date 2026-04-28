import { useState } from "react";
import { colors, font } from "./theme";
import Home        from "./Home";
import Contacts    from "./contacts/Contacts";
import AlertSystem from "./alerts/AlertSystem";
import SafeRoute   from "./alerts/SafeRoute";
import JourneyMode from "./alerts/JourneyMode";

const tabs = [
  { id: "home",     icon: "🏠", label: "Home"     },
  { id: "contacts", icon: "👥", label: "Contacts"  },
  { id: "alerts",   icon: "🚨", label: "Alerts"    },
  { id: "journey",  icon: "📍", label: "Journey"   },
  { id: "route",    icon: "🗺️", label: "Route"     },
];

export default function App() {
  const [activePage, setActivePage] = useState("home");

  function renderPage() {
    switch (activePage) {
      case "home":     return <Home     setActivePage={setActivePage} />;
      case "contacts": return <Contacts />;
      case "alerts":   return <AlertSystem />;
      case "journey":  return <JourneyMode />;
      case "route":    return <SafeRoute />;
      default:         return <Home     setActivePage={setActivePage} />;
    }
  }

  return (
    <div style={styles.bg}>
      {/* Page content */}
      <div style={styles.content}>
        {renderPage()}
      </div>

      {/* Bottom navbar */}
      <div style={styles.navbar}>
        {tabs.map((tab) => {
          const active = activePage === tab.id;
          return (
            <button
              key={tab.id}
              style={{ ...styles.navBtn, color: active ? colors.primary : colors.textMuted }}
              onClick={() => setActivePage(tab.id)}
            >
              <div style={{
                ...styles.navIcon,
                background: active ? colors.primaryLight : "transparent",
              }}>
                <span style={{ fontSize: "18px" }}>{tab.icon}</span>
              </div>
              <span style={{
                fontSize:   font.xs,
                fontWeight: active ? "700" : "400",
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
    position:      "relative",
  },
  content: {
    flex:           1,
    overflowY:      "auto",
    paddingBottom:  "80px",
  },
  navbar: {
    position:       "fixed",
    bottom:         0,
    left:           "50%",
    transform:      "translateX(-50%)",
    width:          "100%",
    maxWidth:       "480px",
    display:        "flex",
    background:     colors.white,
    borderTop:      `1px solid ${colors.border}`,
    zIndex:         100,
  },
  navBtn: {
    flex:           1,
    display:        "flex",
    flexDirection:  "column",
    alignItems:     "center",
    gap:            "3px",
    padding:        "10px 4px 8px",
    border:         "none",
    background:     "transparent",
    cursor:         "pointer",
  },
  navIcon: {
    width:          "36px",
    height:         "36px",
    borderRadius:   "10px",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    transition:     "background 0.2s",
  },
};