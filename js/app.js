// 主应用逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化应用
    initApp();
});

function initApp() {
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
    // 文本输入处理
    const processTextBtn = document.getElementById('process-text-btn');
    if (processTextBtn) {
        processTextBtn.addEventListener('click', function() {
            const wordInput = document.getElementById('word-input').value.trim();
            if (wordInput) {
                processWords(wordInput.split(/[\n\s,]+/).filter(word => word));
            } else {
                alert('请输入至少一个单词');
            }
        });
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
    
    try {
        // 调用水平评估API
        const response = await fetch('/api/assess-level', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ words }),
        });
        
        if (!response.ok) {
            throw new Error('水平评估API请求失败');
        }
        
        const levelResult = await response.json();
        
        // 显示水平评估结果
        displayLevelResult(levelResult);
        
        // 存储单词列表供后续使用
        window.userWords = words;
    } catch (error) {
        console.error('处理单词时出错:', error);
        alert('评估水平时出错，请重试');
        
        // 如果API调用失败，回退到本地评估
        const levelResult = {
            cefrLevel: "A2",
            progressPercentage: 33.3,
            vocabEstimate: 1000
        };
        
        displayLevelResult(levelResult);
        window.userWords = words;
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
    
    try {
        // 调用文章生成API
        const response = await fetch('/api/generate-article', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                words: window.userWords,
                level: cefrLevel
            }),
        });
        
        if (!response.ok) {
            throw new Error('文章生成API请求失败');
        }
        
        const article = await response.json();
        
        // 显示生成的文章
        displayArticle(article);
    } catch (error) {
        console.error('生成文章时出错:', error);
        alert('生成文章时出错，请重试');
        
        // 如果API调用失败，回退到本地生成
        const article = {
            content: "This is a sample article containing your words. " +
                     "It's generated locally because the API call failed. " +
                     "Please try again later."
        };
        
        displayArticle(article);
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
