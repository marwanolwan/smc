const Post = require('../models/post');
const socialMediaAPI = require('./socialMediaAPI');

/**
 * التحقق من المنشورات المجدولة وإرسالها إلى منصات التواصل الاجتماعي
 * @returns {Promise<void>}
 */
const checkAndPostScheduledPosts = async () => {
    const now = new Date();
    
    // العثور على المنشورات المجدولة التي يجب نشرها
    const postsToPost = await Post.find({ scheduledDate: { $lte: now }, posted: false });

    if (postsToPost.length === 0) {
        console.log('No posts to send at this time.');
        return;
    }

    // نشر كل منشور
    for (const post of postsToPost) {
        try {
            // إرسال المنشور إلى منصة التواصل الاجتماعي
            await socialMediaAPI.postToPlatform(post.platform, post.content);
            post.posted = true; // تحديث حالة المنشور
            await post.save(); // حفظ التغييرات
            console.log(`Post sent successfully: ${post._id}`);
        } catch (error) {
            console.error(`Failed to post: ${post._id}`, error);
        }
    }
};

module.exports = { checkAndPostScheduledPosts };
