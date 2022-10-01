const loadMoreBtn = document.querySelector(".load-more");
const searchInput = document.querySelector(".search-input");

// clicked count on load more button
let clickedCount = 0;
// Items to show on every click on load more button
let perClick = 10;

function handleSearch(e) {
  const filterResults = allResults.filter((result) => {
    if (e.target.value) {
      return result.title.toLowerCase().includes(e.target.value.toLowerCase());
    } else return result;
  });

  songsWrapper.innerHTML = "";

  createHTMLElementsFromData(filterResults);
}

searchInput.addEventListener("input", handleSearch);

loadMoreBtn.addEventListener("click", manipulateData);
