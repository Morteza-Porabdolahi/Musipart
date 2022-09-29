window.addEventListener('load',  getAllMusics);

async function getAllMusics() {
  // Root url
  const url = 'https://haji-api.ir/music?q=';
  // get responses Array using Promise.all function
  try{
    const urls = [fetch(`${url}day`),fetch(`${url}week`),fetch(`${url}new`)];
    const responses = await Promise.all(urls);
    const allMusics = [];

    for(let i = 0 ; i < responses.length ; i++){
      allMusics.push((await responses[i].json()).results);
    }

    // create a global varriable called allRsults and use flat function to remove the subarrays
    window.allResults = allMusics.flat();
  }catch(err){
    if(err) {
      hidePreloader();

      showAlert('error', 'Something went Wrong !');
      setTimeout(hideAlert, 1000);
    } 
  }

  manipulateData();
};

function manipulateData() {
  clickedCount++;
  // splice musics using clickedCount and perClick varriables
  const spliceFlattedMusics = allResults.splice((clickedCount*perClick) - perClick,perClick);

  if((clickedCount * perClick) < allResults.length){
    createHTMLElementsFromData(spliceFlattedMusics);
  }
}

// create a wrapper for Musics
const songsWrapper = document.createElement('div');
songsWrapper.className = 'allmusics-section';

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
                    <a href="/pages/singlemusicpage.html?id=${music.id}" class="informations__music-name">${music.title}</a>  
                    ${music.artists.map(artist => `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`)}
                </div>
            </div>`;

    // insert music cards html inside of the wrapper
    songsWrapper.insertAdjacentHTML('beforeend',musicCardTemplate);
  });

  // send the wrapper to appendContainerIntoDom function just 'once'
  if(clickedCount === 1){
    appendContainerIntoDom(songsWrapper);
  }
}

function appendContainerIntoDom(wrapper) {
  // all Musics Container
  const allMusicsContainer = document.querySelector('.allmusics');
  // append the wrapper inside of the parent Container
  allMusicsContainer.appendChild(wrapper);
  // show the load more button
  loadMoreBtn.style.display = 'block';

  hidePreloader();
}


