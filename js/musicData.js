// 歌曲数据 - 300首DJ舞曲
// 说明：示例URL为公开可试听的免费音乐接口，实际使用请替换为有版权的音乐文件

const musicData = [
    // ===== EDM 风格 =====
    {
        id: 1,
        title: "Electric Dreams",
        artist: "Neon Pulse",
        album: "Future Bass Collection",
        duration: "3:45",
        durationSec: 225,
        genre: "edm",
        cover: "https://picsum.photos/seed/dj1/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        tags: ["EDM", "Future Bass"]
    },
    {
        id: 2,
        title: "Midnight City Lights",
        artist: "Synthwave Master",
        album: "Neon Nights",
        duration: "4:12",
        durationSec: 252,
        genre: "edm",
        cover: "https://picsum.photos/seed/dj2/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        tags: ["EDM", "Synthwave"]
    },
    {
        id: 3,
        title: "Bass Drop Kingdom",
        artist: "Subsonic",
        album: "Heavy Bass Vol.2",
        duration: "3:58",
        durationSec: 238,
        genre: "dubstep",
        cover: "https://picsum.photos/seed/dj3/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        tags: ["Dubstep", "Heavy Bass"]
    },
    {
        id: 4,
        title: "Deep Space Journey",
        artist: "Cosmic Beats",
        album: "Trance Universe",
        duration: "5:20",
        durationSec: 320,
        genre: "trance",
        cover: "https://picsum.photos/seed/dj4/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        tags: ["Trance", "Psy"]
    },
    {
        id: 5,
        title: "Underground Groove",
        artist: "Techno Viking",
        album: "Berlin Techno",
        duration: "6:15",
        durationSec: 375,
        genre: "techno",
        cover: "https://picsum.photos/seed/dj5/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        tags: ["Techno", "Minimal"]
    },
    {
        id: 6,
        title: "Summer Vibes",
        artist: "Tropical House DJ",
        album: "Ibiza Sessions",
        duration: "4:02",
        durationSec: 242,
        genre: "house",
        cover: "https://picsum.photos/seed/dj6/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        tags: ["House", "Tropical"]
    },
    {
        id: 7,
        title: "Neon Explosion",
        artist: "Glitch Party",
        album: "EDM Festival Anthems",
        duration: "3:30",
        durationSec: 210,
        genre: "edm",
        cover: "https://picsum.photos/seed/dj7/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        tags: ["EDM", "Big Room"]
    },
    {
        id: 8,
        title: "Disco Revival",
        artist: "Funk Master",
        album: "Nu Disco Nights",
        duration: "4:45",
        durationSec: 285,
        genre: "house",
        cover: "https://picsum.photos/seed/dj8/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        tags: ["House", "Nu Disco"]
    },
    {
        id: 9,
        title: "Dark Matter",
        artist: "Industrial Mind",
        album: "Dark Techno Series",
        duration: "5:50",
        durationSec: 350,
        genre: "techno",
        cover: "https://picsum.photos/seed/dj9/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        tags: ["Techno", "Industrial"]
    },
    {
        id: 10,
        title: "Euphoric Sunrise",
        artist: "Dream State",
        album: "Vocal Trance Hits",
        duration: "4:55",
        durationSec: 295,
        genre: "trance",
        cover: "https://picsum.photos/seed/dj10/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
        tags: ["Trance", "Vocal"]
    },
    {
        id: 11,
        title: "Wobble Bass",
        artist: "Filth Mode",
        album: "Dubstep Warzone",
        duration: "3:40",
        durationSec: 220,
        genre: "dubstep",
        cover: "https://picsum.photos/seed/dj11/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
        tags: ["Dubstep", "Brostep"]
    },
    {
        id: 12,
        title: "Deep House Sessions",
        artist: "Smooth Groove",
        album: "Late Night Deep",
        duration: "5:10",
        durationSec: 310,
        genre: "house",
        cover: "https://picsum.photos/seed/dj12/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
        tags: ["House", "Deep House"]
    },
    {
        id: 13,
        title: "Festival Anthem",
        artist: "Main Stage Kings",
        album: "EDM Carnival",
        duration: "3:25",
        durationSec: 205,
        genre: "edm",
        cover: "https://picsum.photos/seed/dj13/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
        tags: ["EDM", "Festival"]
    },
    {
        id: 14,
        title: "Acid Dreams",
        artist: "Roland TB-303",
        album: "Acid Techno Classics",
        duration: "6:30",
        durationSec: 390,
        genre: "techno",
        cover: "https://picsum.photos/seed/dj14/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
        tags: ["Techno", "Acid"]
    },
    {
        id: 15,
        title: "Uplifting Energy",
        artist: "Sky High",
        album: "Trance Ascension",
        duration: "5:40",
        durationSec: 340,
        genre: "trance",
        cover: "https://picsum.photos/seed/dj15/200/200",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
        tags: ["Trance", "Uplifting"]
    }
];

// 自动生成更多歌曲，凑齐300首（演示用，名称随机生成）
function generateMoreSongs() {
    const genres = ['edm', 'house', 'techno', 'trance', 'dubstep'];
    const adjectives = ['Cyber', 'Neon', 'Electric', 'Dark', 'Bright', 'Deep', 'Heavy', 'Light', 'Cosmic', 'Digital', 'Retro', 'Future', 'Hyper', 'Ultra', 'Mega'];
    const nouns = ['Beat', 'Bass', 'Pulse', 'Wave', 'Sound', 'Vibe', 'Groove', 'Rhythm', 'Drop', 'Melody', 'Synth', 'Drum', 'Loop', 'FX', 'Mix'];
    const artists = ['DJ Nova', 'Beat Master', 'Bass King', 'Synth Queen', 'Rhythm Doctor', 'Loop Wizard', 'Drop Master', 'Vibe Creator', 'Sound Engineer', 'Mixologist'];
    
    for (let i = 16; i <= 300; i++) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const artist = artists[Math.floor(Math.random() * artists.length)];
        const genre = genres[Math.floor(Math.random() * genres.length)];
        const duration = Math.floor(Math.random() * 180) + 180; // 3-6分钟
        const minutes = Math.floor(duration / 60);
        const seconds = duration % 60;
        
        musicData.push({
            id: i,
            title: `${adj} ${noun} ${Math.floor(Math.random() * 99)}`,
            artist: artist,
            album: `${genre.toUpperCase()} Collection Vol.${Math.floor(Math.random() * 10) + 1}`,
            duration: `${minutes}:${seconds.toString().padStart(2, '0')}`,
            durationSec: duration,
            genre: genre,
            cover: `https://picsum.photos/seed/dj${i}/200/200`,
            url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 16) + 1}.mp3`,
            tags: [genre.charAt(0).toUpperCase() + genre.slice(1)]
        });
    }
}

generateMoreSongs();
