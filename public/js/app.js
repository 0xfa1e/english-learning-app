// 主应用逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
});

function initApp() {
    console.log('初始化应用...');
    // 初始化标签页切换
    initTabs();
    
    // 初始化按钮事件
    initButtonEvents();
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有标签页和内容的活动状态
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // 添加当前标签页和内容的活动状态
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

function initButtonEvents() {
    console.log('初始化按钮事件...');
    // 文本输入处理
    const processTextBtn = document.getElementById('process-text-btn');
    if (processTextBtn) {
        console.log('找到分析单词按钮，添加点击事件');
        processTextBtn.addEventListener('click', function() {
            console.log('分析单词按钮被点击');
            const wordInput = document.getElementById('word-input').value.trim();
            if (wordInput) {
                console.log('处理单词:', wordInput);
                processWords(wordInput.split(/[\n\s,]+/).filter(word => word));
            } else {
                alert('请输入至少一个单词');
            }
        });
    } else {
        console.error('未找到分析单词按钮');
    }
    
    // 拍照按钮
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const retryPhotoBtn = document.getElementById('retry-photo-btn');
    
    if (takePhotoBtn) {
        takePhotoBtn.addEventListener('click', function() {
            takePhoto();
        });
    }
    
    if (retryPhotoBtn) {
        retryPhotoBtn.addEventListener('click', function() {
            resetCamera();
        });
    }
    
    // 图片上传
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            if (e.target.files && e.target.files[0]) {
                processImage(e.target.files[0]);
            }
        });
    }
    
    // OCR结果处理
    const processOcrBtn = document.getElementById('process-ocr-btn');
    if (processOcrBtn) {
        processOcrBtn.addEventListener('click', function() {
            const ocrResult = document.getElementById('ocr-result').value.trim();
            if (ocrResult) {
                processWords(ocrResult.split(/[\n\s,]+/).filter(word => word));
            } else {
                alert('请确保OCR结果中包含至少一个单词');
            }
        });
    }
    
    // 生成文章按钮
    const generateArticleBtn = document.getElementById('generate-article-btn');
    if (generateArticleBtn) {
        generateArticleBtn.addEventListener('click', function() {
            generateArticle();
        });
    }
    
    // 朗读文章按钮
    const readArticleBtn = document.getElementById('read-article-btn');
    const stopReadingBtn = document.getElementById('stop-reading-btn');
    
    if (readArticleBtn) {
        readArticleBtn.addEventListener('click', function() {
            readArticle();
            readArticleBtn.style.display = 'none';
            stopReadingBtn.style.display = 'inline-block';
        });
    }
    
    if (stopReadingBtn) {
        stopReadingBtn.addEventListener('click', function() {
            stopReading();
            stopReadingBtn.style.display = 'none';
            readArticleBtn.style.display = 'inline-block';
        });
    }
    
    // 跟读练习按钮
    const startPracticeBtn = document.getElementById('start-practice-btn');
    const stopPracticeBtn = document.getElementById('stop-practice-btn');
    
    if (startPracticeBtn) {
        startPracticeBtn.addEventListener('click', function() {
            startPractice();
            startPracticeBtn.style.display = 'none';
            stopPracticeBtn.style.display = 'inline-block';
            document.getElementById('recording-indicator').style.display = 'block';
        });
    }
    
    if (stopPracticeBtn) {
        stopPracticeBtn.addEventListener('click', function() {
            stopPractice();
            stopPracticeBtn.style.display = 'none';
            startPracticeBtn.style.display = 'inline-block';
            document.getElementById('recording-indicator').style.display = 'none';
        });
    }
    
    // 重新练习按钮
    const retryPracticeBtn = document.getElementById('retry-practice-btn');
    if (retryPracticeBtn) {
        retryPracticeBtn.addEventListener('click', function() {
            document.getElementById('score-section').style.display = 'none';
            document.getElementById('practice-section').style.display = 'block';
        });
    }
}

// 处理单词列表
async function processWords(words) {
    console.log('处理单词列表:', words);
    
    // 检查是否在本地环境（通过检查URL判断）
    const isLocalEnvironment = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1';
    
    if (isLocalEnvironment) {
        // 本地环境，使用本地函数
        try {
            // 确保assessLevel函数可用
            if (typeof window.assessLevel === 'function') {
                const levelResult = window.assessLevel(words);
                displayLevelResult(levelResult);
                window.userWords = words;
                return;
            } else {
                console.error('本地assessLevel函数未找到，尝试使用内部实现');
                // 简单的内部实现
                const levelResult = {
                    cefrLevel: words.length > 10 ? "B1" : "A2",
                    progressPercentage: words.length > 10 ? 50 : 33.3,
                    vocabEstimate: words.length * 100 + 500
                };
                displayLevelResult(levelResult);
                window.userWords = words;
                return;
            }
        } catch (e) {
            console.error('本地函数调用失败，尝试API调用', e);
        }
    }
    
    // API调用
    try {
        console.log('正在调用API:', '/api/assess-level');
        console.log('发送数据:', { words });
        
        // 获取当前域名，用于构建API URL
        const apiBaseUrl = window.location.origin;
        const apiUrl = `${apiBaseUrl}/api/assess-level`;
        
        console.log('完整API URL:', apiUrl);
        
        // 尝试使用GET请求，因为POST可能被拒绝
        const queryParams = encodeURIComponent(JSON.stringify({ words }));
        const getUrl = `${apiUrl}?data=${queryParams}`;
        
        console.log('尝试GET请求:', getUrl);
        
        // 首先尝试GET请求
        try {
            const response = await fetch(getUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                const levelResult = await response.json();
                console.log('GET API响应成功:', levelResult);
                
                // 显示水平评估结果
                displayLevelResult(levelResult);
                
                // 存储单词列表供后续使用
                window.userWords = words;
                return;
            } else {
                console.log('GET请求失败，尝试POST请求');
                throw new Error('GET请求失败');
            }
        } catch (getError) {
            console.error('GET请求出错，尝试POST请求:', getError);
        }
        
        // 如果GET失败，尝试POST请求
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ words }),
            mode: 'cors',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            throw new Error(`API请求失败: ${response.status} ${errorText}`);
        }
        
        const levelResult = await response.json();
        console.log('API响应成功:', levelResult);
        
        // 显示水平评估结果
        displayLevelResult(levelResult);
        
        // 存储单词列表供后续使用
        window.userWords = words;
    } catch (error) {
        console.error('处理单词时出错:', error);
        alert('评估水平时出错，使用本地评估');
        
        // 如果API调用失败，使用更智能的回退逻辑
        if (!window.userWords && words && words.length > 0) {
            window.userWords = words;
        }
        
        const fallbackLevelResult = {
            cefrLevel: words.length > 10 ? "B1" : "A2",
            progressPercentage: words.length > 10 ? 50 : 33.3,
            vocabEstimate: words.length * 100 + 500
        };
        
        displayLevelResult(fallbackLevelResult);
    }
}

// 显示水平评估结果
function displayLevelResult(levelResult) {
    // 显示水平评估部分
    document.getElementById('level-section').style.display = 'block';
    
    // 更新进度条
    const levelProgress = document.getElementById('level-progress');
    levelProgress.style.width = `${levelResult.progressPercentage}%`;
    
    // 更新CEFR级别和词汇量
    document.getElementById('cefr-level').textContent = levelResult.cefrLevel;
    document.getElementById('vocab-estimate').textContent = levelResult.vocabEstimate;
    
    // 滚动到水平评估部分
    document.getElementById('level-section').scrollIntoView({ behavior: 'smooth' });
}

// 生成文章
async function generateArticle() {
    if (!window.userWords || window.userWords.length === 0) {
        alert('没有可用的单词列表');
        return;
    }
    
    // 获取用户水平
    const cefrLevel = document.getElementById('cefr-level').textContent;
    
    // 检查是否在本地环境（通过检查URL判断）
    const isLocalEnvironment = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1';
    
    if (isLocalEnvironment) {
        // 本地环境，使用本地函数
        try {
            // 确保generateArticleContent函数可用
            if (typeof window.generateArticleContent === 'function') {
                const article = window.generateArticleContent(window.userWords, cefrLevel);
                displayArticle(article);
                return;
            } else {
                console.error('本地generateArticleContent函数未找到，使用简单实现');
                // 简单的内部实现
                const simpleArticle = {
                    content: `Here is a simple article about ${window.userWords.join(', ')}. ` +
                             `These words are important for learning English at the ${cefrLevel} level. ` +
                             `Practice using these words in sentences to improve your vocabulary.`
                };
                displayArticle(simpleArticle);
                return;
            }
        } catch (e) {
            console.error('本地函数调用失败，尝试API调用', e);
        }
    }
    
    // API调用
    try {
        console.log('正在调用API:', '/api/generate-article');
        console.log('发送数据:', { words: window.userWords, level: cefrLevel });
        
        // 获取当前域名，用于构建API URL
        const apiBaseUrl = window.location.origin;
        const apiUrl = `${apiBaseUrl}/api/generate-article`;
        
        console.log('完整API URL:', apiUrl);
        
        // 尝试使用GET请求，因为POST可能被拒绝
        const queryParams = encodeURIComponent(JSON.stringify({ 
            words: window.userWords, 
            level: cefrLevel 
        }));
        const getUrl = `${apiUrl}?data=${queryParams}`;
        
        console.log('尝试GET请求:', getUrl);
        
        // 首先尝试GET请求
        try {
            const response = await fetch(getUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
                mode: 'cors',
                credentials: 'same-origin'
            });
            
            if (response.ok) {
                const article = await response.json();
                console.log('GET API响应成功:', article);
                
                // 显示生成的文章
                displayArticle(article);
                return;
            } else {
                console.log('GET请求失败，尝试POST请求');
                throw new Error('GET请求失败');
            }
        } catch (getError) {
            console.error('GET请求出错，尝试POST请求:', getError);
        }
        
        // 如果GET失败，尝试POST请求
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                words: window.userWords,
                level: cefrLevel
            }),
            mode: 'cors',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            throw new Error(`API请求失败: ${response.status} ${errorText}`);
        }
        
        const article = await response.json();
        console.log('API响应成功:', article);
        
        // 显示生成的文章
        displayArticle(article);
    } catch (error) {
        console.error('生成文章时出错:', error);
        alert('生成文章时出错，使用本地生成');
        
        // 如果API调用失败，生成一个简单的文章
        const simpleArticle = {
            content: `Here is a simple article about ${window.userWords.join(', ')}. ` +
                     `These words are important for learning English at the ${cefrLevel} level. ` +
                     `Practice using these words in sentences to improve your vocabulary.`
        };
        
        displayArticle(simpleArticle);
    }
}

// 显示生成的文章
function displayArticle(article) {
    // 显示文章部分
    document.getElementById('article-section').style.display = 'block';
    
    // 更新文章内容，高亮用户输入的单词
    const articleContent = document.getElementById('article-content');
    articleContent.innerHTML = highlightWords(article.content, window.userWords);
    
    // 存储原始文章内容供后续使用
    window.articleText = article.content;
    
    // 显示练习部分
    document.getElementById('practice-section').style.display = 'block';
    
    // 滚动到文章部分
    document.getElementById('article-section').scrollIntoView({ behavior: 'smooth' });
}

// 高亮文章中的单词
function highlightWords(text, words) {
    let highlightedText = text;
    
    // 为每个单词创建正则表达式并替换为高亮版本
    words.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, `<span class="highlight">$&</span>`);
    });
    
    return highlightedText;
}

// 应用状态管理
window.appState = {
    words: [],
    level: null,
    article: null,
    isRecording: false,
    isReading: false
};

// 确保关键函数可以全局访问 - 移到文件底部
window.initApp = initApp;
window.processWords = processWords;
window.displayLevelResult = displayLevelResult;
window.generateArticle = generateArticle;
window.displayArticle = displayArticle;
window.highlightWords = highlightWords;

// 处理单词列表
async function processWords(words) {
    console.log('处理单词列表:', words);
    
    // 检查是否在本地环境（通过检查URL判断）
    const isLocalEnvironment = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1';
    
    if (isLocalEnvironment) {
        // 本地环境，使用本地函数
        try {
            // 确保assessLevel函数可用
            if (typeof assessLevel === 'function') {
                const levelResult = assessLevel(words);
                displayLevelResult(levelResult);
                window.userWords = words;
                return;
            }
        } catch (e) {
            console.error('本地函数调用失败，尝试API调用', e);
        }
    }
    
    // API调用
    try {
        console.log('正在调用API:', '/api/assess-level');
        console.log('发送数据:', { words });
        
        // 获取当前域名，用于构建API URL
        const apiBaseUrl = window.location.origin;
        const apiUrl = `${apiBaseUrl}/api/assess-level`;
        
        console.log('完整API URL:', apiUrl);
        
        // 调用水平评估API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ words }),
            // 添加这些选项以确保正确处理跨域请求
            mode: 'cors',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            throw new Error(`API请求失败: ${response.status} ${errorText}`);
        }
        
        const levelResult = await response.json();
        console.log('API响应成功:', levelResult);
        
        // 显示水平评估结果
        displayLevelResult(levelResult);
        
        // 存储单词列表供后续使用
        window.userWords = words;
    } catch (error) {
        console.error('处理单词时出错:', error);
        alert('评估水平时出错，请重试');
        
        // 如果API调用失败，使用更智能的回退逻辑
        if (!window.userWords && words && words.length > 0) {
            window.userWords = words;
        }
        
        const fallbackLevelResult = {
            cefrLevel: words.length > 10 ? "B1" : "A2",
            progressPercentage: words.length > 10 ? 50 : 33.3,
            vocabEstimate: words.length * 100 + 500
        };
        
        displayLevelResult(fallbackLevelResult);
    }
}

// 显示水平评估结果
function displayLevelResult(levelResult) {
    // 显示水平评估部分
    document.getElementById('level-section').style.display = 'block';
    
    // 更新进度条
    const levelProgress = document.getElementById('level-progress');
    levelProgress.style.width = `${levelResult.progressPercentage}%`;
    
    // 更新CEFR级别和词汇量
    document.getElementById('cefr-level').textContent = levelResult.cefrLevel;
    document.getElementById('vocab-estimate').textContent = levelResult.vocabEstimate;
    
    // 滚动到水平评估部分
    document.getElementById('level-section').scrollIntoView({ behavior: 'smooth' });
}

// 生成文章
async function generateArticle() {
    if (!window.userWords || window.userWords.length === 0) {
        alert('没有可用的单词列表');
        return;
    }
    
    // 获取用户水平
    const cefrLevel = document.getElementById('cefr-level').textContent;
    
    // 检查是否在本地环境（通过检查URL判断）
    const isLocalEnvironment = window.location.hostname === 'localhost' || 
                              window.location.hostname === '127.0.0.1';
    
    if (isLocalEnvironment) {
        // 本地环境，使用本地函数
        try {
            // 确保generateArticleContent函数可用
            if (typeof generateArticleContent === 'function') {
                const article = generateArticleContent(window.userWords, cefrLevel);
                displayArticle(article);
                return;
            }
        } catch (e) {
            console.error('本地函数调用失败，尝试API调用', e);
        }
    }
    
    // API调用
    try {
        console.log('正在调用API:', '/api/generate-article');
        console.log('发送数据:', { words: window.userWords, level: cefrLevel });
        
        // 获取当前域名，用于构建API URL
        const apiBaseUrl = window.location.origin;
        const apiUrl = `${apiBaseUrl}/api/generate-article`;
        
        console.log('完整API URL:', apiUrl);
        
        // 调用文章生成API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                words: window.userWords,
                level: cefrLevel
            }),
            // 添加这些选项以确保正确处理跨域请求
            mode: 'cors',
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API响应错误:', response.status, errorText);
            throw new Error(`API请求失败: ${response.status} ${errorText}`);
        }
        
        const article = await response.json();
        console.log('API响应成功:', article);
        
        // 显示生成的文章
        displayArticle(article);
    } catch (error) {
        console.error('生成文章时出错:', error);
        alert('生成文章时出错，请重试');
        
        // 如果API调用失败，生成一个简单的文章
        const simpleArticle = {
            content: `Here is a simple article about ${window.userWords.join(', ')}. ` +
                     `These words are important for learning English at the ${cefrLevel} level. ` +
                     `Practice using these words in sentences to improve your vocabulary.`
        };
        
        displayArticle(simpleArticle);
    }
}

// 显示生成的文章
function displayArticle(article) {
    // 显示文章部分
    document.getElementById('article-section').style.display = 'block';
    
    // 更新文章内容，高亮用户输入的单词
    const articleContent = document.getElementById('article-content');
    articleContent.innerHTML = highlightWords(article.content, window.userWords);
    
    // 存储原始文章内容供后续使用
    window.articleText = article.content;
    
    // 显示练习部分
    document.getElementById('practice-section').style.display = 'block';
    
    // 滚动到文章部分
    document.getElementById('article-section').scrollIntoView({ behavior: 'smooth' });
}

// 高亮文章中的单词
function highlightWords(text, words) {
    let highlightedText = text;
    
    // 为每个单词创建正则表达式并替换为高亮版本
    words.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, `<span class="highlight">$&</span>`);
    });
    
    return highlightedText;
}

// 应用状态管理
window.appState = {
    words: [],
    level: null,
    article: null,
    isRecording: false,
    isReading: false
};
