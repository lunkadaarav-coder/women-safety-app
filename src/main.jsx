import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BellRing,
  MapPin,
  Mic,
  MicOff,
  Phone,
  ShieldAlert,
  Siren,
  UserRound,
  X,
} from "lucide-react";
import "./styles.css";

const trustedContacts = [
  { name: "Maya", relation: "Sister", phone: "+91 98765 43210" },
  { name: "Aarav", relation: "Friend", phone: "+91 98765 43211" },
  { name: "Local Helpdesk", relation: "Emergency", phone: "112" },
];

const demoRoute = [
  { latOffset: 0.0004, lngOffset: -0.0002, label: "Main road" },
  { latOffset: 0.0009, lngOffset: 0.0002, label: "Near pharmacy" },
  { latOffset: 0.0013, lngOffset: 0.0007, label: "Bus stop" },
  { latOffset: 0.0018, lngOffset: 0.0011, label: "Police booth nearby" },
];

function formatCoords(location) {
  if (!location) return "Waiting for permission";
  return `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`;
}

function App() {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [tracking, setTracking] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [routeIndex, setRouteIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("Say SOS or help");
  const [fakeCallOpen, setFakeCallOpen] = useState(false);
  const watchIdRef = useRef(null);
  const recognitionRef = useRef(null);

  const sharedLocation = useMemo(() => {
    if (!location) return null;
    const route = demoRoute[routeIndex % demoRoute.length];
    return {
      latitude: location.latitude + route.latOffset,
      longitude: location.longitude + route.lngOffset,
      label: route.label,
    };
  }, [location, routeIndex]);

  useEffect(() => {
    if (!tracking || !navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: Math.round(position.coords.accuracy),
          updatedAt: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        });
        setLocationError("");
      },
      (error) => {
        setLocationError(error.message || "Location access was denied.");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 12000 }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [tracking]);

  useEffect(() => {
    if (!tracking) return;
    const timer = window.setInterval(() => {
      setRouteIndex((index) => index + 1);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [tracking]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!voiceEnabled || !SpeechRecognition) {
      if (voiceEnabled) setVoiceStatus("Voice trigger not supported here");
      return;
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
        activateSos();
        setVoiceStatus("SOS phrase detected");
      }
    };
    recognition.onend = () => {
      if (voiceEnabled) {
        try {
          recognition.start();
        } catch {
          setVoiceStatus("Tap to restart listening");
        }
      }
    };

    recognitionRef.current = recognition;
    recognition.start();

    return () => {
      recognition.onend = null;
      recognition.stop();
    };
  }, [voiceEnabled]);

  function startTracking() {
    setTracking(true);
    setLocationError("");
  }

  function stopTracking() {
    setTracking(false);
    setSosActive(false);
  }

  function activateSos() {
    setSosActive(true);
    setTracking(true);
  }

  function cancelSos() {
    setSosActive(false);
  }

  return (
    <main className="app-shell">
      <section className="status-band">
        <div>
          <p className="eyebrow">Emergency response</p>
          <h1>SOS + Live Tracking</h1>
        </div>
        <div className={`status-pill ${sosActive ? "danger" : "ready"}`}>
          <ShieldAlert size={18} />
          {sosActive ? "SOS active" : "Ready"}
        </div>
      </section>

      <section className="main-grid">
        <div className="sos-panel">
          <button
            className={`sos-button ${sosActive ? "active" : ""}`}
            onClick={activateSos}
            aria-label="Activate SOS alert"
          >
            <Siren size={44} />
            <span>SOS</span>
          </button>

          <div className="action-row">
            <button className="primary-action" onClick={startTracking}>
              <MapPin size={18} />
              Share Live Location
            </button>
            <button className="secondary-action" onClick={() => setFakeCallOpen(true)}>
              <Phone size={18} />
              Fake Call
            </button>
          </div>

          <div className="voice-toggle">
            <button
              className={voiceEnabled ? "icon-action listening" : "icon-action"}
              onClick={() => setVoiceEnabled((enabled) => !enabled)}
              aria-label="Toggle voice trigger"
              title="Voice trigger"
            >
              {voiceEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <div>
              <strong>Voice trigger</strong>
              <span>{voiceStatus}</span>
            </div>
          </div>
        </div>

        <div className="tracking-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Live location</p>
              <h2>{tracking ? "Sharing now" : "Not sharing"}</h2>
            </div>
            {tracking && (
              <button className="quiet-action" onClick={stopTracking}>
                Stop
              </button>
            )}
          </div>

          <div className="map-simulation">
            <div className="route-line" />
            <div className="pulse-pin user">
              <UserRound size={18} />
            </div>
            <div className="pulse-pin responder">
              <BellRing size={18} />
            </div>
          </div>

          <div className="location-readout">
            <div>
              <span>Current</span>
              <strong>{formatCoords(location)}</strong>
            </div>
            <div>
              <span>Shared update</span>
              <strong>{sharedLocation ? formatCoords(sharedLocation) : "Start tracking"}</strong>
            </div>
            <div>
              <span>Accuracy</span>
              <strong>{location?.accuracy ? `${location.accuracy} m` : "Unknown"}</strong>
            </div>
            <div>
              <span>Last update</span>
              <strong>{location?.updatedAt || "Not yet"}</strong>
            </div>
          </div>

          {locationError && <p className="error-text">{locationError}</p>}
        </div>
      </section>

      <section className="contacts-band">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Trusted contacts</p>
            <h2>Alert targets</h2>
          </div>
          {sosActive && <span className="sending">Sending alerts...</span>}
        </div>
        <div className="contacts-grid">
          {trustedContacts.map((contact) => (
            <article className="contact-card" key={contact.phone}>
              <strong>{contact.name}</strong>
              <span>{contact.relation}</span>
              <a href={`tel:${contact.phone.replaceAll(" ", "")}`}>
                <Phone size={16} />
                {contact.phone}
              </a>
            </article>
          ))}
        </div>
      </section>

      {sosActive && (
        <div className="alert-strip">
          <span>Emergency mode is active. Location updates are being simulated for trusted contacts.</span>
          <button onClick={cancelSos}>Cancel SOS</button>
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
            <button className="decline" onClick={() => setFakeCallOpen(false)}>
              <X size={24} />
            </button>
            <a className="accept" href="tel:+919876543210">
              <Phone size={24} />
            </a>
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
