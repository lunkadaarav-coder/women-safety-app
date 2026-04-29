export default function Navbar({ activePage, setActivePage }) {
  const tabs = [
    { id: "contacts", label: "👥 Contacts" },
    { id: "alerts",   label: "🚨 Alerts"   },
    { id: "route",    label: "🗺️ Safe Route" },
  ];

  return (
    <div style={styles.wrapper}>
      {/* App title */}
      <div style={styles.titleBar}>
        <span style={styles.logo}>🛡️</span>
        <span style={styles.appName}>SafeCity</span>
        <span style={styles.badge}>Person 4</span>
      </div>

      {/* Tab navigation */}
      <div style={styles.tabBar}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              background:   activePage === tab.id ? "#4F46E5" : "transparent",
              color:        activePage === tab.id ? "#fff"    : "#555",
              fontWeight:   activePage === tab.id ? "600"     : "400",
            }}
            onClick={() => setActivePage(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    maxWidth: "480px",
    margin: "0 auto 24px auto",
    fontFamily: "sans-serif",
  },
  titleBar: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
    padding: "0 4px",
  },
  logo: { fontSize: "26px" },
  appName: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a1a1a",
    flex: 1,
  },
  badge: {
    fontSize: "11px",
    fontWeight: "600",
    background: "#EEF2FF",
    color: "#4F46E5",
    border: "1px solid #C7D2FE",
    borderRadius: "20px",
    padding: "3px 10px",
  },
  tabBar: {
    display: "flex",
    background: "#fff",
    borderRadius: "14px",
    padding: "4px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    gap: "4px",
  },
  tab: {
    flex: 1,
    padding: "10px 6px",
    border: "none",
    borderRadius: "10px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};