document.addEventListener('DOMContentLoaded', () => {
    // --- Podcast Episodes Data ---
    // To add a new episode, just add a new object to the top of this array!
    const episodes = [
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
        },
        {
            title: "Episode 8: Could Work AGI replace middle management?",
            date: "Apr 5, 2026",
            fileUrl: "WeekOfApr5.wav"
        },
        {
            title: "Episode 7: OpenAI Kills Sora For Work AGI",
            date: "Mar 29, 2026",
            fileUrl: "WeekOfMar29.wav"
        },
        {
            title: "Episode 6: Agents, Mini Models, and the Copyright Wars Begin",
            date: "Mar 22, 2026",
            fileUrl: "WeekofMar22.wav"
        },
        {
            title: "Episode 5: Agent Era Accelerates - Workflow Transformations",
            date: "Mar 15, 2026",
            fileUrl: "WeekofMar15.wav"
        },
        {
            title: "Episode 4: Business Strategy for the Agent Age",
            date: "Mar 8, 2026",
            fileUrl: "WeekofMar8.wav"
        },
        {
            title: "Episode 3: The Agentic Takeover and the Memory Squeeze",
            date: "Mar 1, 2026",
            fileUrl: "WeekofMar1.wav"
        },
        {
            title: "Episode 2: The Capital Flywheel and Agentic Workflows",
            date: "Feb 22, 2026",
            fileUrl: "WeekofFeb22.wav"
        },
        {
            title: "Episode 1: Anthropic's $380B Bet on AI Agents and More",
            date: "Feb 16, 2026",
            fileUrl: "WeekofFeb16.wav"
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
