function showNotification() {
    var notification = document.getElementById('notification');
    notification.style.display = 'block';
    setTimeout(function() {
        closeNotification();
    }, 4000);
}

function closeNotification() {
    var notification = document.getElementById('notification');
    notification.classList.add('hidden');
    setTimeout(function() {
        notification.style.display = 'none';
    }, 500); // 与CSS中的transition时间一致
}

window.onload = function() {
    showNotification();
};

// 生成随机延迟
var a = parseInt(Math.random() * 500);
document.getElementById('latency').textContent = a + 'ms';

async function fetchIP() {
    try {
        const response = await fetch('https://vv.video.qq.com/checktime?otype=json');
        const textResponse = await response.text(); // 获取文本响应
        const data = parseQZOutputJson(textResponse); // 解析特定格式的JSON
        
        if (data && data.ip) {
            displayIP(data.ip);
        } else {
            throw new Error('获取IP地址失败');
        }
    } catch (error) {
        console.error('获取IP地址时发生错误：', error);
    }
}

function parseQZOutputJson(text) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    const jsonStr = text.substring(start, end + 1);
    return JSON.parse(jsonStr);
}

function displayIP(ip) {
    const ipDisplayElement = document.getElementById('ipDisplay');
    ipDisplayElement.textContent = ip + ", 你与果园官网的联通性正常, 请继续访问网站";
    console.log('IP成功获取，IP是：' + ip + '你与果园官网的联通性正常');
}

window.onload = fetchIP;

function displayTime() {
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    minutes = (minutes < 10 ? "0" : "") + minutes;
    seconds = (seconds < 10 ? "0" : "") + seconds;
    var timeString = hours + ":" + minutes + ":" + seconds;
    document.getElementById("clock").innerText = timeString;
}
window.onload = function() {
    displayTime();
    setInterval(displayTime, 1000);
};