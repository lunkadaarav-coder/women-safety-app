import React from "react";
import { INCIDENT_TYPES } from "./incidents";

const AnalyticsPanel = ({ areaStats, filteredCount }) => {
  if (!areaStats) return null;

  const maxHour = Math.max(...areaStats.byHour, 1);
  const topType = Object.entries(areaStats.byType).sort((a, b) => b[1] - a[1])[0];
  const topTypeMeta = topType ? INCIDENT_TYPES[topType[0]] : null;

  const trend = areaStats.recentTrend;
  const trendColor = trend > 10 ? "#FF1744" : trend < -10 ? "#00E676" : "#FFD600";
  const trendLabel = trend > 10 ? "↑ Rising" : trend < -10 ? "↓ Declining" : "→ Stable";

  return (
    <div className="analytics-panel">
      <div className="ap-heading">INCIDENT ANALYTICS</div>

      {/* Summary Cards */}
      <div className="ap-cards">
        <div className="ap-card">
          <div className="ap-card-val">{filteredCount}</div>
          <div className="ap-card-label">Total Reports</div>
        </div>
        <div className="ap-card">
          <div className="ap-card-val" style={{ color: trendColor }}>{trendLabel}</div>
          <div className="ap-card-label">12h Trend</div>
        </div>
        <div className="ap-card">
          <div className="ap-card-val">{areaStats.peakHour}:00</div>
          <div className="ap-card-label">Peak Hour</div>
        </div>
      </div>

      {/* Top Incident Type */}
      {topTypeMeta && (
        <div className="ap-top-type" style={{ borderColor: topTypeMeta.color + "50", background: topTypeMeta.bg }}>
          <span className="ap-top-icon">{topTypeMeta.icon}</span>
          <div>
            <div className="ap-top-label" style={{ color: topTypeMeta.color }}>Most Reported</div>
            <div className="ap-top-name">{topTypeMeta.label} ({topType[1]})</div>
          </div>
        </div>
      )}

      {/* Hourly distribution bar chart */}
      <div className="ap-chart-label">INCIDENTS BY HOUR</div>
      <div className="ap-hour-chart">
        {areaStats.byHour.map((count, hour) => {
          const pct = (count / maxHour) * 100;
          const isDanger = hour >= 20 || hour <= 5; // night hours
          return (
            <div key={hour} className="ap-bar-wrap" title={`${hour}:00 — ${count} incidents`}>
              <div
                className="ap-bar"
                style={{
                  height: `${Math.max(pct, 2)}%`,
                  background: isDanger
                    ? `rgba(255,23,68,${0.3 + (pct / 100) * 0.7})`
                    : `rgba(88,166,255,${0.3 + (pct / 100) * 0.7})`,
                }}
              />
              {hour % 6 === 0 && <div className="ap-bar-label">{hour}h</div>}
            </div>
          );
        })}
      </div>
      <div className="ap-chart-legend">
        <span className="ap-chart-dot" style={{ background: "#FF1744" }} />Night risk
        <span className="ap-chart-dot" style={{ background: "#58a6ff", marginLeft: 8 }} />Day
      </div>
    </div>
  );
};

export default AnalyticsPanel;
