---
title: 周易算卦
description: 超小型算卦工具，仅供参考哦~
date: 2025-09-26
---

## 生成结果仅供参考


<!-- 周易算卦 - Shadow DOM 隔离版 -->
<div id="hexagram-widget" style="width: 100%; max-width: 600px; margin: 2rem auto; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
  <!-- Shadow DOM的内容将通过JavaScript注入到这里 -->
</div>

<script>
(() => {
  // 1. 创建模板字符串，包含所有HTML结构
  const htmlTemplate = `
    <style>
      /* 2. 所有样式都写在这里，它们只对Shadow DOM内部有效 */
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      :host {
        display: block;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background: var(--bg-color, #ffffff);
        color: var(--text-color, #333333);
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      .container {
        padding: 24px;
      }
      
      h1, h2 {
        margin: 0 0 16px;
        text-align: center;
        font-weight: 600;
      }
      
      h1 {
        font-size: 1.8rem;
        color: var(--heading-color, #1a1a1a);
      }
      
      h2 {
        font-size: 1.5rem;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--border-color, #f0f0f0);
        color: var(--heading-color, #1a1a1a);
      }
      
      .intro {
        margin-bottom: 24px;
        padding: 12px;
        background: var(--intro-bg, #f7f7f7);
        border-radius: 8px;
        font-size: 0.9rem;
        text-align: center;
        color: var(--intro-text, #666);
      }
      
      .coins {
        display: flex;
        justify-content: center;
        margin-bottom: 24px;
        gap: 16px;
      }
      
      .coin {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #f0c14b;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        user-select: none;
        transition: transform 0.2s ease;
      }
      
      .coin.tails {
        background: #e7e9ec;
        color: #111;
      }
      
      .coin.shaking {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      }
      
      @keyframes shake {
        10%, 90% { transform: translate3d(-1px, 0, 0) rotate(-3deg); }
        20%, 80% { transform: translate3d(2px, 0, 0) rotate(3deg); }
        30%, 50%, 70% { transform: translate3d(-3px, 0, 0) rotate(-5deg); }
        40%, 60% { transform: translate3d(3px, 0, 0) rotate(5deg); }
      }
      
      .buttons {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin-bottom: 24px;
      }
      
      button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      #cast-btn {
        background: var(--primary-color, #007bff);
        color: white;
      }
      
      #cast-btn:hover {
        background: var(--primary-dark, #0056b3);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
      }
      
      #cast-btn:disabled {
        background: #6c757d;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
      
      #reset-btn {
        background: var(--reset-bg, #f0f0f0);
        color: var(--reset-text, #333);
      }
      
      #reset-btn:hover {
        background: var(--reset-hover, #e0e0e0);
      }
      
      .progress {
        margin-bottom: 24px;
      }
      
      .progress-info {
        display: flex;
        justify-content: space-between;
        font-size: 0.8rem;
        margin-bottom: 6px;
        color: var(--text-secondary, #666);
      }
      
      .progress-bar-container {
        height: 10px;
        background: var(--progress-bg, #e9ecef);
        border-radius: 5px;
        overflow: hidden;
      }
      
      .progress-bar {
        height: 100%;
        width: 0%;
        background: var(--primary-color, #007bff);
        transition: width 0.3s ease;
      }
      
      .result {
        display: none;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid var(--border-color, #eee);
      }
      
      .hexagram-lines {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        margin-bottom: 20px;
      }
      
      .hexagram-line {
        font-size: 1.8rem;
        width: 100%;
        text-align: center;
        transition: all 0.3s ease;
      }
      
      .hexagram-line.changing {
        color: var(--changing-color, #d9534f);
        font-weight: bold;
        transform: scale(1.05);
      }
      
      .hexagram-name {
        text-align: center;
        font-size: 1.3rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: var(--heading-color, #1a1a1a);
      }
      
      .hexagram-text {
        text-align: center;
        font-style: italic;
        color: var(--text-secondary, #666);
        margin-bottom: 16px;
        padding: 0 12px;
      }
      
      .hexagram-interpretation {
        font-size: 0.95rem;
        line-height: 1.7;
        color: var(--text-color, #444);
        background: var(--interpretation-bg, #fafafa);
        padding: 16px;
        border-radius: 8px;
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
      }
    </style>

    <div class="container">
      <h1>周易六爻占卜</h1>
      
      <div class="intro">
        点击下方"摇一卦"按钮开始，共需摇六次。
      </div>

      <div class="coins">
        <div class="coin">🪙</div>
        <div class="coin">🪙</div>
        <div class="coin">🪙</div>
      </div>

      <div class="buttons">
        <button id="cast-btn">摇一卦</button>
        <button id="reset-btn">重新开始</button>
      </div>

      <div class="progress">
        <div class="progress-info">
          <span>进度</span>
          <span id="progress-text">0/6</span>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar" id="progress-bar"></div>
        </div>
      </div>

      <div class="result" id="hexagram-result">
        <h2>卦象结果</h2>
        <div class="hexagram-lines" id="hexagram-lines"></div>
        <div class="hexagram-name" id="hexagram-name"></div>
        <div class="hexagram-text" id="hexagram-text"></div>
        <div class="hexagram-interpretation" id="hexagram-interpretation"></div>
      </div>
    </div>
  `;

  // 3. 获取容器并创建Shadow Root
  const widgetContainer = document.getElementById('hexagram-widget');
  const shadowRoot = widgetContainer.attachShadow({ mode: 'closed' });
  
  // 4. 将HTML模板注入Shadow Root
  shadowRoot.innerHTML = htmlTemplate;
  
  // 适配Anzhiyu深浅色主题
  function applyTheme() {
    // 检测Anzhiyu主题的亮色模式判断方式
    const isAnzhiyuLight = document.documentElement.dataset.theme === "light" || document.body.classList.contains('light');
    const style = document.createElement('style');
    
    if (isAnzhiyuLight) {
      // Anzhiyu亮色模式
      style.textContent = `
        :host {
          --bg-color: #f5f5f5;
          --text-color: #333333;
          --heading-color: #1a1a1a;
          --border-color: #e0e0e0;
          --intro-bg: #eaeaea;
          --intro-text: #666666;
          --primary-color: #007bff;
          --primary-dark: #0056b3;
          --reset-bg: #ddd;
          --reset-text: #333333;
          --reset-hover: #ccc;
          --text-secondary: #666666;
          --progress-bg: #ddd;
          --changing-color: #d9534f;
          --interpretation-bg: #eaeaea;
        }
      `;
    } else {
      // Anzhiyu深色模式
      style.textContent = `
        :host {
          --bg-color: #1a1a1a;
          --text-color: #f0f0f0;
          --heading-color: #ffffff;
          --border-color: #333333;
          --intro-bg: #2d2d2d;
          --intro-text: #bbbbbb;
          --primary-color: #4dabf7;
          --primary-dark: #3b82f6;
          --reset-bg: #333333;
          --reset-text: #e0e0e0;
          --reset-hover: #444444;
          --text-secondary: #aaaaaa;
          --progress-bg: #333333;
          --changing-color: #f87171;
          --interpretation-bg: #2d2d2d;
        }
      `;
    }
    
    // 清除已有的主题样式
    const existingStyles = shadowRoot.querySelectorAll('style[data-theme]');
    existingStyles.forEach(s => s.remove());
    
    style.setAttribute('data-theme', 'true');
    shadowRoot.appendChild(style);
  }
  
  // 5. 所有JavaScript逻辑都在这里，并且元素选择器作用于shadowRoot
  // 修复首次加载问题：直接执行，不依赖DOMContentLoaded
  function initApp() {
    // 元素引用 (注意：使用 shadowRoot.querySelector)
    const coins = shadowRoot.querySelectorAll('.coin');
    const castBtn = shadowRoot.getElementById('cast-btn');
    const resetBtn = shadowRoot.getElementById('reset-btn');
    const progressBar = shadowRoot.getElementById('progress-bar');
    const progressText = shadowRoot.getElementById('progress-text');
    const hexagramResult = shadowRoot.getElementById('hexagram-result');
    const hexagramLines = shadowRoot.getElementById('hexagram-lines');
    const hexagramName = shadowRoot.getElementById('hexagram-name');
    const hexagramText = shadowRoot.getElementById('hexagram-text');
    const hexagramInterpretation = shadowRoot.getElementById('hexagram-interpretation');
    
    let currentLine = 0;
    const lines = [];
    
    // 扩展的卦象数据库（前12卦，完整版可扩展至64卦）
    const hexagrams = [
      { number: 1, name: "乾为天", text: "元亨，利贞。", interpretation: "乾卦象征天，刚健中正。预示着事情会顺利发展，充满生机与希望，但需要坚守正道。乾卦六爻皆阳，象征事物发展的六个阶段，从潜龙勿用到飞龙在天，最终亢龙有悔，提示物极必反的道理。" },
      { number: 2, name: "坤为地", text: "元亨，利牝马之贞。君子有攸往，先迷后得主，利西南得朋，东北丧朋。安贞吉。", interpretation: "坤卦象征地，柔顺厚德。预示着需要顺从形势，积蓄力量，以柔克刚，最终获得成功。坤卦强调厚德载物，包容万物，君子应效法大地，以深厚的德行承载万物。" },
      { number: 3, name: "水雷屯", text: "元亨，利贞。勿用有攸往，利建侯。", interpretation: "屯卦象征初生与困难。如同草木萌芽，充满生机但脆弱，需要耐心培养，不宜贸然行动。此卦启示我们在事物初创阶段，虽有艰难险阻，但只要坚定信念，稳步前进，终能克服困难。" },
      { number: 4, name: "山水蒙", text: "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。利贞。", interpretation: "蒙卦象征启蒙。事物处于蒙昧阶段，需要教育和引导。应虚心学习，或耐心教导他人。此卦提醒我们，无论是学习还是教导，都应保持真诚恭敬的态度，才能获得真正的智慧。" },
      { number: 5, name: "水天需", text: "有孚，光亨，贞吉。利涉大川。", interpretation: "需卦象征等待。时机尚未成熟，应耐心等待，保持诚信和中正，最终可以克服困难。等待并非消极懈怠，而是积蓄力量，审时度势，待时而动。" },
      { number: 6, name: "天水讼", text: "有孚窒惕，中吉，终凶。利见大人，不利涉大川。", interpretation: "讼卦象征争执。预示着可能会有纠纷或诉讼，即使有理也应谨慎处理，避免事态扩大。此卦提醒我们，应尽量避免争执，如无法避免，则需保持公正，寻求合理解决之道。" },
      { number: 7, name: "地水师", text: "贞，大人吉，无咎。师出以律，否臧凶。", interpretation: "师卦象征军队、战争。预示着可能面临挑战或竞争，需有严明的纪律和贤明的领导才能成功。此卦提醒我们，行事需有组织、有纪律，任用贤能，才能克服困难。" },
      { number: 8, name: "水地比", text: "吉。原筮元永贞，无咎。不宁方来，后夫凶。", interpretation: "比卦象征亲密相依，团结互助。预示着人际关系和谐，能得到他人的支持与帮助。此卦启示我们，要善于与人合作，以诚相待，才能获得良好的人际关系和事业发展。" },
      { number: 9, name: "风天小畜", text: "亨。密云不雨，自我西郊。", interpretation: "小畜卦象征积蓄力量。预示着目前力量尚不足，需要积蓄能量，等待时机。如同乌云密布却未降雨，时机未到，需耐心等待，同时做好准备。" },
      { number: 10, name: "天泽履", text: "履虎尾，不咥人，亨。", interpretation: "履卦象征行走、实践。如同踩在老虎尾巴上而不被咬伤，预示着行事需谨慎小心，遵循正道，虽有风险但能化险为夷。此卦提醒我们，行事要合乎礼仪，谨慎行事。" },
      { number: 11, name: "地天泰", text: "小往大来，吉，亨。", interpretation: "泰卦象征通达、太平。天地交泰，万物生长，预示着运势顺利，事业发展，人际关系和谐。此卦启示我们，当处于顺境时，更应保持谦逊，居安思危。" },
      { number: 12, name: "天地否", text: "否之匪人，不利君子贞，大往小来。", interpretation: "否卦象征闭塞、不通。天地不交，万物不生，预示着运势不佳，困难重重。此卦提醒我们，当处于逆境时，应坚守正道，修身养性，等待时机转变。" },
      { number: 13, name: "天火同人", text: "同人于野，亨。利涉大川，利君子贞。", interpretation: "同人卦象征同心协力。预示着只要团结一心，目标一致，就能克服困难，取得成功。此卦启示我们，要广结善缘，与志同道合者共同奋斗。" },
      { number: 14, name: "火天大有", text: "元亨。", interpretation: "大有卦象征丰饶、富足。预示着事业兴旺，收获丰厚。此卦提醒我们，在富有之时更应保持谦逊，多行公益，才能保持长久的富足。" },
      { number: 15, name: "地山谦", text: "亨，君子有终。", interpretation: "谦卦象征谦逊。预示着谦逊有礼的人终将获得好运和成功。此卦启示我们，无论何时何地，都应保持谦逊的态度，尊重他人，才能获得他人的尊重和支持。" }
    ];
    
    // 初始化主题
    applyTheme();
    
    // 监听Anzhiyu主题变化
    const htmlElement = document.documentElement;
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        // 监听html的data-theme属性变化或body的class变化
        if ((mutation.target === htmlElement && mutation.attributeName === 'data-theme') ||
            (mutation.target === document.body && mutation.attributeName === 'class')) {
          applyTheme();
        }
      });
    });
    
    // 同时观察html的属性和body的class变化
    observer.observe(htmlElement, { attributes: true });
    observer.observe(document.body, { attributes: true });
    
    castBtn.addEventListener('click', function() {
      if (currentLine >= 6) return;
      castBtn.disabled = true;
      
      coins.forEach(coin => coin.classList.add('shaking'));
      
      setTimeout(() => {
        const results = [Math.floor(Math.random() * 2), Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)];
        
        results.forEach((result, index) => {
          if (result === 0) {
            coins[index].classList.remove('tails');
            coins[index].textContent = '●';
          } else {
            coins[index].classList.add('tails');
            coins[index].textContent = '○';
          }
          coins[index].classList.remove('shaking');
        });
        
        const value = results.reduce((sum, r) => sum + (r === 0 ? 3 : 2), 0);
        const isYang = value === 7 || value === 9;
        const isChanging = value === 6 || value === 9;
        
        lines.unshift({ isYang, isChanging });
        
        currentLine++;
        progressBar.style.width = `${(currentLine / 6) * 100}%`;
        progressText.textContent = `${currentLine}/6`;
        
        if (currentLine === 6) {
          displayHexagram();
        }
        
        castBtn.disabled = false;
      }, 800);
    });
    
    resetBtn.addEventListener('click', function() {
      currentLine = 0;
      lines.length = 0;
      
      coins.forEach(coin => {
        coin.classList.remove('tails', 'shaking');
        coin.textContent = '●';
      });
      
      progressBar.style.width = '0%';
      progressText.textContent = '0/6';
      hexagramResult.style.display = 'none';
    });
    
    function displayHexagram() {
      hexagramLines.innerHTML = '';
      
      lines.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.className = `hexagram-line ${line.isChanging ? 'changing' : ''}`;
        lineElement.textContent = line.isYang ? '—' : '--';
        hexagramLines.appendChild(lineElement);
      });
      
      // 更精准的卦象计算方法
      let binaryValue = 0;
      lines.forEach((line, index) => {
        if (line.isYang) {
          binaryValue += Math.pow(2, index);
        }
      });
      const hexIndex = binaryValue % hexagrams.length;
      const hex = hexagrams[hexIndex];
      
      hexagramName.textContent = `${hex.name} (第${hex.number}卦)`;
      hexagramText.textContent = hex.text;
      hexagramInterpretation.textContent = hex.interpretation;
      
      hexagramResult.style.display = 'block';
      hexagramResult.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // 立即初始化应用，解决首次加载问题
  initApp();
})();
</script>
