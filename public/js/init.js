// 初始化脚本 - 专门用于初始化事件监听器
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM已加载，初始化事件监听器');
  
  // 确保在DOM加载完成后绑定事件
  setTimeout(function() {
    initEventListeners();
  }, 500);
});

// 初始化所有事件监听器
function initEventListeners() {
  console.log('初始化所有事件监听器');
  
  // 分析单词按钮
  const processTextBtn = document.getElementById('process-text-btn');
  if (processTextBtn) {
    console.log('找到分析单词按钮，添加点击事件');
    processTextBtn.addEventListener('click', function() {
      console.log('分析单词按钮被点击');
      const wordInput = document.getElementById('word-input').value.trim();
      if (wordInput) {
        console.log('处理单词:', wordInput);
        if (typeof window.processWords === 'function') {
          window.processWords(wordInput.split(/[\n\s,]+/).filter(word => word));
        } else {
          console.error('processWords函数未找到');
          alert('系统错误：处理函数未找到');
        }
      } else {
        alert('请输入至少一个单词');
      }
    });
  } else {
    console.error('未找到分析单词按钮');
  }
  
  // 生成文章按钮
  const generateArticleBtn = document.getElementById('generate-article-btn');
  if (generateArticleBtn) {
    console.log('找到生成文章按钮，添加点击事件');
    generateArticleBtn.addEventListener('click', function() {
      console.log('生成文章按钮被点击');
      if (typeof window.generateArticle === 'function') {
        window.generateArticle();
      } else {
        console.error('generateArticle函数未找到');
        alert('系统错误：生成文章函数未找到');
      }
    });
  }
  
  // 拍照按钮
  const takePhotoBtn = document.getElementById('take-photo-btn');
  if (takePhotoBtn && typeof window.takePhoto === 'function') {
    takePhotoBtn.addEventListener('click', window.takePhoto);
  }
  
  // 重拍按钮
  const retryPhotoBtn = document.getElementById('retry-photo-btn');
  if (retryPhotoBtn && typeof window.resetCamera === 'function') {
    retryPhotoBtn.addEventListener('click', window.resetCamera);
  }
  
  // 图片上传
  const imageUpload = document.getElementById('image-upload');
  if (imageUpload && typeof window.processImage === 'function') {
    imageUpload.addEventListener('change', function(e) {
      if (e.target.files && e.target.files[0]) {
        window.processImage(e.target.files[0]);
      }
    });
  }
  
  // OCR结果处理
  const processOcrBtn = document.getElementById('process-ocr-btn');
  if (processOcrBtn && typeof window.processWords === 'function') {
    processOcrBtn.addEventListener('click', function() {
      const ocrResult = document.getElementById('ocr-result').value.trim();
      if (ocrResult) {
        window.processWords(ocrResult.split(/[\n\s,]+/).filter(word => word));
      } else {
        alert('请确保OCR结果中包含至少一个单词');
      }
    });
  }
  
  // 朗读文章按钮
  const readArticleBtn = document.getElementById('read-article-btn');
  const stopReadingBtn = document.getElementById('stop-reading-btn');
  
  if (readArticleBtn && typeof window.readArticle === 'function') {
    readArticleBtn.addEventListener('click', function() {
      window.readArticle();
      readArticleBtn.style.display = 'none';
      stopReadingBtn.style.display = 'inline-block';
    });
  }
  
  if (stopReadingBtn && typeof window.stopReading === 'function') {
    stopReadingBtn.addEventListener('click', function() {
      window.stopReading();
      stopReadingBtn.style.display = 'none';
      readArticleBtn.style.display = 'inline-block';
    });
  }
  
  // 跟读练习按钮
  const startPracticeBtn = document.getElementById('start-practice-btn');
  const stopPracticeBtn = document.getElementById('stop-practice-btn');
  
  if (startPracticeBtn && typeof window.startPractice === 'function') {
    startPracticeBtn.addEventListener('click', function() {
      window.startPractice();
      startPracticeBtn.style.display = 'none';
      stopPracticeBtn.style.display = 'inline-block';
      document.getElementById('recording-indicator').style.display = 'block';
    });
  }
  
  if (stopPracticeBtn && typeof window.stopPractice === 'function') {
    stopPracticeBtn.addEventListener('click', function() {
      window.stopPractice();
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
  
  // 标签页切换
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
  
  console.log('所有事件监听器初始化完成');
}
