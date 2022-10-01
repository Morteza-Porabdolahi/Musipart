window.addEventListener("load", getEntierMusics);

async function getEntierMusics() {
  const documentTitle = document.title;
  // make request Url ready for requests
  const url = `https://haji-api.ir/music?q=${
    documentTitle.includes("Daily")
      ? "day"
      : documentTitle.includes("Weekly")
      ? "week"
      : "new"
  }`;

  try {
    const response = await fetch(url);
    const { results } = await response.json();

    // create a global varriable called allResults and put the results in it
    window.allResults = results;
  } catch (e) {
    if (e) {
      hidePreloader();

      showAlert("error", "Something went Wrong !");
      setTimeout(hideAlert, 1000);
    }
  }

  manipulateData();
}

function manipulateData() {
  clickedCount++;
  const splicedResults = allResults.splice(
    clickedCount * perClick - perClick,
    perClick
  );

  createHTMLElementsFromData(splicedResults);
}

// create a wrapper for songs
const songsWrapper = document.createElement("div");
songsWrapper.className = "allmusics-section";

function createHTMLElementsFromData(splicedMusics) {
  let musicCardTemplate;

  splicedMusics.forEach((song) => {
    musicCardTemplate = `
<div class="music-card">
<div class="music-card__img-container">
<img class="music-card__img" src="${song.image.cover.url}" />
<button class="music-card__play-btn" onclick="playEntireMusic(event,'${
      song.id
    }')">
<i class="ri-play-line"></i>
</button>
</div>
<div class="music-card__informations">
<a class="informations__music-name" href="/pages/singlemusicpage.html?id=${
      song.id
    }" >${song.title}</a>
${song.artists.map(
  (artist) =>
    `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`
)}
</div>
</div>`;

    songsWrapper.insertAdjacentHTML("beforeend", musicCardTemplate);
  });

  // call the appendMusicIntoDom with wrapper arg just 'once'
  if (clickedCount === 1) {
    appendMusicsIntoDom(songsWrapper);
  }
}

function appendMusicsIntoDom(wrapper) {
  // songs Container
  const songsContaienr = document.querySelector(".allmusics");
  // append Wrapper into container
  songsContaienr.appendChild(wrapper);
  // show the load more button
  loadMoreBtn.style.display = "block";

  hidePreloader();
}
