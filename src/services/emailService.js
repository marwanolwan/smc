const nodemailer = require('nodemailer');

// إعدادات المرسل
const transporter = nodemailer.createTransport({
    service: 'gmail', // استخدم موفر بريدك الإلكتروني
    auth: {
        user: process.env.EMAIL_USER, // استخدم المتغيرات البيئية لتخزين البريد وكلمة المرور
        pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * إرسال تنبيه تسجيل الدخول عبر البريد الإلكتروني
 * @param {string} email - البريد الإلكتروني للمستخدم
 * @returns {Promise<void>}
 */
exports.sendLoginAlert = async (email) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // استخدم المتغير البيئي للبريد الإلكتروني
        to: email,
        subject: 'تنبيه تسجيل الدخول',
        text: 'لقد تم تسجيل الدخول إلى حسابك بنجاح!'
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('تنبيه تسجيل الدخول تم إرساله بنجاح إلى:', email);
    } catch (error) {
        console.error('فشل في إرسال التنبيه:', error);
        throw new Error('Failed to send email alert'); // إضافة معالجة الأخطاء
    }
};

/**
 * إرسال بريد إلكتروني لتأكيد التسجيل
 * @param {string} email - البريد الإلكتروني للمستخدم
 * @param {string} verificationLink - رابط التحقق
 * @returns {Promise<void>}
 */
exports.sendVerificationEmail = async (email, verificationLink) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'تأكيد التسجيل',
        text: `يرجى تأكيد تسجيلك بالنقر على الرابط التالي: ${verificationLink}`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('بريد تأكيد التسجيل تم إرساله بنجاح إلى:', email);
    } catch (error) {
        console.error('فشل في إرسال بريد التأكيد:', error);
        throw new Error('Failed to send verification email'); // إضافة معالجة الأخطاء
    }
};
