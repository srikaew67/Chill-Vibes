const baseURL = 'https://raw.githubusercontent.com/srikaew67/Sound/main/';

const sounds = {
    rain: 'rain.mp3',
    song: 'Song.m4a',
    tree: 'tree.mp3',
    keyboard: 'keyboard.mp3',
    air: 'air.mp3',
    book: 'book.mp3',
    song2: 'song2.mp3',
    song3: 'song3.mp3',
    song4: 'song4.mp3',
    train: 'train.m4a',
    lofi: 'lofi.mp3',
};

const defaultVolume = 0.5;

const audios = {};

for (const sound in sounds) {
    if (sounds.hasOwnProperty(sound)) {
        audios[sound] = createAudioElement(baseURL + sounds[sound], defaultVolume);
    }
}

function createAudioElement(src, defaultVolume) {
    const audio = new Audio(src);
    audio.volume = defaultVolume;
    audio.lastVolume = defaultVolume;
    audio.loop = true;
    audio.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    });
    return audio;
}

function toggleAudioPlayback(soundName) {
    const audio = audios[soundName];

    if (audio.paused) {
        playAudio(audio, soundName);
    } else {
        pauseAudio(audio, soundName);
    }
}

function playAudio(audio, soundName) {
    const fadeDuration = 0.5;
    const volumeStep = 0.1;

    audio.volume = 0;
    audio.play();
    fadeIn(audio, fadeDuration, volumeStep);

    const volumeContainer = document.getElementById(soundName + 'VolumeContainer');
    volumeContainer.style.display = 'block';

    if (soundName === 'rain') {
        toggleRainVideoOpacity(true, fadeDuration);
    }
}

function pauseAudio(audio, soundName) {
    const fadeDuration = 0.5;
    const volumeStep = 0.1;

    fadeOut(audio, fadeDuration, volumeStep);

    const volumeContainer = document.getElementById(soundName + 'VolumeContainer');
    volumeContainer.style.display = 'none';

    if (soundName === 'rain') {
        toggleRainVideoOpacity(false, fadeDuration);
    }
}

function fadeIn(audio, duration, step) {
    let volume = audio.volume;
    const interval = setInterval(function () {
        if (volume < audio.lastVolume) {
            volume += step;
            if (volume > audio.lastVolume) volume = audio.lastVolume;
            audio.volume = volume;
        } else {
            clearInterval(interval);
        }
    }, duration * 1000 / 10); // 10 steps for the duration
}

function fadeOut(audio, duration, step) {
    let volume = audio.volume;
    const interval = setInterval(function () {
        if (volume > 0) {
            volume -= step;
            if (volume < 0) volume = 0;
            audio.volume = volume;
        } else {
            clearInterval(interval);
            audio.pause();
        }
    }, duration * 1000 / 10); // 10 steps for the duration
}

// Rest of your code...

// Event listener for play button
document.querySelectorAll('.playButton').forEach(button => {
    button.addEventListener('click', function () {
        const soundName = this.getAttribute('data-sound');
        toggleAudioPlayback(soundName);
        // Add transition class to audio element
        audios[soundName].classList.toggle('transition');
    });
});

// Function to handle volume change
function changeVolume(soundName, volume) {
    const audio = audios[soundName];
    audio.volume = volume / 100;
    audio.lastVolume = volume / 100; // Update last volume
}

// Event listener for volume slider
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', function () {
        const soundName = this.getAttribute('data-sound');
        const volume = this.value;
        changeVolume(soundName, volume);
    });
});

// Function to change opacity of rain and no-rain videos
function toggleRainVideoOpacity(isRainPlaying, fadeDuration) {
    const rainVideo = document.querySelector('.video.rain');
    const noRainVideo = document.querySelector('.video.no-rain');
    
    if (isRainPlaying) {
        rainVideo.style.opacity = 1;
        rainVideo.style.transition = 'opacity ' + fadeDuration + 's ease-in-out';
        noRainVideo.style.opacity = 0;
        noRainVideo.style.transition = 'opacity ' + fadeDuration + 's ease-in-out';
    } else {
        rainVideo.style.opacity = 0;
        rainVideo.style.transition = 'opacity ' + fadeDuration + 's ease-in-out';
        noRainVideo.style.opacity = 1;
        noRainVideo.style.transition = 'opacity ' + fadeDuration + 's ease-in-out';
    }
}
