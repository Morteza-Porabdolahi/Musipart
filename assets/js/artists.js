import { getArtists } from "./utils/api.js";

const searchInputs = document.querySelectorAll(".search-input");
const newArtists = [];

window.addEventListener("load", getArtistsData);
searchInputs.forEach((input) =>
  input.addEventListener("input", handleSearch)
);

/*
 * get Artits array from api
 * @function getArtistsData
 */
async function getArtistsData() {
  try {
    const artists = await getArtists();

    newArtists = artists;
    
    createHTMLElementsFromData(artists);
  } catch (e) {
    if (e) {
      hidePreloader();

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
  let artistCardsTemplate;

  allArtistsWrapper.className = "artists-section";

  artists.forEach((artist) => {
    artistCardsTemplate += `
            <div class="artist-card">
                <div class="artist-card__img-container">
                    <img loading="lazy" class="artist-card__img" src="${artist.image.cover.url}"/>
                </div>
                <div class="artist-card__informations">
                    <a href="/pages/artistmusics.html?q=${artist.fullName}" class="informations__artist-name">${artist.fullName}</a>
                </div>
            </div>`;
    // insert artist cards html inside of the wrapper
  });

  allArtistsWrapper.insertAdjacentHTML("beforeend", artistCardsTemplate);
  appendContainerIntoDom(allArtistsWrapper);
}

/*
 * append the artists wrapper into dom
 * @function appendContainerIntoDom
 * @param {HTMLElement} wrapper - the wrapper of artists
 */
function appendContainerIntoDom(wrapper) {
  const allArtistsContainer = document.querySelector(".artists");

  allArtistsContainer.innerHTML = '';
  allArtistsContainer.appendChild(wrapper);

  hidePreloader();
}

/*
 * handles the user entered input in search input
 * @function handleSearch
 * @param {object} e - event object
 */
function handleSearch(e) {
  const filterResults = newArtists.filter((artist) => {
    if (e.target.value) {
      return artist.fullName
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    } else {
      return artist;
    }
  });

  createHTMLElementsFromData(filterResults);
}
