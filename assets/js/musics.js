import { showAlert, hideAlert } from "./utils/alert.js";
import { getWeeklyMusics, getDailyMusics, getNewMusics } from "./utils/musicApi.js";
import { hidePreloader } from "./utils/preloader.js";
import { paginateDatas } from "./utils/pagination.js";
import { _ } from "./utils/general.js";

window.addEventListener("load", getSpecificSongs);

const urlQuery = new URLSearchParams(location.search).get("q");
let results;

/*
 * this function is in multiple pages and configured by url query
 * @function getSpecificSongs
 */
async function getSpecificSongs() {
  try {
    if (urlQuery === "daily") {
      const dailyMusics = await getDailyMusics();
      results = dailyMusics;

    } else if (urlQuery === "weekly") {
      const weeklyMusics = await getWeeklyMusics();
      results = weeklyMusics
    } else {
      const newMusics = await getNewMusics();
      results = newMusics
    }

    const paginatedDatas = paginateDatas(results,10);
    createHtmlFromSongs(paginatedDatas);
  } catch (e) {
    if (e) {
      console.log(e);
      hidePreloader();

      showAlert("error", "Something went Wrong !");
      setTimeout(hideAlert, 1000);
    }
  }
}


// create a wrapper for songs
const songsWrapper = _.createElement("div");
songsWrapper.className = "allmusics-section";

/*
 * create HTML Elements (music card) using the spliced musics with manipulateData function
 * @function createHTMLElementsFromData
 * @param {array} splicedMusics - spliced Musics
 */
function createHtmlFromSongs(songs = []) {
  let musicCardsTemplate = "";

  if (songs.length <= 0) {
    songsWrapper.style.justifyContent = "center";
    songsWrapper.innerHTML =
      '<p class="content__not-found">No Musics Found !</p>';
  } else {
    for (let song of songs) {
      musicCardsTemplate += createHtmlFromSongs(song);
    }
    songsWrapper.insertAdjacentHTML("beforeend", musicCardsTemplate);
  }

  if (clickedCount === 1) {
    appendMusicsIntoDom(songsWrapper);
  }
}

/*
 * append the musics wrapper into dom
 * @function appendMusicsIntoDom
 * @param {HTMLElement} wrapper - the wrapper of Musics
 */
function appendMusicsIntoDom(wrapper) {
  const songsContaienr = _.querySelector(".allmusics");
  const loadMoreBtn = _.querySelector(".load-more");

  songsContaienr.appendChild(wrapper);

  if (results.length > perClick) {
    loadMoreBtn.addEventListener("click", getSpecificSongs);
    loadMoreBtn.style.display = "block";
  }

  hidePreloader();
}
