import { useState } from "react";
import { colors } from "./theme";
import Home               from "./Home";
import Contacts           from "./contacts/Contacts";
import AlertSystem        from "./alerts/AlertSystem";
import SafeRoute          from "./alerts/SafeRoute";
import JourneyMode        from "./alerts/JourneyMode";
import EmergencyBroadcast from "./alerts/EmergencyBroadcast";

const tabs = [
  { id: "home",      icon: "\u{1F3E0}", label: "Home"      },
  { id: "alerts",    icon: "\u{1F6A8}", label: "Alerts"    },
  { id: "contacts",  icon: "\u{1F465}", label: "Contacts"  },
  { id: "journey",   icon: "\u{1F4CD}", label: "Journey"   },
  { id: "route",     icon: "\u{1F5FA}", label: "Route"     },
  { id: "emergency", icon: "\u{1F198}", label: "SOS"       },
];

const pageTitles = {
  home:      "Command dashboard",
  alerts:    "Safety alerts",
  contacts:  "Trusted contacts",
  journey:   "Journey mode",
  route:     "Safe route planning",
  emergency: "Emergency broadcast",
};

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
      default:           return <Home setActivePage={setActivePage} />;
    }
  }

  const currentTab = tabs.find((tab) => tab.id === activePage) ?? tabs[0];

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>
            <div style={styles.brandMark}>SC</div>
            <div>
              <div style={styles.brandName}>SafeCity</div>
              <div style={styles.brandTag}>Security workspace</div>
            </div>
          </div>

          <nav style={styles.navList}>
            {tabs.map((tab) => {
              const active = activePage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePage(tab.id)}
                  style={{
                    ...styles.navButton,
                    ...(active ? styles.navButtonActive : {}),
                  }}
                >
                  <span style={styles.navIcon}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div style={styles.sidebarFooter}>
          <p style={styles.footerLabel}>Workspace status</p>
          <p style={styles.footerText}>No active incidents. All systems nominal.</p>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <div>
            <p style={styles.topLabel}>Live web console</p>
            <h1 style={styles.topTitle}>{pageTitles[activePage]}</h1>
            <p style={styles.topDescription}>
              Manage alerts, routes, trips, and emergency broadcasts from a desktop-style dashboard.
            </p>
          </div>

          <div style={styles.headerMeta}>
            <span style={styles.badge}>{currentTab.label}</span>
            <span style={styles.dateBadge}>{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <section style={styles.content}>{renderPage()}</section>
      </main>
    </div>
  );
}

const styles = {
  shell: {
    display: "flex",
    minHeight: "100vh",
    background: colors.bg,
    color: colors.textPrimary,
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  sidebar: {
    width: "260px",
    minWidth: "260px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "32px 24px",
    background: colors.white,
    borderRight: `1px solid ${colors.border}`,
    boxShadow: "4px 0 30px rgba(15, 23, 42, 0.06)",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "32px",
  },
  brandMark: {
    width: "44px",
    height: "44px",
    borderRadius: "16px",
    background: colors.primaryLight,
    color: colors.primary,
    display: "grid",
    placeItems: "center",
    fontWeight: "800",
    fontSize: "18px",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: "800",
    margin: 0,
  },
  brandTag: {
    fontSize: "12px",
    color: colors.textMuted,
    margin: 0,
  },
  navList: {
    display: "grid",
    gap: "10px",
  },
  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid transparent",
    background: "transparent",
    color: colors.textSecondary,
    fontSize: "14px",
    textAlign: "left",
    cursor: "pointer",
    transition: "background 0.2s, color 0.2s, border-color 0.2s",
  },
  navButtonActive: {
    background: colors.primaryLight,
    color: colors.primary,
    borderColor: colors.primaryBorder,
    boxShadow: "inset 0 0 0 1px rgba(108, 71, 255, 0.12)",
  },
  navIcon: {
    fontSize: "18px",
  },
  sidebarFooter: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: `1px solid ${colors.border}`,
  },
  footerLabel: {
    margin: 0,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: colors.textMuted,
    fontWeight: "700",
  },
  footerText: {
    margin: "8px 0 0 0",
    fontSize: "12px",
    color: colors.textSecondary,
    lineHeight: "1.6",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "24px",
    padding: "32px 32px 0",
  },
  topLabel: {
    margin: 0,
    fontSize: "12px",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: colors.primary,
    fontWeight: "700",
  },
  topTitle: {
    margin: "8px 0 12px 0",
    fontSize: "36px",
    lineHeight: "1.05",
    color: colors.textPrimary,
  },
  topDescription: {
    margin: 0,
    maxWidth: "760px",
    color: colors.textSecondary,
    lineHeight: "1.8",
    fontSize: "15px",
  },
  headerMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },
  badge: {
    background: colors.primaryLight,
    color: colors.primary,
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "12px",
  },
  dateBadge: {
    background: colors.cardBg,
    color: colors.textSecondary,
    padding: "10px 16px",
    borderRadius: "999px",
    fontSize: "12px",
  },
  content: {
    flex: 1,
    padding: "24px 32px 32px",
  },
};
