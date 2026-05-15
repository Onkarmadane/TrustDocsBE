const Report = require("../models/Report");


// CREATE REPORT
exports.createReport = async (req, res) => {
    try {

        console.log("CREATE REPORT BODY => ", req.body);

        const report = await Report.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Report created successfully",
            data: report,
        });

    } catch (error) {

        console.log("CREATE REPORT ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



// GET ALL REPORTS
exports.getReports = async (req, res) => {
    try {

        const reports = await Report.find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });

    } catch (error) {

        console.log("GET REPORTS ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};



// GET SINGLE REPORT
exports.getSingleReport = async (req, res) => {
    try {

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: report,
        });

    } catch (error) {

        console.log("GET SINGLE REPORT ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};



// UPDATE REPORT
exports.updateReport = async (req, res) => {
    try {

        console.log("UPDATE BODY => ", req.body);

        const report = await Report.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Report updated successfully",
            data: report,
        });

    } catch (error) {

        console.log("UPDATE REPORT ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};



// DELETE REPORT
exports.deleteReport = async (req, res) => {
    try {

        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        await report.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Report deleted successfully",
        });

    } catch (error) {

        console.log("DELETE REPORT ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};