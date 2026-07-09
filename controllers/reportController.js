const Report = require("../models/Report");
const puppeteer = require("puppeteer");
const { generateReportHTML } = require("../utils/pdfTemplate");
const { getPaginationQuery } = require("../utils/getPaginationFilter");



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

        // On Render, ensure PUPPETEER_CACHE_DIR is set in env
        if (process.env.PUPPETEER_EXECUTABLE_PATH) {
            if (require('fs').existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
                launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
            } else {
                console.log(`Configured path ${process.env.PUPPETEER_EXECUTABLE_PATH} does not exist. Ignoring.`);
                delete process.env.PUPPETEER_EXECUTABLE_PATH;
            }
        }

        const browser = await puppeteer.launch(launchOptions);

        const page = await browser.newPage();
        
        // Ensure console logs inside the page are visible for debugging (optional)
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

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