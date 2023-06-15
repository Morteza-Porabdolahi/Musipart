import { getArtists } from "./utils/musicApi.js";
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

searchInput.addEventListener("input", handleSearch);

/*
 * get Artits array from api
 * @function getArtistsData
 */
async function getArtistsData(artistName = "") {
  try {
    const artists = await getArtists(artistName);

    if (Object.keys(artists).length <= 0) {
      allArtistsContainer.innerHTML = "";

      showHelpTag("No Artists Found !");
    } else {
      hideHelpTag();
      createArtistsCards(artists);
    }
  } catch (e) {
    if (e) {
      console.log(e);
      showAlert("error", "Something went wrong !", 1500);
    }
  }
}

/*
 * create HTML Elements (artist card) using the artists created Array with getArtistsData function
 * @function createArtistsCards
 * @param {array} artists - all artists
 */
let allArtistsWrapper = _.createElement("div"),
  artistCardsTemplate = "";

allArtistsWrapper.className = "artists-section";

function createArtistsCards(artists = []) {
  allArtistsWrapper = allArtistsWrapper.cloneNode(true);

  allArtistsWrapper.innerHTML = "";
  artistCardsTemplate = "";

  for (let { artist } of artists) {
    artistCardsTemplate += createHtmlFromArtist(artist);
  }

  allArtistsWrapper.insertAdjacentHTML("beforeend", artistCardsTemplate);
  appendWrapperInContainer(allArtistsWrapper);
}

/*
 * append the artists wrapper into dom
 * @function appendContainerIntoDom
 * @param {HTMLElement} wrapper - the wrapper of artists
 */
function appendWrapperInContainer(wrapper) {
  allArtistsContainer.innerHTML = "";

  allArtistsContainer.append(wrapper);
}

/*
 * handles the user entered input in search input
 * @function handleSearch
 * @param {object} e - event object
 */
const debouncedFunction = debounce(getArtistsData, 800);

function handleSearch(e) {
  const inputValue = e.target.value;

  if (!e.target.value) {
    allArtistsContainer.innerHTML = "";

    showHelpTag("Please Search a Artist Name !");
  } else {
    debouncedFunction(inputValue);
  }
}
