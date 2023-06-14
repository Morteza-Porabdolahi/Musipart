import {getArtistMusics} from "./utils/api.js";
import { hidePreloader } from "./utils/preloader.js";
import { showAlert,hideAlert} from "./utils/alert.js";

const container = document.querySelector(".artist-musics");

window.addEventListener("load", setDocumentTitle);

/*
 * set document title as artist name and gets the artist name in search params
 * @function setTitles
 */
function setDocumentTitle() {
  // artist name element
  const titleElement = document.querySelector(".artist-name");
  const locationSearch = location.search;
  const artistName = new URLSearchParams(locationSearch).get("q");

  document.title = `Musipart || ${artistName}`;
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

  const wrapper = document.createElement("div");
  wrapper.className = "allmusics-section";

  artistMusics.forEach(({song}) => {
    musicCardsTemplate += `
<div class="music-card">
<div class="music-card__img-container">
<img loading="lazy" class="music-card__img" src="${song.image.cover.url}" />
<button class="music-card__play-btn" onclick="playEntireMusic(event,'${
      song.id
    }')">
<img src="/assets/icons/play-mini-line.svg"/>
</button>
</div>
<div class="music-card__informations">
<a href="/pages/singlemusicpage.html?id=${
      song.id
    }" class="informations__music-name">${song.title}</a>  
<small class="informations__music-artist">${song.artists.map(
      (artist) => artist.fullName
    )}</small>
</div>
</div>`;
  });

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
