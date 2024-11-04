// config/passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../src/models/user'); // تأكد من المسار الصحيح
const bcrypt = require('bcrypt');

// إعداد استراتيجية المصادقة المحلية
passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            // البحث عن المستخدم بواسطة اسم المستخدم
            const user = await User.findOne({ username });

            if (!user) {
                return done(null, false, { message: 'لا يوجد مستخدم بهذا الاسم' });
            }

            // التحقق من كلمة المرور
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'كلمة المرور غير صحيحة' });
            }

            // إذا تم التحقق من المستخدم وكلمة المرور
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

// وظيفة لتسلسل المستخدم
passport.serializeUser((user, done) => {
    done(null, user.id); // حفظ ID المستخدم
});

// وظيفة لفك تسلسل المستخدم
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
