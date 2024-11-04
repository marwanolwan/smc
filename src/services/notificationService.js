const sendNotification = (message) => {
    // يمكننا إرسال الإشعارات عبر البريد الإلكتروني أو رسائل التنبيه داخل النظام
    console.log(`Notification: ${message}`);
};

/**
 * تنبيه المستخدم عند تفاعل كبير مع المنشور
 * @param {Object} post - كائن المنشور
 * @returns {Promise<void>}
 */
const notifyUserForPostInteraction = async (post) => {
    const threshold = 50; // عدد التفاعلات لتشغيل التنبيه
    const totalInteraction = post.performance.likes + post.performance.comments + post.performance.shares;

    // إذا كان عدد التفاعلات يتجاوز العتبة المحددة، أرسل إشعارًا
    if (totalInteraction >= threshold) {
        sendNotification(`المنشور ${post._id} حصل على تفاعل كبير!`);
    }
};

module.exports = { notifyUserForPostInteraction };
