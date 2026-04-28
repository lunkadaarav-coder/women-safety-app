function getTrustScore(report) {
  return report.upvotes - report.downvotes;
}

function getRiskLevel(report) {
  const trustScore = getTrustScore(report);

  let baseRisk = 0;

  if (report.type === "Harassment") baseRisk = 5;
  else if (report.type === "Stalking") baseRisk = 5;
  else if (report.type === "Suspicious Activity") baseRisk = 4;
  else if (report.type === "Unsafe Route") baseRisk = 3;
  else if (report.type === "Poor Lighting") baseRisk = 2;
  else baseRisk = 1;

  const finalRisk = baseRisk + trustScore;

  if (finalRisk >= 8) return "Critical";
  if (finalRisk >= 5) return "High";
  if (finalRisk >= 2) return "Medium";
  return "Low";
}

function ReportList({ reports, onVote }) {
  return (
    <div className="card">
      <h2>Community Feed</h2>
      <p className="helper">
        Community votes validate reports and improve risk accuracy.
      </p>

      {reports.length === 0 ? (
        <div className="empty">
          No reports yet. Submit one to update the community feed.
        </div>
      ) : (
        <div className="feed">
          {reports.map((report) => {
            const risk = getRiskLevel(report);
            const trustScore = getTrustScore(report);

            return (
              <div className="report-card" key={report.id}>
                <div className="report-head">
                  <span className="type-pill">{report.type}</span>
                  <span className={`risk-pill ${risk.toLowerCase()}`}>
                    {risk} Risk
                  </span>
                </div>

                <h3>{report.location}</h3>
                <p>{report.desc}</p>

                <small>Reported at: {report.timestamp}</small>

                {report.media && (
                  <div className="media">📎 Media: {report.media}</div>
                )}

                <div className="votes">
                  <button onClick={() => onVote(report.id, "up")}>
                    ▲ {report.upvotes}
                  </button>

                  <button onClick={() => onVote(report.id, "down")}>
                    ▼ {report.downvotes}
                  </button>

                  <span>Trust Score: {trustScore}</span>
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