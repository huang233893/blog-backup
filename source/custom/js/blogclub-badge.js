// blogclub-badge.js
(function() {
    function loadBadge() {
        const img = document.getElementById("blogclub-badge");
        if (!img) return;
        // 如果已经显示，就不再重复加载
        if (img.src && img.style.display !== 'none') return;
        img.src = "";
        img.style.display = "none";
        const doLoad = () => {
            img.src = `https://www.blogsclub.org/badge/www.sumi233.top?ref=${encodeURIComponent(window.location.origin)}&t=${Date.now()}_${Math.random()}`;
            img.onload = () => { img.style.display = "inline-block"; };
            img.onerror = () => { setTimeout(doLoad, 1000); };
        };
        doLoad();
    }

    let observer = null;
    function startObserving() {
        if (observer) {
            observer.disconnect();
        }
        observer = new MutationObserver((mutations, obs) => {
            if (document.getElementById("blogclub-badge")) {
                loadBadge();
                obs.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 启动观察
    startObserving();

    // 监听 pjax 切换事件，重新绑定观察者
    window.addEventListener("pjax:complete", startObserving);
})();