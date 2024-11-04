// aiService.js
const axios = require('axios');

// وظيفة تقديم اقتراحات محتوى ذكية بناءً على التحليلات
exports.generateContentSuggestions = async (analyticsData) => {
    try {
        // التحقق من صحة البيانات المدخلة
        if (!Array.isArray(analyticsData) || analyticsData.length === 0) {
            throw new Error('Invalid analytics data');
        }

        // إرسال البيانات إلى API خارجي للذكاء الاصطناعي إذا كان متاحًا
        const apiResponse = await axios.post('YOUR_AI_API_ENDPOINT', { data: analyticsData });

        // التحقق من صحة استجابة API
        if (!apiResponse.data || !apiResponse.data.suggestions) {
            throw new Error('Invalid response from AI API');
        }

        // معالجة الاستجابة
        const suggestions = apiResponse.data.suggestions.map(suggestion => ({
            platform: suggestion.platform,
            suggestion: suggestion.content // استرجاع المحتوى من الاستجابة
        }));

        // إضافة اقتراحات إضافية بناءً على التحليلات
        analyticsData.forEach(data => {
            suggestions.push({
                platform: data.platform,
                suggestion: `حاول إضافة المزيد من الوسوم لتحسين التفاعل على ${data.platform}.`
            });
        });

        return suggestions;
    } catch (error) {
        console.error('Error generating content suggestions:', error.message);
        throw new Error('Failed to generate content suggestions');
    }
};

// AIService.js
const natural = require('natural');
const sentimentAnalyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

// تحليل النص واقتراح الكلمات المفتاحية
const analyzePostContent = (content) => {
    const sentimentScore = sentimentAnalyzer.getSentiment(content.split(" "));
    const keywords = content.split(" ").filter(word => word.length > 4);
    return { sentimentScore, keywords };
};

// اقتراح أفضل الأوقات للنشر بناءً على تفاعل المستخدمين
const suggestBestPostTimes = (engagementData) => {
    const peakTimes = engagementData.reduce((times, entry) => {
        const hour = new Date(entry.timestamp).getHours();
        times[hour] = (times[hour] || 0) + 1;
        return times;
    }, {});
    return Object.keys(peakTimes).sort((a, b) => peakTimes[b] - peakTimes[a]).slice(0, 3);
};

module.exports = { analyzePostContent, suggestBestPostTimes };
