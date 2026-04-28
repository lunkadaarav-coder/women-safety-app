import { useState } from "react";
import ReportForm from "./features/reports/ReportForm";
import ReportList from "./features/reports/ReportList";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("report");
  const [reports, setReports] = useState([]);

  const addReport = (newReport) => {
    setReports([newReport, ...reports]);
    setActiveTab("feed");
  };

  const vote = (id, voteType) => {
    setReports(
      reports.map((report) => {
        if (report.id !== id) return report;

        return {
          ...report,
          upvotes:
            voteType === "up" ? report.upvotes + 1 : report.upvotes,
          downvotes:
            voteType === "down" ? report.downvotes + 1 : report.downvotes,
        };
      })
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