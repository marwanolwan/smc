const mongoose = require('mongoose');

const socialMediaAccountSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true, enum: ['Facebook', 'Twitter', 'Instagram', 'LinkedIn'] }, // المنصة (مثل Facebook، Twitter)
    accountId: { type: String, required: true },
    accessToken: { type: String, required: true },
    isActive: { type: Boolean, default: true } // حالة تفعيل الحساب
}, { timestamps: true });

module.exports = mongoose.model('SocialMediaAccount', socialMediaAccountSchema);
