import { showAlert, hideAlert } from "./utils/alert.js";
import {
  getNewMusics,
  getDailyMusics,
  getWeeklyMusics,
  getTopArtists,
} from "./utils/musicApi.js";
import { hidePreloader } from "./utils/preloader.js";
import {
  _,
  createHtmlFromArtist,
  createHtmlFromSong,
} from "./utils/general.js";

window.addEventListener("load", getAllSongsAndArtists);

/*
 * get all categories songs from api
 * @function getAllSongs
 */
function getAllSongsAndArtists() {
  try {
    handleDailyMusics();
    handleWeeklyMusics();
    handleArtists();
    handleNewMusics();
  } catch (e) {
    if (e) {
      hidePreloader();
      showAlert("error", "Something went Wrong !",1500);
    }
  }
}

async function handleNewMusics() {
  const newMusics = await getNewMusics();

  createHtmlFromSongs(spliceSixElemsOfArray(newMusics), "newMusics");
}

async function handleDailyMusics() {
  const dailyMusics = await getDailyMusics();

  createHtmlFromSongs(
    spliceSixElemsOfArray(dailyMusics),
    "dailyMusics"
  );
}

async function handleWeeklyMusics() {
  const weeklyMusics = await getWeeklyMusics();

  createHtmlFromSongs(
    spliceSixElemsOfArray(weeklyMusics),
    "weeklyMusics"
  );
}

async function handleArtists() {
  const artists = await getTopArtists();

  createHtmlFromArtists(spliceSixElemsOfArray(artists), "topArtists");
}

/*
 * gets the 6 elements of every array inside datas object with the help of makeStartAndEndIndex function
 * @function manipulateData
 * @param {object} datas - the object of datas
 */
function spliceSixElemsOfArray(datas = []) {
  return datas.slice().splice(...makeStartAndEndIndex(datas, 6));
}

/*
 * get 6 elements of every results array with a shit logic <3
 * @function makeStartAndEndIndex
 * @param {array} results - musics or artists Datas
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

/*
 * create HTML Elements (music card and artist card) using the all musics created Array with manipulateDatas function
 * @function createHTMLElementsFromData
 * @param {object} newDatas - filtered Datas
 */
let wrapper = _.createElement("div"),
musicsCardTemplate = "",
artistsCardTemplate = "";

wrapper.className = "section__content";

function createHtmlFromSongs(songs = [], containerClass = "") {
  wrapper = wrapper.cloneNode(true);

  wrapper.innerHTML = "";
  musicsCardTemplate = '';

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
 * create HTML Elements (music card and artist card) using the all musics created Array with manipulateDatas function
 * @function createHTMLElementsFromData
 * @param {object} newDatas - filtered Datas
 */
function createHtmlFromArtists(artists = [], containerClass = "") {
  wrapper = wrapper.cloneNode(true);

  wrapper.innerHTML = "";
  artistsCardTemplate = '';

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

/*
 * append the muiscs wrapper into dom
 * @function insertInDom
 * @param {string} containerClass - the container class name
 * @param {HTMLElement} toInsert - the wrapper of musics or artists
 */
function insertInDom(wrapper, containerClass) {
  const container = _.querySelector(`.${containerClass}`);

  container.appendChild(wrapper);
  hidePreloader();
}
