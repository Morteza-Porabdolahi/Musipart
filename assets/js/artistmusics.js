import {getArtistMusics} from "./utils/musicApi.js";
import { hidePreloader } from "./utils/preloader.js";
import { showAlert,hideAlert} from "./utils/alert.js";
import { _ ,createHtmlFromSong} from "./utils/general.js";

const container = _.querySelector(".artist-musics");

window.addEventListener("load", setDocumentTitle);

/*
 * set document title as artist name and gets the artist name in search params
 * @function setTitles
 */
function setDocumentTitle() {
  // artist name element
  const titleElement = _.querySelector(".artist-name");
  const locationSearch = location.search;
  const artistName = new URLSearchParams(locationSearch).get("q");

  _.title = `Musipart || ${artistName}`;
  titleElement.textContent = artistName;

  getDatasAndFilterIt(artistName);
}

/*
 * get the data from artist name sent by setTitles functions
 * @function getDatasAndFilterIt
 * @param {string} artistName - artist fullName
 */
async function getDatasAndFilterIt(artistName = "") {
  try {
    const artistMusics = await getArtistMusics(artistName);

    if (artistMusics.length > 0) {
      createHTMLElementsFromData(artistMusics);
    } else {
      hidePreloader();

      container.innerHTML =
        '<p class="content__not-found">No Musics Found !</p>';
    }
  } catch (e) {
    if (e) {
      console.log(e);
      hidePreloader();

      showAlert("error", "Something went Wrong !");
      setTimeout(hideAlert, 1000);
    }
  }
}

/*
 * create HTML Elements (music card and artist card) using the filtered musics with getDatasAndFilterIt function
 * @function createHTMLElementsFromData
 * @param {array} filteredData - filtered Musics
 */
function createHTMLElementsFromData(artistMusics = []) {
  let musicCardsTemplate = '';

  const wrapper = _.createElement("div");
  wrapper.className = "allmusics-section";

  for(let {song} of artistMusics){
    musicCardsTemplate += createHtmlFromSong(song);
  }

  wrapper.insertAdjacentHTML("beforeend", musicCardsTemplate);
  appendMusicsIntoDom(wrapper);
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
