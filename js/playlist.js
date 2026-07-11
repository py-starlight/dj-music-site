// ========== 稳定可播放的免费音频池（国内可正常访问） ==========
const audioPool = [
    'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b7e50e7.mp3',
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    'https://cdn.pixabay.com/download/audio/2023/01/09/audio_31c5716b0f.mp3',
    'https://cdn.pixabay.com/download/audio/2022/08/23/audio_d08cc950b3.mp3',
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_002f86c70d.mp3',
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    'https://cdn.pixabay.com/download/audio/2022/10/18/audio_2de9657c59.mp3',
    'https://cdn.pixabay.com/download/audio/2023/02/14/audio_22a6197ce9.mp3',
    'https://cdn.pixabay.com/download/audio/2022/02/11/audio_8f5b7e2d8c.mp3',
    'https://cdn.pixabay.com/download/audio/2022/07/13/audio_5b8e1c2a1f.mp3'
];

function getAudioUrl(index) {
    // 循环复用音频池，实现300首歌曲的播放效果
    return audioPool[index % audioPool.length];
}

// ========== 生成300首舞曲数据 ==========
const playlistData = [];

const djNames = [
    'DJ Neon', 'Pulse Master', 'Bass Dropper', 'Cyber Wave',
    'Electric Soul', 'Midnight Raver', 'Synth King', 'Beat Mechanic',
    'Future Sound', 'Dark Glow', 'Aurora Mix', 'Velocity',
    'Phantom Bass', 'Crystal Noise', 'Urban Pulse', 'Shadow Dance'
];

const genres = ['edm', 'house', 'trance', 'bass'];

const titleTemplates = [
    '{adj} Night', 'Electric {noun}', 'Midnight {verb}',
    'Neon {noun}', 'Pulse of {place}', '{verb} the Beat',
    'Lost in {noun}', 'Digital {noun}', 'Underground {noun}',
    'Future {verb}', 'Dark {noun}', 'Cosmic {noun}',
    'Hyper {noun}', 'Vibrant {verb}', 'Echoes of {noun}'
];

const adjectives = ['Endless', 'Savage', 'Luminous', 'Dark', 'Bright', 'Cyber', 'Retro', 'Deep'];
const nouns = ['Dreams', 'Waves', 'Lights', 'Beats', 'Energy', 'Soul', 'Rhythm', 'Bass', 'Vibes', 'Echo'];
const verbs = ['Dancing', 'Running', 'Falling', 'Rising', 'Pumping', 'Dropping', 'Moving'];
const places = ['Tokyo', 'Berlin', 'Ibiza', 'Miami', 'Shanghai', 'London', 'Amsterdam'];

function generateTitle() {
    const template = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    return template
        .replace('{adj}', adjectives[Math.floor(Math.random() * adjectives.length)])
        .replace('{noun}', nouns[Math.floor(Math.random() * nouns.length)])
        .replace('{verb}', verbs[Math.floor(Math.random() * verbs.length)])
        .replace('{place}', places[Math.floor(Math.random() * places.length)]);
}

// 生成300首完整歌曲数据
for (let i = 1; i <= 300; i++) {
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const duration = Math.floor(Math.random() * 180) + 120; // 2-5分钟随机时长
    
    playlistData.push({
        id: i,
        title: generateTitle(),
        artist: djNames[Math.floor(Math.random() * djNames.length)],
        cover: `https://picsum.photos/seed/dj${i}/200/200`,
        url: getAudioUrl(i),
        duration: duration,
        genre: genre,
        bpm: Math.floor(Math.random() * 60) + 120 // 120-180 BPM
    });
}

// ========== 工具函数：格式化时间 ==========
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ========== 渲染歌单列表 ==========
function renderPlaylist(filter = 'all') {
    const container = document.getElementById('playlist');
    const filtered = filter === 'all' 
        ? playlistData 
        : playlistData.filter(song => song.genre === filter);
    
    document.getElementById('totalCount').textContent = `${filtered.length} 首`;
    
    container.innerHTML = filtered.map((song) => {
        const realIndex = playlistData.indexOf(song);
        return `
        <div class="song-item" data-index="${realIndex}">
            <img src="${song.cover}" alt="${song.title}" class="song-item-cover">
            <div class="song-item-info">
                <div class="song-item-title">${song.title}</div>
                <div class="song-item-artist">${song.artist} · ${song.bpm} BPM</div>
            </div>
            <span class="song-item-duration">${formatTime(song.duration)}</span>
        </div>
        `;
    }).join('');
    
    // 绑定歌曲点击事件
    bindSongClick();
}

// 绑定歌曲点击播放
function bindSongClick() {
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            playSong(index);
        });
    });
}

// ========== 分类切换功能 ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPlaylist(btn.dataset.tab);
    });
});

// ========== 搜索功能 ==========
document.getElementById('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase().trim();
    const container = document.getElementById('playlist');
    
    const filtered = playlistData.filter(song => 
        song.title.toLowerCase().includes(keyword) || 
        song.artist.toLowerCase().includes(keyword)
    );
    
    document.getElementById('totalCount').textContent = `${filtered.length} 首`;
    
    container.innerHTML = filtered.map(song => {
        const realIndex = playlistData.indexOf(song);
        return `
        <div class="song-item" data-index="${realIndex}">
            <img src="${song.cover}" alt="${song.title}" class="song-item-cover">
            <div class="song-item-info">
                <div class="song-item-title">${song.title}</div>
                <div class="song-item-artist">${song.artist} · ${song.bpm} BPM</div>
            </div>
            <span class="song-item-duration">${formatTime(song.duration)}</span>
        </div>
        `;
    }).join('');
    
    bindSongClick();
});

// ========== 页面初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
    renderPlaylist();
});
