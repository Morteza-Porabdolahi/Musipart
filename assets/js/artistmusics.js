const container = document.querySelector('.artist-musics');

window.addEventListener('load', setTitles);

/*
* set document title as artist name and gets the artist name in search params
* @function setTitles
*/
function setTitles() {
  // artist name element
  const titleElement = document.querySelector('.artist-name');

  // get Search params
  const locationSearch = location.search;
  // get the "q" param
  const artistName = new URLSearchParams(locationSearch).get('q');

  document.title = `Musipart || ${artistName}`;
  titleElement.textContent = artistName;

  getDatasAndFilterIt(artistName);
}

/*
* get the data from artist name sent by setTitles functions
* @function getDatasAndFilterIt
* @param {string} artistName - artist fullName
*/
async function getDatasAndFilterIt(artistName = '') {
  const rootUrl = 'https://haji-api.ir/music?q=';

  try {
    const urls = [
      fetch(`${rootUrl}new`),
      fetch(`${rootUrl}week`),
      fetch(`${rootUrl}day`),
    ];
    const getAllMusics = await Promise.all(urls);
    const allMusics = [];

    for (let i = 0; i < getAllMusics.length; i++) {
      allMusics.push((await getAllMusics[i].json()).results);
    }

    const newDatas = allMusics.flat();
    const filteredData = newDatas.filter((song) =>
      song.artists.find((artist) => artist.fullName === artistName),
    );

    if (filteredData.length > 0) {
      createHTMLElementsFromData(filteredData);
    } else {
      hidePreloader();

      container.innerHTML =
        '<p class="content__not-found">No Musics Found !</p>';
    }
  } catch (e) {
    if (e) {
      hidePreloader();

      showAlert('error', 'Something went Wrong !');
      setTimeout(hideAlert, 1000);
    }
  }
}

/*
* create HTML Elements (music card and artist card) using the filtered musics with getDatasAndFilterIt function
* @function createHTMLElementsFromData
* @param {array} filteredData - filtered Musics
*/
function createHTMLElementsFromData(filteredData = []) {
  let musicCardTemplate;

  const wrapper = document.createElement('div');
  wrapper.className = 'allmusics-section';

  filteredData.forEach((song) => {
    musicCardTemplate = `
<div class="music-card">
<div class="music-card__img-container">
<img loading="lazy" class="music-card__img" src="${song.image.cover.url}" />
<button class="music-card__play-btn" onclick="playEntireMusic(event,'${song.id}')">
<img src="/assets/icons/play-mini-line.svg"/>
</button>
</div>
<div class="music-card__informations">
<a href="/pages/singlemusicpage.html?id=${
  song.id
}" class="informations__music-name">${song.title}</a>  
<small class="informations__music-artist">${song.artists.map(
      (artist) => artist.fullName,
  )}</small>
</div>
</div>`;
    wrapper.insertAdjacentHTML('beforeend', musicCardTemplate);
  });

  appendMusicsIntoDom(wrapper);
}

/*
* append the musics wrapper into dom
* @function appendMusicsIntoDom
* @param {HTMLElement} wrapper - the wrapper of Musics
*/
function appendMusicsIntoDom(wrapper) {
  container.append(wrapper);

  hidePreloader();
}
