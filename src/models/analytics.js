const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    engagementRate: { type: Number, default: 0 }, // معدل التفاعل
    date: { type: Date, default: Date.now } // تاريخ جمع البيانات
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);
