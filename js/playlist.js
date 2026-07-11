// ========== 降级备用音频池（API失效时自动使用） ==========
const audioPool = [
    'https://cdn.pixabay.com/download/audio/2022/10/25/audio_946b7e50e7.mp3',
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3',
    'https://cdn.pixabay.com/download/audio/2023/01/09/audio_31c5716b0f.mp3',
    'https://cdn.pixabay.com/download/audio/2022/08/23/audio_d08cc950b3.mp3',
    'https://cdn.pixabay.com/download/audio/2021/11/25/audio_002f86c70d.mp3',
    'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3'
];

// ========== 伤感情歌单配置（可自行替换网易云歌单ID） ==========
const playlistMap = {
    all: '7138570252',      // 综合：华语伤感·深夜必听
    huayu: '5042622681',    // 华语催泪情歌
    yueyu: '1164101204',    // 粤语经典伤感
    classic: '923981237',   // 年代金曲伤感
    emo: '6723962964'       // 深夜EMO治愈
};

const API_BASE = 'https://api.injahow.cn/meting';
let playlistData = [];

// ========== 工具函数：格式化时间 ==========
function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ========== 加载真实歌单 ==========
async function loadPlaylist(playlistId) {
    const container = document.getElementById('playlist');
    const countEl = document.getElementById('totalCount');
    
    container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-sub)">歌单加载中...</div>';
    
    try {
        const res = await fetch(`${API_BASE}/?type=playlist&id=${playlistId}&server=netease`);
        const data = await res.json();
        
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('歌单数据为空');
        }

        playlistData = data.map((item) => ({
            id: item.id,
            title: item.name,
            artist: item.artist,
            cover: item.pic,
            url: item.url || '',
            duration: item.time / 1000
        }));
        
        countEl.textContent = `${playlistData.length} 首`;
        renderCurrentPlaylist();
        
    } catch (err) {
        console.warn('歌单加载失败，使用演示数据:', err);
        generateDemoPlaylist();
        renderCurrentPlaylist();
    }
}

// ========== 本地演示数据（降级备用） ==========
function generateDemoPlaylist() {
    const singers = ['周杰伦', '林俊杰', '陈奕迅', '薛之谦', '毛不易', '张惠妹', '梁静茹'];
    const titles = ['晴天', '后来', '十年', '平凡之路', '演员', '遇见', '匆匆那年', '消愁'];
    
    playlistData = [];
    for (let i = 0; i < 50; i++) {
        playlistData.push({
            id: i + 1,
            title: titles[i % titles.length],
            artist: singers[i % singers.length],
            cover: `https://picsum.photos/seed/sad${i}/200/200`,
            url: audioPool[i % audioPool.length],
            duration: Math.floor(Math.random() * 180) + 180
        });
    }
    document.getElementById('totalCount').textContent = `${playlistData.length} 首`;
}

// ========== 渲染歌单列表 ==========
function renderCurrentPlaylist() {
    const container = document.getElementById('playlist');
    
    container.innerHTML = playlistData.map((song, index) => `
        <div class="song-item" data-index="${index}">
            <img src="${song.cover}" alt="${song.title}" class="song-item-cover">
            <div class="song-item-info">
                <div class="song-item-title">${song.title}</div>
                <div class="song-item-artist">${song.artist}</div>
            </div>
            <span class="song-item-duration">${formatTime(song.duration)}</span>
        </div>
    `).join('');
    
    bindSongClick();
}

// ========== 绑定歌曲点击事件 ==========
function bindSongClick() {
    document.querySelectorAll('.song-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.index);
            playSong(index);
        });
    });
}

// ========== 分类切换 ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.tab;
        if (playlistMap[category]) {
            loadPlaylist(playlistMap[category]);
        }
    });
});

// ========== 实时搜索 ==========
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
                <div class="song-item-artist">${song.artist}</div>
            </div>
            <span class="song-item-duration">${formatTime(song.duration)}</span>
        </div>
        `;
    }).join('');
    
    bindSongClick();
});

// ========== 页面初始化 ==========
window.addEventListener('DOMContentLoaded', () => {
    loadPlaylist(playlistMap.all);
});
