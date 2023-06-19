import myFetch from "./intercept-fetch.js";

const API_URL = `http://localhost:4000/api/users`;

export function registerUser(userData = {}) {
  return myFetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

export function loginUser(userData = {}) {
  return myFetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

export function getUserPlaylists(userId = "", token = "") {
  return myFetch(`${API_URL}/${userId}/playlists`, {
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
