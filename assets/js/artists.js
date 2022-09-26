const loadMoreBtn = document.querySelector('.load-more');

let clickedCount = 0;
let perClick = 4;

loadMoreBtn.addEventListener('click', manipulateData);
window.addEventListener('load',getArtistsData);

async function getArtistsData(){
    const url = 'https://haji-api.ir/music?q=trend';
    const response = await fetch(url);
    const artists = await response.json();
    // create a global varrible called allArtists and put the results in it
    window.allArtists = artists.results;
    
    manipulateData();
}

function manipulateData() {
    clickedCount++;
    const splicedArtists = allArtists.splice((clickedCount*perClick) - perClick,perClick);

    // it must not call the function when the result is bigger than allArtists array length
    if(clickedCount * perClick < allArtists.length){
        createHTMLElementsFromData(splicedArtists);
    }
}


// the wrapper of all artists 
const allArtistsWrapper = document.createElement('div');
allArtistsWrapper.className = 'artists-section';

function createHTMLElementsFromData(splicedArtists) {
    let artistCardTemplate;

    splicedArtists.forEach(artist => {
        artistCardTemplate = `
            <div class="artist-card">
                <div class="artist-card__img-container">
                    <img class="artist-card__img" src="${artist.image.cover.url}"/>
                </div>
                <div class="artist-card__informations">
                    <a href="/pages/artistmusics.html" class="informations__artist-name">${artist.fullName}</a>
                </div>
            </div>`;
        // insert artist cards html inside of the wrapper
        allArtistsWrapper.insertAdjacentHTML('beforeend',artistCardTemplate);
    });
    
    // send the wrapper to appendContainerIntoDom function just 'once'
    if(clickedCount === 1){
        appendContainerIntoDom(allArtistsWrapper);
    }
}

function appendContainerIntoDom(wrapper) {
    // all Artists Container
    const allArtistsContainer = document.querySelector('.artists');
    // append the wrapper inside of the parent Container
    allArtistsContainer.appendChild(wrapper);
    // show the load more button
    loadMoreBtn.style.display = 'block';
}







