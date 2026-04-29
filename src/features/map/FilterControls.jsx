import React from "react";
import { INCIDENT_TYPES } from "./incidents";

const TIME_OPTIONS = [
  { label: "6h",   value: 6 },
  { label: "24h",  value: 24 },
  { label: "3d",   value: 72 },
  { label: "7d",   value: 168 },
  { label: "All",  value: 0 },
];

const FilterControls = ({ filters, onChange, counts, areaStats }) => {
  const toggleType = (type) => {
    const types = filters.types.includes(type)
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types });
  };

  const activeFilters =
    filters.types.length +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.minUpvotes > 0 ? 1 : 0);

  return (
    <div className="filter-controls">
      {/* Time Range */}
      <div className="fc-section">
        <div className="fc-label">TIME WINDOW</div>
        <div className="fc-pills">
          {TIME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`fc-pill ${filters.timeRange === opt.value ? "active" : ""}`}
              onClick={() => onChange({ ...filters, timeRange: opt.value })}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Incident Types */}
      <div className="fc-section">
        <div className="fc-label-row">
          <div className="fc-label">INCIDENT TYPES</div>
          {filters.types.length > 0 && (
            <button className="fc-clear" onClick={() => onChange({ ...filters, types: [] })}>
              Clear
            </button>
          )}
        </div>
        <div className="fc-type-grid">
          {Object.entries(INCIDENT_TYPES).map(([key, type]) => {
            const count = areaStats?.byType?.[key] ?? 0;
            const active = filters.types.includes(key);
            return (
              <button
                key={key}
                className={`fc-type-btn ${active ? "active" : ""}`}
                style={active ? { borderColor: type.color, background: type.bg, color: type.color } : {}}
                onClick={() => toggleType(key)}
                title={type.label}
              >
                <span className="fc-type-icon">{type.icon}</span>
                <span className="fc-type-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Verified & Min Upvotes */}
      <div className="fc-section fc-row-section">
        <label className="fc-checkbox-label">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
            className="fc-checkbox"
          />
          Verified only
        </label>
        <div className="fc-min-votes">
          <span className="fc-mini-label">Min upvotes</span>
          <div className="fc-stepper">
            <button onClick={() => onChange({ ...filters, minUpvotes: Math.max(0, filters.minUpvotes - 5) })}>−</button>
            <span>{filters.minUpvotes}</span>
            <button onClick={() => onChange({ ...filters, minUpvotes: filters.minUpvotes + 5 })}>+</button>
          </div>
        </div>
      </div>

      {/* Count bar */}
      <div className="fc-count-bar">
        <div
          className="fc-count-fill"
          style={{ width: counts.total > 0 ? `${(counts.filtered / counts.total) * 100}%` : "0%" }}
        />
        <span className="fc-count-label">
          {counts.filtered} / {counts.total} incidents shown
          {activeFilters > 0 && <span className="fc-active-badge">{activeFilters} filter{activeFilters > 1 ? "s" : ""}</span>}
        </span>
      </div>
    </div>
  );
};

export default FilterControls;
