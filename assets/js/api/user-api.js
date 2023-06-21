import myFetch from "./intercept-fetch.js";

const API_URL = `https://nodejs-production-7a06.up.railway.app/api/users`;

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
