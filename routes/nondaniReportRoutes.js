const express = require("express");
const router = express.Router();
const {
    createReport,
    getReports,
    getSingleReport,
    updateReport,
    deleteReport,
    generatePdf,
} = require("../controllers/nondaniReportController");

router.post("/", createReport);
router.get("/", getReports);
router.get("/:id", getSingleReport);
router.get("/:id/pdf", generatePdf);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

module.exports = router;
