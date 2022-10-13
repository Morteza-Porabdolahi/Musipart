const searchInputs = document.querySelectorAll('.search-input');
const helpTag = document.querySelector('.help');
const container = document.querySelector('.allmusics__searched');

// for Debouncing
let timeout;

searchInputs.forEach(input => input.addEventListener('input', handleSearchQuery));

/*
* handles the user entered input
* @function handleSearchQuery
* @param {object} e - event Object
*/
function handleSearchQuery(e) {
  helpTag.style.display = 'none';

  const inputValue = e.target.value;

  if (!e.target.value) {
    helpTag.style.display = 'block';
    helpTag.innerHTML = 'Please Search a Music Name !'

    container.innerHTML = '';
  } else {
    helpTag.style.display = 'none';

    const url = `https://haji-api.ir/music?q=search&t=${inputValue}`;

    clearTimeout(timeout);
    timeout = setTimeout(() => getDatasFromApi(url),800);
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

    if (response.status === 200) {
      const filterSongs = data.results.filter((item) =>
        item.hasOwnProperty('song'),
      );
      
      if(filterSongs.length > 0){
        manipulateHtml(filterSongs);
      }else{
        container.innerHTML = '';

        helpTag.innerHTML = 'No Musics Found !';
        helpTag.style.display = 'block';
      }
    }
  } catch (e) {
    showAlert('error','Something Went Wrong!');

    setTimeout(hideAlert,1000);
  }
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

  if(searchInputs[0].value || searchInputs[1].value){
    container.append(wrapper);
  }
}
