import { useState, useCallback, useMemo } from "react";
import { SEED_INCIDENTS, NEIGHBOURHOODS } from "./incidents";
import {
  clusterIncidents,
  buildHeatmapData,
  buildAreaStats,
  neighbourhoodRiskScore,
} from "./riskEngine";

export const useIncidents = () => {
  const [incidents, setIncidents]     = useState(SEED_INCIDENTS);
  const [filters, setFilters]         = useState({
    types:       [],     // empty = all types
    timeRange:   72,     // hours — 0 = all time
    minUpvotes:  0,
    verifiedOnly: false,
  });

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filteredIncidents = useMemo(() => {
    const cutoff = filters.timeRange === 0
      ? 0
      : Date.now() - filters.timeRange * 3_600_000;

    return incidents.filter((inc) => {
      if (filters.types.length > 0 && !filters.types.includes(inc.type)) return false;
      if (filters.timeRange > 0 && inc.timestamp < cutoff) return false;
      if (inc.upvotes - inc.downvotes < filters.minUpvotes) return false;
      if (filters.verifiedOnly && !inc.verified) return false;
      return true;
    });
  }, [incidents, filters]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const heatmapData = useMemo(() => buildHeatmapData(filteredIncidents), [filteredIncidents]);
  const predictedZones = useMemo(() => clusterIncidents(filteredIncidents, 0.7, 2), [filteredIncidents]);
  const areaStats = useMemo(() => buildAreaStats(filteredIncidents), [filteredIncidents]);

  const neighbourhoodRanking = useMemo(
    () =>
      NEIGHBOURHOODS.map((n) => ({
        ...n,
        riskScore: neighbourhoodRiskScore(n, filteredIncidents),
        incidentCount: filteredIncidents.filter(
          (i) => Math.abs(i.lat - n.lat) < 0.02 && Math.abs(i.lng - n.lng) < 0.02
        ).length,
      })).sort((a, b) => b.riskScore - a.riskScore),
    [filteredIncidents]
  );

  // ── Actions ───────────────────────────────────────────────────────────────
  const addIncident = useCallback((data) => {
    setIncidents((prev) => [
      { ...data, id: Date.now(), timestamp: Date.now(), upvotes: 0, downvotes: 0, verified: false, responders: 0 },
      ...prev,
    ]);
  }, []);

  const voteOnIncident = useCallback((id, vote) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id !== id
          ? inc
          : {
              ...inc,
              upvotes:   vote === "up"   ? inc.upvotes + 1   : inc.upvotes,
              downvotes: vote === "down" ? inc.downvotes + 1 : inc.downvotes,
            }
      )
    );
  }, []);

  const markResponding = useCallback((id) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id !== id ? inc : { ...inc, responders: inc.responders + 1 }
      )
    );
  }, []);

  return {
    incidents,
    filteredIncidents,
    heatmapData,
    predictedZones,
    areaStats,
    neighbourhoodRanking,
    filters,
    setFilters,
    addIncident,
    voteOnIncident,
    markResponding,
  };
};
