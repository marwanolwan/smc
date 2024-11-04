// bestTimeService.js
const Post = require('../models/post');

// حساب أفضل وقت للنشر بناءً على المنشورات السابقة
const calculateBestTimeForPosting = async (userId) => {
    try {
        // استرجاع المنشورات المنشورة للمستخدم
        const posts = await Post.find({ userId, posted: true });
        
        if (!posts || posts.length === 0) {
            throw new Error('No posts found for this user.');
        }

        const times = {};

        // حساب عدد الإعجابات لكل ساعة
        posts.forEach(post => {
            const hour = post.scheduledTime.getHours(); // تعديل هنا للتأكد من استخدام scheduledTime
            const likes = post.performance.likes;

            if (!times[hour]) times[hour] = { count: 0, totalLikes: 0 };
            times[hour].count += 1;
            times[hour].totalLikes += likes;
        });

        // تحديد أفضل وقت للنشر
        const bestTime = Object.keys(times).reduce((best, hour) => {
            const avgLikes = times[hour].totalLikes / times[hour].count; // حساب المعدل
            return avgLikes > best.avgLikes ? { hour: parseInt(hour), avgLikes } : best;
        }, { hour: null, avgLikes: 0 });

        return bestTime;
    } catch (error) {
        console.error('Error calculating best time for posting:', error);
        throw new Error('Failed to calculate best time for posting');
    }
};

module.exports = { calculateBestTimeForPosting };
