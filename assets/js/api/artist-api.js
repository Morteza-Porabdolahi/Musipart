import myFetch from "./intercept-fetch.js";

const API_URL = `https://musipartapi.iran.liara.run/api/artists`;

export function getArtistMusics(artistName) {
  return myFetch(`${API_URL}/${artistName}/musics`);
}

export function getArtists(artistName = "") {
  return myFetch(`${API_URL}/${artistName}`);
}

export function getTopArtists() {
  return myFetch(`${API_URL}/top`);
}
