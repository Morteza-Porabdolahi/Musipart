import { showAlert } from "./utils/alert.js";
import {
  getNewMusics,
  getDailyMusics,
  getWeeklyMusics,
} from "./api/music-api.js";
import { getTopArtists } from "./api/artist-api.js";
import { hidePreloader } from "./utils/preloader.js";
import {
  _,
  createHtmlFromArtist,
  createHtmlFromSong,
} from "./utils/general.js";
import "./addMusicToPlaylist.js";

function getAllSongsAndArtists() {
  try {
    handleDailyMusics();
    handleWeeklyMusics();
    handleArtists();
    handleNewMusics();
  } catch (e) {
    hidePreloader();
    showAlert("error", e.message, 2000);
  }
}
window.addEventListener("load", getAllSongsAndArtists);

async function handleNewMusics() {
  const newMusics = await getNewMusics();

  createHtmlFromSongs(spliceSixElemsOfArray(newMusics), "newMusics");
}

async function handleDailyMusics() {
  const dailyMusics = await getDailyMusics();

  createHtmlFromSongs(spliceSixElemsOfArray(dailyMusics), "dailyMusics");
}

async function handleWeeklyMusics() {
  const weeklyMusics = await getWeeklyMusics();

  createHtmlFromSongs(spliceSixElemsOfArray(weeklyMusics), "weeklyMusics");
}

async function handleArtists() {
  const artists = await getTopArtists();

  createHtmlFromArtists(spliceSixElemsOfArray(artists), "topArtists");
}

/*
 * splices the 6 elements of datas array with the help of makeStartAndEndIndex function
 * @function spliceSixElemsOfArray
 * @param {array} datas - the array of datas
 */
function spliceSixElemsOfArray(datas = []) {
  if (typeof datas === "object" && !Array.isArray(datas) && datas !== null)
    return;
  return datas.slice().splice(...makeStartAndEndIndex(datas, 6));
}

/*
 * returns indexes of 6 elements of datas array with a shit logic <3
 * @function makeStartAndEndIndex
 * @param {array} datas - musics or artists array
 * @param {number} - number of elements that you wanna get
 */
function makeStartAndEndIndex(datas = [], elemNum) {
  const randomIndex = Math.floor(Math.random() * datas.length);
  if (datas.length - randomIndex < elemNum) {
    return [randomIndex - elemNum < 0 ? 0 : randomIndex - elemNum, elemNum];
  } else {
    return [randomIndex, elemNum];
  }
}

let wrapper = _.createElement("div"),
  musicsCardTemplate = "",
  artistsCardTemplate = "";

wrapper.className = "section__content";
/*
 * Builds music card html
 * @function createHtmlFromSongs
 * @param {array} songs - songs array
 * @param {string} containerClass - container of the cards
 */
function createHtmlFromSongs(songs = [], containerClass = "") {
  wrapper = wrapper.cloneNode(true);

  wrapper.innerHTML = "";
  musicsCardTemplate = "";

  if (songs.length <= 0) {
    wrapper.style.justifyContent = "center";
    wrapper.innerHTML = '<p class="content__not-found">No Musics Found !</p>';
  } else {
    for (let song of songs) {
      musicsCardTemplate += createHtmlFromSong(song);
    }

    wrapper.insertAdjacentHTML("beforeend", musicsCardTemplate);
  }
  insertInDom(wrapper, containerClass);
}

/*
 * Builds artist card html
 * @function createHtmlFromArtists
 * @param {array} artists - artists array
 * @param {string} containerClass - container of the cards
 */
function createHtmlFromArtists(artists = [], containerClass = "") {
  wrapper = wrapper.cloneNode(true);

  wrapper.innerHTML = "";
  artistsCardTemplate = "";

  if (artists.length <= 0) {
    wrapper.style.justifyContent = "center";
    wrapper.innerHTML = '<p class="content__not-found">No Artists Found !</p>';
  } else {
    for (let artist of artists) {
      artistsCardTemplate += createHtmlFromArtist(artist);
    }

    wrapper.insertAdjacentHTML("beforeend", artistsCardTemplate);
  }
  insertInDom(wrapper, containerClass);
}

function insertInDom(wrapper, containerClass) {
  const container = _.querySelector(`.${containerClass}`);

  container.appendChild(wrapper);
  hidePreloader();
}
