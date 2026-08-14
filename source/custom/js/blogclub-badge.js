// blogclub-badge.js
(function() {
    'use strict';

    function loadBadge() {
        const img = document.getElementById("blogclub-badge");
        if (!img) {
            console.warn("[博阅榜] 未找到 #blogclub-badge 元素");
            return;
        }

        // 检查是否已经加载了正确的徽章（防止无限循环）
        const currentSrc = img.src || '';
        if (currentSrc.includes('blogsclub.org') && img.style.display !== 'none') {
            console.log("[博阅榜] 已加载正确的徽章，跳过");
            return;
        }

        console.log("[博阅榜] 开始加载/刷新徽章...");
        
        // 强制重置状态，清空旧 src
        img.style.display = "none";
        img.src = "";

        const doLoad = () => {
            // 使用 window.location.host 自动适配你的域名
            const site = window.location.host; // 例如 "www.sumi233.top"
            const url = `https://www.blogsclub.org/badge/${site}?ref=${encodeURIComponent(window.location.origin)}&t=${Date.now()}_${Math.random()}`;
            console.log("[博阅榜] 请求 URL:", url);
            
            img.src = url;
            img.onload = () => {
                console.log("[博阅榜] 徽章加载成功 ✅");
                img.style.display = "inline-block";
                img.style.visibility = "visible";
                img.style.opacity = "1";
            };
            img.onerror = () => {
                console.warn("[博阅榜] 徽章加载失败，2秒后重试...");
                setTimeout(doLoad, 2000);
            };
        };

        doLoad();
    }

    let observer = null;

    function startObserving() {
        // 清理旧观察者
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // 如果元素已经存在，直接加载
        if (document.getElementById("blogclub-badge")) {
            loadBadge();
        }

        // 启动 MutationObserver 监听元素出现或变化
        observer = new MutationObserver(() => {
            if (document.getElementById("blogclub-badge")) {
                // 这里不直接调用 loadBadge，而是通过条件判断，避免在 PJAX 切换时过度刷新
                // 但为了避免 1x1 占位图问题，我们直接调用 loadBadge（它内部有防重复逻辑）
                loadBadge();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        console.log("[博阅榜] 已启动 DOM 监听");
    }

    // 页面加载完成后初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }

    // 监听 PJAX 完成事件
    window.addEventListener("pjax:complete", function() {
        console.log("[博阅榜] PJAX 切换完成");
        // 延迟执行，确保新 DOM 已插入
        setTimeout(loadBadge, 300);
    });

    console.log("[博阅榜] 脚本已加载");
})();