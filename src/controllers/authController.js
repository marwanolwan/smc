// authController.js
const User = require('../models/User');
const { verify2FA } = require('../services/2FAService'); // خدمة التحقق الثنائي

const login = async (req, res) => {
    try {
        const { username, password, twoFactorCode } = req.body;
        const user = await User.findOne({ username });

        if (!user || !user.verifyPassword(password)) {
            return res.status(401).json({ error: 'بيانات دخول غير صحيحة' });
        }

        if (user.twoFactorEnabled) {
            const is2FAValid = verify2FA(user.twoFactorSecret, twoFactorCode);
            if (!is2FAValid) {
                return res.status(401).json({ error: 'رمز التحقق الثنائي غير صحيح' });
            }
        }

        // إنشاء رمز الجلسة وإرجاعه
        const sessionToken = createSession(user.id);
        res.status(200).json({ token: sessionToken });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في تسجيل الدخول' });
    }
};

module.exports = { login };
