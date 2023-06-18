(function () {
  const token = localStorage.getItem("token");

  if (token) {
    import("jwt-decode").then(({ default: decode }) => {
      const decodedToken = decode(token);

      if(Date.now() < decodedToken.exp * 1000){
        changeUserAppearance(decodedToken);
      }else{
        localStorage.removeItem('token');
      }
    });
  }
})();

const _ = document;

function changeUserAppearance(decodedToken = {}) {
  const { username } = decodedToken.user;
  const signInLink = _.querySelector(".options__signin");
  const playListsLink = _.querySelector('.navbar__item:last-child > a');


  playListsLink.href = '/pages/playlists.html';
  playListsLink.title= 'Your Playlists';
  playListsLink.style.cursor = 'pointer';

  signInLink.textContent = username;
  signInLink.href = "/pages/account-panel.html";
  signInLink.title = "Your Account";
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
            <a class="informations__music-name" href="/pages/singlemusicpage.html?id=${
              song.id
            }">${song.title}</a> 
            ${song.artists.map(
              (artist) =>
                `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`
            )} 
        </div> 
    </div>`;
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

export {
  _,
  createHtmlFromSong,
  createHtmlFromArtist,
  showHelpTag,
  hideHelpTag,
  showLoadMoreBtn,
  hideLoadMoreBtn,
  debounce,
};
