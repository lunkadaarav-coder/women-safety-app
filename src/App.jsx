import { useState } from "react";
import { AlertTriangle, Compass, Home as HomeIcon, MapPin, Route, Shield, Siren, Users } from "lucide-react";

// Feature Imports
import Home from "./features/user-safety/Home";
import SosTracker from "./features/sos/SosTracker";
import SafetyMap from "./features/map/SafetyMap";
import ReportForm from "./features/reports/ReportForm";
import ReportList from "./features/reports/ReportList";
import JourneyMode from "./features/user-safety/alerts/JourneyMode";
import Contacts from "./features/user-safety/contacts/Contacts";
import AlertSystem from "./features/user-safety/alerts/AlertSystem";

const navItems = [
  { id: "dashboard", label: "Home", icon: HomeIcon },
  { id: "sos", label: "SOS", icon: Siren },
  { id: "map", label: "Risk Map", icon: MapPin },
  { id: "reports", label: "Reports", icon: AlertTriangle },
  { id: "journey", label: "Journey", icon: Route },
  { id: "contacts", label: "Contacts", icon: Users },
];

const allPages = [
  ...navItems,
  { id: "route", label: "Safe Route" },
  { id: "alerts", label: "Alerts" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [reports, setReports] = useState([]);

  const activeNav = allPages.find((item) => item.id === page) ?? navItems[0];

  const handleAddReport = (report) => {
    setReports([report, ...reports]);
  };

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Shield size={22} /></div>
          <div>
            <strong>SafeCircle</strong>
            <span>Integrated Project</span>
          </div>
        </div>
        <nav>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
              <Icon size={19} />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      <section className="content" style={{ overflowY: 'auto' }}>
        <header className="mobile-header">
          <div>
            <p className="eyebrow">Current view</p>
            <h1>{activeNav.label}</h1>
          </div>
          <Compass size={24} />
        </header>

        {page === "dashboard" && <Home setActivePage={setPage} />}
        {page === "sos" && <SosTracker />}
        {page === "map" && <SafetyMap />}
        {page === "route" && <SafetyMap initialViewMode="routing" />}
        {page === "alerts" && <AlertSystem />}
        {page === "reports" && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '24px' }}>
             <ReportForm onAddReport={handleAddReport} />
             <ReportList reports={reports} />
          </div>
        )}
        {page === "journey" && <JourneyMode />}
        {page === "contacts" && <Contacts />}
      </section>
    </main>
  );
}
