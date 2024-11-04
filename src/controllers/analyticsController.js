const dataAnalysisService = require('../services/dataAnalysisService');
const bestTimeService = require('../services/bestTimeService');
const monthlyReportService = require('../services/monthlyReportService');

// تحديث بيانات التحليلات
exports.updatePostAnalytics = async (req, res) => {
    try {
        const { postId, likes, comments, shares } = req.body;

        // تحقق من وجود البيانات
        if (!postId || typeof likes !== 'number' || typeof comments !== 'number' || typeof shares !== 'number') {
            return res.status(400).json({ error: 'Invalid input data' });
        }

        // تحديث التحليلات
        await dataAnalysisService.updateAnalytics(postId, likes, comments, shares);
        
        res.status(200).json({ message: 'Analytics updated successfully' });
    } catch (error) {
        console.error('Error updating analytics:', error);
        res.status(500).json({ error: 'Failed to update analytics', details: error.message });
    }
};

// الحصول على أفضل وقت للنشر
exports.getBestTimeForPosting = async (req, res) => {
    try {
        const userId = req.session.user.userId;

        // تحقق من وجود userId
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // حساب أفضل وقت للنشر
        const bestTime = await bestTimeService.calculateBestTimeForPosting(userId);
        
        res.status(200).json(bestTime);
    } catch (error) {
        console.error('Error calculating best time for posting:', error);
        res.status(500).json({ error: 'Failed to calculate best time for posting', details: error.message });
    }
};

// الحصول على التقرير الشهري
exports.getMonthlyReport = async (req, res) => {
    try {
        const { month, year } = req.query;
        const userId = req.session.user.userId;

        // تحقق من وجود userId
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        // تحقق من وجود month و year
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required' });
        }

        // توليد التقرير الشهري
        const report = await monthlyReportService.generateMonthlyReport(userId, month, year);
        
        res.status(200).json(report);
    } catch (error) {
        console.error('Error generating monthly report:', error);
        res.status(500).json({ error: 'Failed to generate monthly report', details: error.message });
    }
};
