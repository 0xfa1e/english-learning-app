// pages/index.js
import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  useEffect(() => {
    // 动态导入应用脚本
    const loadScripts = async () => {
      try {
        // 等待DOM加载完成
        await new Promise(resolve => {
          if (document.readyState === 'complete') {
            resolve();
          } else {
            window.addEventListener('load', resolve);
          }
        });
        
        // 加载Tesseract.js
        const tesseractScript = document.createElement('script');
        tesseractScript.src = 'https://unpkg.com/tesseract.js@v2.1.0/dist/tesseract.min.js';
        document.head.appendChild(tesseractScript);
        
        // 等待Tesseract加载
        await new Promise(resolve => {
          tesseractScript.onload = resolve;
        });
        
        // 加载应用脚本
        const scripts = [
          '/js/app.js',
          '/js/imageProcessor.js',
          '/js/levelAssessor.js',
          '/js/articleGenerator.js',
          '/js/speechHandler.js',
          '/js/pronunciationEvaluator.js',
          '/js/init.js'  // 添加初始化脚本
        ];
        
        for (const src of scripts) {
          const script = document.createElement('script');
          script.src = src;
          await new Promise(resolve => {
            script.onload = resolve;
            document.body.appendChild(script);
          });
        }
        
        // 手动初始化应用
        if (typeof window.initApp === 'function') {
          console.log('调用initApp函数');
          window.initApp();
        } else {
          console.error('initApp函数未找到，可能脚本未正确加载');
        }
      } catch (error) {
        console.error('加载脚本时出错:', error);
      }
    };
    
    loadScripts();
  }, []);
  
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>英语学习助手</title>
        <link rel="stylesheet" href="/css/style.css" />
        <base href="/" />
      </Head>
      
      <div className="container">
        <header>
          <h1>英语学习助手</h1>
          <p>通过单词学习、文章生成和跟读练习提升英语水平</p>
        </header>

        <main>
          <section id="input-section" className="card">
            <h2>输入单词</h2>
            <div className="tabs">
              <button className="tab-btn active" data-tab="text-input">文本输入</button>
              <button className="tab-btn" data-tab="photo-input">拍照输入</button>
            </div>
            
            <div id="text-input" className="tab-content active">
              <textarea id="word-input" placeholder="请输入英文单词，每行一个或用空格分隔"></textarea>
              <button id="process-text-btn" className="primary-btn">分析单词</button>
            </div>
            
            <div id="photo-input" className="tab-content">
              <div className="camera-container">
                <video id="camera-preview" autoPlay playsInline></video>
                <canvas id="photo-canvas" style={{display: 'none'}}></canvas>
                <div className="camera-controls">
                  <button id="take-photo-btn" className="primary-btn">拍照</button>
                  <button id="retry-photo-btn" className="secondary-btn" style={{display: 'none'}}>重拍</button>
                </div>
              </div>
              <div className="file-upload">
                <p>或者上传图片：</p>
                <input type="file" id="image-upload" accept="image/*" />
              </div>
              <div id="ocr-result-container" style={{display: 'none'}}>
                <h3>识别结果</h3>
                <textarea id="ocr-result" placeholder="识别的单词将显示在这里，您可以编辑"></textarea>
                <button id="process-ocr-btn" className="primary-btn">分析单词</button>
              </div>
              <div id="ocr-loading" style={{display: 'none'}}>
                <p>正在识别图片中的文字，请稍候...</p>
                <div className="loader"></div>
              </div>
            </div>
          </section>

          <section id="level-section" className="card" style={{display: 'none'}}>
            <h2>英语水平评估</h2>
            <div className="level-display">
              <div className="level-indicator">
                <div className="level-bar">
                  <div id="level-progress" className="level-progress"></div>
                </div>
                <div className="level-labels">
                  <span>初级</span>
                  <span>中级</span>
                  <span>高级</span>
                </div>
              </div>
              <div className="level-details">
                <p>CEFR级别: <span id="cefr-level">-</span></p>
                <p>词汇量估计: <span id="vocab-estimate">-</span> 词</p>
              </div>
            </div>
            <button id="generate-article-btn" className="primary-btn">生成学习文章</button>
          </section>

          <section id="article-section" className="card" style={{display: 'none'}}>
            <h2>学习文章</h2>
            <div id="article-content" className="article-content"></div>
            <div className="article-controls">
              <button id="read-article-btn" className="primary-btn">朗读全文</button>
              <button id="stop-reading-btn" className="secondary-btn" style={{display: 'none'}}>停止朗读</button>
            </div>
          </section>

          <section id="practice-section" className="card" style={{display: 'none'}}>
            <h2>跟读练习</h2>
            <p>请点击"开始跟读"按钮，然后朗读上方的文章</p>
            <div className="practice-controls">
              <button id="start-practice-btn" className="primary-btn">开始跟读</button>
              <button id="stop-practice-btn" className="secondary-btn" style={{display: 'none'}}>停止跟读</button>
            </div>
            <div id="recording-indicator" style={{display: 'none'}}>
              <p>正在录音...</p>
              <div className="recording-animation"></div>
            </div>
          </section>

          <section id="score-section" className="card" style={{display: 'none'}}>
            <h2>跟读评分</h2>
            <div className="score-display">
              <div className="score-circle">
                <span id="pronunciation-score">-</span>
              </div>
              <p>发音评分</p>
            </div>
            <div id="problem-words-container">
              <h3>需要改进的单词</h3>
              <ul id="problem-words-list"></ul>
            </div>
            <div id="improvement-suggestions">
              <h3>改进建议</h3>
              <p id="suggestions-text"></p>
            </div>
            <button id="retry-practice-btn" className="primary-btn">重新练习</button>
          </section>
        </main>

        <footer>
          <p>© 2025 英语学习助手 | 使用Web Speech API和Tesseract.js</p>
        </footer>
      </div>
    </>
  );
}
