import { getArtists } from "./utils/api.js";
import { showAlert, hideAlert } from "./utils/alert.js";

const helpTag = document.querySelector(".help");
const allArtistsContainer = document.querySelector(".artists__container");
const searchInput = document.querySelector(".search-input");

let timeout;

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

      helpTag.innerHTML = "No Artists Found !";
      helpTag.style.display = "block";
    } else {
      helpTag.style.display = "none";
      createHTMLElementsFromData(artists);
    }
  } catch (e) {
    if (e) {
      console.log(e);

      showAlert("error", "Something went wrong !");
      setTimeout(hideAlert, 1000);
    }
  }
}

/*
 * create HTML Elements (artist card) using the artists created Array with getArtistsData function
 * @function createHTMLElementsFromData
 * @param {array} artists - all artists
 */
function createHTMLElementsFromData(artists = []) {
  // the wrapper of all artists
  const allArtistsWrapper = document.createElement("div");
  let artistCardsTemplate = "";

  allArtistsWrapper.className = "artists-section";

  for (let { artist } of artists) {
    artistCardsTemplate += `
            <div class="artist-card">
                <div class="artist-card__img-container">
                    <img loading="lazy" class="artist-card__img" src="${artist.image.cover.url}"/>
                </div>
                <div class="artist-card__informations">
                    <a href="/pages/artistmusics.html?q=${artist.fullName}" class="informations__artist-name">${artist.fullName}</a>
                </div>
            </div>`;
  }
  allArtistsWrapper.insertAdjacentHTML("beforeend", artistCardsTemplate);
  appendContainerIntoDom(allArtistsWrapper);
}

/*
 * append the artists wrapper into dom
 * @function appendContainerIntoDom
 * @param {HTMLElement} wrapper - the wrapper of artists
 */
function appendContainerIntoDom(wrapper) {
  allArtistsContainer.innerHTML = "";
  allArtistsContainer.appendChild(wrapper);
}

/*
 * handles the user entered input in search input
 * @function handleSearch
 * @param {object} e - event object
 */
function handleSearch(e) {
  const inputValue = e.target.value;

  if (!e.target.value) {
    allArtistsContainer.innerHTML = "";

    helpTag.innerHTML = "Please Search a Artist Name !";
    helpTag.style.display = "block";
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(() => getArtistsData(inputValue), 800);
  }
}
