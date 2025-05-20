/**
 * 词典模块 - 提供单词翻译和音标
 */
class Dictionary {
    constructor() {
        // 简易词典数据，实际应用中可以使用API
        this.dictionary = {
            // 基础词汇 (A1-A2)
            "hello": { translation: "你好", phonetic: "/həˈləʊ/" },
            "world": { translation: "世界", phonetic: "/wɜːld/" },
            "good": { translation: "好的", phonetic: "/ɡʊd/" },
            "morning": { translation: "早上", phonetic: "/ˈmɔːnɪŋ/" },
            "day": { translation: "天，日子", phonetic: "/deɪ/" },
            "night": { translation: "夜晚", phonetic: "/naɪt/" },
            "food": { translation: "食物", phonetic: "/fuːd/" },
            "water": { translation: "水", phonetic: "/ˈwɔːtə(r)/" },
            "friend": { translation: "朋友", phonetic: "/frend/" },
            "family": { translation: "家庭", phonetic: "/ˈfæməli/" },
            "house": { translation: "房子", phonetic: "/haʊs/" },
            "school": { translation: "学校", phonetic: "/skuːl/" },
            "work": { translation: "工作", phonetic: "/wɜːk/" },
            "play": { translation: "玩耍", phonetic: "/pleɪ/" },
            "time": { translation: "时间", phonetic: "/taɪm/" },
            "happy": { translation: "快乐的", phonetic: "/ˈhæpi/" },
            "sad": { translation: "悲伤的", phonetic: "/sæd/" },
            "big": { translation: "大的", phonetic: "/bɪɡ/" },
            "small": { translation: "小的", phonetic: "/smɔːl/" },
            "hot": { translation: "热的", phonetic: "/hɒt/" },
            "cold": { translation: "冷的", phonetic: "/kəʊld/" },
            
            // 中级词汇 (B1-B2)
            "experience": { translation: "经验，体验", phonetic: "/ɪkˈspɪəriəns/" },
            "consider": { translation: "考虑", phonetic: "/kənˈsɪdə(r)/" },
            "develop": { translation: "发展", phonetic: "/dɪˈveləp/" },
            "provide": { translation: "提供", phonetic: "/prəˈvaɪd/" },
            "require": { translation: "需要", phonetic: "/rɪˈkwaɪə(r)/" },
            "suggest": { translation: "建议", phonetic: "/səˈdʒest/" },
            "improve": { translation: "改进", phonetic: "/ɪmˈpruːv/" },
            "increase": { translation: "增加", phonetic: "/ɪnˈkriːs/" },
            "reduce": { translation: "减少", phonetic: "/rɪˈdjuːs/" },
            "achieve": { translation: "实现", phonetic: "/əˈtʃiːv/" },
            "environment": { translation: "环境", phonetic: "/ɪnˈvaɪrənmənt/" },
            "situation": { translation: "情况", phonetic: "/ˌsɪtʃuˈeɪʃn/" },
            "opportunity": { translation: "机会", phonetic: "/ˌɒpəˈtjuːnəti/" },
            "challenge": { translation: "挑战", phonetic: "/ˈtʃælɪndʒ/" },
            "decision": { translation: "决定", phonetic: "/dɪˈsɪʒn/" },
            
            // 高级词汇 (C1-C2)
            "sophisticated": { translation: "复杂的，精密的", phonetic: "/səˈfɪstɪkeɪtɪd/" },
            "comprehensive": { translation: "全面的", phonetic: "/ˌkɒmprɪˈhensɪv/" },
            "endeavor": { translation: "努力，尝试", phonetic: "/ɪnˈdevə(r)/" },
            "meticulous": { translation: "一丝不苟的", phonetic: "/məˈtɪkjələs/" },
            "profound": { translation: "深刻的", phonetic: "/prəˈfaʊnd/" },
            "intricate": { translation: "复杂的，错综的", phonetic: "/ˈɪntrɪkət/" },
            "ambiguous": { translation: "模棱两可的", phonetic: "/æmˈbɪɡjuəs/" },
            "eloquent": { translation: "雄辩的", phonetic: "/ˈeləkwənt/" },
            "innovative": { translation: "创新的", phonetic: "/ˈɪnəveɪtɪv/" },
            "paradigm": { translation: "范例，模式", phonetic: "/ˈpærədaɪm/" },
            "phenomenon": { translation: "现象", phonetic: "/fəˈnɒmɪnən/" },
            "arbitrary": { translation: "任意的", phonetic: "/ˈɑːbɪtrəri/" },
            "scrutinize": { translation: "仔细检查", phonetic: "/ˈskruːtənaɪz/" },
            "juxtapose": { translation: "并置", phonetic: "/ˈdʒʌkstəpəʊz/" },
            "quintessential": { translation: "典型的", phonetic: "/ˌkwɪntɪˈsenʃl/" }
        };
    }

    /**
     * 获取单词的翻译和音标
     * @param {string} word - 要查询的单词
     * @returns {Object|null} - 单词信息或null（如果未找到）
     */
    getWordInfo(word) {
        const normalizedWord = word.toLowerCase().trim();
        return this.dictionary[normalizedWord] || null;
    }

    /**
     * 检查单词是否在词典中
     * @param {string} word - 要检查的单词
     * @returns {boolean} - 是否存在
     */
    hasWord(word) {
        const normalizedWord = word.toLowerCase().trim();
        return normalizedWord in this.dictionary;
    }

    /**
     * 获取单词难度级别
     * @param {string} word - 要检查的单词
     * @returns {string} - 难度级别：'basic', 'intermediate', 'advanced' 或 'unknown'
     */
    getWordLevel(word) {
        const normalizedWord = word.toLowerCase().trim();
        
        // 基础词汇 (A1-A2)
        const basicWords = [
            "hello", "world", "good", "morning", "day", "night", "food", "water",
            "friend", "family", "house", "school", "work", "play", "time",
            "happy", "sad", "big", "small", "hot", "cold"
        ];
        
        // 中级词汇 (B1-B2)
        const intermediateWords = [
            "experience", "consider", "develop", "provide", "require", "suggest",
            "improve", "increase", "reduce", "achieve", "environment", "situation",
            "opportunity", "challenge", "decision"
        ];
        
        // 高级词汇 (C1-C2)
        const advancedWords = [
            "sophisticated", "comprehensive", "endeavor", "meticulous", "profound",
            "intricate", "ambiguous", "eloquent", "innovative", "paradigm",
            "phenomenon", "arbitrary", "scrutinize", "juxtapose", "quintessential"
        ];
        
        if (basicWords.includes(normalizedWord)) {
            return 'basic';
        } else if (intermediateWords.includes(normalizedWord)) {
            return 'intermediate';
        } else if (advancedWords.includes(normalizedWord)) {
            return 'advanced';
        } else {
            return 'unknown';
        }
    }
}
