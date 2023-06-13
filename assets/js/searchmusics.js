const { searchMusics } = require("./utils/api");

const searchInput = document.querySelector(".search-input");
const helpTag = document.querySelector(".help");
const container = document.querySelector(".allmusics__searched");

// for Debouncing
let timeout;

searchInput.addEventListener("input", handleSearchQuery);

/*
 * handles the user entered input
 * @function handleSearchQuery
 * @param {object} e - event Object
 */
function handleSearchQuery(e) {
  const inputValue = e.target.value;

  if (!e.target.value) {
    container.innerHTML = "";

    helpTag.innerHTML = "Please Search a Music Name !";
    helpTag.style.display = "block";
  } else {
    clearTimeout(timeout);
    timeout = setTimeout(() => getDatasFromApi(inputValue), 800);
  }
}

/*
 * gets the data from url entered with input
 * @function getDatasFromApi
 * @param {string} url - user entered input as a url
 */
async function getDatasFromApi(query = "") {
  try {
    const searchedSongs = await searchMusics(query);
    const filterSongs = searchedSongs.filter((item) =>
      item.hasOwnProperty("song")
    );

    if (filterSongs.length <= 0) {
      container.innerHTML = "";

      helpTag.innerHTML = "No Musics Found !";
      helpTag.style.display = "block";
    } else {
      manipulateHtml(filterSongs);
    }
  } catch (e) {
    showAlert("error", "Something Went Wrong!");

    setTimeout(hideAlert, 1000);
  }
}

let musicsCard;
let musicsWrapper = document.createElement("div");

musicsWrapper.className = "allmusics-section";
/*
 * gets the data and put it as music card into dom
 * @function manipulateHtml
 * @param {array} data - the data that api has sent to us
 */

function manipulateHtml(songs = []) {
  musicsWrapper = musicsWrapper.cloneNode(true);

  musicsWrapper.innerHTML = "";

  songs.forEach(({ song }) => {
    musicsCard += `
<div class="music-card">
<div class="music-card__img-container">
<img class="music-card__img" src="${song.image.cover.url}" loading="lazy" />
<button class="music-card__play-btn" onclick="playEntireMusic(event,'${
      song.id
    }')">
<img src="/assets/icons/play-mini-line.svg"/>
</button>
</div>
<div class="music-card__informations">
<a href="/pages/singlemusicpage.html?id=${
      song.id
    }" class="informations__music-name">${song.title}</a>  
${song.artists.map(
  (artist) =>
    `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`
)}
</div>
</div>`;
  });

  musicsWrapper.insertAdjacentHTML("beforeend", musicsCard);
  insertInDom(musicsWrapper);
}

/*
 * inserts the created wrapper into dom
 * @function insertInDom
 * @param {HTMLElement} wrapper - the wrapper of musics
 */
function insertInDom(wrapper) {
  container.innerHTML = "";

  container.append(wrapper);
}
