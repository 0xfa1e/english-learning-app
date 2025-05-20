// 图像处理模块 - 负责相机操作和OCR识别

// 初始化相机
let stream = null;
let cameraInitialized = false;

// 当切换到拍照标签页时初始化相机
document.querySelector('[data-tab="photo-input"]').addEventListener('click', function() {
    if (!cameraInitialized) {
        initCamera();
    }
});

// 初始化相机
function initCamera() {
    const cameraPreview = document.getElementById('camera-preview');
    
    // 检查浏览器是否支持getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(mediaStream) {
                stream = mediaStream;
                cameraPreview.srcObject = mediaStream;
                cameraPreview.play();
                cameraInitialized = true;
            })
            .catch(function(error) {
                console.error('无法访问相机:', error);
                alert('无法访问相机，请确保已授予相机权限或使用图片上传功能。');
            });
    } else {
        console.error('浏览器不支持getUserMedia');
        alert('您的浏览器不支持相机功能，请使用图片上传功能。');
    }
}

// 拍照
function takePhoto() {
    const cameraPreview = document.getElementById('camera-preview');
    const photoCanvas = document.getElementById('photo-canvas');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const retryPhotoBtn = document.getElementById('retry-photo-btn');
    
    if (!cameraInitialized) {
        alert('相机未初始化，请刷新页面重试');
        return;
    }
    
    // 设置canvas尺寸与视频相同
    photoCanvas.width = cameraPreview.videoWidth;
    photoCanvas.height = cameraPreview.videoHeight;
    
    // 在canvas上绘制当前视频帧
    const context = photoCanvas.getContext('2d');
    context.drawImage(cameraPreview, 0, 0, photoCanvas.width, photoCanvas.height);
    
    // 显示canvas，隐藏视频
    cameraPreview.style.display = 'none';
    photoCanvas.style.display = 'block';
    
    // 更新按钮状态
    takePhotoBtn.style.display = 'none';
    retryPhotoBtn.style.display = 'inline-block';
    
    // 处理拍摄的照片
    processPhotoFromCanvas();
}

// 重置相机
function resetCamera() {
    const cameraPreview = document.getElementById('camera-preview');
    const photoCanvas = document.getElementById('photo-canvas');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const retryPhotoBtn = document.getElementById('retry-photo-btn');
    
    // 显示视频，隐藏canvas
    cameraPreview.style.display = 'block';
    photoCanvas.style.display = 'none';
    
    // 更新按钮状态
    takePhotoBtn.style.display = 'inline-block';
    retryPhotoBtn.style.display = 'none';
    
    // 隐藏OCR结果
    document.getElementById('ocr-result-container').style.display = 'none';
    document.getElementById('ocr-loading').style.display = 'none';
}

// 从Canvas处理照片
function processPhotoFromCanvas() {
    const photoCanvas = document.getElementById('photo-canvas');
    
    // 显示加载状态
    document.getElementById('ocr-loading').style.display = 'block';
    
    // 将canvas转换为图像数据
    photoCanvas.toBlob(function(blob) {
        performOCR(blob);
    }, 'image/jpeg', 0.95);
}

// 处理上传的图像
function processImage(imageFile) {
    // 显示加载状态
    document.getElementById('ocr-loading').style.display = 'block';
    
    // 执行OCR
    performOCR(imageFile);
}

// 执行OCR识别
function performOCR(imageBlob) {
    // 使用Tesseract.js进行OCR识别
    Tesseract.recognize(
        imageBlob,
        'eng',  // 英语语言
        { logger: m => console.log(m) }
    ).then(({ data: { text } }) => {
        // 处理识别结果
        handleOCRResult(text);
    }).catch(error => {
        console.error('OCR识别失败:', error);
        alert('OCR识别失败，请重试或手动输入单词');
        document.getElementById('ocr-loading').style.display = 'none';
    });
}

// 处理OCR结果
function handleOCRResult(text) {
    // 隐藏加载状态
    document.getElementById('ocr-loading').style.display = 'none';
    
    // 显示OCR结果容器
    document.getElementById('ocr-result-container').style.display = 'block';
    
    // 提取英文单词
    const words = extractEnglishWords(text);
    
    // 显示结果
    document.getElementById('ocr-result').value = words.join('\n');
    
    // 滚动到结果区域
    document.getElementById('ocr-result-container').scrollIntoView({ behavior: 'smooth' });
}

// 从文本中提取英文单词
function extractEnglishWords(text) {
    // 使用正则表达式匹配英文单词
    const matches = text.match(/[a-zA-Z]+/g);
    
    // 过滤掉太短的单词和重复单词
    const words = matches ? [...new Set(matches.filter(word => word.length > 1))] : [];
    
    return words;
}

// 停止相机流
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => {
            track.stop();
        });
        cameraInitialized = false;
    }
}
