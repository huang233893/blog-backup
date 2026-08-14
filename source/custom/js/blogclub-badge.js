(function() {
    'use strict';

    var img = null;

    function loadBadge() {
        img = document.getElementById('blogclub-badge');
        if (!img) return;

        // 如果已经加载了正确的徽章且可见，就跳过
        if (img.src && img.src.indexOf('blogsclub.org') !== -1 && img.style.display !== 'none') {
            return;
        }

        // 重置
        img.style.display = 'none';
        img.src = '';

        var site = window.location.host; // 例如 "www.sumi233.top"
        var url = 'https://www.blogsclub.org/badge/' + site +
                  '?ref=' + encodeURIComponent(window.location.origin) +
                  '&t=' + Date.now() + '_' + Math.random();

        img.src = url;
        img.onload = function() {
            img.style.display = 'inline-block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
        };
        img.onerror = function() {
            // 失败后 2 秒重试
            setTimeout(loadBadge, 2000);
        };
    }

    function startObserving() {
        // 如果已有监听器，先断开
        if (window.__badgeObserver) {
            window.__badgeObserver.disconnect();
            window.__badgeObserver = null;
        }

        // 如果元素已存在，直接加载
        if (document.getElementById('blogclub-badge')) {
            loadBadge();
        }

        // 使用 MutationObserver 监听元素出现
        var observer = new MutationObserver(function() {
            if (document.getElementById('blogclub-badge')) {
                loadBadge();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        window.__badgeObserver = observer;
    }

    // 页面加载完成后启动
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        startObserving();
    } else {
        document.addEventListener('DOMContentLoaded', startObserving);
    }

    // PJAX 切换后重试
    window.addEventListener('pjax:complete', function() {
        setTimeout(loadBadge, 500);
    });
})();