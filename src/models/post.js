const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // معرف المستخدم
    platform: { type: String, required: true }, // اسم منصة التواصل الاجتماعي
    content: { type: String, required: true },  // المحتوى
    scheduledTime: { type: Date, required: true }, // وقت النشر المجدول
    status: { type: String, enum: ['pending', 'posted', 'deleted'], default: 'pending' }, // حالة المنشور
    posted: { type: Boolean, default: false }, // للتحقق مما إذا كان المنشور قد تم نشره أم لا
    publishedAt: { type: Date }, // تاريخ النشر الفعلي
    performance: { // معلومات الأداء للمنشور
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
