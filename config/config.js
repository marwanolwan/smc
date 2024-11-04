// config.js
const session = require('express-session');
const cron = require('node-cron');
const scheduleService = require('../src/services/scheduleService');
const performanceService = require('../src/services/performanceService');
const Post = require('../src/models/post');
require('dotenv').config(); // استيراد متغيرات البيئة

module.exports = {
    // إعدادات قاعدة البيانات
    dbURL: process.env.DB_URL || 'mongodb://localhost:27017/socialMediaManager',

    // إعدادات مفتاح التشفير للـ JWT
    jwtSecret: process.env.JWT_SECRET || 'yourSecretKey',

    // إعدادات API لمنصات التواصل الاجتماعي
    socialMediaAPIs: {
        facebook: process.env.FACEBOOK_API_KEY || 'facebook_api_key',
        twitter: process.env.TWITTER_API_KEY || 'twitter_api_key',
        instagram: process.env.INSTAGRAM_API_KEY || 'instagram_api_key'
    },

    // إعدادات الجلسة
    sessionConfig: session({
        secret: process.env.SESSION_SECRET || 'supersecretkey',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === 'production' } // يجب أن تكون true في حالة الـ HTTPS
    }),

    // إعدادات الجدولة للتحقق من المنشورات المجدولة
    startCronJobs: () => {
        // جدولة التحقق من المنشورات المجدولة كل دقيقة
        cron.schedule('* * * * *', async () => {
            console.log('Checking for scheduled posts to publish...');
            try {
                await scheduleService.checkAndPostScheduledPosts();
            } catch (error) {
                console.error('Error checking scheduled posts:', error);
            }
        });

        // جدولة تحديث أداء المنشورات كل ساعة
        cron.schedule('0 * * * *', async () => { // كل ساعة
            console.log('Updating post performance...');
            try {
                const posts = await Post.find({ posted: true });
                await Promise.all(posts.map(post => performanceService.updatePostPerformance(post._id)));
            } catch (error) {
                console.error('Error updating post performance:', error);
            }
        });
    }
};
