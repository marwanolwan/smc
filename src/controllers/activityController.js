const Activity = require('../models/activity');
const User = require('../models/user');

// عرض سجل الأنشطة للمستخدمين
exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find().populate('userId', 'email');
        
        // التحقق من وجود أنشطة
        if (!activities || activities.length === 0) {
            return res.status(404).json({ message: 'No activities found' });
        }

        res.status(200).json(activities);
    } catch (error) {
        console.error('Error retrieving activities:', error); // طباعة الخطأ في السجل
        res.status(500).json({ error: 'Failed to retrieve activities', details: error.message });
    }
};
