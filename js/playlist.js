// 示例歌单数据（300首结构模板，实际使用替换为真实音乐源）
// 注意：以下URL仅为示例结构，需替换为合法授权的音乐地址
const playlistData = [];

// 生成300首示例数据
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

// 生成300首歌曲数据
for (let i = 1; i <= 300; i++) {
    const genre = genres[Math.floor(Math.random() * genres.length)];
    const duration = Math.floor(Math.random() * 180) + 120; // 2-5分钟
    
    playlistData.push({
        id: i,
        title: generateTitle(),
        artist: djNames[Math.floor(Math.random() * djNames.length)],
        cover: `https://picsum.photos/seed/dj${i}/200/200`,
        // ⚠️ 以下为示例音频地址，实际使用请替换为合法音乐源
        url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`,
        duration: duration,
        genre: genre,
        bpm: Math.floor(Math.random() * 60) + 120
    });
}

// 格式化时间
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 渲染歌单
function renderPlaylist(filter = 'all') {
    const container = document.getElementById('playlist');
    const filtered = filter === 'all' 
        ? playlistData 
        : playlistData.filter(song => song.genre === filter);
    
    document.getElementById('totalCount').textContent = `${filtered.length} 首`;
    
    container.innerHTML = filtered.map((song, index) => `
        <div class="song-item" data-index="${playlistData.indexOf(song)}">
            <img src="${song.cover}" alt="${song.title}" class="song-item-cover">
            <div class="song-item-info">
                <div class="song-item-title">${song.title}</div>
                <div class="song-item-artist">${song.artist} · ${song.bpm} BPM</div>
            </div>
            <span class="song-item-duration">${formatTime(song.duration)}</span>
        </div>
    `).join('');
    
    // 绑定点击事件
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            playSong(index);
        });
    });
}

// 分类切换
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPlaylist(btn.dataset.tab);
    });
});

// 搜索功能
document.getElementById('searchInput').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const container = document.getElementById('playlist');
    
    const filtered = playlistData.filter(song => 
        song.title.toLowerCase().includes(keyword) || 
        song.artist.toLowerCase().includes(keyword)
    );
    
    document.getElementById('totalCount').textContent = `${filtered.length} 首`;
    
    container.innerHTML = filtered.map(song => `
        <div class="song-item" data-index="${playlistData.indexOf(song)}">
            <img src="${song.cover}" alt="${song.title}" class="song-item-cover">
            <div class="song-item-info">
                <div class="song-item-title">${song.title}</div>
                <div class="song-item-artist">${song.artist} · ${song.bpm} BPM</div>
            </div>
            <span class="song-item-duration">${formatTime(song.duration)}</span>
        </div>
    `).join('');
    
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            playSong(index);
        });
    });
});

// 初始化
renderPlaylist();
