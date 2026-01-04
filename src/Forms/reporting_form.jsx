import React, { useState } from "react";
import { Link } from 'react-router-dom'
import "./DiseaseReportForm.css"; // css stylesheet

const API_BASE_URL = "https://community-disease-reporting-dashboard.onrender.com/api/reports"; // Update with your backend URL

const DiseaseReportForm = () => {
  const [formData, setFormData] = useState({
    diseaseType: "",
    numCases: "",
    location: "",
    additionalInfo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for backend
      const reportData = {
        disease_type: formData.diseaseType,
        case_count: parseInt(formData.numCases),
        location: formData.location,
        report_date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
      };

      // Send POST request to backend
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      const result = await response.json();
      console.log("Report submitted:", result);
      
      setSuccess("Disease report submitted successfully!");
      // Clear form
      setFormData({
        diseaseType: "",
        numCases: "",
        location: "",
        additionalInfo: ""
      });

      // Clear success message after 30 seconds
      setTimeout(() => setSuccess(""), 30000);
    } catch (err) {
      setError("Error submitting report. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Link to="/auth">
          <button className="admin-btn">Admin</button>
        </Link>
      </div>
      <h2>Disease Reporting Form</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      <form onSubmit={handleSubmit}>
        {/* Disease Type */}
        <div className="form-group">
          <label htmlFor="diseaseType">Disease Type</label>
          <select
            id="diseaseType"
            value={formData.diseaseType}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Disease --</option>
            <option value="Malaria">Malaria</option>
            <option value="Cholera">Cholera</option>
            <option value="Tuberculosis">Tuberculosis</option>
            <option value="HIV/AIDS">HIV/AIDS</option>
            <option value="COVID-19">COVID-19</option>
            <option value="Typhoid Fever">Typhoid Fever</option>
            <option value="Yellow Fever">Yellow Fever</option>
            <option value="Measles">Measles</option>
            <option value="Hepatitis B">Hepatitis B</option>
            <option value="Onchocerciasis">Onchocerciasis (River Blindness)</option>
            <option value="Pneumonia">Pneumonia</option>
            <option value="Influenza">Influenza</option>
            <option value="Dengue">Dengue</option>
            <option value="Polio">Polio</option>
            <option value="Ebola">Ebola</option>

            <option value="Other">Other</option>
          </select>
        </div>

        {/* Number of Cases */}
        <div className="form-group">
          <label htmlFor="numCases">Number of Cases</label>
          <input
            type="number"
            id="numCases"
            min="1"
            value={formData.numCases}
            onChange={handleChange}
            required
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="e.g. Limbe, Douala"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        {/* Additional Information */}
        <div className="form-group">
          <label htmlFor="additionalInfo">Additional Information</label>
          <textarea
            id="additionalInfo"
            rows="3"
            placeholder="Symptoms, urgency, etc."
            value={formData.additionalInfo}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default DiseaseReportForm;