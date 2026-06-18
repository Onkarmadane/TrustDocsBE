const Report = require("../models/Report");
const NondaniReport = require("../models/NondaniReport");

// GET DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
    try {
        // Fetch overall counts concurrently
        const [
            totalRep,
            totalNon,
            finRep,
            finNon,
            draftRep,
            draftNon
        ] = await Promise.all([
            Report.countDocuments(),
            NondaniReport.countDocuments(),
            Report.countDocuments({ status: "completed" }),
            NondaniReport.countDocuments({ status: "completed" }),
            Report.countDocuments({ status: "draft" }),
            NondaniReport.countDocuments({ status: "draft" })
        ]);

        const totalReports = totalRep + totalNon;
        const finalized = finRep + finNon;
        const drafts = draftRep + draftNon;
        const templates = 2; // Static templates count matching the 4 templates in frontend

        // Fetch daily counts for the last 7 days concurrently
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const chartPromises = [];

        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            
            const startOfDay = new Date(d);
            startOfDay.setHours(0, 0, 0, 0);
            
            const endOfDay = new Date(d);
            endOfDay.setHours(23, 59, 59, 999);
            
            const dayName = daysOfWeek[d.getDay()];
            
            chartPromises.push((async () => {
                const [compRep, compNon, drRep, drNon] = await Promise.all([
                    Report.countDocuments({ status: "completed", createdAt: { $gte: startOfDay, $lte: endOfDay } }),
                    NondaniReport.countDocuments({ status: "completed", createdAt: { $gte: startOfDay, $lte: endOfDay } }),
                    Report.countDocuments({ status: "draft", createdAt: { $gte: startOfDay, $lte: endOfDay } }),
                    NondaniReport.countDocuments({ status: "draft", createdAt: { $gte: startOfDay, $lte: endOfDay } })
                ]);
                
                return {
                    name: dayName,
                    created: compRep + compNon,
                    draft: drRep + drNon
                };
            })());
        }

        const chartData = await Promise.all(chartPromises);

        return res.status(200).json({
            success: true,
            data: {
                totalReports,
                templates,
                finalized,
                drafts,
                chartData
            }
        });

    } catch (error) {
        console.error("GET DASHBOARD STATS ERROR => ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
