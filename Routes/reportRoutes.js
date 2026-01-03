const express = require("express");
const router = express.Router();
const { getReports, createReport, updateReport, deleteReport } = require("../controllers/reportController");

router.route("/")
  .get(getReports)
  .post(createReport);

router.route("/:id")
  .put(updateReport)
  .delete(deleteReport);

module.exports = router;