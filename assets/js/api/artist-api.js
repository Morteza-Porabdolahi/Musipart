import myFetch from "./intercept-fetch.js";

const API_URL = `https://nodejs-production-7a06.up.railway.app/api/artists`;

export function getArtistMusics(artistName) {
  return myFetch(`${API_URL}/${artistName}/musics`);
}

export function getArtists(artistName = "") {
  return myFetch(`${API_URL}/${artistName}`);
}

export function getTopArtists() {
  return myFetch(`${API_URL}/top`);
}
