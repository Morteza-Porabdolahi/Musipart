import { showAlert } from "./utils/alert";
import { getSingleMusic } from "./api/music-api";
import { getPlaylist, getUserPlaylists, updatePlaylist } from "./api/user-api";
import {
  getUserIdAndToken,
  _,
  showModal,
  hideModal,
  filterPlaylists,
} from "./utils/general";

const playlistsContainer = _.querySelector(".playlists__wrapper");
const modalPlaylistsSearchInput = _.querySelector(".modal-body__search-input");

let playlists = [];

modalPlaylistsSearchInput.addEventListener("input", handlePlaylistsSearch);

window.openSelectPlaylistModal = function (musicId = "") {
  showModal();
  handleUserPlaylists(musicId);
};

async function handleUserPlaylists(musicId = "") {
  try {
    const [userId, userToken] = getUserIdAndToken();
    const userPlaylists = await getUserPlaylists(userId, userToken);

    if (userPlaylists.length > 0) {
      playlists = userPlaylists;

      hideHelpTagInsideModal();
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

function handlePlaylistsSearch(e) {
  const filteredPlaylists = filterPlaylists(e, playlists);

  if (filteredPlaylists.length > 0) {
    hideHelpTagInsideModal();
    showPlaylistsInModal(filteredPlaylists);
  } else {
    playlistsContainer.innerHTML = "";
    showHelpTagInsideModal("No playlists found !");
  }
}

function hideHelpTagInsideModal() {
  const helpTag = _.querySelector(".playlists__container > .help");

  helpTag.style.display = "none";
}

function showHelpTagInsideModal(content = "") {
  const helpTag = _.querySelector(".playlists__container > .help");

  helpTag.textContent = content;
  helpTag.style.display = "block";
}
