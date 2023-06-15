import myFetch from './interceptFetch.js';

const API_URL = `http://localhost:3000/api`;

export function getSingleMusic(id) {
  return myFetch(`${API_URL}/music/${id}`);
}

export function getArtistMusics(artistName) {
  return myFetch(`${API_URL}/artistMusics/${artistName}`);
}

export function getArtists(artistName = "") {
  return myFetch(`${API_URL}/artists/${artistName}`);
}

export function searchMusics(query = "") {
  return myFetch(`${API_URL}/musics/${query}`);
}

export function getNewMusics() {
  return myFetch(`${API_URL}/musics/newMusics`);
}

export function getDailyMusics() {
  return myFetch(`${API_URL}/musics/dailyMusics`);
}

export function getWeeklyMusics() {
  return myFetch(`${API_URL}/musics/weeklyMusics`);
}

export function getTopArtists() {
  return myFetch(`${API_URL}/artists/topArtists`);
}


