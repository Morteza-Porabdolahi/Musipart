import { _, getUserIdFromParams, getUserToken } from "./utils/general";
import { showAlert } from "./utils/alert";
import { getPlaylist } from "./api/user-api";
import { hidePreloader } from "./utils/preloader";
import { hideHelpTag, showHelpTag } from "./utils/general";

const playlistMusicsWrapper = _.querySelector(".boxes__container");
const searchInput = _.querySelector('.header__input');

searchInput.addEventListener('input',searchPlaylistMusics);
window.addEventListener("load", handleSinglePlaylist);

let playlistMusics = [];

async function handleSinglePlaylist() {
  try {
    const userId = getUserIdFromParams();
    const userToken = getUserToken();
    const playlistId = new URLSearchParams(location.search).get("playlistId");
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
  }else{
    hidePreloader();
    showHelpTag('No Musics Found in the playlist , try to add new one !');
  }
}

function createHtmlFromPlaylistMusic(music = {}) {
  return `
    <div class="boxes__box">
        <div class="box__information">
            <div class="information__img">
                <img src="${music.image.cover.url}" loading="lazy" alt="${
    music.title
  }" />
            </div>
            <div class="information__text">
                <p>${music.title}</p>
                <small>${music.artists.map((artist) => artist.fullName)}</small>
            </div>
        </div>
        <div class="box__controls">
            <div class="controls-container__settings">
                <div class="setting">
                    <i class="ri-heart-line"></i>
                </div>
            </div>
        </div>
    </div>
    `;
}

function appendPlaylistMusicsIntoDom(playlists) {
  playlistMusicsWrapper.append(playlists);
  hidePreloader();
  hideHelpTag();
}

function searchPlaylistMusics(e){
  const inputValue = e.target.value;

  const filteredMusics = playlistMusics.filter((music) => music.title.toLowerCase().includes(inputValue.toLowerCase()));

  if (filteredMusics.length > 0) {
    handlePlaylistMusics(filteredMusics);
  } else {
    playlistsContainer.innerHTML = "";
    showHelpTag('No Musics Found in the playlist , try to add new one !');
  }
}
