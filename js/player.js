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
const lyricContainer = document.querySelector('.lyric-container');

// ========== 全局状态 ==========
let currentIndex = 0;
let isPlaying = false;
let playMode = 'loop';
let isMuted = false;
let lastVolume = 0.7;
const API_BASE = 'https://meting.qjqq.cn';

// 歌词状态
let lyricList = [];
let currentLyricIndex = -1;

// ========== 初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
    audio.volume = 0.7;
    createParticles();
    initPanelTabs();
});

function initPanelTabs() {
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
}

// ========== 歌词核心功能 ==========
// 解析LRC格式歌词
function parseLRC(lrcText) {
    const lines = lrcText.split('\n');
    const result = [];
    const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;

    lines.forEach(line => {
        const matches = [...line.matchAll(timeReg)];
        const text = line.replace(timeReg, '').trim();
        
        if (!text) return;

        matches.forEach(match => {
            const minutes = parseInt(match[1]);
            const seconds = parseInt(match[2]);
            const ms = parseInt(match[3].padEnd(3, '0'));
            const time = minutes * 60 + seconds + ms / 1000;
            result.push({ time, text });
        });
    });

    return result.sort((a, b) => a.time - b.time);
}

// 加载歌词
async function loadLyric(songId) {
    lyricList = [];
    currentLyricIndex = -1;
    
    try {
        const res = await fetch(`${API_BASE}/?type=lrc&id=${songId}&server=netease`);
        const lrcText = await res.text();
        
        if (!lrcText || lrcText.trim() === '' || lrcText.includes('暂无歌词') || lrcText.length < 10) {
            showNoLyric();
            return;
        }

        lyricList = parseLRC(lrcText);
        if (lyricList.length === 0) {
            showNoLyric();
            return;
        }

        renderLyric();
    } catch (err) {
        console.warn('歌词加载失败:', err);
        showNoLyric();
    }
}

// 渲染歌词列表
function renderLyric() {
    if (!lyricContainer) return;
    
    lyricContainer.innerHTML = `
        <div class="lyric-list" id="lyricList">
            ${lyricList.map((item, index) => `
                <div class="lyric-line" data-index="${index}">${item.text}</div>
            `).join('')}
        </div>
    `;
}

// 无歌词提示
function showNoLyric() {
    if (!lyricContainer) return;
    lyricContainer.innerHTML = '<p class="lyric-placeholder">暂无歌词 · 静静聆听旋律</p>';
}

// 同步歌词进度
function updateLyric(currentTime) {
    if (lyricList.length === 0) return;

    let index = -1;
    for (let i = 0; i < lyricList.length; i++) {
        if (currentTime >= lyricList[i].time) {
            index = i;
        } else {
            break;
        }
    }

    if (index === currentLyricIndex) return;
    currentLyricIndex = index;

    // 更新高亮
    document.querySelectorAll('.lyric-line').forEach(line => {
        line.classList.remove('active');
    });

    const activeLine = document.querySelector(`.lyric-line[data-index="${index}"]`);
    if (activeLine) {
        activeLine.classList.add('active');
        
        // 自动滚动居中
        const lyricListEl = document.getElementById('lyricList');
        const containerHeight = lyricContainer.clientHeight;
        const lineTop = activeLine.offsetTop;
        const lineHeight = activeLine.clientHeight;
        const offset = lineTop - containerHeight / 2 + lineHeight / 2;
        
        lyricListEl.style.transform = `translateY(-${Math.max(0, offset)}px)`;
    }
}

// ========== 获取真实播放地址 ==========
async function getSongUrl(songId) {
    try {
        const res = await fetch(`${API_BASE}/?type=url&id=${songId}&server=netease`);
        const url = await res.text();
        if (url && url.startsWith('http')) {
            return url;
        }
        throw new Error('播放地址无效');
    } catch (err) {
        console.warn('获取播放地址失败，使用备用音频:', err);
        return audioPool[Math.floor(Math.random() * audioPool.length)];
    }
}

// ========== 核心播放函数 ==========
async function playSong(index) {
    if (!playlistData || playlistData.length === 0) return;
    
    currentIndex = index;
    const song = playlistData[index];
    
    // 更新界面信息
    coverImg.src = song.cover;
    miniCover.src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    
    // 列表高亮 + 自动滚动
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('playing');
        if (parseInt(item.dataset.index) === index) {
            item.classList.add('playing');
            item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // 加载歌词
    loadLyric(song.id);
    
    try {
        let playUrl = song.url;
        if (!playUrl || !playUrl.startsWith('http')) {
            playUrl = await getSongUrl(song.id);
        }
        
        audio.src = playUrl;
        await audio.play();
        
        isPlaying = true;
        updatePlayButton();
        albumCover.classList.add('playing');
        
        // 初始化可视化
        if (typeof initVisualizer === 'function') {
            initVisualizer();
        }
        
    } catch (err) {
        console.warn('播放失败，自动切换下一首:', err);
        setTimeout(playNext, 500);
    }
}

// ========== 播放/暂停控制 ==========
function togglePlay() {
    if (!playlistData || playlistData.length === 0) {
        alert('歌单加载中，请稍候...');
        return;
    }
    
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

function updatePlayButton() {
    const icon = isPlaying ? '⏸' : '▶';
    playBtn.textContent = icon;
    miniPlayBtn.textContent = icon;
}

playBtn.addEventListener('click', togglePlay);
miniPlayBtn.addEventListener('click', togglePlay);

// ========== 上一首/下一首 ==========
prevBtn.addEventListener('click', () => {
    if (!playlistData || playlistData.length === 0) return;
    
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
    if (!playlistData || playlistData.length === 0) return;
    
    let newIndex;
    if (playMode === 'shuffle') {
        newIndex = Math.floor(Math.random() * playlistData.length);
    } else if (playMode === 'single') {
        audio.currentTime = 0;
        audio.play();
        return;
    } else {
        newIndex = currentIndex < playlistData.length - 1 ? currentIndex + 1 : 0;
    }
    playSong(newIndex);
}

audio.addEventListener('ended', () => {
    playNext();
});

// ========== 进度条 + 歌词同步 ==========
audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + '%';
    progressHandle.style.left = percent + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
    
    // 同步歌词
    updateLyric(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

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
    volumeBtn.textContent = vol === 0 ? '🔇' : vol < 0.5 ? '🔉' : '🔊';
}

// ========== 播放模式切换 ==========
modeBtn.addEventListener('click', () => {
    const modes = ['loop', 'single', 'shuffle'];
    const icons = ['🔁', '🔂', '🔀'];
    const tips = ['列表循环', '单曲循环', '随机播放'];
    const idx = modes.indexOf(playMode);
    const nextIdx = (idx + 1) % modes.length;
    playMode = modes[nextIdx];
    modeBtn.textContent = icons[nextIdx];
    modeBtn.title = tips[nextIdx];
});

// ========== 背景粒子生成 ==========
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 18 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        const size = Math.random() * 3 + 1;
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
