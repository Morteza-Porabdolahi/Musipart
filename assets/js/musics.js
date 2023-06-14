import { showAlert, hideAlert } from "./utils/alert.js";
import { getWeeklyMusics, getDailyMusics, getNewMusics } from "./utils/api.js";
import { hidePreloader } from "./utils/preloader.js";
import { perClick, clickedCount, setClickCount } from "./utils/general.js";

window.addEventListener("load", getSpecificSongs);

const urlQuery = new URLSearchParams(location.search).get("q");
let results;

/*
 * this function is in multiple pages and configured by url query
 * @function getSpecificSongs
 */
async function getSpecificSongs() {
  try {
    setClickCount(clickedCount + 1);

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

    createHtmlFromSongs(results.slice()
    .splice(clickedCount * perClick - perClick, perClick));
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
const songsWrapper = document.createElement("div");
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
      musicCardsTemplate += `
        <div class="music-card"> 
          <div class="music-card__img-container"> 
            <img loading="lazy" class="music-card__img" src="${
              song.image.cover.url
            }"/> 
            <button onclick="playEntireMusic(event,'${
              song.id
            }')" class="music-card__play-btn">   
              <img src="/assets/icons/play-mini-line.svg"/> 
            </button> 
          </div> 
          <div class="music-card__informations"> 
            <a class="informations__music-name" href="/pages/singlemusicpage.html?id=${
              song.id
            }">${song.title}</a> 
            ${song.artists.map(
              (artist) =>
                `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`
            )} 
          </div> 
        </div>`;
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
  const songsContaienr = document.querySelector(".allmusics");
  const loadMoreBtn = document.querySelector(".load-more");

  songsContaienr.appendChild(wrapper);

  if (results.length > perClick) {
    loadMoreBtn.addEventListener("click", getSpecificSongs);
    loadMoreBtn.style.display = "block";
  }

  hidePreloader();
}
