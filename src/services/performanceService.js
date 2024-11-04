const Post = require('../models/post');
const socialMediaAPI = require('./socialMediaAPI');

/**
 * تحديث أداء المنشور بناءً على بيانات من واجهة برمجة التطبيقات الخاصة بالشبكات الاجتماعية
 * @param {string} postId - معرف المنشور
 * @returns {Promise<void>}
 * @throws {Error} - إذا لم يتم العثور على المنشور
 */
const updatePostPerformance = async (postId) => {
    const post = await Post.findById(postId);
    
    // التحقق مما إذا كان المنشور موجودًا
    if (!post) throw new Error('Post not found');

    // استدعاء واجهة برمجة التطبيقات للحصول على بيانات الأداء
    const performanceData = await socialMediaAPI.getPostPerformance(post.platform, post._id);

    // تحديث أداء المنشور
    post.performance.likes = performanceData.likes || 0;
    post.performance.comments = performanceData.comments || 0;
    post.performance.shares = performanceData.shares || 0;
    
    await post.save(); // حفظ التحديثات في قاعدة البيانات
};

module.exports = { updatePostPerformance };
