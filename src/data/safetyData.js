export const initialContacts = [
  { id: 1, name: "Mom", relation: "Family", phone: "9876543210" },
  { id: 2, name: "Best Friend", relation: "Friend", phone: "9123456789" },
  { id: 3, name: "Women Helpline", relation: "Emergency", phone: "1091" },
];

export const dangerZones = [
  { id: 1, area: "Shivajinagar Bus Depot", lat: 18.5308, lng: 73.8474, risk: "critical", reports: 8 },
  { id: 2, area: "Hadapsar MIDC Road", lat: 18.502, lng: 73.925, risk: "critical", reports: 9 },
  { id: 3, area: "Koregaon Park North Main Road", lat: 18.5362, lng: 73.8942, risk: "high", reports: 5 },
  { id: 4, area: "Viman Nagar Underpass", lat: 18.5679, lng: 73.9143, risk: "medium", reports: 3 },
  { id: 5, area: "Kothrud Karve Statue Lane", lat: 18.5074, lng: 73.8077, risk: "low", reports: 2 },
];

export const seedReports = [
  {
    id: 101,
    type: "Harassment",
    location: "Shivajinagar Bus Depot",
    description: "Repeated harassment reported near the main bus entrance after evening rush.",
    time: "Today, 7:20 PM",
    upvotes: 18,
    downvotes: 1,
  },
  {
    id: 102,
    type: "Poor Lighting",
    location: "Viman Nagar Underpass",
    description: "Streetlights are not working near the underpass. Avoid walking alone late at night.",
    time: "Yesterday, 9:45 PM",
    upvotes: 11,
    downvotes: 2,
  },
  {
    id: 103,
    type: "Suspicious Activity",
    location: "Koregaon Park North Main Road",
    description: "Group loitering and following women near parked vehicles.",
    time: "2 days ago",
    upvotes: 14,
    downvotes: 0,
  },
];

export const safeWaypoints = [
  "Main Road police chowki",
  "Market Road pharmacy stretch",
  "Well-lit bus stop",
  "College gate security point",
];

export function riskColor(risk) {
  switch (risk) {
    case "critical":
      return "#dc2626";
    case "high":
      return "#ea580c";
    case "medium":
      return "#ca8a04";
    default:
      return "#16a34a";
  }
}

export function trustScore(report) {
  return report.upvotes - report.downvotes;
}
