import { _, getUserIdFromParams, getUserToken } from "./utils/general";
import { showAlert } from "./utils/alert";
import { getPlaylist } from "./api/user-api";

window.addEventListener("load", handleSinglePlaylist);

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

  handlePlaylistMusics(playlist.musics);
}

function handlePlaylistMusics(musics = []) {
  const playlistsTemplate = _.createElement("template");

  for (let music of musics) {
    playlistsTemplate.innerHTML += createHtmlFromPlaylistMusic(music);
  }

  appendPlaylistMusicsIntoDom(playlistsTemplate.content);
}

function createHtmlFromPlaylistMusic(music = {}) {
  return `
    <div class="boxes__box">
        <div class="box__information">
            <div class="information__img">
                <img src="${music.image.cover.url}" loading="lazy" alt="${music.title}" />
            </div>
            <div class="information__text">
                <p>${music.title}</p>
                <small>${music.artists.map(artist => artist.fullName)}</small>
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
  const playlistsContainer = _.querySelector(".playlists__boxes");

  playlistsContainer.append(playlists);
  hidePreloader();
}
