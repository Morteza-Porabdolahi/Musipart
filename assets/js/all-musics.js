window.addEventListener("load", getAllMusics);

async function getAllMusics() {
  // Root url
  const url = "https://haji-api.ir/music?q=";
  // get responses Array using Promise.all function
  try {
    const urls = [fetch(`${url}week`), fetch(`${url}new`)];
    const responses = await Promise.all(urls);
    const allMusics = [];

    for (let i = 0; i < responses.length; i++) {
      allMusics.push((await responses[i].json()).results);
    }

    // create a global varriable called allRsults and use flat function to remove the subarrays
    window.allResults = sortResultsWithPopularity(allMusics.flat());

    manipulateData();
  } catch (err) {
    if (err) {
      hidePreloader();

      showAlert("error", "Something went Wrong !");
      setTimeout(hideAlert, 1000);
    }
  }
}

function sortResultsWithPopularity(results = []) {
  // take the results
  results.forEach((result) => {
    // if the current result downloadCount contains M then split it and take the first element of countNumber Array
    let hasM = result.downloadCount.includes("M");
    let countNumber = +result.downloadCount.split(hasM ? "M" : "k")[0];

    // if the result downloadCount contains M multiply the value with 10^6 or if it contains K then multiply it with 10^4
    if (hasM) {
      result.downloadCount = countNumber * 1_000_000;
    } else {
      result.downloadCount = countNumber * 10_000;
    }
  });

  // sort the array from the most downloadCount to the least downloadCount
  return results.sort((a, b) => b.downloadCount - a.downloadCount);
}

function manipulateData() {
  clickedCount++;
  // copy the array and splice musics using clickedCount and perClick varriables
  const spliceFlattedMusics = allResults
    .slice()
    .splice(clickedCount * perClick - perClick, perClick);

  createHTMLElementsFromData(spliceFlattedMusics);
}

// create a wrapper for Musics
const songsWrapper = document.createElement("div");
songsWrapper.className = "allmusics-section";

function createHTMLElementsFromData(splicedMusics) {
  let musicCardTemplate;

  splicedMusics.forEach((music) => {
    musicCardTemplate = `
            <div class="music-card">
                <div class="music-card__img-container">
                    <img class="music-card__img" src="${
                      music.image.cover.url
                    }" />
                    <button class="music-card__play-btn" onclick="playEntireMusic(event,'${
                      music.id
                    }')">
                      <i class="ri-play-line"></i>
                    </button>
                </div>
                <div class="music-card__informations">
                    <a href="/pages/singlemusicpage.html?id=${
                      music.id
                    }" class="informations__music-name">${music.title}</a>  
                    ${music.artists.map(
                      (artist) =>
                        `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`
                    )}
                </div>
            </div>`;

    // insert music cards html inside of the wrapper
    songsWrapper.insertAdjacentHTML("beforeend", musicCardTemplate);
  });

  // send the wrapper to appendContainerIntoDom function just 'once'
  if (clickedCount === 1) {
    appendContainerIntoDom(songsWrapper);
  }
}

function appendContainerIntoDom(wrapper) {
  // all Musics Container
  const allMusicsContainer = document.querySelector(".allmusics");
  // append the wrapper inside of the parent Container
  allMusicsContainer.appendChild(wrapper);
  // show the load more button
  loadMoreBtn.style.display = "block";

  hidePreloader();
}
