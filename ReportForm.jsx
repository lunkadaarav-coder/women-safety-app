import React, { useState } from "react";
import { INCIDENT_TYPES } from "../data/incidents";

const SEVERITY_COLORS = {
  harassment: "#FF6B35", assault: "#FF1744", theft: "#FF9100",
  stalking: "#E91E63", unsafe_area: "#7C4DFF", suspicious: "#FF6F00",
  eve_teasing: "#F50057", acid_attack: "#D50000", indecent_exp: "#C51162", vehicle: "#FF3D00",
};

const ReportForm = ({ position, onSubmit, onCancel }) => {
  const [form, setForm] = useState({ type: "harassment", description: "", anonymous: true });
  const [submitted, setSubmitted] = useState(false);

  const selectedType = INCIDENT_TYPES[form.type];

  const handleSubmit = () => {
    if (!position) return;
    onSubmit({ ...form, lat: position.lat, lng: position.lng });
    setSubmitted(true);
    setTimeout(() => onCancel(), 1200);
  };

  if (submitted) {
    return (
      <div className="report-form success">
        <div className="success-icon">✓</div>
        <div className="success-title">Report Submitted</div>
        <div className="success-sub">Thank you for keeping the community safe.</div>
      </div>
    );
  }

  return (
    <div className="report-form">
      {/* Header */}
      <div className="rf-header">
        <div className="rf-title-row">
          <div className="rf-dot" style={{ background: SEVERITY_COLORS[form.type] }} />
          <span className="rf-title">Report Incident</span>
        </div>
        {position && (
          <div className="rf-coords">
            📍 {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </div>
        )}
      </div>

      {/* Severity Preview */}
      <div className="rf-preview" style={{ borderColor: selectedType?.color + "60", background: selectedType?.bg }}>
        <span className="rf-preview-icon">{selectedType?.icon}</span>
        <div>
          <div className="rf-preview-name" style={{ color: selectedType?.color }}>{selectedType?.label}</div>
          <div className="rf-preview-weight">
            Severity weight: {Math.round((selectedType?.weight ?? 0.5) * 100)}%
          </div>
        </div>
        <div className="rf-severity-bar-mini">
          <div className="rf-fill-mini" style={{ height: `${(selectedType?.weight ?? 0.5) * 100}%`, background: selectedType?.color }} />
        </div>
      </div>

      {/* Type Selection */}
      <div className="rf-field">
        <label className="rf-label">INCIDENT TYPE</label>
        <div className="rf-type-grid">
          {Object.entries(INCIDENT_TYPES).map(([key, type]) => (
            <button
              key={key}
              className={`rf-type-chip ${form.type === key ? "active" : ""}`}
              style={form.type === key ? {
                borderColor: type.color,
                background: type.bg,
                color: type.color,
              } : {}}
              onClick={() => setForm((f) => ({ ...f, type: key }))}
            >
              <span className="rf-chip-icon">{type.icon}</span>
              <span className="rf-chip-label">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="rf-field">
        <label className="rf-label">DESCRIPTION <span className="rf-optional">(optional)</span></label>
        <textarea
          className="rf-textarea"
          placeholder="What happened? Brief details help the community assess safety..."
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          maxLength={250}
          rows={3}
        />
        <div className="rf-char-row">
          <span className="rf-hint">Your report will be reviewed by the community.</span>
          <span className="rf-chars">{form.description.length}/250</span>
        </div>
      </div>

      {/* Anonymous toggle */}
      <div className="rf-anon-row">
        <label className="rf-toggle-label">
          <div
            className={`rf-toggle ${form.anonymous ? "on" : "off"}`}
            onClick={() => setForm((f) => ({ ...f, anonymous: !f.anonymous }))}
          >
            <div className="rf-toggle-thumb" />
          </div>
          <span>Submit anonymously</span>
        </label>
        <span className="rf-anon-note">{form.anonymous ? "Your identity is hidden" : "Name visible to community"}</span>
      </div>

      {/* Actions */}
      <div className="rf-actions">
        <button className="rf-btn-cancel" onClick={onCancel}>Cancel</button>
        <button
          className="rf-btn-submit"
          style={{ background: selectedType?.color }}
          onClick={handleSubmit}
        >
          {selectedType?.icon} Submit Report
        </button>
      </div>
    </div>
  );
};

export default ReportForm;