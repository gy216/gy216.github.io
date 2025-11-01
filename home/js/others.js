// 页面加载
document.addEventListener('DOMContentLoaded', function() {
    showNotification();
    
    // 数字计数动画
    setTimeout(animateCounters, 100);
    
    
    
    // 检测CDN
    if(typeof detectCDNNode === 'function') {
        detectCDNNode();
    }
});
        