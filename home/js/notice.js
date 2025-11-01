// 通知系统功能
let notificationTimer;
        
function showNotification() {
    const notification = document.getElementById('notification');
    clearTimeout(notificationTimer);
    
    notification.classList.add('active');
    notificationTimer = setTimeout(() => {
        closeNotification();
    }, 4000);
}
        
function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('active');
}