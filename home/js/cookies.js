// Cookies 弹窗功能
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

function checkCookieConsent() {
    const cookieConsent = getCookie("cookieConsent");
    if (cookieConsent !== "accepted") {
        document.getElementById("cookieConsent").classList.add("active");
    }
}

function acceptCookies() {
    setCookie("cookieConsent", "accepted", 2);
    document.getElementById("cookieConsent").classList.remove("active");
}

// 初始化Cookies弹窗
document.addEventListener("DOMContentLoaded", function() {
    checkCookieConsent();
    
    // 绑定按钮事件
    document.getElementById("cookieAccept").addEventListener("click", acceptCookies);
    document.getElementById("cookieSettings").addEventListener("click", function() {
        alert("请通过浏览器设置管理Cookie，点击网址旁边的小锁，点击Cookies和站点数据，点击Cookies正在使用...，点击这个窗口上我的网址，点击删除，点击完成即可！");
    });
});
