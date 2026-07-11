// ========== 获取DOM元素 ==========
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const miniPlayBtn = document.getElementById('miniPlayBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeEl = document.getElementById('currentTime');
const totalTimeEl = document.getElementById('totalTime');
const volumeSlider = document.getElementById('volumeSlider');
const volumeBtn = document.getElementById('volumeBtn');
const modeBtn = document.getElementById('modeBtn');
const albumCover = document.getElementById('albumCover');
const coverImg = document.getElementById('coverImg');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const miniCover = document.getElementById('miniCover');
const miniTitle = document.getElementById('miniTitle');
const miniArtist = document.getElementById('miniArtist');

// ========== 全局状态变量 ==========
let currentIndex = 0;
let isPlaying = false;
let playMode = 'loop'; // loop列表循环 / single单曲循环 / shuffle随机播放
let isMuted = false;
let lastVolume = 0.7;

// ========== 初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
    audio.volume = 0.7;
    createParticles();
});

// ========== 核心播放函数 ==========
function playSong(index) {
    currentIndex = index;
    const song = playlistData[index];
    
    // 更新界面信息
    audio.src = song.url;
    coverImg.src = song.cover;
    miniCover.src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    
    // 更新列表播放高亮
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('playing');
        if (parseInt(item.dataset.index) === index) {
            item.classList.add('playing');
            // 自动滚动到播放位置
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    
    // 播放音频
    audio.load();
    audio.play().then(() => {
        isPlaying = true;
        updatePlayButton();
        albumCover.classList.add('playing');
        // 初始化音频可视化
        if (typeof initVisualizer === 'function') {
            initVisualizer();
        }
    }).catch(err => {
        console.warn('播放失败，自动切换下一首:', err);
        playNext();
    });
}

// ========== 播放/暂停切换 ==========
function togglePlay() {
    if (!audio.src || audio.src === window.location.href) {
        playSong(0);
        return;
    }
    
    if (isPlaying) {
        audio.pause();
        albumCover.classList.remove('playing');
    } else {
        audio.play();
        albumCover.classList.add('playing');
    }
    isPlaying = !isPlaying;
    updatePlayButton();
}

// 更新播放按钮图标
function updatePlayButton() {
    const icon = isPlaying ? '⏸' : '▶';
    playBtn.textContent = icon;
    miniPlayBtn.textContent = icon;
}

// 绑定播放按钮事件
playBtn.addEventListener('click', togglePlay);
miniPlayBtn.addEventListener('click', togglePlay);

// ========== 上一首/下一首 ==========
prevBtn.addEventListener('click', () => {
    let newIndex;
    if (playMode === 'shuffle') {
        newIndex = Math.floor(Math.random() * playlistData.length);
    } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : playlistData.length - 1;
    }
    playSong(newIndex);
});

nextBtn.addEventListener('click', () => {
    playNext();
});

function playNext() {
    let newIndex;
    if (playMode === 'shuffle') {
        newIndex = Math.floor(Math.random() * playlistData.length);
    } else if (playMode === 'single') {
        newIndex = currentIndex;
        audio.currentTime = 0;
        audio.play();
        return;
    } else {
        newIndex = currentIndex < playlistData.length - 1 ? currentIndex + 1 : 0;
    }
    playSong(newIndex);
}

// 播放结束自动切换
audio.addEventListener('ended', () => {
    playNext();
});

// ========== 进度条控制 ==========
audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + '%';
    progressHandle.style.left = percent + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

// 点击进度条跳转
progressBar.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

// ========== 音量控制 ==========
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    audio.volume = volume;
    lastVolume = volume;
    isMuted = volume === 0;
    updateVolumeIcon();
});

volumeBtn.addEventListener('click', () => {
    if (isMuted) {
        audio.volume = lastVolume || 0.7;
        volumeSlider.value = (lastVolume || 0.7) * 100;
        isMuted = false;
    } else {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        isMuted = true;
    }
    updateVolumeIcon();
});

function updateVolumeIcon() {
    const vol = audio.volume;
    if (vol === 0) {
        volumeBtn.textContent = '🔇';
    } else if (vol < 0.5) {
        volumeBtn.textContent = '🔉';
    } else {
        volumeBtn.textContent = '🔊';
    }
}

// ========== 播放模式切换 ==========
modeBtn.addEventListener('click', () => {
    const modes = ['loop', 'single', 'shuffle'];
    const icons = ['🔁', '🔂', '🔀'];
    const tips = ['列表循环', '单曲循环', '随机播放'];
    const currentModeIndex = modes.indexOf(playMode);
    const nextIndex = (currentModeIndex + 1) % modes.length;
    playMode = modes[nextIndex];
    modeBtn.textContent = icons[nextIndex];
    modeBtn.title = tips[nextIndex];
});

// ========== 背景粒子生成 ==========
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        container.appendChild(particle);
    }
}

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            audio.currentTime = Math.max(0, audio.currentTime - 5);
            break;
        case 'ArrowRight':
            audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
            break;
        case 'ArrowUp':
            e.preventDefault();
            audio.volume = Math.min(1, audio.volume + 0.1);
            volumeSlider.value = audio.volume * 100;
            updateVolumeIcon();
            break;
        case 'ArrowDown':
            e.preventDefault();
            audio.volume = Math.max(0, audio.volume - 0.1);
            volumeSlider.value = audio.volume * 100;
            updateVolumeIcon();
            break;
    }
});
