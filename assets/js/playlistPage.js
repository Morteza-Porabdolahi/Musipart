import {
  _,
  getUserIdFromParams,
  getUserToken,
  hideHelpTag,
  showHelpTag,
} from "./utils/general";
import { showAlert } from "./utils/alert";
import { getPlaylist, removeMusic } from "./api/playlist-api";
import { hidePreloader } from "./utils/preloader";

import trashIcon from "../icons/trash.svg";
import heartIcon from "../icons/heart-line.svg";
import placeHolder from "../images/placeholder-200.png";

const playlistMusicsWrapper = _.querySelector(".boxes__container");
const searchInputs = _.querySelectorAll(".search-input");

searchInputs.forEach((searchInput) =>
  searchInput.addEventListener("input", searchPlaylistMusics)
);
window.addEventListener("load", handleSinglePlaylist);

let playlistMusics = [];

async function handleSinglePlaylist() {
  try {
    const userId = getUserIdFromParams();
    const userToken = getUserToken();
    const playlistId = new URLSearchParams(location.search).get("playlistId");

    if (!userToken || !userId) {
      location.href = "/pages/register.html";
    } else if (!playlistId) {
      location.href = "/404.html";
    }

    const playlist = await getPlaylist(userId, userToken, playlistId);

    handleDomWithDatas(playlist);
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
}

function handleDomWithDatas(playlist = {}) {
  const playlistTitle = _.querySelector(".playlist-name");

  playlistTitle.textContent = playlist.name;

  playlistMusics = playlist.musics;
  handlePlaylistMusics(playlist.musics);
}

function handlePlaylistMusics(musics = []) {
  if (musics.length > 0) {
    const playlistsTemplate = _.createElement("template");

    for (let music of musics) {
      playlistsTemplate.innerHTML += createHtmlFromPlaylistMusic(music);
    }

    appendPlaylistMusicsIntoDom(playlistsTemplate.content);
  } else {
    playlistMusicsWrapper.innerHTML = '';
    
    hidePreloader();
    showHelpTag("No Musics Found in the playlist , try to add new one !");
  }
}

function getPlaylistIdFromParams() {
  return new URLSearchParams(location.search).get("playlistId");
}

window.playPlaylistMusic = function (e = event, songId = "") {
  if (e.target.classList.contains("boxes__box")) {
    playEntireMusic(songId);
  }
};

function createHtmlFromPlaylistMusic(music = {}) {
  return `
    <div class="boxes__box" onclick="playPlaylistMusic(event,'${music.id}')">
        <div class="box__information">
            <div class="information__img">
              <img onerror="this.src = '${placeHolder}'" src="${
    music.image.thumbnail_small.url
  }" loading="lazy" alt="${music.title}" />
            </div>
            <div class="information__text">
                <p>${music.title}</p>
                <small>${music.artists.map((artist) => artist.fullName)}</small>
            </div>
        </div>
        <div class="box__controls">
            <div class="controls-container__settings">
                <div class="setting">
                    <img src="${heartIcon}" alt="Heart icon" />
                </div>
                <div class="setting" onclick="deleteSongFromPlaylist('${
                  music.id
                }','${getPlaylistIdFromParams()}')">
                    <img src="${trashIcon}" alt="Trash icon"/>
                </div>
            </div>
        </div>
    </div>
    `;
}

window.deleteSongFromPlaylist = async function (musicId = "", playlistId = "") {
  try {
    const userId = getUserIdFromParams();
    const userToken = getUserToken();
    const { playlists, message } = await removeMusic(
      userId,
      userToken,
      playlistId,
      musicId
    );

    handlePlaylistMusics(playlists);
    showAlert("done", message, 2000);
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
};

function appendPlaylistMusicsIntoDom(playlistMusics) {
  playlistMusicsWrapper.innerHTML = "";

  playlistMusicsWrapper.append(playlistMusics);
  hidePreloader();
  hideHelpTag();
}

function searchPlaylistMusics(e) {
  const inputValue = e.target.value;

  const filteredMusics = playlistMusics.filter((music) =>
    music.title.toLowerCase().includes(inputValue.toLowerCase())
  );

  if (filteredMusics.length > 0) {
    handlePlaylistMusics(filteredMusics);
  } else {
    playlistMusicsWrapper.innerHTML = "";
    showHelpTag("No Musics Found in the playlist , try to add new one !");
  }
}
