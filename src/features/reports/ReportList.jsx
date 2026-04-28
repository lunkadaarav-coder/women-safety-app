function getRiskLevel(report) {
  const score =
    report.upvotes -
    report.downvotes +
    (report.type === "Harassment" || report.type === "Stalking" ? 5 : 0) +
    (report.type === "Suspicious Activity" ? 3 : 0);

  if (score >= 8) return "Critical";
  if (score >= 4) return "High";
  if (score >= 1) return "Medium";
  return "Low";
}

function ReportList({ reports, onVote }) {
  return (
    <div className="card">
      <h2>Community Feed</h2>
      <p className="helper">
        Reports are validated by the community before strongly affecting risk zones.
      </p>

      {reports.length === 0 ? (
        <div className="empty">
          No reports yet. Submit one to update the community feed.
        </div>
      ) : (
        <div className="feed">
          {reports.map((r) => {
            const risk = getRiskLevel(r);

            return (
              <div className="report-card" key={r.id}>
                <div className="report-head">
                  <span className="type-pill">{r.type}</span>
                  <span className={`risk-pill ${risk.toLowerCase()}`}>
                    {risk} Risk
                  </span>
                </div>

                <h3>{r.location}</h3>
                <p>{r.desc}</p>
                <small>{r.time}</small>

                {r.media && <div className="media">📎 {r.media}</div>}

                <div className="votes">
                  <button onClick={() => onVote(r.id, "up")}>
                    ▲ {r.upvotes}
                  </button>
                  <button onClick={() => onVote(r.id, "down")}>
                    ▼ {r.downvotes}
                  </button>
                  <span>Trust Score: {r.upvotes - r.downvotes}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ReportList;