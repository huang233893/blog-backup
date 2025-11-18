---
title: AES加解密工具
description: 高级AES加解密工具（带偏移量设置）
comments: false
date: 2025-09-26
---

<div id="aes-tool-widget" style="width: 100%; max-width: 700px; margin: 2rem auto; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">
  <!-- Shadow DOM内容将通过JavaScript注入 -->
</div>

<script>
(() => {
  // 1. 创建HTML模板
  const htmlTemplate = `
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
      
      :host {
        display: block;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      
      /* 基础样式式 - 将在JS中动态设置变量 */
      .container {
        padding: 24px;
      }
      
      h1, h2, h3 {
        margin: 0 0 16px;
        text-align: center;
        font-weight: 600;
      }
      
      h1 {
        font-size: 1.8rem;
        color: var(--text-color);
        margin-bottom: 20px;
      }
      
      h2 {
        font-size: 1.4rem;
        margin-top: 24px;
        padding-bottom: 8px;
        border-bottom: 1px solid var(--border-color);
      }
      
      h3 {
        font-size: 1.1rem;
        text-align: left;
        margin-bottom: 12px;
      }
      
      .intro {
        margin-bottom: 24px;
        padding: 12px;
        background: var(--intro-bg);
        border-radius: 8px;
        font-size: 0.9rem;
        text-align: center;
        color: var(--sub-color);
      }
      
      .card {
        background: var(--card-bg);
        border-radius: 8px;
        padding: 18px;
        margin-bottom: 20px;
        border: 1px solid var(--border-color);
      }
      
      .options-row {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        flex-wrap: wrap;
      }
      
      .option-group {
        flex: 1;
        min-width: 200px;
      }
      
      .input-group {
        margin-bottom: 16px;
      }
      
      label {
        display: block;
        margin-bottom: 6px;
        font-weight: 500;
        color: var(--text-color);
      }
      
      .radio-group {
        display: flex;
        gap: 12px;
        margin-bottom: 4px;
      }
      
      .radio-item {
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      input[type="text"], 
      input[type="password"], 
      textarea, 
      select {
        width: 100%;
        padding: 12px;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-color);
        color: var(--text-color);
        font-size: 1rem;
        transition: border-color 0.2s ease;
      }
      
      input:focus, 
      textarea:focus, 
      select:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
      }
      
      textarea {
        min-height: 120px;
        resize: vertical;
        line-height: 1.5;
      }
      
      .button-group {
        display: flex;
        justify-content: center;
        gap: 12px;
        margin: 24px 0;
        flex-wrap: wrap;
      }
      
      button {
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      
      button svg {
        width: 16px;
        height: 16px;
      }
      
      #encrypt-btn {
        background: var(--primary-color);
        color: white;
      }
      
      #encrypt-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 123, 255, 0.3);
      }
      
      #decrypt-btn {
        background: var(--secondary-color);
        color: white;
      }
      
      #decrypt-btn:hover {
        background: var(--secondary-dark);
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(40, 167, 69, 0.3);
      }
      
      .utility-btn {
        background: var(--key-bg);
        color: var(--text-color);
      }
      
      .utility-btn:hover {
        background: var(--utility-hover);
      }
      
      #reset-btn {
        background: var(--key-bg);
        color: var(--text-color);
      }
      
      #reset-btn:hover {
        background: var(--utility-hover);
      }
      
      .result-container {
        margin-top: 16px;
        padding: 16px;
        border-radius: 8px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
      }
      
      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }
      
      .result-title {
        font-weight: 500;
        color: var(--text-color);
      }
      
      .result-content {
        min-height: 120px;
        white-space: pre-wrap;
        word-wrap: break-word;
        line-height: 1.5;
      }
      
      .result.error {
        background: var(--error-bg);
        border-color: var(--error-border);
        color: var(--error-text);
      }
      
      .info-text {
        font-size: 0.85rem;
        color: var(--sub-color);
        margin-top: 6px;
        text-align: right;
      }
      
      .stats {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px dashed var(--border-color);
        font-size: 0.85rem;
        color: var(--sub-color);
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 8px;
      }
      
      .stat-item {
        display: flex;
        justify-content: space-between;
      }
      
      .environment-warning {
        margin: 16px 0;
        padding: 12px;
        background: #fff3cd;
        border: 1px solid #ffeeba;
        border-radius: 6px;
        color: #856404;
        font-size: 0.9rem;
        display: none;
      }

      .environment-warning.dark {
        background: #5c4b00;
        border-color: #856404;
        color: #fff3cd;
      }
      
      .tooltip {
        position: relative;
        display: inline-block;
        cursor: help;
      }
      
      .tooltip .tooltip-text {
        visibility: hidden;
        width: 250px;
        background-color: var(--tooltip-bg);
        color: var(--tooltip-text);
        text-align: center;
        border-radius: 6px;
        padding: 8px;
        position: absolute;
        z-index: 1;
        bottom: 125%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 0.8rem;
        font-weight: normal;
      }
      
      .tooltip:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
      }
      
      .offset-options {
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px dashed var(--border-color);
      }
    </style>

    <div class="container">
      <h1>AES加解密工具</h1>
      
      <div class="environment-warning" id="env-warning">
        ⚠️ 注意：加密功能需要在安全上下文（HTTPS或localhost）中运行，请切换到支持的环境。
      </div>
      
      <div class="intro">
        基于Web Crypto API的专业AES加解密工具，支持多种密钥长度、加密模式和自定义偏移量，所有操作均在本地完成。
      </div>

      <div class="card">
        <h3>加密选项</h3>
        <div class="options-row">
          <div class="option-group">
            <label for="key-length">密钥长度</label>
            <select id="key-length">
              <option value="128">128位 (16字符)</option>
              <option value="192">192位 (24字符)</option>
              <option value="256">256位 (32字符)</option>
            </select>
          </div>
          <div class="option-group">
            <label for="mode">加密模式</label>
            <select id="mode">
              <option value="GCM">AES-GCM (认证加密)</option>
              <option value="CBC">AES-CBC</option>
            </select>
          </div>
        </div>
        
        <div class="options-row">
          <div class="option-group">
            <label for="input-encoding">输入编码</label>
            <select id="input-encoding">
              <option value="utf8">UTF-8 文本</option>
              <option value="base64">Base64</option>
              <option value="hex">十六进制</option>
            </select>
          </div>
          <div class="option-group">
            <label for="output-encoding">输出编码</label>
            <select id="output-encoding">
              <option value="base64">Base64</option>
              <option value="hex">十六进制</option>
            </select>
          </div>
        </div>
      </div>

      <div class="input-group">
        <label for="plaintext">
          输入数据
          <span class="tooltip">ⓘ
            <span class="tooltip-text">加密时输入明文，解密时输入密文</span>
          </span>
        </label>
        <textarea id="plaintext" placeholder="请输入要加密的明文或要解密的密文..."></textarea>
      </div>

      <div class="input-group">
        <label for="secret-key">
          密钥
          <span class="tooltip">ⓘ
            <span class="tooltip-text">根据所选密钥长度，需输入16/24/32个字符</span>
          </span>
        </label>
        <div style="display: flex; gap: 8px;">
          <input type="password" id="secret-key" placeholder="请输入密钥">
          <button type="button" class="utility-btn" id="generate-key">生成</button>
          <button type="button" class="utility-btn" id="toggle-visibility">显示</button>
        </div>
        <div class="info-text" id="key-length-info">当前长度: 0/16</div>
      </div>

      <div class="input-group" id="offset-group">
        <label for="offset">
          偏移量 (IV)
          <span class="tooltip">ⓘ
            <span class="tooltip-text">初始化向量，用于增加加密强度，不同模式有不同的推荐长度，解密时需使用相同值</span>
          </span>
        </label>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="offset" placeholder="偏移量（初始化向量）">
          <button type="button" class="utility-btn" id="generate-offset">生成</button>
          <button type="button" class="utility-btn" id="copy-offset">复制</button>
        </div>
        
        <div class="offset-options">
          <div class="options-row">
            <div class="option-group">
              <label for="offset-length">偏移量长度 (字节)</label>
              <select id="offset-length">
                <option value="8">8</option>
                <option value="12" selected>12 (GCM推荐)</option>
                <option value="16">16 (CBC推荐)</option>
                <option value="24">24</option>
                <option value="32">32</option>
              </select>
            </div>
            <div class="option-group">
              <label for="offset-encoding">偏移量编码</label>
              <select id="offset-encoding">
                <option value="hex" selected>十六进制</option>
                <option value="base64">Base64</option>
                <option value="utf8">UTF-8</option>
              </select>
            </div>
          </div>
          <div class="info-text" id="offset-info">当前偏移量长度: 0字节</div>
        </div>
      </div>

      <div class="button-group">
        <button id="encrypt-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          加密
        </button>
        <button id="decrypt-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          解密
        </button>
        <button type="button" class="utility-btn" id="copy-result">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          复制结果
        </button>
        <button id="reset-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 2v6h-6"></path>
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
            <path d="M3 22v-6h6"></path>
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
          </svg>
          重置
        </button>
      </div>

      <h2>结果</h2>
      <div class="result-container" id="result-container">
        <div class="result-header">
          <div class="result-title" id="result-title">操作结果将显示在这里...</div>
        </div>
        <div class="result-content" id="result-area"></div>
        <div class="stats" id="stats-area" style="display: none;">
          <div class="stat-item">
            <span>密钥长度:</span>
            <span id="stat-key-length">-</span>
          </div>
          <div class="stat-item">
            <span>加密模式:</span>
            <span id="stat-mode">-</span>
          </div>
          <div class="stat-item">
            <span>偏移量长度:</span>
            <span id="stat-offset-length">-</span>
          </div>
          <div class="stat-item">
            <span>处理时间:</span>
            <span id="stat-time">-</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // 2. 创建Shadow DOM
  const widgetContainer = document.getElementById('aes-tool-widget');
  const shadowRoot = widgetContainer.attachShadow({ mode: 'closed' });
  shadowRoot.innerHTML = htmlTemplate;

  // 3. 主题适配 - 专为Anzhiyu主题优化
  function applyAnzhiyuTheme() {
    // 检测Anzhiyu主题的深色/亮色模式
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const isLightMode = htmlElement.getAttribute('data-theme') === 'light' || 
                       bodyElement.classList.contains('light');
    
    const style = document.createElement('style');
    const envWarning = shadowRoot.getElementById('env-warning');
    
    // 同步警告框的主题
    if (isLightMode) {
      envWarning.classList.remove('dark');
    } else {
      envWarning.classList.add('dark');
    }
    
    // 亮色模式 - 遵循Anzhiyu主题变量
    if (isLightMode) {
      style.textContent = `
        :host {
          --text-color: #333;          /* 文本主色 */
          --bg-color: #f5f5f5;         /* 背景色 */
          --sub-color: #666;           /* 次要文本色 */
          --key-bg: #ddd;              /* 按钮背景色 */
          --border-color: #ddd;        /* 边框色 */
          --intro-bg: #f0f0f0;         /* 介绍区域背景 */
          --card-bg: #fff;             /* 卡片背景 */
          --primary-color: #007bff;    /* 主按钮色 */
          --primary-dark: #0056b3;     /* 主按钮hover色 */
          --secondary-color: #28a745;  /* 次要按钮色 */
          --secondary-dark: #218838;   /* 次要按钮hover色 */
          --utility-hover: #ccc;       /* 工具按钮hover色 */
          --result-bg: #fff;           /* 结果区域背景 */
          --error-bg: #fff5f5;         /* 错误背景 */
          --error-border: #ffe3e3;     /* 错误边框 */
          --error-text: #dc3545;       /* 错误文本 */
          --tooltip-bg: #333;          /* 提示框背景 */
          --tooltip-text: #fff;        /* 提示框文本 */
        }
      `;
    } 
    // 深色模式 - 适配Anzhiyu深色风格
    else {
      style.textContent = `
        :host {
          --text-color: #f0f0f0;       /* 文本主色 */
          --bg-color: #1a1a1a;         /* 背景色 */
          --sub-color: #bbb;           /* 次要文本色 */
          --key-bg: #333;              /* 按钮背景色 */
          --border-color: #333;        /* 边框色 */
          --intro-bg: #2d2d2d;         /* 介绍区域背景 */
          --card-bg: #2d2d2d;          /* 卡片背景 */
          --primary-color: #4dabf7;    /* 主按钮色 */
          --primary-dark: #3b82f6;     /* 主按钮hover色 */
          --secondary-color: #51cf66;  /* 次要按钮色 */
          --secondary-dark: #40c057;   /* 次要按钮hover色 */
          --utility-hover: #444;       /* 工具按钮hover色 */
          --result-bg: #2d2d2d;        /* 结果区域背景 */
          --error-bg: #471515;         /* 错误背景 */
          --error-border: #6b2121;     /* 错误边框 */
          --error-text: #f87171;       /* 错误文本 */
          --tooltip-bg: #444;          /* 提示框背景 */
          --tooltip-text: #fff;        /* 提示框文本 */
        }
      `;
    }
    
    // 清除旧主题样式
    const existingStyles = shadowRoot.querySelectorAll('style[data-theme]');
    existingStyles.forEach(s => s.remove());
    
    style.setAttribute('data-theme', 'true');
    shadowRoot.appendChild(style);
  }

  // 4. 工具函数 - 编码转换和辅助函数
  const CodecUtils = {
    // 字符串转ArrayBuffer (UTF-8)
    stringToArrayBuffer: (str) => {
      return new TextEncoder().encode(str);
    },
    
    // ArrayBuffer转字符串 (UTF-8)
    arrayBufferToString: (buf) => {
      return new TextDecoder().decode(buf);
    },
    
    // ArrayBuffer转Base64字符串
    arrayBufferToBase64: (buf) => {
      return btoa(String.fromCharCode(...new Uint8Array(buf)));
    },
    
    // Base64字符串转ArrayBuffer
    base64ToArrayBuffer: (base64) => {
      try {
        const binary = atob(base64);
        const buf = new ArrayBuffer(binary.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < binary.length; i++) {
          view[i] = binary.charCodeAt(i);
        }
        return buf;
      } catch (e) {
        throw new Error('无效的Base64编码: ' + e.message);
      }
    },
    
    // ArrayBuffer转十六进制字符串
    arrayBufferToHex: (buf) => {
      return Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    },
    
    // 十六进制字符串转ArrayBuffer
    hexToArrayBuffer: (hex) => {
      try {
        if (hex.length % 2 !== 0) {
          throw new Error('十六进制字符串长度必须为偶数');
        }
        const buf = new ArrayBuffer(hex.length / 2);
        const view = new Uint8Array(buf);
        for (let i = 0; i < hex.length; i += 2) {
          view[i / 2] = parseInt(hex.substr(i, 2), 16);
        }
        return buf;
      } catch (e) {
        throw new Error('无效的十六进制编码: ' + e.message);
      }
    },
    
    // 根据编码类型将输入转换为ArrayBuffer
    inputToBuffer: (input, encoding) => {
      if (!input) return new ArrayBuffer(0);
      
      switch (encoding) {
        case 'utf8':
          return CodecUtils.stringToArrayBuffer(input);
        case 'base64':
          return CodecUtils.base64ToArrayBuffer(input);
        case 'hex':
          return CodecUtils.hexToArrayBuffer(input);
        default:
          throw new Error('不支持的输入编码: ' + encoding);
      }
    },
    
    // 根据编码类型将ArrayBuffer转换为字符串
    bufferToOutput: (buffer, encoding) => {
      switch (encoding) {
        case 'utf8':
          return CodecUtils.arrayBufferToString(buffer);
        case 'base64':
          return CodecUtils.arrayBufferToBase64(buffer);
        case 'hex':
          return CodecUtils.arrayBufferToHex(buffer);
        default:
          throw new Error('不支持的输出编码: ' + encoding);
      }
    },
    
    // 生成指定长度的随机字节
    generateRandomBytes: (length) => {
      if (!AESUtils.isCryptoAvailable()) {
        throw new Error('加密API不可用，无法生成随机数');
      }
      return window.crypto.getRandomValues(new Uint8Array(length));
    },
    
    // 生成随机密钥
    generateRandomKey: (bitLength) => {
      const byteLength = bitLength / 8;
      const keyBytes = CodecUtils.generateRandomBytes(byteLength);
      return CodecUtils.arrayBufferToBase64(keyBytes).substring(0, byteLength);
    },
    
    // 生成随机偏移量(IV)
    generateRandomOffset: (byteLength, encoding) => {
      const ivBytes = CodecUtils.generateRandomBytes(byteLength);
      switch (encoding) {
        case 'hex':
          return CodecUtils.arrayBufferToHex(ivBytes);
        case 'base64':
          return CodecUtils.arrayBufferToBase64(ivBytes);
        case 'utf8':
          return CodecUtils.arrayBufferToString(ivBytes);
        default:
          return CodecUtils.arrayBufferToHex(ivBytes);
      }
    },
    
    // 计算偏移量字节长度
    getOffsetByteLength: (offset, encoding) => {
      if (!offset) return 0;
      
      try {
        const buffer = CodecUtils.inputToBuffer(offset, encoding);
        return buffer.byteLength;
      } catch {
        return 0;
      }
    }
  };

  // 5. AES加解密核心工具
  const AESUtils = {
    // 检测加密API是否可用
    isCryptoAvailable: () => {
      return typeof window !== 'undefined' && 
             window.crypto && 
             window.crypto.subtle;
    },
    
    // 获取加密配置
    getCryptoConfig: (mode, iv) => {
      const config = { name: `AES-${mode}` };
      
      if (mode === 'GCM') {
        config.iv = iv;
        config.tagLength = 128; // GCM模式认证标签长度
      } else if (mode === 'CBC') {
        config.iv = iv;
      }
      
      return config;
    },
    
    // 导入密钥
    importKey: async (keyMaterial, mode) => {
      if (!AESUtils.isCryptoAvailable()) {
        throw new Error('加密API不可用，请在HTTPS或localhost环境中使用');
      }
      
      return await window.crypto.subtle.importKey(
        'raw',
        keyMaterial,
        { name: `AES-${mode}` },
        false,
        ['encrypt', 'decrypt']
      );
    },
    
    // 加密
    encrypt: async (data, key, mode, iv) => {
      if (!AESUtils.isCryptoAvailable()) {
        throw new Error('加密API不可用，请在HTTPS或localhost环境中使用');
      }
      
      const cryptoKey = await AESUtils.importKey(key, mode);
      const config = AESUtils.getCryptoConfig(mode, iv);
      
      let ciphertext;
      if (mode === 'GCM') {
        // GCM模式返回的是包含密文和认证标签的缓冲区
        ciphertext = await window.crypto.subtle.encrypt(config, cryptoKey, data);
        return {
          ciphertext: ciphertext,
          iv: iv,
          tag: ciphertext.slice(-16) // 最后16字节是认证标签
        };
      } else {
        // CBC模式
        ciphertext = await window.crypto.subtle.encrypt(config, cryptoKey, data);
        return {
          ciphertext: ciphertext,
          iv: iv
        };
      }
    },
    
    // 解密
    decrypt: async (data, key, mode, iv, tag) => {
      if (!AESUtils.isCryptoAvailable()) {
        throw new Error('加密API不可用，请在HTTPS或localhost环境中使用');
      }
      
      const cryptoKey = await AESUtils.importKey(key, mode);
      const config = AESUtils.getCryptoConfig(mode, iv);
      
      // GCM模式需要认证标签
      if (mode === 'GCM' && tag) {
        // 将密文和标签组合
        const combined = new Uint8Array(data.byteLength + tag.byteLength);
        combined.set(new Uint8Array(data), 0);
        combined.set(new Uint8Array(tag), data.byteLength);
        data = combined.buffer;
      }
      
      return await window.crypto.subtle.decrypt(config, cryptoKey, data);
    }
  };

  // 6. 初始化应用
  function initApp() {
    // 获取DOM元素
    const plaintextEl = shadowRoot.getElementById('plaintext');
    const secretKeyEl = shadowRoot.getElementById('secret-key');
    const keyLengthEl = shadowRoot.getElementById('key-length');
    const keyLengthInfo = shadowRoot.getElementById('key-length-info');
    const modeEl = shadowRoot.getElementById('mode');
    const inputEncodingEl = shadowRoot.getElementById('input-encoding');
    const outputEncodingEl = shadowRoot.getElementById('output-encoding');
    const offsetEl = shadowRoot.getElementById('offset');
    const offsetLengthEl = shadowRoot.getElementById('offset-length');
    const offsetEncodingEl = shadowRoot.getElementById('offset-encoding');
    const offsetInfo = shadowRoot.getElementById('offset-info');
    const encryptBtn = shadowRoot.getElementById('encrypt-btn');
    const decryptBtn = shadowRoot.getElementById('decrypt-btn');
    const resetBtn = shadowRoot.getElementById('reset-btn');
    const generateKeyBtn = shadowRoot.getElementById('generate-key');
    const toggleVisibilityBtn = shadowRoot.getElementById('toggle-visibility');
    const generateOffsetBtn = shadowRoot.getElementById('generate-offset');
    const copyOffsetBtn = shadowRoot.getElementById('copy-offset');
    const copyResultBtn = shadowRoot.getElementById('copy-result');
    const resultContainer = shadowRoot.getElementById('result-container');
    const resultTitle = shadowRoot.getElementById('result-title');
    const resultArea = shadowRoot.getElementById('result-area');
    const statsArea = shadowRoot.getElementById('stats-area');
    const statKeyLength = shadowRoot.getElementById('stat-key-length');
    const statMode = shadowRoot.getElementById('stat-mode');
    const statOffsetLength = shadowRoot.getElementById('stat-offset-length');
    const statTime = shadowRoot.getElementById('stat-time');
    const envWarning = shadowRoot.getElementById('env-warning');
    
    // 检测加密环境是否可用
    const isCryptoSupported = AESUtils.isCryptoAvailable();
    if (!isCryptoSupported) {
      // 显示警告并禁用按钮
      envWarning.style.display = 'block';
      encryptBtn.disabled = true;
      decryptBtn.disabled = true;
      generateKeyBtn.disabled = true;
      generateOffsetBtn.disabled = true;
      showResult('加密功能不可用：请在HTTPS协议或localhost环境中使用此工具', true);
    }
    
    // 更新密钥长度提示
    function updateKeyLengthInfo() {
      const keyLength = parseInt(keyLengthEl.value);
      const requiredLength = keyLength / 8;
      const currentLength = secretKeyEl.value.length;
      keyLengthInfo.textContent = `当前长度: ${currentLength}/${requiredLength}`;
      
      // 密钥长度不足时给出视觉提示
      if (currentLength !== requiredLength && currentLength > 0) {
        secretKeyEl.style.borderColor = '#fd7e14';
        keyLengthInfo.style.color = '#fd7e14';
      } else {
        secretKeyEl.style.borderColor = '';
        keyLengthInfo.style.color = '';
      }
    }
    
    // 更新偏移量信息
    function updateOffsetInfo() {
      const offset = offsetEl.value.trim();
      const encoding = offsetEncodingEl.value;
      const byteLength = CodecUtils.getOffsetByteLength(offset, encoding);
      offsetInfo.textContent = `当前偏移量长度: ${byteLength}字节`;
      
      // 根据加密模式推荐偏移量长度
      const mode = modeEl.value;
      if (mode === 'GCM' && offsetLengthEl.value !== '12') {
        offsetInfo.textContent += ' (GCM模式推荐12字节)';
      } else if (mode === 'CBC' && offsetLengthEl.value !== '16') {
        offsetInfo.textContent += ' (CBC模式推荐16字节)';
      }
    }
    
    // 根据加密模式自动推荐偏移量长度
    function updateRecommendedOffsetLength() {
      const mode = modeEl.value;
      if (mode === 'GCM' && offsetLengthEl.value !== '12') {
        offsetLengthEl.value = '12';
      } else if (mode === 'CBC' && offsetLengthEl.value !== '16') {
        offsetLengthEl.value = '16';
      }
      updateOffsetInfo();
    }
    
    // 事件监听
    keyLengthEl.addEventListener('change', updateKeyLengthInfo);
    secretKeyEl.addEventListener('input', updateKeyLengthInfo);
    offsetEl.addEventListener('input', updateOffsetInfo);
    offsetLengthEl.addEventListener('change', updateOffsetInfo);
    offsetEncodingEl.addEventListener('change', updateOffsetInfo);
    modeEl.addEventListener('change', updateRecommendedOffsetLength);
    
    // 切换密钥可见性
    toggleVisibilityBtn.addEventListener('click', () => {
      const type = secretKeyEl.getAttribute('type');
      if (type === 'password') {
        secretKeyEl.setAttribute('type', 'text');
        toggleVisibilityBtn.textContent = '隐藏';
      } else {
        secretKeyEl.setAttribute('type', 'password');
        toggleVisibilityBtn.textContent = '显示';
      }
    });
    
    // 生成随机密钥
    generateKeyBtn.addEventListener('click', () => {
      try {
        const keyLength = parseInt(keyLengthEl.value);
        const key = CodecUtils.generateRandomKey(keyLength);
        secretKeyEl.value = key;
        updateKeyLengthInfo();
      } catch (e) {
        showResult(e.message, true);
      }
    });
    
    // 生成随机偏移量
    generateOffsetBtn.addEventListener('click', () => {
      try {
        const byteLength = parseInt(offsetLengthEl.value);
        const encoding = offsetEncodingEl.value;
        const offset = CodecUtils.generateRandomOffset(byteLength, encoding);
        offsetEl.value = offset;
        updateOffsetInfo();
      } catch (e) {
        showResult(e.message, true);
      }
    });
    
    // 复制偏移量
    copyOffsetBtn.addEventListener('click', () => {
      const offset = offsetEl.value.trim();
      if (offset) {
        navigator.clipboard.writeText(offset).then(() => {
          const originalText = copyOffsetBtn.textContent;
          copyOffsetBtn.textContent = '已复制';
          setTimeout(() => {
            copyOffsetBtn.textContent = originalText;
          }, 2000);
        }).catch(err => {
          showResult('复制偏移量失败: ' + err.message, true);
        });
      }
    });
    
    // 复制结果
    copyResultBtn.addEventListener('click', () => {
      const text = resultArea.textContent;
      if (text && text !== '操作结果将显示在这里...') {
        navigator.clipboard.writeText(text).then(() => {
          const originalText = copyResultBtn.innerHTML;
          copyResultBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            已复制
          `;
          setTimeout(() => {
            copyResultBtn.innerHTML = originalText;
          }, 2000);
        }).catch(err => {
          showResult('复制失败: ' + err.message, true);
        });
      }
    });
    
    // 加密按钮点击事件
    encryptBtn.addEventListener('click', async () => {
      const inputData = plaintextEl.value.trim();
      const key = secretKeyEl.value.trim();
      const keyLength = parseInt(keyLengthEl.value);
      const mode = modeEl.value;
      const inputEncoding = inputEncodingEl.value;
      const outputEncoding = outputEncodingEl.value;
      let offset = offsetEl.value.trim();
      const offsetEncoding = offsetEncodingEl.value;
      const offsetLength = parseInt(offsetLengthEl.value);
      
      // 验证输入
      if (!inputData) {
        showResult('请输入要加密的数据', true);
        return;
      }
      
      const requiredKeyLength = keyLength / 8;
      if (key.length !== requiredKeyLength) {
        showResult(`请输入${requiredKeyLength}个字符的密钥（${keyLength}位）`, true);
        return;
      }
      
      try {
        const startTime = performance.now();
        
        // 处理输入数据
        const dataBuffer = CodecUtils.inputToBuffer(inputData, inputEncoding);
        
        // 处理密钥
        const keyBuffer = CodecUtils.stringToArrayBuffer(key);
        
        // 处理偏移量(IV) - 如未提供则自动生成
        let offsetBuffer;
        if (offset) {
          offsetBuffer = CodecUtils.inputToBuffer(offset, offsetEncoding);
          
          // 验证偏移量长度
          if (offsetBuffer.byteLength !== offsetLength) {
            showResult(`偏移量长度不符合设置（应为${offsetLength}字节，实际为${offsetBuffer.byteLength}字节）`, true);
            return;
          }
        } else {
          // 自动生成偏移量
          offsetBuffer = CodecUtils.generateRandomBytes(offsetLength).buffer;
          offset = CodecUtils.bufferToOutput(offsetBuffer, offsetEncoding);
          offsetEl.value = offset;
          updateOffsetInfo();
        }
        
        // 执行加密
        const result = await AESUtils.encrypt(dataBuffer, keyBuffer, mode, offsetBuffer);
        
        // 处理加密结果
        let output;
        if (mode === 'GCM') {
          // GCM模式：组合密文和标签
          const combined = new Uint8Array(result.ciphertext);
          output = CodecUtils.bufferToOutput(combined.buffer, outputEncoding);
        } else {
          // CBC模式
          output = CodecUtils.bufferToOutput(result.ciphertext, outputEncoding);
        }
        
        const endTime = performance.now();
        const timeTaken = (endTime - startTime).toFixed(2);
        
        // 显示结果和统计信息
        showResult(output, false, `加密成功 (${mode})`);
        showStats({
          keyLength: `${keyLength}位 (${requiredKeyLength}字符)`,
          mode: `AES-${mode}`,
          offsetLength: `${offsetBuffer.byteLength}字节`,
          time: `${timeTaken}毫秒`
        });
        
      } catch (e) {
        showResult('加密失败: ' + e.message, true);
        hideStats();
      }
    });
    
    // 解密按钮点击事件
    decryptBtn.addEventListener('click', async () => {
      const inputData = plaintextEl.value.trim();
      const key = secretKeyEl.value.trim();
      const keyLength = parseInt(keyLengthEl.value);
      const mode = modeEl.value;
      const inputEncoding = inputEncodingEl.value;
      const outputEncoding = outputEncodingEl.value;
      const offset = offsetEl.value.trim();
      const offsetEncoding = offsetEncodingEl.value;
      
      // 验证输入
      if (!inputData) {
        showResult('请输入要解密的数据', true);
        return;
      }
      
      if (!offset) {
        showResult('请输入偏移量(IV)', true);
        return;
      }
      
      const requiredKeyLength = keyLength / 8;
      if (key.length !== requiredKeyLength) {
        showResult(`请输入${requiredKeyLength}个字符的密钥（${keyLength}位）`, true);
        return;
      }
      
      try {
        const startTime = performance.now();
        
        // 处理输入数据（密文）
        const dataBuffer = CodecUtils.inputToBuffer(inputData, inputEncoding);
        
        // 处理密钥
        const keyBuffer = CodecUtils.stringToArrayBuffer(key);
        
        // 处理偏移量(IV)
        const offsetBuffer = CodecUtils.inputToBuffer(offset, offsetEncoding);
        
        // 处理GCM模式的认证标签
        let tagBuffer = null;
        if (mode === 'GCM') {
          // 最后16字节是认证标签
          tagBuffer = dataBuffer.slice(-16);
          // 前面的是密文
          dataBuffer = dataBuffer.slice(0, -16);
        }
        
        // 执行解密
        const plaintextBuffer = await AESUtils.decrypt(
          dataBuffer, 
          keyBuffer, 
          mode, 
          offsetBuffer,
          tagBuffer
        );
        
        // 处理解密结果
        const output = CodecUtils.bufferToOutput(plaintextBuffer, outputEncoding);
        const endTime = performance.now();
        const timeTaken = (endTime - startTime).toFixed(2);
        
        // 显示结果和统计信息
        showResult(output, false, `解密成功 (${mode})`);
        showStats({
          keyLength: `${keyLength}位 (${requiredKeyLength}字符)`,
          mode: `AES-${mode}`,
          offsetLength: `${offsetBuffer.byteLength}字节`,
          time: `${timeTaken}毫秒`
        });
        
      } catch (e) {
        showResult('解密失败: ' + e.message, true);
        hideStats();
      }
    });
    
    // 重置按钮点击事件
    resetBtn.addEventListener('click', () => {
      plaintextEl.value = '';
      secretKeyEl.value = '';
      secretKeyEl.setAttribute('type', 'password');
      toggleVisibilityBtn.textContent = '显示';
      offsetEl.value = '';
      inputEncodingEl.value = 'utf8';
      outputEncodingEl.value = 'base64';
      keyLengthEl.value = '128';
      modeEl.value = 'GCM';
      offsetLengthEl.value = '12';
      offsetEncodingEl.value = 'hex';
      
      updateKeyLengthInfo();
      updateOffsetInfo();
      showResult('操作结果将显示在这里...');
      hideStats();
    });
    
    // 显示结果函数
    function showResult(text, isError = false, title = '') {
      resultArea.textContent = text;
      resultTitle.textContent = title || (isError ? '操作失败' : '操作结果');
      
      if (isError) {
        resultContainer.classList.add('error');
      } else {
        resultContainer.classList.remove('error');
      }
      
      resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    
    // 显示统计信息
    function showStats(stats) {
      statKeyLength.textContent = stats.keyLength;
      statMode.textContent = stats.mode;
      statOffsetLength.textContent = stats.offsetLength;
      statTime.textContent = stats.time;
      statsArea.style.display = 'grid';
    }
    
    // 隐藏统计信息
    function hideStats() {
      statsArea.style.display = 'none';
    }
    
    // 初始化Anzhiyu主题
    applyAnzhiyuTheme();
    
    // 监听Anzhiyu主题变化 - 监测data-theme属性和body的light类
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'data-theme' || 
            (mutation.target.tagName === 'BODY' && mutation.attributeName === 'class')) {
          applyAnzhiyuTheme();
        }
      });
    });
    
    // 同时观察html的data-theme变化和body的class变化
    observer.observe(document.documentElement, { attributes: true });
    observer.observe(document.body, { attributes: true });
    
    // 初始化信息显示
    updateKeyLengthInfo();
    updateOffsetInfo();
  }

  // 立即初始化
  initApp();
})();
</script>