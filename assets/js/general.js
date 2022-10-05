const loadMoreBtn = document.querySelector('.load-more');
const searchInput = document.querySelector('.search-input');

// clicked count on load more button
const clickedCount = 0;
// Items to show on every click on load more button
const perClick = 10;

/*
* handles the user entered input in search input
* @function handleSearch
* @param {object} e - event object
*/
function handleSearch(e) {
  const filterResults = allResults.filter((result) => {
    if (e.target.value) {
      return result.title.toLowerCase().includes(e.target.value.toLowerCase());
    } else return result;
  });

  songsWrapper.innerHTML = '';

  // the function is in muiscs.js file
  createHTMLElementsFromData(filterResults);
}

searchInput.addEventListener('input', handleSearch);

loadMoreBtn.addEventListener('click', manipulateData);
