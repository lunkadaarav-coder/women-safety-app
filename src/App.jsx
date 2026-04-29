import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  CheckCircle2,
  Clock,
  Compass,
  Home,
  MapPin,
  Mic,
  MicOff,
  Navigation,
  Phone,
  Plus,
  Route,
  Shield,
  Siren,
  Users,
  X,
} from "lucide-react";
import {
  dangerZones,
  initialContacts,
  riskColor,
  safeWaypoints,
  seedReports,
  trustScore,
} from "./data/safetyData";

const navItems = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "sos", label: "SOS", icon: Siren },
  { id: "map", label: "Risk Map", icon: MapPin },
  { id: "reports", label: "Reports", icon: AlertTriangle },
  { id: "journey", label: "Journey", icon: Route },
  { id: "contacts", label: "Contacts", icon: Users },
];

const reportTypes = [
  "Harassment",
  "Suspicious Activity",
  "Poor Lighting",
  "Stalking",
  "Unsafe Route",
  "Other",
];

function formatCoords(location) {
  if (!location) return "Waiting for permission";
  return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
}

function Dashboard({ setPage, reports, contacts, sosActive }) {
  const criticalZones = dangerZones.filter((zone) => zone.risk === "critical").length;
  const verifiedReports = reports.filter((report) => trustScore(report) >= 5).length;

  return (
    <section className="view dashboard-view">
      <div className="hero-band">
        <div>
          <p className="eyebrow">SafeCircle command center</p>
          <h1>Women safety companion for alerts, routes, reports, and trusted contacts.</h1>
        </div>
        <div className={sosActive ? "hero-status danger" : "hero-status ready"}>
          <Shield size={20} />
          {sosActive ? "SOS active" : "Ready"}
        </div>
      </div>

      <div className="metric-grid">
        <Metric icon={AlertTriangle} label="Critical zones" value={criticalZones} tone="danger" />
        <Metric icon={CheckCircle2} label="Trusted reports" value={verifiedReports} tone="safe" />
        <Metric icon={Users} label="Contacts" value={contacts.length} tone="neutral" />
      </div>

      <div className="quick-grid">
        <button className="quick-action danger" onClick={() => setPage("sos")}>
          <Siren size={24} />
          Trigger emergency tools
        </button>
        <button className="quick-action" onClick={() => setPage("map")}>
          <MapPin size={24} />
          Check nearby risk areas
        </button>
        <button className="quick-action" onClick={() => setPage("journey")}>
          <Navigation size={24} />
          Start a shared journey
        </button>
      </div>

      <section className="panel">
        <div className="panel-title">
          <h2>Latest community reports</h2>
          <button className="text-button" onClick={() => setPage("reports")}>View all</button>
        </div>
        <ReportFeed reports={reports.slice(0, 3)} compact />
      </section>
    </section>
  );
}

function Metric({ icon: Icon, label, value, tone }) {
  return (
    <article className={`metric ${tone}`}>
      <Icon size={20} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </article>
  );
}

function SosTracking({ contacts, sosActive, setSosActive }) {
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Say SOS or help");
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const watchIdRef = useRef(null);

  useEffect(() => {
    if (!tracking || !navigator.geolocation) return undefined;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          updatedAt: new Date().toLocaleTimeString(),
        });
        setLocationError("");
      },
      (error) => setLocationError(error.message || "Location access was denied."),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [tracking]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!voiceEnabled || !SpeechRecognition) {
      if (voiceEnabled) setVoiceStatus("Voice trigger not supported here");
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-IN";
    recognition.onstart = () => setVoiceStatus("Listening");
    recognition.onerror = () => setVoiceStatus("Mic permission needed");
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .toLowerCase();
      if (transcript.includes("sos") || transcript.includes("help")) {
        setSosActive(true);
        setTracking(true);
        setVoiceStatus("SOS phrase detected");
      }
    };
    recognition.start();

    return () => recognition.stop();
  }, [setSosActive, voiceEnabled]);

  function activateSos() {
    setSosActive(true);
    setTracking(true);
  }

  return (
    <section className="view">
      <div className="two-column">
        <section className="panel sos-panel">
          <button className={`sos-button ${sosActive ? "active" : ""}`} onClick={activateSos}>
            <Siren size={48} />
            <span>SOS</span>
          </button>
          <div className="action-row">
            <button className="primary-action" onClick={() => setTracking(true)}>
              <MapPin size={18} />
              Share location
            </button>
            <button className="secondary-action" onClick={() => setFakeCallOpen(true)}>
              <Phone size={18} />
              Fake call
            </button>
          </div>
          <button className="voice-toggle" onClick={() => setVoiceEnabled((enabled) => !enabled)}>
            {voiceEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            <span>{voiceStatus}</span>
          </button>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Live tracking</p>
              <h2>{tracking ? "Sharing location" : "Not sharing"}</h2>
            </div>
            {tracking && <button className="text-button" onClick={() => setTracking(false)}>Stop</button>}
          </div>
          <div className="map-card">
            <div className="route-line" />
            <div className="map-pin user-pin"><Users size={18} /></div>
            <div className="map-pin help-pin"><BellRing size={18} /></div>
          </div>
          <div className="readout-grid">
            <Readout label="Current" value={formatCoords(location)} />
            <Readout label="Accuracy" value={location?.accuracy ? `${location.accuracy} m` : "Unknown"} />
            <Readout label="Last update" value={location?.updatedAt || "Not yet"} />
            <Readout label="Alert targets" value={`${contacts.length} contacts`} />
          </div>
          {locationError && <p className="error-text">{locationError}</p>}
        </section>
      </div>

      {sosActive && (
        <div className="alert-strip">
          <span>SOS mode is active. Trusted contacts are marked for alerting.</span>
          <button onClick={() => setSosActive(false)}>Cancel SOS</button>
        </div>
      )}

      {fakeCallOpen && (
        <div className="call-screen" role="dialog" aria-label="Fake incoming call">
          <button className="close-call" onClick={() => setFakeCallOpen(false)} aria-label="Close fake call">
            <X size={22} />
          </button>
          <div className="caller-avatar">M</div>
          <p>Incoming call</p>
          <h2>Mom</h2>
          <div className="call-actions">
            <button className="decline" onClick={() => setFakeCallOpen(false)}><X size={24} /></button>
            <a className="accept" href="tel:+919876543210"><Phone size={24} /></a>
          </div>
        </div>
      )}
    </section>
  );
}

function Readout({ label, value }) {
  return (
    <div className="readout">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function RiskMap({ reports }) {
  const rankedZones = useMemo(
    () => [...dangerZones].sort((a, b) => b.reports - a.reports),
    []
  );

  return (
    <section className="view">
      <div className="map-layout">
        <section className="panel risk-map-panel">
          <div className="panel-title">
            <div>
              <p className="eyebrow">Pune demo map</p>
              <h2>Risk zones and safe corridors</h2>
            </div>
          </div>
          <div className="risk-map">
            {rankedZones.map((zone, index) => (
              <button
                key={zone.id}
                className={`zone-dot ${zone.risk}`}
                style={{ left: `${18 + index * 16}%`, top: `${28 + (index % 3) * 18}%` }}
                title={zone.area}
              >
                {zone.reports}
              </button>
            ))}
            <div className="safe-path" />
          </div>
        </section>

        <aside className="panel">
          <h2>Zone ranking</h2>
          <div className="zone-list">
            {rankedZones.map((zone) => (
              <article key={zone.id} className="zone-card" style={{ "--risk": riskColor(zone.risk) }}>
                <strong>{zone.area}</strong>
                <span>{zone.risk.toUpperCase()} risk</span>
                <small>{zone.reports} recent reports</small>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <section className="panel">
        <div className="panel-title">
          <h2>Reports feeding the map</h2>
          <span className="count-pill">{reports.length} total</span>
        </div>
        <ReportFeed reports={reports.slice(0, 4)} compact />
      </section>
    </section>
  );
}

function Reports({ reports, setReports }) {
  const [form, setForm] = useState({
    type: reportTypes[0],
    location: "",
    description: "",
    media: "",
  });

  function addReport(event) {
    event.preventDefault();
    if (!form.location.trim()) return;
    setReports((current) => [
      {
        id: Date.now(),
        type: form.type,
        location: form.location.trim(),
        description: form.description.trim() || "No extra details provided.",
        media: form.media.trim(),
        time: new Date().toLocaleString(),
        upvotes: 0,
        downvotes: 0,
      },
      ...current,
    ]);
    setForm({ type: reportTypes[0], location: "", description: "", media: "" });
  }

  function vote(id, direction) {
    setReports((current) =>
      current.map((report) =>
        report.id === id
          ? {
              ...report,
              upvotes: direction === "up" ? report.upvotes + 1 : report.upvotes,
              downvotes: direction === "down" ? report.downvotes + 1 : report.downvotes,
            }
          : report
      )
    );
  }

  return (
    <section className="view two-column">
      <form className="panel form-panel" onSubmit={addReport}>
        <h2>Report an unsafe area</h2>
        <label>
          Incident type
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {reportTypes.map((type) => <option key={type}>{type}</option>)}
          </select>
        </label>
        <label>
          Location
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="College gate, market road..."
          />
        </label>
        <label>
          Details
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Briefly describe the risk"
          />
        </label>
        <label>
          Media note
          <input
            value={form.media}
            onChange={(e) => setForm({ ...form, media: e.target.value })}
            placeholder="Optional filename or evidence note"
          />
        </label>
        <button className="primary-action full" type="submit">
          <Plus size={18} />
          Submit report
        </button>
      </form>

      <section className="panel">
        <div className="panel-title">
          <h2>Community feed</h2>
          <span className="count-pill">{reports.length} reports</span>
        </div>
        <ReportFeed reports={reports} onVote={vote} />
      </section>
    </section>
  );
}

function ReportFeed({ reports, onVote, compact = false }) {
  if (reports.length === 0) {
    return <div className="empty-state">No reports yet.</div>;
  }

  return (
    <div className={compact ? "feed compact" : "feed"}>
      {reports.map((report) => (
        <article className="report-card" key={report.id}>
          <div className="report-head">
            <span className="type-pill">{report.type}</span>
            <span className="score-pill">Trust {trustScore(report)}</span>
          </div>
          <h3>{report.location}</h3>
          <p>{report.description}</p>
          {report.media && <small>Evidence: {report.media}</small>}
          <small>{report.time}</small>
          {onVote && (
            <div className="votes">
              <button onClick={() => onVote(report.id, "up")}>Up {report.upvotes}</button>
              <button onClick={() => onVote(report.id, "down")}>Down {report.downvotes}</button>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

function Journey() {
  const [destination, setDestination] = useState("");
  const [startedAt, setStartedAt] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const active = Boolean(startedAt);

  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [active]);

  function startJourney() {
    if (!destination.trim()) return;
    setStartedAt(Date.now());
    setElapsed(0);
  }

  function stopJourney() {
    setStartedAt(null);
    setDestination("");
    setElapsed(0);
  }

  const time = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <section className="view two-column">
      <section className="panel journey-panel">
        <div className="panel-title">
          <div>
            <p className="eyebrow">Shared trip</p>
            <h2>{active ? "Journey in progress" : "Journey mode"}</h2>
          </div>
          <Clock size={22} />
        </div>
        {!active ? (
          <>
            <label>
              Destination
              <input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="College, mall, home..." />
            </label>
            <button className="primary-action full" onClick={startJourney} disabled={!destination.trim()}>
              <Navigation size={18} />
              Start journey
            </button>
          </>
        ) : (
          <>
            <div className="live-card">
              <span className="live-dot" />
              <strong>{time}</strong>
              <p>Heading to {destination}</p>
            </div>
            <button className="danger-action full" onClick={stopJourney}>
              <CheckCircle2 size={18} />
              I arrived safely
            </button>
          </>
        )}
      </section>

      <section className="panel">
        <h2>Recommended safe waypoints</h2>
        <div className="waypoint-list">
          {safeWaypoints.map((waypoint, index) => (
            <div className="waypoint" key={waypoint}>
              <span>{index + 1}</span>
              <p>{waypoint}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}

function Contacts({ contacts, setContacts }) {
  const [form, setForm] = useState({ name: "", relation: "", phone: "" });
  const [error, setError] = useState("");

  function addContact(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Name and phone are required.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 3) {
      setError("Enter a valid phone number.");
      return;
    }
    setContacts((current) => [{ id: Date.now(), ...form }, ...current]);
    setForm({ name: "", relation: "", phone: "" });
    setError("");
  }

  return (
    <section className="view two-column">
      <form className="panel form-panel" onSubmit={addContact}>
        <h2>Add trusted contact</h2>
        <label>
          Name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>
          Relation
          <input value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} />
        </label>
        <label>
          Phone
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button className="primary-action full" type="submit">
          <Plus size={18} />
          Add contact
        </button>
      </form>

      <section className="panel">
        <div className="panel-title">
          <h2>Trusted contacts</h2>
          <span className="count-pill">{contacts.length}</span>
        </div>
        <div className="contact-list">
          {contacts.map((contact) => (
            <article className="contact-card" key={contact.id}>
              <div>
                <strong>{contact.name}</strong>
                <span>{contact.relation || "Trusted contact"}</span>
                <a href={`tel:${contact.phone}`}><Phone size={15} /> {contact.phone}</a>
              </div>
              <button onClick={() => setContacts((current) => current.filter((item) => item.id !== contact.id))}>
                Remove
              </button>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [reports, setReports] = useState(seedReports);
  const [contacts, setContacts] = useState(initialContacts);
  const [sosActive, setSosActive] = useState(false);

  const activeNav = navItems.find((item) => item.id === page) ?? navItems[0];

  return (
    <main className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Shield size={22} /></div>
          <div>
            <strong>SafeCircle</strong>
            <span>Integrated team build</span>
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

      <section className="content">
        <header className="page-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h1>{activeNav.label}</h1>
            <p className="page-subtitle">
              Centralized web interface for alerts, map intelligence, journey tracking, contacts, and safety reports.
            </p>
          </div>
          <div className="page-actions">
            <span className={`status-pill ${sosActive ? "status-danger" : "status-safe"}`}>
              {sosActive ? "SOS active" : "All systems normal"}
            </span>
            <span className="status-pill status-muted">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <header className="mobile-header">
          <div>
            <p className="eyebrow">Current view</p>
            <h1>{activeNav.label}</h1>
          </div>
          <Compass size={24} />
        </header>

        {page === "dashboard" && (
          <Dashboard setPage={setPage} reports={reports} contacts={contacts} sosActive={sosActive} />
        )}
        {page === "sos" && (
          <SosTracking contacts={contacts} sosActive={sosActive} setSosActive={setSosActive} />
        )}
        {page === "map" && <RiskMap reports={reports} />}
        {page === "reports" && <Reports reports={reports} setReports={setReports} />}
        {page === "journey" && <Journey />}
        {page === "contacts" && <Contacts contacts={contacts} setContacts={setContacts} />}
      </section>
    </main>
  );
}
