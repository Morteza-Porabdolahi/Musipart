import { getArtists } from "./api/music-api.js";
import { showAlert } from "./utils/alert.js";
import {
  _,
  createHtmlFromArtist,
  showHelpTag,
  hideHelpTag,
  debounce,
} from "./utils/general.js";

const allArtistsContainer = _.querySelector(".artists__container");
const searchInput = _.querySelector(".search-input");

const debouncedFunction = debounce(getArtistsData, 800);
/*
 * handles the user entered input
 * @function handleSearch
 * @param {object} e - event object
 */
function handleSearch(e) {
  const inputValue = e.target.value;

  if (!e.target.value) {
    allArtistsContainer.innerHTML = "";

    showHelpTag("Please Search a Artist Name !");
  } else {
    debouncedFunction(inputValue);
  }
}
searchInput.addEventListener("input", handleSearch);

/*
 * gets Artits array
 * @function getArtistsData
 */
async function getArtistsData(artistName = "") {
  try {
    const artists = await getArtists(artistName);

    if (artists.length <= 0) {
      allArtistsContainer.innerHTML = "";

      showHelpTag("No Artists Found !");
    } else {
      hideHelpTag();
      createArtistsCards(artists);
    }
  } catch (e) {
    if (e.message) {
      showAlert("error", e.message, 2000);
    }
  }
}

let allArtistsWrapper = _.createElement("div"),
  artistsCardsTemplate = "";

allArtistsWrapper.className = "artists-section";
/*
 * Builds artist card html 
 * @function createArtistsCards
 * @param {array} artists - artists
 */
function createArtistsCards(artists = []) {
  allArtistsWrapper = allArtistsWrapper.cloneNode(true);

  allArtistsWrapper.innerHTML = "";
  artistsCardsTemplate = "";

  for (let { artist } of artists) {
    artistsCardsTemplate += createHtmlFromArtist(artist);
  }

  allArtistsWrapper.insertAdjacentHTML("beforeend", artistsCardsTemplate);
  appendWrapperInContainer(allArtistsWrapper);
}

/*
 * appends the artists wrapper into dom
 * @function appendWrapperInContainer
 * @param {HTMLElement} wrapper - the wrapper of artists
 */
function appendWrapperInContainer(wrapper) {
  allArtistsContainer.innerHTML = "";

  allArtistsContainer.append(wrapper);
}
