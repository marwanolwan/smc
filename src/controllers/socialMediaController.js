const SocialMediaAccount = require('../models/socialMediaAccount');
const config = require('../../config/config');

// ربط حساب التواصل الاجتماعي
exports.linkAccount = async (req, res) => {
    try {
        const { platform, accountId, accessToken } = req.body;
        const userId = req.user.userId;

        // تحقق من وجود البيانات المطلوبة
        if (!platform || !accountId || !accessToken) {
            return res.status(400).json({ error: 'جميع الحقول (النظام الأساسي، معرف الحساب، رمز الوصول) مطلوبة' });
        }

        const newAccount = new SocialMediaAccount({ userId, platform, accountId, accessToken });
        await newAccount.save();

        res.status(201).json({ message: 'تم ربط الحساب بنجاح' });
    } catch (error) {
        console.error('Error linking account:', error);
        res.status(500).json({ error: 'فشل في ربط الحساب', details: error.message });
    }
};

// استرجاع الحسابات المرتبطة
exports.getLinkedAccounts = async (req, res) => {
    try {
        const userId = req.user.userId;

        // تحقق من وجود userId
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const accounts = await SocialMediaAccount.find({ userId });
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error retrieving linked accounts:', error);
        res.status(500).json({ error: 'فشل في استرجاع الحسابات', details: error.message });
    }
};
