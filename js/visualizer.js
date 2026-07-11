let audioContext = null;
let analyser = null;
let dataArray = null;
let canvas = null;
let ctx = null;
let animationId = null;
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
        console.warn('可视化初始化失败（不影响播放）:', e);
    }
}

function resizeCanvas() {
    if (!canvas || !canvas.parentElement) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function drawVisualizer() {
    animationId = requestAnimationFrame(drawVisualizer);
    
    if (!analyser || !ctx || !dataArray) return;
    
    analyser.getByteFrequencyData(dataArray);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.32;
    
    ctx.clearRect(0, 0, width, height);
    
    const bars = 72;
    const step = Math.floor(dataArray.length / bars);
    
    for (let i = 0; i < bars; i++) {
        const value = dataArray[i * step];
        const barHeight = (value / 255) * 70 + 8;
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
        
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);
        
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, 'rgba(167, 139, 250, 0.7)');
        gradient.addColorStop(1, 'rgba(244, 114, 182, 0.5)');
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#a78bfa';
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
    
    // 内圈柔光
    const innerGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.75, centerX, centerY, radius);
    innerGlow.addColorStop(0, 'rgba(167, 139, 250, 0)');
    innerGlow.addColorStop(0.5, 'rgba(167, 139, 250, 0.08)');
    innerGlow.addColorStop(1, 'rgba(244, 114, 182, 0.15)');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = innerGlow;
    ctx.fill();
}

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
