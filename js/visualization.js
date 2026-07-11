// ===== 音频可视化 =====
class AudioVisualizer {
    constructor() {
        this.canvas = document.getElementById('visualizer');
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.dataArray = null;
        this.initialized = false;
        this.animationId = null;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.displayWidth = rect.width;
        this.displayHeight = rect.height;
    }
    
    init(audioElement) {
        if (this.initialized && this.source) {
            // 已初始化，只需重新连接
            this.draw();
            return;
        }
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            
            this.source = this.audioContext.createMediaElementSource(audioElement);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            
            this.initialized = true;
            this.draw();
        } catch (e) {
            console.log('可视化初始化失败:', e);
            this.drawFallback();
        }
    }
    
    draw() {
        if (!this.analyser) return;
        
        this.animationId = requestAnimationFrame(() => this.draw());
        
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // 清空画布
        this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
        
        const barCount = this.dataArray.length;
        const barWidth = this.displayWidth / barCount;
        const centerY = this.displayHeight / 2;
        
        for (let i = 0; i < barCount; i++) {
            const value = this.dataArray[i];
            const barHeight = (value / 255) * this.displayHeight * 0.8;
            
            // 渐变颜色
            const gradient = this.ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
            gradient.addColorStop(0, '#00f0ff');
            gradient.addColorStop(0.5, '#7b2ff7');
            gradient.addColorStop(1, '#ff00ff');
            
            this.ctx.fillStyle = gradient;
            
            // 镜像柱状图
            const x = i * barWidth;
            const y = centerY - barHeight / 2;
            
            this.ctx.beginPath();
            this.ctx.roundRect(x + 1, y, barWidth - 2, barHeight, 2);
            this.ctx.fill();
            
            // 发光效果
            this.ctx.shadowColor = '#00f0ff';
            this.ctx.shadowBlur = 10;
        }
        
        this.ctx.shadowBlur = 0;
    }
    
    // 无音频时的假动画
    drawFallback() {
        const barCount = 64;
        const barWidth = this.displayWidth / barCount;
        const centerY = this.displayHeight / 2;
        
        const animate = () => {
            this.animationId = requestAnimationFrame(animate);
            this.ctx.clearRect(0, 0, this.displayWidth, this.displayHeight);
            
            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.sin(Date.now() / 500 + i * 0.2) * 20 + 25;
                
                const gradient = this.ctx.createLinearGradient(0, centerY - barHeight / 2, 0, centerY + barHeight / 2);
                gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
                gradient.addColorStop(1, 'rgba(255, 0, 255, 0.5)');
                
                this.ctx.fillStyle = gradient;
                
                const x = i * barWidth;
                const y = centerY - barHeight / 2;
                
                this.ctx.beginPath();
                this.ctx.roundRect(x + 1, y, barWidth - 2, barHeight, 2);
                this.ctx.fill();
            }
        };
        
        animate();
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.audioVisualizer = new AudioVisualizer();
});
