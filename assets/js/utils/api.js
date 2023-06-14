const API_URL = `https://musipart.vercel.app/api`;

async function myFetch(...args) {
  const [url, options] = args;

  const response = await fetch(url, {
    ...options,
  });

  if (response.status >= 200 && response.status <= 299 && response.ok) {
    return response.json();
  } else {
    throw Error(`An error occurred with status ${response.status}`);
  }
}

function getSingleMusic(id) {
  return myFetch(`${API_URL}/music/${id}`);
}

function getArtistMusics(artistName) {
  return myFetch(`${API_URL}/artistMusics/${artistName}`);
}

function getArtists(artistName = "") {
  return myFetch(`${API_URL}/artists/${artistName}`);
}

function searchMusics(query = "") {
  return myFetch(`${API_URL}/musics/${query}`);
}

function getNewMusics() {
  return myFetch(`${API_URL}/musics/newMusics`);
}

function getDailyMusics() {
  return myFetch(`${API_URL}/musics/dailyMusics`);
}

function getWeeklyMusics() {
  return myFetch(`${API_URL}/musics/weeklyMusics`);
}

function getTopArtists() {
  return myFetch(`${API_URL}/artists/topArtists`);
}

export {
  myFetch,
  getTopArtists,
  getSingleMusic,
  getArtistMusics,
  getArtists,
  searchMusics,
  getNewMusics,
  getDailyMusics,
  getWeeklyMusics,
};
