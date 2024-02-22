import {
  _,
  getUserIdFromParams,
  getUserToken,
  hideHelpTag,
  showHelpTag,
  filterPlaylists,
  getUserBrowserWidth
} from "./utils/general.js";
import { getUserPlaylists, removePlaylist } from "./api/playlist-api.js";
import { hidePreloader } from "./utils/preloader.js";
import { showAlert } from "./utils/alert.js";
import placeHolder from "../images/placeholder-200.png";
import deleteIcon from "../icons/trash.svg";

const searchInputs = _.querySelectorAll(".search-input");
const playlistsContainer = _.querySelector(".playlists__container");

let playlists = [];

window.addEventListener("load", handleUserPlaylists);
searchInputs.forEach((searchInput) =>
  searchInput.addEventListener("input", handlePlaylistsSearch)
);

export async function handleUserPlaylists() {
  try {
    const userId = getUserIdFromParams();
    const userToken = getUserToken();

    if (!userToken) {
      return (location.href = "/pages/register.html");
    }

    const userPlaylists = await getUserPlaylists(userId, userToken);

    if (userPlaylists.length > 0) {
      playlists = userPlaylists;

      hideHelpTag();
    } else {
      showHelpTag("No Playlists Found !!");
      hidePreloader();
    }

    createHtmlFromPlaylists(userPlaylists, userId);
  } catch (e) {
    hidePreloader();
    showAlert("error", e.message, 2000);
  }
}

window.handleRemovePlaylist = async function (playlistId = "") {
  try {
    const userId = getUserIdFromParams();
    const userToken = getUserToken();
    const { message } = await removePlaylist(userId, userToken, playlistId);

    showAlert("done", message, 2000);
    handleUserPlaylists();
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
};

function createHtmlFromPlaylist(playlist = {}) {
  return `
  <div class="music-card">
    <div class="music-card__img-container" onclick="gotoSinglePlaylistPage(event,'${
      playlist._id
    }','${playlist.userId}')">
      <img class="music-card__img" onerror="this.src = '${placeHolder}'" src="${
    playlist.image?.url || placeHolder
  }" />
      <div class="img-container__more-options">
          <div class="more-options__option">
            <img class="option__remove" src="${deleteIcon}" onclick="handleRemovePlaylist('${
    playlist._id
  }')"/>
          </div>
      </div>
    </div>
    <a href="/pages/playlistpage.html?playlistId=${playlist._id}&userId=${
    playlist.userId
  }" title="${playlist.name}" class="playlist__name">${playlist.name}</a>
  </div>
  `;
}

window.gotoSinglePlaylistPage = function (
  e = event,
  playlistId = "",
  userId = ""
) {
  if (e.target.classList.contains("music-card__img-container") && getUserBrowserWidth() > 768) {
    location.href = `/pages/playlistpage.html?playlistId=${playlistId}&userId=${userId}`;
  }
};

function createHtmlFromPlaylists(playlists = [], userId = "") {
  const playlistsTemplate = _.createElement("template");

  for (let playlist of playlists) {
    playlistsTemplate.innerHTML += createHtmlFromPlaylist(playlist, userId);
  }

  appendPlaylistsIntoDom(playlistsTemplate.content);
}

function appendPlaylistsIntoDom(playlistsElem) {
  playlistsContainer.innerHTML = "";
  playlistsContainer.append(playlistsElem);

  hidePreloader();
}

function handlePlaylistsSearch(e) {
  const filteredPlaylists = filterPlaylists(e, playlists);

  if (filteredPlaylists.length > 0) {
    hideHelpTag();
    createHtmlFromPlaylists(filteredPlaylists);
  } else {
    playlistsContainer.innerHTML = "";
    showHelpTag("Playlist not found !");
  }
}
