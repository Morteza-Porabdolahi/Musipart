import { createPlaylist } from "./api/user-api.js";
import { handleUserPlaylists } from "./playlists.js";
import { showAlert } from "./utils/alert.js";
import {
  _,
  getUserIdFromParams,
  getUserToken,
  showModal,
  hideModal,
} from "./utils/general.js";

const playlistCreateForm = _.querySelector(".modal-body__form");
const playlistCreateBtn = _.querySelector('.add-new-playlist');

playlistCreateBtn.addEventListener('click', showModal)
playlistCreateForm.addEventListener("submit", handleFormSubmit);
playlistCreateForm.querySelector('input[type="file"]').addEventListener('change',handleFileInput);

function handleFileInput(e){
  const inputLabel = e.target.parentElement;
  if(e.target.value){
    inputLabel.style.color = 'rgb(0, 255, 34)';
  }
}

async function handleCreatePlaylist(formData = "") {
  try {
    const userId = getUserIdFromParams();
    const userToken = getUserToken();
    const { message } = await createPlaylist(userId, userToken, formData);

    handleUserPlaylists();
    hideModal();

    showAlert("done", message, 2000);
  } catch (e) {
    showAlert("error", e.message, 2000);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const formElems = form.elements;

  if (formElems.playlistName.value.trim() && formElems.image.value) {
    const formData = new FormData(form);

    formElems.image.value = '';
    handleCreatePlaylist(formData);
  }
}
