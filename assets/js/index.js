import { showAlert, hideAlert } from "./utils/alert.js";
import {
  getNewMusics,
  getDailyMusics,
  getWeeklyMusics,
  getTopArtists,
} from "./utils/api.js";
import { hidePreloader } from "./utils/preloader.js";

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
      showAlert("error", "Something went Wrong !");
      setTimeout(hideAlert, 1000);
    }
  }
}

async function handleNewMusics() {
  const newMusicsContainer = document.querySelector(".newMusics");
  const newMusics = await getNewMusics();
  const manipulatedDatas = manipulateDatas(newMusics);

  createHtmlElementsFromSongs(manipulatedDatas, newMusicsContainer);
}

async function handleDailyMusics() {
  const dailyMusicsContainer = document.querySelector(".dailyMusics");
  const dailyMusics = await getDailyMusics();
  const manipulatedDatas = manipulateDatas(dailyMusics);

  createHtmlElementsFromSongs(manipulatedDatas, dailyMusicsContainer);
}

async function handleWeeklyMusics() {
  const weeklyMusicsContainer = document.querySelector(".weeklyMusics");
  const weeklyMusics = await getWeeklyMusics();
  const manipulatedDatas = manipulateDatas(weeklyMusics);

  createHtmlElementsFromSongs(manipulatedDatas, weeklyMusicsContainer);
}

async function handleArtists() {
  const artistsContainer = document.querySelector(".topArtists");
  const artists = await getTopArtists();
  const manipulatedDatas = manipulateDatas(artists);

  createHtmlFromArtists(manipulatedDatas, artistsContainer);
}

/*
 * gets the 6 elements of every array inside datas object with the help of makeStartAndEndIndex function
 * @function manipulateData
 * @param {object} datas - the object of datas
 */
function manipulateDatas(datas = []) {
  // take 6 elemenets of array
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
function createHtmlElementsFromSongs(songs = [], container) {
  let wrapper = document.createElement("div"),
    musicsCard = "";

  wrapper.className = "section__content";
  wrapper = wrapper.cloneNode(true);
  wrapper.innerHTML = "";

  if (songs.length <= 0) {
    wrapper.style.justifyContent = "center";
    wrapper.innerHTML = '<p class="content__not-found">No Musics Found !</p>';
  } else {
    for (let song of songs) {
      musicsCard += `
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
    wrapper.insertAdjacentHTML("beforeend", musicsCard);
  }
  insertInDom(wrapper, container);
}

/*
 * create HTML Elements (music card and artist card) using the all musics created Array with manipulateDatas function
 * @function createHTMLElementsFromData
 * @param {object} newDatas - filtered Datas
 */
function createHtmlFromArtists(artists = [], container) {
  let wrapper = document.createElement("div"),
    artistsCard = "";

  wrapper.className = "section__content";
  wrapper = wrapper.cloneNode(true);
  wrapper.innerHTML = "";

  if (artists.length <= 0) {
    wrapper.style.justifyContent = "center";
    wrapper.innerHTML = '<p class="content__not-found">No Musics Found !</p>';
  } else {
    for (let artist of artists) {
      artistsCard += `
    <div class="artist-card"> 
        <div class="artist-card__img-container"> 
         <img loading="lazy" class="artist-card__img" src="${artist.image.cover.url}"/> 
        </div> 
        <div class="artist-card__informations"> 
        <a href="/pages/artistmusics.html?q=${artist.fullName}" class="informations__artist-name">${artist.fullName}</a> </div> 
    </div>`;
    }
    wrapper.insertAdjacentHTML("beforeend", artistsCard);
  }
  insertInDom(wrapper, container);
}

/*
 * append the muiscs wrapper into dom
 * @function insertInDom
 * @param {string} containerClass - the container class name
 * @param {HTMLElement} toInsert - the wrapper of musics or artists
 */
function insertInDom(toInsert, container) {
  container.appendChild(toInsert);
  hidePreloader();
}
