// 页面加载动画
document.addEventListener('DOMContentLoaded', function() {
    // 元素渐显动画
    const animateElements = document.querySelectorAll('[data-aos]');
    animateElements.forEach((el, index) => {
        el.style.transition = `all 0.5s ease ${index * 0.1}s`;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });

    // 3D卡片效果
    document.querySelectorAll('.feature-card, .link-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x / rect.width * 100}%`);
            card.style.setProperty('--mouse-y', `${y / rect.height * 100}%`);
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.removeProperty('--mouse-x');
            card.style.removeProperty('--mouse-y');
        });
    });
});

// 彩蛋特效
let clickCount = 0;
document.getElementById('lingButton')?.addEventListener('click', function(e) {
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