---
title: 2048 Plus
description: 酥米小站的2048小游戏
date: 2024-02-17 00:14:59
---

<div id="game-2048-container" style="max-width: 400px; margin: 20px auto; padding: 15px; border-radius: 8px; transition: all 0.3s ease; background: var(--card-bg); touch-action: none;">
  <!-- 分数与控制区 -->
  <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-family: 'Segoe UI', Arial;">
    <div style="font-size: 24px; font-weight: bold; color: var(--text-color);">2048</div>
    <div style="background: var(--primary-color); color: white; padding: 5px 10px; border-radius: 4px;">
      分数: <span id="score-2048">0</span>
    </div>
    <div style="display: flex; gap: 5px;">
      <!-- 按钮增大点击区域并添加触摸反馈 -->
      <button id="undo-2048" style="background: var(--btn-bg); color: var(--btn-color); border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; opacity: 0.5; touch-action: manipulation;" disabled>
        撤回
      </button>
      <button id="reset-2048" style="background: var(--btn-bg); color: var(--btn-color); border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; touch-action: manipulation;">
        重置
      </button>
    </div>
  </div>
  
  <!-- 游戏棋盘 -->
  <div id="game-2048-board" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;"></div>
  
  <!-- 操作说明 -->
  <div style="margin-top: 15px; font-size: 14px; color: var(--text-color); font-family: 'Segoe UI', Arial;">
    <p>操作：方向键或滑动屏幕移动方块，相同数字碰撞将合并</p>
  </div>
</div>

<script>
const container = document.getElementById('game-2048-container');
if (container) {
  // 获取DOM元素
  const boardEl = container.querySelector('#game-2048-board');
  const scoreEl = container.querySelector('#score-2048');
  const resetBtn = container.querySelector('#reset-2048');
  const undoBtn = container.querySelector('#undo-2048');
  
  // 游戏配置
  const SIZE = 4;
  let grid = [];
  let score = 0;
  let isDarkMode = false;
  let history = [];
  let isTouching = false;
  let touchTarget = null; // 记录触摸目标，区分按钮和棋盘
  
  // 颜色映射（保持不变）
  const getColors = (value) => {
    const colors = {
      2: { bg: isDarkMode ? '#3a3a3a' : '#eee4da', text: isDarkMode ? '#fff' : '#776e65' },
      4: { bg: isDarkMode ? '#4a4a4a' : '#ede0c8', text: isDarkMode ? '#fff' : '#776e65' },
      8: { bg: isDarkMode ? '#ff9966' : '#f2b179', text: '#f9f6f2' },
      16: { bg: isDarkMode ? '#ff7733' : '#f59563', text: '#f9f6f2' },
      32: { bg: isDarkMode ? '#ff5500' : '#f67c5f', text: '#f9f6f2' },
      64: { bg: isDarkMode ? '#ff3300' : '#f65e3b', text: '#f9f6f2' },
      128: { bg: isDarkMode ? '#ffcc66' : '#edcf72', text: '#f9f6f2' },
      256: { bg: isDarkMode ? '#ffbb33' : '#edcc61', text: '#f9f6f2' },
      512: { bg: isDarkMode ? '#ffaa00' : '#edc850', text: '#f9f6f2' },
      1024: { bg: isDarkMode ? '#ff9900' : '#edc53f', text: '#f9f6f2' },
      2048: { bg: isDarkMode ? '#ff8800' : '#edc22e', text: '#f9f6f2' }
    };
    if (!colors[value]) {
      colors[value] = { bg: isDarkMode ? '#ff5555' : '#3c3a32', text: '#f9f6f2' };
    }
    return colors[value];
  };
  
  // 初始化网格（保持不变）
  const initGrid = () => {
    grid = Array(SIZE).fill().map(() => Array(SIZE).fill(0));
    score = 0;
    history = [];
    scoreEl.textContent = '0';
    addRandomNumber();
    addRandomNumber();
    updateUndoBtn();
    renderGrid();
  };
  
  // 保存历史记录（保持不变）
  const saveHistory = () => {
    const gridCopy = JSON.parse(JSON.stringify(grid));
    history.push({ grid: gridCopy, score: score });
    if (history.length > 10) history.shift();
    updateUndoBtn();
  };
  
  // 撤回操作（保持不变）
  const undoMove = () => {
    if (history.length === 0) return;
    const lastState = history.pop();
    grid = lastState.grid;
    score = lastState.score;
    scoreEl.textContent = score;
    updateUndoBtn();
    renderGrid();
  };
  
  // 更新撤回按钮状态（保持不变）
  const updateUndoBtn = () => {
    undoBtn.disabled = history.length === 0;
    undoBtn.style.opacity = history.length === 0 ? '0.5' : '1';
  };
  
  // 随机生成数字（保持不变）
  const addRandomNumber = () => {
    const emptyCells = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === 0) emptyCells.push({ i, j });
      }
    }
    if (emptyCells.length === 0) return false;
    const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    return true;
  };
  
  // 渲染网格（保持不变）
  const renderGrid = () => {
    boardEl.innerHTML = '';
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const cell = document.createElement('div');
        const value = grid[i][j];
        cell.style.width = '80px';
        cell.style.height = '80px';
        cell.style.borderRadius = '4px';
        cell.style.display = 'flex';
        cell.style.alignItems = 'center';
        cell.style.justifyContent = 'center';
        cell.style.fontWeight = 'bold';
        cell.style.transition = 'all 0.2s ease';
        cell.style.fontFamily = 'Arial, sans-serif';
        
        if (value === 0) {
          cell.style.background = isDarkMode ? '#2a2a2a' : '#cdc1b4';
          cell.style.color = 'transparent';
        } else {
          const { bg, text } = getColors(value);
          cell.style.background = bg;
          cell.style.color = text;
          cell.style.fontSize = value < 100 ? '24px' : value < 1000 ? '20px' : '16px';
          cell.textContent = value;
        }
        boardEl.appendChild(cell);
      }
    }
  };
  
  // 移动逻辑（保持不变）
  const moveLeft = () => {
    let moved = false;
    for (let i = 0; i < SIZE; i++) {
      for (let j = 1; j < SIZE; j++) {
        if (grid[i][j] !== 0) {
          let k = j;
          while (k > 0 && grid[i][k - 1] === 0) {
            grid[i][k - 1] = grid[i][k];
            grid[i][k] = 0;
            k--;
            moved = true;
          }
          if (k > 0 && grid[i][k - 1] === grid[i][k]) {
            grid[i][k - 1] *= 2;
            score += grid[i][k - 1];
            grid[i][k] = 0;
            moved = true;
          }
        }
      }
    }
    return moved;
  };
  
  const moveRight = () => {
    let moved = false;
    for (let i = 0; i < SIZE; i++) {
      for (let j = SIZE - 2; j >= 0; j--) {
        if (grid[i][j] !== 0) {
          let k = j;
          while (k < SIZE - 1 && grid[i][k + 1] === 0) {
            grid[i][k + 1] = grid[i][k];
            grid[i][k] = 0;
            k++;
            moved = true;
          }
          if (k < SIZE - 1 && grid[i][k + 1] === grid[i][k]) {
            grid[i][k + 1] *= 2;
            score += grid[i][k + 1];
            grid[i][k] = 0;
            moved = true;
          }
        }
      }
    }
    return moved;
  };
  
  const moveUp = () => {
    let moved = false;
    for (let j = 0; j < SIZE; j++) {
      for (let i = 1; i < SIZE; i++) {
        if (grid[i][j] !== 0) {
          let k = i;
          while (k > 0 && grid[k - 1][j] === 0) {
            grid[k - 1][j] = grid[k][j];
            grid[k][j] = 0;
            k--;
            moved = true;
          }
          if (k > 0 && grid[k - 1][j] === grid[k][j]) {
            grid[k - 1][j] *= 2;
            score += grid[k - 1][j];
            grid[k][j] = 0;
            moved = true;
          }
        }
      }
    }
    return moved;
  };
  
  const moveDown = () => {
    let moved = false;
    for (let j = 0; j < SIZE; j++) {
      for (let i = SIZE - 2; i >= 0; i--) {
        if (grid[i][j] !== 0) {
          let k = i;
          while (k < SIZE - 1 && grid[k + 1][j] === 0) {
            grid[k + 1][j] = grid[k][j];
            grid[k][j] = 0;
            k++;
            moved = true;
          }
          if (k < SIZE - 1 && grid[k + 1][j] === grid[k][j]) {
            grid[k + 1][j] *= 2;
            score += grid[k + 1][j];
            grid[k][j] = 0;
            moved = true;
          }
        }
      }
    }
    return moved;
  };
  
  // 处理移动（保持不变）
  const handleMove = (direction) => {
    let moved;
    switch (direction) {
      case 'left': moved = moveLeft(); break;
      case 'right': moved = moveRight(); break;
      case 'up': moved = moveUp(); break;
      case 'down': moved = moveDown(); break;
      default: return;
    }
    
    if (moved) {
      saveHistory();
      scoreEl.textContent = score;
      addRandomNumber();
      renderGrid();
      checkGameState();
    }
  };
  
  // 检查游戏状态（保持不变）
  const checkGameState = () => {
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === 2048) {
          setTimeout(() => alert('恭喜你赢了！'), 300);
          return;
        }
      }
    }
    
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        if (grid[i][j] === 0) return;
      }
    }
    
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - 1; j++) {
        if (grid[i][j] === grid[i][j + 1]) return;
      }
    }
    
    for (let j = 0; j < SIZE; j++) {
      for (let i = 0; i < SIZE - 1; i++) {
        if (grid[i][j] === grid[i + 1][j]) return;
      }
    }
    
    setTimeout(() => alert('游戏结束！得分：' + score), 300);
  };
  
  // 明暗模式适配（保持不变）
  const checkThemeMode = () => {
    isDarkMode = document.documentElement.classList.contains('dark');
    renderGrid();
  };
  
  const themeObserver = new MutationObserver(() => checkThemeMode());
  themeObserver.observe(document.documentElement, { attributes: true });
  
  // 键盘控制（保持不变）
  const handleKeydown = (e) => {
    switch (e.key) {
      case 'ArrowLeft': handleMove('left'); e.preventDefault(); break;
      case 'ArrowRight': handleMove('right'); e.preventDefault(); break;
      case 'ArrowUp': handleMove('up'); e.preventDefault(); break;
      case 'ArrowDown': handleMove('down'); e.preventDefault(); break;
      default: return;
    }
  };
  
  // 触屏控制（核心修复：区分按钮和棋盘触摸）
  let touchStartX = 0, touchStartY = 0;
  
  // 触摸开始：记录目标元素
  const handleTouchStart = (e) => {
    touchTarget = e.target; // 记录触摸的元素（按钮或棋盘）
    // 只有触摸棋盘时才处理滑动逻辑
    if (touchTarget === boardEl || boardEl.contains(touchTarget)) {
      isTouching = true;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      e.preventDefault();
    }
    // 触摸按钮时不阻止默认行为，确保点击有效
  };
  
  // 触摸移动：只在触摸棋盘时阻止滚动
  const handleTouchMove = (e) => {
    if (isTouching && (touchTarget === boardEl || boardEl.contains(touchTarget))) {
      e.preventDefault(); // 仅棋盘滑动阻止滚动
    }
  };
  
  // 触摸结束：区分处理
  const handleTouchEnd = (e) => {
    if (isTouching) {
      isTouching = false;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      
      if (Math.abs(diffX) > 30 || Math.abs(diffY) > 30) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          diffX > 0 ? handleMove('right') : handleMove('left');
        } else {
          diffY > 0 ? handleMove('down') : handleMove('up');
        }
      }
      e.preventDefault();
    }
    touchTarget = null; // 重置触摸目标
  };
  
  // 为按钮添加专门的触摸事件（解决移动端点击无反应）
  const handleButtonTouch = (callback) => {
    return (e) => {
      e.stopPropagation(); // 阻止事件冒泡到容器
      callback();
    };
  };
  
  // 事件绑定（优化版）
  document.addEventListener('keydown', handleKeydown);
  container.addEventListener('touchstart', handleTouchStart, { passive: false });
  container.addEventListener('touchmove', handleTouchMove, { passive: false });
  container.addEventListener('touchend', handleTouchEnd, { passive: false });
  
  // 按钮单独绑定触摸和点击事件，确保移动端响应
  resetBtn.addEventListener('click', initGrid);
  resetBtn.addEventListener('touchstart', handleButtonTouch(initGrid), { passive: true });
  undoBtn.addEventListener('click', undoMove);
  undoBtn.addEventListener('touchstart', handleButtonTouch(undoMove), { passive: true });
  
  // 初始化
  checkThemeMode();
  initGrid();
}
</script>