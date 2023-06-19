import { createPlaylist } from "./api/user-api.js";
import { handleUserPlaylists } from "./playlists.js";
import { showAlert } from "./utils/alert.js";
import { _, getUserIdFromParams, getUserToken } from "./utils/general.js";

const modalContainer = _.querySelector(".container__modal");
const playlistCreateForm = _.querySelector(".modal-body__form");

playlistCreateForm.addEventListener("submit", handleFormSubmit);
// using the event bubbling
window.addEventListener("click", handleClickedElements);

/*
 * handles clicks using event bubbling
 * @function handleClickedElements
 * @param {object} e - event Object
 */
function handleClickedElements(e) {
  const clickedElementClass = e.target.classList;

  if (clickedElementClass.contains("close-modal")) {
    hideModal();
  } else if (clickedElementClass.contains("load-more")) {
    showModal();
  } else {
    handleModalClose(e);
  }
}

/*
 * handles modal Close when clicked "outside" of modal
 * @function handleModalClose
 * @param {object} e - event Object
 */
function handleModalClose(e) {
  // get the modal content
  const modal = modalContainer.firstElementChild;

  // if clicked Element does not inside the modal content then hide the Modal
  if (e.target.contains(modal)) {
    hideModal();
  }
}

function showModal() {
  modalContainer.style.display = "block";
}

function hideModal() {
  modalContainer.style.display = "none";
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

    handleCreatePlaylist(formData);
  }
}
