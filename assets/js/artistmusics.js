import { getArtistMusics } from "./utils/musicApi.js";
import { hidePreloader } from "./utils/preloader.js";
import { showAlert, hideAlert } from "./utils/alert.js";
import { _, createHtmlFromSong } from "./utils/general.js";

const container = _.querySelector(".artist-musics");

window.addEventListener("load", setDocumentTitle);

/*
 * set document title as artist name and gets the artist name in search params
 * @function setTitles
 */
function setDocumentTitle() {
  const artistsTitleElement = _.querySelector(".artist-name");
  const searchParams = location.search;
  const artistName = new URLSearchParams(searchParams).get("q");

  _.title = `Musipart || ${artistName}`;
  artistsTitleElement.textContent = artistName;

  getArtistSongs(artistName);
}

/*
 * get the data from artist name sent by setTitles functions
 * @function getDatasAndFilterIt
 * @param {string} artistName - artist fullName
 */
async function getArtistSongs(artistName = "") {
  try {
    const artistMusics = await getArtistMusics(artistName);

    if (artistMusics.length > 0) {
      createArtistSongsCard(artistMusics);
    } else {
      hidePreloader();

      container.innerHTML =
        '<p class="content__not-found">No Musics Found !</p>';
    }
  } catch (e) {
    if (e) {
      console.log(e);
      hidePreloader();
      showAlert("error", "Something went Wrong !", 1500);
    }
  }
}

/*
 * create HTML Elements (music card and artist card) using the filtered musics with getDatasAndFilterIt function
 * @function createHTMLElementsFromData
 * @param {array} filteredData - filtered Musics
 */
function createArtistSongsCard(artistMusics = []) {
  const songsWrapper = _.createElement("div");
  let musicCardsTemplate = "";

  songsWrapper.className = "allmusics-section";

  for (let { song } of artistMusics) {
    musicCardsTemplate += createHtmlFromSong(song);
  }

  songsWrapper.insertAdjacentHTML("beforeend", musicCardsTemplate);
  appendMusicsIntoDom(songsWrapper);
}

/*
 * append the musics wrapper into dom
 * @function appendMusicsIntoDom
 * @param {HTMLElement} wrapper - the wrapper of Musics
 */
function appendMusicsIntoDom(wrapper) {
  container.append(wrapper);

  hidePreloader();
}
