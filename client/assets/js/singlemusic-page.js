import { getSingleMusic } from "./api/music-api.js";
import { hidePreloader } from "./utils/preloader.js";
import { showAlert } from "./utils/alert.js";
import { _ } from "./utils/general.js";

const playBtn = _.querySelector(".control:nth-child(2)");
const audioElem = _.querySelector("audio");

playBtn.addEventListener("click", playOrPauseAudio);
window.addEventListener("load", getSongInformation);

let isPlaying = false;

/*
 * gets the single music using search parameters
 * @function getSingleMuaic
 */
async function getSongInformation() {
  try {
    const musicId = new URLSearchParams(location.search).get("id");
    const music = await getSingleMusic(musicId);

    // if music is not found then redirect user to 404 page
    if (!music.hasOwnProperty("id")) {
      location.href = "/pages/404.html";
    } else {
      _.title = `Musipart || ${music.title}`;
      setMusicInfos(music);
    }
  } catch (e) {
    hidePreloader();
    showAlert("error", e.message, 2000);
  }
}

/*
 * inserts the song informations such as lyrics,title,... into dom
 * @function setMusicInfos
 * @param {object} song - the song Object
 */
function setMusicInfos(song = {}) {
  const musicImage = _.querySelector(".description__image > img");
  const musicTitle = _.querySelector(".texts__titles > h3");
  const musicArtists = _.querySelector(".texts__titles > p");
  const lyricsContainer = _.querySelector(".description__lyrics > p");

  musicImage.alt = song.title;
  musicImage.src = song.image.cover.url;

  musicTitle.textContent = song.title;
  musicArtists.textContent = song.artists.map((artist) => artist.fullName);

  lyricsContainer.textContent = song.lyrics
    ? song.lyrics
    : "No lyrics Found...!";

  audioElem.src = song.audio.medium.url;

  hidePreloader();
}

function pauseMusic() {
  isPlaying = false;
  playBtn.firstElementChild.src = "/assets/icons/play-mini-line.svg";

  audioElem.pause();
}

function playMusic() {
  isPlaying = true;
  playBtn.firstElementChild.src = "/assets/icons/pause-mini-line.svg";

  audioElem.play();
}

function playOrPauseAudio() {
  if (!isPlaying) {
    playMusic();
  } else {
    pauseMusic();
  }
}
