const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const socialMediaController = require('../controllers/socialMediaController');
const postController = require('../controllers/postController');
const analyticsController = require('../controllers/analyticsController');
const aiController = require('../controllers/aiController');
const activityController = require('../controllers/activityController');
const adminController = require('../controllers/adminController');
const permissionService = require('../services/permissionService');

// Middleware لتوثيق المستخدمين
const ensureAuthenticated = userController.ensureAuthenticated;

// مسارات المستخدمين
router.post('/register', userController.register);
router.post('/login', userController.login);

// مسارات الحسابات الاجتماعية
router.post('/link-account', ensureAuthenticated, socialMediaController.linkAccount);
router.get('/linked-accounts', ensureAuthenticated, socialMediaController.getLinkedAccounts);

// مسارات المنشورات
router.post('/create-post', ensureAuthenticated, async (req, res, next) => {
    const { userId } = req.session.user;
    const hasPermission = await permissionService.hasPermission(userId, 'إنشاء منشورات');
    
    if (hasPermission) {
        return next();
    } 
    return res.status(403).json({ error: 'Access denied' });
}, postController.createPost);

router.get('/scheduled-posts', ensureAuthenticated, postController.getScheduledPosts);
router.post('/schedule-post', ensureAuthenticated, postController.schedulePost);

// مسارات التحليلات
router.post('/update-analytics', ensureAuthenticated, analyticsController.updatePostAnalytics);
router.get('/best-time', ensureAuthenticated, analyticsController.getBestTimeForPosting);

// مسارات الذكاء الاصطناعي
router.get('/content-suggestions', ensureAuthenticated, aiController.getContentSuggestions);

// مسارات الإدارة
// التأكد من صلاحيات "عرض الأنشطة" للمسؤول
router.get('/admin/activities', ensureAuthenticated, async (req, res, next) => {
    const { userId } = req.session.user;
    const hasPermission = await permissionService.hasPermission(userId, 'عرض الأنشطة');
    
    if (hasPermission) {
        return next();
    } 
    return res.status(403).json({ error: 'Access denied' });
}, activityController.getActivities);

// إدارة المستخدمين
router.get('/admin/users', ensureAuthenticated, adminController.getUsers);
router.post('/admin/update-role', ensureAuthenticated, adminController.updateUserRole);

// عرض الأدوار
router.get('/admin/roles', ensureAuthenticated, adminController.getRoles);

// مسار أداء المنشورات
router.get('/post-performance', ensureAuthenticated, postController.getPostPerformance);

// مسار التقرير الشهري
router.get('/monthly-report', ensureAuthenticated, analyticsController.getMonthlyReport);

// معالجة الأخطاء العامة
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = router;
