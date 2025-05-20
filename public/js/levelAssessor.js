// 水平评估模块 - 负责评估用户英语水平

// 单词难度数据库 (简化版)
// 实际应用中应该使用更完整的数据库或API
const wordLevels = {
    // A1 (初级) 常见单词
    "a": "A1", "about": "A1", "above": "A1", "across": "A1", "act": "A1", "active": "A1",
    "activity": "A1", "add": "A1", "afraid": "A1", "after": "A1", "again": "A1", "age": "A1",
    "ago": "A1", "agree": "A1", "air": "A1", "all": "A1", "alone": "A1", "along": "A1",
    "already": "A1", "always": "A1", "am": "A1", "amount": "A1", "an": "A1", "and": "A1",
    "angry": "A1", "another": "A1", "answer": "A1", "any": "A1", "anyone": "A1", "anything": "A1",
    "anytime": "A1", "appear": "A1", "apple": "A1", "are": "A1", "area": "A1", "arm": "A1",
    "army": "A1", "around": "A1", "arrive": "A1", "art": "A1", "as": "A1", "ask": "A1",
    "at": "A1", "attack": "A1", "aunt": "A1", "autumn": "A1", "away": "A1",
    
    // A2 (初级) 单词
    "ability": "A2", "able": "A2", "abroad": "A2", "accept": "A2", "accident": "A2", "account": "A2",
    "accurate": "A2", "achieve": "A2", "across": "A2", "act": "A2", "action": "A2", "active": "A2",
    "activity": "A2", "actor": "A2", "actress": "A2", "actual": "A2", "actually": "A2", "adapt": "A2",
    "add": "A2", "addition": "A2", "additional": "A2", "address": "A2", "administration": "A2", "admire": "A2",
    "admit": "A2", "adult": "A2", "advance": "A2", "advantage": "A2", "adventure": "A2", "advertise": "A2",
    "advertisement": "A2", "advice": "A2", "advise": "A2", "affair": "A2", "affect": "A2", "afford": "A2",
    
    // B1 (中级) 单词
    "abandon": "B1", "ability": "B1", "abroad": "B1", "absence": "B1", "absolute": "B1", "absolutely": "B1",
    "absorb": "B1", "abuse": "B1", "academic": "B1", "accent": "B1", "accept": "B1", "acceptable": "B1",
    "access": "B1", "accident": "B1", "accidental": "B1", "accidentally": "B1", "accommodation": "B1", "accompany": "B1",
    "accomplish": "B1", "according": "B1", "account": "B1", "accurate": "B1", "accurately": "B1", "accuse": "B1",
    "achieve": "B1", "achievement": "B1", "acknowledge": "B1", "acquire": "B1", "across": "B1", "act": "B1",
    
    // B2 (中级) 单词
    "abstract": "B2", "absurd": "B2", "abundance": "B2", "abundant": "B2", "abuse": "B2", "academic": "B2",
    "accelerate": "B2", "accent": "B2", "acceptance": "B2", "accessible": "B2", "acclaim": "B2", "accommodate": "B2",
    "accommodation": "B2", "accompany": "B2", "accomplishment": "B2", "accordance": "B2", "accordingly": "B2", "accountability": "B2",
    "accountable": "B2", "accumulate": "B2", "accuracy": "B2", "accurately": "B2", "accusation": "B2", "accused": "B2",
    "achievement": "B2", "acid": "B2", "acknowledge": "B2", "acquaintance": "B2", "acquire": "B2", "acquisition": "B2",
    
    // C1 (高级) 单词
    "abdicate": "C1", "aberration": "C1", "abhorrent": "C1", "abide": "C1", "abiding": "C1", "abject": "C1",
    "ablaze": "C1", "abnormal": "C1", "abolish": "C1", "abominable": "C1", "aboriginal": "C1", "abortive": "C1",
    "abound": "C1", "abrasive": "C1", "abreast": "C1", "abrupt": "C1", "abruptly": "C1", "abscess": "C1",
    "abscond": "C1", "absence": "C1", "absenteeism": "C1", "absolute": "C1", "absolutely": "C1", "absolve": "C1",
    "absorb": "C1", "absorption": "C1", "abstain": "C1", "abstention": "C1", "abstinence": "C1", "abstract": "C1",
    
    // C2 (高级) 单词
    "abase": "C2", "abash": "C2", "abate": "C2", "abbess": "C2", "abbey": "C2", "abbot": "C2",
    "abbreviate": "C2", "abdication": "C2", "aberrant": "C2", "abet": "C2", "abeyance": "C2", "abhor": "C2",
    "abhorrence": "C2", "abidance": "C2", "abiding": "C2", "abjure": "C2", "ablation": "C2", "ablution": "C2",
    "abnegate": "C2", "abnegation": "C2", "abolition": "C2", "abolitionist": "C2", "abomination": "C2", "aborigine": "C2",
    "abortifacient": "C2", "abortionist": "C2", "abrasion": "C2", "abrogate": "C2", "abrogation": "C2", "abscission": "C2"
};

// CEFR级别对应的词汇量估计
const cefrVocabEstimates = {
    "A1": 500,
    "A2": 1000,
    "B1": 2000,
    "B2": 4000,
    "C1": 8000,
    "C2": 16000
};

// 评估用户英语水平
function assessLevel(words) {
    // 统计各级别单词数量
    const levelCounts = {
        "A1": 0,
        "A2": 0,
        "B1": 0,
        "B2": 0,
        "C1": 0,
        "C2": 0,
        "unknown": 0
    };
    
    // 计算每个单词的级别
    words.forEach(word => {
        const normalizedWord = word.toLowerCase();
        const level = wordLevels[normalizedWord] || "unknown";
        levelCounts[level]++;
    });
    
    console.log('单词级别统计:', levelCounts);
    
    // 确定用户主要级别
    let userLevel = determineUserLevel(levelCounts);
    
    // 计算进度百分比
    let progressPercentage = calculateProgressPercentage(userLevel);
    
    // 估计词汇量
    let vocabEstimate = estimateVocabulary(userLevel, levelCounts);
    
    return {
        cefrLevel: userLevel,
        progressPercentage: progressPercentage,
        vocabEstimate: vocabEstimate,
        levelCounts: levelCounts
    };
}

// 确定用户主要级别
function determineUserLevel(levelCounts) {
    // 计算总单词数
    const totalWords = Object.values(levelCounts).reduce((sum, count) => sum + count, 0);
    
    // 如果单词太少，默认为A1
    if (totalWords < 5) {
        return "A1";
    }
    
    // 计算各级别的权重
    const weights = {
        "A1": levelCounts["A1"] * 1,
        "A2": levelCounts["A2"] * 2,
        "B1": levelCounts["B1"] * 3,
        "B2": levelCounts["B2"] * 4,
        "C1": levelCounts["C1"] * 5,
        "C2": levelCounts["C2"] * 6,
        "unknown": levelCounts["unknown"] * 3 // 未知单词按中等难度计算
    };
    
    // 计算加权平均
    const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    const averageWeight = totalWeight / totalWords;
    
    // 根据加权平均确定级别
    if (averageWeight <= 1.5) return "A1";
    if (averageWeight <= 2.5) return "A2";
    if (averageWeight <= 3.5) return "B1";
    if (averageWeight <= 4.5) return "B2";
    if (averageWeight <= 5.5) return "C1";
    return "C2";
}

// 计算进度百分比
function calculateProgressPercentage(level) {
    const levelValues = {
        "A1": 16.7,
        "A2": 33.3,
        "B1": 50,
        "B2": 66.7,
        "C1": 83.3,
        "C2": 100
    };
    
    return levelValues[level] || 0;
}

// 估计词汇量
function estimateVocabulary(level, levelCounts) {
    // 基础词汇量
    const baseVocab = cefrVocabEstimates[level];
    
    // 根据用户识别的单词数量进行调整
    const totalWords = Object.values(levelCounts).reduce((sum, count) => sum + count, 0);
    const adjustment = Math.min(totalWords * 50, 500); // 最多增加500词
    
    return baseVocab + adjustment;
}
