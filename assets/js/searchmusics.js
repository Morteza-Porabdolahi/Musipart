const searchInputs = document.querySelectorAll(".search-input"),
  helpTag = document.querySelector(".help"),
  container = document.querySelector(".allmusics__searched");
let timeout, musicsWrapper, musicCard;
function handleSearchQuery(e) {
  helpTag.style.display = "none";
  const a = e.target.value;
  if (e.target.value) {
    helpTag.style.display = "none";
    const e = `https://haji-api.ir/music?q=search&t=${a}`;
    clearTimeout(timeout),
      (timeout = setTimeout(() => getDatasFromApi(e), 800));
  } else
    (helpTag.style.display = "block"),
      (helpTag.innerHTML = "Please Search a Music Name !"),
      (container.innerHTML = "");
}
async function getDatasFromApi(e) {
  try {
    const a = await fetch(e),
      s = await a.json();
    if (200 === a.status) {
      const e = s.results.filter((e) => e.hasOwnProperty("song"));
      e.length > 0
        ? manipulateHtml(e)
        : ((container.innerHTML = ""),
          (helpTag.innerHTML = "No Musics Found !"),
          (helpTag.style.display = "block"));
    }
  } catch (e) {
    showAlert("error", "Something Went Wrong!"), setTimeout(hideAlert, 1e3);
  }
}
function manipulateHtml(e = []) {
  (musicsWrapper = document.createElement("div")),
    (musicsWrapper.className = "allmusics-section"),
    e.forEach(({ song: e }) => {
      (musicCard = `\n<div class="music-card">\n<div class="music-card__img-container">\n<img class="music-card__img" src="${
        e.image.cover.url
      }" loading="lazy" />\n<button class="music-card__play-btn" onclick="playEntireMusic(event,'${
        e.id
      }')">\n<img src="/assets/icons/play-mini-line.svg"/>\n</button>\n</div>\n<div class="music-card__informations">\n<a href="/pages/singlemusicpage.html?id=${
        e.id
      }" class="informations__music-name">${e.title}</a>  \n${e.artists.map(
        (e) =>
          `<a class="informations__music-artist" href="/pages/artistmusics.html?q=${e.fullName}">${e.fullName}</a>`
      )}\n</div>\n</div>`),
        musicsWrapper.insertAdjacentHTML("beforeend", musicCard);
    }),
    insertInDom(musicsWrapper);
}
function insertInDom(e) {
  (container.innerHTML = ""), (searchInputs[0].value || searchInputs[1].value) && container.append(e);
}
searchInputs.forEach((e) => e.addEventListener("input", handleSearchQuery));
