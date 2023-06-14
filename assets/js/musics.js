import { showAlert } from "./utils/alert.js";
import { getWeeklyMusics, getDailyMusics, getNewMusics } from "./utils/musicApi.js";
import { hidePreloader } from "./utils/preloader.js";
import { paginateDatas,clickedCount } from "./utils/pagination.js";
import { _ ,createHtmlFromSong } from "./utils/general.js";

window.addEventListener("load", getSpecificSongs);

const urlQuery = new URLSearchParams(location.search).get("q");
const perClick = 10;
let resultSongs;

/*
 * this function is in multiple pages and configured by url query
 * @function getSpecificSongs
 */
async function getSpecificSongs() {
  try {
    if (urlQuery === "daily") {
      const dailyMusics = await getDailyMusics();
console.log(dailyMusics);
      resultSongs = dailyMusics;
    } else if (urlQuery === "weekly") {
      const weeklyMusics = await getWeeklyMusics();

      resultSongs = weeklyMusics
    } else {
      const newMusics = await getNewMusics();

      resultSongs = newMusics
    }

    const paginatedDatas = paginateDatas(resultSongs,perClick);
    createHtmlFromSongs(paginatedDatas);
  } catch (e) {
    if (e) {
      console.log(e);
      hidePreloader();
      showAlert("error", "Something went Wrong !",1500);
    }
  }
}

/*
 * create HTML Elements (music card) using the spliced musics with manipulateData function
 * @function createHTMLElementsFromData
 * @param {array} splicedMusics - spliced Musics
 */

const songsWrapper = _.createElement("div");
songsWrapper.className = "allmusics-section";

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

function handleLoadMoreBtn(){
  const loadMoreBtn = _.querySelector(".load-more");
  if(resultSongs.length > perClick && perClick * clickedCount < resultSongs.length){
    loadMoreBtn.addEventListener("click", getSpecificSongs);
    loadMoreBtn.style.display = "block";
  }else{
    loadMoreBtn.removeEventListener("click", getSpecificSongs);
    loadMoreBtn.style.display = "none";
  }
}

/*
 * append the musics wrapper into dom
 * @function appendMusicsIntoDom
 * @param {HTMLElement} wrapper - the wrapper of Musics
 */
function appendMusicsIntoDom(wrapper) {
  const songsContaienr = _.querySelector(".allmusics");

  songsContaienr.appendChild(wrapper);
  hidePreloader();
}
