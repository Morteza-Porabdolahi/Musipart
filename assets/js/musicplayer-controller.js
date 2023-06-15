import { getSingleMusic } from "./api/music-api.js";
import { showAlert, hideAlert } from "./utils/alert.js";
import { _ } from "./utils/general.js";

const audioElem = _.querySelector(".music-player__audio");
const playerPlayBtn = _.querySelector(".control:nth-child(2)");
// the music player image
const playerImage = _.querySelector(".image__music-img");
const musicPlayerContainer = _.querySelector(".container__music-player");
const volumeSlider = _.querySelector(".volume-range");
const repeatSong = _.querySelector(".setting:nth-child(2)");
const qualityBtn = _.querySelector(".setting:nth-child(3)");
const progressBar = _.querySelector(".music-player__progress");
const musicName = _.querySelector(
  ".controls-container__description > .informations__music-name"
);
const artistsName = _.querySelector(
  ".controls-container__description > .informations__music-artist"
);

let currentTime;
let currentMusic;
// for Switching between Hd and non Hd quality
let isHD = false;
let isPlaying = false;
let defaultVolume = +localStorage.getItem("player-volume") || 0.2;

volumeSlider.value = defaultVolume * 100;

/*
 * this function is set as an onclick event on music cards play buttons
 * @function playEntireMusic
 * @param {string} musicId - the id of music
 */
window.playEntireMusic = async function (musicId) {
  try {
    showAlert("loading", "Loading...");

    currentMusic = await getSingleMusic(musicId);

    pauseMusic();
    musicPlayerContainer.style.display = "none";

    audioElem.src = currentMusic.audio.medium.url;

    audioElem.addEventListener("canplay", playTheAudioWhenReady);
    audioElem.addEventListener("error", handleAudioElemErrors);
  } catch (e) {
    if (e.message) {
      showAlert("error", e.message, 2000);
    }
  }
};

function handleAudioElemErrors() {
  hideAlert();

  showAlert("error", "The audio could not loaded successfully !", 2000);
}

function playTheAudioWhenReady() {
  setRequirementEvents();

  playerImage.src = currentMusic.image.thumbnail_small.url;
  playerImage.alt = currentMusic.title;
  musicName.textContent = currentMusic.title;
  artistsName.textContent = currentMusic.artists.map(
    (artist) => artist.fullName
  );
  audioElem.volume = defaultVolume;

  musicPlayerContainer.style.display = "block";

  hideAlert();
  playMusic();
}

function setRequirementEvents() {
  volumeSlider.addEventListener("input", handleAudioVolume);
  repeatSong.addEventListener("click", handleReapetOrNot);
  qualityBtn.addEventListener("click", handleAudioQuality);
  playerPlayBtn.addEventListener("click", handlePlayerPauseOrClick);
  audioElem.addEventListener("timeupdate", handleProgressBar);
  audioElem.addEventListener("ended", resetProgressBarWidth);
  // for current time customization
  progressBar.addEventListener("click", setCurrentTime);
}

/*
 * handles the progress bar width when music is playing
 * @function handleProgressBar
 */
function handleProgressBar() {
  musicPlayerContainer.style.setProperty(
    "--progress-width",
    `${(audioElem.currentTime / audioElem.duration) * 100}%`
  );
}

/*
 * pauses the music and resets the progress bar width
 * @function resetProgressBarWidth
 */
function resetProgressBarWidth() {
  pauseMusic();

  musicPlayerContainer.style.setProperty("--progress-width", "0");
}

/*
 * handles the playing or pausing of the music
 * @function handlePlayerPauseOrClick
 */
function handlePlayerPauseOrClick() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  isPlaying = true;
  playerPlayBtn.firstElementChild.src = "/assets/icons/pause-mini-line.svg";

  audioElem.play();
}

function pauseMusic() {
  isPlaying = false;
  playerPlayBtn.firstElementChild.src = "/assets/icons/play-mini-line.svg";

  audioElem.pause();
}

function handleReapetOrNot() {
  audioElem.loop = !audioElem.loop;

  showAlert(
    "done",
    `Repeat Mode is Now ${audioElem.loop ? "Enabled" : "Disabled"}`,
    2000
  );
}

/*
 * handles the audio volume using the <progress> tag in html
 * @function handleAudioVolume
 * @param {object} e - event Object
 */
function handleAudioVolume(e) {
  defaultVolume = e.target.value / 100;

  localStorage.setItem("player-volume", defaultVolume);
  audioElem.volume = defaultVolume;
}

function handleAudioQuality() {
  //  save the currentTime, change the url , play the music from saved Time
  currentTime = audioElem.currentTime;
  isHD = !isHD;

  resetProgressBarWidth();
  audioElem.src = currentMusic.audio[`${isHD ? "high" : "medium"}`].url;
  audioElem.currentTime = currentTime;
  
  playMusic();

  showAlert("done", `HD Mode is Now ${isHD ? "Enabled" : "Disabled"}`,1500);
}

/*
 * sets the current time of the music when clicked on progress bar
 * @function setCurrentTime
 * @param {object} e - event Object
 */
function setCurrentTime(e) {
  const clickedWidth = e.offsetX;
  const calcWidth = (clickedWidth / e.target.offsetWidth) * 100;

  musicPlayerContainer.style.setProperty("--progress-width", `${calcWidth}%`);

  audioElem.currentTime = (calcWidth / 100) * audioElem.duration;
}
