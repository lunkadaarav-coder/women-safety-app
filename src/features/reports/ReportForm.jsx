import { useState } from "react";

function ReportForm({ onAddReport }) {
  const [type, setType] = useState("Suspicious Activity");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState("");

  const handleSubmit = () => {
    if (!location.trim()) {
      alert("Please enter location");
      return;
    }

    const newReport = {
      id: Date.now(),
      type,
      location,
      desc: desc || "No additional details provided.",
      media,
      timestamp: new Date().toLocaleString(),
      upvotes: 0,
      downvotes: 0,
    };

    onAddReport(newReport);

    setLocation("");
    setDesc("");
    setMedia("");
    setType("Suspicious Activity");
  };

  return (
    <div className="card">
      <h2>Report an Unsafe Area</h2>
      <p className="helper">
        Submit incident details to alert the community and improve risk mapping.
      </p>

      <label>Incident Type</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Suspicious Activity</option>
        <option>Harassment</option>
        <option>Poor Lighting</option>
        <option>Stalking</option>
        <option>Unsafe Route</option>
        <option>Other</option>
      </select>

      <label>Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="E.g., College Gate, Market Road"
      />

      <label>Details</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Briefly describe what happened..."
      />

      <label>Optional Media</label>
      <input
        value={media}
        onChange={(e) => setMedia(e.target.value)}
        placeholder="photo/video filename placeholder"
      />

      <button className="primary-btn" onClick={handleSubmit}>
        Submit Report
      </button>
    </div>
  );
}

export default ReportForm;