const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.header__input');

const documentTitle = document.title;

// make request Url ready for requests
const url = `https://haji-api.ir/music?q=${documentTitle.includes('Daily') ? 'day' : documentTitle.includes('Weekly') ? 'week' : 'new'}`;

let clickedCount = 0;
let perClick = 6;

window.addEventListener('load',getEntierMusics);
loadMoreBtn.addEventListener('click', manipulateData);
searchInput.addEventListener('input',handleSearch);

async function getEntierMusics() {
    const response = await fetch(url);
    const {results} = await response.json();
    // create a global varriable called allResults and put the results in it
    window.allResults = results;

    manipulateData();
}

function manipulateData() {
    clickedCount++;
    const splicedResults = allResults.splice((clickedCount*perClick) - perClick,perClick);

    createHTMLElementsFromData(splicedResults);
}

// create a wrapper for songs
const songsWrapper = document.createElement('div');
songsWrapper.className = 'allmusics-section';

function createHTMLElementsFromData(splicedMusics) {
  let musicCardTemplate;

  splicedMusics.forEach(song => {
    musicCardTemplate = `
        <div class="music-card">
            <div class="music-card__img-container">
                <img class="music-card__img" src="${song.image.cover.url}" />
                <button class="music-card__play-btn" onclick="playEntireMusic(event,'${song.id}')">
                    <i class="ri-play-line"></i>
                </button>
            </div>
            <div class="music-card__informations">
                <a class="informations__music-name" href="/pages/singlemusicpage.html" >${song.title}</a>
                ${song.artists.map(artist => `<a class="informations__music-artist" href="/pages/artistmusics.html">${artist.fullName}</a>`)}
            </div>
        </div>`;

      songsWrapper.insertAdjacentHTML('beforeend',musicCardTemplate);
  });

    // call the appendMusicIntoDom with wrapper arg just 'once'
    if(clickedCount === 1){
        appendMusicsIntoDom(songsWrapper);
    }
}

function appendMusicsIntoDom(wrapper) {
    // songs Container
    const songsContaienr = document.querySelector('.allmusics');
    // append Wrapper into container
    songsContaienr.appendChild(wrapper);
    // show the load more button
    loadMoreBtn.style.display = 'block';
}

function handleSearch(e) {
    const filterResults = allResults.filter(result => {
        if(e.target.value){
            return result.title.toLowerCase().includes(e.target.value.toLowerCase())
        } else
            return result;
        }
    );

    songsWrapper.innerHTML = '';

    createHTMLElementsFromData(filterResults);
}
