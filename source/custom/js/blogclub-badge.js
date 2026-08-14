// blogclub-badge.js
(function() {
    'use strict';

    function loadBadge() {
        const img = document.getElementById("blogclub-badge");
        if (!img) {
            console.warn("[博阅榜] 未找到 #blogclub-badge 元素");
            return;
        }

        // 如果已经显示且有 src，就不再重复加载
        if (img.src && img.style.display !== 'none') {
            console.log("[博阅榜] 徽章已加载且可见");
            return;
        }

        console.log("[博阅榜] 开始加载徽章...");
        img.style.display = "none";
        img.src = "";

        const doLoad = () => {
            const url = `https://www.blogsclub.org/badge/www.sumi233.top?ref=${encodeURIComponent(window.location.origin)}&t=${Date.now()}_${Math.random()}`;
            console.log("[博阅榜] 请求 URL:", url);
            img.src = url;

            img.onload = () => {
                console.log("[博阅榜] 徽章加载成功 ✅");
                img.style.display = "inline-block";
                img.style.visibility = "visible";
                img.style.opacity = "1";
            };

            img.onerror = () => {
                console.warn("[博阅榜] 徽章加载失败，1秒后重试...");
                setTimeout(doLoad, 1000);
            };
        };

        doLoad();
    }

    let observer = null;

    function startObserving() {
        // 如果已有 observer，先断开
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // 先检查元素是否已经存在
        if (document.getElementById("blogclub-badge")) {
            loadBadge();
            return;
        }

        // 否则用 MutationObserver 等待元素出现
        observer = new MutationObserver((mutations, obs) => {
            if (document.getElementById("blogclub-badge")) {
                loadBadge();
                obs.disconnect();
                observer = null;
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log("[博阅榜] 已启动 MutationObserver 监听");
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }

    // 监听 pjax 切换事件，重新绑定观察者
    window.addEventListener("pjax:complete", function() {
        console.log("[博阅榜] PJAX 切换完成，重新加载徽章");
        // 延迟一点确保 DOM 更新完毕
        setTimeout(startObserving, 300);
    });

    // 兜底：如果以上都没触发，5秒后强制尝试一次
    setTimeout(function() {
        const img = document.getElementById("blogclub-badge");
        if (img && !img.src) {
            console.log("[博阅榜] 兜底加载：5秒超时强制加载");
            loadBadge();
        }
    }, 5000);

    console.log("[博阅榜] 脚本已加载");
})();