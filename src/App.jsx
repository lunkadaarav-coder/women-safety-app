import { useState } from "react";
import ReportForm from "./features/reports/ReportForm";
import ReportList from "./features/reports/ReportList";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("report");
  const [reports, setReports] = useState([]);

  const addReport = (report) => {
    setReports([report, ...reports]);
    setActiveTab("feed");
  };

  const vote = (id, type) => {
    setReports(
      reports.map((r) =>
        r.id === id
          ? {
              ...r,
              upvotes: type === "up" ? r.upvotes + 1 : r.upvotes,
              downvotes: type === "down" ? r.downvotes + 1 : r.downvotes,
            }
          : r
      )
    );
  };

  return (
    <main className="page">
      <section className="app-shell">
        <header className="top-card">
          <h1>Safety & Risk Zone</h1>
          <p>Community Reporting System</p>
        </header>

        <div className="tabs">
          <button
            className={activeTab === "report" ? "active" : ""}
            onClick={() => setActiveTab("report")}
          >
            Report Incident
          </button>
          <button
            className={activeTab === "feed" ? "active" : ""}
            onClick={() => setActiveTab("feed")}
          >
            Community Feed
          </button>
        </div>

        {activeTab === "report" ? (
          <ReportForm onAddReport={addReport} />
        ) : (
          <ReportList reports={reports} onVote={vote} />
        )}
      </section>
    </main>
  );
}

export default App;