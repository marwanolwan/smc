const Post = require('../models/post');

/**
 * توليد تقرير شهري عن المنشورات
 * @param {string} userId - معرف المستخدم
 * @param {number} month - رقم الشهر (1-12)
 * @param {number} year - السنة
 * @returns {Promise<Object>} - كائن يحتوي على معلومات التقرير
 */
const generateMonthlyReport = async (userId, month, year) => {
    try {
        const posts = await Post.find({
            userId,
            posted: true,
            scheduledTime: { // تأكد من استخدام الحقل الصحيح (scheduledTime)
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });

        const totalLikes = posts.reduce((acc, post) => acc + post.performance.likes, 0);
        const totalComments = posts.reduce((acc, post) => acc + post.performance.comments, 0);
        const totalShares = posts.reduce((acc, post) => acc + post.performance.shares, 0);

        return {
            totalPosts: posts.length,
            totalLikes,
            totalComments,
            totalShares
        };
    } catch (error) {
        console.error('فشل في توليد التقرير الشهري:', error);
        throw new Error('Failed to generate monthly report');
    }
};

module.exports = { generateMonthlyReport };
