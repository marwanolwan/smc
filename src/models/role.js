const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // اسم الدور، مثل "مدير" أو "محرر"
    permissions: [{ type: String, enum: ['create_posts', 'edit_posts', 'delete_posts', 'view_analytics'] }] // مجموعة الصلاحيات
}, { timestamps: true }); // إضافة خاصية timestamps

module.exports = mongoose.model('Role', roleSchema);
