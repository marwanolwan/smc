const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stopword = require('stopword');

// دالة لتقسيم النص إلى كلمات
const tokenizeText = (text) => {
    // تقسيم النص إلى كلمات
    const tokens = tokenizer.tokenize(text);
    
    // إزالة الكلمات الشائعة
    const filteredTokens = stopword.removeStopwords(tokens);
    
    return filteredTokens;
};

// دالة لحساب تكرار الكلمات
const countWordFrequencies = (tokens) => {
    const frequencyMap = {};
    tokens.forEach(token => {
        frequencyMap[token] = (frequencyMap[token] || 0) + 1;
    });
    return frequencyMap;
};

// نص المثال
const text = "This is an example text for natural language processing. Natural language processing is fascinating and useful.";

// تقسيم النص
const tokens = tokenizeText(text);

// حساب تكرار الكلمات
const wordFrequencies = countWordFrequencies(tokens);

// عرض النتائج
console.log("Original Text:", text);
console.log("Tokens:", tokens);
console.log("Word Frequencies:", wordFrequencies);
