import {searchMusics} from './utils/musicApi.js'
import { _, createHtmlFromSong } from './utils/general.js';

const searchInput = _.querySelector(".search-input");
const helpTag = _.querySelector(".help");
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

    helpTag.innerHTML = "Please Search a Music Name !";
    helpTag.style.display = "block";
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

      helpTag.innerHTML = "No Musics Found !";
      helpTag.style.display = "block";
    } else {
      helpTag.style.display = "none";
      manipulateHtml(searchedSongs);
    }
  } catch (e) {
    showAlert("error", "Something Went Wrong!");

    setTimeout(hideAlert, 1000);
  }
}

let musicsCard = '';
let musicsWrapper = _.createElement("div");

musicsWrapper.className = "allmusics-section";
/*
 * gets the data and put it as music card into dom
 * @function manipulateHtml
 * @param {array} data - the data that api has sent to us
 */

function manipulateHtml(songs = []) {
  musicsWrapper = musicsWrapper.cloneNode(true);

  musicsWrapper.innerHTML = "";
  musicsCard = '';

  for(let {song} of songs){
    musicsCard += createHtmlFromSong(song);
  }

  musicsWrapper.insertAdjacentHTML("beforeend", musicsCard);
  insertInDom(musicsWrapper);
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
