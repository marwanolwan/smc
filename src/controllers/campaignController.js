const Campaign = require('../models/campaign');
const activityService = require('../services/activityService');

// إنشاء حملة جديدة
exports.createCampaign = async (req, res) => {
    try {
        const { name, description, targetAudience, budget, startDate, endDate } = req.body;
        const userId = req.user.userId;

        const newCampaign = new Campaign({
            userId,
            name,
            description,
            targetAudience,
            budget,
            startDate,
            endDate,
            status: 'active' // حالة الحملة
        });

        await newCampaign.save();

        // تسجيل النشاط
        await activityService.logActivity(userId, 'إنشاء حملة جديدة');

        res.status(201).json({ message: 'Campaign created successfully', campaign: newCampaign });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create campaign' });
    }
};

// استرجاع جميع الحملات
exports.getCampaigns = async (req, res) => {
    try {
        const userId = req.user.userId;
        const campaigns = await Campaign.find({ userId });
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve campaigns' });
    }
};

// تحديث معلومات حملة
exports.updateCampaign = async (req, res) => {
    try {
        const { campaignId, updates } = req.body;

        const updatedCampaign = await Campaign.findByIdAndUpdate(campaignId, updates, { new: true });
        res.json(updatedCampaign);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update campaign' });
    }
};

// حذف حملة
exports.deleteCampaign = async (req, res) => {
    try {
        const { campaignId } = req.body;

        await Campaign.findByIdAndDelete(campaignId);
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete campaign' });
    }
};

// استرجاع أداء الحملات
exports.getCampaignPerformance = async (req, res) => {
    try {
        const userId = req.user.userId;
        const campaigns = await Campaign.find({ userId });

        // هنا يمكن إضافة منطق لتحليل الأداء بناءً على البيانات الخاصة بالحملات
        const performanceData = campaigns.map(campaign => ({
            name: campaign.name,
            budget: campaign.budget,
            startDate: campaign.startDate,
            endDate: campaign.endDate,
            status: campaign.status,
            // يمكن إضافة مقاييس أخرى هنا
        }));

        res.json(performanceData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve campaign performance' });
    }
};
