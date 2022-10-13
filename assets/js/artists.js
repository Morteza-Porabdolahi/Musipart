const searchInputs = document.querySelectorAll('.search-input');

window.addEventListener('load', getArtistsData);
searchInputs.forEach(input => input.addEventListener('input', handleSearch));

/*
* get Artits array from api
* @function getArtistsData
*/
async function getArtistsData() {
  try {
    const url = 'https://haji-api.ir/music?q=trend';
    const response = await fetch(url);
    const artists = await response.json();

    // create a global varrible called allArtists and put the results in it
    window.allArtists = artists.results;
  } catch (e) {
    if (e){
      hidePreloader();

      showAlert('error','Something went wrong !');
      setTimeout(hideAlert,1000);
    } 
  }

  createHTMLElementsFromData(allArtists);
}


// the wrapper of all artists
const allArtistsWrapper = document.createElement('div');
allArtistsWrapper.className = 'artists-section';

/*
* create HTML Elements (artist card) using the artists created Array with getArtistsData function
* @function createHTMLElementsFromData
* @param {array} artists - all artists
*/
function createHTMLElementsFromData(artists = []) {
  let artistCardTemplate;

  artists.forEach((artist) => {
    artistCardTemplate = `
            <div class="artist-card">
                <div class="artist-card__img-container">
                    <img loading="lazy" class="artist-card__img" src="${artist.image.cover.url}"/>
                </div>
                <div class="artist-card__informations">
                    <a href="/pages/artistmusics.html?q=${artist.fullName}" class="informations__artist-name">${artist.fullName}</a>
                </div>
            </div>`;
    // insert artist cards html inside of the wrapper
    allArtistsWrapper.insertAdjacentHTML('beforeend', artistCardTemplate);
  });

  appendContainerIntoDom(allArtistsWrapper);
}

/*
* append the artists wrapper into dom
* @function appendContainerIntoDom
* @param {HTMLElement} wrapper - the wrapper of artists
*/
function appendContainerIntoDom(wrapper) {
  // all Artists Container
  const allArtistsContainer = document.querySelector('.artists');
  // append the wrapper inside of the parent Container
  allArtistsContainer.appendChild(wrapper);

  hidePreloader();
}

/*
* handles the user entered input in search input
* @function handleSearch
* @param {object} e - event object
*/
function handleSearch(e) {
  const filterResults = allArtists.filter((artist) => {
    if (e.target.value) {
      return artist.fullName.toLowerCase().includes(e.target.value.toLowerCase());
    } else {
      return artist;
    }
  },
  );

  allArtistsWrapper.innerHTML = '';

  createHTMLElementsFromData(filterResults);
}


