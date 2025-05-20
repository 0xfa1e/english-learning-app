// 语音处理模块 - 负责文章朗读和用户跟读录音

// 语音合成
let speechSynthesis = window.speechSynthesis;
let speechUtterance = null;

// 语音识别
let recognition = null;
let recordedSpeech = '';

// 初始化语音识别
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        console.error('浏览器不支持语音识别');
        alert('您的浏览器不支持语音识别功能，请使用Chrome浏览器。');
        return false;
    }
    
    // 配置语音识别
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    // 语音识别事件处理
    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        
        if (finalTranscript) {
            recordedSpeech += ' ' + finalTranscript;
            console.log('识别到的语音:', recordedSpeech);
        }
    };
    
    recognition.onerror = function(event) {
        console.error('语音识别错误:', event.error);
    };
    
    return true;
}

// 朗读文章
function readArticle() {
    if (!window.articleText) {
        alert('没有可朗读的文章');
        return;
    }
    
    // 停止之前的朗读
    stopReading();
    
    // 创建新的语音合成实例
    speechUtterance = new SpeechSynthesisUtterance(window.articleText);
    speechUtterance.lang = 'en-US';
    speechUtterance.rate = 0.9; // 稍微放慢语速
    
    // 开始朗读
    speechSynthesis.speak(speechUtterance);
    
    // 朗读结束事件
    speechUtterance.onend = function() {
        document.getElementById('read-article-btn').style.display = 'inline-block';
        document.getElementById('stop-reading-btn').style.display = 'none';
    };
}

// 停止朗读
function stopReading() {
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
}

// 开始跟读练习
function startPractice() {
    // 初始化语音识别
    if (!initSpeechRecognition()) {
        return;
    }
    
    // 重置录音内容
    recordedSpeech = '';
    
    // 开始录音
    try {
        recognition.start();
        console.log('开始录音...');
    } catch (e) {
        console.error('启动语音识别失败:', e);
        alert('启动语音识别失败，请刷新页面重试。');
    }
}

// 停止跟读练习
function stopPractice() {
    if (recognition) {
        recognition.stop();
        console.log('停止录音');
        
        // 延迟一下，确保所有识别结果都已处理
        setTimeout(() => {
            // 评估发音
            evaluatePronunciation(recordedSpeech, window.articleText);
        }, 500);
    }
}

// 朗读单个单词
function speakWord(word) {
    if (!word) return;
    
    // 停止之前的朗读
    stopReading();
    
    // 创建新的语音合成实例
    const wordUtterance = new SpeechSynthesisUtterance(word);
    wordUtterance.lang = 'en-US';
    
    // 开始朗读
    speechSynthesis.speak(wordUtterance);
}
