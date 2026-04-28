import React from "react";
import "./styles.css";
import SafetyMap from "./components/SafetyMap";

// ─────────────────────────────────────────────────────────────────────────────
// Replace with your actual Google Maps API key.
// Required APIs: Maps JavaScript API, Visualization (Heatmap).
// ─────────────────────────────────────────────────────────────────────────────
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

function App() {
  return <SafetyMap googleMapsApiKey={GOOGLE_MAPS_API_KEY} />;
}

export default App;