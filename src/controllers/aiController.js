const aiService = require('../services/aiService');
const Analytics = require('../models/analytics');
const natural = require('natural');
const { Configuration, OpenAIApi } = require('openai');
const Sentiment = require('sentiment');
const axios = require('axios');
const dataAnalysisService = require('../services/dataAnalysisService');

// إعداد OpenAI API
const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY })); // استخدم متغير البيئة

// تقديم اقتراحات بناءً على البيانات التحليلية
exports.getContentSuggestions = async (req, res) => {
    try {
        const userId = req.user.userId;
        const analyticsData = await Analytics.find({ userId });

        // تحقق من وجود البيانات
        if (!analyticsData || analyticsData.length === 0) {
            return res.status(404).json({ message: 'No analytics data found' });
        }

        const suggestions = await aiService.generateContentSuggestions(analyticsData);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error('Error generating content suggestions:', error); // طباعة الخطأ في السجل
        res.status(500).json({ error: 'Failed to generate content suggestions', details: error.message });
    }
};

// تحليل نصوص
function analyzeText(text) {
    const tokenizer = new natural.WordTokenizer();
    const words = tokenizer.tokenize(text);
    return words;
}

// توليد محتوى
async function generateContent(prompt) {
    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 150,
        });
        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('Error generating content:', error); // طباعة الخطأ في السجل
        throw new Error('Content generation failed');
    }
}

// تحليل المشاعر
function analyzeSentiment(text) {
    const sentiment = new Sentiment();
    const result = sentiment.analyze(text);
    return result;
}

// التوصية بالحملات
async function recommendCampaigns(userId) {
    const previousCampaigns = await dataAnalysisService.getPreviousCampaigns(userId);
    // تحليل البيانات واستخراج التوصيات
    const recommendations = []; // استبدل هذا بكود التحليل الفعلي
    return recommendations;
}

// مراقبة الاتجاهات
async function monitorTrends() {
    try {
        const response = await axios.get('https://api.twitter.com/1.1/trends/place.json?id=1', {
            headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}` } // استخدم متغير البيئة
        });
        return response.data;
    } catch (error) {
        console.error('Error monitoring trends:', error); // طباعة الخطأ في السجل
        throw new Error('Trend monitoring failed');
    }
}

// إرسال التنبيهات
function sendAlert(message) {
    console.log(`تنبيه: ${message}`);
}

// التحقق من التنبيهات
function checkAlerts(userData, threshold) {
    if (userData.interactions < threshold) {
        sendAlert('انخفاض التفاعل في حسابك!');
    }
}
