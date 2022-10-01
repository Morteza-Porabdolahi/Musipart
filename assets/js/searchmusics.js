const searchInput = document.querySelector(".search-input");
const helpTag = document.querySelector(".help");
const container = document.querySelector(".allmusics__searched");

searchInput.addEventListener("input", handleSearchQuery);

function handleSearchQuery(e) {
  const inputValue = e.target.value;

  if (!e.target.value) {
    helpTag.style.display = "block";
    container.innerHTML = "";
    return;
  } else {
    helpTag.style.display = "none";

    const url = `https://haji-api.ir/music?q=search&t=${inputValue}`;
    getDatasFromApi(url);
  }
}

async function getDatasFromApi(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    const filterSongs = data.results.filter((item) =>
      item.hasOwnProperty("song")
    );

    if (response.status === 200) {
      manipulateHtml(filterSongs);
    }
  } catch (e) {}
}

let musicsWrapper;
let musicCard;

function manipulateHtml(data = []) {
  musicsWrapper = document.createElement("div");
  musicsWrapper.className = "allmusics-section";

  data.forEach(({ song }) => {
    musicCard = `
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
<a href="/pages/singlemusicpage.html?id=${
      song.id
    }" class="informations__music-name">${song.title}</a>  
${song.artists.map(
  (artist) =>
    `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${artist.fullName}">${artist.fullName}</a>`
)}
</div>
</div>`;

    musicsWrapper.insertAdjacentHTML("beforeend", musicCard);
  });

  insertInDom(musicsWrapper);
}

function insertInDom(wrapper) {
  container.innerHTML = "";

  container.append(wrapper);
}
