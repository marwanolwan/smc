const Analytics = require('../models/analytics');

/**
 * حساب معدل التفاعل
 * @param {number} likes - عدد الإعجابات
 * @param {number} comments - عدد التعليقات
 * @param {number} shares - عدد المشاركات
 * @returns {number} - معدل التفاعل
 */
exports.calculateEngagementRate = (likes, comments, shares) => {
    const totalInteractions = likes + comments + shares;
    const engagementRate = totalInteractions > 0 ? (totalInteractions / 100) : 0; // تجنب القسمة على الصفر
    return engagementRate;
};

/**
 * تحديث بيانات التحليلات لمنشور معين
 * @param {string} postId - معرف المنشور
 * @param {number} likes - عدد الإعجابات
 * @param {number} comments - عدد التعليقات
 * @param {number} shares - عدد المشاركات
 * @returns {Promise<void>}
 */
exports.updateAnalytics = async (postId, likes, comments, shares) => {
    const engagementRate = this.calculateEngagementRate(likes, comments, shares);

    // تحديث بيانات التحليلات
    await Analytics.findOneAndUpdate(
        { postId },
        { likes, comments, shares, engagementRate },
        { upsert: true, new: true } // إنشاء بيانات جديدة إن لم تكن موجودة، وإرجاع السجل الجديد
    );
};

/**
 * استرجاع بيانات التحليلات لمنشور معين
 * @param {string} postId - معرف المنشور
 * @returns {Promise<object|null>} - بيانات التحليلات
 */
exports.getAnalyticsByPostId = async (postId) => {
    return await Analytics.findOne({ postId });
};
