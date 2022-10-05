const searchInput = document.querySelector('.search-input');
const helpTag = document.querySelector('.help');
const container = document.querySelector('.allmusics__searched');

searchInput.addEventListener('input', handleSearchQuery);

/*
* handles the user entered input
* @function handleSearchQuery
* @param {object} e - event Object
*/
function handleSearchQuery(e) {
  const inputValue = e.target.value;

  if (!e.target.value) {
    helpTag.style.display = 'block';
    container.innerHTML = '';
    return;
  } else {
    helpTag.style.display = 'none';

    const url = `https://haji-api.ir/music?q=search&t=${inputValue}`;
    getDatasFromApi(url);
  }
}

/*
* gets the data from url entered with input
* @function getDatasFromApi
* @param {string} url - user entered input as a url
*/
async function getDatasFromApi(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const filterSongs = data.results.filter((item) =>
      item.hasOwnProperty('song'),
    );

    if (response.status === 200) {
      manipulateHtml(filterSongs);
    }
  } catch (e) {}
}

let musicsWrapper;
let musicCard;

/*
* gets the data and put it as music card into dom
* @function manipulateHtml
* @param {array} data - the data that api has sent to us
*/
function manipulateHtml(data = []) {
  musicsWrapper = document.createElement('div');
  musicsWrapper.className = 'allmusics-section';

  data.forEach(({song}) => {
    musicCard = `
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
        `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`,
  )}
</div>
</div>`;

    musicsWrapper.insertAdjacentHTML('beforeend', musicCard);
  });

  insertInDom(musicsWrapper);
}

/*
* inserts the created wrapper into dom
* @function insertInDom
* @param {HTMLElement} wrapper - the wrapper of musics
*/
function insertInDom(wrapper) {
  container.innerHTML = '';

  container.append(wrapper);
}
