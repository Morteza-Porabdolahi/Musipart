import { showAlert } from "./utils/alert.js";
import {
  getWeeklyMusics,
  getDailyMusics,
  getNewMusics,
} from "./api/music-api.js";
import { hidePreloader } from "./utils/preloader.js";
import { paginateDatas, clickedCount } from "./utils/pagination.js";
import {
  _,
  createHtmlFromSong,
  hideLoadMoreBtn,
  showLoadMoreBtn,
} from "./utils/general.js";

const urlQuery = new URLSearchParams(location.search).get("q");
const perClick = 10;
let resultSongs;

/*
 * this function is in multiple pages and configured by url query "q"
 * @function getSpecificSongs
 */
async function getSpecificSongs() {
  try {
    resultSongs = await (urlQuery === "daily"
      ? getDailyMusics()
      : urlQuery === "weekly"
      ? getWeeklyMusics()
      : getNewMusics());

    const paginatedDatas = paginateDatas(resultSongs, perClick);
    createHtmlFromSongs(paginatedDatas);
  } catch (e) {
    hidePreloader();
    showAlert("error", e.message, 2000);
  }
}
window.addEventListener("load", getSpecificSongs);

const songsWrapper = _.createElement("div");
songsWrapper.className = "allmusics-section";

/*
 * Builds music card html
 * @function createHtmlFromSongs
 * @param {array} songs - songs array
 */
function createHtmlFromSongs(songs = []) {
  let musicsCardTemplate = "";

  if (songs.length <= 0) {
    songsWrapper.style.justifyContent = "center";
    songsWrapper.innerHTML =
      '<p class="content__not-found">No Musics Found !</p>';
  } else {
    for (let song of songs) {
      musicsCardTemplate += createHtmlFromSong(song);
    }
    songsWrapper.insertAdjacentHTML("beforeend", musicsCardTemplate);
  }

  if (clickedCount === 1) {
    appendMusicsIntoDom(songsWrapper);
  }
  handleLoadMoreBtn();
}

function handleLoadMoreBtn() {
  if (
    resultSongs.length > perClick &&
    perClick * clickedCount < resultSongs.length
  ) {
    showLoadMoreBtn(getSpecificSongs);
  } else {
    hideLoadMoreBtn(getSpecificSongs);
  }
}

/*
 * appends the musics wrapper into dom
 * @function appendMusicsIntoDom
 * @param {HTMLElement} wrapper - the wrapper of musics
 */
function appendMusicsIntoDom(wrapper) {
  const songsContaienr = _.querySelector(".allmusics");

  songsContaienr.appendChild(wrapper);
  hidePreloader();
}
