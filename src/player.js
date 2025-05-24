document.addEventListener("DOMContentLoaded", () => {
    const musicDir = "./src/music/";
    const player = new Audio();
    const playPauseBtn = document.getElementById("play-pause-btn");
    const songNameElem = document.getElementById("song-name");
    const volumeSlider = document.getElementById("volume-slider");
    const volumeIcon = document.getElementById("volume-icon");
    const currentTimeElem = document.getElementById("current-time");
    const totalTimeElem = document.getElementById("total-time");

    let playlist = [];
    let index = 0;

    document.body.onkeyup = function(e) {
        if (e.key == " " ||
            e.code == "Space" ||      
            e.keyCode == 32      
        ) {
            togglePlayPause()
        }
    }

    async function loadMusicFiles() {
        try {
            const response = await fetch(musicDir);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            playlist = Array.from(doc.querySelectorAll("a"))
                .map(a => a.href)
                .filter(href => href.endsWith(".mp3"))
                .map(href => new URL(href).pathname.replace(musicDir, ""));
            
            if (playlist.length === 0) {
                console.error("No music files found.");
                return;
            }

            shuffle(playlist);
            loadTrack();
        } catch (error) {
            console.error("Error loading music files:", error);
        }
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function loadTrack() {
        if (playlist.length === 0) return;
        player.src = musicDir + playlist[index];
        songNameElem.textContent = decodeURIComponent(playlist[index])
            .replace(/^\/|\.mp3$/g, "") 
            .replace(/_/g, " ");
        player.load();
    }

    function playNext() {
        index = (index + 1) % playlist.length;
        loadTrack();
        player.play();
    }

    function togglePlayPause() {
        if (player.paused) {
            player.play();
            playPauseBtn.textContent = "\u23F8"; // ⏸
        } else {
            player.pause();
            playPauseBtn.textContent = "\u25B6"; // ▶
        }
    }

    player.volume = volumeSlider.value;

    volumeSlider.addEventListener("input", () => {
        player.volume = volumeSlider.value;
        updateVolumeIcon();
    });

    volumeIcon.addEventListener("click", () => {
        if (player.volume > 0) {
            player.dataset.prevVolume = player.volume;
            player.volume = 0;
            volumeSlider.value = 0;
        } else {
            player.volume = player.dataset.prevVolume || 1;
            volumeSlider.value = player.volume;
        }
        updateVolumeIcon();
    });

    function updateVolumeIcon() {
        if (player.volume == 0) {
            volumeIcon.textContent = "🔇";
        } else if (player.volume < 0.5) {
            volumeIcon.textContent = "🔉";
        } else {
            volumeIcon.textContent = "🔊";
        }
    }

    player.addEventListener("ended", playNext);
    playPauseBtn.addEventListener("click", togglePlayPause);

    player.addEventListener("timeupdate", () => {
        //    progressBar.value = (player.currentTime / player.duration) * 100 || 0;
            currentTimeElem.textContent = formatTime(player.currentTime);
            totalTimeElem.textContent = formatTime(player.duration);
        });
    
        //progressBar.addEventListener("input", () => {
        //    player.currentTime = (progressBar.value / 100) * player.duration;
        //});
    
        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
            if (min == "NaN") {
                return "00:00"
            } else if (sec == "NaN") {
                return "00:00"
            } else {
                return `${min}:${sec}`;
            }
    }

    loadMusicFiles();
});