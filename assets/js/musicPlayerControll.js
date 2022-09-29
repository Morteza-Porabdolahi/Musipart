// the <audio> tag
const audioElem = document.querySelector('.music-player__audio');
// the music player play button
const playerPlayBtn = document.querySelector('.control:nth-child(2)');
// the music player image
const playerImage = document.querySelector('.image__music-img');
// music container itself
const musicPlayerContainer = document.querySelector('.container__music-player');
const volumeSlider = document.querySelector('.volume-range');
// repeat song Button
const repeatSong = document.querySelector('.setting:nth-child(2)');
// change quality Button
const qualityBtn = document.querySelector('.setting:nth-child(3)');
// the song progress bar
const progressBar = document.querySelector('.music-player__progress');

const musicName = document.querySelector('.controls-container__description > .informations__music-name');
const artistsName = document.querySelector('.controls-container__description > .informations__music-artist');

let currentTime;
// for Switching between Hd and non Hd quality
let isHD = false;
let isPlaying;
let defaultVolume = .2;

async function getMusic(id) {
  const url = `https://haji-api.ir/music?q=info&t=${id}`;

  try{
    showAlert('loading','Loading...');

    const response = await fetch(url);
    const musicObj = response.json();

    return musicObj;

  } catch(e){
    if(e) {
      showAlert('error','An error occured !');
      setTimeout(hideAlert, 1000);
    }
  }
}

// this function is set to music cards play buttons (shows when hovers on music cards)
async function playEntireMusic(e,musicId) {
  musicPlayerContainer.style.display = 'none';
  pauseMusic();

  // get the musicObj and save it in a global varriable called currentMusic
  window.currentMusic = await getMusic(musicId);
  audioElem.src = currentMusic.audio.medium.url;

  // when everything is ready , play the music
  audioElem.addEventListener('canplay', () => {
    setRequirementEvents();

    playerImage.src = currentMusic.image.thumbnail_small.url;
    playerImage.alt = currentMusic.title;

    musicName.textContent = currentMusic.title;
    artistsName.textContent = currentMusic.artists.map(artist => artist.fullName);

    audioElem.volume = defaultVolume;

    musicPlayerContainer.style.display = 'block';

    hideAlert();
    playMusic();
  }); 


}

function setRequirementEvents() {
    // for Volume changing
    volumeSlider.addEventListener('input',handleAudioVolume);
    // for loop controlling
    repeatSong.addEventListener('click',handleReapetOrNot);
    // for switching between qualities
    qualityBtn.addEventListener('click', handleAudioQuality);
    // for playing and pausing
    playerPlayBtn.addEventListener('click', handlePlayerPauseOrClick);
    // for music ProgressBar
    audioElem.addEventListener('timeupdate',handleProgressBar);
    // for reseting progressBar
    audioElem.addEventListener('ended',resetProgressBarWidth);
    // for current time customization 
    progressBar.addEventListener('click', setCurrentTime);
}

function handleProgressBar(){
    musicPlayerContainer.style.setProperty('--progress-width',`${(audioElem.currentTime / audioElem.duration) * 100}%`);
}

function resetProgressBarWidth() {
    pauseMusic();

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

    showAlert('done',`Repeat Mode is Now ${audioElem.loop ? 'Enabled' : 'Disabled' }`);
    setTimeout(hideAlert, 1000);
}

function handleAudioVolume(e) {
    defaultVolume = e.target.value / 100;
    audioElem.volume = defaultVolume;
}


function handleAudioQuality() {
    // pause the music , save the currentTime, change the url , play the music from saved Time
    currentTime = audioElem.currentTime;
    isHD = !isHD;

    showAlert('done',`HD Mode is Now ${isHD ? 'Enabled' : 'Disabled' }`);
    setTimeout(hideAlert, 1000);

    if(isHD){
        audioElem.src = currentMusic.audio.high.url;
    }else{
        audioElem.src = currentMusic.audio.medium.url;
    }

    audioElem.currentTime = currentTime;
    playMusic();
}

function setCurrentTime(e) {
    const clickedWidth = e.offsetX;
    const calcWidth = (clickedWidth / e.target.offsetWidth) * 100;

    musicPlayerContainer.style.setProperty('--progress-width',`${calcWidth}%`);

    audioElem.currentTime = (calcWidth / 100) * audioElem.duration;
}
