const searchInput = document.querySelector('.search-input');
const loadMoreBtn = document.querySelector('.load-more');

// clicked count on load more button
let clickedCount = 0;
// Items to show on every click on load more button
let perClick = 10;

function handleSearch(e) {
    const filterResults = allResults.filter(result => {
        if(e.target.value){
            return result.title.toLowerCase().includes(e.target.value.toLowerCase())
        } else
            return result;
        }
    );

    songsWrapper.innerHTML = '';

    createHTMLElementsFromData(filterResults);
}

loadMoreBtn.addEventListener('click', manipulateData);
searchInput.addEventListener('input',handleSearch);
