const express = require("express");

const router = express.Router();

const {
    createReport,
    getReports,
    getSingleReport,
    updateReport,
    deleteReport,
} = require("../controllers/reportController");



router.post("/", createReport);

router.get("/", getReports);

router.get("/:id", getSingleReport);

router.put("/:id", updateReport);

router.delete("/:id", deleteReport);



module.exports = router;