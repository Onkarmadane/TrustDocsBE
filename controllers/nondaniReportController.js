const NondaniReport = require("../models/NondaniReport");
const puppeteer = require("puppeteer");
const generateNondaniReportHTML = require("../utils/nondaniTemplate");
const { getPaginationQuery } = require("../utils/getPaginationFilter");

// CREATE REPORT
exports.createReport = async (req, res) => {
    try {
        const report = await NondaniReport.create(req.body);
        return res.status(201).json({ success: true, message: "Report created successfully", data: report });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// GET ALL REPORTS
exports.getReports = async (req, res) => {
    try {
        const { status, search, page, per_page } = req.query;
        let query = {};
        if (status && status !== 'all') query.status = status;
        if (search) query.trustName = { $regex: search, $options: 'i' };

        const total = await NondaniReport.countDocuments(query);
        const pagination = getPaginationQuery(page, per_page, 10, 100, total);
        const reports = await NondaniReport.find(query).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.per_page);

        return res.status(200).json({ success: true, pagination, data: reports });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GET SINGLE REPORT
exports.getSingleReport = async (req, res) => {
    try {
        const report = await NondaniReport.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });
        return res.status(200).json({ success: true, data: report });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// UPDATE REPORT
exports.updateReport = async (req, res) => {
    try {
        const report = await NondaniReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });
        return res.status(200).json({ success: true, message: "Report updated successfully", data: report });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

// DELETE REPORT
exports.deleteReport = async (req, res) => {
    try {
        const report = await NondaniReport.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });
        await report.deleteOne();
        return res.status(200).json({ success: true, message: "Report deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// GENERATE PDF
exports.generatePdf = async (req, res) => {
    try {
        const report = await NondaniReport.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: "Report not found" });

        const htmlContent = generateNondaniReportHTML(report);
        const launchOptions = {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--no-first-run', '--no-zygote', '--single-process', '--disable-gpu']
        };

        if (process.env.PUPPETEER_EXECUTABLE_PATH) {
            if (require('fs').existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
                launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
            } else {
                delete process.env.PUPPETEER_EXECUTABLE_PATH;
            }
        }

        const browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', right: '15mm', bottom: '20mm', left: '15mm' },
            displayHeaderFooter: true,
            headerTemplate: '<div></div>',
            footerTemplate: `
                <div style="font-size: 10px; font-family: 'Tiro Devanagari Marathi', 'Times New Roman', serif; width: 100%; text-align: right; padding-right: 20px; color: #000;">
                    (<span class="pageNumber"></span>)
                </div>
            `
        });
        await browser.close();

        const safeFileName = (report.trustName || report.trustDetails?.trustName || 'Trust').replace(/[^a-zA-Z0-9]/g, '_');
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="NondaniReport_${safeFileName}.pdf"`,
            'Content-Length': pdfBuffer.length
        });
        return res.send(pdfBuffer);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to generate PDF", error: error.message });
    }
};
