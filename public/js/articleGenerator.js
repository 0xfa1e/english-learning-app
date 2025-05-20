// 文章生成模块 - 负责根据用户水平和单词生成文章

// 文章模板库 (按CEFR级别分类)
const articleTemplates = {
    "A1": [
        "My name is {name}. I {verb} to {place} every day. I like to {verb} and {verb}. My favorite color is {color}. I have a {noun} and a {noun}. They are very {adjective}. On weekends, I {verb} with my friends. We {verb} together and have fun. I want to learn more English words like {word1}, {word2}, and {word3}.",
        
        "This is my {noun}. It is {adjective} and {adjective}. I use it to {verb} every day. My friend has a {noun} too. We like to {verb} together. Yesterday, we went to the {place} and saw many {noun}s. They were very {adjective}. I learned new words like {word1}, {word2}, and {word3}.",
        
        "I live in a {adjective} {noun}. There are {number} rooms. In the morning, I {verb} and then I {verb}. I eat {noun} for breakfast. Then I go to {place}. I meet my friend {name}. We talk about {word1}, {word2}, and {word3}. In the evening, I go home and {verb}."
    ],
    
    "A2": [
        "Last weekend, I decided to visit the {place}. It was a {adjective} day, and I was feeling very {adjective}. When I arrived, I saw many people {verb}ing. Some were {verb}ing, while others were just {verb}ing quietly. I met a {adjective} person named {name} who taught me about {word1} and {word2}. We talked about how {word3} is important in daily life. Before leaving, I bought a {noun} as a souvenir.",
        
        "My friend {name} has an interesting hobby. Every {day}, they {verb} for at least two hours. They started {verb}ing when they were young. They have learned many skills, including how to {verb} and how to use {word1} effectively. They told me that understanding {word2} and {word3} is essential for this hobby. I think it's {adjective} and want to try it too.",
        
        "There's a {adjective} restaurant near my house that serves {adjective} food. The chef knows how to {verb} the ingredients perfectly. Last time I went there, I ordered a dish with {word1} and {word2}. The waiter explained how they use {word3} in their cooking. The atmosphere was {adjective}, and the music made everyone feel {adjective}. I plan to go there again next {day}."
    ],
    
    "B1": [
        "Recently, I've been thinking about the importance of {word1} in our society. Many experts believe that understanding {word2} can help us solve various problems. According to a study I read, people who regularly {verb} tend to have a better grasp of {word3} concepts. This makes me wonder whether we should {verb} more often in our daily routines. My colleague {name} suggested that we should organize a workshop about this topic. The workshop would cover topics such as how to {verb} effectively and the relationship between {word1} and personal development.",
        
        "The exhibition I attended last month focused on the evolution of {word1} throughout history. It was fascinating to see how {word2} has influenced cultural development in different regions. One particular display demonstrated how people used to {verb} before modern technology was available. The curator, Dr. {name}, explained that {word3} played a crucial role in shaping societal norms. After the tour, we participated in a workshop where we learned to {verb} using traditional methods. This experience gave me a new perspective on how we {verb} in contemporary society.",
        
        "Environmental scientists are increasingly concerned about the impact of {word1} on our ecosystem. Recent research indicates that {word2} levels have risen significantly over the past decade. Dr. {name}, a leading expert in the field, suggests that we need to {verb} more responsibly to mitigate these effects. Communities around the world are now implementing strategies to reduce {word3} and promote sustainable practices. Last week, I joined a local initiative where we learned to {verb} in environmentally friendly ways. It's encouraging to see how small changes in our habits can make a substantial difference."
    ],
    
    "B2": [
        "The intersection of {word1} and technology has created unprecedented opportunities for innovation. Industry analysts predict that companies investing in {word2} will likely outperform their competitors in the coming years. However, this transformation is not without challenges. The process of integrating {word3} into existing systems requires organizations to {verb} their operational frameworks substantially. During a recent conference, Dr. {name} presented a compelling case study demonstrating how businesses that successfully {verb} their approach to technological adoption experienced significant growth. The discussion afterward centered on whether traditional industries should {verb} their strategies or risk becoming obsolete in an increasingly digital marketplace.",
        
        "Cultural historians have long debated the influence of {word1} on artistic expression throughout different epochs. The Renaissance period, in particular, saw a remarkable fusion of {word2} and classical aesthetics, which fundamentally altered how artists would {verb} for centuries to come. Professor {name}'s recent publication explores how contemporary artists are reinterpreting these traditions through the lens of {word3}. The monograph argues that we must {verb} our understanding of artistic evolution to appreciate these modern interpretations fully. Critics have noted that this perspective helps us {verb} the complex relationship between historical precedent and innovation in the arts.",
        
        "The psychological impact of {word1} on cognitive development has become a focal point in educational research. Studies suggest that regular exposure to {word2} can significantly enhance how students {verb} complex problems. Dr. {name}'s longitudinal research demonstrates a strong correlation between {word3} awareness and academic performance across diverse learning environments. Educational institutions are now beginning to {verb} their curricula to incorporate these findings. However, some experts caution that we should carefully {verb} these approaches before implementing widespread changes, emphasizing the importance of contextual factors in educational outcomes."
    ],
    
    "C1": [
        "The paradigm shift in how we conceptualize {word1} has profound implications for interdisciplinary research. Contemporary scholars are increasingly challenging the conventional wisdom that {word2} exists in isolation from broader sociocultural phenomena. Dr. {name}'s groundbreaking work demonstrates how we might {verb} these seemingly disparate elements into a coherent theoretical framework. This integration necessitates that researchers {verb} beyond traditional methodological constraints and embrace more nuanced analytical approaches. The emergent discourse surrounding {word3} further complicates this intellectual landscape, introducing variables that had previously been marginalized in academic literature. As we continue to {verb} these complex interrelationships, we must remain vigilant against reductionist tendencies that oversimplify multifaceted social dynamics.",
        
        "Economic theorists have begun to reassess fundamental assumptions regarding {word1} in post-industrial economies. The prevailing orthodoxy, which has long held that markets invariably {verb} toward equilibrium, faces mounting scrutiny in light of empirical evidence suggesting that {word2} introduces significant distortions. Professor {name}'s econometric analysis reveals patterns that cannot be adequately explained through conventional models. These findings compel us to {verb} alternative frameworks that more accurately capture the complexity of contemporary financial systems. Furthermore, the increasing relevance of {word3} in global markets underscores the need for more sophisticated analytical tools. Policymakers must carefully {verb} these evolving dynamics when formulating regulatory approaches that aim to promote stability while fostering innovation.",
        
        "Advances in quantum computing have revolutionized our capacity to {verb} problems previously deemed intractable. The integration of {word1} algorithms with traditional computational methods has opened new avenues for research across multiple scientific domains. Dr. {name}'s pioneering work demonstrates how these hybrid approaches can {verb} our understanding of complex systems, from molecular interactions to cosmological phenomena. However, the implementation of {word2} protocols presents significant technical challenges that researchers continue to address through iterative refinement. The potential applications of {word3} technology extend far beyond academic contexts, with implications for industries ranging from pharmaceuticals to financial services. As we {verb} these emerging capabilities, ethical considerations regarding data security and algorithmic transparency become increasingly salient."
    ],
    
    "C2": [
        "The epistemological foundations underlying our conception of {word1} warrant rigorous reexamination in light of post-structural critiques that have systematically {verb}ed conventional paradigms. Professor {name}'s seminal deconstruction of established theoretical frameworks reveals the inherent contradictions that emerge when we attempt to {verb} universalist claims with the irreducible particularity of lived experience. This tension becomes especially pronounced when considering how {word2} functions within discursive systems that simultaneously enable and constrain the articulation of subjective positions. The resultant aporia necessitates a fundamental reconsideration of how we {verb} knowledge production across disciplinary boundaries. Furthermore, the ontological status of {word3} remains contested territory within contemporary philosophical discourse, with competing schools of thought advancing incommensurable interpretations that resist synthetic reconciliation.",
        
        "The intricate dialectic between {word1} and socioeconomic stratification manifests through institutional mechanisms that systematically {verb} access to essential resources. Critical theorists have meticulously documented how these structures perpetuate themselves through hegemonic narratives that naturalize contingent power relations. Dr. {name}'s longitudinal ethnographic research illuminates how marginalized communities strategically {verb} these constraints through counter-hegemonic practices that challenge normative assumptions. The concept of {word2} emerges as a crucial analytical category in this context, providing a theoretical framework through which we can {verb} the complex interplay between agency and structural determination. Recent scholarship has further complicated this picture by introducing {word3} as a mediating factor that reconfigures established sociopolitical dynamics in ways that demand sophisticated interpretive approaches.",
        
        "Contemporary neuroscientific research has problematized reductionist accounts of consciousness that fail to adequately {verb} the emergent properties of neural systems. The paradigmatic shift from localizationist models toward network-based approaches represents a fundamental reconceptualization of how cognitive processes are instantiated in biological substrates. Professor {name}'s innovative methodological interventions have enabled researchers to {verb} previously inaccessible dimensions of neurological functioning, revealing intricate feedback mechanisms between {word1} and higher-order cognitive operations. These findings necessitate a substantial revision of theoretical frameworks that have traditionally posited {word2} as epiphenomenal rather than constitutive of conscious experience. The integration of {word3} into experimental protocols has further enhanced our capacity to investigate the temporal dynamics of neural processing across multiple scales of organization."
    ]
};

// 替换词库
const replacementWords = {
    name: ["John", "Emma", "Michael", "Sophia", "David", "Olivia", "James", "Ava", "Robert", "Isabella"],
    verb: ["walk", "talk", "read", "write", "play", "work", "study", "learn", "teach", "help", "make", "create", "develop", "analyze", "consider", "examine", "investigate", "explore", "discover", "understand"],
    place: ["school", "park", "library", "museum", "cafe", "restaurant", "office", "home", "garden", "market", "university", "laboratory", "studio", "gallery", "theater", "conference", "symposium", "workshop"],
    color: ["red", "blue", "green", "yellow", "purple", "orange", "black", "white", "pink", "brown"],
    noun: ["book", "pen", "computer", "phone", "table", "chair", "car", "house", "tree", "flower", "concept", "theory", "framework", "methodology", "paradigm", "perspective", "approach", "strategy", "analysis", "synthesis"],
    adjective: ["big", "small", "good", "bad", "happy", "sad", "interesting", "boring", "beautiful", "ugly", "complex", "sophisticated", "nuanced", "intricate", "profound", "substantial", "significant", "innovative", "groundbreaking", "revolutionary"],
    number: ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "many"],
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "weekend"]
};

// 生成文章内容
function generateArticleContent(words, level) {
    console.log('生成文章，级别:', level, '单词:', words);
    
    // 确保有足够的单词
    if (!words || words.length < 3) {
        words = words || [];
        // 如果单词不足，从词库中随机选择一些单词补充
        while (words.length < 3) {
            const randomCategory = Object.keys(replacementWords)[Math.floor(Math.random() * Object.keys(replacementWords).length)];
            const randomWord = replacementWords[randomCategory][Math.floor(Math.random() * replacementWords[randomCategory].length)];
            if (!words.includes(randomWord)) {
                words.push(randomWord);
            }
        }
    }
    
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
    
    // 根据级别调整文章长度
    if (level === "A1" || level === "A2") {
        // 初级水平，保持简短
        return { content };
    } else if (level === "B1" || level === "B2") {
        // 中级水平，适当扩展
        const additionalSentence = `This relates to how we can ${getRandomWord('verb')} with ${getRandomWord('noun')} in our daily lives. Many people find it ${getRandomWord('adjective')} to learn about these topics.`;
        return { content: content + " " + additionalSentence };
    } else {
        // 高级水平，进一步扩展
        const additionalParagraph = `\n\nFurthermore, the relationship between ${replacements.word1} and ${replacements.word2} presents an interesting area for further exploration. As we continue to ${getRandomWord('verb')} our understanding of ${replacements.word3}, we may discover new insights that challenge our preconceptions. This process of intellectual growth requires us to ${getRandomWord('verb')} critically about established paradigms and remain open to alternative perspectives.`;
        return { content: content + additionalParagraph };
    }
}

// 从替换词库中随机获取一个词
function getRandomWord(category) {
    const options = replacementWords[category];
    return options[Math.floor(Math.random() * options.length)];
}
