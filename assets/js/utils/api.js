const API_URL = `http://localhost:3000`;

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

function getAllMusics() {
  return myFetch(`${API_URL}/api/musics`);
}

function getSingleMusic(id) {
  return myFetch(`${API_URL}/api/music/${id}`);
}

export { myFetch, API_URL,getAllMusics,getSingleMusic };
