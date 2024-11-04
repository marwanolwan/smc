const User = require('../models/user');
const Role = require('../models/role');

/**
 * التحقق مما إذا كان لدى المستخدم صلاحية معينة
 * @param {string} userId - معرف المستخدم
 * @param {string} requiredPermission - الصلاحية المطلوبة للتحقق
 * @returns {Promise<boolean>} - إرجاع true إذا كان لدى المستخدم الصلاحية، false خلاف ذلك
 */
exports.hasPermission = async (userId, requiredPermission) => {
    try {
        const user = await User.findById(userId).populate('role');
        
        // التحقق مما إذا كان المستخدم موجودًا ويمتلك دورًا
        if (!user || !user.role) return false;

        // التحقق من وجود الصلاحية في قائمة الصلاحيات للدور
        return user.role.permissions && user.role.permissions.includes(requiredPermission);
    } catch (error) {
        console.error('Error checking permissions:', error);
        return false; // في حالة حدوث خطأ، يتم إرجاع false
    }
};
