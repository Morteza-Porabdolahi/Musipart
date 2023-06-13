// this file is uses the general.js file functions and variables!!
import { showAlert, hideAlert } from "./utils/alert.js";
import { getAllMusics } from "./utils/api.js";
import { hidePreloader } from "./utils/preloader.js";
import { perClick, clickedCount, setClickCount } from "./utils/general.js";

window.addEventListener("load", manipulateData);

/*
 * sorts all music results with downloadCount and returns the sorted result
 * @function sortResultsWithPopularity
 * @param {array} results - all Musics
 */
// function sortResultsWithPopularity(results = []) {
//   // take the results
//   results.forEach((result) => {
//     // if the current result downloadCount contains M then split it and take the first element of countNumber Array
//     const hasM = result.downloadCount.includes('M');
//     const countNumber = +result.downloadCount.split(hasM ? 'M' : 'k')[0];

//     // if the result downloadCount contains M multiply the value with 10^6 or if it contains K then multiply it with 10^4
//     if (hasM) {
//       result.downloadCount = countNumber * 1_000_000;
//     } else {
//       result.downloadCount = countNumber * 10_000;
//     }
//   });

//   // sort the array from the most downloadCount to the least downloadCount
//   return results.sort((a, b) => b.downloadCount - a.downloadCount);
// }

/*
 * manipulate musics on every click on load more button
 * @function manipulateData
 */
async function manipulateData() {
  try {
    const allMusics = await getAllMusics();

    setClickCount(clickedCount + 1);
    // copy the array and splice musics using clickedCount and perClick varriables
    const spliceFlattedMusics = allMusics
      .slice()
      .splice(clickedCount * perClick - perClick, perClick);

    createHTMLElementsFromData(spliceFlattedMusics);
  } catch (err) {
    if (err) {
      console.log(err);
      hidePreloader();

      showAlert("error", "Something went Wrong !");
      setTimeout(hideAlert, 1000);
    }
  }
}

// create a wrapper for Musics
const songsWrapper = document.createElement("div");
songsWrapper.className = "allmusics-section";

/*
 * create HTML Elements (music card) using the spliced musics with manipulateData function
 * @function createHTMLElementsFromData
 * @param {array} splicedMusics - spliced Musics
 */
function createHTMLElementsFromData(splicedMusics = []) {
  let musicCardTemplate;

  splicedMusics.forEach((music) => {
    musicCardTemplate = `
            <div class="music-card">
                <div class="music-card__img-container">
                    <img class="music-card__img" loading="lazy" src="${
                      music.image.cover.url
                    }" />
                    <button class="music-card__play-btn" onclick="playEntireMusic(event,'${
                      music.id
                    }')">
                      <img src="/assets/icons/play-mini-line.svg"/>
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

/*
 * append the musics wrapper into dom
 * @function appendContainerIntoDom
 * @param {HTMLElement} wrapper - the wrapper of Musics
 */
function appendContainerIntoDom(wrapper) {
  const allMusicsContainer = document.querySelector(".allmusics");
  const loadMoreBtn = document.querySelector(".load-more");

  loadMoreBtn.addEventListener("click", manipulateData);
  allMusicsContainer.appendChild(wrapper);
  loadMoreBtn.style.display = "block";

  hidePreloader();
}
