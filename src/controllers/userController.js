const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../../config/config');
const emailService = require('../services/emailService');

let failedAttempts = {}; // تخزين عدد المحاولات الفاشلة لكل مستخدم

// دالة تسجيل المستخدم الجديد
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Failed to register user', details: error.message });
    }
};

// دالة تسجيل الدخول
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            failedAttempts[email] = (failedAttempts[email] || 0) + 1;

            if (failedAttempts[email] >= 3) { // بعد 3 محاولات فاشلة
                await emailService.sendAlertEmail(email, 'There have been multiple failed login attempts on your account.');
                failedAttempts[email] = 0; // إعادة التعيين
            }

            return res.status(400).json({ error: 'Invalid email or password' });
        }

        req.session.user = { userId: user._id };
        failedAttempts[email] = 0; // إعادة تعيين المحاولات عند النجاح
        await emailService.sendLoginAlert(user.email); // إرسال إشعار تسجيل الدخول

        const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login', details: error.message });
    }
};

// التأكد من أن المستخدم مسجل الدخول
exports.ensureAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
