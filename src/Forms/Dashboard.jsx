import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import "./Dashboard.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL = "https://community-disease-reporting-dashboard.onrender.com/api/reports"; // Update with your backend URL

const Dashboard = () => {
  const [cases, setCases] = useState([]);
  const [filterDisease, setFilterDisease] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch reports from database
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }
        const data = await response.json();
        console.log("Fetched reports:", data);
        setCases(data);
        setError("");
      } catch (err) {
        setError("Error loading reports. Please try again later.");
        console.error(err);
        setCases([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // apply filters
  const filteredCases = cases.filter(c => {
    // disease filter
    if (filterDisease !== "All" && c.disease_type !== filterDisease) return false;
    // date range filter
    if (startDate) {
      const d = c.report_date.split("T")[0];
      if (d < startDate) return false;
    }
    if (endDate) {
      const d = c.report_date.split("T")[0];
      if (d > endDate) return false;
    }
    return true;
  });

  const totalCases = filteredCases.reduce((sum, c) => sum + c.case_count, 0);
  const uniqueDiseases = [...new Set(filteredCases.map(c => c.disease_type))].length;

  // Line chart data
  const lineData = {
    labels: filteredCases.map(c => c.report_date.split("T")[0]), // Extract date only
    datasets: [
      {
        label: "Cases over Time",
        data: filteredCases.map(c => c.case_count),
        borderColor: "green",
        backgroundColor: "rgba(0,128,0,0.2)",
        tension: 0.3
      }
    ]
  };

  // Bar chart data
  const locations = [...new Set(filteredCases.map(c => c.location))];
  const barData = {
    labels: locations,
    datasets: [
      {
        label: "Cases by Location",
        data: locations.map(loc =>
          filteredCases.filter(c => c.location === loc).reduce((sum, c) => sum + c.case_count, 0)
        ),
        backgroundColor: "rgba(0,128,0,0.6)"
      }
    ]
  };

  // Chart options with axis labels
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" }
    },
    scales: {
      x: {
        title: { display: true, text: "Date" }
      },
      y: {
        title: { display: true, text: "Number of Cases" }
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" }
    },
    scales: {
      x: {
        title: { display: true, text: "Location" }
      },
      y: {
        title: { display: true, text: "Number of Cases" }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Community Disease Reporting Dashboard</h2>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading reports...</div>}

      {!loading && cases.length === 0 && (
        <div className="no-data-message">No reports available.</div>
      )}

      {!loading && cases.length > 0 && (
     
        <div className="main-layout">
        {/* Left: Scrollable Table */}
        <div className="cases-table">
          <h3>Reported Cases</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Case ID</th>
                  <th>Disease Type</th>
                  <th>No. of Cases</th>
                  <th>Location</th>
                  <th>Report Date</th>
                </tr>
              </thead>
              <tbody>
                {cases.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.disease_type}</td>
                    <td>{c.case_count}</td>
                    <td>{c.location}</td>
                    <td>{new Date(c.report_date).toLocaleDateString("en-CA")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Stats + Charts */}
        <div className="right-section">
          <div className="filters">
            <div className="filter-group">
              <label> Disease: </label>
              <select value={filterDisease} onChange={e => setFilterDisease(e.target.value)}>
                <option value="All">All</option>
                {[...new Set(cases.map(c => c.disease_type))].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label> From: </label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>

            <div className="filter-group">
              <label> To: </label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
          </div>

          <div className="stats-card">
            <h3>Statistics</h3>
            <p><strong>Total Cases:</strong> {totalCases}</p>
            <p><strong>Diseases Tracked:</strong> {uniqueDiseases}</p>
          </div>

          <div className="charts-section">
            <div className="chart-card">
              <Line data={lineData} options={lineOptions} />
            </div>
            <div className="chart-card">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Dashboard;