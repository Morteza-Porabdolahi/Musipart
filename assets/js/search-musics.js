import {searchMusics} from './api/music-api.js'
import { _, createHtmlFromSong ,showHelpTag , hideHelpTag, debounce} from './utils/general.js';
import { showAlert } from './utils/alert.js';

const searchInput = _.querySelector(".search-input");
const container = _.querySelector(".allmusics__searched");

searchInput.addEventListener("input", handleSearchQuery);


const debouncedFunction = debounce(getSearchedMusics,800);
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
    debouncedFunction(inputValue);
  }
}

/*
 * gets the data from url entered with input
 * @function getSearchedMusics
 * @param {string} url - user entered input as a url
 */
async function getSearchedMusics(query = "") {
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
    showAlert("error", e.message,2000);
  }
}

let songsWrapper = _.createElement("div"),
 musicsCardTemplate = '';

songsWrapper.className = "allmusics-section";
/*
 * Builds music card html
 * @function createHtmlFromSongs
 * @param {array} songs - songs array
 */
function createHtmlFromSongs(songs = []) {
  songsWrapper = songsWrapper.cloneNode(true);

  songsWrapper.innerHTML = "";
  musicsCardTemplate = '';

  
  if (songs.length <= 0) {
    songsWrapper.style.justifyContent = "center";
    songsWrapper.innerHTML =
      '<p class="content__not-found">No Musics Found !</p>';
  } else {
    for (let {song} of songs) {
      musicsCardTemplate += createHtmlFromSong(song);
    }

    songsWrapper.insertAdjacentHTML("beforeend", musicsCardTemplate);
  }

  insertInDom(songsWrapper);
}

function insertInDom(wrapper) {
  container.innerHTML = "";

  container.append(wrapper);
}
