const audioElem = document.querySelector('.music-player__audio');
const playerPlayBtn = document.querySelector('.control:nth-child(2)');
const playerImage = document.querySelector('.image__music-img');
const musicPlayerContainer = document.querySelector('.container__music-player');
const volumeSlider = document.querySelector('.volume-range');
const repeatVolume = document.querySelector('.setting:nth-child(2)');
const qualityBtn = document.querySelector('.setting:nth-child(3)');

// for Switching between Hd and non Hd
let currentTime;
let isHD = false;
// current Playing Music Object
let currentMusic;
let isPlaying;
let defaultVolume = .2;

async function getMusic(id) {
    const url = `https://haji-api.ir/music?q=info&t=${id}`;
    const response = await fetch(url);
    const musicObj = response.json();

    return musicObj;
}

async function playEntireMusic(e,musicId) {
    currentMusic = await getMusic(musicId);
    audioElem.src = currentMusic.audio.medium.url;

    // when everything is ready , play the music
   audioElem.addEventListener('canplay', () => {
        playerImage.src = currentMusic.image.thumbnail_small.url;
        audioElem.volume = defaultVolume;
        musicPlayerContainer.style.display = 'block';
        playMusic();
    }); 


    setRequirementEvents();
}

function setRequirementEvents() {
    // for Volume changing
    volumeSlider.addEventListener('input',handleAudioVolume);
    // for loop controlling
    repeatVolume.addEventListener('click',handleReapetOrNot);
    // for switching between qualities
    qualityBtn.addEventListener('click', handleAudioQuality);
    // for playing and pausing
    playerPlayBtn.addEventListener('click', handlePlayerPauseOrClick);
    // for music ProgressBar
    audioElem.addEventListener('timeupdate',handleProgressBar);
    // for reseting progressBar
    audioElem.addEventListener('ended',resetProgressBarWidth);
}

function handleProgressBar(){
    musicPlayerContainer.style.setProperty('--progress-width',`${audioElem.currentTime ?? /* nullish operator */ 0 / audioElem.duration * 100}%`);
}

function resetProgressBarWidth() {
    musicPlayerContainer.style.setProperty('--progress-width','0');
}

function handlePlayerPauseOrClick() {
    // if music is Playing then pause the music and else 
    if(isPlaying){
        pauseMusic();
    }else{
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    playerPlayBtn.firstElementChild.className = 'ri-pause-line';

    audioElem.play();
}

function pauseMusic() {
    isPlaying = false;
    playerPlayBtn.firstElementChild.className = 'ri-play-line';

    audioElem.pause();   
}

function handleReapetOrNot() {
    // if loop is true then turn it to false and else
    if(audioElem.loop){
        audioElem.loop = false;
    }else{
        audioElem.loop = true;
    }
}

function handleAudioVolume(e) {
    defaultVolume = e.target.value / 100;
    audioElem.volume = defaultVolume;
}


function handleAudioQuality() {
    // pause the music , save the currentTime, change the url , play the music from saved Time
    audioElem.pause();
    currentTime = audioElem.currentTime;
    isHD = !isHD;

    if(isHD){
        audioElem.src = currentMusic.audio.high.url;
    }else{
        audioElem.src = currentMusic.audio.medium.url;
    }

    audioElem.currentTime = currentTime;
    audioElem.play();
}
