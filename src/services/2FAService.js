// 2FAService.js
const speakeasy = require('speakeasy');

// توليد سر التحقق الثنائي للمستخدم
const generate2FASecret = () => {
    const secret = speakeasy.generateSecret({ length: 20 });
    return {
        ascii: secret.ascii,
        base32: secret.base32,
        otpauth_url: secret.otpauth_url,
    };
};

// التحقق من رمز 2FA المدخل
const verify2FA = (secret, token) => {
    return speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token,
    });
};

module.exports = { generate2FASecret, verify2FA };
