const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    targetAudience: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    dailyBudget: { // ميزانية يومية
        type: Number,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'completed'],
        default: 'active'
    },
    notes: { // ملاحظات إضافية
        type: String
    },
    performance: { // معلومات الأداء
        clicks: { type: Number, default: 0 },
        engagements: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
