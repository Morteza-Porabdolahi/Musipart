import myFetch from "./intercept-fetch.js";

const API_URL = `https://musipartapi.onrender.com/api`;

export function getUserPlaylists(userId = "", token = "") {
  return myFetch(`${API_URL}/${userId}/playlists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function removePlaylist(userId = "", token = "", playlistId = "") {
  return myFetch(`${API_URL}/${userId}/playlists/${playlistId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function createPlaylist(userId = "", token = "", formData) {
  return myFetch(`${API_URL}/${userId}/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
}

export function getPlaylist(userId = "", token = "", playlistId = "") {
  return myFetch(`${API_URL}/${userId}/playlists/${playlistId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export function addMusic(
  userId = "",
  token = "",
  playlistId = "",
  musicObj = {}
) {
  return myFetch(`${API_URL}/${userId}/playlists/${playlistId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(musicObj),
  });
}

export function removeMusic(
  userId = "",
  token = "",
  playlistId = "",
  musicId = ""
) {
  return myFetch(`${API_URL}/${userId}/playlists/${playlistId}/${musicId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}
