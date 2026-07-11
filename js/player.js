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

let currentIndex = 0;
let isPlaying = false;
let playMode = 'loop'; // loop, single, shuffle
let isMuted = false;
let lastVolume = 0.7;

// 初始化音量
audio.volume = 0.7;

// 播放指定歌曲
function playSong(index) {
    currentIndex = index;
    const song = playlistData[index];
    
    audio.src = song.url;
    coverImg.src = song.cover;
    miniCover.src = song.cover;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    miniTitle.textContent = song.title;
    miniArtist.textContent = song.artist;
    
    // 更新播放状态高亮
    document.querySelectorAll('.song-item').forEach(item => {
        item.classList.remove('playing');
        if (parseInt(item.dataset.index) === index) {
            item.classList.add('playing');
        }
    });
    
    audio.play().then(() => {
        isPlaying = true;
        updatePlayButton();
        albumCover.classList.add('playing');
        initVisualizer();
    }).catch(err => {
        console.log('播放失败:', err);
    });
}

// 更新播放按钮状态
function updatePlayButton() {
    const icon = isPlaying ? '⏸' : '▶';
    playBtn.textContent = icon;
    miniPlayBtn.textContent = icon;
}

// 播放/暂停切换
function togglePlay() {
    if (!audio.src) {
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

playBtn.addEventListener('click', togglePlay);
miniPlayBtn.addEventListener('click', togglePlay);

// 上一首
prevBtn.addEventListener('click', () => {
    let newIndex;
    if (playMode === 'shuffle') {
        newIndex = Math.floor(Math.random() * playlistData.length);
    } else {
        newIndex = currentIndex > 0 ? currentIndex - 1 : playlistData.length - 1;
    }
    playSong(newIndex);
});

// 下一首
nextBtn.addEventListener('click', () => {
    playNext();
});

function playNext() {
    let newIndex;
    if (playMode === 'shuffle') {
        newIndex = Math.floor(Math.random() * playlistData.length);
    } else if (playMode === 'single') {
        newIndex = currentIndex;
    } else {
        newIndex = currentIndex < playlistData.length - 1 ? currentIndex + 1 : 0;
    }
    playSong(newIndex);
}

// 播放结束自动下一首
audio.addEventListener('ended', () => {
    playNext();
});

// 进度更新
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = percent + '%';
    progressHandle.style.left = percent + '%';
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

// 元数据加载完成
audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
});

// 进度条点击跳转
progressBar.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
});

// 音量控制
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

// 播放模式切换
modeBtn.addEventListener('click', () => {
    const modes = ['loop', 'single', 'shuffle'];
    const icons = ['🔁', '🔂', '🔀'];
    const currentModeIndex = modes.indexOf(playMode);
    const nextIndex = (currentModeIndex + 1) % modes.length;
    playMode = modes[nextIndex];
    modeBtn.textContent = icons[nextIndex];
    modeBtn.title = playMode === 'loop' ? '列表循环' : playMode === 'single' ? '单曲循环' : '随机播放';
});

// 生成背景粒子
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.width = (Math.random() * 4 + 2) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// 键盘快捷键
document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            audio.currentTime -= 5;
            break;
        case 'ArrowRight':
            audio.currentTime += 5;
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

// 初始化
createParticles();
