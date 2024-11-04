const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { 
        type: String, 
        required: true,
        enum: ['create_post', 'update_post', 'delete_post', 'link_account', 'unlink_account'] // قائمة الأنشطة المسموح بها
    },
    details: { type: String }, // تفاصيل إضافية حول النشاط
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
