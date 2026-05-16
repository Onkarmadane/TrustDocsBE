const Report = require("../models/Report");
const puppeteer = require("puppeteer");
const fs = require('fs');
const { generateReportHTML } = require("../utils/pdfTemplate");
const { getPaginationQuery } = require("../utils/getPaginationFilter");

// Helper to find existing browser path for Puppeteer
const getExecutablePath = () => {
    if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
    
    const commonPaths = [
        '/usr/bin/google-chrome-stable',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    ];

    for (const path of commonPaths) {
        if (fs.existsSync(path)) return path;
    }
    return null; // Fallback to bundled chromium
};



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
        const { status, search, page, per_page } = req.query;
        let query = {};

        if (status && status !== 'all') {
            query.status = status;
        }

        if (search) {
            query.$or = [
                { trustName: { $regex: search, $options: 'i' } },
                { reportType: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Report.countDocuments(query);
        const pagination = getPaginationQuery(page, per_page, 10, 100, total);

        const reports = await Report.find(query)
            .sort({ createdAt: -1 })
            .skip(pagination.skip)
            .limit(pagination.per_page);

        return res.status(200).json({
            success: true,
            pagination,
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



// GENERATE PDF
exports.generatePdf = async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        // Generate the HTML for the PDF
        const htmlContent = generateReportHTML(report);

        // Launch Puppeteer
        // Launch Puppeteer with optimized options for deployment
        const launchOptions = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        };

        // On deployment (Linux), let Puppeteer find its own Chromium or use specified path
        // On local (Windows), it will use bundled Chromium or specified path
        const exePath = getExecutablePath();
        if (exePath) {
            launchOptions.executablePath = exePath;
        }

        const browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();
        
        // Ensure console logs inside the page are visible for debugging (optional)
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', right: '15mm', bottom: '15mm', left: '15mm' }
        });

        await browser.close();

        // Send the PDF back to the client
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="Report_${report.trustName || 'Trust'}.pdf"`,
            'Content-Length': pdfBuffer.length
        });

        return res.send(pdfBuffer);

    } catch (error) {
        console.log("GENERATE PDF ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate PDF",
            error: error.message
        });
    }
};