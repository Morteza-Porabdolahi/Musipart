import { getArtistMusics } from "./api/music-api.js";
import { hidePreloader } from "./utils/preloader.js";
import { showAlert } from "./utils/alert.js";
import { _, createHtmlFromSong } from "./utils/general.js";
import "./addMusicToPlaylist.js";

const container = _.querySelector(".artist-musics");

/*
 * Gets the artist name in search params and sets it as document title
 * @function setDocumentTitle
 */
function setDocumentTitle() {
  const artistsTitleElement = _.querySelector(".artist-name");
  const searchParams = location.search;
  const artistName = new URLSearchParams(searchParams).get("q");

  if (artistName) {
    _.title = `Musipart || ${artistName}`;
    artistsTitleElement.textContent = artistName;

    getArtistSongs(artistName);
  } else {
    hidePreloader();
    container.innerHTML = '<p class="content__not-found">No Artist Found !</p>';
  }
}

window.addEventListener("load", setDocumentTitle);
/*
 * gets artist songs
 * @function getArtistSongs
 * @param {string} artistName - artist fullName
 */
async function getArtistSongs(artistName = "") {
  try {
    const artistMusics = await getArtistMusics(artistName);

    if (artistMusics.length <= 0) {
      hidePreloader();

      container.innerHTML =
        '<p class="content__not-found">No Musics Found !</p>';
    } else {
      createArtistSongsCard(artistMusics);
    }
  } catch (e) {
    hidePreloader();
    showAlert("error", e.message, 2000);
  }
}

/*
 * Builds music card html from artist musics
 * @function createArtistSongsCard
 * @param {array} artistMusics - artist Musics
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
 * appends the musics wrapper into dom
 * @function appendMusicsIntoDom
 * @param {HTMLElement} wrapper - the wrapper of Musics
 */
function appendMusicsIntoDom(wrapper) {
  container.append(wrapper);

  hidePreloader();
}
