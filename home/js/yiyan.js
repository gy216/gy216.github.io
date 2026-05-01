// 更新一言功能
function updateHitokoto() {
    fetch('https://international.v1.hitokoto.cn')
        .then(response => response.json())
        .then(data => {
            document.getElementById('hitokoto-text').textContent = data.hitokoto;
            let fromText = '—— ';
            if (data.from_who) fromText += data.from_who + ' ';
            if (data.from) fromText += '《' + data.from + '》';
            document.getElementById('hitokoto-from').textContent = fromText;
        })
        .catch(error => {
            console.error('获取一言失败:', error);
            document.getElementById('hitokoto-text').textContent = '一言加载失败';
            document.getElementById('hitokoto-from').textContent = '可能频率超过限制或接口不在可用。当前API接口：一言官方接口';
        });
}

// 页面加载时获取一言
document.addEventListener('DOMContentLoaded', function() {
    updateHitokoto();
    
    // 每20秒刷新一次一言
    setInterval(updateHitokoto, 20000);
});