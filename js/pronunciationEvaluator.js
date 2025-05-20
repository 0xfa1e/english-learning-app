// 发音评估模块 - 负责评估用户跟读发音

// 评估用户发音
function evaluatePronunciation(userSpeech, originalText) {
    console.log('评估发音...');
    console.log('用户跟读:', userSpeech);
    console.log('原文:', originalText);
    
    // 在实际应用中，这里应该调用专业的语音评估API
    // 由于这是演示版本，我们使用简单的文本相似度比较来模拟评分
    
    // 清理和标准化文本
    const cleanUserSpeech = cleanText(userSpeech);
    const cleanOriginalText = cleanText(originalText);
    
    // 计算文本相似度得分
    const similarityScore = calculateTextSimilarity(cleanUserSpeech, cleanOriginalText);
    
    // 识别问题单词
    const problemWords = identifyProblemWords(cleanUserSpeech, cleanOriginalText);
    
    // 生成改进建议
    const suggestions = generateSuggestions(problemWords);
    
    // 显示评分结果
    displayPronunciationScore(similarityScore, problemWords, suggestions);
}

// 清理和标准化文本
function cleanText(text) {
    return text.toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // 移除标点符号
        .replace(/\s{2,}/g, ' ') // 将多个空格替换为单个空格
        .trim();
}

// 计算文本相似度得分
function calculateTextSimilarity(text1, text2) {
    // 将文本分割为单词
    const words1 = text1.split(' ');
    const words2 = text2.split(' ');
    
    // 计算共同单词数量
    const commonWords = words1.filter(word => words2.includes(word));
    
    // 计算相似度得分 (0-100)
    let similarityScore = Math.round((commonWords.length / Math.max(words1.length, words2.length)) * 100);
    
    // 调整得分，使其更合理
    // 在实际应用中，这里应该使用更复杂的算法
    if (similarityScore < 20) {
        similarityScore = Math.floor(Math.random() * 20) + 20; // 20-40
    } else if (similarityScore > 90) {
        similarityScore = Math.min(similarityScore, 98); // 最高98分
    }
    
    return similarityScore;
}

// 识别问题单词
function identifyProblemWords(userSpeech, originalText) {
    // 将文本分割为单词
    const userWords = userSpeech.split(' ');
    const originalWords = originalText.split(' ');
    
    // 在实际应用中，这里应该使用更复杂的算法来识别发音问题
    // 这里我们简单地选择一些用户没有说出的单词作为问题单词
    
    // 找出原文中但用户没有说出的单词
    const missingWords = originalWords.filter(word => 
        word.length > 3 && !userWords.includes(word)
    );
    
    // 随机选择一些单词作为"问题单词"
    const problemWords = [];
    const maxProblemWords = Math.min(5, Math.ceil(originalWords.length * 0.1)); // 最多5个或原文10%的单词
    
    if (missingWords.length > 0) {
        // 如果有缺失的单词，优先选择这些
        for (let i = 0; i < Math.min(maxProblemWords, missingWords.length); i++) {
            const randomIndex = Math.floor(Math.random() * missingWords.length);
            const word = missingWords.splice(randomIndex, 1)[0];
            if (word && word.length > 1) {
                problemWords.push(word);
            }
        }
    }
    
    // 如果问题单词不足，从原文中随机选择一些单词补充
    while (problemWords.length < maxProblemWords) {
        const randomIndex = Math.floor(Math.random() * originalWords.length);
        const word = originalWords[randomIndex];
        if (word && word.length > 3 && !problemWords.includes(word)) {
            problemWords.push(word);
        }
    }
    
    return problemWords;
}

// 生成改进建议
function generateSuggestions(problemWords) {
    if (problemWords.length === 0) {
        return "你的发音非常好！继续保持。";
    }
    
    const suggestions = [
        "尝试放慢语速，清晰地发出每个音节。",
        "注意单词的重音位置，这对正确发音很重要。",
        "练习时可以先听标准发音，然后跟读。",
        "尝试录制自己的声音，与标准发音比较。",
        "关注元音发音，英语中的元音比辅音更难掌握。"
    ];
    
    // 随机选择2-3条建议
    const numSuggestions = Math.floor(Math.random() * 2) + 2; // 2-3
    const selectedSuggestions = [];
    
    for (let i = 0; i < numSuggestions; i++) {
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        selectedSuggestions.push(suggestions[randomIndex]);
        suggestions.splice(randomIndex, 1);
    }
    
    return selectedSuggestions.join(" ");
}

// 显示评分结果
function displayPronunciationScore(score, problemWords, suggestions) {
    // 显示评分部分
    document.getElementById('practice-section').style.display = 'none';
    document.getElementById('score-section').style.display = 'block';
    
    // 更新评分
    document.getElementById('pronunciation-score').textContent = score;
    
    // 更新问题单词列表
    const problemWordsList = document.getElementById('problem-words-list');
    problemWordsList.innerHTML = '';
    
    if (problemWords.length > 0) {
        problemWords.forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            li.addEventListener('click', function() {
                speakWord(word);
            });
            li.style.cursor = 'pointer';
            problemWordsList.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = "没有发现明显的问题单词";
        problemWordsList.appendChild(li);
    }
    
    // 更新改进建议
    document.getElementById('suggestions-text').textContent = suggestions;
    
    // 滚动到评分部分
    document.getElementById('score-section').scrollIntoView({ behavior: 'smooth' });
}
