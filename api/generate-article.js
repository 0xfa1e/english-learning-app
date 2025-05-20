// 文章生成API
module.exports = (req, res) => {
  try {
    // 允许跨域请求
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
    
    // 获取请求体中的数据
    const { words, level } = req.body;
    
    if (!words || !level) {
      return res.status(400).json({ error: '缺少必要参数' });
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
    replacements.word2 = words[1] || "practice";
    replacements.word3 = words[2] || "learning";
    
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
    
    // 返回生成的文章
    res.status(200).json({ content });
    
  } catch (error) {
    console.error('生成文章时出错:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};
