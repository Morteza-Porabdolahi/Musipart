import {searchMusics} from './utils/musicApi.js'
import { _, createHtmlFromSong ,showHelpTag , hideHelpTag} from './utils/general.js';
import { showAlert } from './utils/alert.js';

const searchInput = _.querySelector(".search-input");
const container = _.querySelector(".allmusics__searched");

// for Debouncing
let timeout;

searchInput.addEventListener("input", handleSearchQuery);

/*
 * handles the user entered input
 * @function handleSearchQuery
 * @param {object} e - event Object
 */
function handleSearchQuery(e) {
  const inputValue = e.target.value;

  if (!e.target.value) {
    container.innerHTML = "";

    showHelpTag("Please Search a Music Name !")
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(() => getDatasFromApi(inputValue), 800);
  }
}

/*
 * gets the data from url entered with input
 * @function getDatasFromApi
 * @param {string} url - user entered input as a url
 */
async function getDatasFromApi(query = "") {
  try {
    const searchedSongs = await searchMusics(query);

    if (searchedSongs.length <= 0) {
      container.innerHTML = "";

      showHelpTag('No Musics Found !');
    } else {
      hideHelpTag();
      createHtmlFromSongs(searchedSongs);
    }
  } catch (e) {
    console.log(e);
    showAlert("error", "Something Went Wrong!",1500);
  }
}

/*
 * gets the data and put it as music card into dom
 * @function manipulateHtml
 * @param {array} data - the data that api has sent to us
 */
let songsWrapper = _.createElement("div"),
 musicsCardTemplate = '';

songsWrapper.className = "allmusics-section";

function createHtmlFromSongs(songs = []) {
  songsWrapper = songsWrapper.cloneNode(true);

  songsWrapper.innerHTML = "";
  musicsCardTemplate = '';

  for(let {song} of songs){
    musicsCardTemplate += createHtmlFromSong(song);
  }

  songsWrapper.insertAdjacentHTML("beforeend", musicsCardTemplate);
  insertInDom(songsWrapper);
}

/*
 * inserts the created wrapper into dom
 * @function insertInDom
 * @param {HTMLElement} wrapper - the wrapper of musics
 */
function insertInDom(wrapper) {
  container.innerHTML = "";

  container.append(wrapper);
}
