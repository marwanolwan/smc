const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// تعريف نموذج بيانات المستخدم
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    socialAccounts: [{
        platform: String, 
        accountId: String, 
        accessToken: String
    }],
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' }, // ربط المستخدم بالدور إذا كان هناك نموذج للدور
    isActive: { type: Boolean, default: true }, // حالة تفعيل الحساب
    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },
    lastLogin: { type: Date, default: Date.now },
    roleType: { type: String, enum: ['user', 'admin'], default: 'user' } // يمكن استخدام هذا في حال عدم وجود نموذج منفصل للدور
}, { timestamps: true });

// دالة لتشفير كلمة المرور قبل حفظ المستخدم
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
