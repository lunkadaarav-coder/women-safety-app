import { useState } from "react";

function ReportForm({ onAddReport }) {
  const [type, setType] = useState("Suspicious Activity");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [media, setMedia] = useState("");

  const handleSubmit = () => {
    if (!location.trim()) return alert("Please enter location");

    const newReport = {
      id: Date.now(),
      type,
      location,
      desc: desc || "No extra details provided.",
      media,
      time: new Date().toLocaleString(),
      upvotes: 0,
      downvotes: 0,
    };

    onAddReport(newReport);
    setLocation("");
    setDesc("");
    setMedia("");
  };

  return (
    <div className="card">
      <h2>Report an Unsafe Area</h2>
      <p className="helper">
        Use this form to alert the community about safety risks nearby.
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

      <label>Details (Optional)</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Briefly describe what happened or what the risk is..."
      />

      <label>Media (Optional)</label>
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