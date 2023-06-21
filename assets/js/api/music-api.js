import myFetch from "./intercept-fetch.js";

const API_URL = `https://nodejs-production-7a06.up.railway.app/api/musics`;

export function getSingleMusic(id) {
  return myFetch(`${API_URL}/${id}`);
}

export function searchMusics(query = "") {
  return myFetch(`${API_URL}/search/${query}`);
}

export function getNewMusics() {
  return myFetch(`${API_URL}/categories/new`);
}

export function getDailyMusics() {
  return myFetch(`${API_URL}/categories/daily`);
}

export function getWeeklyMusics() {
  return myFetch(`${API_URL}/categories/weekly`);
}
