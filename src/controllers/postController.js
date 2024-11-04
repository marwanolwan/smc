const Post = require('../models/Post');
const activityService = require('../services/activityService');
const AIService = require('../services/AIService');

// إنشاء منشور جديد وتحليله
exports.createPost = async (req, res) => {
    try {
        const { content, platform } = req.body;
        const userId = req.session.user.userId;

        // تحقق من وجود البيانات
        if (!content || !platform) {
            return res.status(400).json({ error: 'المحتوى والنظام الأساسي مطلوبان' });
        }

        // تحليل المحتوى باستخدام خدمة الذكاء الاصطناعي
        const { sentimentScore, keywords } = AIService.analyzePostContent(content);

        // إنشاء المنشور
        const newPost = new Post({
            userId,
            content,
            platform,
            sentimentScore,
            keywords,
            scheduledTime: new Date(),
            status: 'posted'
        });

        await newPost.save();

        // تسجيل النشاط
        await activityService.logActivity(userId, 'إنشاء منشور');

        res.status(201).json({ message: 'تم إنشاء المنشور بنجاح', post: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'فشل في إنشاء المنشور', details: error.message });
    }
};

// استرجاع المنشورات المجدولة
exports.getScheduledPosts = async (req, res) => {
    try {
        const userId = req.session.user.userId;

        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const posts = await Post.find({ userId, status: 'pending' });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error retrieving scheduled posts:', error);
        res.status(500).json({ error: 'فشل في استرجاع المنشورات', details: error.message });
    }
};

// جدولة منشور
exports.schedulePost = async (req, res) => {
    try {
        const { content, platform, scheduledDate } = req.body;
        const userId = req.session.user.userId;

        if (!content || !platform || !scheduledDate) {
            return res.status(400).json({ error: 'المحتوى، النظام الأساسي، وتاريخ الجدولة مطلوبون' });
        }

        const newPost = new Post({
            userId,
            content,
            platform,
            scheduledTime: scheduledDate,
            status: 'pending'
        });

        await newPost.save();

        res.status(201).json({ message: 'تم جدولة المنشور بنجاح', post: newPost });
    } catch (error) {
        console.error('Error scheduling post:', error);
        res.status(500).json({ error: 'فشل في جدولة المنشور', details: error.message });
    }
};

// استرجاع أداء المنشورات
exports.getPostPerformance = async (req, res) => {
    try {
        const posts = await Post.find({ posted: true });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error retrieving post performance:', error);
        res.status(500).json({ error: 'فشل في استرجاع أداء المنشورات', details: error.message });
    }
};

// اقتراح أوقات النشر بناءً على البيانات المتاحة
exports.suggestPostTimes = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.session.user.userId });
        const engagementData = posts.map(post => ({ timestamp: post.createdAt }));
        const bestTimes = AIService.suggestBestPostTimes(engagementData);

        res.status(200).json({ bestTimes });
    } catch (error) {
        console.error('Error suggesting post times:', error);
        res.status(500).json({ error: 'خطأ في اقتراح أوقات النشر' });
    }
};
