// 防止无限刷新
let isReloading = false;

// 监听 Service Worker 控制权变更
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isReloading) {
            isReloading = true;
            console.log('检测到 Service Worker 更新，自动刷新页面...');
            window.location.reload();
        }
    });
}