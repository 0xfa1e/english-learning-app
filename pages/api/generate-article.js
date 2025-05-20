// 文章生成API
export default function handler(req, res) {
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
    
    // 支持GET和POST请求
    let words = [];
    let level = "A1";
    
    if (req.method === 'GET') {
      console.log('收到GET请求');
      // 从查询参数中获取数据
      if (req.query.data) {
        try {
          const data = JSON.parse(decodeURIComponent(req.query.data));
          words = data.words || [];
          level = data.level || "A1";
        } catch (e) {
          console.error('解析GET参数失败:', e);
        }
      }
    } else if (req.method === 'POST') {
      console.log('收到POST请求');
      // 从请求体中获取数据
      words = req.body?.words || [];
      level = req.body?.level || "A1";
    } else {
      return res.status(405).json({ error: '不支持的请求方法' });
    }
    
    // 添加调试日志
    console.log('收到文章生成API请求');
    console.log('处理的单词:', words);
    console.log('用户级别:', level);
    
    if (!Array.isArray(words) || words.length === 0) {
      console.log('请求参数错误或单词列表为空');
      return res.status(400).json({ error: '缺少必要参数或格式不正确' });
    }
    
    // 文章模板库 (简化版)
    const articleTemplates = {
      "A1": [
        "My name is {name}. I {verb} to {place} every day. I like to {verb} and {verb}. My favorite color is {color}. I have a {noun} and a {noun}. They are very {adjective}. On weekends, I {verb} with my friends. We {verb} together and have fun. I want to learn more English words like {word1}, {word2}, and {word3}."
      ],
      "A2": [
        "Last weekend, I decided to visit the {place}. It was a {adjective} day, and I was feeling very {adjective}. When I arrived, I saw many people {verb}ing. Some were {verb}ing, while others were just {verb}ing quietly. I met a {adjective} person named {name} who taught me about {word1} and {word2}. We talked about how {word3} is important in daily life."
      ],
      "B1": [
        "Recently, I've been thinking about the importance of {word1} in our society. Many experts believe that understanding {word2} can help us solve various problems. According to a study I read, people who regularly {verb} tend to have a better grasp of {word3} concepts."
      ],
      "B2": [
        "The intersection of {word1} and technology has created unprecedented opportunities for innovation. Industry analysts predict that companies investing in {word2} will likely outperform their competitors in the coming years. However, this transformation is not without challenges. The process of integrating {word3} into existing systems requires organizations to {verb} their operational frameworks substantially."
      ],
      "C1": [
        "The paradigm shift in how we conceptualize {word1} has profound implications for interdisciplinary research. Contemporary scholars are increasingly challenging the conventional wisdom that {word2} exists in isolation from broader sociocultural phenomena. The emergent discourse surrounding {word3} further complicates this intellectual landscape."
      ],
      "C2": [
        "The epistemological foundations underlying our conception of {word1} warrant rigorous reexamination in light of post-structural critiques. This tension becomes especially pronounced when considering how {word2} functions within discursive systems. Furthermore, the ontological status of {word3} remains contested territory within contemporary philosophical discourse."
      ]
    };
    
    // 替换词库 (简化版)
    const replacementWords = {
      name: ["John", "Emma", "Michael", "Sophia", "David"],
      verb: ["walk", "talk", "read", "write", "play"],
      place: ["school", "park", "library", "museum", "cafe"],
      color: ["red", "blue", "green", "yellow", "purple"],
      noun: ["book", "pen", "computer", "phone", "table"],
      adjective: ["big", "small", "good", "happy", "interesting"]
    };
    
    // 选择适合用户水平的模板
    const templates = articleTemplates[level] || articleTemplates["A1"];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // 准备替换词
    const replacements = {};
    
    // 添加用户的单词
    replacements.word1 = words[0] || "example";
    replacements.word2 = words.length > 1 ? words[1] : "practice";
    replacements.word3 = words.length > 2 ? words[2] : "learning";
    
    // 添加其他替换词
    Object.keys(replacementWords).forEach(category => {
      const options = replacementWords[category];
      replacements[category] = options[Math.floor(Math.random() * options.length)];
    });
    
    // 替换模板中的占位符
    let content = template;
    Object.keys(replacements).forEach(key => {
      const regex = new RegExp(`{${key}}`, 'g');
      content = content.replace(regex, replacements[key]);
    });
    
    // 构建响应结果
    const result = { content };
    
    console.log('返回生成的文章:', result);
    
    // 返回生成的文章
    res.status(200).json(result);
    
  } catch (error) {
    console.error('生成文章时出错:', error);
    res.status(500).json({ error: '服务器内部错误', message: error.message });
  }
}
