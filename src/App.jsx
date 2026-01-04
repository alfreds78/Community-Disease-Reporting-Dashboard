import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import DiseaseReportForm from './Forms/reporting_form'
import Auth from './Forms/signUp.jsx'
import Dashboard from './Forms/Dashboard.jsx'

export default function App() {
  return (
    <Router>
      <div className="app">
        {/* <nav style={{ padding: '12px' }}>
          <Link to="/" style={{ marginRight: 12 }}>Dashboard</Link>
          <Link to="/report" style={{ marginRight: 12 }}>Report</Link>
          <Link to="/auth">Login / Sign Up</Link>
        </nav> */}

        <Routes>
          <Route path="/" element={<DiseaseReportForm />} />
          <Route path="/report" element={<DiseaseReportForm />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}
