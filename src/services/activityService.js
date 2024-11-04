// activityService.js
const Activity = require('../models/activity');

// تسجيل نشاط معين
exports.logActivity = async (userId, action) => {
    try {
        const activity = await Activity.create({ userId, action });
        return activity; // إرجاع النشاط المسجل
    } catch (error) {
        console.error('Failed to log activity:', error);
        throw new Error('Activity logging failed');
    }
};

// استرجاع الأنشطة الخاصة بمستخدم معين
exports.getActivitiesByUserId = async (userId, options = {}) => {
    const { limit = 10, page = 1 } = options; // تعيين قيم افتراضية للحدود والصفحات
    try {
        const activities = await Activity.find({ userId })
            .sort({ timestamp: -1 }) // ترتيب الأنشطة من الأحدث إلى الأقدم
            .limit(limit) // تحديد عدد الأنشطة المسترجعة
            .skip((page - 1) * limit); // التعامل مع الصفحات

        const totalActivities = await Activity.countDocuments({ userId }); // عدد الأنشطة الإجمالي
        return {
            activities,
            total: totalActivities,
            totalPages: Math.ceil(totalActivities / limit), // حساب إجمالي الصفحات
            currentPage: page,
        };
    } catch (error) {
        console.error('Failed to retrieve activities:', error);
        throw new Error('Activity retrieval failed');
    }
};

// استرجاع كل الأنشطة
exports.getAllActivities = async (options = {}) => {
    const { limit = 10, page = 1 } = options; // تعيين قيم افتراضية للحدود والصفحات
    try {
        const activities = await Activity.find()
            .sort({ timestamp: -1 }) // ترتيب الأنشطة من الأحدث إلى الأقدم
            .limit(limit) // تحديد عدد الأنشطة المسترجعة
            .skip((page - 1) * limit); // التعامل مع الصفحات

        const totalActivities = await Activity.countDocuments(); // عدد الأنشطة الإجمالي
        return {
            activities,
            total: totalActivities,
            totalPages: Math.ceil(totalActivities / limit), // حساب إجمالي الصفحات
            currentPage: page,
        };
    } catch (error) {
        console.error('Failed to retrieve all activities:', error);
        throw new Error('Activity retrieval failed');
    }
};
