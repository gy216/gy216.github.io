// 数字计数动画
function animateCounters() {
    const counters = document.querySelectorAll('.data-number');
    const speed = 1000; // 动画速度，数值越小越快
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const count = parseInt(counter.innerText);
        const increment = Math.ceil(target / speed);
        
        const updateCount = () => {
            const currentCount = parseInt(counter.innerText);
            
            if(currentCount < target) {
                counter.innerText = Math.min(currentCount + increment, target);
                counter.classList.add('counting');
                setTimeout(updateCount, 1);
            } else {
                counter.classList.remove('counting');
            }
        };
        
        updateCount();
    });
}