// clicked count on load more button
let clickedCount = 0;

function setClickCount(count) {
  clickedCount = count;
}

function paginateDatas(datas = [], perClick) {
  setClickCount(clickedCount + 1);
  return datas.slice().splice(clickedCount * perClick - perClick, perClick);
}

export { paginateDatas, clickedCount };
