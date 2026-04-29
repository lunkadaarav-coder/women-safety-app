import React from "react";
import { RISK_LEVELS, INCIDENT_TYPES } from "./incidents";
import { getRiskColor } from "./riskEngine";

const RiskLegend = ({ showPrediction, neighbourhoodRanking = [] }) => {
  return (
    <div className="legend-panel">
      {/* Risk Zones */}
      <div className="legend-block">
        <div className="legend-heading">
          <span className="legend-dot-row" />
          RISK ZONES
        </div>
        <div className="risk-gradient-bar">
          <div className="gradient-track" />
          <div className="gradient-labels">
            <span style={{ color: RISK_LEVELS.low.color }}>Safe</span>
            <span style={{ color: RISK_LEVELS.guarded.color }}>Guarded</span>
            <span style={{ color: RISK_LEVELS.high.color }}>High</span>
            <span style={{ color: RISK_LEVELS.critical.color }}>Critical</span>
          </div>
        </div>
      </div>

      {/* Incident Types */}
      <div className="legend-block">
        <div className="legend-heading">INCIDENT TYPES</div>
        <div className="incident-type-grid">
          {Object.entries(INCIDENT_TYPES).map(([key, type]) => (
            <div key={key} className="incident-type-row">
              <div className="type-icon-badge" style={{ background: type.bg, borderColor: type.color + "60" }}>
                {type.icon}
              </div>
              <span className="type-row-label">{type.label}</span>
              <div className="type-severity-bar">
                <div
                  className="type-severity-fill"
                  style={{ width: `${type.weight * 100}%`, background: type.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Prediction */}
      {showPrediction && (
        <div className="legend-block">
          <div className="legend-heading">AI PREDICTION</div>
          <div className="prediction-legend-row">
            <div className="pred-circle-sample" />
            <div>
              <div className="pred-label">Predicted Risk Zone</div>
              <div className="pred-sublabel">Density clustering · Time-weighted · Validated</div>
            </div>
          </div>
        </div>
      )}

      {/* Neighbourhood Ranking */}
      {neighbourhoodRanking.length > 0 && (
        <div className="legend-block">
          <div className="legend-heading">AREA RISK RANKING</div>
          <div className="neighbourhood-list">
            {neighbourhoodRanking.slice(0, 6).map((n, i) => {
              const color = getRiskColor(n.riskScore);
              const pct   = Math.round(n.riskScore * 100);
              return (
                <div key={n.name} className="neighbourhood-row">
                  <span className="nb-rank" style={{ color }}>{i + 1}</span>
                  <div className="nb-info">
                    <div className="nb-name">{n.name}</div>
                    <div className="nb-bar">
                      <div
                        className="nb-bar-fill"
                        style={{ width: `${pct}%`, background: color }}
                      />
                    </div>
                  </div>
                  <span className="nb-score" style={{ color }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskLegend;
