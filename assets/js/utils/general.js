import { getPlaylist, getUserPlaylists, updatePlaylist } from "../api/user-api";
import jwtDecode from "jwt-decode";
import { showAlert } from "./alert";
import { getSingleMusic } from "../api/music-api";

const _ = document;
const playlistsContainer = _.querySelector(".playlists__wrapper");
const modalContainer = _.querySelector(".container__modal");
// const modalPlaylistsSearchInput = _.querySelector(".modal-body__search-input");
let playlists = [];

// modalPlaylistsSearchInput.addEventListener("input", handlePlaylistsSearch);

(function () {
  const token = localStorage.getItem("token");

  if (token) {
    const decodedToken = jwtDecode(token);

    if (Date.now() < decodedToken.exp * 1000) {
      changeUserAppearance(decodedToken);
    } else {
      localStorage.removeItem("token");
    }
  }
})();

function getUserToken() {
  return localStorage.getItem("token");
}

function getUserIdFromParams() {
  return new URLSearchParams(location.search).get("userId");
}

function changeUserAppearance(decodedToken = {}) {
  const { username, userId } = decodedToken.user;
  const signInLink = _.querySelector(".options__signin");
  const playListsLink = _.querySelector(".navbar__item:last-child > a");

  playListsLink.href = `/pages/playlists.html?userId=${userId}`;
  playListsLink.title = "Your Playlists";
  playListsLink.style.cursor = "pointer";
  playListsLink.firstElementChild.setAttribute("fill", "#cbd5e1");

  signInLink.textContent = `${username}'s Profile`;
  signInLink.href = `/pages/account-panel.html?userId=${userId}`;
  signInLink.title = "Your Profile";
}

window.openSelectPlaylistModal = function (musicId = "") {
  showModal();
  handleUserPlaylists(musicId);
};

function getUserIdAndToken() {
  const userToken = getUserToken();
  const userId = jwtDecode(userToken).user.userId;

  return [userId, userToken];
}

async function handleUserPlaylists(musicId = "") {
  try {
    const [userId, userToken] = getUserIdAndToken();
    const userPlaylists = await getUserPlaylists(userId, userToken);

    if (userPlaylists.length > 0) {
      playlists = userPlaylists;

      hideHelpTag();
      showPlaylistsInModal(userPlaylists, musicId);
    }
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
}

function showPlaylistsInModal(playlists = [], musicId = "") {
  const playlistsTemplate = _.createElement("template");

  for (let playlist of playlists) {
    playlistsTemplate.innerHTML += `
    <div class="playlists__playlist" onclick="getMusicAndPlaylist('${musicId}','${playlist.id}')">
      <span class="playlist__name">${playlist.name}</span>
    </div>
    `;
  }

  playlistsContainer.innerHTML = "";
  playlistsContainer.append(playlistsTemplate.content);
}

window.getMusicAndPlaylist = async function (musicId = "", playlistId = "") {
  try {
    const [userId, userToken] = getUserIdAndToken();
    const clickedMusic = await getSingleMusic(musicId);
    const clickedPlaylist = await getPlaylist(userId, userToken, playlistId);

    addMusicObjectToPlaylist(clickedPlaylist, clickedMusic);
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
};

function addMusicObjectToPlaylist(playlist = {}, music = {}) {
  const copyPlaylistObject = structuredClone(playlist);

  copyPlaylistObject.musics.push(music);
  editExistingPlaylist(copyPlaylistObject);
}

async function editExistingPlaylist(newPlaylist = {}) {
  try {
    const [userId, userToken] = getUserIdAndToken();
    const { message } = await updatePlaylist(userId, userToken, newPlaylist);

    showAlert("done", message, 2000);
    hideModal();
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
}

export function filterPlaylists(e) {
  const inputValue = e.target.value;

  return playlists.filter((playlist) =>
    playlist.name?.toLowerCase().includes(inputValue.toLowerCase())
  );
}

function handlePlaylistsSearch(e) {
  const filteredPlaylists = filterPlaylists(e);

  if (filteredPlaylists.length > 0) {
    hideHelpTag();
    showPlaylistsInModal(filteredPlaylists);
  } else {
    playlistsContainer.innerHTML = "";
    showHelpTag("No playlists found !");
  }
}

function createHtmlFromArtist(artist = {}) {
  return `
    <div class="artist-card">
        <div class="artist-card__img-container">
            <img loading="lazy" class="artist-card__img" src="${artist.image.cover.url}"/>
        </div>
        <div class="artist-card__informations">
            <a href="/pages/artistmusics.html?q=${artist.fullName}" class="informations__artist-name">${artist.fullName}</a>
        </div>
    </div>`;
}

function createHtmlFromSong(song = {}) {
  return `
    <div class="music-card"> 
        <div class="music-card__img-container"> 
            <img loading="lazy" class="music-card__img" src="${
              song.image.cover.url
            }"/> 
            <button onclick="playEntireMusic('${
              song.id
            }')" class="music-card__play-btn">   
                <img src="/assets/icons/play-mini-line.svg"/> 
            </button> 
        </div> 
        <div class="music-card__informations">
            <div class="informations__song">
              <a class="informations__music-name" href="/pages/singlemusicpage.html?id=${
                song.id
              }">${song.title}</a> 
              ${song.artists.map(
                (artist) =>
                  `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`
              )} 
            </div>
            <div class="informations__more">
                <input type="checkbox" hidden id="toggleDropDown"/>
                <label for="toggleDropDown">
                  <img class="more__icon" src="/assets/icons/more-three-dots.svg" />
                </label>
                <div class="dropdown">
                  <div class="dropdown__item" onclick="openSelectPlaylistModal('${
                    song.id
                  }')">
                    <span>Add to playlist</span>
                  </div>
                </div>
            </div>
        </div> 
    </div>`;
}

function showHelpTag(content = "") {
  const helpTag = _.querySelector(".help");

  helpTag.innerHTML = content;
  helpTag.style.display = "block";
}

function hideHelpTag() {
  const helpTag = _.querySelector(".help");

  helpTag.style.display = "none";
}

function showLoadMoreBtn(callback) {
  const loadMoreBtn = _.querySelector(".load-more");

  loadMoreBtn.addEventListener("click", callback);
  loadMoreBtn.style.display = "block";
}

function hideLoadMoreBtn(callback) {
  const loadMoreBtn = _.querySelector(".load-more");

  loadMoreBtn.removeEventListener("click", callback);
  loadMoreBtn.style.display = "none";
}

function debounce(fn, delay) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay, ...args);
  };
}

/*
 * handles modal Close when clicked "outside" of modal
 * @function handleModalClose
 * @param {object} e - event Object
 */
function handleModalClose(e) {
  // get the modal content
  const modal = modalContainer.firstElementChild;

  // if clicked Element does not inside the modal content then hide the Modal
  if (e.target.contains(modal)) {
    hideModal();
  }
}

function showModal() {
  modalContainer.style.display = "block";
}

function hideModal() {
  modalContainer.style.display = "none";
}

// using the event bubbling
window.addEventListener("click", handleClickedElements);

/*
 * handles clicks using event bubbling
 * @function handleClickedElements
 * @param {object} e - event Object
 */
function handleClickedElements(e) {
  const clickedElementClass = e.target.classList;

  if (clickedElementClass.contains("close-modal")) {
    hideModal();
  } else {
    handleModalClose(e);
  }
}

export {
  _,
  showModal,
  hideModal,
  handleModalClose,
  createHtmlFromSong,
  createHtmlFromArtist,
  showHelpTag,
  hideHelpTag,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  debounce,
  getUserToken,
  getUserIdFromParams,
};
