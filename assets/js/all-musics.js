const loadMoreBtn = document.querySelector('.load-more');

// clicked count on load more button
let clickedCount = 0;
// Items to show on every click on load more button
let perClick = 10;

loadMoreBtn.addEventListener('click', manipulateData);
window.addEventListener('load',  getAllMusics);

async function getAllMusics() {
    // Root url
    const url = 'https://haji-api.ir';
    const urls = [fetch(`${url}/music?q=day`),fetch(`${url}/music?q=week`),fetch(`${url}/music?q=new`)];
    // get responses Array using Promise.all function
    const responses = await Promise.all(urls);
    const allMusics = [];

    for(let i = 0 ; i < responses.length ; i++){
        allMusics.push((await responses[i].json()).results);
    }

    // create a global varriable called flattedMusics and use flat function to remove the subarrays
    window.flattedMusics = allMusics.flat();

    manipulateData();
};

function manipulateData() {
    clickedCount++;
    // splice musics using clickedCount and perClick varriables
    const spliceFlattedMusics = flattedMusics.splice((clickedCount*perClick) - perClick,perClick);

    if((clickedCount * perClick) < flattedMusics.length){
        createHTMLElementsFromData(spliceFlattedMusics);
    }
}


// create a wrapper for Musics
const allMusicsWrapper = document.createElement('div');
allMusicsWrapper.className = 'allmusics-section';

function createHTMLElementsFromData(splicedMusics) {
    let musicCardTemplate;

    splicedMusics.forEach(music => {
        musicCardTemplate = `
            <div class="music-card">
                <div class="music-card__img-container">
                    <img class="music-card__img" src="${music.image.cover.url}" />
                    <button class="music-card__play-btn" onclick="playEntireMusic(event,'${music.id}')">
                      <i class="ri-play-line"></i>
                    </button>
                </div>
                <div class="music-card__informations">
                    <a href="/pages/singlemusicpage.html" class="informations__music-name">${music.title}</a>  
                    ${music.artists.map(artist => `<a class="informations__music-artist" href="/pages/artistmusics.html">${artist.fullName}</a>`)}
                </div>
            </div>`;

        // insert music cards html inside of the wrapper
        allMusicsWrapper.insertAdjacentHTML('beforeend',musicCardTemplate);
    });
    
    // send the wrapper to appendContainerIntoDom function just 'once'
    if(clickedCount === 1){
        appendContainerIntoDom(allMusicsWrapper);
    }
}

function appendContainerIntoDom(wrapper) {
    // all Musics Container
    const allMusicsContainer = document.querySelector('.allmusics');
    // append the wrapper inside of the parent Container
    allMusicsContainer.appendChild(wrapper);
    // show the load more button
    loadMoreBtn.style.display = 'block';
}

