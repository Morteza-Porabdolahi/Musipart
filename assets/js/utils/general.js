import jwtDecode from "jwt-decode";
import threeDots from '../../icons/more-three-dots.svg';
import playButton from '../../icons/play-mini-line.svg';

const _ = document;
const modalContainer = _.querySelector(".container__modal");

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

function getUserIdAndToken() {
  const userToken = getUserToken();
  const userId = jwtDecode(userToken).user.userId;

  return [userId, userToken];
}

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

function filterPlaylists(e, playlists = []) {
  const inputValue = e.target.value;

  return playlists.filter((playlist) =>
    playlist.name?.toLowerCase().includes(inputValue.toLowerCase())
  );
}

let uniqueIdForCheckbox;
function createHtmlFromSong(song = {}) {
  uniqueIdForCheckbox = Math.floor(Math.random() * 10e3);
console.log(song)
  return `
    <div class="music-card"> 
        <div class="music-card__img-container"> 
            <img loading="lazy" class="music-card__img" src="${
              song.image.cover_small.url
            }"/> 
            <button onclick="playEntireMusic('${
              song.id
            }')" class="music-card__play-btn">   
                <img src="${playButton}"/> 
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
                <input type="checkbox" hidden id="${uniqueIdForCheckbox}"/>
                <label for="${uniqueIdForCheckbox}">
                  ${getUserToken() ? `<img class="more__icon" src="${threeDots}" />` : ''}
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
  const modal = modalContainer?.firstElementChild;

  // if clicked Element does not inside the modal content then hide the Modal
  if (modal && e.target.contains(modal)) {
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
  getUserIdAndToken,
  filterPlaylists
};
