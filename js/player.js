// ===== 播放器核心控制 =====
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.currentIndex = 0;
        this.isPlaying = false;
        this.playMode = 'loop'; // loop, single, shuffle
        this.filteredList = [...musicData];
        this.volume = 0.7;
        
        this.initElements();
        this.initEvents();
        this.renderList();
        this.updateVolumeUI();
        this.createParticles();
    }
    
    initElements() {
        // 播放控制
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.modeBtn = document.getElementById('modeBtn');
        this.volumeBtn = document.getElementById('volumeBtn');
        
        // 进度条
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.progressThumb = document.getElementById('progressThumb');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        
        // 音量
        this.volumeBar = document.getElementById('volumeBar');
        this.volumeFill = document.getElementById('volumeFill');
        this.volumeThumb = document.getElementById('volumeThumb');
        
        // 歌曲信息
        this.songTitle = document.getElementById('songTitle');
        this.songArtist = document.getElementById('songArtist');
        this.songTags = document.getElementById('songTags');
        this.coverImg = document.getElementById('coverImg');
        this.coverDisc = document.getElementById('coverDisc');
        
        // 列表
        this.musicList = document.getElementById('musicList');
        this.totalCount = document.getElementById('totalCount');
        this.playAllBtn = document.getElementById('playAllBtn');
        
        // 迷你播放器
        this.miniPlayer = document.getElementById('miniPlayer');
        this.miniCover = document.getElementById('miniCover');
        this.miniTitle = document.getElementById('miniTitle');
        this.miniArtist = document.getElementById('miniArtist');
        this.miniPlay = document.getElementById('miniPlay');
        this.miniPrev = document.getElementById('miniPrev');
        this.miniNext = document.getElementById('miniNext');
        
        // 搜索
        this.searchInput = document.getElementById('searchInput');
        
        // 分类标签
        this.tabBtns = document.querySelectorAll('.tab-btn');
        
        // EQ
        this.eqBtns = document.querySelectorAll('.eq-btn');
    }
    
    initEvents() {
        // 播放按钮
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrev());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.modeBtn.addEventListener('click', () => this.toggleMode());
        this.volumeBtn.addEventListener('click', () => this.toggleMute());
        
        // 迷你播放器
        this.miniPlay.addEventListener('click', () => this.togglePlay());
        this.miniPrev.addEventListener('click', () => this.playPrev());
        this.miniNext.addEventListener('click', () => this.playNext());
        
        // 进度条
        this.progressBar.addEventListener('click', (e) => this.seek(e));
        
        // 音量条
        this.volumeBar.addEventListener('click', (e) => this.setVolume(e));
        
        // 音频事件
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.handleEnded());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        
        // 播放全部
        this.playAllBtn.addEventListener('click', () => {
            this.currentIndex = 0;
            this.playSong(0);
        });
        
        // 搜索
        this.searchInput.addEventListener('input', (e) => this.search(e.target.value));
        
        // 分类筛选
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.filterByGenre(btn.dataset.filter);
            });
        });
        
        // EQ
        this.eqBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.eqBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.setEQ(btn.dataset.eq);
            });
        });
        
        // 键盘快捷键
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowLeft':
                    this.audio.currentTime -= 5;
                    break;
                case 'ArrowRight':
                    this.audio.currentTime += 5;
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.audio.volume = Math.min(1, this.audio.volume + 0.1);
                    this.volume = this.audio.volume;
                    this.updateVolumeUI();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.audio.volume = Math.max(0, this.audio.volume - 0.1);
                    this.volume = this.audio.volume;
                    this.updateVolumeUI();
                    break;
            }
        });
    }
    
    // 渲染歌曲列表
    renderList() {
        this.musicList.innerHTML = '';
        this.filteredList.forEach((song, index) => {
            const item = document.createElement('div');
            item.className = 'music-item';
            item.dataset.index = index;
            item.innerHTML = `
                <span class="item-index">${String(index + 1).padStart(3, '0')}</span>
                <div class="item-cover">
                    <img src="${song.cover}" alt="">
                </div>
                <div class="item-info">
                    <div class="item-title">${song.title}</div>
                    <div class="item-artist">${song.artist}</div>
                </div>
                <div class="item-album">${song.album}</div>
                <span class="item-duration">${song.duration}</span>
                <button class="item-play-btn">▶</button>
            `;
            
            item.addEventListener('click', (e) => {
                if (!e.target.classList.contains('item-play-btn')) {
                    this.playSong(index);
                }
            });
            
            item.querySelector('.item-play-btn').addEventListener('click', () => {
                if (this.currentIndex === index && this.isPlaying) {
                    this.pause();
                } else {
                    this.playSong(index);
                }
            });
            
            this.musicList.appendChild(item);
        });
        
        this.totalCount.textContent = `共 ${this.filteredList.length} 首歌曲`;
    }
    
    // 播放指定歌曲
    playSong(index) {
        if (index < 0 || index >= this.filteredList.length) return;
        
        this.currentIndex = index;
        const song = this.filteredList[index];
        
        this.audio.src = song.url;
        this.audio.play().catch(e => console.log('播放失败:', e));
        
        // 更新UI
        this.updateSongInfo(song);
        this.updateActiveItem(index);
        
        // 初始化可视化
        if (window.audioVisualizer) {
            window.audioVisualizer.init(this.audio);
        }
    }
    
    // 更新歌曲信息显示
    updateSongInfo(song) {
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        this.coverImg.src = song.cover;
        this.miniCover.src = song.cover;
        this.miniTitle.textContent = song.title;
        this.miniArtist.textContent = song.artist;
        
        // 标签
        this.songTags.innerHTML = song.tags.map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');
    }
    
    // 更新列表高亮
    updateActiveItem(index) {
        document.querySelectorAll('.music-item').forEach((item, i) => {
            item.classList.toggle('playing', i === index);
            const btn = item.querySelector('.item-play-btn');
            btn.textContent = i === index && this.isPlaying ? '⏸' : '▶';
        });
    }
    
    togglePlay() {
        if (this.filteredList.length === 0) return;
        
        if (!this.audio.src) {
            this.playSong(0);
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.play().catch(e => console.log('播放失败:', e));
    }
    
    pause() {
        this.audio.pause();
    }
    
    onPlay() {
        this.isPlaying = true;
        this.playBtn.textContent = '⏸';
        this.miniPlay.textContent = '⏸';
        this.coverDisc.classList.add('playing');
        this.updateActiveItem(this.currentIndex);
    }
    
    onPause() {
        this.isPlaying = false;
        this.playBtn.textContent = '▶';
        this.miniPlay.textContent = '▶';
        this.coverDisc.classList.remove('playing');
        this.updateActiveItem(this.currentIndex);
    }
    
    playPrev() {
        let newIndex;
        if (this.playMode === 'shuffle') {
            newIndex = Math.floor(Math.random() * this.filteredList.length);
        } else {
            newIndex = this.currentIndex - 1;
            if (newIndex < 0) newIndex = this.filteredList.length - 1;
        }
        this.playSong(newIndex);
    }
    
    playNext() {
        let newIndex;
        if (this.playMode === 'shuffle') {
            newIndex = Math.floor(Math.random() * this.filteredList.length);
        } else {
            newIndex = this.currentIndex + 1;
            if (newIndex >= this.filteredList.length) newIndex = 0;
        }
        this.playSong(newIndex);
    }
    
    handleEnded() {
        if (this.playMode === 'single') {
            this.audio.currentTime = 0;
            this.audio.play();
        } else {
            this.playNext();
        }
    }
    
    toggleMode() {
        const modes = ['loop', 'single', 'shuffle'];
        const icons = ['🔁', '🔂', '🔀'];
        const currentIdx = modes.indexOf(this.playMode);
        const nextIdx = (currentIdx + 1) % modes.length;
        this.playMode = modes[nextIdx];
        this.modeBtn.textContent = icons[nextIdx];
        this.modeBtn.title = {
            'loop': '列表循环',
            'single': '单曲循环',
            'shuffle': '随机播放'
        }[this.playMode];
    }
    
    // 进度控制
    updateProgress() {
        const percent = (this.audio.currentTime / this.audio.duration) * 100 || 0;
        this.progressFill.style.width = percent + '%';
        this.progressThumb.style.left = percent + '%';
        this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
    }
    
    updateDuration() {
        this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
    }
    
    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.audio.duration;
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    
    // 音量控制
    setVolume(e) {
        const rect = this.volumeBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.audio.volume = percent;
        this.volume = percent;
        this.updateVolumeUI();
    }
    
    updateVolumeUI() {
        const v = this.audio.volume * 100;
        this.volumeFill.style.width = v + '%';
        this.volumeThumb.style.left = v + '%';
        
        if (this.audio.volume === 0) {
            this.volumeBtn.textContent = '🔇';
        } else if (this.audio.volume < 0.5) {
            this.volumeBtn.textContent = '🔉';
        } else {
            this.volumeBtn.textContent = '🔊';
        }
    }
    
    toggleMute() {
        if (this.audio.volume > 0) {
            this.lastVolume = this.audio.volume;
            this.audio.volume = 0;
        } else {
            this.audio.volume = this.lastVolume || 0.7;
        }
        this.updateVolumeUI();
    }
    
    // 搜索
    search(keyword) {
        keyword = keyword.toLowerCase().trim();
        if (!keyword) {
            this.filteredList = [...musicData];
        } else {
            this.filteredList = musicData.filter(song => 
                song.title.toLowerCase().includes(keyword) ||
                song.artist.toLowerCase().includes(keyword) ||
                song.album.toLowerCase().includes(keyword)
            );
        }
        this.renderList();
    }
    
    // 分类筛选
    filterByGenre(genre) {
        if (genre === 'all') {
            this.filteredList = [...musicData];
        } else {
            this.filteredList = musicData.filter(song => song.genre === genre);
        }
        this.renderList();
    }
    
    // EQ均衡器（简化版，实际可结合Web Audio API实现）
    setEQ(mode) {
        console.log('切换音效:', mode);
        // 完整实现需要 Web Audio API 的 BiquadFilterNode
        // 这里预留接口，可视化文件中可扩展
    }
    
    // 背景粒子效果
    createParticles() {
        const container = document.getElementById('particles');
        const count = 50;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    window.player = new MusicPlayer();
});
