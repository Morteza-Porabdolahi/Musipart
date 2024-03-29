import myFetch from "./intercept-fetch.js";

// const API_URL = `https://musipartapi.onrender.com/api/users`;
const API_URL = `http://localhost:3000/api/users`;

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
