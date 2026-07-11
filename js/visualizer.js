let audioContext = null;
let analyser = null;
let dataArray = null;
let canvas = null;
let ctx = null;
let animationId = null;
let visualizerInitialized = false;

// 初始化可视化
function initVisualizer() {
    if (visualizerInitialized) return;
    
    try {
        // 创建音频上下文
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        // 连接音频节点
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        // 获取画布
        canvas = document.getElementById('visualizer');
        ctx = canvas.getContext('2d');
        
        // 自适应尺寸
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        visualizerInitialized = true;
        drawVisualizer();
    } catch (e) {
        console.warn('音频可视化初始化失败（通常是跨域限制导致，不影响播放）:', e);
    }
}

// 调整画布尺寸
function resizeCanvas() {
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

// 绘制频谱动画
function drawVisualizer() {
    animationId = requestAnimationFrame(drawVisualizer);
    
    if (!analyser || !ctx || !dataArray) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    const bars = 64; // 频谱条数量
    const step = Math.floor(dataArray.length / bars);
    
    // 绘制环形频谱
    for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step];
        const barHeight = (value / 255) * 80 + 10;
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
        // 渐变色频谱条
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(0, 240, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 0, 255, 0.6)');
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        // 发光效果
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f0ff';
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // 绘制内圈光晕
    const innerGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
    innerGlow.addColorStop(0, 'rgba(0, 240, 255, 0)');
    innerGlow.addColorStop(0.5, 'rgba(0, 240, 255, 0.1)');
    innerGlow.addColorStop(1, 'rgba(255, 0, 255, 0.2)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = innerGlow;
    ctx.fill();
}

// 暂停时停止动画，节省性能
audio.addEventListener('pause', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
});

audio.addEventListener('play', () => {
    if (visualizerInitialized && !animationId) {
        drawVisualizer();
    }
});
