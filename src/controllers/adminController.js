const User = require('../models/user');
const Role = require('../models/role');

// جلب جميع المستخدمين
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'name');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error retrieving users:', error); // طباعة الخطأ في السجل
        res.status(500).json({ error: 'Failed to retrieve users', details: error.message });
    }
};

// تحديث دور المستخدم
exports.updateUserRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;
        
        // تحقق من وجود المستخدم
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // تحقق من وجود الدور
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(404).json({ error: 'Role not found' });
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { role: roleId }, { new: true }).populate('role', 'name');
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user role:', error); // طباعة الخطأ في السجل
        res.status(500).json({ error: 'Failed to update user role', details: error.message });
    }
};

// جلب جميع الأدوار
exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error retrieving roles:', error); // طباعة الخطأ في السجل
        res.status(500).json({ error: 'Failed to retrieve roles', details: error.message });
    }
};
