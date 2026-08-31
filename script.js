document.addEventListener('DOMContentLoaded', () => {
    // --- Podcast Episodes Data ---
    // To add a new episode, just add a new object to the top of this array!
    const episodes = [
        {
            title: "Episode 29: audio_magic_eraser",
            date: "Aug 31, 2026",
            fileUrl: "WeekOfAug31.wav"
        },
        {
            title: "Episode 28: audio_magic_eraser",
            date: "Aug 23, 2026",
            fileUrl: "WeekOfAug23.wav"
        },
        {
            title: "Episode 27: AI reward hacking",
            date: "Aug 16, 2026",
            fileUrl: "WeekOfAug16.wav"
        },
        {
            title: "Episode 26: Unsanctioned agents & brain drain",
            date: "Aug 11, 2026",
            fileUrl: "WeekOfAug11.wav"
        },
        {
            title: "Episode 25: Software is now autonomous labor",
            date: "Aug 3, 2026",
            fileUrl: "WeekOfAug3.wav"
        },
        {
            title: "Episode 24: Why botsitting threatens enterprise AI productivity",
            date: "Jul 26, 2026",
            fileUrl: "WeekOfJul26.wav"
        },
        {
            title: "Episode 23: audio_magic_eraser",
            date: "Jul 19, 2026",
            fileUrl: "WeekOfJul19.wav"
        },
        {
            title: "Episode 22: audio_magic_eraser",
            date: "Jul 12, 2026",
            fileUrl: "WeekOfJul12.wav"
        },
        {
            title: "Episode 21: audio_magic_eraser",
            date: "Jul 6, 2026",
            fileUrl: "WeekOfJul6.wav"
        },
        {
            title: "Episode 20: Government Export Controls Reshape AI Landscape Overnight",
            date: "Jun 28, 2026",
            fileUrl: "WeekOfJun28.wav"
        },
        {
            title: "Episode 19: audio_magic_eraser",
            date: "Jun 21, 2026",
            fileUrl: "WeekOfJun21.wav"
        },
        {
            title: "Episode 18: OpenAI Goes Public, Claude Fable Suspended",
            date: "Jun 15, 2026",
            fileUrl: "WeekOfJun15.wav"
        },
        {
            title: "Episode 17: Microsoft Dominates Enterprise AI With Specialized Models",
            date: "Jun 8, 2026",
            fileUrl: "WeekOfJun8.wav"
        },
        {
            title: "Episode 16: Anthropic's Trillion Dollar Agent Economy Boom",
            date: "May 31, 2026",
            fileUrl: "WeekOfMay31.wav"
        },
        {
            title: "Episode 15: Google and Microsoft Weaponize AI Agents",
            date: "May 24, 2026",
            fileUrl: "WeekOfMay24.wav"
        },
        {
            title: "Episode 14: Nations Race for AI Citizenship Benefits",
            date: "May 17, 2026",
            fileUrl: "WeekOfMay17.wav"
        },
        {
            title: "Episode 13: Regulation Eases While Enterprise AI Agents Rise",
            date: "May 10, 2026",
            fileUrl: "WeekOfMay10.wav"
        },
        {
            title: "Episode 12: OpenAI breaks free, multicloud era begins",
            date: "May 3, 2026",
            fileUrl: "WeekOfMay3.wav"
        },
        {
            title: "Episode 11: Enterprise Agents Dominate AI's Hardware Hunger Race",
            date: "Apr 26, 2026",
            fileUrl: "WeekOfApr26.wav"
        },
        {
            title: "Episode 10: Managing The Agentic Shadow Org",
            date: "Apr 19, 2026",
            fileUrl: "WeekOfApr19.wav"
        },
        {
            title: "Episode 9: The shift to Work AGI",
            date: "Apr 12, 2026",
            fileUrl: "WeekOfApr12.wav"
        }
    ];

    let currentEpisodeIndex = 0;

    // DOM Elements
    const audioElement = document.getElementById('audio-element');
    const controlsSection = document.getElementById('controls-section');
    const trackTitleDisplay = document.getElementById('track-title');
    const trackDateDisplay = document.getElementById('track-date');
    const playlistContainer = document.getElementById('playlist-container');

    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');

    const progressBarWrapper = document.getElementById('progress-bar-wrapper');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeDisplay = document.getElementById('current-time');
    const durationDisplay = document.getElementById('duration');

    const slowerBtn = document.getElementById('slower-btn');
    const fasterBtn = document.getElementById('faster-btn');
    const speedDisplay = document.getElementById('speed-display');

    let currentSpeed = 1.0;
    const SPEED_STEP = 0.25;
    const MIN_SPEED = 0.25;
    const MAX_SPEED = 3.0;

    // Format time in MM:SS
    function formatTime(seconds) {
        if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Initialize the Web Player
    function initPlayer() {
        renderPlaylist();
        loadEpisode(0, false); // Load the newest episode (first in array), don't auto-play on initial load
    }

    // Render the Playlist HTML
    function renderPlaylist() {
        playlistContainer.innerHTML = ''; // Clear container

        episodes.forEach((ep, index) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            // We'll update the 'active' class dynamically in loadEpisode

            item.innerHTML = `
                <div class="playlist-item-icon">
                    <i class="fas fa-play" id="icon-${index}"></i>
                </div>
                <div class="playlist-item-content">
                    <div class="ep-title">${ep.title}</div>
                    <div class="ep-date">${ep.date}</div>
                </div>
            `;

            // Click handler to play this specific track
            item.addEventListener('click', () => {
                if (currentEpisodeIndex === index) {
                    // If clicking the already playing track, just toggle play/pause
                    togglePlayPause();
                } else {
                    // Otherwise, load and play the new track
                    loadEpisode(index, true);
                }
            });

            playlistContainer.appendChild(item);
        });
    }

    // Load a specific episode
    function loadEpisode(index, autoPlay = true) {
        currentEpisodeIndex = index;
        const episode = episodes[index];

        // Update UI Text
        trackTitleDisplay.textContent = episode.title;
        trackDateDisplay.textContent = episode.date;

        // Update Audio Source
        audioElement.src = episode.fileUrl;
        audioElement.playbackRate = currentSpeed; // Restore global speed preference

        // Reset Player UI
        progressBar.style.width = '0%';
        currentTimeDisplay.textContent = '0:00';

        // Update Playlist Active States
        updatePlaylistUI();

        if (autoPlay) {
            audioElement.play().catch(e => console.error("Playback failed (maybe auto-play policy)", e));
            setUIPlaying();
        } else {
            setUIPaused();
        }
    }

    // Helper: Update active class and icons in the playlist
    function updatePlaylistUI() {
        const items = playlistContainer.querySelectorAll('.playlist-item');
        items.forEach((item, i) => {
            const icon = document.getElementById(`icon-${i}`);

            if (i === currentEpisodeIndex) {
                item.classList.add('active');
                icon.className = audioElement.paused ? 'fas fa-play' : 'fas fa-pause';
                icon.style.transform = audioElement.paused ? 'translateX(1px)' : 'translateX(0)';
            } else {
                item.classList.remove('active');
                icon.className = 'fas fa-play';
                icon.style.transform = 'translateX(1px)';
            }
        });
    }

    // Helper: Set main play button state
    function setUIPlaying() {
        playIcon.className = 'fas fa-pause';
        playIcon.style.transform = 'translateX(0)';
        updatePlaylistUI(); // Sync mini icon
    }

    function setUIPaused() {
        playIcon.className = 'fas fa-play';
        playIcon.style.transform = 'translateX(2px)';
        updatePlaylistUI(); // Sync mini icon
    }

    function togglePlayPause() {
        if (!audioElement.src) return;

        if (audioElement.paused) {
            audioElement.play().catch(e => console.error("Playback failed", e));
            setUIPlaying();
        } else {
            audioElement.pause();
            setUIPaused();
        }
    }

    // Audio Metadata Loaded
    audioElement.addEventListener('loadedmetadata', () => {
        durationDisplay.textContent = formatTime(audioElement.duration);
    });

    // Play/Pause Main Button Toggle
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Update Progress Bar
    audioElement.addEventListener('timeupdate', () => {
        if (!audioElement.duration) return;
        const progress = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.style.width = `${progress}%`;
        currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
    });

    // Seek in Audio
    progressBarWrapper.addEventListener('click', (e) => {
        if (!audioElement.src || isNaN(audioElement.duration)) return;

        const rect = progressBarWrapper.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;

        const percentage = clickX / width;
        audioElement.currentTime = percentage * audioElement.duration;
    });

    // Update speed display and audio rate
    function updateSpeed() {
        audioElement.playbackRate = currentSpeed;
        speedDisplay.textContent = `${currentSpeed.toFixed(2).replace(/\.00$/, '.0')}x`;
    }

    // Speed Controls
    slowerBtn.addEventListener('click', () => {
        if (currentSpeed > MIN_SPEED) {
            currentSpeed = Math.max(MIN_SPEED, currentSpeed - SPEED_STEP);
            updateSpeed();
        }
    });

    fasterBtn.addEventListener('click', () => {
        if (currentSpeed < MAX_SPEED) {
            currentSpeed = Math.min(MAX_SPEED, currentSpeed + SPEED_STEP);
            updateSpeed();
        }
    });

    // Reset UI when audio ends, optionally auto-play next track
    audioElement.addEventListener('ended', () => {
        setUIPaused();
        progressBar.style.width = '100%';
        audioElement.currentTime = 0;

        // Auto-play the next oldest episode (index + 1) if it exists
        if (currentEpisodeIndex + 1 < episodes.length) {
            loadEpisode(currentEpisodeIndex + 1, true);
        }
    });

    // Start everything up
    initPlayer();
});
