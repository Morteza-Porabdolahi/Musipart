import { getSingleMusic } from "./utils/musicApi.js";
import { showAlert, hideAlert } from "./utils/alert.js";
import { _ } from "./utils/general.js";

// the <audio> tag
const audioElem = _.querySelector(".music-player__audio");
// the music player play button
const playerPlayBtn = _.querySelector(".control:nth-child(2)");
// the music player image
const playerImage = _.querySelector(".image__music-img");
// music container itself
const musicPlayerContainer = _.querySelector(".container__music-player");
const volumeSlider = _.querySelector(".volume-range");
// repeat song Button
const repeatSong = _.querySelector(".setting:nth-child(2)");
// change quality Button
const qualityBtn = _.querySelector(".setting:nth-child(3)");
// the song progress bar
const progressBar = _.querySelector(".music-player__progress");

const musicName = _.querySelector(
  ".controls-container__description > .informations__music-name"
);
const artistsName = _.querySelector(
  ".controls-container__description > .informations__music-artist"
);

let currentTime;
// for Switching between Hd and non Hd quality
let isHD = false;
let isPlaying;
let defaultVolume = 0.2;

/*
 * this function is set as an onclick event to music cards play buttons (shows when hovers on music cards)
 * @function playEntireMusic
 * @param {string} musicId - the id of music
 */
window.playEntireMusic = async function (_, musicId) {
  try {
    showAlert("loading", "Loading...");

    window.currentMusic = await getSingleMusic(musicId);

    pauseMusic();
    musicPlayerContainer.style.display = "none";

    // get the musicObj and save it in a global varriable called currentMusic
    audioElem.src = currentMusic.audio.medium.url;
    // when everything is ready , play the music
    audioElem.addEventListener("canplay", playTheAudioWhenReady);
    audioElem.addEventListener("error", handleAudioElemErrors);
  } catch (e) {
    if (e) {
      showAlert("error", "An error occured !");
      setTimeout(hideAlert, 1000);
    }
  }
};

/*
 * this function is handling the errors of the audio Element
 * @function handleAudioElemErrors
 */
function handleAudioElemErrors() {
  hideAlert();

  showAlert("error", "Something went Wrong!");
  setTimeout(hideAlert, 1000);
}

/*
 * this function fires when the audio Elem is ready for playing the music
 * @function playTheAudioWhenReady
 */
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

/*
 * set requirement events like controlling volume and etc... when the music started playing
 * @function setRequirementEvents
 */
function setRequirementEvents() {
  // for Volume changing
  volumeSlider.addEventListener("input", handleAudioVolume);
  // for loop controlling
  repeatSong.addEventListener("click", handleReapetOrNot);
  // for switching between qualities
  qualityBtn.addEventListener("click", handleAudioQuality);
  // for playing and pausing
  playerPlayBtn.addEventListener("click", handlePlayerPauseOrClick);
  // for music ProgressBar
  audioElem.addEventListener("timeupdate", handleProgressBar);
  // when music ends...
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
 * handles the play and pause of the music
 * @function handlePlayerPauseOrClick
 */
function handlePlayerPauseOrClick() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

/*
 * plays the music
 * @function playMusic
 */
function playMusic() {
  isPlaying = true;
  playerPlayBtn.firstElementChild.src = "/assets/icons/pause-mini-line.svg";

  audioElem.play();
}

/*
 * pauses the music
 * @function pauseMusic
 */
function pauseMusic() {
  isPlaying = false;
  playerPlayBtn.firstElementChild.src = "/assets/icons/play-mini-line.svg";

  audioElem.pause();
}

/*
 * handles the repeat button
 * @function handleReapetOrNot
 */
function handleReapetOrNot() {
  audioElem.loop = !audioElem.loop;

  showAlert(
    "done",
    `Repeat Mode is Now ${audioElem.loop ? "Enabled" : "Disabled"}`
  );
  setTimeout(hideAlert, 1000);
}

/*
 * handles the audio volume using the <progress> tag in html
 * @function handleAudioVolume
 * @param {object} e - event Object
 */
function handleAudioVolume(e) {
  defaultVolume = e.target.value / 100;
  audioElem.volume = defaultVolume;
}

/*
 * handles the HD button on music player
 * @function handleAudioQuality
 */
function handleAudioQuality() {
  //  save the currentTime, change the url , play the music from saved Time
  currentTime = audioElem.currentTime;
  isHD = !isHD;

  resetProgressBarWidth();

  audioElem.src = currentMusic.audio[`${isHD ? "high" : "medium"}`].url;
  audioElem.currentTime = currentTime;
  playMusic();

  showAlert("done", `HD Mode is Now ${isHD ? "Enabled" : "Disabled"}`);
  setTimeout(hideAlert, 1000);
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
