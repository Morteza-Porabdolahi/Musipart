const container = document.querySelector('.artist-musics');
const preloader = document.querySelector('.preloader-container');

window.addEventListener('load',setTitles);

function setTitles() {
    const titleElement = document.querySelector('.artist-name');

    const locationSearch = location.search;
    const artistName = new URLSearchParams(locationSearch).get('q');

    document.title = `Musipart || ${artistName}`;
    titleElement.textContent = artistName;
    
    getDatasAndFilterIt(artistName);
}

async function getDatasAndFilterIt(artistName) {
    const rootUrl = 'https://haji-api.ir/music?q=';
    try{
        const urls = [fetch(`${rootUrl}new`),fetch(`${rootUrl}week`),fetch(`${rootUrl}day`)];
        const getAllMusics = await Promise.all(urls);
        const allMusics = [];

        for(let i = 0 ; i < getAllMusics.length ; i++){
            allMusics.push((await getAllMusics[i].json()).results);
        }

        const newDatas = allMusics.flat();

        const filteredData = newDatas.filter(song => {
            return song.artists.find(artist => artist.fullName === artistName);
        });

        if(filteredData.length > 0){
            createHTMLElementsFromData(filteredData);
        }else{
            container.innerHTML = '<p style="padding : 4rem;font-size : 1.5rem">No Musics Found From Artist...<p>'
        }

        preloader.style.display = 'none';

    }catch(e){

        if(e) preloader.style.display = 'none';
    }
}

function createHTMLElementsFromData(filteredData) {
    let musicCardTemplate;
    const wrapper = document.createElement('div');
    wrapper.className = 'allmusics-section';

    filteredData.forEach(song => {
        musicCardTemplate = `
         <div class="music-card">
                <div class="music-card__img-container">
                  <img class="music-card__img" src="${song.image.cover.url}" />
                  <button class="music-card__play-btn">
                    <i class="ri-play-line"></i>
                  </button>
                </div>
                <div class="music-card__informations">
                  <a href="/pages/singlemusicpage.html" class="informations__music-name">${song.title}</a>  
                  <small class="informations__music-artist">${song.artists.map(artist => artist.fullName)}</small>
                </div>
              </div>`;
        wrapper.insertAdjacentHTML('beforeend',musicCardTemplate);
    });

    appendMusicsIntoDom(wrapper);
}

function appendMusicsIntoDom(wrapper) {

    container.append(wrapper);
}
