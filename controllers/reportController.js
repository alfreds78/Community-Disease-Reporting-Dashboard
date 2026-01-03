const pool = require("../config/db");

// Get all reports
exports.getReports = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM reports ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Create new report
exports.createReport = async (req, res, next) => {
  try {
    const { disease_type, case_count, location, report_date } = req.body;
    const result = await pool.query(
      "INSERT INTO reports (disease_type, case_count, location, report_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [disease_type, case_count, location, report_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Update report
exports.updateReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { disease_type, case_count, location, report_date } = req.body;
    const result = await pool.query(
      "UPDATE reports SET disease_type=$1, case_count=$2, location=$3, report_date=$4 WHERE id=$5 RETURNING *",
      [disease_type, case_count, location, report_date, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

// Delete report
exports.deleteReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM reports WHERE id=$1", [id]);
    res.json({ message: "Report deleted" });
  } catch (err) {
    next(err);
  }
};