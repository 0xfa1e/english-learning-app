// 水平评估API
module.exports = (req, res) => {
  try {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // 处理OPTIONS请求
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // 确保是POST请求
    if (req.method !== 'POST') {
      return res.status(405).json({ error: '只支持POST请求' });
    }
    
    // 添加调试日志
    console.log('收到水平评估API请求');
    console.log('请求体:', req.body);
    
    // 获取请求体中的数据
    const { words } = req.body;
    
    if (!words || !Array.isArray(words)) {
      console.log('请求参数错误:', req.body);
      return res.status(400).json({ error: '缺少必要参数或格式不正确' });
    }
    
    // 单词难度数据库 (简化版)
    const wordLevels = {
      // A1 (初级) 常见单词
      "a": "A1", "about": "A1", "above": "A1", "across": "A1", "act": "A1", "active": "A1",
      "activity": "A1", "add": "A1", "afraid": "A1", "after": "A1", "again": "A1", "age": "A1",
      
      // A2 (初级) 单词
      "ability": "A2", "able": "A2", "abroad": "A2", "accept": "A2", "accident": "A2", "account": "A2",
      
      // B1 (中级) 单词
      "abandon": "B1", "ability": "B1", "abroad": "B1", "absence": "B1", "absolute": "B1", "absolutely": "B1",
      
      // B2 (中级) 单词
      "abstract": "B2", "absurd": "B2", "abundance": "B2", "abundant": "B2", "abuse": "B2", "academic": "B2",
      
      // C1 (高级) 单词
      "abdicate": "C1", "aberration": "C1", "abhorrent": "C1", "abide": "C1", "abiding": "C1", "abject": "C1",
      
      // C2 (高级) 单词
      "abase": "C2", "abash": "C2", "abate": "C2", "abbess": "C2", "abbey": "C2", "abbot": "C2"
    };
    
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
    let userLevel = "A1"; // 默认级别
    
    // 简单算法：根据最高级别的单词数量确定用户级别
    if (levelCounts["C2"] > 0) userLevel = "C2";
    else if (levelCounts["C1"] > 0) userLevel = "C1";
    else if (levelCounts["B2"] > 0) userLevel = "B2";
    else if (levelCounts["B1"] > 0) userLevel = "B1";
    else if (levelCounts["A2"] > 0) userLevel = "A2";
    
    // 计算进度百分比
    const levelValues = {
      "A1": 16.7,
      "A2": 33.3,
      "B1": 50,
      "B2": 66.7,
      "C1": 83.3,
      "C2": 100
    };
    
    const progressPercentage = levelValues[userLevel] || 0;
    
    // 估计词汇量
    const cefrVocabEstimates = {
      "A1": 500,
      "A2": 1000,
      "B1": 2000,
      "B2": 4000,
      "C1": 8000,
      "C2": 16000
    };
    
    const vocabEstimate = cefrVocabEstimates[userLevel];
    
    // 构建响应结果
    const result = {
      cefrLevel: userLevel,
      progressPercentage: progressPercentage,
      vocabEstimate: vocabEstimate,
      levelCounts: levelCounts
    };
    
    console.log('返回评估结果:', result);
    
    // 返回评估结果
    res.status(200).json(result);
    
  } catch (error) {
    console.error('评估水平时出错:', error);
    res.status(500).json({ error: '服务器内部错误', message: error.message });
  }
};
