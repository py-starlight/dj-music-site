let audioContext;
let analyser;
let dataArray;
let canvas;
let ctx;
let animationId;
let visualizerInitialized = false;

function initVisualizer() {
    if (visualizerInitialized) return;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        canvas = document.getElementById('visualizer');
        ctx = canvas.getContext('2d');
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        visualizerInitialized = true;
        drawVisualizer();
    } catch (e) {
        console.log('可视化初始化失败:', e);
    }
}

function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function drawVisualizer() {
    animationId = requestAnimationFrame(drawVisualizer);
    
    if (!analyser || !ctx) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;
    
    ctx.clearRect(0, 0, width, height);
    
    const bars = 64;
    const step = Math.floor(dataArray.length / bars);
    
    for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step];
        const barHeight = (value / 255) * 80 + 10;
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
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
    
    // 内圈光晕
    const innerGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.8, centerX, centerY, radius);
    innerGlow.addColorStop(0, 'rgba(0, 240, 255, 0)');
    innerGlow.addColorStop(0.5, 'rgba(0, 240, 255, 0.1)');
    innerGlow.addColorStop(1, 'rgba(255, 0, 255, 0.2)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = innerGlow;
    ctx.fill();
}

// 暂停时停止动画以节省性能
audio.addEventListener('pause', () => {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

audio.addEventListener('play', () => {
    if (visualizerInitialized) {
        drawVisualizer();
    }
});
