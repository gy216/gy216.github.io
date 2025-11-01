// 页面加载动画（完整实现）
document.addEventListener('DOMContentLoaded', function() {
    // 显示全息通知
    setTimeout(() => {
        const notification = document.getElementById('notification');
        notification.classList.add('active');
        notification.innerHTML = `
            <div class="hologram-line"></div>
            <p>系统初始化完成</p>
            <span class="close-btn" onclick="closeNotification()">✕</span>
        `;
    }, 800);

    // 元素渐显动画
    const animateElements = document.querySelectorAll('[data-aos]');
    animateElements.forEach((el, index) => {
        el.style.transition = `all 0.5s ease ${index * 0.1}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // 集成cdn.js的检测系统
    initCDNDetection();
});

// CDN检测系统（与cdn.js深度集成）
function initCDNDetection() {
    const cdnElement = document.getElementById('cdn');
    
    // 高级状态指示器
    const createStatusLED = () => {
        const led = document.createElement('span');
        led.className = 'cdn-status-led';
        led.innerHTML = '◉';
        led.style.marginLeft = '8px';
        led.style.animation = 'pulse 1.5s infinite';
        return led;
    };

    // 调用cdn.js的核心检测逻辑
    if (typeof detectCDNNode === 'function') {
        cdnElement.appendChild(createStatusLED());
        
        // 增强cdn.js的检测结果展示
        const originalDetect = detectCDNNode;
        detectCDNNode = function() {
            originalDetect();
            const statusLED = cdnElement.querySelector('.cdn-status-led');
            statusLED.style.color = '#00ff00';
            statusLED.style.textShadow = '0 0 8px #00ff00';
        };
        
        detectCDNNode(); // 执行检测
    } else {
        cdnElement.innerHTML = '<span class="error">CDN检测模块加载失败</span>';
        console.error('cdn.js未提供detectCDNNode()函数');
    }
}

// 全息彩蛋特效（完整实现）
let clickCount = 0;
document.getElementById('lingButton').addEventListener('click', function(e) {
    e.preventDefault();
    clickCount++;
    
    // 动态霓虹效果
    this.style.boxShadow = `0 0 ${clickCount * 5}px rgba(0, 240, 255, ${clickCount * 0.2})`;
    
    // 五连击触发特效
    if (clickCount >= 5) {
        createHologramEffect();
        clickCount = 0;
        setTimeout(() => window.location.href = '/ling', 1500);
    }
    
    setTimeout(() => {
        clickCount = Math.max(0, clickCount - 1);
        this.style.boxShadow = '0 0 15px rgba(0, 240, 255, 0.5)';
    }, 1000);
});

// 全息投影特效
function createHologramEffect() {
    const hologram = document.createElement('div');
    hologram.className = 'hologram-effect';
    hologram.innerHTML = `
        <div class="laser-grid"></div>
        <div class="particle-field"></div>
    `;
    document.body.appendChild(hologram);
    
    // 激光网格动画
    const grid = hologram.querySelector('.laser-grid');
    for (let i = 0; i < 20; i++) {
        const line = document.createElement('div');
        line.className = 'laser-line';
        line.style.setProperty('--angle', `${i * 18}deg`);
        grid.appendChild(line);
    }
    
    // 粒子场动画
    const particles = hologram.querySelector('.particle-field');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'hologram-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 2}s`;
        particles.appendChild(particle);
    }
    
    setTimeout(() => hologram.remove(), 2000);
}

// 3D卡片效果（增强版）
document.querySelectorAll('.feature-card, .link-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x / rect.width * 100}%`);
        card.style.setProperty('--mouse-y', `${y / rect.height * 100}%`);
        
        // 动态折射光效
        const glow = card.querySelector('.card-glow') || document.createElement('div');
        glow.className = 'card-glow';
        glow.style.left = `${x}px`;
        glow.style.top = `${y}px`;
        if (!card.contains(glow)) card.appendChild(glow);
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
    });
});

// 性能监控（增强版）
function monitorPerformance() {
    const perfData = window.performance;
    if (!perfData) return;
    
    const metrics = {
        loadTime: perfData.timing.loadEventEnd - perfData.timing.navigationStart,
        domReady: perfData.timing.domComplete - perfData.timing.domLoading,
        tti: perfData.now() - perfData.timing.fetchStart
    };
    
    if (metrics.loadTime > 2000) {
        showPerformanceWarning(metrics);
    }
}

function showPerformanceWarning(metrics) {
    const warning = document.createElement('div');
    warning.className = 'perf-warning';
    warning.innerHTML = `
        <p>⚠️ 系统提示：页面加载耗时 ${metrics.loadTime}ms</p>
        <div class="perf-meter">
            <div class="perf-bar" style="width: ${Math.min(100, metrics.loadTime / 30)}%"></div>
        </div>
    `;
    document.body.appendChild(warning);
    
    setTimeout(() => warning.remove(), 5000);
}

// CSS动画定义（动态注入）
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
    @keyframes hologram { 
        0% { transform: translateY(0) rotate(0); opacity: 0; } 
        50% { opacity: 1; } 
        100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } 
    }
    .hologram-effect { 
        position: fixed; 
        top: 0; left: 0; 
        width: 100%; height: 100%; 
        z-index: 9999; 
        pointer-events: none; 
    }
    .laser-line {
        position: absolute;
        width: 100%; height: 1px;
        background: linear-gradient(90deg, transparent, #00f0ff, transparent);
        transform-origin: center;
        transform: rotate(var(--angle));
    }
    .hologram-particle {
        position: absolute;
        width: 6px; height: 6px;
        background: #ff00f0;
        border-radius: 50%;
        filter: blur(1px);
        animation: hologram 2s ease-out forwards;
    }
`;
document.head.appendChild(dynamicStyles);