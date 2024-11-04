// استيراد المكتبات والملفات الضرورية
const express = require('express');
const session = require('./config/config').sessionConfig;
const routes = require('./src/routes/routes');
const config = require('./config'); // استيراد إعدادات التكوين
const cors = require('cors');
const helmet = require('helmet');

// إنشاء التطبيق
const app = express();

// إعدادات JSON لتحليل الطلبات
app.use(express.json());
app.use(cors()); // تفعيل CORS
app.use(helmet()); // تحسين الأمان

// إعداد الجلسة
app.use(session);

// استخدام المسارات
app.use('/api', routes);

// بدء تشغيل الجدولة عند بدء التطبيق
config.startCronJobs();

// تحديد رقم المنفذ
const PORT = process.env.PORT || 3000;

// بدء الخادم
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// معالجة الأخطاء
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'حدث خطأ غير متوقع. يرجى المحاولة لاحقًا.' });
});

// صفحة 404
app.use((req, res) => {
    res.status(404).json({ message: 'لم يتم العثور على المورد.' });
});
