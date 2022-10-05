window.addEventListener('load', getAllSongs);

/*
* get all songs array from api
* @function getAllSongs
*/
async function getAllSongs() {
  // take datas and put them into an object named dataObj
  try {
    const datasObj = {
      // the innermost await(keyword) is for fetching the response and the outermost await(keyword) is for json() function
      newMusics: (await (await fetch('https://haji-api.ir/music?q=new')).json())
          .results,
      topArtists: (
        await (await fetch('https://haji-api.ir/music?q=trend')).json()
      ).results,
      dailyMusics: (
        await (await fetch('https://haji-api.ir/music?q=day')).json()
      ).results,
      weeklyMusics: (
        await (await fetch('https://haji-api.ir/music?q=week')).json()
      ).results,
    };

    manipulateDatas(datasObj);
  } catch (e) {
    if (e) {
      hidePreloader();

      showAlert('error', 'Something went Wrong !');
      setTimeout(hideAlert, 1000);
    }
  }
}

/*
* gets the 6 elements of every array inside datas object with the help of makeStartAndEndIndex function
* @function manipulateData
* @param {object} datas - the object of datas
*/
function manipulateDatas(datas = {}) {
  const newDatas = {};

  // take 6 elemenets of every array and put them into newDatas Obj
  for (const key in datas) {
    newDatas[key] = datas[key].splice(...makeStartAndEndIndex(datas[key], 6));
  }

  createHtmlElementsFromDatas(newDatas);
}

/*
* get 6 elements of every results array with a shit logic
* @function makeStartAndEndIndex
* @param {array} results - musics or artists Datas
* @param {number} - number of elements that you wanna get
*/
function makeStartAndEndIndex(results = [], elemNum) {
  const randomIndex = Math.floor(Math.random() * results.length);

  if (results.length - randomIndex < elemNum) {
    return [randomIndex - elemNum < 0 ? 0 : randomIndex - elemNum, elemNum];
  } else {
    return [randomIndex, elemNum];
  }
}

/*
* create HTML Elements (music card and artist card) using the all musics created Array with manipulateDatas function
* @function createHTMLElementsFromData
* @param {object} newDatas - filtered Datas
*/
function createHtmlElementsFromDatas(newDatas = {}) {
  let dataArr;
  let currentData;

  let wrapper;
  let htmlCard;

  for (const key in newDatas) {
    // make invidual Container for every data Array
    wrapper = document.createElement('div');
    wrapper.className = 'section__content';

    // save the data Arrays in variable called dataArr
    dataArr = newDatas[key];

    if (dataArr.length <= 0) {
      wrapper.style.justifyContent = 'center';
      wrapper.innerHTML = '<p class="content__not-found">No Musics Found !</p>';
    } else {
      // Loop on dataArr
      for (let i = 0; i < dataArr.length; i++) {
        currentData = dataArr[i];
        // the artist cards have diffrent styles from music cards , then a condition is necessary
        if (key == 'topArtists') {
          htmlCard = `
<div class="artist-card">
<div class="artist-card__img-container">
<img loading="lazy" class="artist-card__img" src="${currentData.image.cover.url}"/>
</div>
<div class="artist-card__informations">
<a href="/pages/artistmusics.html?q=${currentData.fullName}" class="informations__artist-name">${currentData.fullName}</a>
</div>
</div>`;
          // put the cards in their special wrapper
          wrapper.insertAdjacentHTML('beforeend', htmlCard);
        } else {
          htmlCard = `
<div class="music-card">
<div class="music-card__img-container">
<img loading="lazy" class="music-card__img" src="${currentData.image.cover.url}" />
<button onclick="playEntireMusic(event,'${
  currentData.id
}')" class="music-card__play-btn">
<img src="/assets/icons/play-mini-line.svg"/>
</button>
</div>
<div class="music-card__informations">
<a class="informations__music-name" href="/pages/singlemusicpage.html?id=${
  currentData.id
}">${currentData.title}</a>
${currentData.artists.map(
      (artist) =>
        `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`,
  )}
</div>
</div>`;
          // put the cards in their special wrapper
          wrapper.insertAdjacentHTML('beforeend', htmlCard);
        }
      }
    }

    // call insertToDom with key and container(wrapper) args
    insertInDom(key, wrapper);
  }
}

/*
* append the muiscs wrapper into dom
* @function insertInDom
* @param {string} containerClass - the container class name
* @param {HTMLElement} toInsert - the wrapper of musics or artists
*/
function insertInDom(containerClass, toInsert) {
  // note : the object key names is equal to container classes
  const container = document.querySelector(`.${containerClass}`);
  // append the wrapper in container
  container.appendChild(toInsert);

  hidePreloader();
}
