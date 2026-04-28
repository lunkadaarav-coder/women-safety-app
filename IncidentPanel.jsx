import React, { useState } from "react";
import { INCIDENT_TYPES, RISK_LEVELS } from "../data/incidents";
import { computeRiskScore, formatRelativeTime, getRiskColor, getRiskLevel } from "../utils/riskEngine";

const IncidentPanel = ({ incident, allIncidents, onVote, onClose, onRespond }) => {
  const [voted, setVoted] = useState(null);
  const [responding, setResponding] = useState(false);

  if (!incident) return null;

  const type      = INCIDENT_TYPES[incident.type];
  const score     = computeRiskScore(incident.lat, incident.lng, allIncidents, 0.5);
  const riskColor = getRiskColor(score);
  const level     = getRiskLevel(score);
  const netVotes  = incident.upvotes - incident.downvotes;
  const total     = incident.upvotes + incident.downvotes;
  const valPct    = total > 0 ? Math.round((incident.upvotes / total) * 100) : 0;

  const handleVote = (v) => {
    if (voted) return;
    setVoted(v);
    onVote(incident.id, v);
  };

  const handleRespond = () => {
    setResponding(true);
    onRespond?.(incident.id);
  };

  return (
    <div className="incident-panel">
      {/* Header */}
      <div className="ip-header">
        <div className="ip-type-badge" style={{ background: type?.bg, border: `1px solid ${type?.color}50` }}>
          <span className="ip-icon">{type?.icon}</span>
          <span className="ip-type-name" style={{ color: type?.color }}>{type?.label}</span>
        </div>
        <div className="ip-meta">
          <span className="ip-time">{formatRelativeTime(incident.timestamp)}</span>
          {incident.verified && <span className="ip-verified">✓ Verified</span>}
        </div>
        <button className="ip-close" onClick={onClose}>✕</button>
      </div>

      {/* Risk Meter */}
      <div className="ip-risk-block" style={{ borderColor: riskColor + "40", background: riskColor + "08" }}>
        <div className="ip-risk-label-row">
          <span className="ip-risk-level" style={{ color: riskColor }}>{RISK_LEVELS[level]?.label?.toUpperCase()}</span>
          <span className="ip-risk-pct" style={{ color: riskColor }}>{Math.round(score * 100)}%</span>
        </div>
        <div className="ip-risk-bar">
          <div className="ip-risk-fill" style={{ width: `${score * 100}%`, background: riskColor }} />
        </div>
        <div className="ip-risk-sub">Area risk score based on nearby incidents</div>
      </div>

      {/* Description */}
      {incident.description && (
        <div className="ip-description">
          <span className="ip-quote-mark">"</span>
          {incident.description}
          <span className="ip-quote-mark">"</span>
        </div>
      )}

      {/* Location & Responders */}
      <div className="ip-info-row">
        <div className="ip-info-chip">
          <span>📍</span>
          <span>{incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}</span>
        </div>
        {incident.responders > 0 && (
          <div className="ip-info-chip ip-responders">
            <span>🙋</span>
            <span>{incident.responders} responding</span>
          </div>
        )}
      </div>

      {/* Community Validation */}
      <div className="ip-validation">
        <div className="ip-val-header">
          <span className="ip-val-label">COMMUNITY VALIDATION</span>
          <span className="ip-val-pct">{valPct}% credible</span>
        </div>
        <div className="ip-val-bar">
          <div className="ip-val-fill" style={{ width: `${valPct}%` }} />
        </div>
        <div className="ip-vote-row">
          <button
            className={`ip-vote-btn up ${voted === "up" ? "voted" : ""}`}
            onClick={() => handleVote("up")}
            disabled={!!voted}
          >
            👍 {incident.upvotes}
          </button>
          <span className="ip-vote-net" style={{ color: netVotes > 0 ? "#00E676" : netVotes < 0 ? "#FF1744" : "#666" }}>
            {netVotes > 0 ? `+${netVotes}` : netVotes}
          </span>
          <button
            className={`ip-vote-btn down ${voted === "down" ? "voted" : ""}`}
            onClick={() => handleVote("down")}
            disabled={!!voted}
          >
            👎 {incident.downvotes}
          </button>
        </div>
        {voted && <div className="ip-voted-msg">Thanks for your input!</div>}
      </div>

      {/* Actions */}
      <div className="ip-actions">
        <button
          className={`ip-action-btn respond ${responding ? "active" : ""}`}
          onClick={handleRespond}
          disabled={responding}
        >
          {responding ? "🙋 Responding..." : "🙋 I'm Responding"}
        </button>
        <button
          className="ip-action-btn share"
          onClick={() => navigator.clipboard?.writeText(`Safety Alert at ${incident.lat.toFixed(4)}, ${incident.lng.toFixed(4)}: ${incident.description}`)}
        >
          📤 Share
        </button>
      </div>
    </div>
  );
};

export default IncidentPanel;