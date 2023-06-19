import {
  _,
  getUserIdFromParams,
  getUserToken,
  hideHelpTag,
  showHelpTag,
} from "./utils/general.js";
import { getUserPlaylists } from "./api/user-api.js";
import { hidePreloader } from "./utils/preloader.js";
import { showAlert } from "./utils/alert.js";

const searchInput = _.querySelector(".header__input");
const playlistsContainer = _.querySelector(".playlists__container");

let playlists = [];

window.addEventListener("load", handleUserPlaylists);
searchInput.addEventListener("input", handlePlaylistsSearch);

export async function handleUserPlaylists() {
  try {
    const userId = getUserIdFromParams();
    const userToken = getUserToken();
    const userPlaylists = await getUserPlaylists(userId, userToken);

    if (userPlaylists.length > 0) {
      playlists = userPlaylists;
      
      hideHelpTag();
      createHtmlFromPlaylists(userPlaylists);
    } else {
      hidePreloader();
    }
  } catch (e) {
    hidePreloader();
    showAlert("error", e.message, 2000);
  }
}

function createHtmlFromPlaylist(playlist = {}) {
  return `
  <div class="music-card">
    <div class="music-card__img-container">
      <img class="music-card__img" src="${
        playlist.imageUrl || "/assets/images/placeholder-200.png"
      }" />
    </div>
    <a href="/pages/playlistpage.html?id=${playlist.id}" title="${
    playlist.name
  }" class="playlist__name">${playlist.name}</a>
  </div>
  `;
}

function createHtmlFromPlaylists(playlists = []) {
  let playlistsTemplate = _.createElement("template");

  for (let playlist of playlists) {
    playlistsTemplate.innerHTML += createHtmlFromPlaylist(playlist);
  }

  appendPlaylistsIntoDom(playlistsTemplate.content);
}

function appendPlaylistsIntoDom(playlistsElem) {
  playlistsContainer.innerHTML = "";
  playlistsContainer.append(playlistsElem);

  hidePreloader();
}

function handlePlaylistsSearch(e) {
  const inputValue = e.target.value;

  const filteredPlaylists = playlists.filter((playlist) =>
    playlist.name.toLowerCase().includes(inputValue.toLowerCase())
  );

  if (filteredPlaylists.length > 0) {
    hideHelpTag();
    createHtmlFromPlaylists(filteredPlaylists);
  } else {
    playlistsContainer.innerHTML = "";
    showHelpTag("Playlist not found !");
  }
}
